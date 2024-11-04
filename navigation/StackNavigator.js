// navigation/StackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import AddEntryScreen from '../components/AddEntryScreen';
import EntryDetailsScreen from '../components/EntryDetailsScreen';
import { useTheme } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Journal' }} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Nouvelle Entrée' }} />
      <Stack.Screen
        name="EntryDetails"
        component={EntryDetailsScreen}
        options={{ title: 'Détails de l\'Entrée' }}
      />
    </Stack.Navigator>
  );
}
