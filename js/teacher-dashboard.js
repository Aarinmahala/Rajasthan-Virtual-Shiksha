/**
 * Teacher Dashboard JavaScript
 * Handles functionality specific to the teacher dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load teacher data
    loadTeacherData();
    
    // Initialize notification system
    initNotifications();
});

/**
 * Load teacher data from IndexedDB or API
 */
async function loadTeacherData() {
    try {
        // Try to get data from IndexedDB first
        const teacherData = await getTeacherDataFromDB();
        
        if (teacherData) {
            // Update UI with teacher data
            updateTeacherUI(teacherData);
        } else {
            // If not available offline, fetch from API
            if (navigator.onLine) {
                fetchTeacherData();
            } else {
                // Show offline placeholder data
                showOfflinePlaceholderData();
            }
        }
    } catch (error) {
        console.error('Error loading teacher data:', error);
        showOfflinePlaceholderData();
    }
}

/**
 * Get teacher data from IndexedDB
 */
async function getTeacherDataFromDB() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return null;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('teacherData', 'readonly');
        const store = tx.objectStore('teacherData');
        
        // Get the latest teacher data
        const data = await store.get('current');
        return data;
    } catch (error) {
        console.error('Error getting data from IndexedDB:', error);
        return null;
    }
}

/**
 * Fetch teacher data from API
 */
async function fetchTeacherData() {
    try {
        // Show loading state
        showLoadingState();
        
        // In a real app, this would be a fetch to your API
        // For demo purposes, we'll simulate a network request
        setTimeout(() => {
            const mockData = getMockTeacherData();
            updateTeacherUI(mockData);
            
            // Save to IndexedDB for offline use
            saveTeacherDataToDB(mockData);
        }, 1000);
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        showErrorState();
    }
}

/**
 * Save teacher data to IndexedDB
 */
async function saveTeacherDataToDB(data) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('teacherData', 'readwrite');
        const store = tx.objectStore('teacherData');
        
        // Store the data with key 'current'
        await store.put({...data, id: 'current'});
        await tx.complete;
        
        console.log('Teacher data saved to IndexedDB');
    } catch (error) {
        console.error('Error saving data to IndexedDB:', error);
    }
}

/**
 * Update UI with teacher data
 */
