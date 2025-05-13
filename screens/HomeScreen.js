import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Background Crayon Art */}
            <Image source={require('../assets/art/art3.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            {/* Logo */}
            <Image
                source={require('../assets/icons/icon.png')}
                style={styles.logo}
            />

            {/* Buttons */}
            <View style={styles.buttonGroup}>
                <CrayonButton
                    icon={require('../assets/art/art4.png')}
                    text="Find Your Undertone"
                    onPress={() => navigation.navigate('Undertone')}
                />
                <CrayonButton
                    icon={require('../assets/art/art5.png')}
                    text="Seasonal Palettes"
                    onPress={() => navigation.navigate('SeasonalPalettes')}
                />
                <CrayonButton
                    icon={require('../assets/art/art6.png')}
                    text="Accessories"
                    onPress={() => navigation.navigate('Accessories')}
                />
                <CrayonButton
                    icon={require('../assets/art/art7.png')}
                    text="Outfit Ideas"
                    onPress={() => navigation.navigate('OutfitIdeas')}
                />
                <CrayonButton
                    icon={require('../assets/art/art8.png')}
                    text="Virtual Closet"
                    onPress={() => navigation.navigate('VirtualCloset')}
                />
            </View>
        </View>
    );
}

function CrayonButton({ icon, text, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 100,
    },
    logo: {
        width: 300,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    buttonGroup: {
        width: '90%',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#222',
        borderWidth: 1.5,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    icon: {
        width: 80,
        height: 60,
        resizeMode: 'stretch',
        marginRight: 12,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
    },
    artTopRight: {
        position: 'absolute',
        top: 30,
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
