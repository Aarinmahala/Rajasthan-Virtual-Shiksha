/**
 * Live Class JavaScript
 * Handles functionality for the live class page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initTabSwitching();
    initChatFunctionality();
    initVideoControls();
    initNotesFunctionality();
    initResourceDownloads();
    
    // Check if we should use mock video (for demo/development)
    if (shouldUseMockVideo()) {
        initMockVideo();
    } else {
        // In a real app, this would initialize WebRTC or similar
        initLiveStream();
    }
    
    // Initialize connection monitoring
    initConnectionMonitoring();
});

/**
 * Initialize tab switching functionality
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Initialize chat functionality
 */
function initChatFunctionality() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Send message on button click
    sendButton.addEventListener('click', () => {
        sendChatMessage();
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendChatMessage();
        }
    });
    
    // Function to send chat message
    function sendChatMessage() {
        const message = messageInput.value.trim();
        
        if (message) {
            // In a real app, this would send the message to a server
            // For demo purposes, we'll just add it to the UI
            
            const now = new Date();
            const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">You</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <p class="message-text">${escapeHTML(message)}</p>
            `;
            
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Save message to IndexedDB (if available)
            saveChatMessage({
                sender: 'You',
                text: message,
                time: timeString,
                timestamp: Date.now()
            });
        }
    }
    
    // Load previous messages if available
    loadChatMessages();
}

/**
 * Save chat message to IndexedDB
 */
async function saveChatMessage(message) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('chatMessages', 'readwrite');
        const store = tx.objectStore('chatMessages');
        
        // Get class ID from URL (in a real app)
        const classId = getClassIdFromUrl() || 'demo-class';
        
        // Add message to store
        await store.add({
            ...message,
            classId,
            id: Date.now()
        });
        
        await tx.complete;
    } catch (error) {
        console.error('Error saving chat message:', error);
    }
}

/**
 * Load chat messages from IndexedDB
 */
async function loadChatMessages() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('chatMessages', 'readonly');
        const store = tx.objectStore('chatMessages');
        
        // Get class ID from URL (in a real app)
        const classId = getClassIdFromUrl() || 'demo-class';
        
        // Get messages for this class
        // In a real app, we'd use an index to get messages by classId
        const messages = await store.getAll();
        const classMessages = messages.filter(msg => msg.classId === classId);
        
        // Sort by timestamp
        classMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        // Display messages
        const chatMessages = document.querySelector('.chat-messages');
        
        classMessages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${escapeHTML(message.sender)}</span>
                    <span class="message-time">${message.time}</span>
                </div>
                <p class="message-text">${escapeHTML(message.text)}</p>
            `;
            
            chatMessages.appendChild(messageElement);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

/**
 * Initialize video controls
 */
function initVideoControls() {
    const micToggle = document.getElementById('mic-toggle');
    const videoToggle = document.getElementById('video-toggle');
    const screenShare = document.getElementById('screen-share');
    const raiseHand = document.getElementById('raise-hand');
    const endCall = document.getElementById('end-call');
    
    // Mic toggle
    micToggle.addEventListener('click', () => {
        micToggle.classList.toggle('muted');
        
        if (micToggle.classList.contains('muted')) {
            micToggle.querySelector('span').textContent = 'Unmute';
            // In a real app, this would mute the audio
        } else {
            micToggle.querySelector('span').textContent = 'Mute';
            // In a real app, this would unmute the audio
        }
    });
    
    // Video toggle
    videoToggle.addEventListener('click', () => {
        videoToggle.classList.toggle('video-off');
        
        if (videoToggle.classList.contains('video-off')) {
            videoToggle.querySelector('span').textContent = 'Start Video';
            // In a real app, this would stop the video
        } else {
            videoToggle.querySelector('span').textContent = 'Stop Video';
            // In a real app, this would start the video
        }
    });
    
    // Screen share
    screenShare.addEventListener('click', () => {
        // In a real app, this would handle screen sharing
        showNotification('Screen Sharing', 'This feature is not available in the demo version.', 'warning');
    });
    
    // Raise hand
    raiseHand.addEventListener('click', () => {
        raiseHand.classList.toggle('active');
        
        if (raiseHand.classList.contains('active')) {
            showNotification('Hand Raised', 'Your hand is raised. The teacher will see your request.', 'info');
            // In a real app, this would send a signal to the teacher
        } else {
            showNotification('Hand Lowered', 'You lowered your hand.', 'info');
            // In a real app, this would remove the signal
        }
    });
    
    // End call
    endCall.addEventListener('click', () => {
        if (confirm('Are you sure you want to leave this class?')) {
            // In a real app, this would disconnect from the call
            window.location.href = 'student-dashboard.html';
        }
    });
}

/**
 * Initialize notes functionality
 */
function initNotesFunctionality() {
    const notesArea = document.getElementById('notes-area');
    const saveNotesButton = document.getElementById('save-notes');
    const downloadNotesButton = document.getElementById('download-notes');
    
    // Load saved notes if available
    loadNotes();
    
    // Auto-save notes every 30 seconds
    setInterval(() => {
        saveNotes(notesArea.value);
    }, 30000);
    
    // Save notes button
    saveNotesButton.addEventListener('click', () => {
        saveNotes(notesArea.value);
        showNotification('Notes Saved', 'Your notes have been saved and will be available offline.', 'success');
    });
    
    // Download notes button
    downloadNotesButton.addEventListener('click', () => {
        downloadNotes(notesArea.value);
    });
}

/**
 * Save notes to IndexedDB
 */
async function saveNotes(notesContent) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('notes', 'readwrite');
        const store = tx.objectStore('notes');
        
        // Get class ID from URL (in a real app)
        const classId = getClassIdFromUrl() || 'demo-class';
        
        // Save notes for this class
        await store.put({
            id: classId,
            content: notesContent,
            lastUpdated: Date.now()
        });
        
        await tx.complete;
        console.log('Notes saved successfully');
    } catch (error) {
        console.error('Error saving notes:', error);
    }
}

