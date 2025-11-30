// screens/MovieDetailScreen.js - Movie Detail View

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getMovieDetails, getImageUrl } from '../utils/tmdbApi';
import { getLocationsByMovieId } from '../utils/filmingLocations';
import { addToBucketList } from '../utils/db';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen({ route, navigation }) {
    const { movieId, movieData } = route.params;
    const [movie, setMovie] = useState(movieData || null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(!movieData);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        loadMovieData();
    }, [movieId]);

    const loadMovieData = async () => {
        try {
            if (!movie) {
                const detailedMovie = await getMovieDetails(movieId);
                setMovie(detailedMovie);
            }

            // Load filming locations for this movie
            const filmingLocations = getLocationsByMovieId(movieId);
            setLocations(filmingLocations);

            setLoading(false);
        } catch (error) {
            console.error('Error loading movie data:', error);
            setLoading(false);
        }
    };

    const handleSaveToList = () => {
        if (locations.length > 0) {
            // Save first location to bucket list
            addToBucketList(locations[0].id, `From ${movie.title}`);
            setIsSaved(true);
            Alert.alert('Saved', 'Added to your bucket list!');
        } else {
            Alert.alert(
                'No Locations',
                'No filming locations available for this movie yet.'
            );
        }
    };

    const handleNavigateToLocation = (location) => {
        navigation.navigate('Map', {
            selectedLocation: location,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load movie details</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Movie Poster & Info */}
            <View style={styles.header}>
                <Image
                    source={{ uri: getImageUrl(movie.poster_path, 'w500') }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.releaseDate}>
                        {movie.release_date?.substring(0, 4) || 'N/A'}
                    </Text>
                    {movie.vote_average > 0 && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color={COLORS.warning} />
                            <Text style={styles.rating}>
                                {movie.vote_average.toFixed(1)}/10
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
                <View style={styles.genresContainer}>
                    {movie.genres.map((genre) => (
                        <View key={genre.id} style={styles.genreTag}>
                            <Text style={styles.genreText}>{genre.name}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Overview */}
            {movie.overview && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                </View>
            )}

            {/* Filming Locations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Filming Locations ({locations.length})
                </Text>
                {locations.length > 0 ? (
                    locations.map((location) => (
                        <TouchableOpacity
                            key={location.id}
                            style={styles.locationCard}
                            onPress={() => handleNavigateToLocation(location)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.locationIcon}>
                                <Ionicons name="location" size={24} color={COLORS.accent} />
                            </View>
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationName}>
                                    {location.locationName}
                                </Text>
                                <Text style={styles.locationAddress}>
                                    {location.address}
                                </Text>
                                <Text style={styles.locationScene}>
                                    {location.sceneDescription}
                                </Text>
                                {location.difficulty && (
                                    <View style={styles.difficultyBadge}>
                                        <Text style={styles.difficultyText}>
                                            {location.difficulty}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color={COLORS.textMuted}
                            />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyLocations}>
                        <Text style={styles.emptyText}>
                            No filming locations available yet
                        </Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleSaveToList}
                    disabled={isSaved || locations.length === 0}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isSaved ? 'checkmark' : 'bookmark-outline'}
                        size={20}
                        color={COLORS.background}
                    />
                    <Text style={styles.actionButtonText}>
                        {isSaved ? 'Saved' : 'Save to List'}
                    </Text>
                </TouchableOpacity>

                {locations.length > 0 && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Camera')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="camera" size={20} color={COLORS.accent} />
                        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                            Recreate Scene
                        </Text>
                    </TouchableOpacity>
                )}
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
        paddingBottom: SPACING.xl,
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
    header: {
        flexDirection: 'row',
        padding: SPACING.lg,
        gap: SPACING.lg,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.border,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    releaseDate: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    rating: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    genreTag: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    genreText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.text,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    overview: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    locationCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationIcon: {
        marginRight: SPACING.md,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    locationAddress: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    locationScene: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.accent,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
        marginTop: SPACING.xs,
    },
    difficultyText: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.background,
        fontWeight: '600',
    },
    emptyLocations: {
        padding: SPACING.lg,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textMuted,
    },
    actionButtons: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    actionButtonText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.background,
    },
    secondaryButtonText: {
        color: COLORS.accent,
    },
});