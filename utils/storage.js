// Storage
// AsyncStorage utilities for simple data (user preferences, settings, recent searches)
// Referenced in-class code

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const KEYS = {
    USER_PREFERENCES: 'userPreferences',
    RECENT_SEARCHES: 'recentSearches',
    APP_SETTINGS: 'appSettings',
    LAST_LOCATION: 'lastLocation',
    ONBOARDING_COMPLETED: 'onboardingCompleted',
};

// USER PREFERENCES

// Save user preferences (theme, notification settings, etc.)
export const saveUserPreferences = async (preferences) => {
    try {
        await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('Error saving user preferences:', error);
        return false;
    }
};

// Get user preferences
export const getUserPreferences = async () => {
    try {
        const preferences = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
        return preferences ? JSON.parse(preferences) : {
            notificationsEnabled: true,
            theme: 'light',
            distanceUnit: 'km', // or 'miles'
        };
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return null;
    }
};

// RECENT SEARCHES

// Add a search term to recent searches (max 10)
export const addRecentSearch = async (searchTerm) => {
    try {
        const existing = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
        let searches = existing ? JSON.parse(existing) : [];
        
        // Remove if already exists
        searches = searches.filter(term => term !== searchTerm);
        
        // Add to beginning
        searches.unshift(searchTerm);
        
        // Keep only last 10
        searches = searches.slice(0, 10);
        
        await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(searches));
        return searches;
    } catch (error) {
        console.error('Error adding recent search:', error);
        return [];
    }
};

// Get recent searches
export const getRecentSearches = async () => {
    try {
        const searches = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
        return searches ? JSON.parse(searches) : [];
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return [];
    }
};

// Clear recent searches
export const clearRecentSearches = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
        return true;
    } catch (error) {
        console.error('Error clearing recent searches:', error);
        return false;
    }
};

// SETTINGS 

// Save app settings
export const saveAppSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving app settings:', error);
        return false;
    }
};

// Get app settings
export const getAppSettings = async () => {
    try {
        const settings = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
        return settings ? JSON.parse(settings) : {
            showTutorial: true,
            cameraQuality: 'high',
            autoSavePhotos: true,
        };
    } catch (error) {
        console.error('Error getting app settings:', error);
        return null;
    }
};

// LAST LOCATION

// Save user's last known location
export const saveLastLocation = async (location) => {
    try {
        await AsyncStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify(location));
        return true;
    } catch (error) {
        console.error('Error saving last location:', error);
        return false;
    }
};

// Get user's last known location
export const getLastLocation = async () => {
    try {
        const location = await AsyncStorage.getItem(KEYS.LAST_LOCATION);
        return location ? JSON.parse(location) : null;
    } catch (error) {
        console.error('Error getting last location:', error);
        return null;
    }
};

// ONBOARDING

// Mark onboarding as completed
export const setOnboardingCompleted = async () => {
    try {
        await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
        return true;
    } catch (error) {
        console.error('Error setting onboarding completed:', error);
        return false;
    }
};

// Check if onboarding is completed
export const isOnboardingCompleted = async () => {
    try {
        const completed = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETED);
        return completed === 'true';
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        return false;
    }
};

// CLEAR ALL DATA

// Clear all AsyncStorage data (useful for debugging or logout)
export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};

// Get all keys in AsyncStorage (for debugging)
export const getAllKeys = async () => {
    try {
        return await AsyncStorage.getAllKeys();
    } catch (error) {
        console.error('Error getting all keys:', error);
        return [];
    }
};