// src/screens/IntroScreen.js

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/themes';

export default function IntroScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>🎬</Text>
                </View>
                <Text style={styles.title}>take two</Text>
                <Text style={styles.subtitle}>better than the movies</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.primaryButtonText}>Log In</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Signup')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
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
    subtitle: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textLight,
        marginBottom: SPACING.xxl,
    },
    buttonContainer: {
        width: '100%',
        gap: SPACING.md,
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: COLORS.background,
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    secondaryButtonText: {
        color: COLORS.text,
        fontSize: FONTS.sizes.md,
        fontWeight: '600',
    },
});