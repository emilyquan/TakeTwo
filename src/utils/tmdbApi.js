// src/utils/tmdbApi.js - TMDB API Service

import axios from 'axios';

// IMPORTANT: Replace this with your actual TMDB API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = '41869625e9a8aa3a0f15a05ce425d9a6'; // <-- PUT YOUR REAL API KEY HERE

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with default config
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

// Helper to get full image URL
export const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/popular', {
            params: { page },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                with_genres: genreId,
                page,
                sort_by: 'popularity.desc',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        throw error;
    }
};

// Get movie genres
export const getGenres = async () => {
    try {
        const response = await tmdbApi.get('/genre/movie/list');
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

// Search movies
export const searchMovies = async (query, page = 1) => {
    try {
        const response = await tmdbApi.get('/search/movie', {
            params: {
                query,
                page,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'credits,images,videos',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

// Get trending movies
export const getTrendingMovies = async (timeWindow = 'week') => {
    try {
        const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        throw error;
    }
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

// Romance genre movies (for your use case)
export const getRomanceMovies = async (page = 1) => {
    try {
        // Romance genre ID is 10749
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                with_genres: '10749',
                page,
                sort_by: 'popularity.desc',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching romance movies:', error);
        throw error;
    }
};

export default tmdbApi;