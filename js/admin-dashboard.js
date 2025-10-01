/**
 * Admin Dashboard JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard functionality
    loadAdminData();
    initQuickActions();
    initActivityFeed();
    initSystemOverview();
});

/**
 * Load admin dashboard data
 */
async function loadAdminData() {
    try {
        // Try to get data from IndexedDB first
        const adminData = await getAdminDataFromDB();

        if (adminData) {
            updateDashboardUI(adminData);
        } else {
            // If not available offline, fetch from API
            if (navigator.onLine) {
                fetchAdminData();
            } else {
                showOfflinePlaceholderData();
            }
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
        showOfflinePlaceholderData();
    }
}

/**
 * Get admin data from IndexedDB
 */
async function getAdminDataFromDB() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return null;
    }

    try {
        const db = await openDatabase();
        const tx = db.transaction('adminData', 'readonly');
        const store = tx.objectStore('adminData');

        // Get the latest admin data
        const data = await store.get('dashboard');
        return data;
    } catch (error) {
        console.error('Error getting data from IndexedDB:', error);
        return null;
    }
}

/**
 * Fetch admin data from API
 */
async function fetchAdminData() {
    try {
        // Show loading state
        showLoadingState();

        // In a real app, this would be a fetch to your API
        setTimeout(() => {
            const mockData = getMockAdminData();
            updateDashboardUI(mockData);

            // Save to IndexedDB for offline use
            saveAdminDataToDB(mockData);
        }, 1000);
    } catch (error) {
        console.error('Error fetching admin data:', error);
        showErrorState();
    }
}

/**
 * Save admin data to IndexedDB
 */
async function saveAdminDataToDB(data) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }

    try {
        const db = await openDatabase();
        const tx = db.transaction('adminData', 'readwrite');
        const store = tx.objectStore('adminData');

        // Store the data with key 'dashboard'
        await store.put({...data, id: 'dashboard'});
        await tx.complete;

        console.log('Admin data saved to IndexedDB');
    } catch (error) {
        console.error('Error saving data to IndexedDB:', error);
    }
}

/**
 * Update dashboard UI with admin data
 */
function updateDashboardUI(data) {
    // Update system stats
    updateSystemStats(data.stats);

    // Update quick actions
    updateQuickActions(data.quickActions);

    // Update recent activity
    updateRecentActivity(data.recentActivity);

    // Update system overview
    updateSystemOverview(data.systemOverview);

    // Show notification
    showNotification('Dashboard Updated', 'Your admin dashboard has been updated with the latest data.');
}

/**
 * Update system stats
 */
function updateSystemStats(stats) {
    if (!stats) return;

    // Update institutes count
    const institutesValue = document.querySelector('.stat-item:nth-child(1) .stat-number');
    if (institutesValue && stats.institutes) {
        institutesValue.textContent = stats.institutes;
    }

    // Update teachers count
    const teachersValue = document.querySelector('.stat-item:nth-child(2) .stat-number');
    if (teachersValue && stats.teachers) {
        teachersValue.textContent = stats.teachers;
    }

    // Update sub-admins count
    const subadminsValue = document.querySelector('.stat-item:nth-child(3) .stat-number');
    if (subadminsValue && stats.subadmins) {
        subadminsValue.textContent = stats.subadmins;
    }

    // Update students count
    const studentsValue = document.querySelector('.stat-item:nth-child(4) .stat-number');
    if (studentsValue && stats.students) {
        studentsValue.textContent = stats.students;
    }
}

/**
 * Update quick actions
 */
function updateQuickActions(actions) {
    if (!actions || !actions.length) return;

    // Update action buttons (if needed)
    console.log('Quick actions updated:', actions);
}

/**
 * Update recent activity
 */
function updateRecentActivity(activities) {
    if (!activities || !activities.length) return;

    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    // Clear existing activities
    activityList.innerHTML = '';

    // Add new activities
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';

        activityElement.innerHTML = `
            <div class="activity-icon ${activity.type}">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        `;

        activityList.appendChild(activityElement);
    });
}

/**
 * Update system overview
 */
function updateSystemOverview(overview) {
    if (!overview) return;

    // Update overview cards
    console.log('System overview updated:', overview);
}

/**
 * Initialize quick actions
 */
function initQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const actionType = card.querySelector('.action-icon').classList[1];
            handleQuickAction(actionType);
        });
    });
}

/**
 * Handle quick action clicks
 */
