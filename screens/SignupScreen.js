import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSignup = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setModalMessage('Please enter both email and password.');
            setModalVisible(true);
            return;
        }

        if (!emailRegex.test(email)) {
            setModalMessage('Please enter a valid email address.');
            setModalVisible(true);
            return;
        }

        if (password.length < 6) {
            setModalMessage('Password must be at least 6 characters long.');
            setModalVisible(true);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setModalMessage('🎉 Account created! You can now log in.');
            setModalVisible(true);
        } catch (error) {
            let errorMsg = 'Something went wrong. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMsg = 'This email is already registered. Please log in or use another.';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = 'Please enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMsg = 'Password must be at least 6 characters long.';
            }
            setModalMessage(errorMsg);
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            {/* Custom Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {modalMessage.includes('🎉') ? 'Success' : 'Signup Failed'}
                        </Text>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                if (modalMessage.includes('Account created')) {
                                    navigation.navigate('Login');
                                }
                            }}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Background Art */}
            <Image source={require('../assets/art/art1.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            {/* Chroma Logo */}
            <Image source={require('../assets/icons/icon.png')} style={styles.logo} />

            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
            />

            {/* Password + Toggle */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                />
                {password !== '' && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
                    </TouchableOpacity>
                )}

            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    logo: {
        width: 250,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#999',
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    passwordWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 12,
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    eyeIcon: {
        paddingHorizontal: 6,
    },
    button: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#000',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    buttonText: {
        fontWeight: 'bold',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#D32F2F',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#D32F2F',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
