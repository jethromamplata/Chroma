import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
    const user = auth.currentUser;
    const [email, setEmail] = useState(user?.email || '');
    const navigation = useNavigation();


    const handleReset = async () => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            Alert.alert('Missing Email', 'Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, trimmedEmail);
            Alert.alert('Check Your Email', 'We’ve sent you a link to reset your password.');
            navigation.goBack();
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                Alert.alert('User Not Found', 'No account found with this email.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };


    return (
        <View style={styles.container}>
            {/* Background Art */}
            <Image source={require('../assets/art/art9.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Reset Your Password</Text>

                <Text style={styles.description}>
                    Enter your email and we’ll send you a link to reset your password.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />


                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Feather name="mail" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 12,
        fontFamily: 'Inter',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Inter',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        width: '100%',
        fontFamily: 'Inter',
    },
    button: {
        backgroundColor: '#F97316',
        padding: 14,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Inter',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
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
