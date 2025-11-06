// ===================================
// STORAGE API - LocalStorage Functions
// ===================================

const StorageManager = {
    // Storage keys
    KEYS: {
        ENTRIES: 'journalEntries',
        THEME: 'themePreference',
        VOLUME: 'musicVolume',
        FIRST_VISIT: 'hasVisitedBefore'
    },

    /**
     * Save a journal entry to LocalStorage
     * @param {Object} entry - Entry object with title, content, date, timestamp, location
     * @returns {boolean} - Success status
     */
    saveEntry(entry) {
        try {
            const entries = this.getAllEntries();
            
            // Create entry object with all required fields
            const newEntry = {
                id: Date.now().toString(), // Unique ID based on timestamp
                title: entry.title || '',
                content: entry.content || '',
                date: entry.date || new Date().toISOString().split('T')[0],
                timestamp: entry.timestamp || Date.now(),
                location: entry.location || { city: 'Unknown', country: 'Unknown' },
                ...entry // Allow additional fields
            };

            entries.unshift(newEntry); // Add to beginning of array
            localStorage.setItem(this.KEYS.ENTRIES, JSON.stringify(entries));
            
            console.log('Entry saved successfully:', newEntry);
            return true;
        } catch (error) {
            console.error('Error saving entry:', error);
            return false;
        }
    },

    /**
     * Get all journal entries from LocalStorage
     * @returns {Array} - Array of entry objects
     */
    getAllEntries() {
        try {
            const entries = localStorage.getItem(this.KEYS.ENTRIES);
            return entries ? JSON.parse(entries) : [];
        } catch (error) {
            console.error('Error retrieving entries:', error);
            return [];
        }
    },

    /**
     * Delete a specific entry by ID
     * @param {string} entryId - ID of entry to delete
     * @returns {boolean} - Success status
     */
    deleteEntry(entryId) {
        try {
            const entries = this.getAllEntries();
            const filteredEntries = entries.filter(entry => entry.id !== entryId);
            localStorage.setItem(this.KEYS.ENTRIES, JSON.stringify(filteredEntries));
            
            console.log('Entry deleted:', entryId);
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    },

    /**
     * Clear all journal entries
     * @returns {boolean} - Success status
     */
    clearAllEntries() {
        try {
            localStorage.removeItem(this.KEYS.ENTRIES);
            console.log('All entries cleared');
            return true;
        } catch (error) {
            console.error('Error clearing entries:', error);
            return false;
        }
    },

    /**
     * Save theme preference (light/dark)
     * @param {string} theme - 'light' or 'dark'
     * @returns {boolean} - Success status
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.KEYS.THEME, theme);
            console.log('Theme saved:', theme);
            return true;
        } catch (error) {
            console.error('Error saving theme:', error);
            return false;
        }
    },

    /**
     * Get saved theme preference
     * @returns {string} - 'light' or 'dark' (default: 'dark')
     */
    getTheme() {
        try {
            return localStorage.getItem(this.KEYS.THEME) || 'dark';
        } catch (error) {
            console.error('Error retrieving theme:', error);
            return 'dark';
        }
    },

    /**
     * Save music volume preference
     * @param {number} volume - Volume level (0-1)
     * @returns {boolean} - Success status
     */
    saveVolume(volume) {
        try {
            localStorage.setItem(this.KEYS.VOLUME, volume.toString());
            console.log('Volume saved:', volume);
            return true;
        } catch (error) {
            console.error('Error saving volume:', error);
            return false;
        }
    },

    /**
     * Get saved volume preference
     * @returns {number} - Volume level (0-1, default: 0.7)
     */
    getVolume() {
        try {
            const volume = localStorage.getItem(this.KEYS.VOLUME);
            return volume ? parseFloat(volume) : 0.7;
        } catch (error) {
            console.error('Error retrieving volume:', error);
            return 0.7;
        }
    },

    /**
     * Check if user has visited before
     * @returns {boolean} - True if visited before, false if first visit
     */
    hasVisitedBefore() {
        try {
            return localStorage.getItem(this.KEYS.FIRST_VISIT) === 'true';
        } catch (error) {
            console.error('Error checking visit status:', error);
            return false;
        }
    },

    /**
     * Mark that user has visited
     */
    markAsVisited() {
        try {
            localStorage.setItem(this.KEYS.FIRST_VISIT, 'true');
            console.log('User marked as visited');
        } catch (error) {
            console.error('Error marking visit:', error);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

