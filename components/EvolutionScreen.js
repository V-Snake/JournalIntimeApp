// components/EvolutionScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import { useIsFocused, useTheme } from '@react-navigation/native';

export default function EvolutionScreen() {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  useEffect(() => {
    if (isFocused) {
      loadMoodData();
    }
  }, [isFocused]);

  const loadMoodData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);

      const moodData = entries
        .map(([key, value]) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            const entry = JSON.parse(value);
            return {
              date: parseISO(key),
              mood: typeof entry.mood === 'number' ? entry.mood : null,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && item.mood !== null);

      moodData.sort((a, b) => a.date - b.date);

      setData(moodData);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtenir les dates uniques pour les ticks
  const uniqueDates = data.map((item) => item.date);

  const styles = StyleSheet.create({
    title: {
      textAlign: 'center',
      marginVertical: 16,
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    noData: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.text,
    },
  });

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Text style={styles.title}>Évolution de vos humeurs</Text>
      {data.length > 0 ? (
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis
            tickValues={uniqueDates}
            tickFormat={(x) => format(x, 'dd/MM')}
            style={{
              tickLabels: {
                angle: -45,
                fontSize: 10,
                padding: 15,
                fill: colors.text,
              },
              axis: { stroke: colors.text },
              grid: { stroke: colors.border },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickValues={[0, 1, 2, 3]}
            tickFormat={(t) => {
              if (t < 1) {
                return '☹️';
              } else if (t < 2) {
                return '😐';
              } else {
                return '😊';
              }
            }}
            style={{
              tickLabels: {
                fontSize: 10,
                padding: 5,
                fill: colors.text,
              },
              axis: { stroke: colors.text },
              grid: { stroke: colors.border },
            }}
          />
          <VictoryLine
            data={data}
            x="date"
            y="mood"
            interpolation="monotoneX"
            animate={{
              duration: 1000,
              onLoad: { duration: 1000 },
            }}
            style={{
              data: { stroke: colors.primary || '#00aaff' },
            }}
          />
        </VictoryChart>
      ) : (
        <Text style={styles.noData}>Aucune donnée disponible</Text>
      )}
    </ScrollView>
  );
}
