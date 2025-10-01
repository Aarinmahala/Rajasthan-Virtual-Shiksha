/**
 * Main JavaScript for Rajasthan Virtual Shiksha PWA
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize PWA installation
    initPWAInstall();
    
    // Initialize theme switcher (if exists)
    initThemeSwitcher();
    
    // Check if online/offline
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            
            // Accessibility
            const isExpanded = navLinks.classList.contains('active');
            hamburgerMenu.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.main-nav') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Initialize PWA installation prompt
 */
let deferredPrompt;

function initPWAInstall() {
    const installButton = document.getElementById('install-button');
    
    if (installButton) {
        // Initially hide the button
        installButton.style.display = 'none';
        
        // Capture the install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67+ from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show the install button
            installButton.style.display = 'inline-block';
            
            // Handle install button click
            installButton.addEventListener('click', async () => {
                if (!deferredPrompt) return;
                
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                
                // We no longer need the prompt
                deferredPrompt = null;
                
                // Hide the button
                installButton.style.display = 'none';
            });
        });
        
        // Handle installed PWA
        window.addEventListener('appinstalled', () => {
            // Hide the install button
            installButton.style.display = 'none';
            deferredPrompt = null;
            
            // Log or show a message
            console.log('PWA was installed');
        });
    }
}

/**
 * Initialize theme switcher
 */
function initThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    
    if (themeSwitcher) {
        // Get saved theme from localStorage or use system preference
        const savedTheme = localStorage.getItem('theme') || 'auto';
        
        // Apply the theme
        applyTheme(savedTheme);
        
        // Update the switcher value
        themeSwitcher.value = savedTheme;
        
        // Listen for changes
        themeSwitcher.addEventListener('change', () => {
            const selectedTheme = themeSwitcher.value;
            applyTheme(selectedTheme);
            localStorage.setItem('theme', selectedTheme);
        });
    }
}

/**
 * Apply theme to body
 * @param {string} theme - Theme name: 'light', 'dark', 'high-contrast', or 'auto'
 */
function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove(
        'light-theme',
        'dark-theme',
        'high-contrast-theme',
        'auto-theme'
    );
    
    // Apply selected theme
    if (theme === 'auto') {
        document.body.classList.add('auto-theme');
    } else {
        document.body.classList.add(`${theme}-theme`);
    }
}

/**
 * Update online/offline status indicator
 */
function updateOnlineStatus() {
    const statusIndicator = document.getElementById('online-status');
    
    if (statusIndicator) {
        if (navigator.onLine) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusIndicator.setAttribute('title', 'Online');
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusIndicator.setAttribute('title', 'Offline - Working from cached data');
        }
    }
}

