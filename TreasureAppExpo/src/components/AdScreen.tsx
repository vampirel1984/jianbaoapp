import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AdScreenProps {
  onComplete: () => void;
  duration: number; // duration in seconds
}

export const AdScreen: React.FC<AdScreenProps> = ({ onComplete, duration }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration * 1000);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.adText}>Advertisement</Text>
      <Text style={styles.timerText}>This ad will close in {duration} seconds...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  adText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    color: 'gray',
  },
});
