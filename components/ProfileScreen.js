// components/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen() {
  const [pseudo, setPseudo] = useState('');
  const [image, setImage] = useState(null);
  const { colors } = useTheme(); // Obtenir les couleurs du thème

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedPseudo = await AsyncStorage.getItem('pseudo');
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedPseudo) setPseudo(storedPseudo);
      if (storedImage) {
        console.log('Image chargée depuis AsyncStorage:', storedImage); // Debugging
        setImage(storedImage);
      } else {
        console.log('Aucune image trouvée dans AsyncStorage'); // Debugging
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('pseudo', pseudo);
      if (image) {
        await AsyncStorage.setItem('profileImage', image);
        console.log('Image sauvegardée:', image); // Debugging
      }
      Alert.alert('Succès', 'Profil sauvegardé!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission d'accéder à la galerie refusée!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Ajoutez cette ligne pour obtenir l'image en base64
    });

    if (!result.canceled) {
      const base64Image = 'data:image/jpeg;base64,' + result.assets[0].base64;
      console.log('Image sélectionnée:', base64Image); // Debugging
      setImage(base64Image);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    label: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      marginTop: 8,
      color: colors.text,
      backgroundColor: colors.card,
    },
    image: {
      width: 100,
      height: 100,
      marginVertical: 16,
      borderRadius: 50,
    },
    placeholder: {
      width: 100,
      height: 100,
      marginVertical: 16,
      borderRadius: 50,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      color: colors.text,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: colors.primary,
      marginVertical: 8,
    },
    buttonText: {
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photo de profil:</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucune image</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choisir une image</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Pseudo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre pseudo"
        placeholderTextColor={colors.border}
        value={pseudo}
        onChangeText={setPseudo}
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </View>
  );
}
