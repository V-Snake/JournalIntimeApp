// components/AddEntryScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function AddEntryScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mood, setMood] = useState(1.5);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors } = useTheme();

  // Référence pour l'animation de l'émoji
  const emojiScale = React.useRef(new Animated.Value(1)).current;

  const saveEntry = async () => {
    if (!title && !text) {
      Alert.alert('Erreur', 'Veuillez saisir un titre ou un texte.');
      return;
    }

    const dateKey = format(date, 'yyyy-MM-dd');

    try {
      await AsyncStorage.setItem(
        dateKey,
        JSON.stringify({ title, text, mood })
      );
      Alert.alert('Succès', 'Entrée sauvegardée avec succès!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'entrée:", error);
    }
  };

  const resetEntry = () => {
    setTitle('');
    setText('');
    setMood(1.5);
    setDate(new Date());
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

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      if (selectedDate > today) {
        Alert.alert('Erreur', 'Vous ne pouvez pas choisir une date future.');
        return;
      }
      setDate(selectedDate);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      marginBottom: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    button: {
      padding: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    moodContainer: {
      marginVertical: 16,
    },
    moodLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    moodEmoji: {
      fontSize: 32,
      color: colors.text,
      textAlign: 'center',
      marginTop: 8,
    },
    datePickerButton: {
      padding: 12,
      backgroundColor: colors.card,
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 16,
    },
    datePickerButtonText: {
      color: colors.text,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          Date : {format(date, 'dd/MM/yyyy')}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          maximumDate={new Date()}
          display="default"
          onChange={onChangeDate}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Titre"
        placeholderTextColor={colors.border}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 200, textAlignVertical: 'top' }]}
        placeholder="Texte"
        placeholderTextColor={colors.border}
        value={text}
        onChangeText={setText}
        multiline
      />
      <View style={styles.moodContainer}>
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
    </View>
  );
}
