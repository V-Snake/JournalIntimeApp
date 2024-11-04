// components/SettingsScreen.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function SettingsScreen({ setIsDarkTheme, isDarkTheme }) {
  const toggleSwitch = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const { colors } = useTheme(); // Obtenir les couleurs du thème

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
      color: colors.text,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Mode Sombre</Text>
        <Switch
          onValueChange={toggleSwitch}
          value={isDarkTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDarkTheme ? colors.card : colors.background}
        />
      </View>
    </View>
  );
}
