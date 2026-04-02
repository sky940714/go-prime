import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

// 🌟 修正 1：加上 export 關鍵字，讓外部檔案可以匯入此型別
export interface MapShop {
  id: number;
  name: string;
  rating: number;
  dist: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  image: string;
}

interface MapProviderProps {
  shops: MapShop[];
  onMarkerPress: (shop: MapShop) => void;
}

// 🌟 修正 2：在函式參數中接住 props ({ shops, onMarkerPress })
export default function MapProvider({ shops, onMarkerPress }: MapProviderProps) {
  return (
    <View style={styles.webFallback}>
      <Text style={styles.text}>地圖功能在 Web 環境下建議使用 Google Maps API 實作</Text>
      <Text style={styles.subText}>（目前為 Native 端的優先優化版本）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: { 
    flex: 1, 
    backgroundColor: Colors.stone[100], 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40 
  },
  text: { 
    color: Colors.stone[800], 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  subText: { 
    color: Colors.stone[400], 
    marginTop: 8 
  }
});