/**
 * Load notes from IndexedDB
 */
async function loadNotes() {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('notes', 'readonly');
        const store = tx.objectStore('notes');
        
        // Get class ID from URL (in a real app)
        const classId = getClassIdFromUrl() || 'demo-class';
        
        // Get notes for this class
        const notes = await store.get(classId);
        
        if (notes) {
            document.getElementById('notes-area').value = notes.content;
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

/**
 * Download notes as a text file
 */
function downloadNotes(notesContent) {
    const classTitle = document.querySelector('.class-title').textContent;
    const filename = `${classTitle.replace(/\s+/g, '_')}_Notes.txt`;
    
    const blob = new Blob([notesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Notes Downloaded', 'Your notes have been downloaded to your device.', 'success');
}

/**
 * Initialize resource downloads
 */
function initResourceDownloads() {
    const downloadButtons = document.querySelectorAll('.download-resource');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const resourceName = button.dataset.resource;
            
            // In a real app, this would download the actual file
            // For demo purposes, we'll just show a notification
            showNotification('Resource Downloaded', `${resourceName} has been saved to your device.`, 'success');
            
            // In a real app, we'd also save to IndexedDB for offline access
            saveResourceToIndexedDB(resourceName);
        });
    });
}

/**
 * Save resource to IndexedDB for offline access
 */
async function saveResourceToIndexedDB(resourceName) {
    // Check if we have the db.js module loaded
    if (typeof openDatabase !== 'function') {
        console.warn('IndexedDB module not loaded');
        return;
    }
    
    try {
        const db = await openDatabase();
        const tx = db.transaction('downloads', 'readwrite');
        const store = tx.objectStore('downloads');
        
        // In a real app, we'd store the actual file data
        // For demo purposes, we'll just store the filename
        await store.put({
            id: Date.now(),
            filename: resourceName,
            title: resourceName.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
            fileType: resourceName.split('.').pop().toUpperCase(),
            size: getRandomFileSize(),
            downloadedDate: 'Downloaded just now',
            path: `/downloads/${resourceName}`
        });
        
        await tx.complete;
    } catch (error) {
        console.error('Error saving resource:', error);
    }
}

