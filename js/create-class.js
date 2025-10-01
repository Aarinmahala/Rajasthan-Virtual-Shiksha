/**
 * Create Class JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form functionality
    initClassForm();
    initScheduleOptions();
    initAccessOptions();
    initFileUpload();
    initModalFunctionality();
});

/**
 * Initialize class form functionality
 */
function initClassForm() {
    const classForm = document.getElementById('class-form');
    
    if (classForm) {
        classForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createClass();
        });
    }
    
    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            saveDraft();
        });
    }
    
    // Schedule class button
    const scheduleClassBtn = document.getElementById('schedule-class');
    if (scheduleClassBtn) {
        scheduleClassBtn.addEventListener('click', () => {
            previewClass();
        });
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancel-class');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'teacher-dashboard.html';
            }
        });
    }
}

/**
 * Initialize schedule options
 */
function initScheduleOptions() {
    const scheduleTypeRadios = document.querySelectorAll('input[name="schedule-type"]');
    const recurringOptions = document.getElementById('recurring-options');
    
    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'recurring') {
                recurringOptions.style.display = 'block';
            } else {
                recurringOptions.style.display = 'none';
            }
        });
    });
    
    // Set default date to today
    const classDateInput = document.getElementById('class-date');
    if (classDateInput) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        classDateInput.value = dateString;
    }
    
    // Set default time
    const classTimeInput = document.getElementById('class-time');
    if (classTimeInput) {
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        classTimeInput.value = timeString;
    }
}

/**
 * Initialize access options
 */
function initAccessOptions() {
    const accessTypeRadios = document.querySelectorAll('input[name="access-type"]');
    const studentSelection = document.getElementById('student-selection');
    
    accessTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'specific-students') {
                studentSelection.style.display = 'block';
            } else {
                studentSelection.style.display = 'none';
            }
        });
    });
    
    // Select all students button
    const selectAllBtn = document.querySelector('.select-all');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[name="selected-students"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
            
            updateSelectedCount();
            selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
        });
    }
    
    // Individual student checkboxes
    const studentCheckboxes = document.querySelectorAll('input[name="selected-students"]');
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedCount();
        });
    });
    
    // Student search
    const studentSearchInput = document.getElementById('student-search');
    if (studentSearchInput) {
        studentSearchInput.addEventListener('input', (e) => {
            filterStudentsList(e.target.value);
        });
    }
}

/**
 * Update selected students count
 */
function updateSelectedCount() {
    const selectedCheckboxes = document.querySelectorAll('input[name="selected-students"]:checked');
    const selectedCountSpan = document.getElementById('selected-count');
    
    if (selectedCountSpan) {
        const count = selectedCheckboxes.length;
        selectedCountSpan.textContent = `${count} student${count !== 1 ? 's' : ''} selected`;
    }
}

/**
 * Filter students list
 */
function filterStudentsList(searchTerm) {
    const studentItems = document.querySelectorAll('.student-item');
    const term = searchTerm.toLowerCase();
    
    studentItems.forEach(item => {
        const studentName = item.querySelector('.student-name').textContent.toLowerCase();
        const studentId = item.querySelector('.student-id').textContent.toLowerCase();
        
        if (studentName.includes(term) || studentId.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    const fileInput = document.getElementById('class-materials');
    const uploadArea = document.querySelector('.file-upload-area');
    const uploadedMaterials = document.getElementById('uploaded-materials');
    
    if (fileInput && uploadArea) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            handleFileUpload(e.target.files);
        });
    }
}

/**
 * Handle file upload
 */
function handleFileUpload(files) {
    const uploadedMaterials = document.getElementById('uploaded-materials');
    
    Array.from(files).forEach(file => {
        // Check file size (max 25MB)
        if (file.size > 25 * 1024 * 1024) {
            showNotification('File Too Large', `${file.name} is too large. Maximum size is 25MB.`, 'error');
            return;
        }
        
        // Create material item
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        materialItem.innerHTML = `
            <div class="material-info">
                <span class="material-name">${file.name}</span>
                <span class="material-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="remove-material" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><x width="16" height="16"></x></svg>
            </button>
        `;
        
        // Add remove functionality
        const removeBtn = materialItem.querySelector('.remove-material');
        removeBtn.addEventListener('click', () => {
            materialItem.remove();
        });
        
        uploadedMaterials.appendChild(materialItem);
    });
    
    showNotification('Files Added', `${files.length} file(s) added to class materials.`, 'success');
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            createClass();
        });
    }
}

/**
 * Preview class before creation
 */
function previewClass() {
    const form = document.getElementById('class-form');
    const formData = new FormData(form);
    
    // Validate required fields
    if (!formData.get('title') || !formData.get('subject') || !formData.get('date') || !formData.get('time')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Update preview content
    updatePreviewContent(formData);
    
    // Show preview modal
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.classList.add('show');
    }
}

/**
 * Update preview content
 */
