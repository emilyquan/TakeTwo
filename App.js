// App.js - Main Entry Point

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from './src/utils/firebase';
import { initDatabase } from './src/utils/db';
import { COLORS } from './src/constants/themes';

// Auth Screen
import AuthScreen from './src/screens/AuthScreen';

// Main Tab Screens
import HomeScreen from './src/screens/HomeScreen';
import SceneLibraryScreen from './src/screens/SceneLibraryScreen';
import CameraScreen from './src/screens/CameraScreen';
import MapScreen from './src/screens/MapScreen';

// Stack Screens
import BoardDetailScreen from './src/screens/BoardDetailScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Scenes':
                            iconName = focused ? 'film' : 'film-outline';
                            break;
                        case 'Camera':
                            iconName = focused ? 'camera' : 'camera-outline';
                            break;
                        case 'Map':
                            iconName = focused ? 'map' : 'map-outline';
                            break;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: COLORS.background,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                },
                headerTintColor: COLORS.text,
                headerRight: () => (
                    <Ionicons
                        name="settings-outline"
                        size={24}
                        color={COLORS.text}
                        style={{ marginRight: 16 }}
                        onPress={() => navigation.navigate('Settings')}
                    />
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Scenes" component={SceneLibraryScreen} options={{ title: 'Movie Library' }} />
            <Tab.Screen name="Camera" component={CameraScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
    );
}

// Root Stack Navigator
function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="MainTabs" 
                component={MainTabs} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="BoardDetail" 
                component={BoardDetailScreen}
                options={{ 
                    title: 'Board',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
            <Stack.Screen 
                name="MovieDetail" 
                component={MovieDetailScreen}
                options={{ 
                    title: 'Movie Details',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
            <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ 
                    title: 'Settings',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize database
        initDatabase();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(firebase_auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return null; // Or add a loading screen
    }

    return (
        <NavigationContainer>
            {user ? <RootStack /> : <AuthScreen />}
        </NavigationContainer>
    );
}