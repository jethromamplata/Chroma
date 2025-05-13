import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Animated,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { fetchSavedItems, saveItem, deleteSavedItem } from '../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

export default function SavedScreen() {
    const [accessoryImages, setAccessoryImages] = useState([]);
    const [outfitImages, setOutfitImages] = useState([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [lastDeleted, setLastDeleted] = useState(null);
    const toastY = useState(new Animated.Value(150))[0];
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [savedItems, setSavedItems] = useState([]);


    const showToast = () => {
        toastY.setValue(150);
        setToastVisible(true);
        Animated.timing(toastY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            hideToast();
        }, 3000);
    };

    const hideToast = () => {
        Animated.timing(toastY, {
            toValue: 150,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setToastVisible(false);
        });
    };

    const handleUndo = async () => {
        if (!lastDeleted) return;
        const { uri, originalData, setData, storageKey } = lastDeleted;
        setData(originalData);
        await AsyncStorage.setItem(storageKey, JSON.stringify(originalData));
        setToastVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            const loadSaved = async () => {
                try {
                    const items = await fetchSavedItems(); // from firebaseConfig.js
                    const accessories = items.filter(item => item.type === 'accessory');
                    const outfits = items.filter(item => item.type === 'outfit');

                    setAccessoryImages(accessories.map(item => item.image));
                    setOutfitImages(outfits.map(item => item.image));
                } catch (error) {
                    console.log('Error loading saved items:', error);
                }
            };
            loadSaved();
        }, [])
    );


    const handleDelete = (uri, data, setData, storageKey) => {
        setPendingDelete({ uri, data, setData, storageKey });
        setConfirmVisible(true);
    };
    const confirmDelete = async () => {
        if (!pendingDelete) return;

        const { uri, data, setData, storageKey } = pendingDelete;
        const originalData = [...data];
        const updated = data.filter(item => item !== uri);
        setData(updated);
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

        setLastDeleted({ uri, originalData, setData, storageKey });
        setConfirmVisible(false);
        showToast();
    };
    const renderGrid = (title, data, setData, storageKey) => {
        if (!data || data.length === 0) return null;

        return (
            <View style={{ marginBottom: 30 }}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${title}-${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.imageWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedImage(item);
                                    setSelectedImageUri(item);
                                    setImageModalVisible(true);
                                }}
                            >
                                <Image source={{ uri: item }} style={styles.image} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item, data, setData, storageKey)}
                            >
                                <Feather name="trash-2" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Background Art */}
            <Image source={require('../assets/art/art1.png')} style={styles.artTopRight} />
            <Image source={require('../assets/art/art2.png')} style={styles.artTopLeft} />
            <Image source={require('../assets/art/art2.png')} style={styles.artBottomRight} />
            <Image source={require('../assets/art/art3.png')} style={styles.artBottomLeft} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {(accessoryImages.length === 0 && outfitImages.length === 0) ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No saved images yet.</Text>
                    </View>
                ) : (
                    <>
                        {renderGrid('Accessories', accessoryImages, setAccessoryImages, '@saved_accessories')}
                        {renderGrid('Outfit Ideas', outfitImages, setOutfitImages, '@saved_outfits')}
                    </>
                )}
            </ScrollView>


            {confirmVisible && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Delete Image</Text>
                        <Text style={styles.modalText}>Are you sure you want to remove this image?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmDelete}>
                                <Text style={styles.modalDelete}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}


            {toastVisible && (
                <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
                    <View style={styles.toastLeft}>
                        <Feather name="trash-2" size={18} color="#F97316" style={styles.toastIcon} />
                        <Text style={styles.toastText}>Image deleted</Text>
                    </View>
                    <TouchableOpacity onPress={handleUndo}>
                        <Text style={styles.toastUndo}>UNDO</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <Modal
                visible={imageModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContainer}>
                                <Image source={{ uri: selectedImage }} style={styles.modalImage} />

                                <TouchableOpacity
                                    style={styles.modalDeleteButton}
                                    onPress={() => {
                                        const matchingSet = accessoryImages.includes(selectedImage)
                                            ? { data: accessoryImages, set: setAccessoryImages, key: '@saved_accessories' }
                                            : { data: outfitImages, set: setOutfitImages, key: '@saved_outfits' };

                                        handleDelete(selectedImage, matchingSet.data, matchingSet.set, matchingSet.key);
                                        setImageModalVisible(false);
                                    }}
                                >
                                    <Feather name="trash-2" size={22} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalClose}
                                    onPress={() => setImageModalVisible(false)}
                                >
                                    <Feather name="x" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingTop: 60,
        position: 'relative',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        color: '#555',
        fontFamily: 'Inter',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    row: {
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 10,
    },
    image: {
        width: (width - 48) / 3,
        height: (width - 48) / 3,
        borderRadius: 10,
        marginBottom: 10,
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
    imageWrapper: {
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        bottom: 12,
        right: 8,
        backgroundColor: '#F97316',
        padding: 6,
        borderRadius: 20,
    },

    // ✅ Toast
    toast: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#fff3e0',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        zIndex: 999,
    },
    toastLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toastIcon: {
        marginRight: 8,
    },
    toastText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Inter',
    },
    toastUndo: {
        fontSize: 16,
        color: '#F97316',
        fontWeight: 'bold',
        marginLeft: 12,
    },

    // ✅ Confirmation Modal
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        elevation: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
    },
    modalCancel: {
        fontSize: 16,
        color: '#999',
    },
    modalDelete: {
        fontSize: 16,
        color: '#F97316',
        fontWeight: 'bold',
    },

    // ✅ Fullscreen Image Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    modalContainer: {
        width: '92%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },


    modalClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 20,
        zIndex: 10,
    },

    modalDeleteButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#F97316',
        padding: 12,
        borderRadius: 30,
    },

    scrollContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },

});
