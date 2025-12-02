// AppNavigator.js - Updated with removed Home header
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/themes';

// Auth Screens
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import SceneLibraryScreen from '../screens/SceneLibraryScreen';
import CameraScreen from '../screens/CameraScreen';
import MapScreen from '../screens/MapScreen';

// Detail Screens
import BoardDetailScreen from '../screens/BoardDetailScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateBoardScreen from '../screens/CreateBoardScreen';
import RecreationDetailScreen from '../screens/RecreationDetailScreen';
import AddLocationScreen from '../screens/AddLocationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ---------- Main Tabs ----------
function MainTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Movie Library':
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
                    paddingTop: 10,
                    height: 80,
                },
                headerStyle: {
                    backgroundColor: COLORS.background,
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
            <Tab.Screen 
                name="Home" 
                component={HomeScreen}
                options={{
                    headerTitle: '', // FIXED: Remove "Home" text but keep header bar
                }}
            />
            <Tab.Screen name="Movie Library" component={SceneLibraryScreen} />
            <Tab.Screen name="Camera" component={CameraScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
    );
}

// ---------- Root Stack for logged-in users ----------
function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Back" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen 
                name="BoardDetail" 
                component={BoardDetailScreen}
                options={{
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
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
            <Stack.Screen 
                name="CreateBoard" 
                component={CreateBoardScreen}
                options={{
                    title: 'New Board',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
            <Stack.Screen 
                name="RecreationDetail" 
                component={RecreationDetailScreen}
                options={{
                    title: 'Recreation',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
            <Stack.Screen 
                name="AddLocation" 
                component={AddLocationScreen}
                options={{
                    title: 'Add Location',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                }}
            />
        </Stack.Navigator>
    );
}

// ---------- Auth stack ----------
function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
}

export { RootNavigator, AuthNavigator };
