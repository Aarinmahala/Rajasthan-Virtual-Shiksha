/**
 * Downloads page JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initNavMenu();
    initFilterButtons();
    initSearchFunctionality();
    initDownloadActions();
    
    // Load downloads from IndexedDB
    loadDownloads();
    
    // Update storage usage
    updateStorageUsage();
});

/**
 * Initialize navigation menu based on user role
 */
function initNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    
    // Check if user is logged in and get role
    const userRole = getUserRole();
    
    let menuHTML = '';
    
    if (userRole === 'student') {
        menuHTML = `
            <li>
                <a href="student-dashboard.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="live-class.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span>Live Classes</span>
                </a>
            </li>
            <li>
                <a href="recorded-classes.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span>Recorded Classes</span>
                </a>
            </li>
            <li>
                <a href="assignments.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Assignments</span>
                </a>
            </li>
            <li>
                <a href="quizzes.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span>Quizzes</span>
                </a>
            </li>
            <li>
                <a href="discussion.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Discussion Forum</span>
                </a>
            </li>
            <li class="active">
                <a href="downloads.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Downloads</span>
                </a>
            </li>
        `;
    } else if (userRole === 'teacher') {
        menuHTML = `
            <li>
                <a href="teacher-dashboard.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="create-class.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span>Create Class</span>
                </a>
            </li>
            <li>
                <a href="class-recordings.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span>Recordings</span>
                </a>
            </li>
            <li>
                <a href="create-assignment.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Assignments</span>
                </a>
            </li>
            <li>
                <a href="create-quiz.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span>Quizzes</span>
                </a>
            </li>
            <li>
                <a href="discussion-forum.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Discussion</span>
                </a>
            </li>
            <li class="active">
                <a href="downloads.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Downloads</span>
                </a>
            </li>
        `;
    } else {
        // Default navigation for guest/logged out users
        menuHTML = `
            <li>
                <a href="../index.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </a>
            </li>
            <li class="active">
                <a href="downloads.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Downloads</span>
                </a>
            </li>
            <li>
                <a href="login.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    <span>Login</span>
                </a>
            </li>
        `;
    }
    
    navMenu.innerHTML = menuHTML;
}

/**
 * Get user role from local storage or session
 * In a real app, this would be from a secure auth system
 */
function getUserRole() {
    // For demo purposes, we'll just return 'student'
    // In a real app, this would check authentication state
    return 'student';
}

/**
 * Initialize filter buttons
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const downloadItems = document.querySelectorAll('.download-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            downloadItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Check if any items are visible
            checkEmptyState();
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-downloads');
    const downloadItems = document.querySelectorAll('.download-item');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        downloadItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const info = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || info.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Check if any items are visible
        checkEmptyState();
    });
}

/**
 * Check if there are any visible download items
 * and show/hide the empty state accordingly
 */
function checkEmptyState() {
    const downloadItems = document.querySelectorAll('.download-item');
    const downloadsEmpty = document.querySelector('.downloads-empty');
    const downloadGroups = document.querySelectorAll('.downloads-group');
    
    let visibleItems = 0;
    
    downloadItems.forEach(item => {
        if (item.style.display !== 'none') {
            visibleItems++;
        }
    });
    
    if (visibleItems === 0) {
        downloadsEmpty.style.display = '';
        downloadGroups.forEach(group => {
            group.style.display = 'none';
        });
    } else {
        downloadsEmpty.style.display = 'none';
        downloadGroups.forEach(group => {
            // Check if this group has visible items
            const groupItems = group.querySelectorAll('.download-item');
            let visibleGroupItems = 0;
            
            groupItems.forEach(item => {
                if (item.style.display !== 'none') {
                    visibleGroupItems++;
                }
            });
            
            if (visibleGroupItems === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = '';
            }
        });
    }
}

/**
 * Initialize download item actions
 */
function initDownloadActions() {
    const downloadItems = document.querySelectorAll('.download-item');
    
    downloadItems.forEach(item => {
        const openButton = item.querySelector('.btn-icon[aria-label="Open file"]');
        const deleteButton = item.querySelector('.btn-icon[aria-label="Delete file"]');
        
        // Open file
        if (openButton) {
            openButton.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                openDownloadedFile(title);
            });
        }
        
        // Delete file
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                showDeleteConfirmation(title, item);
            });
        }
    });
}

/**
 * Show delete confirmation dialog
 */
function showDeleteConfirmation(title, itemElement) {
    // Create dialog if it doesn't exist
    let dialog = document.querySelector('.confirmation-dialog');
    
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Delete Download</h3>
                <p>Are you sure you want to delete "<span class="delete-title"></span>"? This action cannot be undone.</p>
                <div class="dialog-actions">
                    <button class="btn btn-secondary cancel-delete">Cancel</button>
                    <button class="btn btn-primary confirm-delete">Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        // Add event listeners
        dialog.querySelector('.cancel-delete').addEventListener('click', () => {
            dialog.classList.remove('show');
        });
    }
    
    // Update dialog title
    dialog.querySelector('.delete-title').textContent = title;
    
    // Show dialog
    dialog.classList.add('show');
    
    // Update confirm button event
    const confirmButton = dialog.querySelector('.confirm-delete');
    confirmButton.onclick = null; // Remove previous event listener
    confirmButton.addEventListener('click', () => {
        // Delete the file
        deleteDownloadedFile(title, itemElement);
        
        // Hide dialog
        dialog.classList.remove('show');
    });
}

