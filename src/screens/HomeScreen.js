// screens/HomeScreen.js - Updated with Nearby Locations and Custom Locations

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Image,
    Dimensions,
    Modal,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats, getAllRecreations, getAllMovieLocations, deleteMovieLocation } from '../utils/db';
import { getUserPreferences, getUserBoards } from '../utils/storage';
import { getNearbyLocations } from '../utils/filmingLocations';

const { width } = Dimensions.get('window');
const BOARD_WIDTH = (width - SPACING.lg * 3) / 2;
const RECREATION_WIDTH = (width - SPACING.lg * 3) / 2;

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
    });
    const [activeTab, setActiveTab] = useState('boards');
    const [boards, setBoards] = useState([]);
    const [recreations, setRecreations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [nearbyCount, setNearbyCount] = useState(0);
    const [customLocationsCount, setCustomLocationsCount] = useState(0);
    const [userLocation, setUserLocation] = useState(null);
    const [showLocationsModal, setShowLocationsModal] = useState(false);
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [customLocations, setCustomLocations] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
            getUserLocationAndNearby();
        }, [])
    );

    const loadData = async () => {
        try {
            // Get user's name from storage
            const preferences = await getUserPreferences();
            if (preferences && preferences.fullName) {
                setUserName(preferences.fullName);
            } else if (preferences && preferences.firstName) {
                setUserName(preferences.firstName);
            }

            // Get user stats
            const userStats = getUserStats();
            setStats(userStats);

            // Load user's boards
            const userBoards = await getUserBoards();
            setBoards(userBoards);

            // Load recreations
            const userRecreations = getAllRecreations();
            setRecreations(userRecreations);

            // Load custom locations count
            const allLocations = getAllMovieLocations();
            setCustomLocationsCount(allLocations.length);
            setCustomLocations(allLocations);
        } catch (error) {
            console.error('Error loading home data:', error);
        }
    };

    const getUserLocationAndNearby = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                // Get nearby locations within 100km
                const nearby = getNearbyLocations(
                    location.coords.latitude,
                    location.coords.longitude,
                    100
                );
                setNearbyCount(nearby.length);
                setNearbyLocations(nearby);
            }
        } catch (error) {
            console.error('Error getting user location:', error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadData();
        await getUserLocationAndNearby();
        setRefreshing(false);
    }, []);

    const handleBoardPress = (board) => {
        navigation.navigate('BoardDetail', { 
            boardId: board.id,
            boardTitle: board.name,
            boardItems: board.items || []
        });
    };

    const handleCreateBoard = () => {
        navigation.navigate('CreateBoard');
    };

    const handleRecreationPress = (recreation) => {
        navigation.navigate('RecreationDetail', { recreation });
    };

    const handleAddLocation = () => {
        navigation.navigate('AddLocation');
    };

    const handleLocationPress = (location) => {
        setShowLocationsModal(false);
        // Format the location properly for the Map screen
        const formattedLocation = location.movie_title ? {
            // Custom location from database
            id: location.id,
            movieTitle: location.movie_title,
            sceneDescription: location.scene_description,
            locationName: location.location_name,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            difficulty: location.difficulty,
            movieId: null,
        } : location; // Already formatted (nearby location)
        
        // FIXED: Navigate to nested Map screen
        navigation.navigate('Back', {
            screen: 'Map',
            params: {
                selectedLocation: formattedLocation,
            },
        });
    };

    const handleDeleteCustomLocation = (locationId) => {
        Alert.alert(
            'Delete Location',
            'Are you sure you want to delete this custom location?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = deleteMovieLocation(locationId);
                        if (success) {
                            // Refresh data
                            await loadData();
                            Alert.alert('Success', 'Location deleted');
                        } else {
                            Alert.alert('Error', 'Failed to delete location');
                        }
                    },
                },
            ]
        );
    };

    const renderBoardItem = ({ item }) => (
        <TouchableOpacity
            style={styles.boardCard}
            onPress={() => handleBoardPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.boardPreview}>
                {item.items && item.items.length > 0 ? (
                    <View style={styles.previewGrid}>
                        {item.items.slice(0, 4).map((savedItem, index) => (
                            <View key={index} style={styles.previewImageContainer}>
                                <Image
                                    source={{ uri: savedItem.imageUrl }}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyPreview}>
                        <Ionicons name="folder-outline" size={48} color={COLORS.textMuted} />
                    </View>
                )}
            </View>
            <View style={styles.boardInfo}>
                <Text style={styles.boardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.boardCount}>
                    {item.items?.length || 0} items
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderRecreationItem = ({ item }) => (
        <TouchableOpacity
            style={styles.recreationCard}
            onPress={() => handleRecreationPress(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.photo_uri }}
                style={styles.recreationImage}
                resizeMode="cover"
            />
            <View style={styles.recreationOverlay}>
                <Text style={styles.recreationTitle} numberOfLines={1}>
                    {item.movie_title}
                </Text>
                <Text style={styles.recreationLocation} numberOfLines={1}>
                    {item.location_name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderCreateBoardCard = () => (
        <TouchableOpacity
            style={[styles.boardCard, styles.createBoardCard]}
            onPress={handleCreateBoard}
            activeOpacity={0.7}
        >
            <View style={styles.createBoardContent}>
                <Ionicons name="add-circle-outline" size={48} color={COLORS.accent} />
                <Text style={styles.createBoardText}>Create Board</Text>
            </View>
        </TouchableOpacity>
    );

    const renderCreateRecreationCard = () => (
        <TouchableOpacity
            style={[styles.recreationCard, styles.createRecreationCard]}
            onPress={() => navigation.navigate('Camera')}
            activeOpacity={0.7}
        >
            <View style={styles.createRecreationContent}>
                <Ionicons name="add-circle-outline" size={48} color={COLORS.accent} />
                <Text style={styles.createRecreationText}>New Recreation</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Hero Section */}
                <View style={styles.hero}>
                    <Text style={styles.greeting}>
                        Hi, {userName || 'Welcome'}!
                    </Text>
                    <Text style={styles.subtitle}>recreate iconic moments</Text>
                    <Text style={styles.tagline}>
                        Explore, travel and get better in your galleries not just memories!
                    </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.scenes_recreated || 0}</Text>
                        <Text style={styles.statLabel}>Scenes</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.statCard, styles.locationsCard]}
                        onPress={() => setShowLocationsModal(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.statNumber}>{nearbyCount + customLocationsCount}</Text>
                        <Text style={styles.statLabel}>Locations</Text>
                        <View style={styles.locationSubtext}>
                            <Text style={styles.locationDetail}>{nearbyCount} nearby</Text>
                            <Text style={styles.locationDetail}>{customLocationsCount} custom</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Add Location Button */}
                <TouchableOpacity
                    style={styles.addLocationButton}
                    onPress={handleAddLocation}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
                    <Text style={styles.addLocationText}>Add Custom Location</Text>
                </TouchableOpacity>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'boards' && styles.activeTab]}
                        onPress={() => setActiveTab('boards')}
                    >
                        <Text style={[styles.tabText, activeTab === 'boards' && styles.activeTabText]}>
                            Boards
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'recreations' && styles.activeTab]}
                        onPress={() => setActiveTab('recreations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'recreations' && styles.activeTabText]}>
                            Recreations
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'boards' ? (
                    <View style={styles.tabContent}>
                        <View style={styles.boardsGrid}>
                            {renderCreateBoardCard()}
                            {boards.map((board) => (
                                <View key={board.id}>
                                    {renderBoardItem({ item: board })}
                                </View>
                            ))}
                        </View>
                        {boards.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>📌</Text>
                                <Text style={styles.emptyTitle}>No boards yet</Text>
                                <Text style={styles.emptyText}>
                                    Create your first board to save movies and locations
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.tabContent}>
                        <View style={styles.recreationsGrid}>
                            {renderCreateRecreationCard()}
                            
                            {recreations.map((recreation) => (
                                <View key={recreation.id}>
                                    {renderRecreationItem({ item: recreation })}
                                </View>
                            ))}
                        </View>

                        {recreations.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🎬</Text>
                                <Text style={styles.emptyTitle}>No recreations yet</Text>
                                <Text style={styles.emptyText}>
                                    Start recreating scenes and they'll appear here
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Locations Modal */}
            <Modal
                visible={showLocationsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocationsModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>My Locations</Text>
                            <TouchableOpacity onPress={() => setShowLocationsModal(false)}>
                                <Ionicons name="close" size={28} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.locationsList}>
                            {/* Nearby Locations Section */}
                            {nearbyLocations.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="compass" size={20} color={COLORS.accent} />
                                        <Text style={styles.sectionTitle}>
                                            Nearby Locations ({nearbyLocations.length})
                                        </Text>
                                    </View>
                                    {nearbyLocations.map((location) => (
                                        <TouchableOpacity
                                            key={`nearby-${location.id}`}
                                            style={styles.locationItem}
                                            onPress={() => handleLocationPress(location)}
                                        >
                                            <View style={styles.locationIcon}>
                                                <Ionicons name="location" size={24} color={COLORS.accent} />
                                            </View>
                                            <View style={styles.locationItemInfo}>
                                                <Text style={styles.locationItemTitle}>
                                                    {location.movieTitle}
                                                </Text>
                                                <Text style={styles.locationItemSubtitle}>
                                                    {location.locationName}
                                                </Text>
                                                <Text style={styles.locationItemAddress}>
                                                    {location.address}
                                                </Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}

                            {/* Custom Locations Section */}
                            {customLocations.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="star" size={20} color={COLORS.warning} />
                                        <Text style={styles.sectionTitle}>
                                            My Custom Locations ({customLocations.length})
                                        </Text>
                                    </View>
                                    {customLocations.map((location) => (
                                        <View
                                            key={`custom-${location.id}`}
                                            style={styles.locationItemContainer}
                                        >
                                            <TouchableOpacity
                                                style={styles.locationItem}
                                                onPress={() => handleLocationPress(location)}
                                            >
                                                <View style={styles.locationIcon}>
                                                    <Ionicons name="star" size={24} color={COLORS.warning} />
                                                </View>
                                                <View style={styles.locationItemInfo}>
                                                    <Text style={styles.locationItemTitle}>
                                                        {location.movie_title}
                                                    </Text>
                                                    <Text style={styles.locationItemSubtitle}>
                                                        {location.location_name}
                                                    </Text>
                                                    <Text style={styles.locationItemAddress}>
                                                        {location.address}
                                                    </Text>
                                                </View>
                                                <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteCustomLocation(location.id)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </>
                            )}

                            {nearbyLocations.length === 0 && customLocations.length === 0 && (
                                <View style={styles.emptyLocations}>
                                    <Ionicons name="location-outline" size={64} color={COLORS.textMuted} />
                                    <Text style={styles.emptyLocationsText}>No locations yet</Text>
                                    <Text style={styles.emptyLocationsSubtext}>
                                        Add custom locations or enable location services to see nearby spots
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
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
    hero: {
        marginBottom: SPACING.xl,
    },
    greeting: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.sizes.lg,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    tagline: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationsCard: {
        borderColor: COLORS.accent,
        borderWidth: 2,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    locationSubtext: {
        alignItems: 'center',
    },
    locationDetail: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textMuted,
    },
    addLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.accent,
        borderStyle: 'dashed',
        marginBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    addLocationText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.accent,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: 4,
        marginBottom: SPACING.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.sm,
    },
    activeTab: {
        backgroundColor: COLORS.accent,
    },
    tabText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    activeTabText: {
        color: COLORS.background,
    },
    tabContent: {
        marginBottom: SPACING.xl,
    },
    boardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    boardCard: {
        width: BOARD_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    createBoardCard: {
        justifyContent: 'center',
        alignItems: 'center',
        height: BOARD_WIDTH + 60,
    },
    createBoardContent: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    createBoardText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.accent,
    },
    boardPreview: {
        width: '100%',
        height: BOARD_WIDTH,
        backgroundColor: COLORS.background,
    },
    previewGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    previewImageContainer: {
        width: '50%',
        height: '50%',
        padding: 1,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.border,
    },
    emptyPreview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    boardInfo: {
        padding: SPACING.md,
    },
    boardTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    boardCount: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    createRecreationCard: {
        justifyContent: 'center',
        alignItems: 'center',
        height: RECREATION_WIDTH * 1.3,
        borderWidth: 2,
        borderColor: COLORS.accent,
        borderStyle: 'dashed',
        backgroundColor: COLORS.surface,
    },
    createRecreationContent: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    createRecreationText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.accent,
    },
    recreationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    recreationCard: {
        width: RECREATION_WIDTH,
        height: RECREATION_WIDTH * 1.3,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    recreationImage: {
        width: '100%',
        height: '100%',
    },
    recreationOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: SPACING.md,
    },
    recreationTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.background,
        marginBottom: SPACING.xs,
    },
    recreationLocation: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.background,
        opacity: 0.8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
    },
    locationsList: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
        marginTop: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
    },
    locationItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    deleteButton: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: SPACING.md,
    },
    locationItemInfo: {
        flex: 1,
    },
    locationItemTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    locationItemSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    locationItemAddress: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textMuted,
    },
    emptyLocations: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyLocationsText: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptyLocationsSubtext: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
    },
});