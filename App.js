import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from './src/utils/firebase';
import { initDatabase } from './src/utils/db';

import AuthScreen from './src/screens/AuthScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/themes';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Initialize SQLite database
        initDatabase();
        
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(firebase_auth, (currentUser) => {
            setUser(currentUser);
            if (initializing) setInitializing(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, [initializing]);

    // Show loading spinner while checking auth state
    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // User is authenticated - show main app
                    <Stack.Screen name="Main" component={AppNavigator} />
                ) : (
                    // User is not authenticated - show auth screen
                    <Stack.Screen name="Auth" component={AuthScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});