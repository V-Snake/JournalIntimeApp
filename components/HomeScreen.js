// components/HomeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  useEffect(() => {
    if (isFocused) {
      loadEntries();
    }
  }, [isFocused]);

  const loadEntries = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const entriesData = await AsyncStorage.multiGet(keys);

      const entriesList = entriesData
        .map(([key, value]) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            const entry = JSON.parse(value);
            return {
              key,
              date: parseISO(key),
              title: entry.title || '',
              text: entry.text || '',
              mood: entry.mood !== undefined ? entry.mood : null,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.date - a.date); // Trier par date décroissante

      setEntries(entriesList);
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    }
  };

  const deleteEntry = async (key) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(key);
              loadEntries(); // Recharger les entrées après suppression
              Alert.alert('Succès', 'Entrée supprimée avec succès!');
            } catch (error) {
              console.error("Erreur lors de la suppression de l'entrée:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.entryContainer}
      onPress={() => navigation.navigate('EntryDetails', { dateKey: item.key })}
    >
      <Text style={styles.entryDate}>{format(item.date, 'dd/MM/yyyy')}</Text>
      <Text style={styles.entryTitle}>{item.title}</Text>
      <Text style={styles.entryText}>{item.text.substring(0, 50)}...</Text>
      {/* Affichage de l'humeur avec un émoji */}
      {item.mood !== null && (
        <Text style={styles.entryMood}>{getMoodEmoji(item.mood)}</Text>
      )}
    </TouchableOpacity>
  );

  const getMoodEmoji = (value) => {
    if (value < 1) {
      return '☹️';
    } else if (value < 2) {
      return '😐';
    } else {
      return '😊';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    entryContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    entryDate: {
      fontSize: 14,
      color: colors.text,
    },
    entryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    entryText: {
      fontSize: 14,
      color: colors.text,
    },
    entryMood: {
      fontSize: 24,
      marginTop: 8,
      color: colors.text,
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 50,
    },
    addButtonText: {
      fontSize: 24,
      color: '#fff',
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
