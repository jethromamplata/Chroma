import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
    Alert,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveClosetItem, fetchClosetItems, deleteClosetItem } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';
const categories = [
    'Top',
    'Blouse',
    'Dress',
    'Skirt',
    'Pants',
    'Jumpsuit',
    'Jacket',
    'Shoes',
    'Bag',
    'Accessory',
    'Outfit',
];
const colors = ['White', 'Black', 'Beige', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Gray', 'Yellow', 'Brown'];
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
const stylesList = ['Casual', 'Elegant', 'Street', 'Work', 'Romantic'];

export default function VirtualClosetScreen() {
    const navigation = useNavigation();
    const [closet, setCloset] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tags, setTags] = useState({ category: '', color: [], season: '', style: '' });
    const [viewItem, setViewItem] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadCloset = async () => {
            setLoading(true);
            try {
                const firebaseItems = await fetchClosetItems();
                setCloset(firebaseItems);
                await AsyncStorage.setItem('closet', JSON.stringify(firebaseItems));
            } catch (err) {
                console.error('Error loading closet:', err);
                const local = await AsyncStorage.getItem('closet');
                if (local) setCloset(JSON.parse(local));
            }
            setLoading(false);
        };
        loadCloset();
    }, []);


    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission Required', 'Please allow access to your photos.');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
                setModalVisible(true);
            } else {
                console.log('Image selection canceled');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to open image picker.');
        }
    };


    const saveItem = async () => {
        if (saving) return;
        setSaving(true);

        const id = editingId || Date.now().toString();
        const newItem = { image: selectedImage, tags, id };

        try {
            if (!editingId) {
                const firestoreId = await saveClosetItem(newItem);
                newItem.id = firestoreId;
            }

            const updatedCloset = editingId
                ? closet.map((item) => (item.id === editingId ? newItem : item))
                : [...closet, newItem];

            setCloset(updatedCloset);
            await AsyncStorage.setItem('closet', JSON.stringify(updatedCloset));
        } catch (error) {
            console.error('Failed to save item:', error);
            Alert.alert('Error', 'Failed to save item. Please try again.');
        } finally {
            resetForm();
            setSaving(false);
        }
    };

    const resetForm = () => {
        setModalVisible(false);
        setSelectedImage(null);
        setTags({ category: '', color: [], season: '', style: '' });
        setEditingId(null);
    };

    const handleDelete = async () => {
        try {
            await deleteClosetItem(viewItem.id);
            const updated = closet.filter(item => item.id !== viewItem.id);
            setCloset(updated);
            await AsyncStorage.setItem('closet', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to delete item:', error);
            Alert.alert('Error', 'Could not delete item from Firestore.');
        } finally {
            setViewModal(false);
            setViewItem(null);
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => { setViewItem(item); setViewModal(true); }}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.tags}>{Object.values(item.tags).flat().join(' • ')}</Text>
        </TouchableOpacity>
    );

    const toggleTag = (field, option) => {
        if (field === 'color') {
            setTags(prev => {
                const exists = prev.color.includes(option);
                const updated = exists
                    ? prev.color.filter(c => c !== option)
                    : prev.color.length < 3
                        ? [...prev.color, option]
                        : prev.color;
                return { ...prev, color: updated };
            });
        } else {
            setTags(prev => ({ ...prev, [field]: option }));
        }
    };

    const renderTagOptions = (label, options, field) => (
        <View style={styles.tagGroup}>
            <Text style={styles.tagLabel}>{label}</Text>
            <View style={styles.tagOptions}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.tagButton,
                            (field === 'color' ? tags.color.includes(option) : tags[field] === option) && styles.tagButtonSelected
                        ]}
                        onPress={() => toggleTag(field, option)}
                    >
                        <Text style={
                            (field === 'color' ? tags.color.includes(option) : tags[field] === option)
                                ? styles.tagTextSelected
                                : styles.tagText
                        }>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Your Virtual Closet</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <Feather name="plus" size={20} color="#fff" />
                <Text style={styles.addText}>Add Item</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={closet}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id || item.image}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <Text style={styles.modalTitle}>Tag this item</Text>
                    {renderTagOptions('Category', categories, 'category')}
                    {renderTagOptions('Color', colors, 'color')}
                    {renderTagOptions('Season', seasons, 'season')}
                    {renderTagOptions('Style', stylesList, 'style')}

                    <TouchableOpacity
                        style={[styles.saveButton, !(tags.category && tags.color.length && tags.season && tags.style) && { opacity: 0.5 }]}
                        onPress={saveItem}
                        disabled={saving || !(tags.category && tags.color.length && tags.season && tags.style)}
                    >
                        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={resetForm} style={[styles.saveButton, { backgroundColor: '#ccc', marginTop: 10 }]}>
                        <Text style={[styles.saveText, { color: '#333' }]}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Modal>

            <Modal visible={viewModal} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.viewModalContent}>
                        <Image source={{ uri: viewItem?.image }} style={styles.modalImage} />
                        <Text style={styles.modalTags}>{Object.values(viewItem?.tags || {}).flat().join(' • ')}</Text>

                        <View style={styles.actionRow}>
                            <Pressable
                                style={[styles.actionButton, { backgroundColor: '#4B5563' }]}
                                onPress={() => {
                                    setModalVisible(true);
                                    setTags(viewItem.tags);
                                    setSelectedImage(viewItem.image);
                                    setEditingId(viewItem.id);
                                    setViewModal(false);
                                }}
                            >
                                <Text style={styles.actionText}>Edit</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                                onPress={() =>
                                    Alert.alert(
                                        'Confirm Delete',
                                        'Are you sure you want to delete this item?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Delete', style: 'destructive', onPress: handleDelete },
                                        ]
                                    )
                                }
                            >
                                <Text style={styles.actionText}>Delete</Text>
                            </Pressable>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setViewModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F97316',
        padding: 14,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 20,
        justifyContent: 'center',
    },
    addText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 16,
    },
    item: {
        marginBottom: 20,
        marginHorizontal: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    tags: {
        marginTop: 8,
        color: '#555',
    },
    modalContent: {
        padding: 24,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    tagGroup: {
        marginBottom: 24,
    },
    tagLabel: {
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 8,
        color: '#374151',
    },
    tagOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tagButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    tagButtonSelected: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
    },
    tagText: {
        fontSize: 14,
        color: '#333',
    },
    tagTextSelected: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#F97316',
        padding: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 16,
        elevation: 2,
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewModalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        width: '85%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
    },

    modalImage: {
        width: 230,
        height: 230,
        borderRadius: 12,
        marginBottom: 18,
    },

    modalTags: {
        color: '#444',
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 10,
        width: '100%',
    },

    actionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 2,
    },

    actionText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    editBtn: {
        backgroundColor: '#4B5563',
        padding: 10,
        borderRadius: 8,
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
        padding: 10,
        borderRadius: 8,
    },

    closeButton: {
        marginTop: 12,
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },

    closeButtonText: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 16,
    },

});
