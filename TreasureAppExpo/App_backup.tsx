import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

// Simple Ad Screen Component
const AdScreen = ({ onComplete, duration = 5 }) => {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <SafeAreaView style={adStyles.container}>
      <View style={adStyles.adContent}>
        <Text style={adStyles.adTitle}>📱 Welcome to Treasure App!</Text>
        <Text style={adStyles.adSubtitle}>Discover the value of your antiques</Text>
        <View style={adStyles.countdownContainer}>
          <Text style={adStyles.countdownText}>{countdown}</Text>
        </View>
        <Text style={adStyles.skipText}>Starting in {countdown} seconds...</Text>
      </View>
    </SafeAreaView>
  );
};

const adStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContent: {
    alignItems: 'center',
    padding: 40,
  },
  adTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  adSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  countdownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('ad');

  const handleAdComplete = () => {
    console.log('Ad complete, switching to main screen');
    setCurrentScreen('main');
  };

  const selectImage = () => {
    Alert.alert(
      'Select Image',
      'Please choose an image source',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    Alert.alert('Camera', 'Camera functionality would be implemented here');
  };

  const openGallery = () => {
    Alert.alert('Gallery', 'Gallery functionality would be implemented here');
  };

  // Ad Screen
  if (currentScreen === 'ad') {
    return <AdScreen onComplete={handleAdComplete} duration={5} />;
  }

  // Main Screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏺 Antique Appraisal</Text>
        <Text style={styles.headerSubtitle}>Upload photos and identify your treasures</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={selectImage}
      >
        <Text style={styles.uploadButtonIcon}>📷</Text>
        <Text style={styles.uploadButtonText}>Select Image</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.analyzeButton} 
        onPress={() => Alert.alert('Appraisal', 'This is a mock appraisal result!')}
      >
        <Text style={styles.analyzeButtonText}>Start Appraisal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  uploadButton: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadButtonIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#27ae60',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
