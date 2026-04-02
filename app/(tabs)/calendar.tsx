import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Dimensions, Platform 
} from 'react-native';
import { Image } from 'expo-image';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  MessageSquare, ChevronLeft, ChevronRight, Bell 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// 模擬預約資料
const APPOINTMENTS = [
  { id: '1', date: '2025-03-10', time: '14:30', shopName: 'Yuki Nail Studio', service: '單色美甲', status: '待參加', image: 'https://images.unsplash.com/photo-1604654894610-df4906c24bc6?w=400', location: '台北車站' },
  { id: '2', date: '2025-03-12', time: '11:00', shopName: 'Mina 美甲藝術', service: '法式漸層', status: '待參加', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', location: '大安站' },
  { id: '3', date: '2025-03-25', time: '即時媒合中', shopName: '配對中項目', service: '微刺青', status: '媒合中', image: null, location: '中山站' },
];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // 預設 2025 年 3 月
  const [selectedDateStr, setSelectedDateStr] = useState('2025-03-10');

  // 計算月曆網格
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 第一天是週幾
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 當月總天數
    
    const grid = [];
    // 補足月初的空白
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push({ day: null });
    }
    // 填入日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      grid.push({
        day: i,
        fullDate: dateStr,
        hasEvent: APPOINTMENTS.some(app => app.date === dateStr)
      });
    }
    return grid;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const filteredAppointments = APPOINTMENTS.filter(app => app.date === selectedDateStr);

  return (
    <View style={styles.container}>
      {/* 頂部控制列 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
            <ChevronLeft size={20} color={Colors.stone[400]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
            <ChevronRight size={20} color={Colors.stone[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={Colors.stone[900]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🌟 月曆網格區塊 */}
      <View style={styles.calendarContainer}>
        {/* 星期標頭 */}
        <View style={styles.weekHeader}>
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <Text key={d} style={styles.weekText}>{d}</Text>
          ))}
        </View>
        
        {/* 日期網格 */}
        <View style={styles.grid}>
          {calendarGrid.map((item, index) => (
            <TouchableOpacity 
              key={index}
              disabled={!item.day}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedDateStr(item.fullDate!);
              }}
              style={[
                styles.dayCell,
                selectedDateStr === item.fullDate && styles.selectedCell
              ]}
            >
              <Text style={[
                styles.dayText,
                selectedDateStr === item.fullDate && styles.selectedDayText
              ]}>
                {item.day}
              </Text>
              {item.hasEvent && (
                <View style={[
                  styles.eventDot,
                  selectedDateStr === item.fullDate && { backgroundColor: Colors.white }
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 下方行程清單 */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <Text style={styles.sectionTitle}>{selectedDateStr} 的行程</Text>
        
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item) => (
            <View key={item.id} style={styles.appointmentCard}>
              <View style={styles.cardTop}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.shopImg} contentFit="cover" />
                ) : (
                  <View style={[styles.shopImg, styles.placeholderImg]}><CalendarIcon size={24} color={Colors.stone[300]} /></View>
                )}
                <View style={styles.cardInfo}>
                  <View style={styles.statusRow}>
                    <Text style={[styles.statusTag, item.status === '媒合中' ? styles.statusMatching : styles.statusUpcoming]}>
                      {item.status}
                    </Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.shopName}>{item.shopName}</Text>
                  <Text style={styles.serviceName}>{item.service}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>今天暫無行程安排</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.stone[900], letterSpacing: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  arrowBtn: { padding: 4 },
  notifBtn: { marginLeft: 8 },

  // 月曆核心樣式
  calendarContainer: { paddingHorizontal: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.stone[50] },
  weekHeader: { flexDirection: 'row', marginBottom: 15 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.stone[300] },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { 
    width: (width - 32) / 7, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 12
  },
  selectedCell: { backgroundColor: Colors.stone[900] },
  dayText: { fontSize: 14, fontWeight: '600', color: Colors.stone[800] },
  selectedDayText: { color: Colors.white },
  eventDot: { position: 'absolute', bottom: 8, width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.amber400 },

  scrollBody: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.stone[400], marginBottom: 16, textTransform: 'uppercase' },
  
  appointmentCard: { backgroundColor: Colors.stone[50], borderRadius: 24, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', gap: 14 },
  shopImg: { width: 60, height: 60, borderRadius: 12 },
  placeholderImg: { backgroundColor: Colors.stone[100], justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  statusTag: { fontSize: 9, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusUpcoming: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  statusMatching: { backgroundColor: '#fff8e1', color: '#f57f17' },
  timeText: { fontSize: 11, fontWeight: '700', color: Colors.stone[400] },
  shopName: { fontSize: 15, fontWeight: '800', color: Colors.stone[900] },
  serviceName: { fontSize: 12, color: Colors.stone[500], marginTop: 2 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: Colors.stone[300], fontWeight: '600' }
});