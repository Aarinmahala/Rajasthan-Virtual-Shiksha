/**
 * Add Teacher JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form functionality
    initTeacherForm();
    initQualificationsManagement();
    initPreviewFunctionality();
    initModalFunctionality();
});

/**
 * Initialize teacher form functionality
 */
function initTeacherForm() {
    const teacherForm = document.getElementById('teacher-form');

    if (teacherForm) {
        teacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createTeacher();
        });
    }

    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft-teacher');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            saveTeacherDraft();
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-teacher');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'admin-dashboard.html';
            }
        });
    }
}

/**
 * Initialize qualifications management
 */
function initQualificationsManagement() {
    // Add qualification button
    const addQualificationBtn = document.querySelector('.add-qualification');
    if (addQualificationBtn) {
        addQualificationBtn.addEventListener('click', () => {
            addQualification();
        });
    }

    // Remove qualification buttons
    const removeQualificationBtns = document.querySelectorAll('.remove-qualification');
    removeQualificationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            removeQualification(btn);
        });
    });

    // Generate password button
    const generatePasswordBtn = document.querySelector('.generate-password');
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', () => {
            generateRandomPassword();
        });
    }
}

/**
 * Initialize preview functionality
 */
function initPreviewFunctionality() {
    const previewBtn = document.getElementById('preview-teacher');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            previewTeacher();
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
            createTeacher();
        });
    }
}

/**
 * Add new qualification
 */
function addQualification() {
    const qualificationsSection = document.querySelector('.qualifications-section');
    const qualificationTemplate = `
        <div class="qualification-item">
            <div class="form-group">
                <label>Degree</label>
                <select class="qualification-degree" name="qualifications[1][degree]">
                    <option value="">Select Degree</option>
                    <option value="phd">PhD</option>
                    <option value="mtech">M.Tech</option>
                    <option value="btech">B.Tech</option>
                    <option value="msc">M.Sc</option>
                    <option value="bsc">B.Sc</option>
                    <option value="mba">MBA</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Specialization</label>
                <input type="text" class="qualification-specialization" name="qualifications[1][specialization]" placeholder="e.g., Computer Science">
            </div>
            <div class="form-group">
                <label>University</label>
                <input type="text" class="qualification-university" name="qualifications[1][university]" placeholder="e.g., Rajasthan University">
            </div>
            <div class="form-group">
                <label>Year of Completion</label>
                <input type="number" class="qualification-year" name="qualifications[1][year]" min="1950" max="2025" placeholder="2020">
            </div>
            <button type="button" class="btn btn-icon remove-qualification" title="Remove Qualification">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><x width="16" height="16"></x></svg>
            </button>
        </div>
    `;

    qualificationsSection.insertAdjacentHTML('beforeend', qualificationTemplate);

    // Add remove functionality to the new qualification
    const newRemoveBtn = qualificationsSection.querySelector('.qualification-item:last-child .remove-qualification');
    newRemoveBtn.addEventListener('click', () => {
        removeQualification(newRemoveBtn);
    });
}

/**
 * Remove qualification
 */
