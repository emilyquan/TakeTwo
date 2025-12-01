// Camera Screen - UPDATED VERSION WITH PINCH/PAN OVERLAY
// https://docs.expo.dev/versions/latest/sdk/camera/

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Modal,
    Dimensions,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';
import { saveRecreation, getMovieLocationById, addMovieLocation } from '../utils/db';
import { getAllFilmingLocations } from '../utils/filmingLocations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraScreen() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [overlayImage, setOverlayImage] = useState(null);
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const cameraRef = useRef(null);

    // Overlay transformation states
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const savedScale = useRef(1);
    const savedTranslateX = useRef(0);
    const savedTranslateY = useRef(0);

    useEffect(() => {
        const allLocations = getAllFilmingLocations();
        setLocations(allLocations);
    }, []);

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={64} color={COLORS.text} />
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionText}>
                    Take Two needs camera access to recreate scenes
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
                    <Text style={styles.primaryButtonText}>Grant Access</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const pickOverlayImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setOverlayImage(result.assets[0].uri);
                // Reset transformations when new image is selected
                scale.setValue(1);
                translateX.setValue(0);
                translateY.setValue(0);
                savedScale.current = 1;
                savedTranslateX.current = 0;
                savedTranslateY.current = 0;
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const removeOverlay = () => {
        setOverlayImage(null);
        // Reset transformations
        scale.setValue(1);
        translateX.setValue(0);
        translateY.setValue(0);
        savedScale.current = 1;
        savedTranslateX.current = 0;
        savedTranslateY.current = 0;
    };

    const resetOverlayTransform = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start();
        savedScale.current = 1;
        savedTranslateX.current = 0;
        savedTranslateY.current = 0;
    };

    const adjustOpacity = (direction) => {
        setOverlayOpacity((current) => {
            const newOpacity = direction === 'up' ? current + 0.1 : current - 0.1;
            return Math.max(0.1, Math.min(1, newOpacity));
        });
    };

    const takePicture = async () => {
        if (cameraRef.current && isCameraReady) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: false,
                });
                setCapturedPhoto(photo.uri);
                setShowPreview(true);
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    // FIXED: Ensure location exists in database before saving recreation
    const ensureLocationInDatabase = async (location) => {
        try {
            // Check if location already exists in the database
            const existingLocation = getMovieLocationById(location.id);
            
            if (existingLocation) {
                return existingLocation.id;
            }
            
            // If not, add it to the database
            const locationData = {
                movieTitle: location.movieTitle,
                sceneDescription: location.sceneDescription,
                locationName: location.locationName,
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                genre: location.tags ? location.tags[0] : null,
                difficulty: location.difficulty,
                imageUrl: location.imageUrl,
            };
            
            const newLocationId = addMovieLocation(locationData);
            return newLocationId;
        } catch (error) {
            console.error('Error ensuring location in database:', error);
            return null;
        }
    };

    const savePhoto = async () => {
        if (!capturedPhoto) return;

        try {
            if (!mediaPermission?.granted) {
                const { granted } = await requestMediaPermission();
                if (!granted) {
                    Alert.alert('Permission Required', 'Please grant permission to save photos');
                    return;
                }
            }

            // Save to device gallery
            await MediaLibrary.saveToLibraryAsync(capturedPhoto);

            if (selectedLocation) {
                // FIXED: Ensure the location exists in the database
                const locationId = await ensureLocationInDatabase(selectedLocation);
                
                if (locationId) {
                    // Save the recreation with the correct location_id
                    const recreationId = saveRecreation(
                        locationId, 
                        capturedPhoto, 
                        null, 
                        'Scene recreation'
                    );
                    
                    if (recreationId) {
                        Alert.alert(
                            'Success!', 
                            `Photo saved and linked to ${selectedLocation.movieTitle}`,
                            [{ text: 'OK', onPress: resetCamera }]
                        );
                    } else {
                        Alert.alert('Saved', 'Photo saved to gallery, but failed to link to location', [
                            { text: 'OK', onPress: resetCamera }
                        ]);
                    }
                } else {
                    Alert.alert('Saved', 'Photo saved to gallery', [
                        { text: 'OK', onPress: resetCamera }
                    ]);
                }
            } else {
                Alert.alert('Saved', 'Photo saved to gallery', [
                    { text: 'OK', onPress: resetCamera }
                ]);
            }
        } catch (error) {
            console.error('Error saving photo:', error);
            Alert.alert('Error', 'Failed to save photo');
        }
    };

    const resetCamera = () => {
        setCapturedPhoto(null);
        setShowPreview(false);
    };

    const selectLocation = (location) => {
        setSelectedLocation(location);
        setShowLocationPicker(false);
    };

    // Pinch gesture for scaling
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            const newScale = savedScale.current * e.scale;
            // Limit scale between 0.5x and 3x
            const clampedScale = Math.max(0.5, Math.min(3, newScale));
            scale.setValue(clampedScale);
        })
        .onEnd(() => {
            savedScale.current = scale._value;
        });

    // Pan gesture for moving the overlay
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.setValue(savedTranslateX.current + e.translationX);
            translateY.setValue(savedTranslateY.current + e.translationY);
        })
        .onEnd(() => {
            savedTranslateX.current = translateX._value;
            savedTranslateY.current = translateY._value;
        });

    // Combine gestures
    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    return (
        <GestureHandlerRootView style={styles.container}>
            {!showPreview ? (
                <>
                    <CameraView
                        style={styles.camera}
                        facing={facing}
                        ref={cameraRef}
                        onCameraReady={() => setIsCameraReady(true)}
                    >
                        {overlayImage && (
                            <GestureDetector gesture={composedGesture}>
                                <Animated.Image
                                    source={{ uri: overlayImage }}
                                    style={[
                                        styles.overlay,
                                        {
                                            opacity: overlayOpacity,
                                            transform: [
                                                { scale: scale },
                                                { translateX: translateX },
                                                { translateY: translateY },
                                            ],
                                        },
                                    ]}
                                    resizeMode="contain"
                                />
                            </GestureDetector>
                        )}

                        {selectedLocation && (
                            <View style={styles.topBar}>
                                <View style={styles.locationBadge}>
                                    <Text style={styles.locationBadgeText}>
                                        {selectedLocation.movieTitle}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.controls}>
                            {overlayImage && (
                                <View style={styles.opacityControls}>
                                    <TouchableOpacity
                                        style={styles.opacityButton}
                                        onPress={() => adjustOpacity('down')}
                                    >
                                        <Ionicons name="remove" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                    <Text style={styles.opacityText}>
                                        {Math.round(overlayOpacity * 100)}%
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.opacityButton}
                                        onPress={() => adjustOpacity('up')}
                                    >
                                        <Ionicons name="add" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.mainControls}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={toggleCameraFacing}
                                >
                                    <Ionicons name="camera-reverse" size={28} color="#FFF" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.captureButton}
                                    onPress={takePicture}
                                    disabled={!isCameraReady}
                                >
                                    <View style={styles.captureInner} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => setShowLocationPicker(true)}
                                >
                                    <Ionicons name="location" size={28} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </CameraView>

                    <View style={styles.sideControls}>
                        <TouchableOpacity style={styles.sideButton} onPress={pickOverlayImage}>
                            <Ionicons name="image" size={24} color="#FFF" />
                        </TouchableOpacity>
                        {overlayImage && (
                            <>
                                <TouchableOpacity style={styles.sideButton} onPress={resetOverlayTransform}>
                                    <Ionicons name="resize" size={24} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideButton} onPress={removeOverlay}>
                                    <Ionicons name="close-circle" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </>
            ) : (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
                    <View style={styles.previewControls}>
                        <TouchableOpacity style={styles.previewButton} onPress={resetCamera}>
                            <Ionicons name="close" size={24} color="#FFF" />
                            <Text style={styles.previewButtonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.previewButton, styles.saveButton]}
                            onPress={savePhoto}
                        >
                            <Ionicons name="checkmark" size={24} color="#FFF" />
                            <Text style={styles.previewButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Modal
                visible={showLocationPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocationPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Location</Text>
                            <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                                <Ionicons name="close" size={28} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.locationList}>
                            {locations.length > 0 ? (
                                locations.map((location) => (
                                    <TouchableOpacity
                                        key={location.id}
                                        style={[
                                            styles.locationItem,
                                            selectedLocation?.id === location.id && styles.selectedItem,
                                        ]}
                                        onPress={() => selectLocation(location)}
                                    >
                                        <Text style={styles.locationMovie}>{location.movieTitle}</Text>
                                        <Text style={styles.locationName}>{location.locationName}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>
                                        No locations available
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    permissionTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    permissionText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    locationBadge: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
    },
    locationBadgeText: {
        color: '#FFF',
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: SPACING.xl,
    },
    opacityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
        gap: SPACING.md,
    },
    opacityButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opacityText: {
        color: '#FFF',
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
    },
    mainControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    iconButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.accent,
    },
    sideControls: {
        position: 'absolute',
        right: SPACING.md,
        top: '45%',
        gap: SPACING.md,
    },
    sideButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    previewImage: {
        flex: 1,
        width: '100%',
    },
    previewControls: {
        position: 'absolute',
        bottom: SPACING.xl,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: SPACING.xl,
    },
    previewButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
    },
    saveButton: {
        backgroundColor: COLORS.accent,
    },
    previewButtonText: {
        color: '#FFF',
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: SCREEN_HEIGHT * 0.7,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '600',
        color: COLORS.text,
    },
    locationList: {
        padding: SPACING.lg,
    },
    locationItem: {
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedItem: {
        borderColor: COLORS.accent,
        borderWidth: 2,
    },
    locationMovie: {
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    locationName: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    emptyState: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});