/**
 * Utility functions for Rajasthan Virtual Shiksha PWA
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} locale - Locale string (default: 'en-IN')
 * @return {string} - Formatted date string
 */
function formatDate(date, locale = 'en-IN') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time to readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} locale - Locale string (default: 'en-IN')
 * @return {string} - Formatted time string
 */
function formatTime(date, locale = 'en-IN') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format file size to human-readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @return {string} - Formatted size string (e.g., "1.5 MB")
 */
function formatFileSize(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if device has low bandwidth
 * @return {Promise<boolean>} - True if bandwidth is low
 */
async function hasLowBandwidth() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.saveData) {
            return true; // Save data mode is enabled
        }
        
        if (connection.effectiveType) {
            return ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
        }
    }
    
    // Fallback: measure download speed
    try {
        const startTime = Date.now();
        const response = await fetch('/assets/images/test-image.jpg', { cache: 'no-store' });
        const blob = await response.blob();
        const endTime = Date.now();
        
        const durationInSeconds = (endTime - startTime) / 1000;
        const fileSizeInBits = blob.size * 8;
        const speedInKbps = fileSizeInBits / durationInSeconds / 1024;
        
        return speedInKbps < 700; // Consider under 700 Kbps as low bandwidth
    } catch (error) {
        console.error('Error measuring bandwidth:', error);
        return false;
    }
}

/**
 * Create a toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 5000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            break;
        case 'error':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        case 'warning':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
            break;
        default:
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Close notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close button event
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, duration);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);
}

/**
 * Generate a unique ID
 * @return {string} - Unique ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Lazy load images
 * Uses Intersection Observer API to load images only when they come into view
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img.lazy');
        
        function lazyLoad() {
            lazyImages.forEach(img => {
                if (isInViewport(img)) {
                    img.src = img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.remove('lazy');
                }
            });
        }
        
        // Initial load
        lazyLoad();
        
        // Add event listeners
        window.addEventListener('scroll', debounce(lazyLoad));
        window.addEventListener('resize', debounce(lazyLoad));
    }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @return {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

