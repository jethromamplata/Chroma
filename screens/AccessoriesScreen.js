import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ToastAndroid,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as RNImage } from 'react-native'; // to resolve image source
import { saveItem } from '../firebase/firebaseConfig';
import { useEffect } from 'react';

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

const images = {
    Spring: [
        require('../assets/accessories/spring/spring.png'),
        require('../assets/accessories/spring/spring1.png'),
        require('../assets/accessories/spring/spring2.png'),
        require('../assets/accessories/spring/spring3.png'),
        require('../assets/accessories/spring/spring4.png'),
        require('../assets/accessories/spring/spring5.png'),
        require('../assets/accessories/spring/spring6.png'),
        require('../assets/accessories/spring/spring7.png'),
        require('../assets/accessories/spring/spring8.png'),
        require('../assets/accessories/spring/spring9.png'),
        require('../assets/accessories/spring/spring10.png'),
        require('../assets/accessories/spring/spring11.png'),
        require('../assets/accessories/spring/spring12.png'),
        require('../assets/accessories/spring/spring13.png'),
        require('../assets/accessories/spring/spring14.png'),
        require('../assets/accessories/spring/spring15.png'),
        require('../assets/accessories/spring/spring16.png'),
        require('../assets/accessories/spring/spring17.png'),
        require('../assets/accessories/spring/spring18.png'),
        require('../assets/accessories/spring/spring19.png'),
        require('../assets/accessories/spring/spring20.png'),
        require('../assets/accessories/spring/spring21.png'),
        require('../assets/accessories/spring/spring22.png'),
        require('../assets/accessories/spring/spring23.png'),
        require('../assets/accessories/spring/spring24.png'),
        require('../assets/accessories/spring/spring25.png'),
        require('../assets/accessories/spring/spring26.png'),
        require('../assets/accessories/spring/spring27.png'),
        require('../assets/accessories/spring/spring28.png'),
        require('../assets/accessories/spring/spring29.png'),
        require('../assets/accessories/spring/spring30.png'),
    ],
    Summer: [
        require('../assets/accessories/summer/summer.png'),
        require('../assets/accessories/summer/summer1.png'),
        require('../assets/accessories/summer/summer2.png'),
        require('../assets/accessories/summer/summer3.png'),
        require('../assets/accessories/summer/summer4.png'),
        require('../assets/accessories/summer/summer5.png'),
        require('../assets/accessories/summer/summer6.png'),
        require('../assets/accessories/summer/summer7.png'),
        require('../assets/accessories/summer/summer8.png'),
        require('../assets/accessories/summer/summer9.png'),
        require('../assets/accessories/summer/summer10.png'),
        require('../assets/accessories/summer/summer11.png'),
        require('../assets/accessories/summer/summer12.png'),
        require('../assets/accessories/summer/summer13.png'),
        require('../assets/accessories/summer/summer14.png'),
        require('../assets/accessories/summer/summer15.png'),
        require('../assets/accessories/summer/summer16.png'),
        require('../assets/accessories/summer/summer17.png'),
        require('../assets/accessories/summer/summer18.png'),
        require('../assets/accessories/summer/summer19.png'),
        require('../assets/accessories/summer/summer20.png'),
        require('../assets/accessories/summer/summer21.png'),
        require('../assets/accessories/summer/summer22.png'),
        require('../assets/accessories/summer/summer23.png'),
        require('../assets/accessories/summer/summer24.png'),
        require('../assets/accessories/summer/summer25.png'),
        require('../assets/accessories/summer/summer26.png'),
        require('../assets/accessories/summer/summer27.png'),
        require('../assets/accessories/summer/summer28.png'),
        require('../assets/accessories/summer/summer29.png'),
        require('../assets/accessories/summer/summer30.png'),
    ],
    Autumn: [
        require('../assets/accessories/autumn/autumn.png'),
        require('../assets/accessories/autumn/autumn1.png'),
        require('../assets/accessories/autumn/autumn2.png'),
        require('../assets/accessories/autumn/autumn3.png'),
        require('../assets/accessories/autumn/autumn4.png'),
        require('../assets/accessories/autumn/autumn5.png'),
        require('../assets/accessories/autumn/autumn6.png'),
        require('../assets/accessories/autumn/autumn7.png'),
        require('../assets/accessories/autumn/autumn8.png'),
        require('../assets/accessories/autumn/autumn9.png'),
        require('../assets/accessories/autumn/autumn10.png'),
        require('../assets/accessories/autumn/autumn11.png'),
        require('../assets/accessories/autumn/autumn12.png'),
        require('../assets/accessories/autumn/autumn13.png'),
        require('../assets/accessories/autumn/autumn14.png'),
        require('../assets/accessories/autumn/autumn15.png'),
        require('../assets/accessories/autumn/autumn16.png'),
        require('../assets/accessories/autumn/autumn17.png'),
        require('../assets/accessories/autumn/autumn18.png'),
        require('../assets/accessories/autumn/autumn19.png'),
        require('../assets/accessories/autumn/autumn20.png'),
        require('../assets/accessories/autumn/autumn21.png'),
        require('../assets/accessories/autumn/autumn22.png'),
        require('../assets/accessories/autumn/autumn23.png'),
        require('../assets/accessories/autumn/autumn24.png'),
        require('../assets/accessories/autumn/autumn25.png'),
        require('../assets/accessories/autumn/autumn26.png'),
        require('../assets/accessories/autumn/autumn27.png'),
        require('../assets/accessories/autumn/autumn28.png'),
        require('../assets/accessories/autumn/autumn29.png'),
        require('../assets/accessories/autumn/autumn30.png'),
    ],
    Winter: [
        require('../assets/accessories/winter/winter.png'),
        require('../assets/accessories/winter/winter1.png'),
        require('../assets/accessories/winter/winter2.png'),
        require('../assets/accessories/winter/winter3.png'),
        require('../assets/accessories/winter/winter4.png'),
        require('../assets/accessories/winter/winter5.png'),
        require('../assets/accessories/winter/winter6.png'),
        require('../assets/accessories/winter/winter7.png'),
        require('../assets/accessories/winter/winter8.png'),
        require('../assets/accessories/winter/winter9.png'),
        require('../assets/accessories/winter/winter10.png'),
        require('../assets/accessories/winter/winter11.png'),
        require('../assets/accessories/winter/winter12.png'),
        require('../assets/accessories/winter/winter13.png'),
        require('../assets/accessories/winter/winter14.png'),
        require('../assets/accessories/winter/winter15.png'),
        require('../assets/accessories/winter/winter16.png'),
        require('../assets/accessories/winter/winter17.png'),
        require('../assets/accessories/winter/winter18.png'),
        require('../assets/accessories/winter/winter19.png'),
        require('../assets/accessories/winter/winter20.png'),
        require('../assets/accessories/winter/winter21.png'),
        require('../assets/accessories/winter/winter22.png'),
        require('../assets/accessories/winter/winter23.png'),
        require('../assets/accessories/winter/winter24.png'),
        require('../assets/accessories/winter/winter25.png'),
        require('../assets/accessories/winter/winter26.png'),
        require('../assets/accessories/winter/winter27.png'),
        require('../assets/accessories/winter/winter28.png'),
        require('../assets/accessories/winter/winter29.png'),
        require('../assets/accessories/winter/winter30.png'),
    ],
};

export default function AccessoriesScreen() {
    const navigation = useNavigation();
    const [selectedSeason, setSelectedSeason] = useState('Spring');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const flatListRef = React.useRef(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, [selectedSeason]);

    const handleSave = async (image) => {
        try {
            const resolved = RNImage.resolveAssetSource(image);
            const uri = resolved.uri;

            const existing = await AsyncStorage.getItem('@saved_accessories');
            const saved = existing ? JSON.parse(existing) : [];

            if (!saved.includes(uri)) {
                const updated = [...saved, uri];
                await AsyncStorage.setItem('@saved_accessories', JSON.stringify(updated));

                await saveItem({ image: uri, type: 'accessory' });

                ToastAndroid.show('Saved!', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Already saved!', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error saving image:', error);
            ToastAndroid.show('Failed to save!', ToastAndroid.SHORT);
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
    activeTabUnderline: {
        height: 2,
        backgroundColor: '#F97316',
        marginTop: 4,
        borderRadius: 2,
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
