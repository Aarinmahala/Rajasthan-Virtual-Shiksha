/**
 * Add Institute JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form functionality
    initInstituteForm();
    initPreviewFunctionality();
    initModalFunctionality();
});

/**
 * Initialize institute form functionality
 */
function initInstituteForm() {
    const instituteForm = document.getElementById('institute-form');

    if (instituteForm) {
        instituteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createInstitute();
        });
    }

    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft-institute');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            saveInstituteDraft();
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-institute');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'admin-dashboard.html';
            }
        });
    }
}

/**
 * Initialize preview functionality
 */
function initPreviewFunctionality() {
    const previewBtn = document.getElementById('preview-institute');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            previewInstitute();
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
            createInstitute();
        });
    }
}

/**
 * Preview institute before creation
 */
function previewInstitute() {
    const form = document.getElementById('institute-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('name') || !formData.get('code') || !formData.get('type') || !formData.get('address') || !formData.get('contactNumber') || !formData.get('contactEmail') || !formData.get('principalName') || !formData.get('principalEmail') || !formData.get('principalPhone') || !formData.get('adminName') || !formData.get('adminEmail') || !formData.get('adminPhone')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // Update preview content
    updateInstitutePreview(formData);

    // Show preview modal
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.classList.add('show');
    }
}

/**
 * Update institute preview content
 */
function updateInstitutePreview(formData) {
    // Update institute name
    const previewName = document.getElementById('preview-institute-name');
    if (previewName) {
        previewName.textContent = formData.get('name');
    }

    // Update institute type
    const previewType = document.getElementById('preview-institute-type');
    if (previewType) {
        const type = formData.get('type');
        previewType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    }

    // Update location
    const previewLocation = document.getElementById('preview-institute-location');
    if (previewLocation) {
        previewLocation.textContent = `${formData.get('address')}, ${formData.get('district')}, ${formData.get('pincode')}`;
    }

    // Update details
    const previewCode = document.getElementById('preview-code');
    const previewEstablishment = document.getElementById('preview-establishment');
    const previewStudents = document.getElementById('preview-students');
    const previewTeachers = document.getElementById('preview-teachers');

    if (previewCode) previewCode.textContent = formData.get('code');
    if (previewEstablishment) previewEstablishment.textContent = formData.get('establishmentYear') || 'N/A';
    if (previewStudents) previewStudents.textContent = formData.get('totalStudents') || '0';
    if (previewTeachers) previewTeachers.textContent = formData.get('totalTeachers') || '0';

    // Update contact information
    const previewAddress = document.getElementById('preview-address');
    const previewContactDetails = document.getElementById('preview-contact-details');

    if (previewAddress) previewAddress.textContent = formData.get('address');
    if (previewContactDetails) {
        previewContactDetails.textContent = `Phone: ${formData.get('contactNumber')} | Email: ${formData.get('contactEmail')}`;
    }

    // Update administrator information
    const previewAdminName = document.getElementById('preview-admin-name');
    const previewAdminContact = document.getElementById('preview-admin-contact');

    if (previewAdminName) previewAdminName.textContent = formData.get('adminName');
    if (previewAdminContact) {
        previewAdminContact.textContent = `Email: ${formData.get('adminEmail')} | Phone: ${formData.get('adminPhone')}`;
    }

    // Update settings
    const previewAutoApprove = document.getElementById('preview-auto-approve');
    const previewDiscussion = document.getElementById('preview-discussion');
    const previewLiveClasses = document.getElementById('preview-live-classes');

    if (previewAutoApprove) previewAutoApprove.textContent = 'Yes'; // Always enabled for new institutes
    if (previewDiscussion) previewDiscussion.textContent = 'Enabled';
    if (previewLiveClasses) previewLiveClasses.textContent = 'Enabled';
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
 * Save institute as draft
 */
function saveInstituteDraft() {
    const form = document.getElementById('institute-form');
    const formData = new FormData(form);

    // In a real app, this would save to the server
    console.log('Saving institute draft:', Object.fromEntries(formData));

    showNotification('Draft Saved', 'Institute has been saved as draft.', 'success');
}

/**
 * Create institute
 */
function createInstitute() {
    const form = document.getElementById('institute-form');
    const formData = new FormData(form);

    // Validate required fields
    if (!formData.get('name') || !formData.get('code') || !formData.get('type') || !formData.get('address') || !formData.get('contactNumber') || !formData.get('contactEmail') || !formData.get('principalName') || !formData.get('principalEmail') || !formData.get('principalPhone') || !formData.get('adminName') || !formData.get('adminEmail') || !formData.get('adminPhone')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }

    // In a real app, this would send data to the server
    const instituteData = {
        name: formData.get('name'),
        code: formData.get('code'),
        type: formData.get('type'),
        affiliation: formData.get('affiliation'),
        establishmentYear: formData.get('establishmentYear'),
        category: formData.get('category'),
        description: formData.get('description'),
        address: formData.get('address'),
        district: formData.get('district'),
        pincode: formData.get('pincode'),
        contactNumber: formData.get('contactNumber'),
        contactEmail: formData.get('contactEmail'),
        website: formData.get('website'),
        principalName: formData.get('principalName'),
        principalEmail: formData.get('principalEmail'),
        principalPhone: formData.get('principalPhone'),
        principalQualification: formData.get('principalQualification'),
        totalStudents: formData.get('totalStudents'),
        totalTeachers: formData.get('totalTeachers'),
        coursesOffered: formData.get('coursesOffered'),
        accreditation: formData.get('accreditation'),
        autoApproveStudents: true, // Always enabled for new institutes
        enableDiscussion: true,
        enableLiveClasses: true,
        enableRecordings: true,
        adminName: formData.get('adminName'),
        adminEmail: formData.get('adminEmail'),
        adminPhone: formData.get('adminPhone'),
        adminDesignation: formData.get('adminDesignation')
    };

    console.log('Creating institute:', instituteData);

    // Show success message
    showNotification('Institute Created', 'New institute has been successfully created!', 'success');

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
