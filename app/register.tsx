import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator,
  TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronLeft, Mail, ShieldCheck, Lock, ArrowRight, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  // step: 1 (Email輸入), 2 (驗證碼+密碼)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 表單資料
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  // 檢查是否為 Gmail
  const isGmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  // 第一步：發送驗證碼
  const handleSendCode = async () => {
    if (!isGmail(email)) {
      Alert.alert("格式錯誤", "為了系統安全，僅限使用 @gmail.com 帳號註冊。");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 🌟 這裡之後要對接後端： POST /api/auth/send-otp
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  // 第二步：驗證並註冊
  const handleFinalizeRegister = () => {
    if (otp.length < 6 || password.length < 8) return;

    setLoading(true);
    // 🌟 這裡之後要對接後端： POST /api/auth/register
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("註冊成功", "歡迎來到 GO PRIME！", [
        { text: "開始體驗", onPress: () => router.replace('/(tabs)') }
      ]);
    }, 1500);
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
            source="https://images.unsplash.com/photo-1552693673-1bf958298935?w=800"
            style={styles.bgImage}
            contentFit="cover"
          />
          <View style={styles.overlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => step > 1 ? setStep(1) : router.back()}>
            <ChevronLeft size={28} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.brandBox}>
            <Text style={styles.brandTitle}>建立新帳號</Text>
            <Text style={styles.brandSlogan}>加入預約美學的新標竿</Text>
          </View>
        </View>

        {/* 下方操作區 */}
        <View style={styles.formContainer}>
          {step === 1 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepBox}>
              <Text style={styles.formTitle}>您的 Gmail 地址</Text>
              <Text style={styles.formDesc}>我們將向此信箱發送驗證碼以確認身分</Text>
              
              <View style={styles.inputWrapper}>
                <Mail size={20} color={Colors.stone[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoFocus={Platform.OS !== 'web'}
                />
              </View>

              <TouchableOpacity 
                style={[styles.mainBtn, !isGmail(email) && styles.btnDisabled]} 
                onPress={handleSendCode}
                disabled={loading || !isGmail(email)}
              >
                {loading ? <ActivityIndicator color={Colors.white} /> : (
                  <>
                    <Text style={styles.mainBtnText}>獲取驗證碼</Text>
                    <ArrowRight size={20} color={Colors.white} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepBox}>
              <Text style={styles.formTitle}>最後一步</Text>
              <Text style={styles.formDesc}>請輸入 6 位驗證碼並設定密碼</Text>
              
              <View style={styles.inputWrapper}>
                <ShieldCheck size={20} color={Colors.stone[400]} />
                <TextInput
                  style={[styles.input, { letterSpacing: 4 }]}
                  placeholder="6 位驗證碼"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={20} color={Colors.stone[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="設定登入密碼 (至少8位)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity 
                style={[styles.mainBtn, (otp.length < 6 || password.length < 8) && styles.btnDisabled]} 
                onPress={handleFinalizeRegister}
                disabled={loading || otp.length < 6 || password.length < 8}
              >
                {loading ? <ActivityIndicator color={Colors.white} /> : (
                  <>
                    <Text style={styles.mainBtnText}>完成註冊</Text>
                    <Check size={20} color={Colors.white} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.footerText}>已有帳號？ <Text style={styles.linkHighlight}>返回登入</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  topArt: { height: height * 0.3, width: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  bgImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(28,25,23,0.5)' },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10, padding: 8 },
  brandBox: { alignItems: 'center', zIndex: 5, marginTop: 20 },
  brandTitle: { color: Colors.white, fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  brandSlogan: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6, fontWeight: '600' },

  formContainer: { flex: 1, backgroundColor: Colors.white, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 32, paddingTop: 40 },
  stepBox: { width: '100%' },
  formTitle: { fontSize: 24, fontWeight: '900', color: Colors.stone[900], marginBottom: 8 },
  formDesc: { fontSize: 14, color: Colors.stone[400], marginBottom: 32, fontWeight: '500' },
  
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[50], 
    borderRadius: 20, paddingHorizontal: 20, height: 64, marginBottom: 16,
    borderWidth: 1.5, borderColor: Colors.stone[100]
  },
  input: { flex: 1, marginLeft: 12, fontSize: 17, fontWeight: '700', color: Colors.stone[900] },

  mainBtn: { 
    backgroundColor: Colors.stone[900], height: 64, borderRadius: 24, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 10, elevation: 4
  },
  btnDisabled: { backgroundColor: Colors.stone[100], elevation: 0 },
  mainBtnText: { color: Colors.white, fontSize: 17, fontWeight: '900' },

  footer: { paddingBottom: Platform.OS === 'ios' ? 50 : 30, alignItems: 'center' },
  footerText: { color: Colors.stone[400], fontSize: 14, fontWeight: '600' },
  linkHighlight: { color: Colors.stone[900], fontWeight: '900', textDecorationLine: 'underline' }
});