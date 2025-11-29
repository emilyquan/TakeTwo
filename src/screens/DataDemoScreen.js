// Data Demo
// Referenced in-class code

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import {
    saveUserPreferences,
    getUserPreferences,
    addRecentSearch,
    getRecentSearches,
    clearRecentSearches,
} from '../utils/storage';
import {
    addMovieLocation,
    getAllMovieLocations,
    getUserStats,
    seedSampleData,
    getDatabaseStats,
    resetDatabase,
} from '../utils/db';

export default function DataDemoScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [locationName, setLocationName] = useState('');
    const [locations, setLocations] = useState([]);
    const [dbStats, setDbStats] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const prefs = await getUserPreferences();
        const searches = await getRecentSearches();
        const allLocations = getAllMovieLocations();
        const databaseStats = getDatabaseStats();
        
        setPreferences(prefs);
        setRecentSearches(searches);
        setLocations(allLocations);
        setDbStats(databaseStats);
    };

    const handleAddSearch = async () => {
        if (searchTerm.trim()) {
            const updated = await addRecentSearch(searchTerm.trim());
            setRecentSearches(updated);
            setSearchTerm('');
        }
    };

    const handleClearSearches = async () => {
        await clearRecentSearches();
        setRecentSearches([]);
    };

    const handleToggleNotifications = async () => {
        const newPrefs = {
            ...preferences,
            notificationsEnabled: !preferences.notificationsEnabled,
        };
        await saveUserPreferences(newPrefs);
        setPreferences(newPrefs);
    };

    const handleAddLocation = () => {
        if (movieTitle.trim() && locationName.trim()) {
            addMovieLocation({
                movieTitle: movieTitle.trim(),
                sceneDescription: 'Demo scene',
                locationName: locationName.trim(),
                genre: 'Romance',
                difficulty: 'easy',
            });
            setMovieTitle('');
            setLocationName('');
            loadData();
        }
    };

    const handleSeedData = () => {
        seedSampleData();
        loadData();
    };

    const handleResetDatabase = () => {
        Alert.alert(
            'Reset Database',
            'This will delete all data. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        resetDatabase();
                        loadData();
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Storage Demo</Text>

            {/* AsyncStorage Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AsyncStorage</Text>
                
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Recent Searches</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Search term..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddSearch}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>

                    {recentSearches.length > 0 && (
                        <View style={styles.list}>
                            {recentSearches.map((term, index) => (
                                <Text key={index} style={styles.listItem}>
                                    {term}
                                </Text>
                            ))}
                        </View>
                    )}

                    {recentSearches.length > 0 && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={handleClearSearches}
                        >
                            <Text style={styles.buttonText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Preferences</Text>
                    {preferences && (
                        <View style={styles.preferenceRow}>
                            <Text style={styles.preferenceText}>
                                Notifications: {preferences.notificationsEnabled ? 'On' : 'Off'}
                            </Text>
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={handleToggleNotifications}
                            >
                                <Text style={styles.buttonText}>Toggle</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* SQLite Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>SQLite Database</Text>

                {dbStats && (
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{dbStats.locations}</Text>
                            <Text style={styles.statLabel}>Locations</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{dbStats.recreations}</Text>
                            <Text style={styles.statLabel}>Recreations</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{dbStats.bucketList}</Text>
                            <Text style={styles.statLabel}>Bucket List</Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Add Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Movie title"
                        placeholderTextColor={COLORS.textMuted}
                        value={movieTitle}
                        onChangeText={setMovieTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location name"
                        placeholderTextColor={COLORS.textMuted}
                        value={locationName}
                        onChangeText={setLocationName}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddLocation}>
                        <Text style={styles.buttonText}>Add Location</Text>
                    </TouchableOpacity>
                </View>

                {locations.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Locations ({locations.length})</Text>
                        <View style={styles.list}>
                            {locations.map((loc) => (
                                <View key={loc.id} style={styles.locationItem}>
                                    <Text style={styles.locationTitle}>{loc.movie_title}</Text>
                                    <Text style={styles.locationSubtitle}>{loc.location_name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleSeedData}
                    >
                        <Text style={styles.buttonText}>Seed Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.dangerButton]}
                        onPress={handleResetDatabase}
                    >
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xl,
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardLabel: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    button: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dangerButton: {
        backgroundColor: COLORS.error,
    },
    toggleButton: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    list: {
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    listItem: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        paddingVertical: SPACING.xs,
    },
    preferenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    preferenceText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    stat: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textLight,
    },
    locationItem: {
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    locationTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    locationSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
});