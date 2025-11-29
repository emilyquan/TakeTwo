// Scene Library
// In-progress

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function SceneLibraryScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Scene Library</Text>
            <Text style={styles.subtitle}>Browse iconic movie scenes</Text>

            <View style={styles.comingSoon}>
                <Text style={styles.emoji}>🎬</Text>
                <Text style={styles.comingSoonTitle}>Coming Soon</Text>
                <View style={styles.featureList}>
                    <Text style={styles.feature}>• Curated movie scenes</Text>
                    <Text style={styles.feature}>• Filter by genre & difficulty</Text>
                    <Text style={styles.feature}>• Search specific movies</Text>
                    <Text style={styles.feature}>• Save to bucket list</Text>
                    <Text style={styles.feature}>• View trending recreations</Text>
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
        marginBottom: SPACING.xs,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: FONTS.sizes.lg,
        color: COLORS.textLight,
        marginBottom: SPACING.xxl,
    },
    comingSoon: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xxl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emoji: {
        fontSize: 64,
        marginBottom: SPACING.lg,
    },
    comingSoonTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xl,
    },
    featureList: {
        alignSelf: 'stretch',
        gap: SPACING.sm,
    },
    feature: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        lineHeight: 24,
    },
});