import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// 🌟 現在這裡的 MapShop 就能被正確識別了
import MapProvider, { MapShop } from '@/components/MapProvider'; 
import { Image } from 'expo-image';
import { Star, MapPin, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// 模擬資料：符合 MapShop 介面
const MOCK_SHOPS: MapShop[] = [
  { 
    id: 1, 
    name: 'Ink & Soul Tattoo', 
    rating: 4.9, 
    dist: '450m', 
    coordinate: { latitude: 25.033, longitude: 121.543 }, 
    image: 'https://images.unsplash.com/photo-1598300042247-d088f54e4ee1?w=400' 
  },
];

export default function ExploreScreen() {
  // 將狀態型別設定為 MapShop 或 null
  const [selectedShop, setSelectedShop] = useState<MapShop | null>(null);

  return (
    <View style={styles.container}>
      {/* 🌟 現在這裡傳入 shops 與 onMarkerPress 不再會噴錯 */}
      <MapProvider shops={MOCK_SHOPS} onMarkerPress={setSelectedShop} />

      {/* 圖釘快速預覽卡片 */}
      {selectedShop && (
        <View style={styles.quickView}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => setSelectedShop(null)}
            activeOpacity={0.7}
          >
            <X size={20} color={Colors.stone[400]} />
          </TouchableOpacity>
          
          <View style={styles.shopCard}>
            <Image 
              source={{ uri: selectedShop.image }} 
              style={styles.shopImg} 
              contentFit="cover"
              transition={300}
            />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName} numberOfLines={1}>
                {selectedShop.name}
              </Text>
              
              <View style={styles.shopMeta}>
                <Star size={12} color={Colors.amber400} fill={Colors.amber400} />
                <Text style={styles.metaText}>
                  {selectedShop.rating} · 距 {selectedShop.dist}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.bookBtn} activeOpacity={0.8}>
                <Text style={styles.bookBtnText}>查看詳情</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: Colors.stone[50] 
  },
  quickView: { 
    position: 'absolute', 
    bottom: 120, 
    left: 20, 
    right: 20, 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, 
    shadowRadius: 15, 
    elevation: 5 
  },
  shopCard: { 
    flexDirection: 'row', 
    gap: 16 
  },
  shopImg: { 
    width: 80, 
    height: 80, 
    borderRadius: 16,
    backgroundColor: Colors.stone[100]
  },
  shopInfo: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  shopName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.stone[800] 
  },
  shopMeta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  metaText: { 
    fontSize: 12, 
    color: Colors.stone[400],
    fontWeight: '500'
  },
  bookBtn: { 
    backgroundColor: Colors.stone[900], 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    alignSelf: 'flex-start' 
  },
  bookBtnText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  closeBtn: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    zIndex: 10,
    padding: 4
  }
});