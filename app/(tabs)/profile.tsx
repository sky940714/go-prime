import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, Platform, Alert
} from 'react-native';
import { Image } from 'expo-image';
import {
  User, Heart, Crown, Settings,
  ChevronRight, Shield, CreditCard, LogOut, Bell,
  Camera, MessageSquare, Star, Calendar, Clock,
  Gift, RefreshCw, AlertCircle, Store, XCircle, LogIn
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// ─── 子組件 ───────────────────────────────────────────────────
const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const MenuRow = ({ icon: Icon, label, subLabel, badge, isLast = false, onPress }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }}
    activeOpacity={0.7}
  >
    <View style={styles.menuLeft}>
      <View style={styles.menuIconBox}>
        <Icon size={19} color={Colors.stone[800]} />
      </View>
      <View>
        <Text style={styles.menuLabel}>{label}</Text>
        {subLabel && <Text style={styles.menuSubLabel}>{subLabel}</Text>}
      </View>
    </View>
    <View style={styles.menuRight}>
      {badge ? (
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <ChevronRight size={16} color={Colors.stone[300]} />
    </View>
  </TouchableOpacity>
);

// ─── 主組件 ───────────────────────────────────────────────────
export default function ProfileScreen() {
  // 🌟 登入狀態控制 (目前手動切換測試，未來接全域 Auth 狀態)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (path: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path);
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("登出帳戶", "您確定要登出 Go Prime 嗎？", [
      { text: "取消", style: "cancel" },
      { text: "確定登出", style: "destructive", onPress: () => setIsLoggedIn(false) }
    ]);
  };

  // ─── 未登入介面 (Login Prompt) ───
  if (!isLoggedIn) {
    return (
      <View style={styles.unauthContainer}>
        <View style={styles.unauthHeader}>
          <Text style={styles.headerTitle}>我的帳戶</Text>
        </View>
        
        <View style={styles.unauthContent}>
          <View style={styles.loginCard}>
            <View style={styles.loginIconCircle}>
               <User size={40} color={Colors.stone[300]} />
            </View>
            <Text style={styles.loginTitle}>探索您的專屬美學</Text>
            <Text style={styles.loginSubtitle}>登入後即可管理您的預約記錄、收藏喜愛的設計師，並獲得專屬優惠。</Text>
            
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/login');
              }}
            >
              <LogIn size={20} color={Colors.white} style={{marginRight: 8}} />
              <Text style={styles.loginBtnText}>立即登入 / 註冊</Text>
            </TouchableOpacity>
          </View>

          {/* 未登入時也可以看到的基礎功能 (如商家入駐) */}
          <View style={[styles.sectionContainer, {paddingHorizontal: 0, marginTop: 40}]}>
            <TouchableOpacity 
              style={styles.merchantApplyCard} 
              onPress={() => router.push('/merchant/apply')}
            >
              <View style={styles.merchantApplyLeft}>
                <View style={styles.merchantIconBox}><Store size={22} color={Colors.amber400} /></View>
                <View>
                  <Text style={styles.merchantApplyTitle}>商家入駐</Text>
                  <Text style={styles.merchantApplySubTitle}>開啟您的美業生意</Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.stone[400]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 測試按鈕：模擬登入成功後樣子 */}
        <TouchableOpacity style={{position: 'absolute', bottom: 120, alignSelf: 'center'}} onPress={() => setIsLoggedIn(true)}>
          <Text style={{color: Colors.stone[100], fontSize: 10}}>DEBUG: 模擬登入狀態</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── 已登入介面 ───
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的帳戶</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => handleNavigate('/profile/preferences')}>
          <Settings size={22} color={Colors.stone[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* 區塊 1：個人資訊 */}
        <View style={styles.profileSection}>
          <View style={styles.userCore}>
            <View style={styles.avatarWrapper}>
              <Image source="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400" style={styles.avatar} />
              <TouchableOpacity style={styles.cameraBadge} onPress={() => handleNavigate('/profile/edit-profile')}>
                <Camera size={13} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>小天</Text>
              <View style={styles.levelBadge}>
                <Crown size={11} color={Colors.amber400} fill={Colors.amber400} />
                <Text style={styles.levelText}>PRIME GOLD</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('/profile/bookings')}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>預約次數</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('/profile/reviews')}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>已評價</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('/profile/favorites')}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('/profile/coupons')}>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>3</Text>
                <View style={styles.dotBadge} />
              </View>
              <Text style={styles.statLabel}>優惠券</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 區塊 2：即將到來的預約 */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="即將到來的預約" />
          <TouchableOpacity style={styles.upcomingCard} onPress={() => handleNavigate('/profile/booking-detail')}>
            <View style={styles.upcomingBanner}>
              <Clock size={13} color={Colors.white} />
              <Text style={styles.upcomingBannerText}>還有 3 天・2025年3月15日</Text>
              <View style={styles.confirmedDot} />
              <Text style={styles.confirmedText}>已確認</Text>
            </View>
            <View style={styles.upcomingBody}>
              <Image source="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200" style={styles.designerAvatar} />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingService}>全頭染髮 + 護髮療程</Text>
                <Text style={styles.upcomingDesigner}>林 Rin · ŌKAMI Hair Studio</Text>
              </View>
              <ChevronRight size={18} color={Colors.stone[300]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 區塊 3：訊息 */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="通訊" />
          <TouchableOpacity style={styles.messageCard} onPress={() => handleNavigate('/profile/messages')}>
            <View style={styles.messageIconBox}>
              <MessageSquare size={22} color={Colors.white} />
              <View style={styles.unreadDot} />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.messageTitle}>訊息通知</Text>
              <Text style={styles.messagePreview}>Yuki：您的預約已確認，明天見！</Text>
            </View>
            <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutText}>登出帳戶</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>GO PRIME v1.1.0 (BETA)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.stone[100],
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.stone[900], letterSpacing: 0.3 },
  settingsBtn: { padding: 4 },
  scrollBody: { paddingBottom: 140 },

  // --- 未登入樣式 ---
  unauthContainer: { flex: 1, backgroundColor: Colors.stone[50] },
  unauthHeader: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, backgroundColor: Colors.white },
  unauthContent: { padding: 24, justifyContent: 'center', flex: 1 },
  loginCard: { backgroundColor: Colors.white, borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.stone[100], elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  loginIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.stone[50], justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  loginTitle: { fontSize: 22, fontWeight: '900', color: Colors.stone[900], marginBottom: 12 },
  loginSubtitle: { fontSize: 14, color: Colors.stone[400], textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  loginBtn: { backgroundColor: Colors.stone[900], width: '100%', height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },

  // --- 已登入樣式 ---
  profileSection: { backgroundColor: Colors.white, paddingHorizontal: 24, paddingTop: 24 },
  userCore: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: Colors.stone[100] },
  cameraBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: Colors.stone[900], padding: 6, borderRadius: 10, borderWidth: 2, borderColor: Colors.white },
  userMeta: { marginLeft: 16 },
  userName: { fontSize: 22, fontWeight: '900', color: Colors.stone[900] },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[900], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6, gap: 4, alignSelf: 'flex-start' },
  levelText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: Colors.stone[100] },
  statItem: { alignItems: 'center', flex: 1 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statValue: { fontSize: 18, fontWeight: '900', color: Colors.stone[900] },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.stone[400], marginTop: 4 },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.stone[100] },
  dotBadge: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444', marginBottom: 8 },
  sectionContainer: { marginTop: 28, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: Colors.stone[400], textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
  messageCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: Colors.stone[100], gap: 14 },
  messageIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.stone[900], justifyContent: 'center', alignItems: 'center' },
  unreadDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444', borderWidth: 2, borderColor: Colors.white },
  messageContent: { flex: 1 },
  messageTitle: { fontSize: 15, fontWeight: '900', color: Colors.stone[900] },
  messagePreview: { fontSize: 12, color: Colors.stone[400] },
  unreadBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  upcomingCard: { backgroundColor: Colors.white, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: Colors.stone[100], elevation: 2 },
  upcomingBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[900], paddingHorizontal: 18, paddingVertical: 10, gap: 6 },
  upcomingBannerText: { color: Colors.white, fontSize: 12, fontWeight: '700', flex: 1 },
  confirmedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  confirmedText: { color: '#22c55e', fontSize: 11, fontWeight: '800' },
  upcomingBody: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  designerAvatar: { width: 44, height: 44, borderRadius: 14 },
  upcomingInfo: { flex: 1 },
  upcomingService: { fontSize: 15, fontWeight: '800', color: Colors.stone[900], marginBottom: 2 },
  upcomingDesigner: { fontSize: 12, color: Colors.stone[500] },
  merchantApplyCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, padding: 20, borderRadius: 28, borderWidth: 1, borderColor: Colors.stone[100] },
  merchantApplyLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  merchantIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.stone[900], justifyContent: 'center', alignItems: 'center' },
  merchantApplyTitle: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },
  merchantApplySubTitle: { fontSize: 11, color: Colors.stone[400], marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 36, paddingVertical: 18 },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: '900' },
  versionText: { textAlign: 'center', color: Colors.stone[300], fontSize: 11, marginTop: 8 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.stone[50], justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '800', color: Colors.stone[900] },
  menuSubLabel: { fontSize: 11, color: Colors.stone[400] },
  badgePill: { backgroundColor: Colors.stone[900], paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
});