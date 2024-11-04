// navigation/DrawerNavigator.js

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator'; // Importer le StackNavigator
import EvolutionScreen from '../components/EvolutionScreen';
import ProfileScreen from '../components/ProfileScreen';
import SettingsScreen from '../components/SettingsScreen';
import { useTheme } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ setIsDarkTheme, isDarkTheme }) {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Accueil"
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerTintColor: colors.text,
        // Ajout des transitions animées
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Drawer.Screen name="Accueil" component={StackNavigator} />
      <Drawer.Screen name="Évolution" component={EvolutionScreen} />
      <Drawer.Screen name="Profil" component={ProfileScreen} />
      <Drawer.Screen name="Paramètres">
        {(props) => (
          <SettingsScreen
            {...props}
            setIsDarkTheme={setIsDarkTheme}
            isDarkTheme={isDarkTheme}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
