import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const art3 = require('../assets/art/art3.png');
const art9 = require('../assets/art/art9.png');
const art10 = require('../assets/art/art10.png');
const art12 = require('../assets/art/art12.png');

const overlays = {
    Spring: require('../assets/season_overlay/spring.png'),
    Summer: require('../assets/season_overlay/summer.png'),
    Autumn: require('../assets/season_overlay/autumn.png'),
    Winter: require('../assets/season_overlay/winter.png'),
};

const overlayKeys = Object.keys(overlays);

export default function UndertoneScreen() {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [overlayIndex, setOverlayIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);
    const [loading, setLoading] = useState(false);
    const [seasonResult, setSeasonResult] = useState('');

    const currentOverlay = overlayKeys[overlayIndex];

    const pickImage = async (fromCamera = false) => {
        const permission = fromCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to proceed.');
            return;
        }

        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 })
            : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
            setSeasonResult('');
        }
    };

    const analyzeImage = async () => {
        if (!imageUri) return;

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const resized = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 10, height: 10 } }],
                { base64: true }
            );

            const base64 = resized.base64;
            if (!base64) throw new Error('No base64 data found');

            const binary = atob(base64);
            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < binary.length - 2; i += 3) {
                r += binary.charCodeAt(i);
                g += binary.charCodeAt(i + 1);
                b += binary.charCodeAt(i + 2);
                count++;
            }

            r /= count;
            g /= count;
            b /= count;

            const isWarm = r > b && r > g;
            const isLight = r + g + b > 400;

            let detectedSeason = '';
            if (isWarm && isLight) detectedSeason = 'Spring';
            else if (isWarm && !isLight) detectedSeason = 'Autumn';
            else if (!isWarm && isLight) detectedSeason = 'Summer';
            else detectedSeason = 'Winter';

            const index = overlayKeys.indexOf(detectedSeason);
            setOverlayIndex(index);
            setSeasonResult(`You look like a ${detectedSeason}!`);
        } catch (err) {
            Alert.alert('Error', 'Failed to analyze image.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cycleOverlay = () => {
        setOverlayIndex((prev) => (prev + 1) % overlayKeys.length);
    };

    return (
        <View style={styles.container}>
            <Image source={art10} style={styles.artTopRight} />
            <Image source={art9} style={styles.artTopLeft} />
            <Image source={art3} style={styles.artBottomRight} />
            <Image source={art12} style={styles.artBottomLeft} />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>What's Your Season?</Text>

            <View style={styles.preview}>
                {imageUri ? (
                    <>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        {showOverlay && (
                            <Image
                                source={overlays[currentOverlay]}
                                style={styles.overlay}
                                resizeMode="cover"
                            />
                        )}
                    </>
                ) : (
                    <Text style={styles.placeholder}>Take or pick a photo to begin</Text>
                )}
            </View>

            {imageUri && (
                <>
                    <Text style={styles.seasonLabel}>Overlay: {currentOverlay}</Text>
                    {seasonResult ? (
                        <Text style={styles.resultText}>{seasonResult}</Text>
                    ) : null}
                </>
            )}

            {loading && (
                <ActivityIndicator size="large" color="#F97316" style={{ marginVertical: 10 }} />
            )}

            <View style={styles.buttonGrid}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.gridButton} onPress={() => pickImage(true)}>
                        <Feather name="camera" size={18} color="#fff" />
                        <Text style={styles.gridButtonText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridButton} onPress={() => pickImage(false)}>
                        <Feather name="image" size={18} color="#fff" />
                        <Text style={styles.gridButtonText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                {imageUri && (
                    <>


                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.gridButton} onPress={() => setShowOverlay(!showOverlay)}>
                                <Feather name={showOverlay ? 'eye' : 'eye-off'} size={18} color="#fff" />
                                <Text style={styles.gridButtonText}>
                                    {showOverlay ? 'Show' : 'Hide'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.gridButton, !showOverlay && { backgroundColor: '#d1d5db' }]}
                                onPress={cycleOverlay}
                                disabled={!showOverlay}
                            >
                                <Feather name="refresh-ccw" size={18} color="#fff" />
                                <Text style={styles.gridButtonText}>Switch</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.gridButton} onPress={analyzeImage}>
                                <Feather name="search" size={18} color="#fff" />
                                <Text style={styles.gridButtonText}>Detect</Text>
                            </TouchableOpacity>

                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        position: 'relative',
    },
    artTopRight: {
        position: 'absolute',
        transform: [{ rotate: '5deg' }],
        top: 0,
        right: 100,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    artTopLeft: {
        position: 'absolute',
        top: -120,
        left: -70,
        width: 180,
        height: 180,
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
        bottom: -20,
        left: 0,
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },

    backButton: {
        position: 'absolute',
        top: 58,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Inter',
        marginBottom: 16,
        color: '#333',
    },
    preview: {
        width: 300,
        height: 400,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
        zIndex: 1,
    },
    placeholder: {
        color: '#999',
        fontSize: 16,
    },
    seasonLabel: {
        fontSize: 16,
        marginBottom: 4,
        color: '#4B5563',
        fontWeight: '600',
    },
    resultText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 10,
    },
    buttonGrid: {
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        width: '100%',
        maxWidth: 320,
    },
    gridButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F97316',
        paddingVertical: 14,
        marginHorizontal: 6,
        borderRadius: 30,
    },
    gridButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
});
