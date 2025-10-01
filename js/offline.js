/**
 * Offline page functionality for Rajasthan Virtual Shiksha PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    const retryButton = document.getElementById('retry-button');
    const networkStatus = document.getElementById('network-status');
    const statusIndicator = networkStatus.querySelector('.status-indicator');
    const statusText = networkStatus.querySelector('.status-text');
    
    // Check network status
    function updateNetworkStatus() {
        if (navigator.onLine) {
            statusIndicator.classList.add('online');
            statusText.textContent = 'Back Online';
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
    } else {
            statusIndicator.classList.remove('online');
            statusText.textContent = 'Offline';
        }
    }
    
    // Initial check
    updateNetworkStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Retry button
    retryButton.addEventListener('click', () => {
        retryButton.disabled = true;
        retryButton.textContent = 'Checking...';
        
        // Check connection after a short delay
        setTimeout(() => {
            updateNetworkStatus();
            
            if (!navigator.onLine) {
                retryButton.disabled = false;
                retryButton.textContent = 'Retry Connection';
            }
        }, 1500);
    });
    
    // Display cached content (simplified version)
    showDefaultCachedContent();
});

function showDefaultCachedContent() {
    const cachedList = document.getElementById('cached-list');
    if (!cachedList) return;
    
    cachedList.innerHTML = `
        <li class="cached-item">
            <div class="cached-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </div>
            <a href="../index.html" class="cached-title">Homepage</a>
        </li>
        <li class="cached-item">
            <div class="cached-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </div>
            <a href="../pages/student-dashboard.html" class="cached-title">Student Dashboard</a>
        </li>
    `;
}