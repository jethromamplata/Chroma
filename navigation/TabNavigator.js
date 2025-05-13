import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UndertoneScreen from '../screens/UndertoneScreen';
import SeasonalPalettesScreen from '../screens/SeasonalPalettesScreen';
import AccessoriesScreen from '../screens/AccessoriesScreen';
import OutfitIdeasScreen from "../screens/OutfitIdeasScreen";
import VirtualClosetScreen from "../screens/VirtualClosetScreen";
import AboutUsScreen from '../screens/AboutUsScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';


const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
            <ProfileStack.Screen name="AboutUs" component={AboutUsScreen} />
            <ProfileStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />

        </ProfileStack.Navigator>
    );
}
function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="HomeMain" component={HomeScreen} />
            <HomeStack.Screen name="Undertone" component={UndertoneScreen} />
            <HomeStack.Screen name="SeasonalPalettes" component={SeasonalPalettesScreen} />
            <HomeStack.Screen name="Accessories" component={AccessoriesScreen} />
            <HomeStack.Screen name="OutfitIdeas" component={OutfitIdeasScreen} />
            <HomeStack.Screen name="VirtualCloset" component={VirtualClosetScreen} />

        </HomeStack.Navigator>
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                    fontWeight: '500',
                },
                tabBarActiveTintColor: '#F97316',
                tabBarInactiveTintColor: '#A1A1AA',
                tabBarStyle: {
                    height: 65,
                    backgroundColor: '#FFFBEB',
                    borderTopColor: '#FCD34D',
                    borderTopWidth: 1,
                },
                tabBarIcon: ({ focused, color }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Saved') iconName = 'archive';
                    else if (route.name === 'Profile') iconName = 'user';

                    return (
                        <View style={styles.iconWrapper}>
                            <Entypo
                                name={iconName}
                                size={24}
                                color={color}
                                style={{ opacity: focused ? 1 : 0.6 }}
                            />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Saved" component={SavedScreen} />
            <Tab.Screen name="Profile" component={ProfileStackScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
