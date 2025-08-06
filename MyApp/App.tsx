import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { AdScreen } from './src/components/AdScreen';

const { width, height } = Dimensions.get('window');

interface UploadedFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'ad' | 'main'>('ad');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAdComplete = () => {
    setCurrentScreen('main');
  };

  const selectImage = () => {
    Alert.alert(
      '选择图片',
      '请选择图片来源',
      [
        { text: '相机', onPress: () => openCamera() },
        { text: '相册', onPress: () => openGallery() },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file: UploadedFile = {
          uri: asset.uri!,
          type: asset.type!,
          name: asset.fileName || 'camera_image.jpg',
          size: asset.fileSize || 0,
        };
        setUploadedFiles([...uploadedFiles, file]);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 5,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.assets) {
        const newFiles: UploadedFile[] = response.assets.map(asset => ({
          uri: asset.uri!,
          type: asset.type!,
          name: asset.fileName || 'gallery_image.jpg',
          size: asset.fileSize || 0,
        }));
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      }
    });
  };

  const analyzeObjects = async () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('提示', '请先上传图片');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API call for object identification
    setTimeout(() => {
      const mockResults = [
        '古代瓷器 - 清朝青花瓷碗，年代约200-300年，市场估价：5000-8000元',
        '珠宝首饰 - 天然翡翠手镯，品质中上，市场估价：15000-25000元',
        '书画作品 - 现代仿古山水画，艺术价值一般，市场估价：500-1000元',
        '古钱币 - 清朝光绪元宝，保存完好，市场估价：800-1200元',
        '玉石制品 - 和田玉挂件，质地温润，市场估价：3000-5000元'
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const resetAll = () => {
    setUploadedFiles([]);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // Ad Screen
  if (currentScreen === 'ad') {
    return <AdScreen onComplete={handleAdComplete} duration={5} />;
  }

  // Main Screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏺 鉴宝大师</Text>
          <Text style={styles.headerSubtitle}>上传图片，识别您的宝物</Text>
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.uploadButtonIcon}>📷</Text>
            <Text style={styles.uploadButtonText}>选择图片</Text>
          </TouchableOpacity>

          {uploadedFiles.length > 0 && (
            <View style={styles.filesList}>
              <Text style={styles.filesListTitle}>已上传的图片 ({uploadedFiles.length})</Text>
              {uploadedFiles.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Image source={{ uri: file.uri }} style={styles.fileImage} />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFile(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.analyzeButton, uploadedFiles.length === 0 && styles.disabledButton]}
            onPress={analyzeObjects}
            disabled={uploadedFiles.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>
                {uploadedFiles.length === 0 ? '请先上传图片' : '开始鉴定'}
              </Text>
            )}
          </TouchableOpacity>

          {uploadedFiles.length > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
              <Text style={styles.resetButtonText}>重新开始</Text>
            </TouchableOpacity>
          )}
        </View>

        {analysisResult && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>🔍 鉴定结果</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>{analysisResult}</Text>
            </View>
            <Text style={styles.disclaimer}>
              *此结果仅供参考，具体价值请咨询专业鉴定师
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 10,
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
  uploadSection: {
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
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
  filesList: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filesListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  fileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionSection: {
    marginVertical: 20,
  },
  analyzeButton: {
    backgroundColor: '#27ae60',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#e67e22',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginVertical: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#ffd700',
  },
  resultText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  disclaimer: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
