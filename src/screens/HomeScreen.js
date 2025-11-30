// screens/HomeScreen.js - Updated Home Screen with Boards

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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats } from '../utils/db';
import { getTrendingMovies, getRomanceMovies, getImageUrl } from '../utils/tmdbApi';

const { width } = Dimensions.get('window');
const BOARD_WIDTH = (width - SPACING.lg * 3) / 2;

export default function HomeScreen({ navigation }) {
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
    });
    const [boards, setBoards] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Define boards with categories
    const BOARD_CATEGORIES = [
        { id: 'trending', title: 'Trending', emoji: '🔥' },
        { id: 'romance', title: 'Romance', emoji: '💕' },
        { id: 'locations', title: 'Locations', emoji: '📍' },
        { id: 'recreations', title: 'Recreations', emoji: '🎬' },
    ];

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            const userStats = getUserStats();
            setStats(userStats);

            // Load board previews
            const trendingData = await getTrendingMovies('week');
            const romanceData = await getRomanceMovies(1);

            const boardsData = [
                {
                    id: 'trending',
                    title: 'Trending',
                    emoji: '🔥',
                    count: trendingData.results.length,
                    preview: trendingData.results.slice(0, 4),
                },
                {
                    id: 'romance',
                    title: 'Romance',
                    emoji: '💕',
                    count: romanceData.results.length,
                    preview: romanceData.results.slice(0, 4),
                },
                {
                    id: 'locations',
                    title: 'Locations',
                    emoji: '📍',
                    count: 10, // From filming locations database
                    preview: [],
                },
                {
                    id: 'recreations',
                    title: 'My Recreations',
                    emoji: '🎬',
                    count: userStats.scenes_recreated || 0,
                    preview: [],
                },
            ];

            setBoards(boardsData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading home data:', error);
            setLoading(false);
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
            boardTitle: board.title 
        });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Heading Section */}
            <View style={styles.hero}>
                <Text style={styles.greeting}>Hi, Welcome!</Text>
                <Text style={styles.subtitle}>recreate iconic moments</Text>
                <Text style={styles.tagline}>
                    Explore, travel and get getter in your galleries not just memories!
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
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{boards.length}</Text>
                    <Text style={styles.statLabel}>Boards</Text>
                </View>
            </View>

            {/* Boards Grid */}
            <View style={styles.boardsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Boards</Text>
                    <Text style={styles.sectionSubtitle}>
                        Tap on a board to view all ideas
                    </Text>
                </View>

                <View style={styles.boardsGrid}>
                    {boards.map((board) => (
                        <TouchableOpacity
                            key={board.id}
                            style={styles.boardCard}
                            onPress={() => handleBoardPress(board)}
                            activeOpacity={0.7}
                        >
                            {/* Board Preview Grid */}
                            <View style={styles.boardPreview}>
                                {board.preview.length > 0 ? (
                                    <View style={styles.previewGrid}>
                                        {board.preview.slice(0, 4).map((movie, index) => (
                                            <View
                                                key={index}
                                                style={styles.previewImageContainer}
                                            >
                                                <Image
                                                    source={{
                                                        uri: getImageUrl(movie.poster_path, 'w200'),
                                                    }}
                                                    style={styles.previewImage}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.emptyPreview}>
                                        <Text style={styles.emptyPreviewEmoji}>
                                            {board.emoji}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Board Info */}
                            <View style={styles.boardInfo}>
                                <Text style={styles.boardTitle}>{board.title}</Text>
                                <Text style={styles.boardCount}>{board.count} items</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
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
    boardsSection: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    sectionSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
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
    emptyPreviewEmoji: {
        fontSize: 48,
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
});