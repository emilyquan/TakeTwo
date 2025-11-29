// Home Screen
// Referenced in-class code

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats, getAllMovieLocations } from '../utils/db';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
        miles_traveled: 0,
        days_active: 0,
    });
    const [locations, setLocations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = () => {
        const userStats = getUserStats();
        const allLocations = getAllMovieLocations();
        setStats(userStats);
        setLocations(allLocations);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData();
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.greeting}>Discover</Text>
                <Text style={styles.subtitle}>Movie locations near you</Text>
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
                    <Text style={styles.statNumber}>{locations.length}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                </View>
            </View>

            {/* Featured Challenge */}
            {locations.length > 0 && (
                <View style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <Text style={styles.challengeBadge}>Featured</Text>
                    </View>
                    <Text style={styles.challengeTitle}>{locations[0].movie_title}</Text>
                    <Text style={styles.challengeLocation}>{locations[0].location_name}</Text>
                </View>
            )}

            {/* Quick Actions */}
            <View style={styles.actionsGrid}>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('Scenes')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.actionIcon}>🎬</Text>
                    <Text style={styles.actionTitle}>Browse</Text>
                    <Text style={styles.actionSubtitle}>Explore scenes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('Camera')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.actionIcon}>📷</Text>
                    <Text style={styles.actionTitle}>Capture</Text>
                    <Text style={styles.actionSubtitle}>Take a photo</Text>
                </TouchableOpacity>
            </View>

            {/* Data Demo Link */}
            <TouchableOpacity
                style={styles.demoLink}
                onPress={() => navigation.navigate('DataDemo')}
                activeOpacity={0.7}
            >
                <Text style={styles.demoText}>View Storage Demo →</Text>
            </TouchableOpacity>
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
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: FONTS.sizes.lg,
        color: COLORS.textLight,
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
    challengeCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    challengeHeader: {
        marginBottom: SPACING.md,
    },
    challengeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.accent,
        color: COLORS.background,
        fontSize: FONTS.sizes.xs,
        fontWeight: '600',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        overflow: 'hidden',
    },
    challengeTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    challengeLocation: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    actionTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    actionSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    demoLink: {
        alignItems: 'center',
        padding: SPACING.md,
    },
    demoText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
    },
});