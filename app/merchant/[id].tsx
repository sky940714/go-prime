// app/merchant/[id].tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, Platform, FlatList, Modal, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, Star, MapPin, Clock, Phone, Heart,
  Share2, ChevronRight, CheckCircle2, X, Instagram,
  Camera, Info, CalendarCheck, MessageCircle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// ─── 模擬商家資料 ─────────────────────────────────────────
const MOCK_MERCHANT = {
  id: 1,
  name: 'Yuki Nail Studio',
  category: '美甲',
  rating: 4.9,
  reviewCount: 187,
  dist: '820m',
  address: '台北市大安區忠孝東路四段 216 號 3F',
  phone: '0912-345-678',
  lineId: 'yuki_nail',
  igLink: 'yuki.nail.studio',
  isOpen: true,
  openHours: '週二至週日 11:00 - 21:00',
  closedDay: '週一公休',
  coverImage: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=800&q=80',
  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
  tags: ['日系美甲', '凝膠甲', '光療'],
  bio: '專注日系美甲設計 5 年，擅長極簡風與漸層色系。採一對一服務，讓每位客人都擁有專屬的美甲體驗。',

  // 1. 作品牆
  works: [
    { id: 1, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', title: '極簡貓眼', likes: 234 },
    { id: 2, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', title: '莫蘭迪漸層', likes: 189 },
    { id: 3, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', title: '法式裸色', likes: 156 },
    { id: 4, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', title: '暗色系設計款', likes: 312 },
    { id: 5, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', title: '春日花卉', likes: 278 },
    { id: 6, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', title: '貓咪主題', likes: 198 },
  ],

  // 2. 服務項目
  services: [
    { id: 1, name: '單色凝膠美甲', duration: '60 分鐘', price: 800, desc: '基礎單色光療，含手部護理', popular: true },
    { id: 2, name: '法式 / 漸層', duration: '75 分鐘', price: 1000, desc: '經典法式或雙色漸層設計', popular: false },
    { id: 3, name: '設計款美甲', duration: '90 分鐘', price: 1400, desc: '客製化圖案設計，含彩繪工費', popular: true },
    { id: 4, name: '延甲（雕甲）', duration: '120 分鐘', price: 1800, desc: '延長甲床，適合甲型修正', popular: false },
    { id: 5, name: '卸甲重做', duration: '90 分鐘', price: 1200, desc: '含卸除舊甲、護理、重新上色', popular: false },
  ],

  // 3. 環境照片
  atmosphere: [
    { id: 1, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', caption: '溫馨包廂空間' },
    { id: 2, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', caption: '專業操作台' },
    { id: 3, image: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800', caption: '舒適等候區' },
  ],

  // 4. 預約須知
  notices: [
    '請提前 10 分鐘到達，遲到超過 15 分鐘需重新預約',
    '預約後如需取消，請提前 24 小時告知',
    '設計款需提前提供參考圖，以利備料',
    '孕婦、手部皮膚有傷口者請提前告知',
    '指甲長度以不超過指尖 5mm 為宜，過長需另計費用',
  ],
};

export default function MerchantDetailScreen() {
  const { id } = useLocalSearchParams();
  const merchant = MOCK_MERCHANT; // 未來換成 API fetch

  const [isLiked, setIsLiked] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'works' | 'atmo'>('works');

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header 背景漸變
  const headerBg = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['rgba(0,0,0,0)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [160, 220],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const openLightbox = (index: number, type: 'works' | 'atmo') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLightboxIndex(index);
    setLightboxType(type);
    setLightboxVisible(true);
  };

  const lightboxImages = lightboxType === 'works'
    ? merchant.works.map(w => w.image)
    : merchant.atmosphere.map(a => a.image);

  return (
    <View style={styles.container}>

      {/* ── 浮動 Header ── */}
      <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.stone[900]} />
        </TouchableOpacity>
        <Animated.Text style={[styles.floatingTitle, { opacity: headerTitleOpacity }]}>
          {merchant.name}
        </Animated.Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsLiked(!isLiked);
            }}
          >
            <Heart
              size={22}
              color={isLiked ? '#ff4b4b' : Colors.stone[900]}
              fill={isLiked ? '#ff4b4b' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Share2 size={22} color={Colors.stone[900]} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── 主要內容 ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Cover Image */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: merchant.coverImage }} style={styles.coverImage} contentFit="cover" />
          <View style={styles.coverOverlay} />
        </View>

        {/* ── 商家基本資訊卡 ── */}
        <View style={styles.infoCard}>
          {/* 頭像 + 名稱 */}
          <View style={styles.infoTop}>
            <Image source={{ uri: merchant.avatar }} style={styles.avatar} contentFit="cover" />
            <View style={styles.infoMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <View style={[styles.openTag, !merchant.isOpen && styles.closedTag]}>
                  <Text style={styles.openTagText}>{merchant.isOpen ? '營業中' : '休息中'}</Text>
                </View>
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color={Colors.amber400} fill={Colors.amber400} />
                <Text style={styles.ratingText}>{merchant.rating}</Text>
                <Text style={styles.reviewCount}>({merchant.reviewCount} 則評價)</Text>
                <View style={styles.dot} />
                <MapPin size={12} color={Colors.stone[400]} />
                <Text style={styles.distText}>{merchant.dist}</Text>
              </View>
              {/* 標籤 */}
              <View style={styles.tagRow}>
                {merchant.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 簡介 */}
          <Text style={styles.bio}>{merchant.bio}</Text>

          {/* 快速聯繫按鈕 */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
              <MessageCircle size={18} color={Colors.white} />
              <Text style={styles.contactBtnText}>LINE 諮詢</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.igBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Instagram size={18} color={Colors.stone[900]} />
              <Text style={styles.igBtnText}>作品集</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ════════════════════════════════════════
            1. 動態作品牆
        ════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Camera size={16} color={Colors.stone[800]} />
              <Text style={styles.sectionTitle}>作品牆</Text>
            </View>
            <Text style={styles.sectionCount}>{merchant.works.length} 件作品</Text>
          </View>

          {/* 3 欄瀑布流 */}
          <View style={styles.worksGrid}>
            {merchant.works.map((work, index) => (
              <TouchableOpacity
                key={work.id}
                style={[
                  styles.workItem,
                  // 第一張大圖佔兩格
                  index === 0 && styles.workItemLarge,
                ]}
                onPress={() => openLightbox(index, 'works')}
                activeOpacity={0.9}
              >
                <Image source={{ uri: work.image }} style={styles.workImage} contentFit="cover" />
                <View style={styles.workOverlay}>
                  <Heart size={12} color={Colors.white} fill={Colors.white} />
                  <Text style={styles.workLikes}>{work.likes}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ════════════════════════════════════════
            2. 服務項目與預約區
        ════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <CalendarCheck size={16} color={Colors.stone[800]} />
              <Text style={styles.sectionTitle}>服務項目</Text>
            </View>
          </View>

          {merchant.services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.serviceCardSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedService(selectedService === service.id ? null : service.id);
              }}
              activeOpacity={0.85}
            >
              <View style={styles.serviceLeft}>
                <View style={styles.serviceNameRow}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {service.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>熱門</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.serviceDesc}>{service.desc}</Text>
                <View style={styles.serviceMeta}>
                  <Clock size={12} color={Colors.stone[400]} />
                  <Text style={styles.serviceMetaText}>{service.duration}</Text>
                </View>
              </View>
              <View style={styles.serviceRight}>
                <Text style={styles.servicePrice}>NT${service.price.toLocaleString()}</Text>
                <View style={[
                  styles.selectCircle,
                  selectedService === service.id && styles.selectCircleActive,
                ]}>
                  {selectedService === service.id && (
                    <CheckCircle2 size={18} color={Colors.white} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* 預約按鈕 */}
          <TouchableOpacity
            style={[styles.bookBtn, !selectedService && styles.bookBtnDisabled]}
            disabled={!selectedService}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // 未來跳轉到預約流程
            }}
          >
            <CalendarCheck size={20} color={Colors.white} />
            <Text style={styles.bookBtnText}>
              {selectedService ? '立即預約此項目' : '請先選擇服務項目'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════
            3. 環境照片
        ════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Camera size={16} color={Colors.stone[800]} />
              <Text style={styles.sectionTitle}>店內環境</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.atmosphereScroll}
          >
            {merchant.atmosphere.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.atmosphereCard}
                onPress={() => openLightbox(index, 'atmo')}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.atmosphereImage} contentFit="cover" />
                <View style={styles.atmosphereOverlay}>
                  <Text style={styles.atmosphereCaption}>{item.caption}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════════════════════════════════════════
            4. 預約須知與商家資訊
        ════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Info size={16} color={Colors.stone[800]} />
              <Text style={styles.sectionTitle}>商家資訊</Text>
            </View>
          </View>

          {/* 資訊列表 */}
          <View style={styles.infoList}>
            <InfoRow icon={MapPin} label="地址" value={merchant.address} />
            <InfoRow icon={Clock} label="營業時間" value={`${merchant.openHours}\n${merchant.closedDay}`} />
            <InfoRow icon={Phone} label="聯絡電話" value={merchant.phone} />
          </View>

          {/* 預約須知 */}
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>📋 預約須知</Text>
            {merchant.notices.map((notice, index) => (
              <View key={index} style={styles.noticeRow}>
                <Text style={styles.noticeDot}>•</Text>
                <Text style={styles.noticeText}>{notice}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* ── 底部固定預約列 ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarLabel}>已選</Text>
          <Text style={styles.bottomBarService} numberOfLines={1}>
            {selectedService
              ? merchant.services.find(s => s.id === selectedService)?.name
              : '尚未選擇服務'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bottomBookBtn, !selectedService && styles.bookBtnDisabled]}
          disabled={!selectedService}
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        >
          <Text style={styles.bottomBookBtnText}>確認預約</Text>
          <ChevronRight size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Lightbox Modal ── */}
      <Modal visible={lightboxVisible} transparent animationType="fade">
        <View style={styles.lightboxOverlay}>
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={() => setLightboxVisible(false)}
          >
            <X size={28} color={Colors.white} />
          </TouchableOpacity>
          <FlatList
            data={lightboxImages}
            horizontal
            pagingEnabled
            initialScrollIndex={lightboxIndex}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.lightboxItem}>
                <Image source={{ uri: item }} style={styles.lightboxImage} contentFit="contain" />
              </View>
            )}
            keyExtractor={(_, i) => i.toString()}
          />
        </View>
      </Modal>
    </View>
  );
}

// ─── InfoRow 子元件 ───────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowIcon}>
        <Icon size={16} color={Colors.stone[600]} />
      </View>
      <View style={styles.infoRowContent}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },

  // ── 浮動 Header ──
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 12, paddingHorizontal: 16,
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  floatingTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '900', color: Colors.stone[900] },

  scrollContent: { paddingBottom: 20 },

  // ── Cover ──
  coverWrapper: { height: 280, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  // ── 商家資訊卡 ──
  infoCard: {
    backgroundColor: Colors.white,
    marginTop: -24, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 4,
  },
  infoTop: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  avatar: { width: 68, height: 68, borderRadius: 22, backgroundColor: Colors.stone[200] },
  infoMeta: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  merchantName: { fontSize: 20, fontWeight: '900', color: Colors.stone[900] },
  openTag: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  closedTag: { backgroundColor: Colors.stone[100] },
  openTagText: { fontSize: 10, fontWeight: '900', color: '#16a34a' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText: { fontSize: 14, fontWeight: '800', color: Colors.stone[900] },
  reviewCount: { fontSize: 12, color: Colors.stone[400], fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.stone[300] },
  distText: { fontSize: 12, color: Colors.stone[400], fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: Colors.stone[100], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.stone[500] },

  bio: { fontSize: 13, color: Colors.stone[500], lineHeight: 20, fontWeight: '500', marginBottom: 16 },

  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#06C755', paddingVertical: 12, borderRadius: 16,
  },
  contactBtnText: { color: Colors.white, fontWeight: '900', fontSize: 14 },
  igBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.stone[50], paddingVertical: 12, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.stone[200],
  },
  igBtnText: { color: Colors.stone[900], fontWeight: '900', fontSize: 14 },

  // ── 通用 Section ──
  section: {
    backgroundColor: Colors.white, marginTop: 12,
    paddingHorizontal: 20, paddingVertical: 20,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.stone[900] },
  sectionCount: { fontSize: 12, color: Colors.stone[400], fontWeight: '700' },

  // ── 作品牆 ──
  worksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  workItem: { width: (width - 52) / 3, height: (width - 52) / 3, borderRadius: 14, overflow: 'hidden' },
  workItemLarge: { width: (width - 52) / 3 * 2 + 6, height: (width - 52) / 3 * 2 + 6 },
  workImage: { width: '100%', height: '100%' },
  workOverlay: {
    position: 'absolute', bottom: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  workLikes: { color: Colors.white, fontSize: 10, fontWeight: '800' },

  // ── 服務項目 ──
  serviceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.stone[100],
    backgroundColor: Colors.stone[50], marginBottom: 10,
  },
  serviceCardSelected: { borderColor: Colors.stone[900], backgroundColor: Colors.white },
  serviceLeft: { flex: 1, marginRight: 12 },
  serviceNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  serviceName: { fontSize: 15, fontWeight: '800', color: Colors.stone[900] },
  popularBadge: { backgroundColor: Colors.amber400, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  popularBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
  serviceDesc: { fontSize: 12, color: Colors.stone[400], fontWeight: '500', marginBottom: 6, lineHeight: 16 },
  serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceMetaText: { fontSize: 12, color: Colors.stone[400], fontWeight: '600' },
  serviceRight: { alignItems: 'flex-end', gap: 8 },
  servicePrice: { fontSize: 16, fontWeight: '900', color: Colors.stone[900] },
  selectCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: Colors.stone[300],
    justifyContent: 'center', alignItems: 'center',
  },
  selectCircleActive: { backgroundColor: Colors.stone[900], borderColor: Colors.stone[900] },

  bookBtn: {
    backgroundColor: Colors.stone[900], borderRadius: 18, height: 58,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
  },
  bookBtnDisabled: { backgroundColor: Colors.stone[300] },
  bookBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900' },

  // ── 環境照片 ──
  atmosphereScroll: { paddingRight: 4, gap: 12 },
  atmosphereCard: { width: width * 0.72, height: 200, borderRadius: 22, overflow: 'hidden' },
  atmosphereImage: { width: '100%', height: '100%' },
  atmosphereOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 14, backgroundColor: 'rgba(0,0,0,0.35)',
  },
  atmosphereCaption: { color: Colors.white, fontSize: 13, fontWeight: '800' },

  // ── 商家資訊 ──
  infoList: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  infoRowIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.stone[50], justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoRowContent: { flex: 1 },
  infoRowLabel: { fontSize: 11, fontWeight: '800', color: Colors.stone[400], marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRowValue: { fontSize: 14, fontWeight: '600', color: Colors.stone[800], lineHeight: 20 },

  noticeCard: { backgroundColor: Colors.stone[50], borderRadius: 20, padding: 18 },
  noticeTitle: { fontSize: 15, fontWeight: '900', color: Colors.stone[900], marginBottom: 12 },
  noticeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  noticeDot: { fontSize: 16, color: Colors.amber400, lineHeight: 20 },
  noticeText: { flex: 1, fontSize: 13, color: Colors.stone[600], lineHeight: 20, fontWeight: '500' },

  // ── 底部固定列 ──
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: Colors.stone[100],
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 10,
  },
  bottomBarLeft: { flex: 1 },
  bottomBarLabel: { fontSize: 10, fontWeight: '800', color: Colors.stone[400], textTransform: 'uppercase', letterSpacing: 0.5 },
  bottomBarService: { fontSize: 14, fontWeight: '800', color: Colors.stone[900], marginTop: 2 },
  bottomBookBtn: {
    backgroundColor: Colors.stone[900], paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  bottomBookBtnText: { color: Colors.white, fontSize: 15, fontWeight: '900' },

  // ── Lightbox ──
  lightboxOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
  lightboxClose: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 10, padding: 8 },
  lightboxItem: { width, justifyContent: 'center', alignItems: 'center' },
  lightboxImage: { width, height: height * 0.75 },
});