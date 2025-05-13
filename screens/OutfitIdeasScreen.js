import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as RNImage } from 'react-native';
import { ToastAndroid } from 'react-native';
import { saveItem } from '../firebase/firebaseConfig';
import { useEffect } from 'react';

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];


const images = {
    Spring: [
        require('../assets/outfits/spring/spring.png'),
        require('../assets/outfits/spring/spring1.png'),
        require('../assets/outfits/spring/spring2.png'),
        require('../assets/outfits/spring/spring3.png'),
        require('../assets/outfits/spring/spring4.png'),
        require('../assets/outfits/spring/spring5.png'),
        require('../assets/outfits/spring/spring6.png'),
        require('../assets/outfits/spring/spring7.png'),
        require('../assets/outfits/spring/spring8.png'),
        require('../assets/outfits/spring/spring9.png'),
        require('../assets/outfits/spring/spring10.png'),
        require('../assets/outfits/spring/spring11.png'),
        require('../assets/outfits/spring/spring12.png'),
        require('../assets/outfits/spring/spring13.png'),
        require('../assets/outfits/spring/spring14.png'),
        require('../assets/outfits/spring/spring15.png'),
        require('../assets/outfits/spring/spring16.png'),
        require('../assets/outfits/spring/spring17.png'),
        require('../assets/outfits/spring/spring18.png'),
        require('../assets/outfits/spring/spring19.png'),
        require('../assets/outfits/spring/spring20.png'),
        require('../assets/outfits/spring/spring21.png'),
        require('../assets/outfits/spring/spring22.png'),
        require('../assets/outfits/spring/spring23.png'),
        require('../assets/outfits/spring/spring24.png'),
        require('../assets/outfits/spring/spring25.png'),
        require('../assets/outfits/spring/spring26.png'),
        require('../assets/outfits/spring/spring27.png'),
        require('../assets/outfits/spring/spring28.png'),
        require('../assets/outfits/spring/spring29.png'),
        require('../assets/outfits/spring/spring30.png'),
    ],
    Summer: [
        require('../assets/outfits/summer/summer.png'),
        require('../assets/outfits/summer/summer1.png'),
        require('../assets/outfits/summer/summer2.png'),
        require('../assets/outfits/summer/summer3.png'),
        require('../assets/outfits/summer/summer4.png'),
        require('../assets/outfits/summer/summer5.png'),
        require('../assets/outfits/summer/summer6.png'),
        require('../assets/outfits/summer/summer7.png'),
        require('../assets/outfits/summer/summer8.png'),
        require('../assets/outfits/summer/summer9.png'),
        require('../assets/outfits/summer/summer10.png'),
        require('../assets/outfits/summer/summer11.png'),
        require('../assets/outfits/summer/summer12.png'),
        require('../assets/outfits/summer/summer13.png'),
        require('../assets/outfits/summer/summer14.png'),
        require('../assets/outfits/summer/summer15.png'),
        require('../assets/outfits/summer/summer16.png'),
        require('../assets/outfits/summer/summer17.png'),
        require('../assets/outfits/summer/summer18.png'),
        require('../assets/outfits/summer/summer19.png'),
        require('../assets/outfits/summer/summer20.png'),
        require('../assets/outfits/summer/summer21.png'),
        require('../assets/outfits/summer/summer22.png'),
        require('../assets/outfits/summer/summer23.png'),
        require('../assets/outfits/summer/summer24.png'),
        require('../assets/outfits/summer/summer25.png'),
        require('../assets/outfits/summer/summer26.png'),
        require('../assets/outfits/summer/summer27.png'),
        require('../assets/outfits/summer/summer28.png'),
        require('../assets/outfits/summer/summer29.png'),
        require('../assets/outfits/summer/summer30.png'),
    ],
    Autumn: [
        require('../assets/outfits/autumn/autumn.png'),
        require('../assets/outfits/autumn/autumn1.png'),
        require('../assets/outfits/autumn/autumn2.png'),
        require('../assets/outfits/autumn/autumn3.png'),
        require('../assets/outfits/autumn/autumn4.png'),
        require('../assets/outfits/autumn/autumn5.png'),
        require('../assets/outfits/autumn/autumn6.png'),
        require('../assets/outfits/autumn/autumn7.png'),
        require('../assets/outfits/autumn/autumn8.png'),
        require('../assets/outfits/autumn/autumn9.png'),
        require('../assets/outfits/autumn/autumn10.png'),
        require('../assets/outfits/autumn/autumn11.png'),
        require('../assets/outfits/autumn/autumn12.png'),
        require('../assets/outfits/autumn/autumn13.png'),
        require('../assets/outfits/autumn/autumn14.png'),
        require('../assets/outfits/autumn/autumn15.png'),
        require('../assets/outfits/autumn/autumn16.png'),
        require('../assets/outfits/autumn/autumn17.png'),
        require('../assets/outfits/autumn/autumn18.png'),
        require('../assets/outfits/autumn/autumn19.png'),
        require('../assets/outfits/autumn/autumn20.png'),
        require('../assets/outfits/autumn/autumn21.png'),
        require('../assets/outfits/autumn/autumn22.png'),
        require('../assets/outfits/autumn/autumn23.png'),
        require('../assets/outfits/autumn/autumn24.png'),
        require('../assets/outfits/autumn/autumn25.png'),
        require('../assets/outfits/autumn/autumn26.png'),
        require('../assets/outfits/autumn/autumn27.png'),
        require('../assets/outfits/autumn/autumn28.png'),
        require('../assets/outfits/autumn/autumn29.png'),
        require('../assets/outfits/autumn/autumn30.png'),
    ],
    Winter: [
        require('../assets/outfits/winter/winter.png'),
        require('../assets/outfits/winter/winter1.png'),
        require('../assets/outfits/winter/winter2.png'),
        require('../assets/outfits/winter/winter3.png'),
        require('../assets/outfits/winter/winter4.png'),
        require('../assets/outfits/winter/winter5.png'),
        require('../assets/outfits/winter/winter6.png'),
        require('../assets/outfits/winter/winter7.png'),
        require('../assets/outfits/winter/winter8.png'),
        require('../assets/outfits/winter/winter9.png'),
        require('../assets/outfits/winter/winter10.png'),
        require('../assets/outfits/winter/winter11.png'),
        require('../assets/outfits/winter/winter12.png'),
        require('../assets/outfits/winter/winter13.png'),
        require('../assets/outfits/winter/winter14.png'),
        require('../assets/outfits/winter/winter15.png'),
        require('../assets/outfits/winter/winter16.png'),
        require('../assets/outfits/winter/winter17.png'),
        require('../assets/outfits/winter/winter18.png'),
        require('../assets/outfits/winter/winter19.png'),
        require('../assets/outfits/winter/winter20.png'),
        require('../assets/outfits/winter/winter21.png'),
        require('../assets/outfits/winter/winter22.png'),
        require('../assets/outfits/winter/winter23.png'),
        require('../assets/outfits/winter/winter24.png'),
        require('../assets/outfits/winter/winter25.png'),
        require('../assets/outfits/winter/winter26.png'),
        require('../assets/outfits/winter/winter27.png'),
        require('../assets/outfits/winter/winter28.png'),
        require('../assets/outfits/winter/winter29.png'),
        require('../assets/outfits/winter/winter30.png'),
    ],
};

