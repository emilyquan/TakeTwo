// screens/RecreationDetailScreen.js - Recreation Detail View

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { deleteRecreation } from '../utils/db';

export default function RecreationDetailScreen({ route, navigation }) {
    const { recreation } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my recreation of ${recreation.movie_title}!`,
                url: recreation.photo_uri,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Recreation',
            'Are you sure you want to delete this recreation?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = deleteRecreation(recreation.id);
                        if (success) {
                            navigation.goBack();
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={{ uri: recreation.photo_uri }}
                    style={styles.image}
                    resizeMode="contain"
                />

                <View style={styles.info}>
                    <Text style={styles.title}>{recreation.movie_title}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={20} color={COLORS.accent} />
                        <Text style={styles.location}>{recreation.location_name}</Text>
                    </View>

                    {recreation.notes && (
                        <View style={styles.notesSection}>
                            <Text style={styles.notesTitle}>Notes</Text>
                            <Text style={styles.notes}>{recreation.notes}</Text>
                        </View>
                    )}

                    {recreation.rating && (
                        <View style={styles.ratingSection}>
                            <Text style={styles.ratingLabel}>Rating:</Text>
                            <View style={styles.stars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name={star <= recreation.rating ? 'star' : 'star-outline'}
                                        size={24}
                                        color={COLORS.warning}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    {recreation.created_at && (
                        <Text style={styles.date}>
                            Created {new Date(recreation.created_at).toLocaleDateString()}
                        </Text>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={24} color={COLORS.error} />
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                    </TouchableOpacity>
                </View>
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
        paddingBottom: SPACING.xl,
    },
    image: {
        width: '100%',
        height: 400,
        backgroundColor: COLORS.border,
    },
    info: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    location: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    notesSection: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
    },
    notesTitle: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    notes: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        lineHeight: 22,
    },
    ratingSection: {
        marginBottom: SPACING.md,
    },
    ratingLabel: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    stars: {
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    date: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.sm,
    },
    actionText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.accent,
    },
    deleteButton: {
        borderColor: COLORS.error,
    },
    deleteText: {
        color: COLORS.error,
    },
});