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
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { 
  Sparkles, MapPin, Search, Flame, Palette, 
  Activity, Zap, Pen, Filter, Heart, Star, XCircle
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// 作品資料
const stylesData = [
  { id: 1, title: '極簡貓眼美甲', category: '美甲', price: 1200, rating: 4.8, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400&q=80', artist: 'Yuki' },
  { id: 2, title: '玻尿酸唇部微調', category: '醫美', price: 15000, rating: 5.0, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80', artist: 'Dr. Chen' },
  { id: 3, title: '全身雷射除毛方案', category: '除毛', price: 3500, rating: 4.7, image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80', artist: 'Sophie' },
  { id: 4, title: '美式文字微刺青', category: '刺青', price: 4500, rating: 4.9, image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=400&q=80', artist: 'Zero' },
  { id: 5, title: '莫蘭迪磨砂美甲', category: '美甲', price: 1350, rating: 4.9, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80', artist: 'Mina' },
  { id: 6, title: '日系浮世繪大圖', category: '刺青', price: 28000, rating: 5.0, image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&q=80', artist: 'Kento' },
];

// 推薦店家資料
const recommendedShops = [
  { id: 1, name: 'Ink & Soul Tattoo', rating: 4.9, image: 'https://images.unsplash.com/photo-1598300042247-d088f54e4ee1?w=400', tag: '刺青' },
  { id: 2, name: 'Yuki Nail Studio', rating: 4.8, image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', tag: '美甲' },
  { id: 3, name: 'Lin Aesthetics', rating: 5.0, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', tag: '醫美' },
];

const categories = [
  { name: '全部', icon: Sparkles },
  { name: '美甲', icon: Palette },
  { name: '醫美', icon: Activity },
  { name: '除毛', icon: Zap },
  { name: '刺青', icon: Pen },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const filteredData = useMemo(() => {
    return stylesData.filter(item => {
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
      const matchesSearch = item.title.includes(searchQuery) || item.artist.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleLike = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCategoryPress = (name: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(name);
  };

  return (
    <View style={styles.container}>
      {/* 頂部導航欄 */}
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
        
        {/* Instant Match 需求牆 */}
        <View style={styles.sectionPx}>
          <Pressable 
            style={({ pressed }) => [styles.instantCard, pressed && { opacity: 0.95, scale: 0.98 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/action'); // 🌟 跳轉到獨立發布頁面
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

        {/* 推薦店家橫向捲軸 */}
        <View style={styles.marginTop8}>
          <View style={[styles.sectionPx, styles.flexRowBetween, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>推薦店家</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>查看全部</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {recommendedShops.map((shop) => (
              <TouchableOpacity 
                key={shop.id} 
                style={styles.shopCard}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Image source={{ uri: shop.image }} style={styles.shopImage} contentFit="cover" />
                <View style={styles.shopContent}>
                  <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                  <View style={styles.shopFooter}>
                    <View style={styles.ratingBox}>
                      <Star size={10} color={Colors.amber400} fill={Colors.amber400} />
                      <Text style={styles.ratingTextSmall}>{shop.rating}</Text>
                    </View>
                    <Text style={styles.shopTag}>{shop.tag}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 分類導航 */}
        <View style={styles.marginTop8}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => {
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

        {/* 作品展示牆 */}
        <View style={[styles.sectionPx, styles.marginTop6]}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.sectionTitle}>探索靈感</Text>
              <Text style={styles.sectionSubtitle}>/{selectedCategory}</Text>
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={18} color={Colors.stone[500]} />
            </TouchableOpacity>
          </View>

          {filteredData.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredData.map((item) => (
                <Pressable 
                  key={item.id} 
                  style={styles.gridItem}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" transition={500} />
                    <TouchableOpacity style={styles.heartBtn} onPress={() => toggleLike(item.id)}>
                      <Heart 
                        size={16} 
                        color={likedItems.includes(item.id) ? '#ff4b4b' : Colors.white} 
                        fill={likedItems.includes(item.id) ? '#ff4b4b' : 'transparent'}
                      />
                    </TouchableOpacity>
                    <View style={styles.ratingBadge}>
                      <Star size={10} color={Colors.amber400} fill={Colors.amber400} style={{ marginRight: 4 }} />
                      <Text style={styles.ratingText}>{item.rating}</Text>
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
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.stone[100] },
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
  instantCard: { backgroundColor: Colors.stone[900], borderRadius: 36, padding: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8, marginTop: 16 },
  instantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  instantBadge: { backgroundColor: Colors.amber400, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginRight: 10 },
  instantBadgeText: { color: Colors.stone[900], fontSize: 11, fontWeight: '900' },
  instantSubtitle: { color: Colors.stone[400], fontSize: 12, fontWeight: '600' },
  instantTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginBottom: 18, letterSpacing: -0.5 },
  instantButton: { backgroundColor: Colors.white, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25, alignSelf: 'flex-start' },
  instantButtonText: { color: Colors.stone[900], fontSize: 15, fontWeight: '800' },
  instantBgIcon: { position: 'absolute', right: -30, bottom: -30, opacity: 0.08, transform: [{ rotate: '-15deg' }] },
  
  // 推薦店家樣式
  shopCard: { width: 200, backgroundColor: Colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.stone[100] },
  shopImage: { width: '100%', height: 110 },
  shopContent: { padding: 12 },
  shopName: { fontSize: 14, fontWeight: '800', color: Colors.stone[800], marginBottom: 6 },
  shopFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTextSmall: { fontSize: 11, fontWeight: '800', color: Colors.stone[800] },
  shopTag: { fontSize: 10, fontWeight: '700', color: Colors.stone[400], backgroundColor: Colors.stone[50], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: Colors.stone[400] },

  categoryScroll: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 20, borderWidth: 1.5 },
  categoryBtnActive: { backgroundColor: Colors.stone[800], borderColor: Colors.stone[800], shadowColor: Colors.stone[800], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  categoryBtnInactive: { backgroundColor: Colors.white, borderColor: Colors.stone[100] },
  categoryText: { marginLeft: 8, fontSize: 15, fontWeight: '700' },
  categoryTextActive: { color: Colors.white },
  categoryTextInactive: { color: Colors.stone[400] },
  marginTop6: { marginTop: 10 },
  marginTop8: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.stone[800], letterSpacing: -0.5 },
  sectionSubtitle: { color: Colors.stone[400], fontSize: 14, fontWeight: '600', marginLeft: 8 },
  filterBtn: { padding: 10, backgroundColor: Colors.stone[100], borderRadius: 14 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: (width - 64) / 2, marginBottom: 24 },
  imageContainer: { width: '100%', aspectRatio: 3.5/4.5, borderRadius: 30, overflow: 'hidden', marginBottom: 12, backgroundColor: Colors.stone[100], position: 'relative' },
  image: { width: '100%', height: '100%' },
  heartBtn: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(255,255,255,0.25)', padding: 10, borderRadius: 18 },
  ratingBadge: { position: 'absolute', bottom: 14, left: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(28,25,23,0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  ratingText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: Colors.stone[800], paddingHorizontal: 4, marginBottom: 4 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  itemArtist: { color: Colors.stone[400], fontSize: 12, fontWeight: '600' },
  itemPrice: { color: Colors.stone[900], fontSize: 15, fontWeight: '900' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { color: Colors.stone[300], fontSize: 16, fontWeight: '600' },
});