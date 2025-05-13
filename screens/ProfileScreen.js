import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig'; // adjust this if needed inside itself

import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const user = auth.currentUser;
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Please allow access to your gallery to select a photo.');
            return;
        }


        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            await AsyncStorage.setItem('@profile_image', uri); // 💾 save it
        }
    };

    const handleResetPhoto = async () => {
        setConfirmDeleteVisible(false);
        setProfileImage(null);
        await AsyncStorage.removeItem('@profile_image');
        setDeleteSuccessVisible(true);
    };

    const handleChangePassword = async () => {
        const trimmedOld = oldPassword.trim();
        const trimmedNew = newPassword.trim();
        const trimmedConfirm = confirmPassword.trim();

        if (!trimmedOld || !trimmedNew || !trimmedConfirm) {
            Alert.alert('Missing Fields', 'Please fill out all password fields.');
            return;
        }

        if (trimmedNew !== trimmedConfirm) {
            Alert.alert('Mismatch', 'New password and confirmation do not match.');
            return;
        }

        if (trimmedNew.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, trimmedOld);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, trimmedNew);

            setModalVisible(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Your password has been updated.');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Incorrect Password', 'The old password you entered is incorrect.');
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert('Too Many Attempts', 'Please try again later.');
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

            <View style={styles.innerContent}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={
                            profileImage
                                ? { uri: profileImage }
                                : require('../assets/icons/profile-placeholder.png')
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>

                <Text style={styles.title}>My Profile</Text>
                <Text style={styles.email}>Email: {user?.email}</Text>

                <TouchableOpacity style={styles.resetPhotoButton} onPress={() => setConfirmDeleteVisible(true)}>
                    <Text style={styles.resetPhotoText}>Reset Profile Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.aboutUsButton} onPress={() => navigation.navigate('AboutUs')}>
                    <Text style={styles.aboutUsText}>About Us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutConfirmVisible(true)}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>


                <Text style={styles.versionText}>App Version: 1.0.0</Text>
            </View>

            {/* Password Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Old Password"
                                secureTextEntry={!showOld}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                            />
                            {oldPassword !== '' && (
                                <TouchableOpacity onPress={() => setShowOld(!showOld)} style={styles.eyeIcon}>
                                    <Feather name={showOld ? 'eye' : 'eye-off'} size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="New Password"
                                secureTextEntry={!showNew}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            {newPassword !== '' && (
                                <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                                    <Feather name={showNew ? 'eye' : 'eye-off'} size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                secureTextEntry={!showConfirm}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            {confirmPassword !== '' && (
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                                    <Feather name={showConfirm ? 'eye' : 'eye-off'} size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>


                        <TouchableOpacity onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('ForgotPasswordScreen');
                        }}>
                            <Text style={styles.forgotText}>Forgot your password?</Text>
                        </TouchableOpacity>


                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChangePassword}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={deleteSuccessVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Feather name="check-circle" size={40} color="#16A34A" style={{ marginBottom: 10 }} />
                        <Text style={styles.modalTitle}>Profile photo removed</Text>
                        <TouchableOpacity
                            style={{ marginTop: 20 }}
                            onPress={() => setDeleteSuccessVisible(false)}
                        >
                            <Text style={styles.saveText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={logoutConfirmVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Log Out?</Text>
                        <Text style={{ color: '#333', marginBottom: 20, fontFamily: 'Inter', textAlign: 'center' }}>
                            Are you sure you want to log out of your account?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setLogoutConfirmVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setLogoutConfirmVisible(false);
                                auth.signOut();
                            }}>
                                <Text style={styles.saveText}>Yes, Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={confirmDeleteVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Remove Profile Photo?</Text>
                        <Text style={{ color: '#333', marginBottom: 20, fontFamily: 'Inter', textAlign: 'center' }}>
                            Are you sure you want to delete your current profile photo?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleResetPhoto}>
                                <Text style={styles.saveText}>Yes, Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        paddingTop: 100,
        paddingHorizontal: 24,
    },
    innerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
        fontFamily: 'Inter',
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

    email: {
        fontSize: 16,
        color: '#444',
        marginBottom: 24,
        fontFamily: 'Inter',
    },
    versionText: {
        marginTop: 40,
        color: '#999',
        fontSize: 14,
        fontFamily: 'Inter',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 16,
    },
    inputWrapper: {
        width: '100%',
        position: 'relative',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
    },

    forgotText: {
        color: '#F97316',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelText: {
        color: '#888',
        fontSize: 16,
    },
    saveText: {
        color: '#F97316',
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#F97316',
    },

    successText: {
        color: '#16A34A',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'Inter',
    },
    button: {
        width: '60%',
        backgroundColor: '#F97316',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 50,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },

    aboutUsButton: {
        width: '60%',
        backgroundColor: '#F97316',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 50,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },

    resetPhotoButton: {
        width: '60%',
        marginBottom: 16,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 50,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    logoutButton: {
        width: '60%',
        backgroundColor: '#F97316',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 50,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },

    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        fontFamily: 'Inter',
        textAlign: 'center',
    },

    aboutUsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        fontFamily: 'Inter',
    },

    resetPhotoText: {
        color: '#DC2626',
        fontWeight: '700',
        fontSize: 14,
        fontFamily: 'Inter',
        textAlign: 'center',
    },

    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
        textAlign: 'center',
    },

});