/**
 * Initialize connection monitoring
 */
function initConnectionMonitoring() {
    const connectionIndicator = document.querySelector('.connection-quality');
    
    // In a real app, this would use the WebRTC connection stats
    // For demo purposes, we'll simulate connection quality changes
    
    // Initial random quality
    updateConnectionQuality(getRandomConnectionQuality());
    
    // Simulate quality changes every 10 seconds
    setInterval(() => {
        updateConnectionQuality(getRandomConnectionQuality());
    }, 10000);
    
    function updateConnectionQuality(quality) {
        connectionIndicator.classList.remove('good', 'medium', 'poor');
        connectionIndicator.classList.add(quality);
        
        switch (quality) {
            case 'good':
                connectionIndicator.title = 'Good connection';
                break;
            case 'medium':
                connectionIndicator.title = 'Fair connection';
                break;
            case 'poor':
                connectionIndicator.title = 'Poor connection';
                showNotification('Connection Issue', 'Your connection quality is poor. Video may be degraded.', 'warning');
                break;
        }
    }
}

/**
 * Initialize mock video for demo/development
 */
function initMockVideo() {
    const videoElement = document.getElementById('video-stream');
    const videoLoading = document.querySelector('.video-loading');
    
    // Create a canvas element for mock video
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Start mock video stream
    setTimeout(() => {
        videoLoading.style.display = 'none';
        videoElement.style.display = 'block';
        
        // Use canvas as mock video source
        const stream = canvas.captureStream(30); // 30 FPS
        videoElement.srcObject = stream;
        
        // Draw something on the canvas
        function drawFrame() {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw a simple clock to show movement
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours() % 12;
            
            // Draw clock face
            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw hour hand
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(
                canvas.width / 2 + 60 * Math.cos((hours * 30 + minutes / 2) * Math.PI / 180 - Math.PI / 2),
                canvas.height / 2 + 60 * Math.sin((hours * 30 + minutes / 2) * Math.PI / 180 - Math.PI / 2)
            );
            ctx.stroke();
            
            // Draw minute hand
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(
                canvas.width / 2 + 80 * Math.cos(minutes * 6 * Math.PI / 180 - Math.PI / 2),
                canvas.height / 2 + 80 * Math.sin(minutes * 6 * Math.PI / 180 - Math.PI / 2)
            );
            ctx.stroke();
            
            // Draw second hand
            ctx.strokeStyle = '#f44336';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(
                canvas.width / 2 + 90 * Math.cos(seconds * 6 * Math.PI / 180 - Math.PI / 2),
                canvas.height / 2 + 90 * Math.sin(seconds * 6 * Math.PI / 180 - Math.PI / 2)
            );
            ctx.stroke();
            
            // Draw center dot
            ctx.fillStyle = '#f44336';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw text
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Demo Video - No actual connection', canvas.width / 2, 50);
            ctx.fillText(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, canvas.width / 2, canvas.height - 30);
            
            requestAnimationFrame(drawFrame);
        }
        
        drawFrame();
    }, 2000);
}

/**
 * Initialize live stream (in a real app, this would use WebRTC)
 */
function initLiveStream() {
    // In a real app, this would initialize WebRTC
    // For demo purposes, we'll just use the mock video
    initMockVideo();
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
 * Helper function to get class ID from URL
 */
function getClassIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Helper function to escape HTML
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Helper function to check if we should use mock video
 */
function shouldUseMockVideo() {
    // In a real app, this would check for development environment
    // For demo purposes, always return true
    return true;
}

/**
 * Helper function to get random connection quality
 */
function getRandomConnectionQuality() {
    const qualities = ['good', 'good', 'good', 'medium', 'poor']; // Weighted towards good
    return qualities[Math.floor(Math.random() * qualities.length)];
}

/**
 * Helper function to get random file size
 */
function getRandomFileSize() {
    const sizes = ['1.2 MB', '2.5 MB', '0.5 MB', '3.7 MB', '1.8 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}
