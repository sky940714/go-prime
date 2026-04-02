import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Sparkles, MapPin, MessageCircle, Calendar, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.stone[900],
        tabBarInactiveTintColor: Colors.stone[300],
        // 核心樣式設定
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: '探索',
          tabBarIcon: ({ color, focused }) => (
            <Sparkles size={24} color={color} fill={focused ? Colors.stone[900] : 'transparent'} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: '地圖',
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
        }}
      />
      
      {/* 🌟 中央凸起按鈕：現在點擊會直接跳轉至 action.tsx 獨立頁面 */}
      <Tabs.Screen
        name="action"
        options={{
          title: '', // 中央按鈕不顯示文字
          tabBarIcon: () => (
            <View style={styles.centerButtonWrapper}>
              <View style={styles.centerButtonRing}>
                <View style={styles.centerButton}>
                  <MessageCircle size={30} color={Colors.white} />
                </View>
              </View>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="calendar"
        options={{
          title: '預約',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    height: 76, 
    paddingTop: 8,
    paddingBottom: 8,    
    backgroundColor: Colors.white,
    borderRadius: 40,
    borderTopWidth: 0, 
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,

    // 🌟 跨平台置中魔法：針對不同環境給予最適合的定位方式
    ...Platform.select({
      web: {
        // 網頁版：利用自動邊距與最大寬度限制
        left: 0,
        right: 0,
        marginHorizontal: 'auto',
        width: '88%',
        maxWidth: 400,
      },
      default: { 
        // 手機版 (iOS/Android)：利用絕對左右定位
        left: 24,
        right: 24,
      }
    })
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 0, 
  },
  
  /* 中央凸起按鈕樣式 */
  centerButtonWrapper: {
    position: 'absolute',
    top: -24, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonRing: {
    padding: 6,
    backgroundColor: Colors.stone[50], 
    borderRadius: 50,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.stone[900],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});