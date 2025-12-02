// Authentification Screen
// Referenced code done and given in lab

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../utils/firebase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Handle user sign up
    const handleSignUp = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
            Alert.alert('Success', 'Welcome to TakeTwo!');
        } catch (e) {
            let errorMessage = 'Sign up failed';
            if (e.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Try signing in!';
            } else if (e.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address';
            }
            Alert.alert('Sign Up Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle user sign in
    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(firebase_auth, email.trim(), password);
        } catch (e) {
            let errorMessage = 'Sign in failed';
            if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address';
            }
            Alert.alert('Sign In Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>🎬</Text>
                    </View>
                    <Text style={styles.title}>TakeTwo</Text>
                    <Text style={styles.tagline}>Recreate iconic movie moments</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Email address"
                        placeholderTextColor={COLORS.textMuted}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        editable={!loading}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={COLORS.textMuted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        editable={!loading}
                    />

                    <TouchableOpacity
                        onPress={isSignUp ? handleSignUp : handleSignIn}
                        disabled={loading}
                        style={styles.primaryButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Toggle Sign In / Sign Up */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsSignUp(!isSignUp)}
                            disabled={loading}
                        >
                            <Text style={styles.toggleLink}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logoContainer: {
        marginBottom: SPACING.lg,
    },
    logo: {
        fontSize: 72,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
    },
    formContainer: {
        gap: SPACING.md,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    primaryButtonText: {
        color: COLORS.background,
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.lg,
        gap: SPACING.xs,
    },
    toggleText: {
        color: COLORS.textLight,
        fontSize: FONTS.sizes.sm,
    },
    toggleLink: {
        color: COLORS.accent,
        fontSize: FONTS.sizes.sm,
        fontWeight: '600',
    },
});