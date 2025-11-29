// Bucket List
// In-progress

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function BucketListScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>📍</Text>
                <Text style={styles.title}>My Bucket List</Text>
                <Text style={styles.subtitle}>
                    Save locations you want to visit
                </Text>
            </View>

            <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✨</Text>
                <Text style={styles.emptyTitle}>No saved locations yet</Text>
                <Text style={styles.emptyText}>
                    Start exploring and add movie locations to your bucket list!
                </Text>
            </View>

            <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>🗂️ Upcoming Features</Text>
                <Text style={styles.featureText}>
                    • Pinterest-style visual board{'\n'}
                    • Categories: "Want to Visit", "Completed", "Dream Locations"{'\n'}
                    • Distance calculator to each location{'\n'}
                    • Plan route between multiple locations{'\n'}
                    • AsyncStorage + Firestore for data persistence
                </Text>
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
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    headerEmoji: {
        fontSize: 64,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONTS.sizes.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    emptyState: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xxl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    emptyTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    featureCard: {
        backgroundColor: COLORS.gray100,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    featureTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    featureText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        lineHeight: 24,
    },
});