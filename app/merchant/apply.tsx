// app/merchant/apply.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Dimensions, Platform, KeyboardAvoidingView,
  Modal, Linking, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  X, Store, Palette, ChevronRight, ChevronLeft, Bell,
  Search, Zap, MessageSquare, Info, Instagram, Link2,
  CheckCircle2, MessageCircle,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// 🌟 你的後端 API Base URL
const API_BASE = 'https://prime-api.goverce.com';

export default function MerchantApplyScreen() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表單資料狀態
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('美甲');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [igLink, setIgLink] = useState('');

  // 導覽彈窗狀態
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guidePages = [
    { title: "1. 接收即時通知", desc: "附近的客人發起需求時，您的手機會立即收到推播通知，不漏接任何商機。", icon: Bell, color: Colors.stone[900] },
    { title: "2. 審核客製需求", desc: "清楚查看客人的服務項目、預算範圍與期望時間，評估是否符合您的空檔。", icon: Search, color: Colors.stone[900] },
    { title: "3. 秒速搶單競標", desc: "點擊『立即搶單』。在眾多競爭者中，系統會依據反應速度與評分進行媒合。", icon: Zap, color: Colors.amber400 },
    { title: "4. 開啟即時對話", desc: "媒合成功後自動開啟聊天室，您可以直接與客人溝通細節並引導到店。", icon: MessageSquare, color: Colors.stone[900] },
  ];

  const handleNextGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (guideStep < 3) setGuideStep(guideStep + 1);
    else setIsGuideVisible(false);
  };

  // 🌟 核心：第 4 步送出時真正呼叫 API
  const handleSubmit = async () => {
    if (!shopName.trim()) {
      Alert.alert('缺少資料', '請填寫店鋪名稱');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('缺少資料', '請填寫聯絡電話');
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await fetch(`${API_BASE}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: shopName.trim(),
          category,
          phone: phone.trim(),
          lineId: lineId.trim(),
          igLink: igLink.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '送出失敗，請稍後再試');
      }

      // 送出成功 → 進入成功頁面
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep(5);
    } catch (error: any) {
      Alert.alert('送出失敗', error.message || '網路錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // 最後一步改為呼叫 API
    if (step === 4) {
      handleSubmit();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(step - 1);
    else router.back();
  };

  const openLineChannel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const lineUrl = 'https://lin.ee/YSXboQW';
    Linking.openURL(lineUrl).catch(() => Alert.alert('無法開啟 LINE'));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* 流程導覽 Modal */}
      <Modal visible={isGuideVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.guideCard}>
            <TouchableOpacity style={styles.guideClose} onPress={() => setIsGuideVisible(false)}>
              <X size={20} color={Colors.stone[400]} />
            </TouchableOpacity>
            <View style={styles.guideContent}>
              {React.createElement(guidePages[guideStep].icon, {
                size: 64, color: guidePages[guideStep].color, style: { marginBottom: 24 }
              })}
              <Text style={styles.guideTitle}>{guidePages[guideStep].title}</Text>
              <Text style={styles.guideDesc}>{guidePages[guideStep].desc}</Text>
            </View>
            <View style={styles.guideFooter}>
              <View style={styles.dotContainer}>
                {guidePages.map((_, i) => (
                  <View key={i} style={[styles.dot, guideStep === i ? styles.dotActive : styles.dotInactive]} />
                ))}
              </View>
              <TouchableOpacity style={styles.guideBtn} onPress={handleNextGuide}>
                <Text style={styles.guideBtnText}>{guideStep === 3 ? '開始填寫申請' : '下一步'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        {step < 5 && (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ChevronLeft size={28} color={Colors.stone[900]} />
          </TouchableOpacity>
        )}
        {step < 5 && (
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((s) => (
              <View key={s} style={[styles.progressBar, step >= s ? styles.progressActive : styles.progressInactive]} />
            ))}
          </View>
        )}
        {step < 5 && <View style={{ width: 40 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Step 1：店鋪名稱 */}
        {step === 1 && (
          <View style={styles.stepView}>
            <Store size={40} color={Colors.stone[900]} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>店鋪基本資訊</Text>
            <TouchableOpacity style={styles.guideTrigger} onPress={() => { setIsGuideVisible(true); setGuideStep(0); }}>
              <Info size={14} color={Colors.amber400} />
              <Text style={styles.guideTriggerText}>了解接單流程如何運作？</Text>
            </TouchableOpacity>
            <Text style={styles.label}>店鋪名稱 *</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：Yuki Nail Studio"
              value={shopName}
              onChangeText={setShopName}
            />
          </View>
        )}

        {/* Step 2：類別 + 電話 + LINE */}
        {step === 2 && (
          <View style={styles.stepView}>
            <Palette size={40} color={Colors.stone[900]} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>專業領域與聯繫</Text>
            <Text style={styles.label}>服務類別</Text>
            <View style={styles.catGrid}>
              {['美甲', '醫美', '除毛', '刺青'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, category === cat && styles.catBtnActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { marginTop: 24 }]}>聯絡電話 *</Text>
            <TextInput
              style={styles.input}
              placeholder="09xx-xxx-xxx"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={[styles.label, { marginTop: 24 }]}>LINE ID</Text>
            <TextInput
              style={styles.input}
              placeholder="方便後端與您聯繫"
              value={lineId}
              onChangeText={setLineId}
            />
          </View>
        )}

        {/* Step 3：Instagram */}
        {step === 3 && (
          <View style={styles.stepView}>
            <Instagram size={40} color={Colors.stone[900]} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>品質與作品驗證</Text>
            <Text style={styles.label}>Instagram 作品連結</Text>
            <View style={styles.inputWrapper}>
              <Link2 size={18} color={Colors.stone[300]} style={{ marginRight: 10 }} />
              <TextInput
                style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
                placeholder="instagram.com/yourname"
                value={igLink}
                onChangeText={setIgLink}
              />
            </View>
          </View>
        )}

        {/* Step 4：確認預覽 */}
        {step === 4 && (
          <View style={styles.stepView}>
            <Zap size={40} color={Colors.amber400} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>確認並送出</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={styles.userDot} />
                <Text style={styles.userText}>{shopName || '您的店名'}</Text>
              </View>
              <Text style={styles.previewTag}>專業：{category}</Text>
              <Text style={styles.previewTag}>電話：{phone || '未填寫'}</Text>
              {lineId ? <Text style={styles.previewTag}>LINE：{lineId}</Text> : null}
              {igLink ? <Text style={styles.previewTag}>IG：{igLink}</Text> : null}
            </View>
            <Text style={styles.confirmNote}>
              確認資料無誤後，點擊下方「確認送出」，您的申請將立即傳送給 GO PRIME 審核團隊。
            </Text>
          </View>
        )}

        {/* Step 5：成功頁面 */}
        {step === 5 && (
          <View style={styles.resultView}>
            <Image
              source="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
              style={styles.successImage}
              contentFit="cover"
            />
            <View style={styles.successBadge}>
              <CheckCircle2 size={32} color={Colors.white} />
            </View>
            <Text style={styles.resultTitle}>資料已成功送出！</Text>
            <Text style={styles.resultSubtitle}>
              我們已收到 {shopName} 的申請。為了加速審核進度，請點擊下方按鈕加入官方 LINE 並告知您的店名。
            </Text>
            <View style={styles.copyBox}>
              <Text style={styles.copyLabel}>您的店名：</Text>
              <Text style={styles.copyValue}>{shopName}</Text>
            </View>
            <TouchableOpacity style={styles.lineBtn} onPress={openLineChannel}>
              <MessageCircle size={24} color={Colors.white} />
              <Text style={styles.lineBtnText}>立即聯繫官方 LINE 審核</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backHomeBtn}
              onPress={() => router.replace('/(tabs)/profile')}
            >
              <Text style={styles.backHomeText}>暫不聯繫，先回首頁</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {step < 5 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.nextBtnText}>
                  {step === 4 ? '確認送出' : '下一步'}
                </Text>
                <ChevronRight size={20} color={Colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  progressContainer: { flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'center' },
  progressBar: { height: 4, width: 30, borderRadius: 2 },
  progressActive: { backgroundColor: Colors.stone[900] },
  progressInactive: { backgroundColor: Colors.stone[100] },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  guideCard: { backgroundColor: Colors.white, borderRadius: 32, padding: 32, alignItems: 'center' },
  guideClose: { position: 'absolute', top: 20, right: 20, padding: 4 },
  guideContent: { alignItems: 'center', marginVertical: 24 },
  guideTitle: { fontSize: 22, fontWeight: '900', color: Colors.stone[900], marginBottom: 12 },
  guideDesc: { fontSize: 15, color: Colors.stone[500], textAlign: 'center', lineHeight: 22, fontWeight: '600' },
  guideFooter: { width: '100%', alignItems: 'center' },
  dotContainer: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 18, backgroundColor: Colors.stone[900] },
  dotInactive: { width: 6, backgroundColor: Colors.stone[100] },
  guideBtn: { backgroundColor: Colors.stone[900], width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  guideBtnText: { color: Colors.white, fontWeight: '900', fontSize: 16 },

  scrollContent: { padding: 24 },
  stepView: { marginTop: 10 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.stone[900], marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '800', color: Colors.stone[400], marginBottom: 10, marginLeft: 4 },
  guideTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  guideTriggerText: { color: Colors.amber400, fontSize: 14, fontWeight: '800', textDecorationLine: 'underline' },
  input: { fontSize: 18, borderBottomWidth: 1.5, borderBottomColor: Colors.stone[100], paddingVertical: 12, fontWeight: '700', color: Colors.stone[900] },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: Colors.stone[100] },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.stone[50] },
  catBtnActive: { backgroundColor: Colors.stone[900] },
  catBtnText: { fontSize: 14, fontWeight: '800', color: Colors.stone[400] },
  catBtnTextActive: { color: Colors.white },

  previewCard: { backgroundColor: Colors.stone[50], borderRadius: 24, padding: 20, marginTop: 10, borderWidth: 1, borderColor: Colors.stone[100], gap: 8 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  userDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.amber400 },
  userText: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },
  previewTag: { fontSize: 13, color: Colors.stone[500], fontWeight: '700' },
  confirmNote: { fontSize: 13, color: Colors.stone[400], marginTop: 20, lineHeight: 20, fontWeight: '600' },

  resultView: { alignItems: 'center', paddingTop: 20 },
  successImage: { width: width - 48, height: 240, borderRadius: 32, marginBottom: -40 },
  successBadge: { backgroundColor: '#22c55e', padding: 12, borderRadius: 24, borderWidth: 6, borderColor: Colors.white },
  resultTitle: { fontSize: 28, fontWeight: '900', color: Colors.stone[900], marginTop: 24, textAlign: 'center' },
  resultSubtitle: { fontSize: 15, color: Colors.stone[500], textAlign: 'center', marginTop: 12, lineHeight: 22, fontWeight: '600' },
  copyBox: { backgroundColor: Colors.stone[50], padding: 16, borderRadius: 16, width: '100%', marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  copyLabel: { color: Colors.stone[400], fontWeight: '700' },
  copyValue: { color: Colors.stone[900], fontWeight: '900' },
  lineBtn: { backgroundColor: '#06C755', width: '100%', height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 32 },
  lineBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  backHomeBtn: { marginTop: 20, padding: 12 },
  backHomeText: { color: Colors.stone[400], fontSize: 14, fontWeight: '800' },

  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  nextBtn: { backgroundColor: Colors.stone[900], height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnText: { color: Colors.white, fontSize: 18, fontWeight: '900' },
});