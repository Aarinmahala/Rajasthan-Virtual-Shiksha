/**
 * Student Dashboard JavaScript
 * Handles functionality specific to the student dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load student data
    loadStudentData();
    
    // Initialize reminder buttons
    initReminderButtons();
    
    // Initialize notification system
    initNotifications();
});

/**
 * Load student data from IndexedDB or API
 */
async function loadStudentData() {
    try {
        // Try to get data from IndexedDB first
        const studentData = await getStudentDataFromDB();
        
        if (studentData) {
            // Update UI with student data
            updateStudentUI(studentData);
        } else {
            // If not available offline, fetch from API
            if (navigator.onLine) {
                fetchStudentData();
            } else {
                // Show offline placeholder data
                showOfflinePlaceholderData();
            }
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        showOfflinePlaceholderData();
    }
}

/**
 * Get student data from IndexedDB
 */
async function getStudentDataFromDB() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return null;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('studentData', 'readonly');
        const store = tx.objectStore('studentData');
        
        // Get the latest student data
        const data = await store.get('current');
        return data;
    } catch (error) {
        console.error('Error getting data from IndexedDB:', error);
        return null;
    }
}

/**
 * Fetch student data from API
 */
async function fetchStudentData() {
    try {
        // Show loading state
        showLoadingState();
        
        // In a real app, this would be a fetch to your API
        // For demo purposes, we'll simulate a network request
        setTimeout(() => {
            const mockData = getMockStudentData();
            updateStudentUI(mockData);
            
            // Save to IndexedDB for offline use
            saveStudentDataToDB(mockData);
        }, 1000);
    } catch (error) {
        console.error('Error fetching student data:', error);
        showErrorState();
    }
}

/**
 * Save student data to IndexedDB
 */
async function saveStudentDataToDB(data) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('studentData', 'readwrite');
        const store = tx.objectStore('studentData');
        
        // Store the data with key 'current'
        await store.put({...data, id: 'current'});
        await tx.complete;
        
        console.log('Student data saved to IndexedDB');
    } catch (error) {
        console.error('Error saving data to IndexedDB:', error);
    }
}

/**
 * Update UI with student data
 */
function updateStudentUI(data) {
    // Update student name
    const studentNameElements = document.querySelectorAll('.student-name');
    studentNameElements.forEach(el => {
        el.textContent = data.name;
    });
    
    // Update user profile
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = data.name;
    }
    
    // Update avatar if available
    const avatarElement = document.querySelector('.avatar');
    if (avatarElement && data.avatar) {
        avatarElement.src = data.avatar;
    }
    
    // Update stats
    updateStats(data.stats);
    
    // Update classes
    updateClasses(data.classes);
    
    // Update assignments
    updateAssignments(data.assignments);
    
    // Update downloads
    updateDownloads(data.downloads);
    
    // Show notification
    showNotification('Dashboard Updated', 'Your dashboard has been updated with the latest data.');
}

/**
 * Update stats section with data
 */
function updateStats(stats) {
    if (!stats) return;
    
    // Update attendance
    const attendanceValue = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (attendanceValue && stats.attendance) {
        attendanceValue.textContent = `${stats.attendance}%`;
    }
    
    // Update assignments
    const assignmentsValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (assignmentsValue && stats.pendingAssignments !== undefined) {
        assignmentsValue.textContent = `${stats.pendingAssignments} Pending`;
    }
    
    // Update quizzes
    const quizzesValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (quizzesValue && stats.quizAverage) {
        quizzesValue.textContent = `${stats.quizAverage}%`;
    }
    
    // Update downloads
    const downloadsValue = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (downloadsValue && stats.downloads !== undefined) {
        downloadsValue.textContent = `${stats.downloads} Files`;
    }
}

/**
 * Update classes section with data
 */
function updateClasses(classes) {
    if (!classes || !classes.length) return;
    
    const classCardsContainer = document.querySelector('.class-cards');
    if (!classCardsContainer) return;
    
    // Clear existing cards
    classCardsContainer.innerHTML = '';
    
    // Add new cards
    classes.forEach(classItem => {
        const card = document.createElement('div');
        card.className = `class-card${classItem.isLive ? ' live' : ''}`;
        
        card.innerHTML = `
            <div class="class-status">${classItem.isLive ? 'Live Now' : classItem.timing}</div>
            <h3>${classItem.title}</h3>
            <p class="class-time">${classItem.time}</p>
            <p class="class-instructor">${classItem.instructor}</p>
            <div class="class-actions">
                ${classItem.isLive 
                    ? `<a href="live-class.html?id=${classItem.id}" class="btn btn-primary">Join Class</a>` 
                    : `<button class="btn btn-secondary reminder-btn" data-class-id="${classItem.id}">Set Reminder</button>`
                }
            </div>
        `;
        
        classCardsContainer.appendChild(card);
    });
    
    // Re-initialize reminder buttons
    initReminderButtons();
}

/**
 * Update assignments section with data
 */
function updateAssignments(assignments) {
    if (!assignments || !assignments.length) return;
    
    const assignmentList = document.querySelector('.assignment-list');
    if (!assignmentList) return;
    
    // Clear existing items
    assignmentList.innerHTML = '';
    
    // Add new items
    assignments.forEach(assignment => {
        const item = document.createElement('div');
        item.className = 'assignment-item';
        
        item.innerHTML = `
            <div class="assignment-info">
                <h3>${assignment.title}</h3>
                <p class="assignment-course">${assignment.course}</p>
                <p class="assignment-due">Due: ${assignment.dueDate}</p>
            </div>
            <div class="assignment-actions">
                <a href="assignments.html?id=${assignment.id}" class="btn btn-primary">Start</a>
            </div>
        `;
        
        assignmentList.appendChild(item);
    });
}

