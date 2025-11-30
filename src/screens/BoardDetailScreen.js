// screens/BoardDetailScreen.js - Updated Board Detail View

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getBoardById, removeItemFromBoard, deleteBoard } from '../utils/storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.lg * 3) / 2;

export default function BoardDetailScreen({ route, navigation }) {
    const { boardId, boardTitle } = route.params;
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadBoardData();
        }, [boardId])
    );

    useEffect(() => {
        navigation.setOptions({
            title: boardTitle,
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleDeleteBoard}
                >
                    <Ionicons name="trash-outline" size={24} color={COLORS.error} />
                </TouchableOpacity>
            ),
        });
    }, [boardTitle]);

    const loadBoardData = async () => {
        try {
            const boardData = await getBoardById(boardId);
            setBoard(boardData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading board data:', error);
            setLoading(false);
        }
    };

    const handleItemPress = (item) => {
        if (item.type === 'movie') {
            navigation.navigate('MovieDetail', {
                movieId: parseInt(item.id),
            });
        } else if (item.type === 'location') {
            navigation.navigate('Map', {
                selectedLocation: item.data,
            });
        }
    };

    const handleRemoveItem = async (item) => {
        Alert.alert(
            'Remove Item',
            `Remove "${item.title}" from this board?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await removeItemFromBoard(boardId, item.id, item.type);
                        if (success) {
                            loadBoardData();
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteBoard = () => {
        Alert.alert(
            'Delete Board',
            `Delete "${boardTitle}"? This will remove all saved items.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteBoard(boardId);
                        if (success) {
                            navigation.goBack();
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCard}
            onPress={() => handleItemPress(item)}
            onLongPress={() => handleRemoveItem(item)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.itemImage, styles.placeholderImage]}>
                        <Ionicons
                            name={item.type === 'movie' ? 'film' : 'location'}
                            size={48}
                            color={COLORS.textMuted}
                        />
                    </View>
                )}
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                {item.year && (
                    <Text style={styles.itemSubtitle}>
                        {item.year}
                    </Text>
                )}
                {item.rating && (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={COLORS.warning} />
                        <Text style={styles.rating}>
                            {item.rating.toFixed(1)}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    if (!board) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Board not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {board.items && board.items.length > 0 ? (
                <FlatList
                    data={board.items}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📁</Text>
                    <Text style={styles.emptyTitle}>Board is empty</Text>
                    <Text style={styles.emptyText}>
                        Save movies or locations to see them here
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    headerButton: {
        marginRight: SPACING.md,
    },
    listContent: {
        padding: SPACING.lg,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    itemCard: {
        width: ITEM_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    imageContainer: {
        width: '100%',
        height: ITEM_WIDTH * 1.5,
    },
    itemImage: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.border,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    itemInfo: {
        padding: SPACING.md,
    },
    itemTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    itemSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    rating: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
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