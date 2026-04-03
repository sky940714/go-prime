// admin/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Store, Zap, Users,
  CheckCircle, XCircle, ExternalLink, Search,
  RefreshCw, Clock, AlertCircle,
} from 'lucide-react';

const API_BASE = 'https://eats-api.goverce.com/api/prime';

// ─── 型別 ────────────────────────────────────────────────────
interface Application {
  id: number;
  shop_name: string;
  category: string;
  phone: string;
  line_id: string | null;
  ig_link: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
}

// ─── 狀態標籤 ─────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Application['status'] }) => {
  const map = {
    pending:  { label: '待審核', bg: '#fff8e1', color: '#f57f17' },
    approved: { label: '已核准', bg: '#e8f5e9', color: '#2e7d32' },
    rejected: { label: '已拒絕', bg: '#fee2e2', color: '#ef4444' },
  };
  const s = map[status];
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6 }}>
      {s.label}
    </span>
  );
};

// ─── 主元件 ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState('商家審核');

  // 取得申請列表
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all'
        ? `${API_BASE}/applications`
        : `${API_BASE}/applications?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      setApplications(data.data || []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 審核動作：核准或拒絕
  const handleReview = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/applications/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('操作失敗');
      // 重新拉取最新資料
      await fetchApplications();
    } catch (e) {
      alert('操作失敗，請稍後再試');
    } finally {
      setActionLoading(null);
    }
  };

  // 前端搜尋過濾
  const filtered = applications.filter(app =>
    app.shop_name.includes(searchText) ||
    app.category.includes(searchText) ||
    (app.phone && app.phone.includes(searchText))
  );

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;

  const navItems = [
    { label: '數據總覽', icon: <LayoutDashboard size={20} /> },
    { label: '商家審核', icon: <Store size={20} /> },
    { label: '配對監控', icon: <Zap size={20} /> },
    { label: '會員管理', icon: <Users size={20} /> },
  ];

  return (
    <div style={styles.container}>
      {/* 側邊欄 */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logoText}>
          GO PRIME <span style={styles.adminTag}>ADMIN</span>
        </h2>
        <nav style={styles.nav}>
          {navItems.map(item => (
            <div
              key={item.label}
              style={{ ...styles.navItem, ...(activeNav === item.label ? styles.navActive : {}) }}
              onClick={() => setActiveNav(item.label)}
            >
              {item.icon} {item.label}
              {item.label === '商家審核' && pendingCount > 0 && (
                <span style={styles.navBadge}>{pendingCount}</span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 主內容 */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>商家申請審核</h1>
          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <Search size={18} color="#a8a29e" />
              <input
                type="text"
                placeholder="搜尋店名、類別、電話..."
                style={styles.searchInput}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <button style={styles.refreshBtn} onClick={fetchApplications} disabled={loading}>
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? '更新中...' : '重新整理'}
            </button>
          </div>
        </header>

        {/* 統計卡片 */}
        <div style={styles.statsRow}>
          <StatCard title="待審核" value={pendingCount} icon={<Clock color="#f57f17" size={22} />} color="#fff8e1" />
          <StatCard title="已核准" value={approvedCount} icon={<CheckCircle color="#22c55e" size={22} />} color="#e8f5e9" />
          <StatCard title="總申請數" value={applications.length} icon={<Store color="#1c1917" size={22} />} color="#f5f5f4" />
        </div>

        {/* 篩選 Tab */}
        <div style={styles.filterRow}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filterStatus === s ? styles.filterBtnActive : {}) }}
              onClick={() => setFilterStatus(s)}
            >
              {{ all: '全部', pending: '待審核', approved: '已核准', rejected: '已拒絕' }[s]}
            </button>
          ))}
        </div>

        {/* 申請列表 */}
        <section style={styles.section}>
          {loading ? (
            <div style={styles.emptyBox}>
              <RefreshCw size={32} color="#d6d3d1" />
              <p style={{ color: '#a8a29e' }}>載入中...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyBox}>
              <AlertCircle size={32} color="#d6d3d1" />
              <p style={{ color: '#a8a29e' }}>目前沒有符合條件的申請</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>申請日期</th>
                  <th style={styles.th}>店鋪名稱</th>
                  <th style={styles.th}>類別</th>
                  <th style={styles.th}>聯繫電話</th>
                  <th style={styles.th}>LINE ID</th>
                  <th style={styles.th}>作品集</th>
                  <th style={styles.th}>狀態</th>
                  <th style={styles.th}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      {new Date(app.created_at).toLocaleDateString('zh-TW')}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 800 }}>{app.shop_name}</td>
                    <td style={styles.td}>{app.category}</td>
                    <td style={styles.td}>{app.phone}</td>
                    <td style={styles.td}>{app.line_id || '—'}</td>
                    <td style={styles.td}>
                      {app.ig_link ? (
                        <a href={`https://${app.ig_link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={styles.link}>
                          <ExternalLink size={13} /> 查看
                        </a>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={styles.td}>
                      {app.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            style={styles.btnApprove}
                            disabled={actionLoading === app.id}
                            onClick={() => handleReview(app.id, 'approve')}
                          >
                            {actionLoading === app.id ? '...' : '✓ 核准'}
                          </button>
                          <button
                            style={styles.btnReject}
                            disabled={actionLoading === app.id}
                            onClick={() => handleReview(app.id, 'reject')}
                          >
                            {actionLoading === app.id ? '...' : '✗ 拒絕'}
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#a8a29e', fontSize: 12 }}>
                          已處理
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

// ─── StatCard 子元件 ──────────────────────────────────────────
function StatCard({ title, value, icon, color }: any) {
  return (
    <div style={{ ...styles.card, backgroundColor: color }}>
      <div style={{ marginBottom: 12 }}>{icon}</div>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#fafaf9', color: '#1c1917', fontFamily: 'system-ui' },
  sidebar: { width: 260, backgroundColor: '#1c1917', color: '#fff', padding: 24, flexShrink: 0 },
  logoText: { fontSize: 20, fontWeight: 900, marginBottom: 40, letterSpacing: 1 },
  adminTag: { color: '#fbbf24', fontSize: 12, marginLeft: 4 },
  nav: { display: 'flex', flexDirection: 'column', gap: 8 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', color: '#a8a29e', fontSize: 14, fontWeight: 700, position: 'relative' },
  navActive: { backgroundColor: '#292524', color: '#fff' },
  navBadge: { marginLeft: 'auto', backgroundColor: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 10 },
  main: { flex: 1, padding: 40, overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 16px', borderRadius: 12, border: '1px solid #e7e5e4', gap: 8 },
  searchInput: { border: 'none', outline: 'none', fontSize: 14, width: 220 },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#1c1917', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  statsRow: { display: 'flex', gap: 20, marginBottom: 32 },
  card: { flex: 1, padding: 24, borderRadius: 20, border: '1px solid #e7e5e4' },
  cardTitle: { fontSize: 13, color: '#78716c', marginBottom: 6, fontWeight: 700 },
  cardValue: { fontSize: 32, fontWeight: 900, color: '#1c1917' },
  filterRow: { display: 'flex', gap: 8, marginBottom: 20 },
  filterBtn: { padding: '8px 18px', borderRadius: 20, border: '1.5px solid #e7e5e4', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#78716c' },
  filterBtnActive: { backgroundColor: '#1c1917', color: '#fff', borderColor: '#1c1917' },
  section: { backgroundColor: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e7e5e4' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '2px solid #f5f5f4' },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#78716c', whiteSpace: 'nowrap' },
  tableRow: { borderBottom: '1px solid #f5f5f4' },
  td: { padding: '14px 12px', fontSize: 14, verticalAlign: 'middle' },
  link: { color: '#fbbf24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 },
  btnApprove: { backgroundColor: '#1c1917', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 13 },
  btnReject: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 13 },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 12 },
};