function updatePreviewContent(formData) {
    // Update title
    const previewTitle = document.getElementById('preview-title');
    if (previewTitle) {
        previewTitle.textContent = formData.get('title');
    }
    
    // Update meta information
    const previewSubject = document.getElementById('preview-subject');
    const previewType = document.getElementById('preview-type');
    const previewDuration = document.getElementById('preview-duration');
    
    if (previewSubject) previewSubject.textContent = formData.get('subject');
    if (previewType) previewType.textContent = formData.get('type');
    if (previewDuration) previewDuration.textContent = `${formData.get('duration')} minutes`;
    
    // Update date and time
    const previewDateTime = document.getElementById('preview-date-time');
    if (previewDateTime) {
        const date = new Date(formData.get('date') + 'T' + formData.get('time'));
        previewDateTime.textContent = date.toLocaleString();
    }
    
    // Update description
    const previewDescription = document.getElementById('preview-description');
    if (previewDescription) {
        previewDescription.textContent = formData.get('description') || 'No description provided.';
    }
    
    // Update agenda
    const previewAgenda = document.getElementById('preview-agenda');
    if (previewAgenda) {
        const agenda = formData.get('agenda');
        previewAgenda.innerHTML = agenda ? `<h4>Class Agenda:</h4><p>${agenda}</p>` : '';
    }
    
    // Update materials
    const previewMaterials = document.getElementById('preview-materials');
    const materialItems = document.querySelectorAll('.material-item');
    if (previewMaterials) {
        if (materialItems.length > 0) {
            previewMaterials.innerHTML = '<h4>Class Materials:</h4>';
            const materialsList = document.createElement('ul');
            materialItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.querySelector('.material-name').textContent;
                materialsList.appendChild(li);
            });
            previewMaterials.appendChild(materialsList);
        } else {
            previewMaterials.innerHTML = '';
        }
    }
    
    // Update participants
    const previewParticipants = document.getElementById('preview-participants');
    if (previewParticipants) {
        const accessType = formData.get('access-type');
        if (accessType === 'specific-students') {
            const selectedStudents = document.querySelectorAll('input[name="selected-students"]:checked');
            previewParticipants.innerHTML = `<h4>Participants (${selectedStudents.length}):</h4>`;
            if (selectedStudents.length > 0) {
                const participantsList = document.createElement('ul');
                selectedStudents.forEach(checkbox => {
                    const studentItem = checkbox.closest('.student-item');
                    const studentName = studentItem.querySelector('.student-name').textContent;
                    const li = document.createElement('li');
                    li.textContent = studentName;
                    participantsList.appendChild(li);
                });
                previewParticipants.appendChild(participantsList);
            }
        } else {
            previewParticipants.innerHTML = `<h4>Participants:</h4><p>${accessType === 'all-students' ? 'All enrolled students' : 'Open access'}</p>`;
        }
    }
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
 * Initialize schedule options
 */
function initScheduleOptions() {
    const scheduleTypeRadios = document.querySelectorAll('input[name="schedule-type"]');
    const recurringOptions = document.getElementById('recurring-options');
    
    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'recurring') {
                recurringOptions.style.display = 'block';
            } else {
                recurringOptions.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize access options
 */
function initAccessOptions() {
    const accessTypeRadios = document.querySelectorAll('input[name="access-type"]');
    const studentSelection = document.getElementById('student-selection');
    
    accessTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'specific-students') {
                studentSelection.style.display = 'block';
            } else {
                studentSelection.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize file upload
 */
function initFileUpload() {
    const fileInput = document.getElementById('class-materials');
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (fileInput && uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            handleMaterialUpload(e.target.files);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handleMaterialUpload(e.dataTransfer.files);
        });
    }
}

/**
 * Handle material upload
 */
function handleMaterialUpload(files) {
    const uploadedMaterials = document.getElementById('uploaded-materials');
    
    Array.from(files).forEach(file => {
        // Check file size
        if (file.size > 25 * 1024 * 1024) {
            showNotification('File Too Large', `${file.name} exceeds the 25MB limit.`, 'error');
            return;
        }
        
        // Create material item
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        materialItem.innerHTML = `
            <div class="material-info">
                <span class="material-name">${file.name}</span>
                <span class="material-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="remove-material" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><x width="16" height="16"></x></svg>
            </button>
        `;
        
        // Add remove functionality
        const removeBtn = materialItem.querySelector('.remove-material');
        removeBtn.addEventListener('click', () => {
            materialItem.remove();
        });
        
        uploadedMaterials.appendChild(materialItem);
    });
    
    showNotification('Materials Added', `${files.length} file(s) added successfully.`, 'success');
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Initialize modal functionality
 */
function initModalFunctionality() {
    const previewBtn = document.getElementById('preview-quiz');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            previewClass();
        });
    }
}

/**
 * Save class as draft
 */
function saveDraft() {
    const form = document.getElementById('class-form');
    const formData = new FormData(form);
    
    // In a real app, this would save to the server
    console.log('Saving class draft:', Object.fromEntries(formData));
    
    showNotification('Draft Saved', 'Class has been saved as draft.', 'success');
}

/**
 * Create class
 */
function createClass() {
    const form = document.getElementById('class-form');
    const formData = new FormData(form);
    
    // Validate required fields
    if (!formData.get('title') || !formData.get('subject') || !formData.get('date') || !formData.get('time')) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }
    
    // In a real app, this would send data to the server
    const classData = {
        title: formData.get('title'),
        subject: formData.get('subject'),
        type: formData.get('type'),
        duration: formData.get('duration'),
        date: formData.get('date'),
        time: formData.get('time'),
        description: formData.get('description'),
        agenda: formData.get('agenda'),
        scheduleType: formData.get('schedule-type'),
        accessType: formData.get('access-type')
    };
    
    console.log('Creating class:', classData);
    
    // Show success message
    showNotification('Class Created', 'Your class has been successfully scheduled!', 'success');
    
    // Hide modal if open
    hidePreviewModal();
    
    // Redirect to teacher dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'teacher-dashboard.html';
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
