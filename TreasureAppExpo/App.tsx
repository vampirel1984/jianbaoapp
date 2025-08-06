import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
import * as ImagePicker from 'expo-image-picker';

// Simple Ad Screen Component
const AdScreen = ({ onComplete }) => {
  const [showingAd, setShowingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  useEffect(() => {
    let timer;
    
    if (showingAd) {
      timer = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            setShowingAd(false);
            // Use setTimeout to avoid updating during render
            setTimeout(() => onComplete(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showingAd, onComplete]);

  const triggerAd = () => {
    setShowingAd(true);
    setAdCountdown(5);
  };

  if (showingAd) {
    return (
      <SafeAreaView style={adStyles.adContainer}>
        <View style={adStyles.adContent}>
          <Text style={adStyles.adTitle}>🎯 Advertisement</Text>
          <Text style={adStyles.adText}>Premium Antique Identification Service</Text>
          <Text style={adStyles.adDescription}>Get professional appraisals from certified experts!</Text>
          <View style={adStyles.countdownContainer}>
            <Text style={adStyles.countdownText}>{adCountdown}</Text>
          </View>
          <Text style={adStyles.skipText}>Ad closes in {adCountdown} seconds...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={adStyles.container}>
      <View style={adStyles.adContent}>
        <Text style={adStyles.adTitle}>📱 Welcome to Treasure App!</Text>
        <Text style={adStyles.adSubtitle}>Discover the value of your antiques</Text>
        <TouchableOpacity style={adStyles.adButton} onPress={triggerAd}>
          <Text style={adStyles.adButtonText}>🎬 Watch Ad to Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={adStyles.skipButton} onPress={onComplete}>
          <Text style={adStyles.skipButtonText}>Skip Ad</Text>
        </TouchableOpacity>
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
  adContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  adDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  adButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  adButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('ad');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleAdComplete = () => {
    console.log('Ad complete, switching to main screen');
    setCurrentScreen('main');
  };

  const selectImage = () => {
    if (selectedImages.length >= 3) {
      Alert.alert('Maximum Images', 'You can select up to 3 images only.');
      return;
    }
    
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

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
      console.error('Camera error:', error);
    }
  };

  const openGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
      console.error('Gallery error:', error);
    }
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const startAppraisal = () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Images', 'Please select at least one image first!');
      return;
    }
    Alert.alert('Appraisal Started', `Analyzing your ${selectedImages.length} image(s)... This is a mock result!`);
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
      
      {/* Image Display Section */}
      {selectedImages.length > 0 && (
        <View style={styles.imageSection}>
          <Text style={styles.imageSectionTitle}>Selected Images ({selectedImages.length}/3)</Text>
          <View style={styles.imageGrid}>
            {selectedImages.map((image) => (
              <View key={image.id} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeImage(image.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={[
          styles.uploadButton,
          selectedImages.length >= 3 && styles.uploadButtonDisabled
        ]} 
        onPress={selectImage}
        disabled={selectedImages.length >= 3}
      >
        <Text style={styles.uploadButtonIcon}>📷</Text>
        <Text style={styles.uploadButtonText}>
          {selectedImages.length >= 3 ? 'Maximum Images Selected' : 'Select Image'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.analyzeButton,
          selectedImages.length === 0 && styles.analyzeButtonDisabled
        ]}
        onPress={startAppraisal}
        disabled={selectedImages.length === 0}
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
  uploadButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  imageSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
