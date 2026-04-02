import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // 宣告動畫狀態值
  const scaleAnim = useRef(new Animated.Value(0)).current;      // 控制 Logo 縮放
  const logoOpacity = useRef(new Animated.Value(0)).current;    // 控制 Logo 淡入
  const textOpacity = useRef(new Animated.Value(0)).current;    // 控制提示文字呼吸燈
  const screenOpacity = useRef(new Animated.Value(1)).current;  // 控制點擊後的整體淡出

  useEffect(() => {
    // 1. 進場動畫：Logo 彈跳 (Spring) 與淡入 (Timing) 同時進行
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,   // 摩擦力越小，彈跳次數越多
        tension: 40,   // 張力越大，回彈速度越快
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Logo 進場完成後，底部文字開始「呼吸燈」閃爍
      Animated.loop(
        Animated.sequence([
          Animated.timing(textOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  // 處理點擊畫面任意處的事件
  const handlePress = () => {
    // 給予點擊震動回饋
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // 3. 退場動畫：整個畫面淡出，完成後跳轉至主頁
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 400, // 400 毫秒的平滑淡出
      useNativeDriver: true,
    }).start(() => {
      // 使用 replace 而不是 push，這樣使用者在主頁按返回鍵就不會回到這個歡迎動畫
      router.replace('/(tabs)');
    });
  };

  return (
    // TouchableWithoutFeedback 可以讓整個螢幕都變成可點擊區域
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
        
        {/* 畫面中央的 Logo 區塊 */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }], opacity: logoOpacity }]}>
          <Image 
            // 💡 確保這裡的路徑與你實際放置 icon.png 的位置一致
            source={require('../assets/images/icon.png')} 
            style={styles.logo} 
            contentFit="contain"
          />
          <Text style={styles.title}>GO PRIME</Text>
        </Animated.View>

        {/* 畫面底部的提示文字區塊 */}
        <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
          <Text style={styles.promptText}>點擊任意處進入 APP</Text>
        </Animated.View>
        
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.stone[50], // ✅ 改為淺石灰背景，與首頁一致
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24, // 如果你的 icon.png 是方形的，可以加一點圓角
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.stone[900], // ✅ 文字改為深黑色
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  promptText: {
    fontSize: 14,
    color: Colors.stone[500], // ✅ 提示文字改為柔和的中灰色
    letterSpacing: 1,
  },
});