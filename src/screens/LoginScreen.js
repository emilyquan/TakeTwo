// src/screens/LoginScreen.js

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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../utils/firebase';
import { getUserPreferences } from '../utils/storage';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
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
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Hi, Welcome!</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="Your email"
                            placeholderTextColor={COLORS.textMuted}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={COLORS.textMuted}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.optionsContainer}>
                        <View style={styles.rememberMeContainer}>
                            {/* You can add a checkbox here if needed */}
                            <Text style={styles.optionText}>Remember me</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={styles.primaryButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Please wait...' : 'Log In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>Sign up</Text>
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
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
        fontWeight: '500',
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
    },
    linkText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.accent,
        fontWeight: '600',
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
    },
    toggleText: {
        color: COLORS.textLight,
        fontSize: FONTS.sizes.sm,
    },
});