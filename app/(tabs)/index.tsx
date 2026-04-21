import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Sparkles, MapPin, Search, Flame, Palette,
  Activity, Zap, Pen, Heart, Star, XCircle,
  TrendingUp, Award,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// ─── 附近店家資料 ─────────────────────────────────────────
const NEARBY_SHOPS = [
  {
    id: 1,
    name: 'Ink & Soul Tattoo',
    rating: 4.9,
    dist: '450m',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f54e4ee1?w=400',
    tag: '刺青',
    isOpen: true,
  },
  {
    id: 2,
    name: 'Yuki Nail Studio',
    rating: 4.8,
    dist: '820m',
    image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400',
    tag: '美甲',
    isOpen: true,
  },
  {
    id: 3,
    name: 'Lin Aesthetics',
    rating: 5.0,
    dist: '1.2km',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
    tag: '醫美',
    isOpen: false,
  },
  {
    id: 4,
    name: 'Zero Tattoo Studio',
    rating: 4.7,
    dist: '1.5km',
    image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400',
    tag: '刺青',
    isOpen: true,
  },
];

// ─── 近期熱門作品資料 ─────────────────────────────────────
const WORKS_DATA = [
  { id: 1, title: '極簡貓眼美甲', category: '美甲', price: 1200, rating: 4.8, reviews: 128, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400&q=80', artist: 'Yuki', isTrending: true },
  { id: 2, title: '玻尿酸唇部微調', category: '醫美', price: 15000, rating: 5.0, reviews: 96, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80', artist: 'Dr. Chen', isTrending: false },
  { id: 3, title: '全身雷射除毛方案', category: '除毛', price: 3500, rating: 4.7, reviews: 74, image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80', artist: 'Sophie', isTrending: false },
  { id: 4, title: '美式文字微刺青', category: '刺青', price: 4500, rating: 4.9, reviews: 213, image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=400&q=80', artist: 'Zero', isTrending: true },
  { id: 5, title: '莫蘭迪磨砂美甲', category: '美甲', price: 1350, rating: 4.9, reviews: 187, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80', artist: 'Mina', isTrending: true },
  { id: 6, title: '日系浮世繪大圖', category: '刺青', price: 28000, rating: 5.0, reviews: 62, image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&q=80', artist: 'Kento', isTrending: false },
];

// ─── 分類 ────────────────────────────────────────────────
const CATEGORIES = [
  { name: '全部', icon: Sparkles },
  { name: '美甲', icon: Palette },
  { name: '醫美', icon: Activity },
  { name: '除毛', icon: Zap },
  { name: '刺青', icon: Pen },
];

// ─── 排序模式 ─────────────────────────────────────────────
type SortMode = 'trending' | 'rating';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('trending');

  const filteredData = useMemo(() => {
    let data = WORKS_DATA.filter(item => {
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
      const matchesSearch = item.title.includes(searchQuery) || item.artist.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    // 排序
    if (sortMode === 'trending') {
      // 熱門：優先顯示 isTrending，再依評論數排序
      data = [...data].sort((a, b) => {
        if (a.isTrending !== b.isTrending) return a.isTrending ? -1 : 1;
        return b.reviews - a.reviews;
      });
    } else {
      // 高評分：依評分降序
      data = [...data].sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [selectedCategory, searchQuery, sortMode]);

  const toggleLike = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCategoryPress = (name: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(name);
  };

  const handleSortMode = (mode: SortMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSortMode(mode);
  };

  return (
    <View style={styles.container}>

      {/* ── 頂部導航列 ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoIcon}>
              <Sparkles color={Colors.white} size={20} />
            </View>
            <Text style={styles.logoText}>Go Prime</Text>
          </View>
          <TouchableOpacity
            style={styles.locationBadge}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <MapPin size={12} color={Colors.stone[800]} style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>台北市, 大安區</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.stone[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="找款式、店家、設計師..."
            placeholderTextColor={Colors.stone[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <XCircle size={18} color={Colors.stone[300]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Instant Match 卡片 ── */}
        <View style={styles.sectionPx}>
          <Pressable
            style={({ pressed }) => [styles.instantCard, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/action');
            }}
          >
            <View style={{ zIndex: 10 }}>
              <View style={styles.instantHeader}>
                <View style={styles.instantBadge}>
                  <Text style={styles.instantBadgeText}>INSTANT</Text>
                </View>
                <Text style={styles.instantSubtitle}>臨時想變美？發布需求搶空檔</Text>
              </View>
              <Text style={styles.instantTitle}>一鍵媒合即時空檔</Text>
              <View style={styles.instantButton}>
                <Text style={styles.instantButtonText}>立即發布</Text>
              </View>
            </View>
            <Flame size={160} color={Colors.white} style={styles.instantBgIcon} />
          </Pressable>
        </View>

        {/* ── 附近店家 ── */}
        <View style={styles.marginTop8}>
          <View style={[styles.sectionPx, styles.flexRowBetween, { marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <MapPin size={16} color={Colors.stone[800]} />
              <Text style={styles.sectionTitle}>附近店家</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.viewAllText}>查看地圖</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}
          >
            {NEARBY_SHOPS.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                style={styles.shopCard}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.88}
              >
                <View style={styles.shopImageWrapper}>
                  <Image source={{ uri: shop.image }} style={styles.shopImage} contentFit="cover" />
                  {/* 營業狀態 */}
                  <View style={[styles.openBadge, !shop.isOpen && styles.closedBadge]}>
                    <Text style={styles.openBadgeText}>{shop.isOpen ? '營業中' : '休息中'}</Text>
                  </View>
                </View>
                <View style={styles.shopContent}>
                  <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                  <View style={styles.shopFooter}>
                    <View style={styles.ratingBox}>
                      <Star size={10} color={Colors.amber400} fill={Colors.amber400} />
                      <Text style={styles.ratingTextSmall}>{shop.rating}</Text>
                    </View>
                    <View style={styles.distBox}>
                      <MapPin size={10} color={Colors.stone[400]} />
                      <Text style={styles.distText}>{shop.dist}</Text>
                    </View>
                  </View>
                  <Text style={styles.shopTag}>{shop.tag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 分類導航 ── */}
        <View style={styles.marginTop8}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => handleCategoryPress(cat.name)}
                  activeOpacity={0.7}
                  style={[styles.categoryBtn, isSelected ? styles.categoryBtnActive : styles.categoryBtnInactive]}
                >
                  <Icon size={18} color={isSelected ? Colors.white : Colors.stone[400]} />
                  <Text style={[styles.categoryText, isSelected ? styles.categoryTextActive : styles.categoryTextInactive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── 近期熱門 / 高評分 ── */}
        <View style={[styles.sectionPx, styles.marginTop6]}>

          {/* 標題列 + 切換 Tab */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              {sortMode === 'trending'
                ? <TrendingUp size={16} color={Colors.stone[800]} />
                : <Award size={16} color={Colors.amber400} />
              }
              <Text style={styles.sectionTitle}>
                {sortMode === 'trending' ? '近期熱門' : '高評分推薦'}
              </Text>
            </View>

            {/* 切換按鈕 */}
            <View style={styles.sortToggle}>
              <TouchableOpacity
                style={[styles.sortBtn, sortMode === 'trending' && styles.sortBtnActive]}
                onPress={() => handleSortMode('trending')}
              >
                <TrendingUp size={13} color={sortMode === 'trending' ? Colors.white : Colors.stone[400]} />
                <Text style={[styles.sortBtnText, sortMode === 'trending' && styles.sortBtnTextActive]}>熱門</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortBtn, sortMode === 'rating' && styles.sortBtnActive]}
                onPress={() => handleSortMode('rating')}
              >
                <Award size={13} color={sortMode === 'rating' ? Colors.white : Colors.stone[400]} />
                <Text style={[styles.sortBtnText, sortMode === 'rating' && styles.sortBtnTextActive]}>評分</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 作品格狀列表 */}
          {filteredData.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredData.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.image}
                      contentFit="cover"
                      transition={500}
                    />

                    {/* 熱門標籤 */}
                    {item.isTrending && sortMode === 'trending' && (
                      <View style={styles.trendingBadge}>
                        <TrendingUp size={9} color={Colors.white} />
                        <Text style={styles.trendingBadgeText}>熱門</Text>
                      </View>
                    )}

                    {/* 愛心 */}
                    <TouchableOpacity style={styles.heartBtn} onPress={() => toggleLike(item.id)}>
                      <Heart
                        size={16}
                        color={likedItems.includes(item.id) ? '#ff4b4b' : Colors.white}
                        fill={likedItems.includes(item.id) ? '#ff4b4b' : 'transparent'}
                      />
                    </TouchableOpacity>

                    {/* 評分 + 評論數 */}
                    <View style={styles.ratingBadge}>
                      <Star size={10} color={Colors.amber400} fill={Colors.amber400} style={{ marginRight: 3 }} />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                      <Text style={styles.reviewCount}>({item.reviews})</Text>
                    </View>
                  </View>

                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemArtist}>{item.artist} · {item.category}</Text>
                    <Text style={styles.itemPrice}>NT${item.price.toLocaleString()}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Sparkles size={48} color={Colors.stone[100]} />
              <Text style={styles.emptyText}>暫無符合條件的作品</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.stone[50] },

  // ── Header ──
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.stone[100],
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { backgroundColor: Colors.stone[900], padding: 6, borderRadius: 10, marginRight: 8 },
  logoText: { fontSize: 22, fontWeight: '900', color: Colors.stone[800], textTransform: 'uppercase', letterSpacing: 0.5 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[100], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  locationText: { color: Colors.stone[800], fontSize: 13, fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.stone[100], borderRadius: 18, paddingHorizontal: 16, height: 48 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.stone[900], fontWeight: '500' },

  scrollContent: { paddingBottom: 140 },
  sectionPx: { paddingHorizontal: 24 },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marginTop6: { marginTop: 10 },
  marginTop8: { marginTop: 28 },

  // ── Instant Card ──
  instantCard: { backgroundColor: Colors.stone[900], borderRadius: 36, padding: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8, marginTop: 16 },
  instantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  instantBadge: { backgroundColor: Colors.amber400, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginRight: 10 },
  instantBadgeText: { color: Colors.stone[900], fontSize: 11, fontWeight: '900' },
  instantSubtitle: { color: Colors.stone[400], fontSize: 12, fontWeight: '600' },
  instantTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginBottom: 18, letterSpacing: -0.5 },
  instantButton: { backgroundColor: Colors.white, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25, alignSelf: 'flex-start' },
  instantButtonText: { color: Colors.stone[900], fontSize: 15, fontWeight: '800' },
  instantBgIcon: { position: 'absolute', right: -30, bottom: -30, opacity: 0.08, transform: [{ rotate: '-15deg' }] },

  // ── 附近店家 ──
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.stone[800], letterSpacing: -0.3 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: Colors.stone[400] },

  shopCard: { width: 170, backgroundColor: Colors.white, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.stone[100] },
  shopImageWrapper: { position: 'relative' },
  shopImage: { width: '100%', height: 105 },
  openBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#22c55e', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  closedBadge: { backgroundColor: Colors.stone[400] },
  openBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
  shopContent: { padding: 12 },
  shopName: { fontSize: 13, fontWeight: '800', color: Colors.stone[800], marginBottom: 6 },
  shopFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingTextSmall: { fontSize: 11, fontWeight: '800', color: Colors.stone[800] },
  distBox: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distText: { fontSize: 11, fontWeight: '600', color: Colors.stone[400] },
  shopTag: { fontSize: 10, fontWeight: '700', color: Colors.stone[400], backgroundColor: Colors.stone[50], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },

  // ── 分類 ──
  categoryScroll: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11, borderRadius: 20, borderWidth: 1.5 },
  categoryBtnActive: { backgroundColor: Colors.stone[800], borderColor: Colors.stone[800], shadowColor: Colors.stone[800], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  categoryBtnInactive: { backgroundColor: Colors.white, borderColor: Colors.stone[100] },
  categoryText: { marginLeft: 8, fontSize: 14, fontWeight: '700' },
  categoryTextActive: { color: Colors.white },
  categoryTextInactive: { color: Colors.stone[400] },

  // ── 近期熱門 Section ──
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionSubtitle: { color: Colors.stone[400], fontSize: 13, fontWeight: '600', marginLeft: 8 },

  // 排序切換
  sortToggle: { flexDirection: 'row', backgroundColor: Colors.stone[100], borderRadius: 12, padding: 3 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  sortBtnActive: { backgroundColor: Colors.stone[900] },
  sortBtnText: { fontSize: 12, fontWeight: '800', color: Colors.stone[400] },
  sortBtnTextActive: { color: Colors.white },

  // ── 作品格狀 ──
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: (width - 64) / 2, marginBottom: 24 },
  imageContainer: { width: '100%', aspectRatio: 3.5 / 4.5, borderRadius: 28, overflow: 'hidden', marginBottom: 12, backgroundColor: Colors.stone[100], position: 'relative' },
  image: { width: '100%', height: '100%' },

  trendingBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.amber400,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  trendingBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '900' },

  heartBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.25)', padding: 10, borderRadius: 16 },

  ratingBadge: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(28,25,23,0.85)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  ratingText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  reviewCount: { color: Colors.stone[400], fontSize: 10, fontWeight: '600', marginLeft: 3 },

  itemTitle: { fontSize: 14, fontWeight: '800', color: Colors.stone[800], paddingHorizontal: 4, marginBottom: 4 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  itemArtist: { color: Colors.stone[400], fontSize: 11, fontWeight: '600' },
  itemPrice: { color: Colors.stone[900], fontSize: 14, fontWeight: '900' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { color: Colors.stone[300], fontSize: 16, fontWeight: '600' },
});