import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronLeft, Mail, Lock, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // 模擬登入邏輯
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  const handleSocialLogin = (platform: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log(`${platform} Login`);
    // 第三方登入邏輯
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* 頂部視覺區 */}
        <View style={styles.topArt}>
          <Image 
            source="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800" 
            style={styles.bgImage}
            contentFit="cover"
          />
          <View style={styles.overlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={28} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.brandBox}>
            <View style={styles.logoCircle}>
              <Image source={require('../assets/images/icon.png')} style={styles.logo} />
            </View>
            <Text style={styles.brandTitle}>GO PRIME</Text>
            <Text style={styles.brandSlogan}>開啟您的專屬美學</Text>
          </View>
        </View>

        {/* 下方表單區 */}
        <View style={styles.formContainer}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.stepBox}>
            <Text style={styles.formTitle}>歡迎回來</Text>
            <Text style={styles.formDesc}>請輸入您的帳號密碼以繼續</Text>
            
            {/* 帳號輸入 */}
            <View style={styles.inputWrapper}>
              <Mail size={20} color={Colors.stone[400]} />
              <TextInput
                style={styles.input}
                placeholder="電子郵件 / 帳號"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* 密碼輸入 */}
            <View style={styles.inputWrapper}>
              <Lock size={20} color={Colors.stone[400]} />
              <TextInput
                style={styles.input}
                placeholder="密碼"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.mainBtn, (!email || !password) && styles.btnDisabled]} 
              onPress={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? <ActivityIndicator color={Colors.white} /> : (
                <>
                  <Text style={styles.mainBtnText}>立即登入</Text>
                  <ArrowRight size={20} color={Colors.white} />
                </>
              )}
            </TouchableOpacity>

            {/* 分隔線 */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>或透過以下方式</Text>
              <View style={styles.line} />
            </View>

            {/* 第三方登入按鈕 */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('Google')}>
                <Image source="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={styles.socialIcon} />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('Apple')}>
                <Image source="https://cdn-icons-png.flaticon.com/512/0/747.png" style={styles.socialIcon} />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* 跳轉註冊 */}
            <TouchableOpacity 
              style={styles.registerLink} 
              onPress={() => router.push('/register')} // 🌟 這裡修改為 /register
            >
              <Text style={styles.resendText}>還沒有帳號？ <Text style={styles.linkHighlight}>立即註冊</Text></Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* 底部政策 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>登入即代表您同意本平台的</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity><Text style={styles.footerLink}>服務條款</Text></TouchableOpacity>
            <Text style={styles.footerText}> 與 </Text>
            <TouchableOpacity><Text style={styles.footerLink}>隱私政策</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  topArt: { height: height * 0.35, width: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  bgImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(28,25,23,0.5)' },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10, padding: 8 },
  brandBox: { alignItems: 'center', zIndex: 5 },
  logoCircle: { width: 70, height: 70, borderRadius: 24, backgroundColor: Colors.white, padding: 14, marginBottom: 12 },
  logo: { width: '100%', height: '100%' },
  brandTitle: { color: Colors.white, fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  brandSlogan: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4, fontWeight: '600' },

  formContainer: { flex: 1, backgroundColor: Colors.white, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 32, paddingTop: 30 },
  stepBox: { width: '100%' },
  formTitle: { fontSize: 26, fontWeight: '900', color: Colors.stone[900], marginBottom: 6 },
  formDesc: { fontSize: 14, color: Colors.stone[400], marginBottom: 28, fontWeight: '500' },
  
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[50], 
    borderRadius: 20, paddingHorizontal: 20, height: 60, marginBottom: 16,
    borderWidth: 1.5, borderColor: Colors.stone[100]
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '700', color: Colors.stone[900] },

  mainBtn: { 
    backgroundColor: Colors.stone[900], height: 60, borderRadius: 20, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 10, elevation: 4
  },
  btnDisabled: { backgroundColor: Colors.stone[100], elevation: 0 },
  mainBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: Colors.stone[100] },
  dividerText: { marginHorizontal: 12, color: Colors.stone[300], fontSize: 12, fontWeight: '700' },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    height: 56, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.stone[100], backgroundColor: Colors.white 
  },
  socialIcon: { width: 20, height: 20, marginRight: 10 },
  socialBtnText: { fontSize: 15, fontWeight: '800', color: Colors.stone[800] },

  registerLink: { marginTop: 30, alignSelf: 'center' },
  resendText: { color: Colors.stone[400], fontSize: 14, fontWeight: '600' },
  linkHighlight: { color: Colors.stone[900], fontWeight: '900', textDecorationLine: 'underline' },

  footer: { paddingBottom: Platform.OS === 'ios' ? 40 : 30, alignItems: 'center' },
  footerText: { color: Colors.stone[300], fontSize: 11 },
  footerLink: { color: Colors.stone[500], fontSize: 11, fontWeight: '800', textDecorationLine: 'underline' }
});