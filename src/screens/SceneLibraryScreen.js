// screens/SceneLibraryScreen.js - Updated with Search History

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import {
    getPopularMovies,
    getGenres,
    getMoviesByGenre,
    searchMovies,
    getImageUrl,
} from '../utils/tmdbApi';
import {
    addRecentSearch,
    getRecentSearches,
    clearRecentSearches,
} from '../utils/storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.lg * 3) / 2;

export default function SceneLibraryScreen({ navigation }) {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const searchInputRef = useRef(null);

    useEffect(() => {
        loadInitialData();
        loadRecentSearches();
    }, []);

    useEffect(() => {
        if (searchQuery.length > 2) {
            handleSearch();
        } else if (searchQuery.length === 0) {
            loadMovies();
            setShowSearchHistory(false);
        }
    }, [searchQuery]);

    const loadInitialData = async () => {
        try {
            const [genresData, moviesData] = await Promise.all([
                getGenres(),
                getPopularMovies(1),
            ]);
            setGenres(genresData);
            setMovies(moviesData.results);
            setLoading(false);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setLoading(false);
        }
    };

    const loadRecentSearches = async () => {
        const searches = await getRecentSearches();
        setRecentSearches(searches);
    };

    const loadMovies = async (genreId = null, pageNum = 1) => {
        try {
            setLoading(true);
            const data = genreId
                ? await getMoviesByGenre(genreId, pageNum)
                : await getPopularMovies(pageNum);
            
            if (pageNum === 1) {
                setMovies(data.results);
            } else {
                setMovies(prev => [...prev, ...data.results]);
            }
            setPage(pageNum);
            setLoading(false);
        } catch (error) {
            console.error('Error loading movies:', error);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchMovies(searchQuery, 1);
            setMovies(data.results);
            
            // Save to recent searches
            await addRecentSearch(searchQuery);
            await loadRecentSearches();
            
            setLoading(false);
            setShowSearchHistory(false);
        } catch (error) {
            console.error('Error searching movies:', error);
            setLoading(false);
        }
    };

    const handleSearchFocus = () => {
        setShowSearchHistory(true);
        loadRecentSearches();
    };

    const handleRecentSearchPress = (search) => {
        setSearchQuery(search);
        setShowSearchHistory(false);
    };

    const handleClearSearchHistory = async () => {
        await clearRecentSearches();
        setRecentSearches([]);
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre.id === selectedGenre ? null : genre.id);
        setSearchQuery('');
        setShowSearchHistory(false);
        loadMovies(genre.id === selectedGenre ? null : genre.id, 1);
    };

    const handleMoviePress = (movie) => {
        navigation.navigate('MovieDetail', {
            movieId: movie.id,
            movieData: movie,
        });
    };

    const handleLoadMore = () => {
        if (!loading) {
            loadMovies(selectedGenre, page + 1);
        }
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => handleMoviePress(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: getImageUrl(item.poster_path, 'w342') }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.movieYear}>
                    {item.release_date?.substring(0, 4) || 'N/A'}
                </Text>
                {item.vote_average > 0 && (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={COLORS.warning} />
                        <Text style={styles.rating}>
                            {item.vote_average.toFixed(1)}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderGenreChip = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.genreChip,
                selectedGenre === item.id && styles.genreChipActive,
            ]}
            onPress={() => handleGenreSelect(item)}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.genreChipText,
                    selectedGenre === item.id && styles.genreChipTextActive,
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color={COLORS.textMuted}
                    style={styles.searchIcon}
                />
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search movies..."
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={handleSearchFocus}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Search History Dropdown */}
            {showSearchHistory && recentSearches.length > 0 && (
                <View style={styles.searchHistoryContainer}>
                    <View style={styles.searchHistoryHeader}>
                        <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
                        <TouchableOpacity onPress={handleClearSearchHistory}>
                            <Text style={styles.clearHistoryText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    {recentSearches.map((search, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.searchHistoryItem}
                            onPress={() => handleRecentSearchPress(search)}
                        >
                            <Ionicons name="time-outline" size={20} color={COLORS.textMuted} />
                            <Text style={styles.searchHistoryText}>{search}</Text>
                            <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Genre Filters */}
            {!showSearchHistory && (
                <View style={styles.genresSection}>
                    <FlatList
                        horizontal
                        data={genres}
                        renderItem={renderGenreChip}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.genresList}
                    />
                </View>
            )}

            {/* Movies Grid */}
            {!showSearchHistory && (
                loading && movies.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.accent} />
                    </View>
                ) : (
                    <FlatList
                        data={movies}
                        renderItem={renderMovieItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.moviesGrid}
                        columnWrapperStyle={styles.row}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={COLORS.accent}
                                    style={styles.loadingMore}
                                />
                            ) : null
                        }
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        margin: SPACING.lg,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    searchHistoryContainer: {
        backgroundColor: COLORS.surface,
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        maxHeight: 300,
    },
    searchHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    searchHistoryTitle: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    clearHistoryText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.accent,
        fontWeight: '600',
    },
    searchHistoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        gap: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    searchHistoryText: {
        flex: 1,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    genresSection: {
        marginBottom: SPACING.md,
    },
    genresList: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    genreChip: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    genreChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    genreChipText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.text,
        fontWeight: '500',
    },
    genreChipTextActive: {
        color: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moviesGrid: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    movieCard: {
        width: ITEM_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    poster: {
        width: '100%',
        height: ITEM_WIDTH * 1.5,
        backgroundColor: COLORS.border,
    },
    movieInfo: {
        padding: SPACING.md,
    },
    movieTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    movieYear: {
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
    loadingMore: {
        marginVertical: SPACING.lg,
    },
});