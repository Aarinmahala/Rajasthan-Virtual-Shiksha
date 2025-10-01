/**
 * Manage Students JavaScript for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page functionality
    initStudentManagement();
    initModals();
    initBulkActions();
    initSearch();
    initFilters();
});

/**
 * Initialize student management functionality
 */
function initStudentManagement() {
    // Add student button
    const addStudentBtn = document.querySelector('.add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            showAddStudentModal();
        });
    }
    
    // Bulk import button
    const bulkImportBtn = document.querySelector('.bulk-import-btn');
    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', () => {
            showBulkImportModal();
        });
    }
    
    // Export list button
    const exportListBtn = document.querySelector('.export-list-btn');
    if (exportListBtn) {
        exportListBtn.addEventListener('click', () => {
            exportStudentList();
        });
    }
    
    // Individual student actions
    initStudentActions();
}

/**
 * Initialize individual student actions
 */
function initStudentActions() {
    // View student buttons
    const viewButtons = document.querySelectorAll('.view-student');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.dataset.studentId;
            viewStudentProfile(studentId);
        });
    });
    
    // Edit student buttons
    const editButtons = document.querySelectorAll('.edit-student');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.dataset.studentId;
            editStudentInfo(studentId);
        });
    });
    
    // Approve student buttons
    const approveButtons = document.querySelectorAll('.approve-student');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.dataset.studentId;
            approveStudent(studentId);
        });
    });
    
    // Reject student buttons
    const rejectButtons = document.querySelectorAll('.reject-student');
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.dataset.studentId;
            rejectStudent(studentId);
        });
    });
    
    // Dropdown menu actions
    initDropdownActions();
}

/**
 * Initialize dropdown menu actions
 */
function initDropdownActions() {
    // Send message links
    const sendMessageLinks = document.querySelectorAll('.send-message');
    sendMessageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const studentId = getStudentIdFromRow(link);
            sendMessageToStudent(studentId);
        });
    });
    
    // Reset password links
    const resetPasswordLinks = document.querySelectorAll('.reset-password');
    resetPasswordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const studentId = getStudentIdFromRow(link);
            resetStudentPassword(studentId);
        });
    });
    
    // Remove student links
    const removeStudentLinks = document.querySelectorAll('.remove-student');
    removeStudentLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const studentId = getStudentIdFromRow(link);
            removeStudent(studentId);
        });
    });
}

/**
 * Get student ID from table row
 */
function getStudentIdFromRow(element) {
    const row = element.closest('.student-row');
    return row ? row.dataset.studentId : null;
}

/**
 * Initialize modal functionality
 */
function initModals() {
    // Add student modal
    const addStudentModal = document.getElementById('add-student-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllModals();
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-student-modal') || 
            e.target.classList.contains('bulk-import-modal')) {
            hideAllModals();
        }
    });
    
    // Add student form submission
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewStudent();
        });
    }
    
    // Generate password button
    const generatePasswordBtn = document.querySelector('.generate-password');
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', () => {
            generateRandomPassword();
        });
    }
}

/**
 * Initialize bulk actions
 */
function initBulkActions() {
    const selectAllCheckbox = document.getElementById('select-all-students');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const bulkActionButtons = document.getElementById('bulk-action-buttons');
    
    // Select all functionality
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            studentCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateBulkActionVisibility();
        });
    }
    
    // Individual checkbox changes
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectAllState();
            updateBulkActionVisibility();
        });
    });
    
    // Bulk action buttons
    const bulkActivateBtn = document.querySelector('.bulk-activate');
    const bulkDeactivateBtn = document.querySelector('.bulk-deactivate');
    const bulkRemoveBtn = document.querySelector('.bulk-remove');
    
    if (bulkActivateBtn) {
        bulkActivateBtn.addEventListener('click', () => {
            bulkActivateStudents();
        });
    }
    
    if (bulkDeactivateBtn) {
        bulkDeactivateBtn.addEventListener('click', () => {
            bulkDeactivateStudents();
        });
    }
    
    if (bulkRemoveBtn) {
        bulkRemoveBtn.addEventListener('click', () => {
            bulkRemoveStudents();
        });
    }
}

/**
 * Update select all checkbox state
 */
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all-students');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const checkedBoxes = document.querySelectorAll('.student-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedBoxes.length === studentCheckboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
}

/**
 * Update bulk action button visibility
 */
