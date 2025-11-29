// Database File
// SQLite database for complex structured data (locations, scenes, user stats)
// Referenced in-class code

import * as SQLite from 'expo-sqlite';

// Open database
const db = SQLite.openDatabaseSync('taketwo.db');

// DATABASE INITIALIZATION

// Initialize all database tables
export const initDatabase = () => {
    try {
        // Movie Locations Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS movie_locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_title TEXT NOT NULL,
                scene_description TEXT,
                location_name TEXT NOT NULL,
                address TEXT,
                latitude REAL,
                longitude REAL,
                genre TEXT,
                difficulty TEXT,
                image_url TEXT,
                is_visited INTEGER DEFAULT 0,
                visit_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Bucket List Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS bucket_list (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location_id INTEGER,
                notes TEXT,
                priority INTEGER DEFAULT 0,
                added_date TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (location_id) REFERENCES movie_locations(id)
            );
        `);

        // User Recreations Table (photos taken)
        db.execSync(`
            CREATE TABLE IF NOT EXISTS recreations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location_id INTEGER,
                photo_uri TEXT NOT NULL,
                rating INTEGER,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (location_id) REFERENCES movie_locations(id)
            );
        `);

        // User Stats Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS user_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stat_name TEXT UNIQUE NOT NULL,
                stat_value INTEGER DEFAULT 0,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Initialize user stats if they don't exist
        initializeUserStats();

        console.log('✅ Database initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        return false;
    }
};

// Initialize user stats with default values
const initializeUserStats = () => {
    const stats = [
        'scenes_recreated',
        'locations_visited',
        'miles_traveled',
        'days_active'
    ];

    stats.forEach(stat => {
        db.runSync(
            'INSERT OR IGNORE INTO user_stats (stat_name, stat_value) VALUES (?, ?)',
            [stat, 0]
        );
    });
};

// MOVIE LOCATIONS OPERATIONS

// Add a new movie location
export const addMovieLocation = (location) => {
    try {
        const result = db.runSync(
            `INSERT INTO movie_locations 
            (movie_title, scene_description, location_name, address, latitude, longitude, genre, difficulty, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                location.movieTitle,
                location.sceneDescription,
                location.locationName,
                location.address || null,
                location.latitude || null,
                location.longitude || null,
                location.genre || null,
                location.difficulty || 'medium',
                location.imageUrl || null
            ]
        );
        console.log('✅ Location added with ID:', result.lastInsertRowId);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('❌ Error adding location:', error);
        return null;
    }
};

// Get all movie locations
export const getAllMovieLocations = () => {
    try {
        const result = db.getAllSync('SELECT * FROM movie_locations ORDER BY created_at DESC');
        return result;
    } catch (error) {
        console.error('❌ Error getting locations:', error);
        return [];
    }
};

// Get movie locations by genre
export const getLocationsByGenre = (genre) => {
    try {
        const result = db.getAllSync(
            'SELECT * FROM movie_locations WHERE genre = ? ORDER BY created_at DESC',
            [genre]
        );
        return result;
    } catch (error) {
        console.error('❌ Error getting locations by genre:', error);
        return [];
    }
};

// Get a single movie location by ID
export const getMovieLocationById = (id) => {
    try {
        const result = db.getFirstSync('SELECT * FROM movie_locations WHERE id = ?', [id]);
        return result;
    } catch (error) {
        console.error('❌ Error getting location:', error);
        return null;
    }
};

// Mark location as visited
export const markLocationAsVisited = (locationId) => {
    try {
        const currentDate = new Date().toISOString();
        db.runSync(
            'UPDATE movie_locations SET is_visited = 1, visit_date = ? WHERE id = ?',
            [currentDate, locationId]
        );
        
        // Update user stats
        incrementStat('locations_visited');
        
        console.log('✅ Location marked as visited');
        return true;
    } catch (error) {
        console.error('❌ Error marking location as visited:', error);
        return false;
    }
};

