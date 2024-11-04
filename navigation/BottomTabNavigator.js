// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import JournalScreen from '../components/JournalScreen';
import ProfileScreen from '../components/ProfileScreen';
import SettingsScreen from '../components/SettingsScreen';
import { useTheme } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ setIsDarkTheme, isDarkTheme }) {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Journal"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Profil') {
            iconName = 'person-circle-outline';
          } else if (route.name === 'Journal') {
            iconName = 'book-outline';
          } else if (route.name === 'Paramètres') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Profil" component={ProfileScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Paramètres">
        {(props) => (
          <SettingsScreen
            {...props}
            setIsDarkTheme={setIsDarkTheme}
            isDarkTheme={isDarkTheme}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