function handleQuickAction(actionType) {
    switch (actionType) {
        case 'institute':
            window.location.href = 'add-institute.html';
            break;
        case 'teacher':
            window.location.href = 'add-teacher.html';
            break;
        case 'admin':
            window.location.href = 'add-subadmin.html';
            break;
        case 'analytics':
            window.location.href = 'system-analytics.html';
            break;
        default:
            console.log('Unknown action type:', actionType);
    }
}

/**
 * Initialize activity feed
 */
function initActivityFeed() {
    // Refresh activity feed every 5 minutes
    setInterval(() => {
        if (navigator.onLine) {
            loadAdminData();
        }
    }, 5 * 60 * 1000);
}

/**
 * Initialize system overview
 */
function initSystemOverview() {
    // Add click handlers for overview cards if needed
    const overviewCards = document.querySelectorAll('.overview-card');

    overviewCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardType = card.querySelector('.card-header h4').textContent;
            handleOverviewClick(cardType);
        });
    });
}

/**
 * Handle overview card clicks
 */
function handleOverviewClick(cardType) {
    switch (cardType) {
        case 'Institute Distribution':
            window.location.href = 'manage-institutes.html';
            break;
        case 'System Health':
            window.location.href = 'system-settings.html';
            break;
        case 'Pending Tasks':
            showNotification('Pending Tasks', 'Opening task management interface...', 'info');
            break;
        default:
            console.log('Unknown card type:', cardType);
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    // Add loading indicators to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('loading');
    });
}

/**
 * Show error state
 */
function showErrorState() {
    // Show error notification
    showNotification('Connection Error', 'Failed to load data. Please check your connection and try again.', 'error');

    // Remove loading indicators
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('loading');
    });
}

/**
 * Show offline placeholder data
 */
function showOfflinePlaceholderData() {
    // Update UI with placeholder data
    updateDashboardUI({
        stats: {
            institutes: '12',
            teachers: '45',
            subadmins: '8',
            students: '1,200'
        },
        quickActions: [],
        recentActivity: [
            {
                type: 'institute',
                text: 'New institute "Government Polytechnic College, Jaipur" was added',
                time: '2 hours ago'
            },
            {
                type: 'teacher',
                text: 'Teacher "Prof. Kumar" account was activated',
                time: '4 hours ago'
            },
            {
                type: 'admin',
                text: 'Sub-admin "Sarah Johnson" was created for Jaipur region',
                time: '1 day ago'
            }
        ],
        systemOverview: {}
    });

    // Show offline notification
    showNotification('Offline Mode', 'You are currently offline. Some features may be limited.', 'warning');
}

/**
 * Get mock admin data for demo purposes
 */
function getMockAdminData() {
    return {
        stats: {
            institutes: 12,
            teachers: 45,
            subadmins: 8,
            students: 1200
        },
        quickActions: [
            {
                type: 'institute',
                title: 'Add New Institute',
                description: 'Register a new educational institute'
            },
            {
                type: 'teacher',
                title: 'Add New Teacher',
                description: 'Register a new teacher account'
            },
            {
                type: 'admin',
                title: 'Add Sub-Admin',
                description: 'Create a new sub-administrator account'
            },
            {
                type: 'analytics',
                title: 'View Analytics',
                description: 'System-wide performance metrics'
            }
        ],
        recentActivity: [
            {
                type: 'institute',
                text: 'New institute "Government Polytechnic College, Jaipur" was added',
                time: '2 hours ago'
            },
            {
                type: 'teacher',
                text: 'Teacher "Prof. Kumar" account was activated',
                time: '4 hours ago'
            },
            {
                type: 'admin',
                text: 'Sub-admin "Sarah Johnson" was created for Jaipur region',
                time: '1 day ago'
            },
            {
                type: 'system',
                text: 'System backup completed successfully',
                time: '2 days ago'
            }
        ],
        systemOverview: {
            institutes: {
                government: 8,
                private: 4
            },
            systemHealth: {
                status: 'online',
                services: 'active',
                database: 'healthy'
            },
            pendingTasks: [
                'Approve 3 teacher applications',
                'Review system performance report',
                'Update security certificates'
            ]
        }
    };
}

/**
 * Get activity icon based on type
 */
function getActivityIcon(type) {
    switch (type) {
        case 'institute':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><building width="20" height="20"></building></svg>';
        case 'teacher':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><user-check width="20" height="20"></user-check></svg>';
        case 'admin':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><shield width="20" height="20"></shield></svg>';
        case 'system':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><settings width="20" height="20"></settings></svg>';
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><activity width="20" height="20"></activity></svg>';
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
