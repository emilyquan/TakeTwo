// screens/SettingsScreen.js - Settings and Profile

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { firebase_auth } from '../utils/firebase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getUserStats, resetDatabase } from '../utils/db';
import { clearAllStorage } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SettingsScreen({ navigation }) {
    const user = firebase_auth.currentUser;
    const [stats, setStats] = useState({
        scenes_recreated: 0,
        locations_visited: 0,
        miles_traveled: 0,
        days_active: 0,
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const userStats = getUserStats();
            setStats(userStats);
        }, [])
    );

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
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
        ]);
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all your recreations, bucket list, and stats. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await resetDatabase();
                            await clearAllStorage();
                            Alert.alert('Success', 'All data cleared');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear data');
                        }
                    },
                },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, rightElement }) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={styles.settingIcon}>
                <Ionicons name={icon} size={24} color={COLORS.text} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement || (
                onPress && <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.email?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.email}>{user?.email || 'No email'}</Text>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.scenes_recreated || 0}</Text>
                        <Text style={styles.statLabel}>Scenes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.locations_visited || 0}</Text>
                        <Text style={styles.statLabel}>Locations</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.miles_traveled || 0}</Text>
                        <Text style={styles.statLabel}>Miles</Text>
                    </View>
                </View>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="notifications-outline"
                        title="Notifications"
                        subtitle="Get alerts for nearby locations"
                        rightElement={
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: COLORS.disabled, true: COLORS.accent }}
                                thumbColor={COLORS.background}
                            />
                        }
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="moon-outline"
                        title="Dark Mode"
                        subtitle="Switch to dark theme"
                        rightElement={
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ false: COLORS.disabled, true: COLORS.accent }}
                                thumbColor={COLORS.background}
                            />
                        }
                    />
                </View>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="information-circle-outline"
                        title="About TakeTwo"
                        subtitle="Version 1.0.0"
                        onPress={() => {}}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="document-text-outline"
                        title="Privacy Policy"
                        onPress={() => {}}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="shield-checkmark-outline"
                        title="Terms of Service"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Data Management */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="trash-outline"
                        title="Clear All Data"
                        subtitle="Delete recreations, bucket list, and stats"
                        onPress={handleClearData}
                    />
                </View>
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with â¤ï¸ for movie lovers</Text>
                <Text style={styles.footerText}>Â© 2024 TakeTwo</Text>
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
    profileSection: {
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
        borderWidth: 2,
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
        marginBottom: SPACING.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: SPACING.lg,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
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
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    settingIcon: {
        marginRight: SPACING.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: SPACING.lg + 24 + SPACING.md,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    signOutText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.error,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    footerText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
});