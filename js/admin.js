/**
 * Admin Dashboard JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin dashboard functionality
    initAdminDashboard();
    initNotifications();
    initApprovalActions();
});

/**
 * Initialize admin dashboard functionality
 */
function initAdminDashboard() {
    // Refresh stats button
    const refreshStatsBtn = document.getElementById('refresh-stats');
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', () => {
            refreshDashboardStats();
        });
    }
    
    // System status button
    const systemStatusBtn = document.getElementById('system-status');
    if (systemStatusBtn) {
        systemStatusBtn.addEventListener('click', () => {
            checkSystemStatus();
        });
    }
    
    // Initialize theme switcher
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
        
        // Set initial value from localStorage or default
        const currentTheme = localStorage.getItem('theme') || 'light';
        themeSwitcher.value = currentTheme;
        setTheme(currentTheme);
    }
    
    // Initialize language switcher
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
        
        // Set initial value from localStorage or default
        const currentLanguage = localStorage.getItem('language') || 'en';
        languageSwitcher.value = currentLanguage;
    }
}

/**
 * Refresh dashboard stats
 */
function refreshDashboardStats() {
    // Show loading indicator
    showNotification('Refreshing', 'Updating dashboard statistics...', 'info');
    
    // In a real app, this would fetch data from the server
    // For demo purposes, we'll simulate a delay and update with random values
    setTimeout(() => {
        // Update institute stats
        const instituteStats = document.querySelector('.stats-card:nth-child(1) .stats-number');
        if (instituteStats) {
            const currentValue = parseInt(instituteStats.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 3);
            instituteStats.textContent = newValue;
        }
        
        // Update teacher stats
        const teacherStats = document.querySelector('.stats-card:nth-child(2) .stats-number');
        if (teacherStats) {
            const currentValue = parseInt(teacherStats.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 5);
            teacherStats.textContent = newValue;
        }
        
        // Update subadmin stats
        const subadminStats = document.querySelector('.stats-card:nth-child(3) .stats-number');
        if (subadminStats) {
            const currentValue = parseInt(subadminStats.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 2);
            subadminStats.textContent = newValue;
        }
        
        // Update student stats
        const studentStats = document.querySelector('.stats-card:nth-child(4) .stats-number');
        if (studentStats) {
            const currentValue = parseInt(studentStats.textContent.replace(',', ''));
            const newValue = currentValue + Math.floor(Math.random() * 50);
            studentStats.textContent = newValue.toLocaleString();
        }
        
        showNotification('Refresh Complete', 'Dashboard statistics have been updated.', 'success');
    }, 1500);
}

/**
 * Check system status
 */
function checkSystemStatus() {
    // Show loading indicator
    showNotification('Checking Status', 'Verifying system status...', 'info');
    
    // In a real app, this would check actual system status
    // For demo purposes, we'll simulate a delay and show a result
    setTimeout(() => {
        showNotification('System Status', 'All systems operational. No issues detected.', 'success');
    }, 2000);
}

/**
 * Initialize approval actions
 */
function initApprovalActions() {
    // View approval buttons
    const viewButtons = document.querySelectorAll('.approval-actions .btn-outline');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const approvalItem = btn.closest('.approval-item');
            const approvalTitle = approvalItem.querySelector('h4').textContent;
            viewApprovalDetails(approvalTitle);
        });
    });
    
    // Approve buttons
    const approveButtons = document.querySelectorAll('.approval-actions .btn-success');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const approvalItem = btn.closest('.approval-item');
            const approvalTitle = approvalItem.querySelector('h4').textContent;
            approveItem(approvalItem, approvalTitle);
        });
    });
    
    // Reject buttons
    const rejectButtons = document.querySelectorAll('.approval-actions .btn-danger');
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const approvalItem = btn.closest('.approval-item');
            const approvalTitle = approvalItem.querySelector('h4').textContent;
            rejectItem(approvalItem, approvalTitle);
        });
    });
}

/**
 * View approval details
 */
function viewApprovalDetails(title) {
    console.log('Viewing approval details:', title);
    showNotification('View Details', `Opening details for: ${title}`, 'info');
    // In a real app, this would open a modal with details
}

/**
 * Approve item
 */
function approveItem(item, title) {
    if (confirm(`Are you sure you want to approve: ${title}?`)) {
        console.log('Approving item:', title);
        
        // Remove item from list with animation
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.height = '0';
            item.style.margin = '0';
            item.style.padding = '0';
            item.style.overflow = 'hidden';
            
            setTimeout(() => {
                item.remove();
                updateApprovalCount();
            }, 300);
        }, 300);
        
        showNotification('Approved', `${title} has been approved successfully.`, 'success');
    }
}

/**
 * Reject item
 */
function rejectItem(item, title) {
    if (confirm(`Are you sure you want to reject: ${title}?`)) {
        console.log('Rejecting item:', title);
        
        // Remove item from list with animation
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.height = '0';
            item.style.margin = '0';
            item.style.padding = '0';
            item.style.overflow = 'hidden';
            
            setTimeout(() => {
                item.remove();
                updateApprovalCount();
            }, 300);
        }, 300);
        
        showNotification('Rejected', `${title} has been rejected.`, 'warning');
    }
}

/**
 * Update approval count
 */
function updateApprovalCount() {
    const approvalItems = document.querySelectorAll('.approval-item');
    const count = approvalItems.length;
    
    // Update count in header if it exists
    const countElement = document.querySelector('.pending-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * Set theme
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

/**
 * Set language
 */
function setLanguage(language) {
    localStorage.setItem('language', language);
    // In a real app, this would update the UI language
    console.log('Language set to:', language);
}

/**
 * Initialize notifications
 */
function initNotifications() {
    // This would typically connect to a notification system
    // For demo purposes, we'll show a welcome notification on load
    setTimeout(() => {
        showNotification('Welcome, Admin', 'You have 3 pending approvals to review.', 'info');
    }, 1000);
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
