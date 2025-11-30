// screens/BoardDetailScreen.js - Board Detail View

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
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import {
    getTrendingMovies,
    getRomanceMovies,
    getImageUrl,
} from '../utils/tmdbApi';
import { getAllFilmingLocations } from '../utils/filmingLocations';
import { getAllRecreations } from '../utils/db';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.lg * 3) / 2;

export default function BoardDetailScreen({ route, navigation }) {
    const { boardId, boardTitle } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({ title: boardTitle });
        loadBoardData();
    }, [boardId]);

    const loadBoardData = async () => {
        try {
            let data = [];

            switch (boardId) {
                case 'trending':
                    const trendingData = await getTrendingMovies('week');
                    data = trendingData.results.map(movie => ({
                        id: movie.id,
                        type: 'movie',
                        title: movie.title,
                        subtitle: movie.release_date?.substring(0, 4) || 'N/A',
                        imageUrl: getImageUrl(movie.poster_path),
                        data: movie,
                    }));
                    break;

                case 'romance':
                    const romanceData = await getRomanceMovies(1);
                    data = romanceData.results.map(movie => ({
                        id: movie.id,
                        type: 'movie',
                        title: movie.title,
                        subtitle: movie.release_date?.substring(0, 4) || 'N/A',
                        imageUrl: getImageUrl(movie.poster_path),
                        data: movie,
                    }));
                    break;

                case 'locations':
                    const locations = getAllFilmingLocations();
                    data = locations.map(loc => ({
                        id: loc.id,
                        type: 'location',
                        title: loc.locationName,
                        subtitle: `${loc.movieTitle} • ${loc.city}`,
                        imageUrl: loc.imageUrl,
                        data: loc,
                    }));
                    break;

                case 'recreations':
                    const recreations = getAllRecreations();
                    data = recreations.map(rec => ({
                        id: rec.id,
                        type: 'recreation',
                        title: rec.movie_title,
                        subtitle: rec.location_name,
                        imageUrl: rec.photo_uri,
                        data: rec,
                    }));
                    break;
            }

            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading board data:', error);
            setLoading(false);
        }
    };

    const handleItemPress = (item) => {
        if (item.type === 'movie') {
            navigation.navigate('MovieDetail', {
                movieId: item.id,
                movieData: item.data,
            });
        }
        // Handle other item types as needed
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCard}
            onPress={() => handleItemPress(item)}
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
                        <Text style={styles.placeholderText}>🎬</Text>
                    </View>
                )}
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {item.subtitle}
                </Text>
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

    return (
        <View style={styles.container}>
            {items.length > 0 ? (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📋</Text>
                    <Text style={styles.emptyTitle}>No items yet</Text>
                    <Text style={styles.emptyText}>
                        Start exploring and add items to this board!
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
    placeholderText: {
        fontSize: 48,
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