import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

import { firebase_auth } from './src/utils/firebase';
import { initDatabase } from './src/utils/db';

import { RootNavigator, AuthNavigator } from './src/navigation/AppNavigator';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initDatabase();

        const unsubscribe = onAuthStateChanged(firebase_auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) return null;

    return (
        <NavigationContainer>
            {user ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
