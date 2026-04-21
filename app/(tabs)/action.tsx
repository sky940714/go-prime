import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Dimensions, Platform
} from 'react-native';
import { router } from 'expo-router';
import { 
  X, Sparkles, Palette, Zap, Clock, 
  User, DollarSign, ChevronRight, ChevronLeft, MapPin, 
  Search, CheckCircle2
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// ─── 資料定義 ───────────────────────────────────────────────
const TAIPEI_METRO_STATIONS = [
  '台北車站', '中山', '西門', '東區/忠孝復興', '市政府', '信義安和', 
  '南京復興', '公館', '板橋', '淡水', '松山', '內湖', '行天宮', '古亭'
];

const SERVICE_OPTIONS = {
  '美甲': ['單色/貓眼', '法式/漸層', '設計款式', '卸甲重做', '延甲'],
  '醫美': ['臉部微調', '皮膚管理', '雷射療程', '身體塑形'],
  '除毛': ['腋下', '手臂', '全腿', '私密處'],
  '刺青': ['美式文字', '日系大圖', '微刺青', '改圖/蓋圖'],
};

const BUDGET_RANGES = [
  '500 內', '500 - 1,000', '1,000 - 2,000', '2,000 - 3,500', 
  '3,500 - 5,500', '5,500 - 8,000', '8,000 - 12,000', '12,000 - 20,000'
];

export default function ActionScreen() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // 表單資料狀態
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedType, setSelectedType] = useState('美甲');
  const [selectedService, setSelectedService] = useState('');
  const [userGender, setUserGender] = useState('女生');
  const [designerPref, setDesignerPref] = useState('不限');
  const [timing, setTiming] = useState('今天');
  const [selectedBudget, setSelectedBudget] = useState('');

  // 進度條動畫邏輯
  const progressWidth = useSharedValue(1 / totalSteps);
  useEffect(() => {
    progressWidth.value = withSpring(step / totalSteps, { damping: 15 });
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  // 搜尋站點過濾
  const filteredStations = useMemo(() => {
    if (!locationSearch || selectedLocation === locationSearch) return [];
    return TAIPEI_METRO_STATIONS.filter(s => s.includes(locationSearch));
  }, [locationSearch, selectedLocation]);

  const nextStep = () => {
    if (step < totalSteps) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(prev => prev + 1);
    } else {
      finalizeMatch();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const finalizeMatch = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: '/match',
      params: { location: selectedLocation, service: selectedService }
    });
  };

  // ─── 渲染邏輯優化：改為單純的函數調用而非組件定義 ──────────────────

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View key="step1" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <MapPin size={48} color={Colors.stone[900]} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>服務地點在哪？</Text>
            <Text style={styles.subTitle}>選擇您方便前往的捷運站或地區</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.stone[400]} style={{ marginRight: 12 }} />
              <TextInput 
                style={styles.searchInput}
                placeholder="搜尋台北捷運站..."
                value={locationSearch}
                onChangeText={setLocationSearch}
                placeholderTextColor={Colors.stone[300]}
              />
            </View>
            <ScrollView style={styles.listWrapper} showsVerticalScrollIndicator={false}>
              {(locationSearch ? filteredStations : TAIPEI_METRO_STATIONS).map(station => (
                <TouchableOpacity 
                  key={station} 
                  style={[styles.itemRow, selectedLocation === station && styles.itemRowActive]}
                  onPress={() => {
                    setSelectedLocation(station);
                    setLocationSearch(station);
                    Haptics.selectionAsync();
                    setTimeout(nextStep, 250);
                  }}
                >
                  <Text style={[styles.itemLabel, selectedLocation === station && styles.itemLabelActive]}>{station}</Text>
                  {selectedLocation === station && <CheckCircle2 size={20} color={Colors.stone[900]} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View key="step2" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <Palette size={48} color={Colors.stone[900]} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>您想預約什麼？</Text>
            <View style={styles.catGrid}>
              {Object.keys(SERVICE_OPTIONS).map((name) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedType(name);
                    setSelectedService('');
                  }}
                  style={[styles.catBtn, selectedType === name && styles.catBtnActive]}
                >
                  <Text style={[styles.catBtnText, selectedType === name && styles.catBtnTextActive]}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipWrapper}>
              {SERVICE_OPTIONS[selectedType as keyof typeof SERVICE_OPTIONS].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setSelectedService(item);
                    Haptics.selectionAsync();
                  }}
                  style={[styles.chip, selectedService === item && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedService === item && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View key="step3" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <User size={48} color={Colors.stone[900]} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>關於施作偏好</Text>
            <Text style={styles.inputLabel}>您的性別</Text>
            <View style={styles.segmentedControl}>
              {['女生', '男生'].map((g) => (
                <TouchableOpacity key={g} style={[styles.segmentBtn, userGender === g && styles.segmentBtnActive]} onPress={() => setUserGender(g)}>
                  <Text style={[styles.segmentText, userGender === g && styles.segmentTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.inputLabel, { marginTop: 40 }]}>偏好施作人員</Text>
            <View style={styles.segmentedControl}>
              {['不限', '女性', '男性'].map((p) => (
                <TouchableOpacity key={p} style={[styles.segmentBtn, designerPref === p && styles.segmentBtnActive]} onPress={() => setDesignerPref(p)}>
                  <Text style={[styles.segmentText, designerPref === p && styles.segmentTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View key="step4" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <Clock size={48} color={Colors.stone[900]} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>什麼時候方便？</Text>
            <View style={styles.listContainer}>
              {['今天', '明天', '本週末', '選擇其他日期'].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={[styles.bigItem, timing === item && styles.bigItemActive]}
                  onPress={() => {
                    setTiming(item);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.bigItemText, timing === item && styles.bigItemTextActive]}>{item}</Text>
                  <View style={[styles.radioCircle, timing === item && styles.radioCircleActive]} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View key="step5" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <DollarSign size={48} color={Colors.stone[900]} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>預算範圍</Text>
            <Text style={styles.subTitle}>我們將依此為您過濾合適的店家</Text>
            <View style={styles.budgetGrid}>
              {BUDGET_RANGES.map((b) => (
                <TouchableOpacity 
                  key={b} 
                  style={[styles.budgetBox, selectedBudget === b && styles.budgetBoxActive]}
                  onPress={() => {
                    setSelectedBudget(b);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTimeout(nextStep, 250);
                  }}
                >
                  <Text style={[styles.budgetText, selectedBudget === b && styles.budgetTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 6:
        return (
          <Animated.View key="step6" entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContent}>
            <Sparkles size={48} color={Colors.amber400} style={styles.iconHeader} />
            <Text style={styles.mainTitle}>確認您的需求</Text>
            <View style={styles.reviewCard}>
              <ReviewRow icon={MapPin} label="地點" value={selectedLocation} />
              <ReviewRow icon={Palette} label="服務" value={`${selectedType} / ${selectedService}`} />
              <ReviewRow icon={User} label="偏好" value={`${userGender} / ${designerPref}施作人員`} />
              <ReviewRow icon={Clock} label="時間" value={timing} />
              <ReviewRow icon={DollarSign} label="預算" value={selectedBudget} isLast />
            </View>
            <Text style={styles.noticeText}>點擊確認後，系統將發送需求給附近的在線商家。</Text>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 頂部導覽 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={prevStep} style={styles.navBtn}>
          <ChevronLeft size={28} color={Colors.stone[900]} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <X size={24} color={Colors.stone[900]} />
        </TouchableOpacity>
      </View>

      {/* 步驟主體 - 直接調用渲染函數 */}
      <View style={styles.mainBody}>
        {renderStep()}
      </View>

      {/* 底部按鈕列 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.primaryBtn, (step === 2 && !selectedService) && styles.primaryBtnDisabled]} 
          onPress={nextStep}
          disabled={step === 2 && !selectedService}
        >
          <Text style={styles.primaryBtnText}>
            {step === totalSteps ? '發布需求並開始配對' : '繼續下一個步驟'}
          </Text>
          <ChevronRight size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── 內部子元件 (移出主元件外以防重新渲染問題) ──────────────────────
const ReviewRow = ({ icon: Icon, label, value, isLast }: any) => (
  <View style={[styles.reviewRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.reviewLabelGroup}>
      <Icon size={16} color={Colors.stone[400]} />
      <Text style={styles.reviewLabel}>{label}</Text>
    </View>
    <Text style={styles.reviewValue}>{value || '未填寫'}</Text>
  </View>
);

// ─── 樣式表 ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  navBar: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40,
    height: 110, borderBottomWidth: 1, borderBottomColor: Colors.stone[50]
  },
  navBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  progressTrack: { flex: 1, height: 6, backgroundColor: Colors.stone[100], borderRadius: 3, marginHorizontal: 15 },
  progressFill: { height: '100%', backgroundColor: Colors.stone[900], borderRadius: 3 },
  mainBody: { flex: 1 },
  stepContent: { flex: 1, padding: 32 },
  iconHeader: { marginBottom: 24 },
  mainTitle: { fontSize: 30, fontWeight: '900', color: Colors.stone[900], marginBottom: 8, letterSpacing: -0.5 },
  subTitle: { fontSize: 16, color: Colors.stone[400], marginBottom: 32, fontWeight: '500' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[50], borderRadius: 24, paddingHorizontal: 20, height: 64, marginBottom: 24 },
  searchInput: { flex: 1, fontSize: 18, fontWeight: '700', color: Colors.stone[900] },
  listWrapper: { flex: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  itemRowActive: { backgroundColor: Colors.stone[50], paddingHorizontal: 16, borderRadius: 16, borderBottomWidth: 0 },
  itemLabel: { fontSize: 17, fontWeight: '600', color: Colors.stone[500] },
  itemLabelActive: { color: Colors.stone[900], fontWeight: '800' },
  catGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  catBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: Colors.stone[50], alignItems: 'center' },
  catBtnActive: { backgroundColor: Colors.stone[900] },
  catBtnText: { fontSize: 15, fontWeight: '800', color: Colors.stone[400] },
  catBtnTextActive: { color: Colors.white },
  chipWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 18, backgroundColor: Colors.stone[50], borderWidth: 2, borderColor: 'transparent' },
  chipActive: { borderColor: Colors.stone[900], backgroundColor: Colors.white },
  chipText: { fontSize: 16, fontWeight: '700', color: Colors.stone[500] },
  chipTextActive: { color: Colors.stone[900] },
  inputLabel: { fontSize: 14, fontWeight: '800', color: Colors.stone[400], marginBottom: 16, marginLeft: 4, textTransform: 'uppercase' },
  segmentedControl: { flexDirection: 'row', backgroundColor: Colors.stone[50], borderRadius: 20, padding: 6 },
  segmentBtn: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  segmentBtnActive: { backgroundColor: Colors.white, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  segmentText: { fontSize: 16, fontWeight: '800', color: Colors.stone[300] },
  segmentTextActive: { color: Colors.stone[900] },
  listContainer: { gap: 14 },
  bigItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: Colors.stone[50], borderRadius: 24 },
  bigItemActive: { backgroundColor: Colors.white, borderWidth: 2.5, borderColor: Colors.stone[900] },
  bigItemText: { fontSize: 18, fontWeight: '700', color: Colors.stone[400] },
  bigItemTextActive: { color: Colors.stone[900], fontWeight: '900' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.stone[100] },
  radioCircleActive: { borderColor: Colors.stone[900], borderWidth: 7 },
  budgetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  budgetBox: { width: (width - 78) / 2, padding: 24, backgroundColor: Colors.stone[50], borderRadius: 24, alignItems: 'center' },
  budgetBoxActive: { backgroundColor: Colors.stone[900] },
  budgetText: { fontSize: 15, fontWeight: '800', color: Colors.stone[400] },
  budgetTextActive: { color: Colors.white },
  reviewCard: { backgroundColor: Colors.stone[50], borderRadius: 32, padding: 28, marginBottom: 28 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: Colors.stone[100] },
  reviewLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewLabel: { fontSize: 14, fontWeight: '700', color: Colors.stone[400] },
  reviewValue: { fontSize: 16, fontWeight: '800', color: Colors.stone[900] },
  noticeText: { fontSize: 14, color: Colors.stone[400], textAlign: 'center', lineHeight: 22, paddingHorizontal: 20, fontWeight: '500' },
  bottomNav: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 24, borderTopWidth: 1, borderTopColor: Colors.stone[50] },
  primaryBtn: { backgroundColor: Colors.stone[900], height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryBtnDisabled: { backgroundColor: Colors.stone[100] },
  primaryBtnText: { color: Colors.white, fontSize: 18, fontWeight: '900' },
});