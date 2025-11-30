// screens/HomeScreen.js - Updated with Boards and Recreations Tabs

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
    FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats, getAllRecreations } from '../utils/db';
import { getUserPreferences, getUserBoards } from '../utils/storage';

const { width } = Dimensions.get('window');
const BOARD_WIDTH = (width - SPACING.lg * 3) / 2;
const RECREATION_WIDTH = (width - SPACING.lg * 3) / 2;

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
    });
    const [activeTab, setActiveTab] = useState('boards'); // 'boards' or 'recreations'
    const [boards, setBoards] = useState([]);
    const [recreations, setRecreations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
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
        } catch (error) {
            console.error('Error loading home data:', error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadData();
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
        // Navigate to recreation detail or open image viewer
        navigation.navigate('RecreationDetail', { recreation });
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
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.locations_visited || 0}</Text>
                        <Text style={styles.statLabel}>Locations</Text>
                    </View>
                </View>

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
                                <Text style={styles.emptyEmoji}>📁</Text>
                                <Text style={styles.emptyTitle}>No boards yet</Text>
                                <Text style={styles.emptyText}>
                                    Create your first board to save movies and locations
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.tabContent}>
                        {recreations.length > 0 ? (
                            <View style={styles.recreationsGrid}>
                                {recreations.map((recreation) => (
                                    <View key={recreation.id}>
                                        {renderRecreationItem({ item: recreation })}
                                    </View>
                                ))}
                            </View>
                        ) : (
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
        marginBottom: SPACING.xl,
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
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
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
});