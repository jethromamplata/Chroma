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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setModalMessage('Please enter both email and password.');
            setModalVisible(true);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMsg = 'Something went wrong. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMsg = 'This email is not registered.';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = 'Please enter a valid email address.';
            } else if (error.code === 'auth/wrong-password') {
                errorMsg = 'Incorrect password. Please try again.';
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
                        <Text style={styles.modalTitle}>Login Failed</Text>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Background Art */}
            <Image source={require('../assets/art/art1.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            {/* Chroma Logo */}
            <Image source={require('../assets/icons/icon.png')} style={styles.logo} />

            {/* Login Title */}
            <Text style={styles.title}>Login</Text>

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
            />

            {/* Password Field with Toggle */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                />
                {password !== '' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
                    </TouchableOpacity>
                )}

            </View>

            {/* Log In Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                <Text style={styles.forgotLink}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
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
    link: {
        color: '#6A5ACD',
        marginTop: 16,
    },

    forgotLink: {
        color: '#F97316',
        marginTop: 12,
        fontWeight: '500',
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