/**
 * Open downloaded file
 */
function openDownloadedFile(title) {
    // In a real app, this would open the actual file
    // For demo purposes, we'll just show a notification
    showNotification('Opening File', `Opening ${title}`, 'info');
}

/**
 * Delete downloaded file
 */
async function deleteDownloadedFile(title, itemElement) {
    try {
        // Remove from UI
        itemElement.style.opacity = '0';
        itemElement.style.height = '0';
        itemElement.style.padding = '0';
        itemElement.style.margin = '0';
        itemElement.style.overflow = 'hidden';
        itemElement.style.transition = 'all 0.3s ease';
        
        // After animation, remove element
        setTimeout(() => {
            itemElement.remove();
            
            // Check if any items are visible
            checkEmptyState();
            
            // Update storage usage
            updateStorageUsage();
        }, 300);
        
        // In a real app, we would also delete from IndexedDB
        await deleteFromIndexedDB(title);
        
        showNotification('File Deleted', `${title} has been deleted.`, 'success');
    } catch (error) {
        console.error('Error deleting file:', error);
        showNotification('Error', 'Failed to delete file. Please try again.', 'error');
    }
}

/**
 * Delete file from IndexedDB
 */
async function deleteFromIndexedDB(title) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('downloads', 'readwrite');
        const store = tx.objectStore('downloads');
        
        // Get all downloads
        const downloads = await store.getAll();
        
        // Find the download with matching title
        const downloadToDelete = downloads.find(download => download.title === title);
        
        if (downloadToDelete) {
            // Delete the download
            await store.delete(downloadToDelete.id);
        }
        
        await tx.complete;
    } catch (error) {
        console.error('Error deleting from IndexedDB:', error);
        throw error;
    }
}

/**
 * Load downloads from IndexedDB
 */
async function loadDownloads() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('downloads', 'readonly');
        const store = tx.objectStore('downloads');
        
        // Get all downloads
        const downloads = await store.getAll();
        
        if (downloads && downloads.length > 0) {
            // Group downloads by type
            const groupedDownloads = groupDownloadsByType(downloads);
            
            // Update UI
            updateDownloadsUI(groupedDownloads);
        } else {
            // No downloads found
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading downloads:', error);
        showNotification('Error', 'Failed to load downloads. Please try again.', 'error');
    }
}

/**
 * Group downloads by type
 */
function groupDownloadsByType(downloads) {
    const groups = {
        documents: [],
        videos: [],
        images: [],
        audio: []
    };
    
    downloads.forEach(download => {
        const fileType = getFileType(download.filename);
        
        switch (fileType) {
            case 'pdf':
            case 'doc':
                groups.documents.push(download);
                break;
            case 'video':
                groups.videos.push(download);
                break;
            case 'image':
                groups.images.push(download);
                break;
            case 'audio':
                groups.audio.push(download);
                break;
            default:
                groups.documents.push(download);
        }
    });
    
    return groups;
}

/**
 * Update downloads UI with grouped downloads
 */
function updateDownloadsUI(groupedDownloads) {
    // For demo purposes, we'll just use the existing UI
    // In a real app, we would dynamically create the UI based on the downloads
    console.log('Downloaded files:', groupedDownloads);
}

/**
 * Show empty state
 */
function showEmptyState() {
    const downloadsEmpty = document.querySelector('.downloads-empty');
    const downloadGroups = document.querySelectorAll('.downloads-group');
    
    downloadsEmpty.style.display = '';
    downloadGroups.forEach(group => {
        group.style.display = 'none';
    });
}

/**
 * Update storage usage
 */
function updateStorageUsage() {
    // In a real app, this would calculate actual storage usage
    // For demo purposes, we'll just use mock data
    const storageUsed = document.querySelector('.storage-used');
    const storageText = document.querySelector('.storage-text');
    
    // Mock data
    const used = 350; // MB
    const total = 1000; // MB
    const percentage = (used / total) * 100;
    
    storageUsed.style.width = `${percentage}%`;
    storageText.textContent = `${used} MB used of ${total / 1000} GB`;
}

/**
 * Get file type based on filename
 */
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
        return 'pdf';
    } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
        return 'video';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return 'image';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
        return 'audio';
    } else {
        return 'other';
    }
}

/**
 * Show notification
 */
function showNotification(title, message, type = 'info') {
    const container = document.querySelector('.notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-icon">
            ${getNotificationIcon(type)}
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        case 'warning':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        case 'error':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        case 'info':
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
}
