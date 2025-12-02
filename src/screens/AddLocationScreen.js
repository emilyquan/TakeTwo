// screens/AddLocationScreen.js - Add Custom Movie Locations

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { addMovieLocation } from '../utils/db';

export default function AddLocationScreen({ navigation }) {
    const [movieTitle, setMovieTitle] = useState('');
    const [sceneDescription, setSceneDescription] = useState('');
    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const difficulties = ['easy', 'medium', 'hard'];

    // Get current location and reverse geocode to address
    const handleGetCurrentLocation = async () => {
        try {
            setGettingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant location permission to use this feature'
                );
                setGettingLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());

            // Try to get address from coordinates
            const addresses = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (addresses.length > 0) {
                const addr = addresses[0];
                const formattedAddress = [
                    addr.street,
                    addr.city,
                    addr.region,
                    addr.country,
                ]
                    .filter(Boolean)
                    .join(', ');
                setAddress(formattedAddress);
            }

            Alert.alert('Success', 'Current location captured!');
            setGettingLocation(false);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Failed to get current location');
            setGettingLocation(false);
        }
    };

    // Validate form inputs
    const validateForm = () => {
        if (!movieTitle.trim()) {
            Alert.alert('Error', 'Please enter a movie title');
            return false;
        }
        if (!locationName.trim()) {
            Alert.alert('Error', 'Please enter a location name');
            return false;
        }
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter an address');
            return false;
        }
        if (!latitude || !longitude) {
            Alert.alert('Error', 'Please provide location coordinates');
            return false;
        }
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            Alert.alert('Error', 'Latitude and longitude must be valid numbers');
            return false;
        }
        return true;
    };

    // Save the new custom location
    const handleSaveLocation = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const locationData = {
                movieTitle: movieTitle.trim(),
                sceneDescription: sceneDescription.trim() || 'Custom location',
                locationName: locationName.trim(),
                address: address.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                genre: 'custom',
                difficulty: difficulty,
                imageUrl: null,
            };

            const locationId = addMovieLocation(locationData);

            if (locationId) {
                Alert.alert(
                    'Success!',
                    'Location added successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to add location');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error saving location:', error);
            Alert.alert('Error', 'Failed to save location');
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Ionicons name="location" size={48} color={COLORS.accent} />
                    <Text style={styles.title}>Add Custom Location</Text>
                    <Text style={styles.subtitle}>
                        Add your favorite movie filming location
                    </Text>
                </View>

                <View style={styles.form}>
                    {/* Movie Title */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Movie Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., The Notebook"
                            placeholderTextColor={COLORS.textMuted}
                            value={movieTitle}
                            onChangeText={setMovieTitle}
                        />
                    </View>

                    {/* Scene Description */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Scene Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe the scene that takes place here..."
                            placeholderTextColor={COLORS.textMuted}
                            value={sceneDescription}
                            onChangeText={setSceneDescription}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Location Name */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Location Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Boone Hall Plantation"
                            placeholderTextColor={COLORS.textMuted}
                            value={locationName}
                            onChangeText={setLocationName}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full address"
                            placeholderTextColor={COLORS.textMuted}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    {/* Coordinates */}
                    <View style={styles.coordinatesContainer}>
                        <View style={styles.coordinateGroup}>
                            <Text style={styles.label}>Latitude *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., 49.2827"
                                placeholderTextColor={COLORS.textMuted}
                                value={latitude}
                                onChangeText={setLatitude}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.coordinateGroup}>
                            <Text style={styles.label}>Longitude *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., -123.1207"
                                placeholderTextColor={COLORS.textMuted}
                                value={longitude}
                                onChangeText={setLongitude}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.getCurrentLocationButton}
                        onPress={handleGetCurrentLocation}
                        disabled={gettingLocation}
                    >
                        <Ionicons
                            name="locate"
                            size={20}
                            color={gettingLocation ? COLORS.textMuted : COLORS.accent}
                        />
                        <Text
                            style={[
                                styles.getCurrentLocationText,
                                gettingLocation && styles.getCurrentLocationTextDisabled,
                            ]}
                        >
                            {gettingLocation ? 'Getting location...' : 'Use Current Location'}
                        </Text>
                    </TouchableOpacity>

                    {/* Difficulty */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Difficulty</Text>
                        <View style={styles.difficultyContainer}>
                            {difficulties.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.difficultyChip,
                                        difficulty === level && styles.difficultyChipActive,
                                    ]}
                                    onPress={() => setDifficulty(level)}
                                >
                                    <Text
                                        style={[
                                            styles.difficultyText,
                                            difficulty === level && styles.difficultyTextActive,
                                        ]}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={20} color={COLORS.accent} />
                        <Text style={styles.infoText}>
                            Tip: You can find coordinates by searching the location on Google Maps
                            and clicking on the location pin.
                        </Text>
                    </View>
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
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSaveLocation}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Save Location'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    form: {
        marginBottom: SPACING.xl,
    },
    formGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
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
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    coordinatesContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    coordinateGroup: {
        flex: 1,
    },
    getCurrentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.accent,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    getCurrentLocationText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.accent,
    },
    getCurrentLocationTextDisabled: {
        color: COLORS.textMuted,
    },
    difficultyContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    difficultyChip: {
        flex: 1,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    difficultyChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    difficultyText: {
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
    },
    difficultyTextActive: {
        color: COLORS.background,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.accent,
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },
    infoText: {
        flex: 1,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
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
    saveButton: {
        backgroundColor: COLORS.accent,
    },
    saveButtonText: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.background,
    },
});