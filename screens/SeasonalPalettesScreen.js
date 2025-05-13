import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    Platform, Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const art11 = require('../assets/art/art11.png');
const art13 = require('../assets/art/art13.png');
const art14 = require('../assets/art/art14.png');
const art15 = require('../assets/art/art15.png');

const palettes = {
    Spring: ['#FFDAB9', '#FFA07A', '#FFB347', '#FFE135', '#98FB98', '#E0FFFF', '#FFF8DC', '#F5DEB3'],
    Summer: ['#F5B7B1', '#D2B4DE', '#ADD8E6', '#B0C4DE', '#C3B1E1', '#A2C2E2', '#AFEEEE', '#E6E6FA'],
    Autumn: ['#D2691E', '#FF8C00', '#B8860B', '#8B4513', '#556B2F', '#CD853F', '#DEB887', '#FFF5E1'],
    Winter: ['#000000', '#2F4F4F', '#4169E1', '#8A2BE2', '#FF1493', '#DC143C', '#00CED1', '#FFFFFF'],
};

export default function SeasonalPalettesScreen() {
    const navigation = useNavigation();

    const copyToClipboard = async (hex) => {
        await Clipboard.setStringAsync(hex);
        if (Platform.OS === 'android') {
            ToastAndroid.show(`${hex} copied to clipboard!`, ToastAndroid.SHORT);
        } else {
            alert(`${hex} copied to clipboard!`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={art11} style={styles.artTopRight} />
            <Image source={art13} style={styles.artTopLeft} />
            <Image source={art14} style={styles.artBottomRight} />
            <Image source={art15} style={styles.artBottomLeft} />

            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Seasonal Color Palettes</Text>
            </View>

            {Object.entries(palettes).map(([season, colors]) => (
                <View key={season} style={styles.section}>
                    <Text style={styles.season}>{season}</Text>
                    <View style={styles.paletteRow}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => copyToClipboard(color)}
                                style={[styles.colorBox, { backgroundColor: color }]}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 23,
        fontFamily: 'Inter',
        color: '#333',
    },
    section: {
        marginBottom: 24,
    },
    season: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#4B5563',
    },
    paletteRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    artTopRight: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    artTopLeft: {
        position: 'absolute',
        top: -170,
        left: -80,
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
        bottom: -90,
        left: -50,
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
});
