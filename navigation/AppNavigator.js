// App Navigation

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SceneLibraryScreen from '../screens/SceneLibraryScreen';
import CameraScreen from '../screens/CameraScreen';
import DataDemoScreen from '../screens/DataDemoScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { COLORS } from '../constants/themes';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
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
                        case 'Data':
                            iconName = focused ? 'server' : 'server-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
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
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="Scenes"
                component={SceneLibraryScreen}
                options={{ title: 'Scenes' }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{ title: 'Camera' }}
            />
            <Tab.Screen
                name="Data"
                component={DataDemoScreen}
                options={{ title: 'Data' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}