/**
 * Update downloads section with data
 */
function updateDownloads(downloads) {
    if (!downloads || !downloads.length) return;
    
    const downloadList = document.querySelector('.download-list');
    if (!downloadList) return;
    
    // Clear existing items
    downloadList.innerHTML = '';
    
    // Add new items
    downloads.forEach(download => {
        const item = document.createElement('div');
        item.className = 'download-item';
        
        const fileType = getFileType(download.filename);
        
        item.innerHTML = `
            <div class="download-icon ${fileType}">
                ${getFileIcon(fileType)}
            </div>
            <div class="download-info">
                <h3>${download.title}</h3>
                <p>${download.fileType} • ${download.size} • ${download.downloadedDate}</p>
            </div>
            <div class="download-actions">
                <button class="btn btn-icon" aria-label="Open file" data-file="${download.path}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </button>
            </div>
        `;
        
        downloadList.appendChild(item);
    });
    
    // Add event listeners to open file buttons
    const openButtons = downloadList.querySelectorAll('.btn-icon');
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filePath = button.dataset.file;
            openDownloadedFile(filePath);
        });
    });
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
 * Get icon SVG based on file type
 */
function getFileIcon(fileType) {
    switch (fileType) {
        case 'pdf':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
        case 'video':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>';
        case 'image':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
        case 'audio':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>';
    }
}

/**
 * Open downloaded file
 */
function openDownloadedFile(filePath) {
    // In a real app, this would use the File System API or similar
    console.log('Opening file:', filePath);
    
    // For demo purposes, show a notification
    showNotification('Opening File', `Opening ${filePath.split('/').pop()}`);
}

/**
 * Initialize reminder buttons
 */
function initReminderButtons() {
    const reminderButtons = document.querySelectorAll('.reminder-btn');
    
    reminderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const classId = button.dataset.classId;
            setClassReminder(classId);
            
            // Change button text to indicate reminder is set
            button.textContent = 'Reminder Set';
            button.disabled = true;
            button.classList.add('btn-success');
        });
    });
}

/**
 * Set a reminder for a class
 */
function setClassReminder(classId) {
    // In a real app, this would use the Notifications API
    console.log('Setting reminder for class:', classId);
    
    // Check if notification permission is granted
    if (Notification.permission === 'granted') {
        // Schedule notification (in a real app)
        showNotification('Reminder Set', 'You will be notified 15 minutes before class starts.');
    } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Reminder Set', 'You will be notified 15 minutes before class starts.');
            }
        });
    }
}

/**
 * Initialize notification system
 */
function initNotifications() {
    const notificationContainer = document.querySelector('.notification-container');
    
    // If container doesn't exist, create it
    if (!notificationContainer) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

/**
 * Show a notification
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
    updateStudentUI({
        name: 'Student',
        avatar: '../assets/images/default-avatar.png',
        stats: {
            attendance: 'N/A',
            pendingAssignments: 'N/A',
            quizAverage: 'N/A',
            downloads: 'N/A'
        },
        classes: [],
        assignments: [],
        downloads: []
    });
    
    // Show offline notification
    showNotification('Offline Mode', 'You are currently offline. Some features may be limited.', 'warning');
}

/**
 * Get mock student data for demo purposes
 */
function getMockStudentData() {
    return {
        name: 'Rahul Sharma',
        avatar: '../assets/images/default-avatar.png',
        stats: {
            attendance: 85,
            pendingAssignments: 2,
            quizAverage: 78,
            downloads: 12
        },
        classes: [
            {
                id: 123,
                title: 'Digital Electronics',
                time: '10:00 AM - 11:30 AM',
                instructor: 'Prof. Sharma',
                isLive: true,
                timing: 'Live Now'
            },
            {
                id: 124,
                title: 'Computer Networks',
                time: '01:00 PM - 02:30 PM',
                instructor: 'Prof. Gupta',
                isLive: false,
                timing: 'Today'
            },
            {
                id: 125,
                title: 'Database Management',
                time: '11:00 AM - 12:30 PM',
                instructor: 'Prof. Verma',
                isLive: false,
                timing: 'Tomorrow'
            }
        ],
        assignments: [
            {
                id: 456,
                title: 'Network Topology Design',
                course: 'Computer Networks',
                dueDate: 'Oct 5, 2025'
            },
            {
                id: 457,
                title: 'Database Schema Design',
                course: 'Database Management',
                dueDate: 'Oct 10, 2025'
            }
        ],
        downloads: [
            {
                id: 789,
                title: 'Computer Networks Notes',
                filename: 'computer_networks_notes.pdf',
                fileType: 'PDF',
                size: '2.5 MB',
                downloadedDate: 'Downloaded 2 days ago',
                path: '/downloads/computer_networks_notes.pdf'
            },
            {
                id: 790,
                title: 'Digital Electronics Lecture 5',
                filename: 'digital_electronics_lecture_5.mp4',
                fileType: 'MP4',
                size: '45 MB',
                downloadedDate: 'Downloaded yesterday',
                path: '/downloads/digital_electronics_lecture_5.mp4'
            }
        ]
    };
}