function removeQualification(button) {
    const qualificationItem = button.closest('.qualification-item');
    qualificationItem.remove();
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
 * Preview teacher before creation
 */
function previewTeacher() {
    const form = document.getElementById('teacher-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('firstName') || !formData.get('lastName') || !formData.get('email') || !formData.get('phone') || !formData.get('employeeId') || !formData.get('designation') || !formData.get('department') || !formData.get('joiningDate') || !formData.get('assignedInstitute') || !formData.get('username') || !formData.get('password')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // Update preview content
    updateTeacherPreview(formData);

    // Show preview modal
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.classList.add('show');
    }
}

/**
 * Update teacher preview content
 */
function updateTeacherPreview(formData) {
    // Update teacher name
    const previewName = document.getElementById('preview-teacher-name');
    if (previewName) {
        const title = formData.get('title') || '';
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        previewName.textContent = `${title} ${firstName} ${lastName}`.trim();
    }

    // Update teacher title
    const previewTitle = document.getElementById('preview-teacher-title');
    if (previewTitle) {
        previewTitle.textContent = formData.get('designation') || 'Designation';
    }

    // Update designation
    const previewDesignation = document.getElementById('preview-teacher-designation');
    if (previewDesignation) {
        previewDesignation.textContent = formData.get('designation') || 'Designation';
    }

    // Update contact information
    const previewContact = document.getElementById('preview-teacher-contact');
    if (previewContact) {
        previewContact.textContent = `Email: ${formData.get('email')} | Phone: ${formData.get('phone')}`;
    }

    // Update academic information
    const previewEmployeeId = document.getElementById('preview-employee-id');
    const previewDepartment = document.getElementById('preview-department');
    const previewJoiningDate = document.getElementById('preview-joining-date');
    const previewExperience = document.getElementById('preview-experience');

    if (previewEmployeeId) previewEmployeeId.textContent = formData.get('employeeId');
    if (previewDepartment) previewDepartment.textContent = formData.get('department');
    if (previewJoiningDate) {
        const date = new Date(formData.get('joiningDate'));
        previewJoiningDate.textContent = date.toLocaleDateString();
    }
    if (previewExperience) previewExperience.textContent = `${formData.get('experienceYears') || '0'} years`;

    // Update institute information
    const previewInstitute = document.getElementById('preview-institute');
    const previewSubjects = document.getElementById('preview-subjects');
    const previewLanguages = document.getElementById('preview-languages');

    if (previewInstitute) previewInstitute.textContent = formData.get('assignedInstitute');
    if (previewSubjects) previewSubjects.textContent = formData.get('teachingSubjects') || 'Not specified';
    if (previewLanguages) previewLanguages.textContent = formData.get('languages[]') ? 'English, Hindi' : 'English';

    // Update account settings
    const previewWelcomeEmail = document.getElementById('preview-welcome-email');
    const previewPasswordChange = document.getElementById('preview-password-change');
    const previewAdminAccess = document.getElementById('preview-admin-access');

    if (previewWelcomeEmail) previewWelcomeEmail.textContent = 'Yes';
    if (previewPasswordChange) previewPasswordChange.textContent = 'Yes';
    if (previewAdminAccess) previewAdminAccess.textContent = 'Yes';
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
 * Save teacher as draft
 */
function saveTeacherDraft() {
    const form = document.getElementById('teacher-form');
    const formData = new FormData(form);

    // In a real app, this would save to the server
    console.log('Saving teacher draft:', Object.fromEntries(formData));

    showNotification('Draft Saved', 'Teacher has been saved as draft.', 'success');
}

/**
 * Create teacher
 */
function createTeacher() {
    const form = document.getElementById('teacher-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('firstName') || !formData.get('lastName') || !formData.get('email') || !formData.get('phone') || !formData.get('employeeId') || !formData.get('designation') || !formData.get('department') || !formData.get('joiningDate') || !formData.get('assignedInstitute') || !formData.get('username') || !formData.get('password')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // In a real app, this would send data to the server
    const teacherData = {
        title: formData.get('title'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        employeeId: formData.get('employeeId'),
        designation: formData.get('designation'),
        department: formData.get('department'),
        joiningDate: formData.get('joiningDate'),
        assignedInstitute: formData.get('assignedInstitute'),
        subjectSpecialization: formData.get('subjectSpecialization'),
        experienceYears: formData.get('experienceYears'),
        username: formData.get('username'),
        password: formData.get('password'),
        sendWelcomeEmail: true,
        requirePasswordChange: true,
        enableNotifications: true,
        adminAccess: true,
        teachingSubjects: formData.get('teachingSubjects'),
        languages: ['english', 'hindi'], // Default languages
        availability: formData.get('availability')
    };

    console.log('Creating teacher:', teacherData);

    // Show success message
    showNotification('Teacher Created', 'New teacher account has been successfully created!', 'success');

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
