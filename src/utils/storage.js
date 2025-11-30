// Storage - Updated with Board Management
// AsyncStorage utilities for simple data (user preferences, settings, recent searches, boards)

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const KEYS = {
    USER_PREFERENCES: 'userPreferences',
    RECENT_SEARCHES: 'recentSearches',
    APP_SETTINGS: 'appSettings',
    LAST_LOCATION: 'lastLocation',
    ONBOARDING_COMPLETED: 'onboardingCompleted',
    USER_BOARDS: 'userBoards',
};

// USER PREFERENCES

export const saveUserPreferences = async (preferences) => {
    try {
        const existing = await getUserPreferences();
        const updated = { ...existing, ...preferences };
        await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error saving user preferences:', error);
        return false;
    }
};

export const getUserPreferences = async () => {
    try {
        const preferences = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
        return preferences ? JSON.parse(preferences) : {
            notificationsEnabled: true,
            theme: 'light',
            distanceUnit: 'km',
            firstName: '',
            lastName: '',
            fullName: '',
        };
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return null;
    }
};

// USER BOARDS

// Create a new board
export const createBoard = async (boardName) => {
    try {
        const boards = await getUserBoards();
        const newBoard = {
            id: Date.now().toString(),
            name: boardName,
            items: [],
            createdAt: new Date().toISOString(),
        };
        boards.push(newBoard);
        await AsyncStorage.setItem(KEYS.USER_BOARDS, JSON.stringify(boards));
        return newBoard;
    } catch (error) {
        console.error('Error creating board:', error);
        return null;
    }
};

// Get all user boards
export const getUserBoards = async () => {
    try {
        const boards = await AsyncStorage.getItem(KEYS.USER_BOARDS);
        return boards ? JSON.parse(boards) : [];
    } catch (error) {
        console.error('Error getting user boards:', error);
        return [];
    }
};

// Get a specific board by ID
export const getBoardById = async (boardId) => {
    try {
        const boards = await getUserBoards();
        return boards.find(board => board.id === boardId);
    } catch (error) {
        console.error('Error getting board:', error);
        return null;
    }
};

// Add item to board
export const addItemToBoard = async (boardId, item) => {
    try {
        const boards = await getUserBoards();
        const boardIndex = boards.findIndex(b => b.id === boardId);
        
        if (boardIndex === -1) return false;
        
        // Check if item already exists in board
        const itemExists = boards[boardIndex].items.some(
            i => i.id === item.id && i.type === item.type
        );
        
        if (!itemExists) {
            boards[boardIndex].items.push({
                ...item,
                addedAt: new Date().toISOString(),
            });
            await AsyncStorage.setItem(KEYS.USER_BOARDS, JSON.stringify(boards));
        }
        
        return true;
    } catch (error) {
        console.error('Error adding item to board:', error);
        return false;
    }
};

// Remove item from board
export const removeItemFromBoard = async (boardId, itemId, itemType) => {
    try {
        const boards = await getUserBoards();
        const boardIndex = boards.findIndex(b => b.id === boardId);
        
        if (boardIndex === -1) return false;
        
        boards[boardIndex].items = boards[boardIndex].items.filter(
            item => !(item.id === itemId && item.type === itemType)
        );
        
        await AsyncStorage.setItem(KEYS.USER_BOARDS, JSON.stringify(boards));
        return true;
    } catch (error) {
        console.error('Error removing item from board:', error);
        return false;
    }
};

// Delete a board
export const deleteBoard = async (boardId) => {
    try {
        const boards = await getUserBoards();
        const filteredBoards = boards.filter(board => board.id !== boardId);
        await AsyncStorage.setItem(KEYS.USER_BOARDS, JSON.stringify(filteredBoards));
        return true;
    } catch (error) {
        console.error('Error deleting board:', error);
        return false;
    }
};

// Rename a board
export const renameBoard = async (boardId, newName) => {
    try {
        const boards = await getUserBoards();
        const boardIndex = boards.findIndex(b => b.id === boardId);
        
        if (boardIndex === -1) return false;
        
        boards[boardIndex].name = newName;
        await AsyncStorage.setItem(KEYS.USER_BOARDS, JSON.stringify(boards));
        return true;
    } catch (error) {
        console.error('Error renaming board:', error);
        return false;
    }
};

// Check if item is saved in any board
export const isItemSaved = async (itemId, itemType) => {
    try {
        const boards = await getUserBoards();
        return boards.some(board => 
            board.items.some(item => item.id === itemId && item.type === itemType)
        );
    } catch (error) {
        console.error('Error checking if item is saved:', error);
        return false;
    }
};

// RECENT SEARCHES

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

export const getRecentSearches = async () => {
    try {
        const searches = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
        return searches ? JSON.parse(searches) : [];
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return [];
    }
};

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

export const saveAppSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving app settings:', error);
        return false;
    }
};

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

export const saveLastLocation = async (location) => {
    try {
        await AsyncStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify(location));
        return true;
    } catch (error) {
        console.error('Error saving last location:', error);
        return false;
    }
};

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

export const setOnboardingCompleted = async () => {
    try {
        await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
        return true;
    } catch (error) {
        console.error('Error setting onboarding completed:', error);
        return false;
    }
};

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

export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};

export const getAllKeys = async () => {
    try {
        return await AsyncStorage.getAllKeys();
    } catch (error) {
        console.error('Error getting all keys:', error);
        return [];
    }
};