// Search locations by movie title or location name
export const searchLocations = (searchTerm) => {
    try {
        const result = db.getAllSync(
            `SELECT * FROM movie_locations 
            WHERE movie_title LIKE ? OR location_name LIKE ? OR scene_description LIKE ?
            ORDER BY created_at DESC`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return result;
    } catch (error) {
        console.error('❌ Error searching locations:', error);
        return [];
    }
};

// Delete a movie location
export const deleteMovieLocation = (id) => {
    try {
        db.runSync('DELETE FROM movie_locations WHERE id = ?', [id]);
        console.log('✅ Location deleted');
        return true;
    } catch (error) {
        console.error('❌ Error deleting location:', error);
        return false;
    }
};

// BUCKET LIST

// Add location to bucket list
export const addToBucketList = (locationId, notes = '', priority = 0) => {
    try {
        const result = db.runSync(
            'INSERT INTO bucket_list (location_id, notes, priority) VALUES (?, ?, ?)',
            [locationId, notes, priority]
        );
        console.log('✅ Added to bucket list');
        return result.lastInsertRowId;
    } catch (error) {
        console.error('❌ Error adding to bucket list:', error);
        return null;
    }
};

// Get all bucket list items with location details
export const getBucketList = () => {
    try {
        const result = db.getAllSync(
            `SELECT 
                b.id as bucket_id,
                b.notes,
                b.priority,
                b.added_date,
                l.*
            FROM bucket_list b
            JOIN movie_locations l ON b.location_id = l.id
            ORDER BY b.priority DESC, b.added_date DESC`
        );
        return result;
    } catch (error) {
        console.error('❌ Error getting bucket list:', error);
        return [];
    }
};

// Remove from bucket list
export const removeFromBucketList = (bucketId) => {
    try {
        db.runSync('DELETE FROM bucket_list WHERE id = ?', [bucketId]);
        console.log('✅ Removed from bucket list');
        return true;
    } catch (error) {
        console.error('❌ Error removing from bucket list:', error);
        return false;
    }
};

//  RECREATIONS

// Save a recreation photo
export const saveRecreation = (locationId, photoUri, rating = null, notes = '') => {
    try {
        const result = db.runSync(
            'INSERT INTO recreations (location_id, photo_uri, rating, notes) VALUES (?, ?, ?, ?)',
            [locationId, photoUri, rating, notes]
        );
        
        // Update user stats
        incrementStat('scenes_recreated');
        
        console.log('✅ Recreation saved');
        return result.lastInsertRowId;
    } catch (error) {
        console.error('❌ Error saving recreation:', error);
        return null;
    }
};

// Get all recreations
export const getAllRecreations = () => {
    try {
        const result = db.getAllSync(
            `SELECT 
                r.*,
                l.movie_title,
                l.location_name
            FROM recreations r
            JOIN movie_locations l ON r.location_id = l.id
            ORDER BY r.created_at DESC`
        );
        return result;
    } catch (error) {
        console.error('❌ Error getting recreations:', error);
        return [];
    }
};

// Get recreations for a specific location
export const getRecreationsByLocation = (locationId) => {
    try {
        const result = db.getAllSync(
            'SELECT * FROM recreations WHERE location_id = ? ORDER BY created_at DESC',
            [locationId]
        );
        return result;
    } catch (error) {
        console.error('❌ Error getting recreations:', error);
        return [];
    }
};

// Delete a recreation
export const deleteRecreation = (id) => {
    try {
        db.runSync('DELETE FROM recreations WHERE id = ?', [id]);
        console.log('✅ Recreation deleted');
        return true;
    } catch (error) {
        console.error('❌ Error deleting recreation:', error);
        return false;
    }
};

// USER STATS OPERATIONS

// Get all user stats
export const getUserStats = () => {
    try {
        const result = db.getAllSync('SELECT * FROM user_stats');
        const stats = {};
        result.forEach(row => {
            stats[row.stat_name] = row.stat_value;
        });
        return stats;
    } catch (error) {
        console.error('❌ Error getting user stats:', error);
        return {};
    }
};

// Increment a specific stat
export const incrementStat = (statName, amount = 1) => {
    try {
        const currentDate = new Date().toISOString();
        db.runSync(
            'UPDATE user_stats SET stat_value = stat_value + ?, updated_at = ? WHERE stat_name = ?',
            [amount, currentDate, statName]
        );
        return true;
    } catch (error) {
        console.error('❌ Error incrementing stat:', error);
        return false;
    }
};

// Reset all user stats
export const resetUserStats = () => {
    try {
        db.runSync('UPDATE user_stats SET stat_value = 0');
        console.log('✅ User stats reset');
        return true;
    } catch (error) {
        console.error('❌ Error resetting stats:', error);
        return false;
    }
};

// SEED DATA (For Testing)

// Seed database with sample movie locations
export const seedSampleData = () => {
    try {
        const sampleLocations = [
            {
                movieTitle: 'Notting Hill',
                sceneDescription: 'The iconic blue door where William lives',
                locationName: '280 Westbourne Park Road',
                address: 'Notting Hill, London, UK',
                latitude: 51.5201,
                longitude: -0.2013,
                genre: 'Romance',
                difficulty: 'easy'
            },
            {
                movieTitle: 'When Harry Met Sally',
                sceneDescription: "Katz's Delicatessen - I'll have what she's having",
                locationName: "Katz's Delicatessen",
                address: '205 E Houston St, New York, NY',
                latitude: 40.7223,
                longitude: -73.9874,
                genre: 'Romance',
                difficulty: 'easy'
            },
            {
                movieTitle: 'La La Land',
                sceneDescription: 'Griffith Observatory dance scene',
                locationName: 'Griffith Observatory',
                address: '2800 E Observatory Rd, Los Angeles, CA',
                latitude: 34.1184,
                longitude: -118.3004,
                genre: 'Musical',
                difficulty: 'medium'
            }
        ];

        sampleLocations.forEach(location => addMovieLocation(location));
        console.log('✅ Sample data seeded');
        return true;
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        return false;
    }
};

// DATABASE MAINTENANCE

// Reset entire database (delete all tables and recreate)
export const resetDatabase = () => {
    try {
        db.execSync('DROP TABLE IF EXISTS movie_locations');
        db.execSync('DROP TABLE IF EXISTS bucket_list');
        db.execSync('DROP TABLE IF EXISTS recreations');
        db.execSync('DROP TABLE IF EXISTS user_stats');
        
        initDatabase();
        console.log('✅ Database reset successfully');
        return true;
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        return false;
    }
};

// Get database stats (for debugging)
export const getDatabaseStats = () => {
    try {
        const stats = {
            locations: db.getFirstSync('SELECT COUNT(*) as count FROM movie_locations')?.count || 0,
            bucketList: db.getFirstSync('SELECT COUNT(*) as count FROM bucket_list')?.count || 0,
            recreations: db.getFirstSync('SELECT COUNT(*) as count FROM recreations')?.count || 0,
        };
        return stats;
    } catch (error) {
        console.error('❌ Error getting database stats:', error);
        return null;
    }
};