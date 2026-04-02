import React, { useState } from 'react';
import { 
  LayoutDashboard, Store, Zap, Users, 
  CheckCircle, XCircle, ExternalLink, Search 
} from 'lucide-react';

// 模擬待審核商家數據
const PENDING_MERCHANTS = [
  { id: 1, name: 'Yuki Nail Studio', category: '美甲', phone: '0912-345-678', ig: 'yuki_nails', date: '2026-03-31' },
  { id: 2, name: '極致美學診所', category: '醫美', phone: '0922-000-111', ig: 'prime_beauty', date: '2026-04-01' },
];

export default function AdminDashboard() {
  return (
    <div style={styles.container}>
      {/* 側邊欄 */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logoText}>GO PRIME <span style={styles.adminTag}>ADMIN</span></h2>
        <nav style={styles.nav}>
          <div style={{...styles.navItem, ...styles.navActive}}><LayoutDashboard size={20}/> 數據總覽</div>
          <div style={styles.navItem}><Store size={20}/> 商家審核</div>
          <div style={styles.navItem}><Zap size={20}/> 配對監控</div>
          <div style={styles.navItem}><Users size={20}/> 會員管理</div>
        </nav>
      </aside>

      {/* 主內容區 */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>管理後台總覽</h1>
          <div style={styles.searchBar}>
            <Search size={18} color="#a8a29e" />
            <input type="text" placeholder="搜尋商家或訂單..." style={styles.input} />
          </div>
        </header>

        {/* 數據卡片 */}
        <div style={styles.statsRow}>
          <StatCard title="今日配對數" value="128" change="+12%" icon={<Zap color="#fbbf24"/>} />
          <StatCard title="待審核商家" value={PENDING_MERCHANTS.length.toString()} change="需即時處理" icon={<Store color="#1c1917"/>} />
          <StatCard title="平台營收 (NTD)" value="52,400" change="+8.5%" icon={<CheckCircle color="#22c55e"/>} />
        </div>

        {/* 審核表格 */}
        <section style={styles.section}>
          <h3>待審核商家列表</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>申請日期</th>
                <th>店鋪名稱</th>
                <th>類別</th>
                <th>聯繫電話</th>
                <th>作品集</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_MERCHANTS.map(m => (
                <tr key={m.id} style={styles.tableRow}>
                  <td>{m.date}</td>
                  <td style={{fontWeight: 'bold'}}>{m.name}</td>
                  <td>{m.category}</td>
                  <td>{m.phone}</td>
                  <td><a href="#" style={styles.link}><ExternalLink size={14}/> @{m.ig}</a></td>
                  <td>
                    <button style={styles.btnApprove}>核准</button>
                    <button style={styles.btnReject}>拒絕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

// 輔助組件
function StatCard({ title, value, change, icon }: any) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>{icon}</div>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardChange}>{change}</div>
    </div>
  );
}

// 簡易 Inline Styles (Jerry 可以之後換成 CSS Modules 或 Tailwind)
const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#fafaf9', color: '#1c1917', fontFamily: 'system-ui' },
  sidebar: { width: '260px', backgroundColor: '#1c1917', color: '#fff', padding: '24px' },
  logoText: { fontSize: '20px', fontWeight: 900, marginBottom: '40px', letterSpacing: '1px' },
  adminTag: { color: '#fbbf24', fontSize: '12px', marginLeft: '4px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '12px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#a8a29e' },
  navActive: { backgroundColor: '#292524', color: '#fff' },
  main: { flex: 1, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e7e5e4' },
  input: { border: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '40px' },
  card: { flex: 1, backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4' },
  cardTitle: { fontSize: '14px', color: '#78716c', marginBottom: '8px' },
  cardValue: { fontSize: '28px', fontWeight: 800, marginBottom: '4px' },
  cardChange: { fontSize: '12px', color: '#22c55e', fontWeight: 'bold' },
  section: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
  tableHeader: { textAlign: 'left', borderBottom: '1px solid #f5f5f4', color: '#78716c', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #f5f5f4' },
  link: { color: '#fbbf24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' },
  btnApprove: { backgroundColor: '#1c1917', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' },
  btnReject: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
};