// ════════════════════════════════════════════════════════
//  Smart Farm Admin Dashboard — Layout Shell
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  MOBILE-FIRST — field-accessible from smartphones
// ════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TreePine, FlaskConical, ScanLine,
  Settings, ChevronRight, Bell, Menu, X,
  AlertTriangle, Leaf, Zap, PackageCheck,
  ArrowUpRight, ArrowDownRight, Eye, MoreHorizontal,
  Check, Clock, ShieldAlert, QrCode
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

// ── Navigation config ─────────────────────────────────────
const NAV_ITEMS = [
  { path: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   exact: true },
  { path: '/admin/trees',     icon: TreePine,        label: 'Batch Pohon'   },
  { path: '/admin/fertilize', icon: FlaskConical,    label: 'Jadwal Pupuk'  },
  { path: '/admin/ai-scan',   icon: ScanLine,        label: 'Deteksi AI'    },
  { path: '/admin/settings',  icon: Settings,        label: 'Pengaturan'    },
]

// ── Mock data ─────────────────────────────────────────────
const HEALTH_TREND = [
  { month: 'Mar', healthy: 82, flagged: 3 },
  { month: 'Apr', healthy: 88, flagged: 2 },
  { month: 'Mei', healthy: 85, flagged: 5 },
  { month: 'Jun', healthy: 91, flagged: 2 },
  { month: 'Jul', healthy: 94, flagged: 1 },
  { month: 'Agu', healthy: 89, flagged: 4 },
  { month: 'Sep', healthy: 96, flagged: 1 },
]

const FERTILIZER_SCHEDULE = [
  { id: 'F001', batch: 'Batch-2022-A', trees: 24, type: 'Kompos Kascing',  date: '15 Sep 2026', status: 'scheduled' },
  { id: 'F002', batch: 'Batch-2022-B', trees: 18, type: 'MOL Bonggol',     date: '18 Sep 2026', status: 'scheduled' },
  { id: 'F003', batch: 'Batch-2023-A', trees: 31, type: 'Pupuk Kalium',    date: '10 Sep 2026', status: 'done'      },
  { id: 'F004', batch: 'Batch-2023-B', trees: 15, type: 'Starter Organik', date: '22 Sep 2026', status: 'scheduled' },
]

const AI_ALERTS = [
  { id: 'POM-0031', batch: 'Batch-2022-A', disease: 'HLB / Citrus Greening', confidence: 91.2, time: '2j lalu', severity: 'high'   },
  { id: 'POM-0058', batch: 'Batch-2023-A', disease: 'Kudis Sitrus',           confidence: 78.5, time: '5j lalu', severity: 'medium' },
  { id: 'POM-0012', batch: 'Batch-2022-B', disease: 'Antraknosa',             confidence: 65.1, time: '1h lalu', severity: 'low'    },
]

const TREE_BATCHES = [
  { id: 'Batch-2022-A', count: 24, healthy: 22, flagged: 2, location: 'Blok Utara',   variety: 'Jeruk Bali Merah'  },
  { id: 'Batch-2022-B', count: 18, healthy: 17, flagged: 1, location: 'Blok Timur',   variety: 'Jeruk Bali Putih'  },
  { id: 'Batch-2023-A', count: 31, healthy: 31, flagged: 0, location: 'Blok Selatan', variety: 'Jeruk Bali Merah'  },
  { id: 'Batch-2023-B', count: 15, healthy: 15, flagged: 0, location: 'Blok Barat',   variety: 'Jeruk Bali Merah'  },
]

const STAT_CARDS = [
  { label: 'Total Pohon', value: '88',  sub: '+4 bulan ini',   trend: 'up',   icon: TreePine,    accent: '#7fe030' },
  { label: 'Pohon Sehat', value: '85',  sub: '96.6% sehat',    trend: 'up',   icon: Leaf,        accent: '#5ec412' },
  { label: 'Terdeteksi',  value: '3',   sub: '–1 dari Jul',    trend: 'down', icon: ShieldAlert, accent: '#f83b3b' },
  { label: 'AI Scans',    value: '247', sub: 'scan minggu ini', trend: 'up',   icon: Zap,         accent: '#a855f7' },
]

// ── Animation variants ────────────────────────────────────
const mobileSidebarVariants = {
  hidden: { x: '-100%', opacity: 0.6, transition: { duration: 0.25, ease: 'easeIn' } },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 32 } },
}

const contentVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ── Shared components ─────────────────────────────────────

function PomeloMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="url(#admin-pomelo-grad)" />
      {[0,36,72,108,144,180,216,252,288,324].map((a,i) => (
        <line key={i} x1="32" y1="32"
          x2={32+20*Math.cos(a*Math.PI/180)} y2={32+20*Math.sin(a*Math.PI/180)}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"
        />
      ))}
      <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="32" cy="32" r="5"  fill="rgba(255,255,255,0.2)" />
      <defs>
        <radialGradient id="admin-pomelo-grad" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#ffdb84" />
          <stop offset="50%"  stopColor="#f98208" />
          <stop offset="100%" stopColor="#6e3812" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function StatCard({ stat }) {
  const Icon = stat.icon
  return (
    <motion.div variants={staggerItem} className="glass-card p-4 sm:p-5 relative overflow-hidden group hover:border-[#ffa72020] transition-colors duration-300">
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${stat.accent}10, transparent 60%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          {/* min 44px touch target for icon area */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${stat.accent}15`, border: `1px solid ${stat.accent}25` }}
          >
            <Icon size={18} style={{ color: stat.accent }} />
          </div>
          <div className="flex items-center" style={{ color: stat.trend === 'up' ? '#7fe030' : '#f83b3b' }}>
            {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        </div>
        <div className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0] mb-0.5">{stat.value}</div>
        <div className="font-body text-sm text-[#9e7a50]/80 mb-0.5">{stat.label}</div>
        <div className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50]/50 tracking-wide uppercase">{stat.sub}</div>
      </div>
    </motion.div>
  )
}

function SeverityBadge({ level }) {
  const cfg = {
    high:   { label: 'TINGGI', bg: 'rgba(248,59,59,0.15)',   border: 'rgba(248,59,59,0.3)',   text: '#ff6b6b' },
    medium: { label: 'SEDANG', bg: 'rgba(249,130,8,0.15)',   border: 'rgba(249,130,8,0.3)',   text: '#ffa720' },
    low:    { label: 'RENDAH', bg: 'rgba(127,224,48,0.12)',  border: 'rgba(127,224,48,0.25)', text: '#7fe030' },
  }
  const c = cfg[level]
  return (
    <span className="font-mono text-[8px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-md flex-shrink-0"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      {c.label}
    </span>
  )
}

// ── Sidebar inner content (shared between mobile & desktop) ─
function SidebarContent({ location, onNavClick }) {
  const isActive = (path, exact) => exact
    ? location.pathname === path
    : location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path))

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 sm:py-6 border-b border-white/[0.06] shrink-0">
        <PomeloMark />
        <div>
          <div className="font-display text-base tracking-[0.06em] text-[#ffa720]">POMELO TRACE</div>
          <div className="font-mono text-[8px] text-[#9e7a50] tracking-widest uppercase">Admin Dashboard</div>
        </div>
      </div>

      {/* Farm context chip */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl shrink-0"
        style={{ background: 'rgba(249,130,8,0.07)', border: '1px solid rgba(249,130,8,0.12)' }}
      >
        <div className="font-mono text-[8px] uppercase tracking-widest text-[#9e7a50] mb-0.5">Lokasi Kebun</div>
        <div className="font-body text-sm text-[#dacdb8] font-medium">Desa Bibis, Magetan</div>
        <div className="font-mono text-[8px] text-[#9e7a50]/60 mt-0.5">88 pohon aktif</div>
      </div>

      {/* Navigation — flex-1 + overflow-y-auto for long nav lists */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#9e7a50]/50 px-3 mb-2">
          Menu Utama
        </div>
        {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => {
          const active = isActive(path, exact)
          return (
            <Link
              key={path}
              to={path}
              /* min-h-[48px] for comfortable mobile touch targets */
              className={`sidebar-nav-item min-h-[48px] ${active ? 'active' : ''}`}
              onClick={onNavClick}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ffa720]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User profile — mt-auto pins it to the bottom */}
      <div className="mt-auto p-4 border-t border-white/[0.06] shrink-0">
        {/* min-h-[56px] for touch accessibility */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer min-h-[56px]">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg badge-citrus flex items-center justify-center flex-shrink-0 text-white font-mono text-xs font-bold">
            SW
          </div>
          <div className="min-w-0">
            <div className="font-body text-sm text-[#dacdb8] truncate">Pak Suwanto</div>
            <div className="font-mono text-[8px] text-[#9e7a50]">Petani · Admin</div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Dashboard Overview ────────────────────────────────────
function DashboardOverview() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">

      {/* Welcome heading */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">
          Selamat datang, <span className="shimmer-text">Pak Suwanto</span>
        </h1>
        <p className="font-body text-sm text-[#9e7a50] mt-1.5">
          Ringkasan kebun pomelo Anda — 7 September 2026
        </p>
      </div>

      {/* Stat cards: 1 col mobile → 2 col sm → 4 col xl */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {STAT_CARDS.map(s => <StatCard key={s.label} stat={s} />)}
      </motion.div>

      {/* Charts: single col mobile → 3-col xl */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Health trend area chart */}
        <motion.div variants={staggerItem} className="xl:col-span-2 glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#9e7a50] mb-0.5">Tren Kesehatan</div>
              <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#fdf6f0]">Status Pohon Bulanan</h2>
            </div>
            {/* 44px touch target */}
            <button className="p-2.5 rounded-lg glass-card hover:bg-white/[0.06] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <MoreHorizontal size={14} className="text-[#9e7a50]" />
            </button>
          </div>
          {/* Shorter chart on mobile */}
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={HEALTH_TREND} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <defs>
                <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7fe030" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7fe030" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="flaggedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f83b3b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f83b3b" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#9e7a50' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#9e7a50' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(42,29,22,0.95)', border: '1px solid rgba(255,167,32,0.15)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 11 }}
              />
              <Area type="monotone" dataKey="healthy" stroke="#7fe030" strokeWidth={2} fill="url(#healthyGrad)" name="Sehat" />
              <Area type="monotone" dataKey="flagged" stroke="#f83b3b" strokeWidth={2} fill="url(#flaggedGrad)" name="Terdeteksi" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Batch distribution bars */}
        <motion.div variants={staggerItem} className="glass-card p-4 sm:p-5">
          <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#9e7a50] mb-0.5">Distribusi Batch</div>
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#fdf6f0] mb-4">Per Blok Kebun</h2>
          <div className="space-y-3 sm:space-y-3.5">
            {TREE_BATCHES.map((b, i) => {
              const pct = Math.round((b.healthy / b.count) * 100)
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#dacdb8] truncate mr-2">{b.id}</span>
                    <span className="font-mono text-[10px] flex-shrink-0" style={{ color: pct === 100 ? '#7fe030' : '#ffa720' }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: pct === 100 ? 'linear-gradient(90deg,#5ec412,#7fe030)' : 'linear-gradient(90deg,#f98208,#ffa720)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* AI Alerts */}
      <motion.div variants={staggerItem} className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#9e7a50] mb-0.5">AI MobileNetV2</div>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#fdf6f0]">Peringatan Penyakit</h2>
          </div>
          <Link
            to="/admin/ai-scan"
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#ffa720]/70 hover:text-[#ffa720] transition-colors min-h-[44px] px-2"
          >
            Lihat <ChevronRight size={11} />
          </Link>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {AI_ALERTS.map((a) => (
            <motion.div key={a.id} variants={staggerItem}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl border border-white/[0.05] hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer min-h-[64px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pomelo-900/40 border border-pomelo-700/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={15} className="text-pomelo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="font-mono text-[10px] sm:text-[11px] font-medium text-[#dacdb8]">{a.id}</span>
                  <span className="font-mono text-[8px] text-[#9e7a50] hidden sm:inline">· {a.batch}</span>
                </div>
                <div className="font-body text-sm text-[#fdf6f0]/80 truncate">{a.disease}</div>
                <div className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50]/60 mt-0.5">{a.confidence}% · {a.time}</div>
              </div>
              <SeverityBadge level={a.severity} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fertilizer schedule table */}
      <motion.div variants={staggerItem} className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#9e7a50] mb-0.5">Jadwal Mendatang</div>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#fdf6f0]">Pemupukan Terjadwal</h2>
          </div>
          <Link
            to="/admin/fertilize"
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#ffa720]/70 hover:text-[#ffa720] transition-colors min-h-[44px] px-2"
          >
            Kelola <ChevronRight size={11} />
          </Link>
        </div>
        {/* overflow-x-auto prevents layout break on small screens */}
        <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
          <table className="data-table w-full min-w-[480px]">
            <thead>
              <tr>
                <th>ID</th><th>Batch</th><th>Pohon</th><th>Jenis Pupuk</th><th>Tanggal</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {FERTILIZER_SCHEDULE.map((f) => (
                <tr key={f.id}>
                  <td className="text-[#ffa720]/80">{f.id}</td>
                  <td>{f.batch}</td>
                  <td>{f.trees}</td>
                  <td>{f.type}</td>
                  <td className="whitespace-nowrap">{f.date}</td>
                  <td>
                    {f.status === 'done'
                      ? <span className="flex items-center gap-1.5 text-[#7fe030]"><Check size={11} /> Selesai</span>
                      : <span className="flex items-center gap-1.5 text-[#ffa720]"><Clock size={11} /> Terjadwal</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Batch Pohon Page ──────────────────────────────────────
function TreeBatchesPage() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">Batch Pohon</h1>
          <p className="font-body text-sm text-[#9e7a50] mt-1">Kelola semua batch pohon pomelo aktif</p>
        </div>
        {/* min-h-[44px] touch target */}
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="badge-citrus text-white font-body text-sm px-4 sm:px-5 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0 min-h-[44px]"
        >
          <TreePine size={15} />
          <span className="hidden sm:inline">Tambah Batch</span>
          <span className="sm:hidden">Tambah</span>
        </motion.button>
      </div>

      {/* Responsive grid: 1 col mobile → 2 col md */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
      >
        {TREE_BATCHES.map((b) => {
          const pct = Math.round((b.healthy / b.count) * 100)
          return (
            <motion.div key={b.id} variants={staggerItem}
              className="glass-card p-4 sm:p-5 hover:border-[#ffa72025] active:border-[#ffa72035] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 mr-2">
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-[#9e7a50]">{b.location}</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#fdf6f0] mt-0.5">{b.id}</h3>
                  <p className="font-body text-sm text-[#dacdb8]/60">{b.variety}</p>
                </div>
                <div className={`status-dot mt-2 flex-shrink-0 ${b.flagged > 0 ? 'warning' : 'healthy'}`} />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 pt-3 border-t border-white/[0.06]">
                {[
                  { label: 'Total', val: b.count, color: '#fdf6f0' },
                  { label: 'Sehat', val: b.healthy, color: '#7fe030' },
                  { label: 'Flagged', val: b.flagged, color: b.flagged > 0 ? '#f83b3b' : '#9e7a50' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-heading text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[#9e7a50]">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: pct === 100 ? 'linear-gradient(90deg,#5ec412,#7fe030)' : 'linear-gradient(90deg,#f98208,#ffa720)' }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-end mt-3">
                {/* min-h-[44px] touch target */}
                <button className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#9e7a50] hover:text-[#ffa720] transition-colors min-h-[44px] px-2">
                  <Eye size={11} /> Detail
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

// ── AI Scan Page ──────────────────────────────────────────
function AIScanPage() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div>
        <span className="badge-citrus text-white font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg">
          MobileNetV2 Active
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0] mt-2">Deteksi Penyakit AI</h1>
        <p className="font-body text-sm text-[#9e7a50] mt-1">
          Model AI menganalisis foto daun dari seluruh batch secara real-time
        </p>
      </div>

      {/* Upload zone — full width on mobile, touch-friendly */}
      <motion.div variants={staggerItem}
        className="border-2 border-dashed border-[#ffa720]/20 rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center hover:border-[#ffa720]/40 active:border-[#ffa720]/50 transition-colors cursor-pointer"
        style={{ background: 'rgba(249,130,8,0.03)' }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl badge-citrus flex items-center justify-center mx-auto mb-4">
          <ScanLine size={26} className="text-white" />
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#fdf6f0] mb-2">Upload Foto Daun</h3>
        <p className="font-body text-sm text-[#9e7a50]">Tap untuk memilih foto dari galeri (JPG/PNG)</p>
        <p className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50]/50 mt-2 uppercase tracking-widest">
          Analisis dalam &lt;2 detik
        </p>
      </motion.div>

      {/* Alert list */}
      <div>
        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#9e7a50] mb-3">
          Hasil Deteksi Terbaru
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {AI_ALERTS.map((a) => (
            <motion.div key={a.id} variants={staggerItem}
              className={`glass-card${a.severity === 'high' ? '-danger' : ''} p-4 sm:p-5 flex items-center gap-3 sm:gap-5 min-h-[72px]`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: a.severity === 'high' ? 'rgba(248,59,59,0.15)' : a.severity === 'medium' ? 'rgba(249,130,8,0.12)' : 'rgba(127,224,48,0.10)',
                  border: `1px solid ${a.severity === 'high' ? 'rgba(248,59,59,0.3)' : a.severity === 'medium' ? 'rgba(249,130,8,0.25)' : 'rgba(127,224,48,0.2)'}`,
                }}
              >
                <AlertTriangle size={18} style={{ color: a.severity === 'high' ? '#ff6b6b' : a.severity === 'medium' ? '#ffa720' : '#7fe030' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-mono text-sm font-medium text-[#dacdb8]">{a.id}</span>
                  <span className="font-mono text-[9px] text-[#9e7a50] hidden sm:inline">{a.batch}</span>
                </div>
                <div className="font-body text-sm text-[#fdf6f0]/90 truncate">{a.disease}</div>
                <div className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50]/60 mt-0.5">
                  Confidence: <span style={{ color: a.severity === 'high' ? '#ff6b6b' : '#ffa720' }}>{a.confidence}%</span>
                  {' · '}{a.time}
                </div>
              </div>
              <SeverityBadge level={a.severity} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Placeholder Page ──────────────────────────────────────
function PlaceholderPage({ title, icon: Icon }) {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible"
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 glass-card-warm rounded-3xl flex items-center justify-center mb-6">
        <Icon size={28} className="text-[#ffa720]" />
      </div>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0] mb-3">{title}</h1>
      <p className="font-body text-sm text-[#9e7a50] max-w-xs">
        Halaman ini sedang dalam pengembangan. Segera hadir dengan fitur lengkap.
      </p>
    </motion.div>
  )
}

// ── Main Admin Dashboard Shell ────────────────────────────
export default function AdminDashboard() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications] = useState(3)

  // Close sidebar on route change (mobile nav)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Close sidebar on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const sidebarBg = {
    background: 'linear-gradient(180deg, rgba(42,29,22,0.98) 0%, rgba(24,11,4,0.98) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(160deg, #180b04 0%, #2c1508 60%, #180b04 100%)' }}
    >

      {/* ══ DESKTOP SIDEBAR — always visible on lg+, pure CSS, no JS ══ */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0"
        style={sidebarBg}
      >
        <SidebarContent location={location} onNavClick={closeSidebar} />
      </aside>

      {/* ══ MOBILE SIDEBAR — AnimatePresence overlay ══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSidebar}
            />
            {/* Drawer */}
            <motion.aside
              key="mobile-sidebar"
              className="fixed top-0 left-0 h-screen w-[280px] sm:w-64 z-50 flex flex-col lg:hidden"
              style={sidebarBg}
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-lg glass-card flex items-center justify-center z-10 hover:bg-white/[0.08] transition-colors"
                onClick={closeSidebar}
                aria-label="Tutup menu"
              >
                <X size={16} className="text-[#9e7a50]" />
              </button>
              <SidebarContent location={location} onNavClick={closeSidebar} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══ MAIN CONTENT AREA ══ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Sticky top bar ── */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
          style={{
            background: 'rgba(24,11,4,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Hamburger — visible only on mobile/tablet */}
          <button
            id="mobile-menu-btn"
            className="lg:hidden p-2.5 rounded-lg glass-card hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={18} className="text-[#dacdb8]" />
          </button>

          {/* Breadcrumb — desktop only */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#9e7a50]">
            <span>Pomelo Trace</span>
            <ChevronRight size={11} />
            <span className="text-[#dacdb8]">
              {NAV_ITEMS.find(n =>
                n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path)
              )?.label ?? 'Dashboard'}
            </span>
          </div>

          {/* Mobile page title */}
          <div className="lg:hidden font-heading text-lg text-[#fdf6f0] ml-3">
            {NAV_ITEMS.find(n =>
              n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path)
            )?.label ?? 'Dashboard'}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Notification bell */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
              className="relative p-2.5 rounded-lg glass-card hover:bg-white/[0.06] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              id="notifications-btn"
              aria-label={`${notifications} notifikasi`}
            >
              <Bell size={16} className="text-[#9e7a50]" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-pomelo-500 flex items-center justify-center font-mono text-[8px] text-white font-bold"
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>

            {/* Public page link — hidden on very small screens */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#9e7a50] glass-card px-3 py-2.5 rounded-xl hover:text-[#ffa720] hover:bg-[#ffa72010] transition-all duration-200 min-h-[44px]"
            >
              <QrCode size={13} />
              <span className="hidden md:inline">Halaman Publik</span>
            </a>
          </div>
        </header>

        {/* ── Page content — scrollable ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index            element={<DashboardOverview />} />
              <Route path="trees"     element={<TreeBatchesPage />} />
              <Route path="fertilize" element={<PlaceholderPage title="Jadwal Pupuk" icon={FlaskConical} />} />
              <Route path="ai-scan"   element={<AIScanPage />} />
              <Route path="settings"  element={<PlaceholderPage title="Pengaturan" icon={Settings} />} />
              <Route path="*"         element={<Navigate to="/admin" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
