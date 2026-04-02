import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Dimensions, Platform 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'; // 🌟 引入參數獲取
import { X, Zap, Star, MessageSquare, MapPin, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import Animated, { 
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// 🌟 雷達波紋組件
const RadarPulse = ({ isMinimized, delay = 0 }: { isMinimized: boolean, delay?: number }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    const targetScale = isMinimized ? 1.6 : 2.5;
    scale.value = withRepeat(withDelay(delay, withTiming(targetScale, { duration: 2500 })), -1, false);
    opacity.value = withRepeat(withDelay(delay, withTiming(0, { duration: 2500 })), -1, false);
  }, [isMinimized]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulseCircle, rStyle]} />;
};

// 模擬符合條件的在線店家
const MATCHED_SHOPS = [
  { id: 1, name: 'Yuki Nail Studio', rating: 4.9, dist: '0.8km', image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', status: '在線接單中', matchReason: '符合您的預算區間' },
  { id: 2, name: 'Mina 美甲藝術', rating: 4.8, dist: '1.2km', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', status: '活躍中', matchReason: '位於您的指定地區' },
  { id: 3, name: '大安高級美學', rating: 5.0, dist: '2.5km', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', status: '高媒合度', matchReason: '高評分推薦' },
];

export default function MatchScreen() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [statusText, setStatusText] = useState('正在聯繫附近的店家...');
  
  // 🌟 獲取從 action.tsx 傳來的參數（假設已透過 router.push 傳遞）
  const params = useLocalSearchParams();
  const searchCriteria = `${params.location || '台北車站'} · ${params.service || '美甲'}`;

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isMinimized ? 160 : height, { duration: 500 }),
      backgroundColor: isMinimized ? Colors.white : Colors.stone[900],
    };
  });

  const toggleMinimize = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusText('已有 3 家店鋪查看您的需求！');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* 🌟 動態雷達標題區 */}
      <Animated.View style={[styles.animatedHeader, animatedHeaderStyle]}>
        <View style={[styles.headerContent, isMinimized && styles.headerContentMini]}>
          
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.closeBtn, isMinimized && styles.closeBtnMini]}
          >
            <X size={24} color={isMinimized ? Colors.stone[900] : Colors.white} />
          </TouchableOpacity>

          <View style={[styles.radarContainer, isMinimized && styles.radarContainerMini]}>
            <RadarPulse isMinimized={isMinimized} delay={0} />
            <RadarPulse isMinimized={isMinimized} delay={1000} />
            <View style={[styles.radarCore, isMinimized && styles.radarCoreMini]}>
              <Zap size={isMinimized ? 18 : 40} color={Colors.stone[900]} fill={Colors.stone[900]} />
            </View>
          </View>

          <View style={[styles.statusInfo, isMinimized && styles.statusInfoMini]}>
            <Text style={[styles.statusTitle, isMinimized && styles.statusTitleMini]}>
              {isMinimized ? '配對進行中...' : statusText}
            </Text>
            <View style={styles.criteriaBadge}>
                <MapPin size={10} color={isMinimized ? Colors.stone[400] : Colors.amber400} />
                <Text style={[styles.statusSub, isMinimized && styles.statusSubMini]}>{searchCriteria}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={isMinimized ? styles.toggleBtnMini : styles.toggleBtnFull} 
            onPress={toggleMinimize}
          >
            <View style={[styles.toggleInner, isMinimized ? styles.toggleInnerMini : styles.toggleInnerFull]}>
              <Text style={[styles.toggleText, !isMinimized && { color: Colors.white }]}>
                {isMinimized ? '切換回等待畫面' : '縮小看推薦店家'}
              </Text>
              {isMinimized ? <ChevronUp size={14} color={Colors.stone[400]} /> : <ChevronDown size={14} color={Colors.white} />}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* 🌟 符合條件的店家清單區 */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>符合您的需求</Text>
          <Text style={styles.sectionDesc}>這些店家目前在線且符合您的預算範圍</Text>
        </View>

        {MATCHED_SHOPS.map((shop) => (
          <View key={shop.id} style={styles.shopCard}>
            <Image source={{ uri: shop.image }} style={styles.shopImg} contentFit="cover" />
            <View style={styles.shopInfo}>
              <View style={styles.shopTop}>
                <View>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <View style={styles.matchReasonRow}>
                        <CheckCircle2 size={10} color={Colors.amber400} />
                        <Text style={styles.matchReasonText}>{shop.matchReason}</Text>
                    </View>
                </View>
                <View style={styles.badge}><Text style={styles.badgeText}>{shop.status}</Text></View>
              </View>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Star size={12} color={Colors.amber400} fill={Colors.amber400} />
                    <Text style={styles.metaText}>{shop.rating}</Text>
                </View>
                <View style={styles.metaItem}>
                    <MapPin size={12} color={Colors.stone[400]} />
                    <Text style={styles.metaText}>{shop.dist}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.contactBtn} 
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              >
                <MessageSquare size={16} color={Colors.white} />
                <Text style={styles.contactBtnText}>立即聯絡</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.loadingMore}>
            <Text style={styles.loadingMoreText}>更多店家正在評估您的需求...</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },
  animatedHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, overflow: 'hidden', elevation: 10 },
  headerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerContentMini: { flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingHorizontal: 20 },
  
  closeBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 24, zIndex: 110, padding: 8 },
  closeBtnMini: { top: Platform.OS === 'ios' ? 55 : 35, left: 15 },
  
  radarContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  radarContainerMini: { width: 40, height: 40, marginBottom: 0, marginRight: 12, marginLeft: 35 },
  pulseCircle: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: Colors.amber400 },
  radarCore: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.amber400, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  radarCoreMini: { width: 28, height: 28, borderRadius: 14 },

  statusInfo: { alignItems: 'center', paddingHorizontal: 24 },
  statusInfoMini: { flex: 1, alignItems: 'flex-start', paddingHorizontal: 0, paddingRight: 80 },
  statusTitle: { fontSize: 20, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  statusTitleMini: { fontSize: 15, color: Colors.stone[900], textAlign: 'left' },
  
  criteriaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  statusSub: { fontSize: 13, color: Colors.stone[400], fontWeight: '600' },
  statusSubMini: { fontSize: 11, color: Colors.stone[300] },

  toggleBtnFull: { position: 'absolute', bottom: 60 },
  toggleBtnMini: { position: 'absolute', bottom: 15, right: 20 },
  toggleInner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  toggleInnerFull: { backgroundColor: 'rgba(255,255,255,0.1)' },
  toggleInnerMini: { backgroundColor: Colors.stone[100], borderWidth: 1, borderColor: Colors.stone[300] },
  toggleText: { fontSize: 11, fontWeight: '800', color: Colors.stone[500] },

  listContainer: { paddingTop: 180, paddingHorizontal: 24, paddingBottom: 120 },
  sectionHeader: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.stone[900] },
  sectionDesc: { fontSize: 13, color: Colors.stone[400], marginTop: 4, fontWeight: '500' },
  
  shopCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 24, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: Colors.stone[100], shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 10 },
  shopImg: { width: 90, height: 120, borderRadius: 18 },
  shopInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  shopTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  shopName: { fontSize: 16, fontWeight: '800', color: Colors.stone[900], marginBottom: 2 },
  matchReasonRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  matchReasonText: { fontSize: 10, color: Colors.stone[400], fontWeight: '700' },
  
  badge: { backgroundColor: Colors.stone[900], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.stone[400], fontWeight: '600' },
  
  contactBtn: { backgroundColor: Colors.stone[900], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  contactBtnText: { color: Colors.white, fontSize: 13, fontWeight: '800' },

  loadingMore: { marginTop: 20, alignItems: 'center' },
  loadingMoreText: { fontSize: 12, color: Colors.stone[300], fontWeight: '600' }
});