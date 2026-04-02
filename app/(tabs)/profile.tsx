import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, Platform, Animated
} from 'react-native';
import { Image } from 'expo-image';
import {
  User, Heart, Crown, Settings,
  ChevronRight, Shield, CreditCard, LogOut, Bell,
  Camera, MessageSquare, Star, Calendar, Clock,
  Scissors, Sparkles, MapPin, Gift, RefreshCw,
  AlertCircle, CheckCircle, ChevronDown, Store, Briefcase
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// ─── 假資料 ───────────────────────────────────────────────
const UPCOMING_BOOKING = {
  id: 'bk_001',
  designerName: '林 Rin',
  designerAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200',
  salonName: 'ŌKAMI Hair Studio',
  service: '全頭染髮 + 護髮療程',
  date: '2025年3月15日（六）',
  time: '14:30',
  daysLeft: 3,
  status: 'confirmed', 
};

const PENDING_REVIEWS = [
  {
    id: 'rv_001',
    designerName: 'Yuki 設計師',
    service: '日式剪髮',
    date: '2025年3月5日',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
  },
];

// ─── 子元件 ───────────────────────────────────────────────
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

// ─── 主元件 ───────────────────────────────────────────────
export default function ProfileScreen() {

  const handleAction = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (label === '申請商家') {
      router.push('/merchant/apply'); 
    } else if (label === '登出') {
      console.log('執行登出邏輯');
    } else {
      console.log(`點擊: ${label}`);
    }
  };

  

  return (
    <View style={styles.container}>

      {/* 頂部標題列 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的帳戶</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => handleAction('設定')}>
          <Settings size={22} color={Colors.stone[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >

        {/* ── 區塊 1：個人資訊 ── */}
        <View style={styles.profileSection}>
          <View style={styles.userCore}>
            <View style={styles.avatarWrapper}>
              <Image
                source="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBadge} onPress={() => handleAction('更換頭貼')}>
                <Camera size={13} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>小天</Text>
              <View style={styles.levelBadge}>
                <Crown size={11} color={Colors.amber400} fill={Colors.amber400} />
                <Text style={styles.levelText}>PRIME GOLD</Text>
              </View>
              <Text style={styles.memberSince}>會員自 2024年6月加入</Text>
            </View>
          </View>

          {/* 快速數據 */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => handleAction('預約紀錄')}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>預約次數</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleAction('我的評價')}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>已評價</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleAction('收藏設計師')}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>收藏設計師</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleAction('優惠券')}>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>3</Text>
                <View style={styles.dotBadge} />
              </View>
              <Text style={styles.statLabel}>優惠券</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 區塊 2：即將到來的預約 ── */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="即將到來的預約" />

          <TouchableOpacity
            style={styles.upcomingCard}
            activeOpacity={0.92}
            onPress={() => handleAction('預約詳情')}
          >
            <View style={styles.upcomingBanner}>
              <Clock size={13} color={Colors.white} />
              <Text style={styles.upcomingBannerText}>
                還有 {UPCOMING_BOOKING.daysLeft} 天・{UPCOMING_BOOKING.date}
              </Text>
              <View style={styles.confirmedDot} />
              <Text style={styles.confirmedText}>已確認</Text>
            </View>

            <View style={styles.upcomingBody}>
              <Image
                source={UPCOMING_BOOKING.designerAvatar}
                style={styles.designerAvatar}
              />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingService}>{UPCOMING_BOOKING.service}</Text>
                <Text style={styles.upcomingDesigner}>{UPCOMING_BOOKING.designerName} · {UPCOMING_BOOKING.salonName}</Text>
                <View style={styles.upcomingTimeRow}>
                  <Calendar size={13} color={Colors.stone[400]} />
                  <Text style={styles.upcomingTime}>{UPCOMING_BOOKING.date} {UPCOMING_BOOKING.time}</Text>
                </View>
              </View>
            </View>

            <View style={styles.upcomingActions}>
              <TouchableOpacity style={styles.actionBtnOutline} onPress={() => handleAction('改期')}>
                <RefreshCw size={14} color={Colors.stone[800]} />
                <Text style={styles.actionBtnOutlineText}>改期</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnOutline} onPress={() => handleAction('取消')}>
                <AlertCircle size={14} color="#ef4444" />
                <Text style={[styles.actionBtnOutlineText, { color: '#ef4444' }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => handleAction('查看詳情')}>
                <Text style={styles.actionBtnPrimaryText}>查看詳情</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── 區塊 3：待評價提醒 ── */}
        {PENDING_REVIEWS.length > 0 && (
          <View style={styles.sectionContainer}>
            <SectionHeader title="待評價" />
            {PENDING_REVIEWS.map((review) => (
              <TouchableOpacity
                key={review.id}
                style={styles.reviewCard}
                activeOpacity={0.85}
                onPress={() => handleAction('寫評價')}
              >
                <Image source={review.avatar} style={styles.reviewAvatar} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewService}>{review.service}</Text>
                  <Text style={styles.reviewDesigner}>{review.designerName} · {review.date}</Text>
                </View>
                <TouchableOpacity style={styles.writeReviewBtn} onPress={() => handleAction('寫評價')}>
                  <Star size={13} color={Colors.stone[900]} fill={Colors.stone[900]} />
                  <Text style={styles.writeReviewText}>評價</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── 區塊 4：預約與服務 ── */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="預約與服務" />
          <View style={styles.cardMenu}>
            <MenuRow
              icon={Calendar}
              label="預約紀錄"
              subLabel="查看全部歷史紀錄"
              onPress={() => handleAction('預約紀錄')}
            />
            <MenuRow
              icon={Heart}
              label="收藏的設計師"
              subLabel="8 位設計師"
              onPress={() => handleAction('收藏設計師')}
            />
            <MenuRow
              icon={Star}
              label="我的評價"
              subLabel="已寫 15 則評價"
              onPress={() => handleAction('我的評價')}
            />
            <MenuRow
              icon={Gift}
              label="優惠券 / 點數"
              badge="3張"
              subLabel="查看可用優惠"
              onPress={() => handleAction('優惠券')}
            />
            <MenuRow
              icon={MessageSquare}
              label="訊息通知"
              subLabel="與設計師的對話"
              badge="2則未讀"
              isLast
              onPress={() => handleAction('訊息')}
            />
          </View>
        </View>

        {/* ── 區塊 5：帳戶設定 ── */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="帳戶設定" />
          <View style={styles.cardMenu}>
            <MenuRow
              icon={User}
              label="個人資料編輯"
              subLabel="姓名、生日、聯絡資訊"
              onPress={() => handleAction('個人資料')}
            />
            <MenuRow
              icon={Bell}
              label="推播通知設定"
              onPress={() => handleAction('通知設定')}
            />
            <MenuRow
              icon={Shield}
              label="隱私與安全"
              onPress={() => handleAction('隱私安全')}
            />
            <MenuRow
              icon={CreditCard}
              label="支付方式管理"
              isLast
              onPress={() => handleAction('支付管理')}
            />
          </View>
        </View>

        {/* ── 區塊 6：商家招募 ── */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.merchantApplyCard}
            onPress={() => handleAction('申請商家')}
            activeOpacity={0.9}
          >
            <View style={styles.merchantApplyLeft}>
              <View style={styles.merchantIconBox}>
                <Store size={22} color={Colors.amber400} />
              </View>
              <View>
                <Text style={styles.merchantApplyTitle}>申請成為商家</Text>
                <Text style={styles.merchantApplySubTitle}>開啟您的美業生意，接單賺更多</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.stone[400]} />
          </TouchableOpacity>
        </View>

        {/* ── 登出 ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            handleAction('登出');
          }}
        >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.stone[100],
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.stone[900], letterSpacing: 0.3 },
  settingsBtn: { padding: 4 },

  scrollBody: { paddingBottom: 140 },

  profileSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  userCore: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: Colors.stone[300] },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: Colors.stone[900], padding: 6,
    borderRadius: 10, borderWidth: 2, borderColor: Colors.white,
  },
  userMeta: { marginLeft: 16 },
  userName: { fontSize: 22, fontWeight: '900', color: Colors.stone[900] },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.stone[900], paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8, marginTop: 6, gap: 4,
    alignSelf: 'flex-start',
  },
  levelText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  memberSince: { fontSize: 11, color: Colors.stone[400], marginTop: 6, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.stone[100],
    marginTop: 4,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statValue: { fontSize: 18, fontWeight: '900', color: Colors.stone[900] },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.stone[400], marginTop: 4 },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.stone[100] },
  dotBadge: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444', marginBottom: 8 },

  upcomingCard: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.stone[100],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  upcomingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.stone[900],
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 6,
  },
  upcomingBannerText: { color: Colors.white, fontSize: 12, fontWeight: '700', flex: 1 },
  confirmedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  confirmedText: { color: '#22c55e', fontSize: 11, fontWeight: '800' },
  upcomingBody: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  designerAvatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: Colors.stone[300] },
  upcomingInfo: { flex: 1 },
  upcomingService: { fontSize: 15, fontWeight: '900', color: Colors.stone[900], marginBottom: 3 },
  upcomingDesigner: { fontSize: 12, fontWeight: '600', color: Colors.stone[500], marginBottom: 6 },
  upcomingTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  upcomingTime: { fontSize: 12, fontWeight: '700', color: Colors.stone[400] },
  upcomingActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 4,
  },
  actionBtnOutline: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.stone[300],
    backgroundColor: Colors.stone[50],
  },
  actionBtnOutlineText: { fontSize: 12, fontWeight: '800', color: Colors.stone[800] },
  actionBtnPrimary: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.stone[900],
    paddingVertical: 10, borderRadius: 12,
  },
  actionBtnPrimaryText: { color: Colors.white, fontSize: 13, fontWeight: '900' },

  reviewCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24, padding: 16,
    borderWidth: 1, borderColor: Colors.stone[100],
    gap: 12,
  },
  reviewAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.stone[300] },
  reviewInfo: { flex: 1 },
  reviewService: { fontSize: 14, fontWeight: '800', color: Colors.stone[900] },
  reviewDesigner: { fontSize: 11, fontWeight: '600', color: Colors.stone[400], marginTop: 3 },
  writeReviewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.stone[900],
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
  },
  writeReviewText: { color: Colors.white, fontSize: 12, fontWeight: '900' },

  sectionContainer: { marginTop: 28, paddingHorizontal: 24 },
  sectionTitle: {
    fontSize: 12, fontWeight: '900', color: Colors.stone[400],
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 2,
  },
  cardMenu: {
    backgroundColor: Colors.white, borderRadius: 28,
    paddingHorizontal: 20, borderWidth: 1, borderColor: Colors.stone[100],
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: Colors.stone[50],
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.stone[50],
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '800', color: Colors.stone[900] },
  menuSubLabel: { fontSize: 11, fontWeight: '600', color: Colors.stone[400], marginTop: 2 },
  badgePill: {
    backgroundColor: Colors.stone[900],
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },

  // 商家申請卡片樣式
  merchantApplyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.stone[100],
    shadowColor: Colors.amber400,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  merchantApplyLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  merchantIconBox: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: Colors.stone[900],
    justifyContent: 'center', alignItems: 'center',
  },
  merchantApplyTitle: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },
  merchantApplySubTitle: { fontSize: 11, fontWeight: '600', color: Colors.stone[400], marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 36, paddingVertical: 18,
  },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: '900' },
  versionText: {
    textAlign: 'center', color: Colors.stone[300],
    fontSize: 11, fontWeight: '600', marginTop: 8,
  },
});