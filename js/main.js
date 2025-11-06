// ===================================
// MAIN.JS - DOM Manipulation & Event Handlers
// ===================================

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Learning Journal PWA...');
    await initializeApp();
});

/**
 * Main initialization function
 */
async function initializeApp() {
    try {
        // 1. Apply saved theme
        applySavedTheme();

        // 2. Setup theme toggle
        setupThemeToggle();

        // 3. Get and display location
        await initializeLocation();

        // 4. Load and render journal entries
        renderJournalEntries();

        // 5. Setup form submission
        setupFormSubmission();

        // 6. Initialize music player
        if (typeof MusicPlayer !== 'undefined') {
            MusicPlayer.init();
        }

        // 7. Initialize YouTube and Facebook services
        if (typeof YouTubeService !== 'undefined') {
            YouTubeService.init();
        }
        if (typeof FacebookService !== 'undefined') {
            FacebookService.init();
        }

        // 8. Show welcome modal for first-time visitors
        if (typeof WelcomeModal !== 'undefined') {
            WelcomeModal.show();
        }

        // 9. Setup modal close handlers
        setupModalHandlers();

        // 10. Setup location click handler for map
        setupLocationClickHandler();

        // 11. Setup clear all entries button
        setupClearAllButton();

        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

/**
 * Apply saved theme preference
 */
function applySavedTheme() {
    const savedTheme = StorageManager.getTheme();
    const body = document.body;
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }

    // Update theme toggle button icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }

    console.log('Theme applied:', savedTheme);
}

/**
 * Setup theme toggle button
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const body = document.body;
        const isLightMode = body.classList.contains('light-mode');
        const newTheme = isLightMode ? 'dark' : 'light';

        // Toggle classes
        if (newTheme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.textContent = '🌙';
        }

        // Save preference
        StorageManager.saveTheme(newTheme);
        console.log('Theme toggled to:', newTheme);
    });
}

/**
 * Initialize location service and display in navbar
 */
async function initializeLocation() {
    try {
        const location = await LocationService.getFullLocation();
        LocationService.displayInNav(location);
        console.log('Location initialized:', location);
    } catch (error) {
        console.error('Error initializing location:', error);
        LocationService.displayInNav({
            city: 'Location unavailable',
            country: 'Please enable location permissions'
        });
    }
}

/**
 * Render all journal entries from LocalStorage
 */
function renderJournalEntries() {
    const entriesGrid = document.getElementById('journal-entries-grid');
    const emptyState = document.getElementById('entries-empty-state');
    
    if (!entriesGrid) {
        console.warn('Journal entries grid not found');
        return;
    }

    const entries = StorageManager.getAllEntries();

    // Show empty state if no entries (but keep static entries visible)
    if (entries.length === 0) {
        if (emptyState) emptyState.style.display = 'none'; // Don't show empty state if static entries exist
        // Keep existing static entries visible - don't hide them
        return;
    }

    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';

    // Keep existing static entries visible - don't hide them
    // Static entries remain visible alongside dynamic entries

    // Clear existing dynamic entries (only remove previously added dynamic ones)
    const dynamicEntries = entriesGrid.querySelectorAll('.journal-card[data-dynamic]');
    dynamicEntries.forEach(card => card.remove());

    // Render each entry from LocalStorage
    entries.forEach(entry => {
        const entryCard = createEntryCard(entry);
        // Insert dynamic entries at the beginning, before static entries
        entriesGrid.insertBefore(entryCard, entriesGrid.firstChild);
    });

    console.log(`Rendered ${entries.length} journal entries (static entries remain visible)`);
}

/**
 * Create a journal entry card element
 * @param {Object} entry - Entry object
 * @returns {HTMLElement} - Card element
 */
function createEntryCard(entry) {
    const card = document.createElement('article');
    card.className = 'journal-card';
    card.setAttribute('data-dynamic', 'true');
    card.setAttribute('data-entry-id', entry.id);

    // Format date
    const date = new Date(entry.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format time
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Location string
    const locationStr = entry.location 
        ? `${entry.location.city}, ${entry.location.country}`
        : 'Location not available';

    card.innerHTML = `
        <button class="delete-entry-btn" data-entry-id="${entry.id}" aria-label="Delete entry">🗑️ Delete</button>
        <div class="journal-header">
            <span class="week-badge">${entry.title || 'Journal Entry'}</span>
            <span class="journal-date">${formattedDate} at ${formattedTime}</span>
        </div>
        <h2 class="journal-title">${entry.title || 'Untitled Entry'}</h2>
        <p class="journal-excerpt">${escapeHtml(entry.content)}</p>
        <div class="journal-tags">
            <span class="tag">📍 ${locationStr}</span>
            <span class="tag">📅 ${formattedDate}</span>
        </div>
        <div class="entry-actions">
            <button class="share-btn facebook-share" data-entry-id="${entry.id}" aria-label="Share to Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share to Facebook
            </button>
        </div>
    `;

    // Add delete button event listener
    const deleteBtn = card.querySelector('.delete-entry-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEntry(entry.id);
        });
    }

    // Add Facebook share button event listener
    const shareBtn = card.querySelector('.facebook-share');
    if (shareBtn && typeof FacebookService !== 'undefined') {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            FacebookService.shareNative(entry).catch(() => {
                FacebookService.shareEntry(entry);
            });
        });
    }

    return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Delete a journal entry
 * @param {string} entryId - ID of entry to delete
 */
function deleteEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }

    const success = StorageManager.deleteEntry(entryId);
    if (success) {
        renderJournalEntries();
        FormValidator.showModal('success', 'Entry deleted successfully!');
    } else {
        FormValidator.showModal('error', 'Failed to delete entry. Please try again.');
    }
}

/**
 * Setup form submission handler
 */
function setupFormSubmission() {
    const form = document.getElementById('journal-entry-form');
    if (!form) {
        console.warn('Journal entry form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        const validation = FormValidator.validate(form);
        
        if (!validation.valid) {
            // Show error messages
            validation.errors.forEach(error => {
                const errorElement = document.getElementById(`${error.field}-error`);
                if (errorElement) {
                    errorElement.textContent = error.message;
                }
            });
            
            FormValidator.showModal('error', 'Please fix the errors in the form.');
            return;
        }

        // Clear error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Get form values
        const title = form.querySelector('#journal-title').value.trim();
        const content = form.querySelector('#journal-content').value.trim();

        // Get current location
        const location = await LocationService.getFullLocation();

        // Create entry object
        const entry = {
            title: title,
            content: content,
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            location: {
                city: location.city || 'Unknown',
                state: location.state || '',
                country: location.country || 'Unknown',
                lat: location.lat || null,
                lon: location.lon || null
            }
        };

        // Save entry
        const success = StorageManager.saveEntry(entry);

        if (success) {
            // Show success modal
            FormValidator.showModal('success', 'Journal entry saved successfully!');

            // Clear form
            FormValidator.clearForm(form);

            // Re-render entries
            renderJournalEntries();

            // Scroll to new entry (optional)
            setTimeout(() => {
                const newEntry = document.querySelector(`[data-entry-id="${entry.id}"]`);
                if (newEntry) {
                    newEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } else {
            FormValidator.showModal('error', 'Failed to save entry. Please try again.');
        }
    });
}

/**
 * Setup modal close handlers
 */
function setupModalHandlers() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

/**
 * Setup location click handler to open map
 */
function setupLocationClickHandler() {
    const locationElement = document.getElementById('nav-location');
    if (!locationElement) return;

    locationElement.addEventListener('click', () => {
        const lat = locationElement.getAttribute('data-lat');
        const lon = locationElement.getAttribute('data-lon');

        if (lat && lon) {
            MapService.showMap(parseFloat(lat), parseFloat(lon));
        } else {
            FormValidator.showModal('error', 'Location data not available. Please allow location access.');
        }
    });
}

/**
 * Setup clear all entries button
 */
function setupClearAllButton() {
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (!clearAllBtn) return;

    clearAllBtn.addEventListener('click', () => {
        if (!confirm('Are you sure you want to delete ALL journal entries? This action cannot be undone.')) {
            return;
        }

        const success = StorageManager.clearAllEntries();
        if (success) {
            renderJournalEntries();
            FormValidator.showModal('success', 'All entries cleared successfully!');
        } else {
            FormValidator.showModal('error', 'Failed to clear entries. Please try again.');
        }
    });
}

// Keep existing functionality from original main.js for other pages
// Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const hamburger = this.querySelector('.hamburger');
            if (navMenu.classList.contains('active')) {
                hamburger.style.background = 'transparent';
                hamburger.style.transform = 'rotate(45deg)';
            } else {
            hamburger.style.background = 'var(--text-primary)';
                hamburger.style.transform = 'rotate(0)';
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const hamburger = mobileToggle.querySelector('.hamburger');
            hamburger.style.background = 'var(--text-primary)';
                hamburger.style.transform = 'rotate(0)';
            });
        });
    }
    
// Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
// Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                const delay = entry.target.getAttribute('data-aos-delay');
                if (delay) {
                    entry.target.style.animationDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
    
console.log('Learning Journal PWA - All systems ready! 🚀');
