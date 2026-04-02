import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Dimensions, Platform, Modal, FlatList 
} from 'react-native';
import { router } from 'expo-router';
import { 
  X, Sparkles, Palette, Activity, Zap, Pen, Clock, 
  User, Users, DollarSign, ChevronRight, Check, MapPin, 
  Search, ChevronDown, Calendar as CalendarIcon 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// 1. 台北捷運站點資料庫
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
  '3,500 - 5,500', '5,500 - 8,000', '8,000 - 12,000', '12,000 - 20,000',
  '20,000 - 150,000'
];

export default function ActionScreen() {
  const [selectedType, setSelectedType] = useState('美甲');
  const [selectedService, setSelectedService] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [userGender, setUserGender] = useState('女生');
  const [designerPref, setDesignerPref] = useState('不限');
  const [timing, setTiming] = useState('今天');
  const [customDate, setCustomDate] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('點選設定預算');

  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const filteredStations = useMemo(() => {
    if (!locationSearch || selectedLocation === locationSearch) return [];
    return TAIPEI_METRO_STATIONS.filter(s => s.includes(locationSearch));
  }, [locationSearch, selectedLocation]);

  const handleSelect = (setter: any, value: string, haptic = true) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  const finalizeMatch = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsConfirmVisible(false);
    router.push('/match'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color={Colors.stone[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>送出預約需求單</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color={Colors.stone[900]} />
            <Text style={styles.sectionLabel}>服務地點 (捷運站/地區)</Text>
          </View>
          <View style={styles.searchBox}>
            <Search size={16} color={Colors.stone[400]} style={{ marginRight: 10 }} />
            <TextInput 
              style={styles.locationInput}
              placeholder="搜尋台北捷運站..."
              value={locationSearch}
              onChangeText={setLocationSearch}
              placeholderTextColor={Colors.stone[300]}
            />
          </View>
          {filteredStations.length > 0 && (
            <View style={styles.searchDropdown}>
              {filteredStations.map(station => (
                <TouchableOpacity 
                  key={station} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleSelect(setSelectedLocation, station);
                    setLocationSearch(station);
                  }}
                >
                  <Text style={styles.dropdownText}>{station}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Palette size={18} color={Colors.stone[900]} />
            <Text style={styles.sectionLabel}>服務項目</Text>
          </View>
          <View style={styles.categoryGrid}>
            {Object.keys(SERVICE_OPTIONS).map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => { handleSelect(setSelectedType, name); setSelectedService(''); }}
                style={[styles.typeBtn, selectedType === name && styles.typeBtnActive]}
              >
                <Text style={[styles.typeBtnText, selectedType === name && styles.typeBtnTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.chipContainer, { marginTop: 16 }]}>
            {SERVICE_OPTIONS[selectedType as keyof typeof SERVICE_OPTIONS].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(setSelectedService, item)}
                style={[styles.chip, selectedService === item && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedService === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🌟 修正後的區域 */}
        <View style={styles.sectionCard}>
          <View style={styles.flexRowBetween}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.subLabel}>您的性別</Text>
              <View style={styles.toggleRow}>
                {['女生', '男生'].map((g) => (
                  <TouchableOpacity 
                    key={g} 
                    style={[styles.toggleBtn, userGender === g && styles.toggleBtnActive]} 
                    onPress={() => handleSelect(setUserGender, g)}
                  >
                    <Text style={[styles.toggleText, userGender === g && styles.toggleTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.subLabel}>偏好人員</Text>
              <View style={styles.toggleRow}>
                {['不限', '女性', '男性'].map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.toggleBtn, designerPref === p && styles.toggleBtnActive]} 
                    onPress={() => handleSelect(setDesignerPref, p)}
                  >
                    <Text style={[styles.toggleText, designerPref === p && styles.toggleTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 剩下的部分保持不變... */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Clock size={18} color={Colors.stone[900]} />
            <Text style={styles.sectionLabel}>偏好時段</Text>
          </View>
          <View style={styles.timingRow}>
            {['今天', '明天', '其他日期'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  handleSelect(setTiming, item);
                  if (item === '其他日期') setIsDatePickerVisible(true);
                }}
                style={[styles.timingBtn, timing === item && styles.timingBtnActive]}
              >
                <Text style={[styles.timingText, timing === item && styles.timingTextActive]}>
                  {item === '其他日期' && customDate ? customDate : item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <DollarSign size={18} color={Colors.stone[900]} />
            <Text style={styles.sectionLabel}>預算範圍</Text>
          </View>
          <TouchableOpacity 
            style={styles.budgetSelector} 
            onPress={() => setIsBudgetVisible(true)}
          >
            <Text style={[styles.budgetText, selectedBudget === '點選設定預算' && { color: Colors.stone[300] }]}>
              {selectedBudget}
            </Text>
            <ChevronDown size={20} color={Colors.stone[400]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsConfirmVisible(true);
          }}
        >
          <Text style={styles.submitBtnText}>確認發布需求</Text>
          <ChevronRight size={20} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>

      {/* 各種 Modal 設定... */}
      <Modal visible={isConfirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmCard}>
            <Sparkles size={32} color={Colors.amber400} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={styles.confirmTitle}>確認您的需求內容</Text>
            <View style={styles.summaryList}>
              <Text style={styles.summaryItem}>📍 地點：{selectedLocation || '未指定'}</Text>
              <Text style={styles.summaryItem}>✨ 項目：{selectedType} - {selectedService || '未填寫'}</Text>
              <Text style={styles.summaryItem}>⏰ 時間：{timing === '其他日期' ? customDate : timing}</Text>
              <Text style={styles.summaryItem}>💰 預算：{selectedBudget}</Text>
            </View>
            <TouchableOpacity style={styles.finalSubmitBtn} onPress={finalizeMatch}>
              <Text style={styles.finalSubmitBtnText}>確認發布，開始配對</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsConfirmVisible(false)} style={{ marginTop: 16 }}>
              <Text style={{ color: Colors.stone[400], textAlign: 'center', fontWeight: 'bold' }}>修改內容</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 預算與日期 Modal 保持不變... */}
      <Modal visible={isBudgetVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>預算金額區間</Text>
            <ScrollView>{BUDGET_RANGES.map(b => (
              <TouchableOpacity key={b} style={styles.drawerItem} onPress={() => { setSelectedBudget(b); setIsBudgetVisible(false); }}>
                <Text style={[styles.drawerItemText, selectedBudget === b && styles.drawerItemTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}</ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: Colors.white },
  headerTitle: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },
  closeBtn: { padding: 8 },
  scrollContent: { padding: 24, paddingBottom: 160 },
  
  sectionCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.stone[100], marginBottom: 16, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '900', color: Colors.stone[900], marginLeft: 8 },
  subLabel: { fontSize: 12, fontWeight: '800', color: Colors.stone[400], marginBottom: 8, marginLeft: 4 },

  // 🌟 補齊這段！
  flexRowBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[50], borderRadius: 16, paddingHorizontal: 16, height: 50 },
  locationInput: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.stone[900] },
  searchDropdown: { marginTop: 8, backgroundColor: Colors.stone[50], borderRadius: 12, overflow: 'hidden' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.stone[100] },
  dropdownText: { fontSize: 14, color: Colors.stone[800], fontWeight: '600' },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { flex: 1, minWidth: '22%', alignItems: 'center', backgroundColor: Colors.stone[50], paddingVertical: 10, borderRadius: 12 },
  typeBtnActive: { backgroundColor: Colors.stone[900] },
  typeBtnText: { fontSize: 13, fontWeight: '800', color: Colors.stone[400] },
  typeBtnTextActive: { color: Colors.white },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.stone[50] },
  chipActive: { backgroundColor: Colors.stone[900] },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.stone[500] },
  chipTextActive: { color: Colors.white },

  toggleRow: { flexDirection: 'row', backgroundColor: Colors.stone[50], borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: Colors.white, elevation: 1 },
  toggleText: { fontSize: 12, fontWeight: '800', color: Colors.stone[300] },
  toggleTextActive: { color: Colors.stone[900] },

  budgetSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.stone[50], borderRadius: 16, padding: 16 },
  budgetText: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },

  timingRow: { flexDirection: 'row', gap: 8 },
  timingBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.stone[50], alignItems: 'center' },
  timingBtnActive: { backgroundColor: Colors.stone[900] },
  timingText: { fontSize: 13, fontWeight: '800', color: Colors.stone[400] },
  timingTextActive: { color: Colors.white },

  submitBtn: { backgroundColor: Colors.stone[900], borderRadius: 20, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  drawerContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: height * 0.6 },
  datePickerCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 24 },
  confirmCard: { backgroundColor: Colors.white, borderRadius: 32, padding: 24 },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: Colors.stone[900], textAlign: 'center', marginBottom: 20 },
  summaryList: { backgroundColor: Colors.stone[50], borderRadius: 20, padding: 20, marginBottom: 24 },
  summaryItem: { fontSize: 14, fontWeight: '700', color: Colors.stone[800], marginBottom: 12 },
  finalSubmitBtn: { backgroundColor: Colors.stone[900], borderRadius: 18, height: 56, alignItems: 'center', justifyContent: 'center' },
  finalSubmitBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  drawerTitle: { fontSize: 18, fontWeight: '900', color: Colors.stone[900], marginBottom: 16 },
  drawerItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  drawerItemText: { fontSize: 16, fontWeight: '700', color: Colors.stone[400] },
  drawerItemTextActive: { color: Colors.stone[900], fontWeight: '900' }
});