// src/screens/SignupScreen.js

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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../utils/firebase';
import { saveUserPreferences } from '../utils/storage';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function SignupScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
            
            // Save user's name locally
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            await saveUserPreferences({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                fullName: fullName,
            });
            
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
                    <Text style={styles.title}>Create Account</Text>

                    <View style={styles.nameRow}>
                        <View style={styles.nameField}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                placeholder="Jane Doe"
                                placeholderTextColor={COLORS.textMuted}
                                value={firstName}
                                onChangeText={setFirstName}
                                style={styles.input}
                                editable={!loading}
                            />
                        </View>
                        <View style={styles.nameField}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                placeholder="Last Name"
                                placeholderTextColor={COLORS.textMuted}
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.input}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="janedoe@gmail.com"
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
                        <Text style={styles.label}>Create a password</Text>
                        <TextInput
                            placeholder="Password (minimum 6 characters)"
                            placeholderTextColor={COLORS.textMuted}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSignUp}
                        disabled={loading}
                        style={styles.primaryButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Please wait...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>Already have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>Log in</Text>
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
    nameRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    nameField: {
        flex: 1,
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
    linkText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.accent,
        fontWeight: '600',
    },
});