function updateTeacherUI(data) {
    // Update teacher name
    const teacherNameElements = document.querySelectorAll('.teacher-name');
    teacherNameElements.forEach(el => {
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
    
    // Update student activities
    updateStudentActivities(data.studentActivities);
    
    // Show notification
    showNotification('Dashboard Updated', 'Your dashboard has been updated with the latest data.');
}

/**
 * Update stats section with data
 */
function updateStats(stats) {
    if (!stats) return;
    
    // Update students
    const studentsValue = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (studentsValue && stats.totalStudents) {
        studentsValue.textContent = stats.totalStudents;
    }
    
    // Update assignments
    const assignmentsValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (assignmentsValue && stats.pendingAssignments !== undefined) {
        assignmentsValue.textContent = stats.pendingAssignments;
    }
    
    // Update quizzes
    const quizzesValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (quizzesValue && stats.activeQuizzes !== undefined) {
        quizzesValue.textContent = stats.activeQuizzes;
    }
    
    // Update classes
    const classesValue = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (classesValue && stats.weeklyClasses !== undefined) {
        classesValue.textContent = stats.weeklyClasses;
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
        
        let actionButton = '';
        if (classItem.isLive) {
            actionButton = `<a href="live-class.html?id=${classItem.id}" class="btn btn-primary">Join Class</a>`;
        } else if (classItem.status === 'upcoming') {
            actionButton = `<a href="start-class.html?id=${classItem.id}" class="btn btn-primary">Start Class</a>`;
        } else {
            actionButton = `<a href="edit-class.html?id=${classItem.id}" class="btn btn-secondary">Edit Class</a>`;
        }
        
        card.innerHTML = `
            <div class="class-status">${classItem.isLive ? 'Live Now' : classItem.timing}</div>
            <h3>${classItem.title}</h3>
            <p class="class-time">${classItem.time}</p>
            <p class="class-students">${classItem.students} students ${classItem.isLive ? 'attending' : 'enrolled'}</p>
            <div class="class-actions">
                ${actionButton}
            </div>
        `;
        
        classCardsContainer.appendChild(card);
    });
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
            <div class="assignment-stats">
                <div class="stat">
                    <span class="stat-number">${assignment.submitted}/${assignment.total}</span>
                    <span class="stat-label">Submitted</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${assignment.graded}</span>
                    <span class="stat-label">Graded</span>
                </div>
            </div>
            <div class="assignment-actions">
                <a href="review-assignments.html?id=${assignment.id}" class="btn btn-primary">Review</a>
            </div>
        `;
        
        assignmentList.appendChild(item);
    });
}

/**
 * Update student activities section with data
 */
function updateStudentActivities(activities) {
    if (!activities || !activities.length) return;
    
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing items
    activityList.innerHTML = '';
    
    // Add new items
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        item.innerHTML = `
            <div class="activity-avatar">
                <img src="${activity.avatar || '../assets/images/default-avatar.png'}" alt="Student Avatar">
            </div>
            <div class="activity-content">
                <p class="activity-text"><strong>${activity.studentName}</strong> ${activity.action} <a href="${activity.link}">${activity.resourceName}</a>${activity.additionalInfo ? ' ' + activity.additionalInfo : ''}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        `;
        
        activityList.appendChild(item);
    });
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
    updateTeacherUI({
        name: 'Teacher',
        avatar: '../assets/images/default-avatar.png',
        stats: {
            totalStudents: 'N/A',
            pendingAssignments: 'N/A',
            activeQuizzes: 'N/A',
            weeklyClasses: 'N/A'
        },
        classes: [],
        assignments: [],
        studentActivities: []
    });
    
    // Show offline notification
    showNotification('Offline Mode', 'You are currently offline. Some features may be limited.', 'warning');
}

/**
 * Get mock teacher data for demo purposes
 */
function getMockTeacherData() {
    return {
        name: 'Prof. Anil Kumar',
        avatar: '../assets/images/default-avatar.png',
        stats: {
            totalStudents: 45,
            pendingAssignments: 12,
            activeQuizzes: 5,
            weeklyClasses: 8
        },
        classes: [
            {
                id: 123,
                title: 'Digital Electronics',
                time: '10:00 AM - 11:30 AM',
                students: 32,
                isLive: true,
                timing: 'Live Now',
                status: 'live'
            },
            {
                id: 124,
                title: 'Computer Networks',
                time: '01:00 PM - 02:30 PM',
                students: 28,
                isLive: false,
                timing: 'Today',
                status: 'upcoming'
            },
            {
                id: 125,
                title: 'Database Management',
                time: '11:00 AM - 12:30 PM',
                students: 30,
                isLive: false,
                timing: 'Tomorrow',
                status: 'scheduled'
            }
        ],
        assignments: [
            {
                id: 456,
                title: 'Network Topology Design',
                course: 'Computer Networks',
                dueDate: 'Oct 5, 2025',
                submitted: 18,
                total: 32,
                graded: 12
            },
            {
                id: 457,
                title: 'Database Schema Design',
                course: 'Database Management',
                dueDate: 'Oct 10, 2025',
                submitted: 8,
                total: 30,
                graded: 0
            }
        ],
        studentActivities: [
            {
                id: 1,
                studentName: 'Rahul Sharma',
                avatar: '../assets/images/default-avatar.png',
                action: 'submitted assignment',
                resourceName: 'Network Topology Design',
                link: '#',
                time: '2 hours ago'
            },
            {
                id: 2,
                studentName: 'Priya Patel',
                avatar: '../assets/images/default-avatar.png',
                action: 'completed quiz',
                resourceName: 'Database Normalization',
                additionalInfo: 'with score 85%',
                link: '#',
                time: '3 hours ago'
            },
            {
                id: 3,
                studentName: 'Amit Kumar',
                avatar: '../assets/images/default-avatar.png',
                action: 'posted a question in',
                resourceName: 'Discussion Forum',
                link: '#',
                time: '5 hours ago'
            },
            {
                id: 4,
                studentName: 'Neha Singh',
                avatar: '../assets/images/default-avatar.png',
                action: 'watched recorded lecture',
                resourceName: 'Introduction to DBMS',
                link: '#',
                time: 'Yesterday'
            }
        ]
    };
}
