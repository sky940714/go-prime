import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { 
  ChevronLeft, Bell, Shield, CreditCard, 
  Trash2, Store, ChevronRight 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

// 復用你的 MenuRow 元件風格
const SettingItem = ({ icon: Icon, label, subLabel, onPress, isDestructive = false, isLast = false }: any) => (
  <TouchableOpacity 
    style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }}
  >
    <View style={styles.menuLeft}>
      <View style={[styles.iconBox, isDestructive && { backgroundColor: '#fee2e2' }]}>
        <Icon size={20} color={isDestructive ? '#ef4444' : Colors.stone[800]} />
      </View>
      <View>
        <Text style={[styles.menuLabel, isDestructive && { color: '#ef4444' }]}>{label}</Text>
        {subLabel && <Text style={styles.menuSubLabel}>{subLabel}</Text>}
      </View>
    </View>
    <ChevronRight size={16} color={Colors.stone[300]} />
  </TouchableOpacity>
);

export default function PreferencesScreen() {
  
  const handleNavigate = (path: any) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      {/* 自定義 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.stone[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>設定</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        <Text style={styles.sectionTitle}>通用設定</Text>
        <View style={styles.card}>
          {/* 1. 推播通知設定 */}
          <SettingItem 
            icon={Bell} 
            label="推播通知" 
            subLabel="提醒預約時間與最新優惠"
            onPress={() => handleNavigate('/profile/notifications')}
          />
          {/* 2. 隱私與安全 */}
          <SettingItem 
            icon={Shield} 
            label="隱私與安全" 
            subLabel="帳號密碼與權限管理"
            onPress={() => handleNavigate('/profile/privacy')}
          />
          {/* 3. 支付方式管理 */}
          <SettingItem 
            icon={CreditCard} 
            label="支付方式" 
            subLabel="信用卡與付款紀錄"
            isLast
            onPress={() => handleNavigate('/profile/payment')}
          />
        </View>

        <Text style={styles.sectionTitle}>商務合作</Text>
        <View style={styles.card}>
          {/* 5. 申請成為商家 */}
          <SettingItem 
            icon={Store} 
            label="商家入駐" 
            subLabel="在 Go Prime 上開啟您的美業生意"
            isLast
            onPress={() => router.push('/merchant/apply')}
          />
        </View>

        <Text style={styles.sectionTitle}>帳號管理</Text>
        <View style={styles.card}>
          {/* 4. 刪除帳號 */}
          <SettingItem 
            icon={Trash2} 
            label="刪除帳號" 
            subLabel="永久移除您的帳號與預約資料"
            isDestructive
            isLast
            onPress={() => Alert.alert(
              "確認刪除帳號？", 
              "這將會永久刪除您的所有資料且無法恢復。",
              [{ text: "取消" }, { text: "確認刪除", style: "destructive" }]
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.stone[100],
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.stone[900] },
  scrollBody: { padding: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: Colors.stone[400], marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 24, paddingHorizontal: 20, marginBottom: 32, borderWidth: 1, borderColor: Colors.stone[100] },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.stone[50], justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '800', color: Colors.stone[900] },
  menuSubLabel: { fontSize: 11, color: Colors.stone[400], marginTop: 2 },
});