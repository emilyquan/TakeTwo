// Profile Screen

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { firebase_auth } from '../utils/firebase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats } from '../utils/db';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
    const user = firebase_auth.currentUser;
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
        miles_traveled: 0,
        days_active: 0,
    });

    useFocusEffect(
        React.useCallback(() => {
            const userStats = getUserStats();
            setStats(userStats);
        }, [])
    );

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(firebase_auth);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.email?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.email}>{user?.email || 'No email'}</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.scenes_recreated || 0}</Text>
                    <Text style={styles.statLabel}>Scenes</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.locations_visited || 0}</Text>
                    <Text style={styles.statLabel}>Locations</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.miles_traveled || 0}</Text>
                    <Text style={styles.statLabel}>Miles</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.days_active || 0}</Text>
                    <Text style={styles.statLabel}>Days Active</Text>
                </View>
            </View>

            {/* Achievements Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achievementsList}>
                    <View style={styles.achievementItem}>
                        <Text style={styles.achievementIcon}>🎬</Text>
                        <View style={styles.achievementContent}>
                            <Text style={styles.achievementTitle}>Director's Cut</Text>
                            <Text style={styles.achievementDesc}>Recreate 10 scenes</Text>
                        </View>
                    </View>
                    <View style={styles.achievementItem}>
                        <Text style={styles.achievementIcon}>🗺️</Text>
                        <View style={styles.achievementContent}>
                            <Text style={styles.achievementTitle}>World Traveler</Text>
                            <Text style={styles.achievementDesc}>Visit 5 cities</Text>
                        </View>
                    </View>
                    <View style={styles.achievementItem}>
                        <Text style={styles.achievementIcon}>☕</Text>
                        <View style={styles.achievementContent}>
                            <Text style={styles.achievementTitle}>Cafe Connoisseur</Text>
                            <Text style={styles.achievementDesc}>Visit 20 cafes</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity 
                style={styles.signOutButton} 
                onPress={handleSignOut}
                activeOpacity={0.7}
            >
                <Text style={styles.signOutText}>Sign Out</Text>
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '600',
        color: COLORS.text,
    },
    email: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
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
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    achievementsList: {
        gap: SPACING.sm,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    achievementIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
    achievementDesc: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
    },
    signOutButton: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    signOutText: {
        color: COLORS.error,
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
});