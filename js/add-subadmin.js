/**
 * Add Sub-Admin JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form functionality
    initSubAdminForm();
    initPermissionsManagement();
    initPreviewFunctionality();
    initModalFunctionality();
});

/**
 * Initialize sub-admin form functionality
 */
function initSubAdminForm() {
    const subadminForm = document.getElementById('subadmin-form');

    if (subadminForm) {
        subadminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createSubAdmin();
        });
    }

    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft-subadmin');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            saveSubAdminDraft();
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-subadmin');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'admin-dashboard.html';
            }
        });
    }
}

/**
 * Initialize permissions management
 */
function initPermissionsManagement() {
    // Generate password button
    const generatePasswordBtn = document.querySelector('.generate-password');
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', () => {
            generateRandomPassword();
        });
    }

    // Update permissions count
    updatePermissionsCount();
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions[]"]');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updatePermissionsCount();
        });
    });
}

/**
 * Update permissions count
 */
function updatePermissionsCount() {
    const checkedBoxes = document.querySelectorAll('input[name="permissions[]"]:checked');
    const permissionsCount = document.getElementById('total-permissions');

    if (permissionsCount) {
        permissionsCount.textContent = checkedBoxes.length;
    }
}

/**
 * Initialize preview functionality
 */
function initPreviewFunctionality() {
    const previewBtn = document.getElementById('preview-subadmin');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            previewSubAdmin();
        });
    }
}

/**
 * Initialize modal functionality
 */
function initModalFunctionality() {
    const previewModal = document.getElementById('preview-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hidePreviewModal();
        });
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('preview-modal')) {
            hidePreviewModal();
        }
    });

    // Close preview button
    const closePreviewBtn = document.querySelector('.close-preview');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', () => {
            hidePreviewModal();
        });
    }

    // Create from preview button
    const createFromPreviewBtn = document.querySelector('.create-from-preview');
    if (createFromPreviewBtn) {
        createFromPreviewBtn.addEventListener('click', () => {
            createSubAdmin();
        });
    }
}

/**
 * Generate random password
 */
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const passwordField = document.getElementById('temporary-password');
    if (passwordField) {
        passwordField.value = password;
    }
}

/**
 * Preview sub-admin before creation
 */
function previewSubAdmin() {
    const form = document.getElementById('subadmin-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('firstName') || !formData.get('lastName') || !formData.get('email') || !formData.get('phone') || !formData.get('adminId') || !formData.get('adminLevel') || !formData.get('assignedRegion') || !formData.get('joiningDate') || !formData.get('username') || !formData.get('password')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // Update preview content
    updateSubAdminPreview(formData);

    // Show preview modal
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.classList.add('show');
    }
}

/**
 * Update sub-admin preview content
 */
function updateSubAdminPreview(formData) {
    // Update sub-admin name
    const previewName = document.getElementById('preview-subadmin-name');
    if (previewName) {
        const title = formData.get('title') || '';
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        previewName.textContent = `${title} ${firstName} ${lastName}`.trim();
    }

    // Update sub-admin title
    const previewTitle = document.getElementById('preview-subadmin-title');
    if (previewTitle) {
        previewTitle.textContent = 'Sub-Administrator';
    }

    // Update level
    const previewLevel = document.getElementById('preview-subadmin-level');
    if (previewLevel) {
        const level = formData.get('adminLevel');
        previewLevel.textContent = level.charAt(0).toUpperCase() + level.slice(1) + ' Level';
    }

    // Update contact information
    const previewContact = document.getElementById('preview-subadmin-contact');
    if (previewContact) {
        previewContact.textContent = `Email: ${formData.get('email')} | Phone: ${formData.get('phone')}`;
    }

    // Update admin information
    const previewAdminId = document.getElementById('preview-admin-id');
    const previewAssignedRegion = document.getElementById('preview-assigned-region');
    const previewJoiningDate = document.getElementById('preview-joining-date');

    if (previewAdminId) previewAdminId.textContent = formData.get('adminId');
    if (previewAssignedRegion) previewAssignedRegion.textContent = formData.get('assignedRegion');
    if (previewJoiningDate) {
        const date = new Date(formData.get('joiningDate'));
        previewJoiningDate.textContent = date.toLocaleDateString();
    }

    // Update permissions
    const checkedPermissions = document.querySelectorAll('input[name="permissions[]"]:checked');
    const permissionsList = document.getElementById('preview-permissions-list');
    if (permissionsList) {
        permissionsList.innerHTML = '';
        checkedPermissions.forEach(permission => {
            const permissionTag = document.createElement('span');
            permissionTag.className = 'permission-tag';
            permissionTag.textContent = getPermissionLabel(permission.value);
            permissionsList.appendChild(permissionTag);
        });
    }

    // Update account settings
    const previewWelcomeEmail = document.getElementById('preview-welcome-email');
    const previewPasswordChange = document.getElementById('preview-password-change');
    const previewTwoFactor = document.getElementById('preview-two-factor');

    if (previewWelcomeEmail) previewWelcomeEmail.textContent = 'Yes';
    if (previewPasswordChange) previewPasswordChange.textContent = 'Yes';
    if (previewTwoFactor) previewTwoFactor.textContent = 'No';
}

