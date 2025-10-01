/**
 * Service Worker for Rajasthan Virtual Shiksha PWA
 * Provides offline functionality and caching
 */

// Cache version
const CACHE_VERSION = 'v1.0.0';

// Cache names
const STATIC_CACHE_NAME = `rvs-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `rvs-dynamic-${CACHE_VERSION}`;
const MEDIA_CACHE_NAME = `rvs-media-${CACHE_VERSION}`;

// Resources to cache immediately (App Shell)
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/css/responsive.css',
    '/css/themes.css',
    '/js/app.js',
    '/js/utils.js',
    '/js/offline.js',
    '/assets/images/rajasthan-logo.png',
    '/assets/images/india-emblem.png',
    '/assets/images/icons/icon-72x72.png',
    '/assets/images/icons/icon-96x96.png',
    '/assets/images/icons/icon-128x128.png',
    '/assets/images/icons/icon-144x144.png',
    '/assets/images/icons/icon-152x152.png',
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-384x384.png',
    '/assets/images/icons/icon-512x512.png',
    '/pages/offline.html'
];

// Maximum cache size (in bytes) - 100MB
const MAX_CACHE_SIZE = 100 * 1024 * 1024;

// Install event - Cache the App Shell
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching App Shell');
                return cache.addAll(APP_SHELL);
            })
            .then(() => {
                console.log('[Service Worker] App Shell Cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker');
    
    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME && key !== MEDIA_CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle API requests (network first, then cache)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(event.request));
        return;
    }
    
    // Handle media content (cache on demand)
    if (isMediaRequest(event.request)) {
        event.respondWith(cacheOnDemandStrategy(event.request));
        return;
    }
    
    // Default: Cache first, then network
    event.respondWith(cacheFirstStrategy(event.request));
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Not in cache, get from network
        const networkResponse = await fetch(request);
        
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
        }
        
        // Clone the response (because it's a stream that can only be consumed once)
        const responseToCache = networkResponse.clone();
        
        // Add to dynamic cache
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        cache.put(request, responseToCache);
        
        // Manage cache size
        await trimCache(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
        
        return networkResponse;
    } catch (error) {
        // If both cache and network fail, show offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/pages/offline.html');
        }
        
        console.error('[Service Worker] Fetch failed:', error);
        throw error;
    }
}

// Network-first strategy for API responses
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200) {
            throw new Error('Network response not valid');
        }
        
        // Clone the response
        const responseToCache = networkResponse.clone();
        
        // Add to dynamic cache with expiration (24 hours)
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        
        // Add metadata for expiration
        const metadata = {
            url: request.url,
            timestamp: Date.now()
        };
        
        // Store both the response and metadata
        await Promise.all([
            cache.put(request, responseToCache),
            storeMetadata(request.url, metadata)
        ]);
        
        return networkResponse;
    } catch (error) {
        console.log('[Service Worker] Network request failed, getting from cache');
        
        // Try to get from cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            // Check if cached response is expired (24 hours)
            const metadata = await getMetadata(request.url);
            
            if (metadata && Date.now() - metadata.timestamp > 24 * 60 * 60 * 1000) {
                console.log('[Service Worker] Cached response expired');
                return caches.match('/pages/offline.html');
            }
            
            return cachedResponse;
        }
        
        // If not in cache, show offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/pages/offline.html');
        }
        
        throw error;
    }
}

// Cache on demand strategy for media content
async function cacheOnDemandStrategy(request) {
    try {
        // First check if it's in the cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Not in cache, get from network
        const networkResponse = await fetch(request);
        
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
        }
        
        // For media content, we don't automatically cache
        // It will be cached when user explicitly downloads it
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Media fetch failed:', error);
        
        // For media requests, we might want to show a placeholder
        if (request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return caches.match('/assets/images/placeholder-image.png');
        }
        
        if (request.url.match(/\.(mp4|webm)$/)) {
            return caches.match('/assets/images/video-placeholder.png');
        }
        
        throw error;
    }
}

// Helper function to check if request is for media content
function isMediaRequest(request) {
    return request.url.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|wav)$/i) !== null;
}

// Helper function to trim cache when it gets too large
async function trimCache(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length <= 20) {
        return; // Don't trim if we have few items
    }
    
    // Get cache size
    let cacheSize = 0;
    const keysWithSize = [];
    
    for (const request of keys) {
        const response = await cache.match(request);
        const blob = await response.blob();
        const size = blob.size;
        
        cacheSize += size;
        keysWithSize.push({ request, size, timestamp: Date.now() }); // In real app, get actual timestamp
    }
    
    // Sort by timestamp (oldest first)
    keysWithSize.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest items until we're under the limit
    while (cacheSize > maxSize && keysWithSize.length > 0) {
        const oldest = keysWithSize.shift();
        await cache.delete(oldest.request);
        cacheSize -= oldest.size;
        console.log('[Service Worker] Removed from cache:', oldest.request.url);
    }
}

// Store metadata in IndexedDB
async function storeMetadata(url, metadata) {
    // In a real app, this would use IndexedDB
    // For simplicity, we're using localStorage in this example
    try {
        const metadataCache = JSON.parse(localStorage.getItem('sw-metadata-cache') || '{}');
        metadataCache[url] = metadata;
        localStorage.setItem('sw-metadata-cache', JSON.stringify(metadataCache));
    } catch (error) {
        console.error('[Service Worker] Failed to store metadata:', error);
    }
}

// Get metadata from IndexedDB
async function getMetadata(url) {
    // In a real app, this would use IndexedDB
    try {
        const metadataCache = JSON.parse(localStorage.getItem('sw-metadata-cache') || '{}');
        return metadataCache[url];
    } catch (error) {
        console.error('[Service Worker] Failed to get metadata:', error);
        return null;
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('[Service Worker] Background Sync', event.tag);
    
    if (event.tag === 'sync-quiz-answers') {
        event.waitUntil(syncQuizAnswers());
    }
    
    if (event.tag === 'sync-forum-posts') {
        event.waitUntil(syncForumPosts());
    }
});

// Push notifications
self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received');
    
    let data = { title: 'New Notification', body: 'Something new happened!' };
    
    if (event.data) {
        data = JSON.parse(event.data.text());
    }
    
    const options = {
        body: data.body,
        icon: '/assets/images/icons/icon-192x192.png',
        badge: '/assets/images/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// Placeholder functions for background sync
async function syncQuizAnswers() {
    // This would be implemented with IndexedDB in a real app
    console.log('[Service Worker] Syncing quiz answers');
}

async function syncForumPosts() {
    // This would be implemented with IndexedDB in a real app
    console.log('[Service Worker] Syncing forum posts');
}


