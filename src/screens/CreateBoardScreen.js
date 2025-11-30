// screens/CreateBoardScreen.js - Create New Board

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { createBoard } from '../utils/storage';

export default function CreateBoardScreen({ navigation }) {
    const [boardName, setBoardName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateBoard = async () => {
        if (!boardName.trim()) {
            Alert.alert('Error', 'Please enter a board name');
            return;
        }

        try {
            setLoading(true);
            const newBoard = await createBoard(boardName.trim());
            
            if (newBoard) {
                navigation.goBack();
                // Navigate to the newly created board
                setTimeout(() => {
                    navigation.navigate('BoardDetail', {
                        boardId: newBoard.id,
                        boardTitle: newBoard.name,
                    });
                }, 100);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create board');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Board</Text>
                    <Text style={styles.subtitle}>
                        Organize your favorite movies and locations
                    </Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Board Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Romantic Comedies, Dream Destinations..."
                        placeholderTextColor={COLORS.textMuted}
                        value={boardName}
                        onChangeText={setBoardName}
                        autoFocus
                        maxLength={50}
                    />
                    <Text style={styles.charCount}>{boardName.length}/50</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.createButton]}
                        onPress={handleCreateBoard}
                        disabled={loading || !boardName.trim()}
                    >
                        <Text style={styles.createButtonText}>
                            {loading ? 'Creating...' : 'Create'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.xl,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },
    charCount: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        textAlign: 'right',
        marginTop: SPACING.xs,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: 'auto',
    },
    button: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cancelButtonText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
    },
    createButton: {
        backgroundColor: COLORS.accent,
    },
    createButtonText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.background,
    },
});