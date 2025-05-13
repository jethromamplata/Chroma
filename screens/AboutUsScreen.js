import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AboutUsScreen() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Background Art */}
            <Image source={require('../assets/art/art9.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={30} color="#333" />
            </TouchableOpacity>

            {/* Fade-In Content */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                style={{ opacity: fadeAnim }}
            >
                {/* Logo */}
                <Image source={require('../assets/icons/icon.png')} style={styles.logo} />

                {/* Title */}
                <Text style={styles.title}>About Chroma</Text>

                {/* Body Text */}
                <Text style={styles.text}>
                    <Text style={styles.bold}>Chroma</Text> is a thoughtfully designed mobile app that helps
                    you discover your most flattering color palette using personal color theory.
                </Text>

                <Text style={styles.text}>
                    Inspired by the viral <Text style={styles.highlight}>seasonal color analysis</Text> trend on
                    TikTok, Chroma lets you explore whether you suit{" "}
                    <Text style={styles.highlight}>Spring</Text>, <Text style={styles.highlight}>Summer</Text>,{" "}
                    <Text style={styles.highlight}>Autumn</Text>, or <Text style={styles.highlight}>Winter</Text>{" "}
                    palettes.
                </Text>

                <Text style={styles.text}>
                    From accessories like <Text style={styles.bold}>gold or silver</Text> to curated outfit
                    suggestions, Chroma guides you toward style choices that enhance your natural features and
                    confidence.
                </Text>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    scrollContent: {
        paddingBottom: 100,
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 20,
        fontFamily: 'Inter',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 18,
        fontFamily: 'Inter',
        textAlign: 'center',
    },
    bold: {
        fontWeight: '700',
        color: '#333',
    },
    highlight: {
        fontWeight: '600',
        color: '#F97316',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    artTopRight: {
        position: 'absolute',
        top: 3,
        right: 20,
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    artTopLeft: {
        position: 'absolute',
        top: -150,
        left: -90,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    artBottomRight: {
        position: 'absolute',
        bottom: -100,
        right: -50,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    artBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: -50,
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
});