function updateBulkActionVisibility() {
    const checkedBoxes = document.querySelectorAll('.student-checkbox:checked');
    const bulkActionButtons = document.getElementById('bulk-action-buttons');
    
    if (checkedBoxes.length > 0) {
        bulkActionButtons.style.display = 'flex';
    } else {
        bulkActionButtons.style.display = 'none';
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-students');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterStudents(searchTerm);
        });
    }
}

/**
 * Initialize filter functionality
 */
function initFilters() {
    const statusFilter = document.getElementById('status-filter');
    const courseFilter = document.getElementById('course-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            applyFilters();
        });
    }
    
    if (courseFilter) {
        courseFilter.addEventListener('change', () => {
            applyFilters();
        });
    }
}

/**
 * Filter students based on search term
 */
function filterStudents(searchTerm) {
    const studentRows = document.querySelectorAll('.student-row');
    
    studentRows.forEach(row => {
        const studentName = row.querySelector('.student-details h4').textContent.toLowerCase();
        const studentId = row.querySelector('.student-id').textContent.toLowerCase();
        const studentEmail = row.querySelector('.student-email').textContent.toLowerCase();
        
        if (studentName.includes(searchTerm) || 
            studentId.includes(searchTerm) || 
            studentEmail.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateShowingCount();
}

/**
 * Apply status and course filters
 */
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const courseFilter = document.getElementById('course-filter').value;
    const studentRows = document.querySelectorAll('.student-row');
    
    studentRows.forEach(row => {
        let showRow = true;
        
        // Status filter
        if (statusFilter !== 'all') {
            const statusBadge = row.querySelector('.status-badge');
            const rowStatus = statusBadge.textContent.toLowerCase();
            if (!rowStatus.includes(statusFilter)) {
                showRow = false;
            }
        }
        
        // Course filter (simplified for demo)
        if (courseFilter !== 'all' && showRow) {
            // In a real app, this would check the actual course data
            // For demo, we'll assume all students are in computer science
            if (courseFilter !== 'computer-science') {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateShowingCount();
}

/**
 * Update showing count
 */
function updateShowingCount() {
    const visibleRows = document.querySelectorAll('.student-row[style=""], .student-row:not([style])');
    const totalRows = document.querySelectorAll('.student-row');
    const showingCount = document.querySelector('.showing-count');
    
    if (showingCount) {
        showingCount.textContent = `Showing ${visibleRows.length} of ${totalRows.length} students`;
    }
}

/**
 * Show add student modal
 */
function showAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Show bulk import modal
 */
function showBulkImportModal() {
    const modal = document.getElementById('bulk-import-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Hide all modals
 */
function hideAllModals() {
    const modals = document.querySelectorAll('.add-student-modal, .bulk-import-modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

/**
 * Add new student
 */
function addNewStudent() {
    const form = document.getElementById('add-student-form');
    const formData = new FormData(form);
    
    // In a real app, this would send data to the server
    // For demo purposes, we'll just show a success message
    
    const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        studentId: formData.get('studentId'),
        course: formData.get('course'),
        semester: formData.get('semester'),
        batch: formData.get('batch')
    };
    
    console.log('Adding new student:', studentData);
    
    // Show success notification
    showNotification('Student Added', `${studentData.firstName} ${studentData.lastName} has been successfully added to your class.`, 'success');
    
    // Hide modal and reset form
    hideAllModals();
    form.reset();
    
    // In a real app, you would refresh the student list here
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
 * View student profile
 */
function viewStudentProfile(studentId) {
    console.log('Viewing profile for student:', studentId);
    showNotification('Student Profile', 'Opening student profile...', 'info');
    // In a real app, this would open a detailed student profile modal
}

/**
 * Edit student information
 */
function editStudentInfo(studentId) {
    console.log('Editing student:', studentId);
    showNotification('Edit Student', 'Opening student edit form...', 'info');
    // In a real app, this would open an edit form modal
}

/**
 * Approve student
 */
function approveStudent(studentId) {
    if (confirm('Are you sure you want to approve this student?')) {
        console.log('Approving student:', studentId);
        
        // Update UI
        const row = document.querySelector(`[data-student-id="${studentId}"]`);
        if (row) {
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Active';
            statusBadge.className = 'status-badge active';
            
            // Update action buttons
            const actionButtons = row.querySelector('.action-buttons');
            actionButtons.innerHTML = `
                <button class="btn btn-icon view-student" title="View Profile" data-student-id="${studentId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><eye width="16" height="16"></eye></svg>
                </button>
                <button class="btn btn-icon edit-student" title="Edit Student" data-student-id="${studentId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><edit width="16" height="16"></edit></svg>
                </button>
            `;
        }
        
        showNotification('Student Approved', 'Student has been approved and can now access the platform.', 'success');
        
        // Re-initialize actions for the updated buttons
        initStudentActions();
    }
}

/**
 * Reject student
 */
function rejectStudent(studentId) {
    if (confirm('Are you sure you want to reject this student application?')) {
        console.log('Rejecting student:', studentId);
        
        // Remove row from table
        const row = document.querySelector(`[data-student-id="${studentId}"]`);
        if (row) {
            row.remove();
        }
        
        showNotification('Student Rejected', 'Student application has been rejected.', 'warning');
        updateShowingCount();
    }
}

/**
 * Remove student
 */
function removeStudent(studentId) {
    if (confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
        console.log('Removing student:', studentId);
        
        // Remove row from table
        const row = document.querySelector(`[data-student-id="${studentId}"]`);
        if (row) {
            row.remove();
        }
        
        showNotification('Student Removed', 'Student has been removed from your class.', 'warning');
        updateShowingCount();
    }
}

/**
 * Send message to student
 */
function sendMessageToStudent(studentId) {
    console.log('Sending message to student:', studentId);
    showNotification('Message', 'Message composer opened.', 'info');
    // In a real app, this would open a message composer
}

/**
 * Reset student password
 */
function resetStudentPassword(studentId) {
    if (confirm('Are you sure you want to reset this student\'s password?')) {
        console.log('Resetting password for student:', studentId);
        showNotification('Password Reset', 'A new password has been sent to the student\'s email.', 'success');
    }
}

/**
 * Bulk activate students
 */
function bulkActivateStudents() {
    const selectedStudents = getSelectedStudents();
    if (selectedStudents.length === 0) {
        showNotification('No Selection', 'Please select students to activate.', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to activate ${selectedStudents.length} selected students?`)) {
        console.log('Bulk activating students:', selectedStudents);
        showNotification('Students Activated', `${selectedStudents.length} students have been activated.`, 'success');
        
        // Update UI for selected students
        selectedStudents.forEach(studentId => {
            const row = document.querySelector(`[data-student-id="${studentId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.textContent = 'Active';
                statusBadge.className = 'status-badge active';
            }
        });
        
        clearSelection();
    }
}

/**
 * Bulk deactivate students
 */
function bulkDeactivateStudents() {
    const selectedStudents = getSelectedStudents();
    if (selectedStudents.length === 0) {
        showNotification('No Selection', 'Please select students to deactivate.', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to deactivate ${selectedStudents.length} selected students?`)) {
        console.log('Bulk deactivating students:', selectedStudents);
        showNotification('Students Deactivated', `${selectedStudents.length} students have been deactivated.`, 'warning');
        
        // Update UI for selected students
        selectedStudents.forEach(studentId => {
            const row = document.querySelector(`[data-student-id="${studentId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.textContent = 'Inactive';
                statusBadge.className = 'status-badge inactive';
            }
        });
        
        clearSelection();
    }
}

/**
 * Bulk remove students
 */
function bulkRemoveStudents() {
    const selectedStudents = getSelectedStudents();
    if (selectedStudents.length === 0) {
        showNotification('No Selection', 'Please select students to remove.', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to remove ${selectedStudents.length} selected students? This action cannot be undone.`)) {
        console.log('Bulk removing students:', selectedStudents);
        
        // Remove rows from table
        selectedStudents.forEach(studentId => {
            const row = document.querySelector(`[data-student-id="${studentId}"]`);
            if (row) {
                row.remove();
            }
        });
        
        showNotification('Students Removed', `${selectedStudents.length} students have been removed.`, 'warning');
        updateShowingCount();
        clearSelection();
    }
}

/**
 * Get selected student IDs
 */
function getSelectedStudents() {
    const checkedBoxes = document.querySelectorAll('.student-checkbox:checked');
    return Array.from(checkedBoxes).map(checkbox => checkbox.value);
}

/**
 * Clear all selections
 */
function clearSelection() {
    const selectAllCheckbox = document.getElementById('select-all-students');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    
    studentCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updateBulkActionVisibility();
}

/**
 * Export student list
 */
function exportStudentList() {
    console.log('Exporting student list...');
    showNotification('Export Started', 'Student list is being exported...', 'info');
    
    // In a real app, this would generate and download a CSV/Excel file
    setTimeout(() => {
        showNotification('Export Complete', 'Student list has been exported successfully.', 'success');
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