export default function OutfitIdeasScreen() {
    const navigation = useNavigation();
    const [selectedSeason, setSelectedSeason] = useState('Spring');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const flatListRef = useRef(null);


    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, [selectedSeason]);



    const handleSave = async (image) => {
        try {
            const resolved = RNImage.resolveAssetSource(image); // convert require() image to URI
            const uri = resolved.uri;

            // 🔶 Save to AsyncStorage
            const existing = await AsyncStorage.getItem('@saved_outfits');
            const saved = existing ? JSON.parse(existing) : [];

            if (!saved.includes(uri)) {
                const updated = [...saved, uri];
                await AsyncStorage.setItem('@saved_outfits', JSON.stringify(updated));

                // 🔶 Save to Firestore
                await saveItem({ image: uri, type: 'outfit' });

                ToastAndroid.show('Outfit saved!', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Already saved!', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error saving outfit image:', error);
            ToastAndroid.show('Failed to save outfit!', ToastAndroid.SHORT);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.masonryItem}
            onPress={() => {
                setSelectedImage(item);
                setModalVisible(true);
            }}
        >
            <Image source={item} style={styles.image} />

            {/* 👇 ADD THIS HERE */}
            <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(item)}>
                <Feather name="bookmark" size={20} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabBar}
                >
                    {seasons.map((season) => (
                        <TouchableOpacity
                            key={season}
                            onPress={() => setSelectedSeason(season)}
                            style={styles.tab}
                        >
                            <Text style={[styles.tabText, selectedSeason === season && styles.activeTabText]}>
                                {season}
                            </Text>
                            {selectedSeason === season && <View style={styles.activeUnderline} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                ref={flatListRef}
                data={images[selectedSeason]}
                keyExtractor={(item, index) => `${selectedSeason}-${index}`}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.masonryRow}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />


            {/* Modal for image preview and save */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContainer}>
                                {selectedImage && (
                                    <Image source={selectedImage} style={styles.modalImage} />
                                )}

                                <TouchableOpacity
                                    style={styles.modalSaveButton}
                                    onPress={() => {
                                        handleSave(selectedImage);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Feather name="bookmark" size={24} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalClose}
                                    onPress={() => setModalVisible(false)}
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
        paddingTop: 40,
        paddingHorizontal: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    backButton: {
        marginRight: 12,
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
    },
    tab: {
        marginHorizontal: 8,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 25,
        fontFamily: 'Inter',
        color: '#4B5563',
    },
    activeTabText: {
        color: '#F97316',
    },
    activeUnderline: {
        height: 2,
        backgroundColor: '#F97316',
        marginTop: 2,
        width: '100%',
        borderRadius: 1,
    },
    masonryRow: {
        justifyContent: 'space-between',
    },
    masonryItem: {
        flex: 1,
        margin: 6,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#eee',
        aspectRatio: 0.8,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    saveButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#F97316',
        padding: 8,
        borderRadius: 20,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
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
    modalSaveButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#F97316',
        padding: 10,
        borderRadius: 30,
    },
    modalClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
        zIndex: 10,
    },

});
