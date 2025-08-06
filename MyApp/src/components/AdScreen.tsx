import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface AdScreenProps {
  onComplete: () => void;
  duration?: number; // duration in seconds
}

export const AdScreen: React.FC<AdScreenProps> = ({
  onComplete,
  duration = 5,
}) => {
  const [countdown, setCountdown] = useState(duration);
  const [progressAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay before transitioning
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onComplete, progressAnim, fadeAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏺 鉴宝大师 🏺</Text>
          <Text style={styles.subtitle}>专业古董文物鉴定平台</Text>
        </View>

        {/* Features Banner */}
        <View style={styles.featuresBanner}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>AI智能识别</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>专家级鉴定</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💎</Text>
            <Text style={styles.featureText}>价值评估</Text>
          </View>
        </View>

        {/* Ad Content */}
        <View style={styles.adContent}>
          <Text style={styles.adText}>
            ✨ 支持多种古董类型鉴定 ✨
          </Text>
          <View style={styles.categoryList}>
            <Text style={styles.categoryItem}>• 古代瓷器</Text>
            <Text style={styles.categoryItem}>• 珠宝玉石</Text>
            <Text style={styles.categoryItem}>• 书画作品</Text>
            <Text style={styles.categoryItem}>• 古钱币</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>
            {countdown > 0 ? `${countdown}秒后进入应用` : '正在进入...'}
          </Text>
        </View>

        {/* Skip Button (only show after 2 seconds) */}
        {countdown <= duration - 2 && countdown > 0 && (
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={styles.skipButtonText}>跳过广告</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresBanner: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    padding: 30,
    marginVertical: 30,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: '600',
  },
  adContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  adText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  categoryList: {
    alignItems: 'flex-start',
  },
  categoryItem: {
    fontSize: 16,
    color: '#cccccc',
    marginVertical: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: width - 80,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#ffd700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  skipButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: '600',
  },
});
