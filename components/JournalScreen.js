// components/JournalScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

export default function JournalScreen() {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(1.5);
  const [isEditing, setIsEditing] = useState(true);
  const [pseudo, setPseudo] = useState('');
  const [isToday, setIsToday] = useState(true);
  const isFocused = useIsFocused();
  const { colors, dark } = useTheme();

  // Références pour les animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const viewModeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadEntry();

    if (isFocused) {
      loadPseudo();
    }

    // Vérifier si la date actuelle est la date du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    setIsToday(currentDate >= today);

    // Animation de fade-in lors du chargement de l'écran
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [date, isFocused]);

  useEffect(() => {
    // Animation lors du changement de mode édition/visualisation
    Animated.timing(viewModeAnim, {
      toValue: isEditing ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isEditing]);

  const loadEntry = async () => {
    try {
      const storedEntry = await AsyncStorage.getItem(format(date, 'yyyy-MM-dd'));
      if (storedEntry) {
        const parsedEntry = JSON.parse(storedEntry);
        setTitle(parsedEntry.title || '');
        setEntry(parsedEntry.text || '');
        setMood(parsedEntry.mood !== undefined ? parsedEntry.mood : 1.5);
        setIsEditing(false);
      } else {
        setTitle('');
        setEntry('');
        setMood(1.5);
        setIsEditing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadPseudo = async () => {
    try {
      const storedPseudo = await AsyncStorage.getItem('pseudo');
      setPseudo(storedPseudo || '');
    } catch (error) {
      console.error('Erreur lors du chargement du pseudo:', error);
    }
  };

  const saveEntry = async () => {
    try {
      await AsyncStorage.setItem(
        format(date, 'yyyy-MM-dd'),
        JSON.stringify({ title, text: entry, mood })
      );
      setIsEditing(false);
      Alert.alert('Succès', 'Entrée sauvegardée avec succès!');
    } catch (error) {
      console.error(error);
    }
  };

  const resetEntry = () => {
    setTitle('');
    setEntry('');
    setMood(1.5);
  };

  const deleteEntry = async () => {
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
              await AsyncStorage.removeItem(format(date, 'yyyy-MM-dd'));
              resetEntry();
              setIsEditing(true);
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

  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    if (newDate > today) {
      // Ne pas permettre de naviguer vers une date future
      return;
    }

    setDate(newDate);
  };

  const selectDate = () => {
    Alert.alert('Info', 'Sélection de date non implémentée.');
  };

  const getMoodEmoji = (value) => {
    if (value < 1) {
      return '☹️';
    } else if (value < 2) {
      return '😐';
    } else {
      return '😊';
    }
  };

  // Fonction pour animer l'émoji lorsque le slider change
  const animateEmoji = () => {
    Animated.sequence([
      Animated.timing(emojiScale, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    welcomeText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: colors.text,
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 18,
      color: colors.text,
    },
    titleInput: {
      marginTop: 16,
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 8,
      color: colors.text,
      backgroundColor: dark ? '#1c1c1c' : '#fff',
    },
    textInput: {
      marginTop: 16,
      height: 150,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 8,
      textAlignVertical: 'top',
      color: colors.text,
      backgroundColor: dark ? '#1c1c1c' : '#fff',
    },
    sliderContainer: {
      marginVertical: 16,
      alignItems: 'center',
    },
    moodLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    moodEmoji: {
      fontSize: 32,
      color: colors.text,
      marginTop: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: colors.primary,
      marginHorizontal: 5,
      flex: 1,
    },
    buttonText: {
      color: colors.text,
    },
    savedTitle: {
      marginTop: 16,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    savedEntry: {
      marginTop: 8,
      fontSize: 16,
      color: colors.text,
    },
    savedMood: {
      marginTop: 16,
      fontSize: 18,
      color: colors.text,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.welcomeText}>
        {pseudo ? `Bienvenue, ${pseudo}` : 'Bienvenue'}
      </Text>

      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectDate}>
          <Text style={styles.dateText}>{format(date, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeDate(1)} disabled={isToday}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isToday ? colors.border : colors.text}
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <Animated.View
          style={{
            opacity: viewModeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Insérer un titre"
            placeholderTextColor={dark ? '#888' : '#aaa'}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Insérer un message"
            placeholderTextColor={dark ? '#888' : '#aaa'}
            value={entry}
            onChangeText={setEntry}
            multiline
          />
          <View style={styles.sliderContainer}>
            <Text style={styles.moodLabel}>Votre humeur :</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={3}
              step={0.1}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
              value={mood}
              onValueChange={(value) => {
                setMood(value);
                animateEmoji();
              }}
            />
            <Animated.Text
              style={[
                styles.moodEmoji,
                { transform: [{ scale: emojiScale }] },
              ]}
            >
              {getMoodEmoji(mood)}
            </Animated.Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={saveEntry}>
              <Text style={styles.buttonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={resetEntry}>
              <Text style={styles.buttonText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            opacity: viewModeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}
        >
          <Text style={styles.savedTitle}>{title || ''}</Text>
          <Text style={styles.savedEntry}>{entry || ''}</Text>
          <Text style={styles.savedMood}>
            Humeur : {getMoodEmoji(mood)} ({mood.toFixed(1)})
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteEntry}>
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
