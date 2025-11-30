// screens/MapScreen.js - Map with Filming Locations

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
    Linking,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { getAllFilmingLocations, getNearbyLocations } from '../utils/filmingLocations';

export default function MapScreen({ route, navigation }) {
    const mapRef = useRef(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(
        route.params?.selectedLocation || null
    );
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 50,
        longitudeDelta: 50,
    });

    useEffect(() => {
        requestLocationPermission();
        loadLocations();
    }, []);

    useEffect(() => {
        if (selectedLocation) {
            // Animate to selected location
            mapRef.current?.animateToRegion({
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [selectedLocation]);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                });
            } else {
                Alert.alert(
                    'Location Permission',
                    'Location access is needed to show nearby filming locations.'
                );
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    const loadLocations = () => {
        const allLocations = getAllFilmingLocations();
        setLocations(allLocations);
        setLoading(false);
    };

    const handleMarkerPress = (location) => {
        setSelectedLocation(location);
    };

    const handleGetDirections = () => {
        if (!selectedLocation) return;

        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latLng = `${selectedLocation.latitude},${selectedLocation.longitude}`;
        const label = selectedLocation.locationName;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url);
    };

    const handleRecreateScene = () => {
        if (selectedLocation) {
            navigation.navigate('Camera', {
                selectedLocation: selectedLocation,
            });
        }
    };

    const handleNavigateToMovie = () => {
        if (selectedLocation && selectedLocation.movieId) {
            navigation.navigate('MovieDetail', {
                movieId: selectedLocation.movieId,
            });
        }
    };

    const handleCenterOnUser = () => {
        if (userLocation) {
            mapRef.current?.animateToRegion({
                ...userLocation,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
        }
    };

    const handleShowNearby = () => {
        if (userLocation) {
            const nearby = getNearbyLocations(
                userLocation.latitude,
                userLocation.longitude,
                100 // 100km radius
            );
            
            if (nearby.length > 0) {
                setLocations(nearby);
                Alert.alert('Nearby Locations', `Found ${nearby.length} locations near you`);
            } else {
                Alert.alert('No Nearby Locations', 'No filming locations found within 100km');
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        onPress={() => handleMarkerPress(location)}
                        pinColor={
                            selectedLocation?.id === location.id
                                ? COLORS.accent
                                : COLORS.primary
                        }
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>
                                    {location.movieTitle}
                                </Text>
                                <Text style={styles.calloutSubtitle}>
                                    {location.locationName}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleCenterOnUser}
                >
                    <Ionicons name="locate" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleShowNearby}
                >
                    <Ionicons name="compass" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Selected Location Card */}
            {selectedLocation && (
                <View style={styles.locationCard}>
                    <ScrollView>
                        <View style={styles.locationHeader}>
                            <View style={styles.locationHeaderText}>
                                <Text style={styles.locationTitle}>
                                    {selectedLocation.movieTitle}
                                </Text>
                                <Text style={styles.locationSubtitle}>
                                    {selectedLocation.locationName}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setSelectedLocation(null)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.locationDescription}>
                            {selectedLocation.sceneDescription}
                        </Text>

                        <View style={styles.locationDetails}>
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name="location-outline"
                                    size={20}
                                    color={COLORS.textLight}
                                />
                                <Text style={styles.detailText}>
                                    {selectedLocation.address}
                                </Text>
                            </View>
                            
                            {selectedLocation.difficulty && (
                                <View style={styles.detailRow}>
                                    <Ionicons
                                        name="speedometer-outline"
                                        size={20}
                                        color={COLORS.textLight}
                                    />
                                    <Text style={styles.detailText}>
                                        Difficulty: {selectedLocation.difficulty}
                                    </Text>
                                </View>
                            )}

                            {selectedLocation.tips && (
                                <View style={styles.tipsContainer}>
                                    <Ionicons
                                        name="bulb-outline"
                                        size={20}
                                        color={COLORS.warning}
                                    />
                                    <Text style={styles.tipsText}>
                                        {selectedLocation.tips}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.primaryButton]}
                                onPress={handleGetDirections}
                            >
                                <Ionicons name="navigate" size={20} color={COLORS.background} />
                                <Text style={styles.actionButtonText}>Directions</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.secondaryButton]}
                                onPress={handleRecreateScene}
                            >
                                <Ionicons name="camera" size={20} color={COLORS.accent} />
                                <Text style={[styles.actionButtonText, styles.secondaryText]}>
                                    Recreate
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {selectedLocation.movieId && (
                            <TouchableOpacity
                                style={styles.viewMovieButton}
                                onPress={handleNavigateToMovie}
                            >
                                <Text style={styles.viewMovieText}>
                                    View Movie Details â†’
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    callout: {
        padding: SPACING.sm,
        minWidth: 150,
    },
    calloutTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    calloutSubtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    controls: {
        position: 'absolute',
        top: SPACING.lg,
        right: SPACING.lg,
        gap: SPACING.sm,
    },
    controlButton: {
        backgroundColor: COLORS.background,
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    locationCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    locationHeaderText: {
        flex: 1,
    },
    locationTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    locationSubtitle: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    locationDescription: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        marginBottom: SPACING.lg,
        lineHeight: 22,
    },
    locationDetails: {
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    detailText: {
        flex: 1,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    tipsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    tipsText: {
        flex: 1,
        fontSize: FONTS.sizes.sm,
        color: COLORS.text,
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    actionButton: {
        flex: 1,
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
    secondaryText: {
        color: COLORS.accent,
    },
    viewMovieButton: {
        alignItems: 'center',
        padding: SPACING.sm,
    },
    viewMovieText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.accent,
        fontWeight: '600',
    },
});