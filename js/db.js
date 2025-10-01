/**
 * IndexedDB Database Module for Rajasthan Virtual Shiksha PWA
 * Handles offline data storage and synchronization
 */

// Database version
const DB_VERSION = 1;
const DB_NAME = 'RajasthanVirtualShiksha';

// Object stores (tables)
const STORES = {
    STUDENT_DATA: 'studentData',
    CLASSES: 'classes',
    ASSIGNMENTS: 'assignments',
    QUIZZES: 'quizzes',
    DOWNLOADS: 'downloads',
    SYNC_QUEUE: 'syncQueue'
};

/**
 * Open the database connection
 * @returns {Promise<IDBDatabase>} Database connection
 */
function openDatabase() {
    return new Promise((resolve, reject) => {
        // Check if IndexedDB is supported
        if (!window.indexedDB) {
            reject(new Error('Your browser does not support IndexedDB'));
            return;
        }
        
        // Open database connection
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        // Handle database upgrade (called when DB is created or version changes)
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores if they don't exist
            if (!db.objectStoreNames.contains(STORES.STUDENT_DATA)) {
                db.createObjectStore(STORES.STUDENT_DATA, { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains(STORES.CLASSES)) {
                db.createObjectStore(STORES.CLASSES, { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains(STORES.ASSIGNMENTS)) {
                db.createObjectStore(STORES.ASSIGNMENTS, { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains(STORES.QUIZZES)) {
                db.createObjectStore(STORES.QUIZZES, { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains(STORES.DOWNLOADS)) {
                db.createObjectStore(STORES.DOWNLOADS, { keyPath: 'id' });
                
                // Create index for filename
                const downloadStore = event.target.transaction.objectStore(STORES.DOWNLOADS);
                downloadStore.createIndex('filename', 'filename', { unique: false });
            }
            
            if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
                const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                
                // Create index for sync type
                syncStore.createIndex('syncType', 'syncType', { unique: false });
                syncStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            console.log('Database setup complete');
        };
        
        // Handle success
        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
        
        // Handle error
        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Save data to a specific object store
 * @param {string} storeName - Name of the object store
 * @param {Object} data - Data to save
 * @returns {Promise<any>} Result of the operation
 */
async function saveToStore(storeName, data) {
    try {
        const db = await openDatabase();
    return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            // Add or update data
            const request = store.put(data);
            
            request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                
            request.onerror = (event) => {
                    reject(event.target.error);
                };
            
            // Close the transaction
            tx.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Error saving to ${storeName}:`, error);
        throw error;
    }
}

/**
 * Get data from a specific object store by ID
 * @param {string} storeName - Name of the object store
 * @param {string|number} id - ID of the record to get
 * @returns {Promise<any>} The requested data
 */
async function getFromStore(storeName, id) {
    try {
        const db = await openDatabase();
    return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            
            // Get data by ID
                const request = store.get(id);
                
            request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                
            request.onerror = (event) => {
                    reject(event.target.error);
                };
            
            // Close the transaction
            tx.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Error getting from ${storeName}:`, error);
        throw error;
    }
}

/**
 * Get all data from a specific object store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<Array>} All data from the store
 */
async function getAllFromStore(storeName) {
    try {
        const db = await openDatabase();
    return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            
            // Get all data
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                        reject(event.target.error);
            };
            
            // Close the transaction
            tx.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Error getting all from ${storeName}:`, error);
        throw error;
    }
}

/**
 * Delete data from a specific object store by ID
 * @param {string} storeName - Name of the object store
 * @param {string|number} id - ID of the record to delete
 * @returns {Promise<void>}
 */
async function deleteFromStore(storeName, id) {
    try {
        const db = await openDatabase();
    return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            // Delete data by ID
                const request = store.delete(id);
                
                request.onsuccess = () => {
                    resolve();
                };
                
            request.onerror = (event) => {
                    reject(event.target.error);
                };
            
            // Close the transaction
            tx.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Error deleting from ${storeName}:`, error);
        throw error;
    }
}

/**
 * Clear all data from a specific object store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<void>}
 */
async function clearStore(storeName) {
    try {
        const db = await openDatabase();
    return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            // Clear all data
            const request = store.clear();
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = (event) => {
                    reject(event.target.error);
                };
            
            // Close the transaction
            tx.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Error clearing ${storeName}:`, error);
        throw error;
    }
}

/**
 * Add an item to the sync queue for later synchronization
 * @param {string} syncType - Type of sync operation (e.g., 'quiz', 'assignment')
 * @param {Object} data - Data to be synchronized
 * @returns {Promise<number>} ID of the queued item
 */
async function addToSyncQueue(syncType, data) {
    try {
        const syncItem = {
            syncType,
            data,
            timestamp: Date.now(),
            attempts: 0
        };
        
        return await saveToStore(STORES.SYNC_QUEUE, syncItem);
    } catch (error) {
        console.error('Error adding to sync queue:', error);
        throw error;
    }
}

/**
 * Process the sync queue when online
 * @returns {Promise<void>}
 */
async function processSyncQueue() {
    if (!navigator.onLine) {
        console.log('Cannot process sync queue while offline');
        return;
    }
    
    try {
        const syncItems = await getAllFromStore(STORES.SYNC_QUEUE);
        
        if (syncItems.length === 0) {
            console.log('Sync queue is empty');
                    return;
        }
        
        console.log(`Processing ${syncItems.length} items in sync queue`);
        
        // Sort by timestamp (oldest first)
        syncItems.sort((a, b) => a.timestamp - b.timestamp);
        
        for (const item of syncItems) {
            try {
                // Increment attempt counter
                item.attempts += 1;
                await saveToStore(STORES.SYNC_QUEUE, item);
                
                // Process based on sync type
                switch (item.syncType) {
                    case 'quiz':
                        await syncQuizData(item.data);
                        break;
                    case 'assignment':
                        await syncAssignmentData(item.data);
                        break;
                    case 'forum':
                        await syncForumData(item.data);
                        break;
                    default:
                        console.warn(`Unknown sync type: ${item.syncType}`);
                }
                
                // If successful, remove from queue
                await deleteFromStore(STORES.SYNC_QUEUE, item.id);
                console.log(`Successfully synced item ${item.id}`);
                
            } catch (error) {
                console.error(`Error processing sync item ${item.id}:`, error);
                
                // If too many attempts, remove from queue
                if (item.attempts >= 5) {
                    await deleteFromStore(STORES.SYNC_QUEUE, item.id);
                    console.warn(`Removed item ${item.id} from sync queue after 5 failed attempts`);
                }
            }
        }
    } catch (error) {
        console.error('Error processing sync queue:', error);
        throw error;
    }
}

/**
 * Sync quiz data with the server
 * @param {Object} data - Quiz data to sync
 * @returns {Promise<void>}
 */
async function syncQuizData(data) {
    // In a real app, this would make an API call
    console.log('Syncing quiz data:', data);
    
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Quiz data synced successfully');
                    resolve();
        }, 500);
    });
}

/**
 * Sync assignment data with the server
 * @param {Object} data - Assignment data to sync
 * @returns {Promise<void>}
 */
async function syncAssignmentData(data) {
    // In a real app, this would make an API call
    console.log('Syncing assignment data:', data);
    
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Assignment data synced successfully');
            resolve();
        }, 500);
    });
}

/**
 * Sync forum data with the server
 * @param {Object} data - Forum data to sync
 * @returns {Promise<void>}
 */
async function syncForumData(data) {
    // In a real app, this would make an API call
    console.log('Syncing forum data:', data);
    
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Forum data synced successfully');
            resolve();
        }, 500);
    });
}

/**
 * Initialize sync listeners
 */
function initSyncListeners() {
    // Listen for online events to process sync queue
    window.addEventListener('online', () => {
        console.log('Device is online. Processing sync queue...');
        processSyncQueue();
    });
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Register for background sync
            registration.sync.register('sync-data')
                .then(() => {
                    console.log('Background sync registered');
                })
                .catch(err => {
                    console.error('Background sync registration failed:', err);
                });
        });
    }
}

// Initialize sync listeners when the script loads
initSyncListeners();

// Export functions for use in other modules
window.openDatabase = openDatabase;
window.saveToStore = saveToStore;
window.getFromStore = getFromStore;
window.getAllFromStore = getAllFromStore;
window.deleteFromStore = deleteFromStore;
window.clearStore = clearStore;
window.addToSyncQueue = addToSyncQueue;
window.processSyncQueue = processSyncQueue;
window.DB_STORES = STORES;