/**
 * Get permission label
 */
function getPermissionLabel(permissionValue) {
    const permissionLabels = {
        'view-institutes': 'View Institutes',
        'add-institutes': 'Add Institutes',
        'edit-institutes': 'Edit Institutes',
        'manage-institute-settings': 'Manage Institute Settings',
        'view-teachers': 'View Teachers',
        'add-teachers': 'Add Teachers',
        'approve-teachers': 'Approve Teachers',
        'manage-teacher-accounts': 'Manage Teacher Accounts',
        'view-students': 'View Students',
        'manage-student-accounts': 'Manage Student Accounts',
        'view-student-progress': 'View Student Progress',
        'moderate-student-content': 'Moderate Student Content',
        'manage-classes': 'Manage Classes',
        'manage-assignments': 'Manage Assignments',
        'manage-quizzes': 'Manage Quizzes',
        'moderate-discussions': 'Moderate Discussions',
        'view-analytics': 'View Analytics',
        'generate-reports': 'Generate Reports',
        'export-data': 'Export Data',
        'manage-subadmins': 'Manage Sub-Admins',
        'system-settings': 'System Settings',
        'system-backup': 'System Backup'
    };

    return permissionLabels[permissionValue] || permissionValue;
}

/**
 * Hide preview modal
 */
function hidePreviewModal() {
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.classList.remove('show');
    }
}

/**
 * Save sub-admin as draft
 */
function saveSubAdminDraft() {
    const form = document.getElementById('subadmin-form');
    const formData = new FormData(form);

    // In a real app, this would save to the server
    console.log('Saving sub-admin draft:', Object.fromEntries(formData));

    showNotification('Draft Saved', 'Sub-admin has been saved as draft.', 'success');
}

/**
 * Create sub-admin
 */
function createSubAdmin() {
    const form = document.getElementById('subadmin-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('firstName') || !formData.get('lastName') || !formData.get('email') || !formData.get('phone') || !formData.get('adminId') || !formData.get('adminLevel') || !formData.get('assignedRegion') || !formData.get('joiningDate') || !formData.get('username') || !formData.get('password')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // In a real app, this would send data to the server
    const subAdminData = {
        title: formData.get('title'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        adminId: formData.get('adminId'),
        adminLevel: formData.get('adminLevel'),
        assignedRegion: formData.get('assignedRegion'),
        joiningDate: formData.get('joiningDate'),
        username: formData.get('username'),
        password: formData.get('password'),
        sendWelcomeEmail: true,
        requirePasswordChange: true,
        enableNotifications: true,
        twoFactorAuth: false,
        permissions: Array.from(document.querySelectorAll('input[name="permissions[]"]:checked')).map(cb => cb.value),
        notifyNewRegistrations: true,
        notifySystemAlerts: true,
        notifyPerformance: true,
        notifySecurity: true
    };

    console.log('Creating sub-admin:', subAdminData);

    // Show success message
    showNotification('Sub-Admin Created', 'New sub-admin account has been successfully created!', 'success');

    // Hide modal if open
    hidePreviewModal();

    // Redirect to admin dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
    }, 2000);
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
