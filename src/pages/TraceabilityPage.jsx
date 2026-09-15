// ════════════════════════════════════════════════════════
//  Traceability Page — Public QR Scan Result
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  Theme v2: Warm Canvas × Forest Green × Coral
// ════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTraceabilityData } from '../services/treeService'
import {
  Leaf, Droplets, FlaskConical, PackageCheck, ShieldCheck,
  ShieldX, MapPin, CalendarDays, Sprout, Zap, AlertTriangle,
  ChevronDown, ExternalLink, QrCode, Info, Clock, CheckCircle2,
  Search
} from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────
const HEALTHY_TREE = {
  id: 'POM-BBS-0047',
  variety: 'Jeruk Bali Merah',
  location: 'Desa Bibis, Magetan',
  coordinates: '7°37\'42"S 111°26\'18"E',
  planted: '12 Maret 2022',
  farmer: 'Pak Suwanto',
  batch: 'Batch-2022-A',
  certifiedOrganic: true,
  aiConfidence: 98.4,
  lastScanned: '7 Sep 2026',
  harvestDate: 'Oktober 2026',
  timeline: [
    {
      id: 'seed', icon: Sprout, phase: 'Pembibitan', label: 'Bibit Ditanam',
      date: '12 Mar 2022',
      detail: 'Bibit varietas Jeruk Bali Merah dari persemaian bersertifikat. Media: campuran tanah liat + kompos organik.',
      accent: '#2d6a4f', bg: '#eef7f1', borderColor: '#b7e4c7',
    },
    {
      id: 'water', icon: Droplets, phase: 'Irigasi', label: 'Program Irigasi Tetes',
      date: 'Apr 2022 – kini',
      detail: 'Irigasi tetes otomatis 2× sehari. Volume: 4L/pohon/hari. Sumber: mata air alami Gunung Lawu.',
      accent: '#1d6f8e', bg: '#f0f7fb', borderColor: '#b3dbed',
    },
    {
      id: 'fertilize', icon: FlaskConical, phase: 'Pemupukan', label: 'Jadwal Pupuk Organik',
      date: 'Setiap 3 Bulan',
      detail: 'Pupuk kompos kascing + fermentasi MOL bonggol pisang. Dosis: 2kg/aplikasi. Terakhir: 15 Agustus 2026.',
      accent: '#a16207', bg: '#fffbeb', borderColor: '#fde68a',
      entries: [
        { date: 'Mar 2022', type: 'Starter Organik', dose: '1.5 kg' },
        { date: 'Jun 2022', type: 'Kompos Kascing', dose: '2.0 kg' },
        { date: 'Sep 2022', type: 'MOL Bonggol', dose: '1.5 L cair' },
        { date: 'Des 2022', type: 'Kompos Kascing', dose: '2.0 kg' },
        { date: 'Agu 2026', type: 'Pupuk Kalium Org.', dose: '2.0 kg' },
      ],
    },
    {
      id: 'ai', icon: Zap, phase: 'Pemeriksaan AI', label: 'Deteksi MobileNetV2',
      date: '5 Sep 2026',
      detail: 'Model AI MobileNetV2 menganalisis foto daun. Tidak ada indikasi penyakit HLB, kudis, atau antraknosa.',
      accent: '#6d28d9', bg: '#f5f3ff', borderColor: '#ddd6fe',
    },
    {
      id: 'harvest', icon: PackageCheck, phase: 'Panen', label: 'Target Panen',
      date: 'Oktober 2026',
      detail: 'Estimasi bobot buah: 1.2–1.8 kg/buah. Distribusi ke pasar lokal Magetan dan Surabaya.',
      accent: '#1b4332', bg: '#eef7f1', borderColor: '#b7e4c7',
    },
  ],
}

const DISEASED_TREE = {
  ...HEALTHY_TREE,
  id: 'POM-BBS-0031', aiConfidence: 91.2, flagged: true,
  flagReason: 'Terdeteksi gejala Huanglongbing (HLB) / Citrus Greening Disease. Pohon ini tidak boleh dipanen atau diperdagangkan.',
  flagDetail: 'Model AI MobileNetV2 mendeteksi pola daun "blotchy mottle" dan ukuran buah asimetris pada 3 dari 7 sampel foto. Confidence: 91.2%.',
}

// ── Variants ──────────────────────────────────────────────
const pageV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, staggerChildren: 0.07 } },
}
const itemV = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const cardV = {
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const dangerV = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
}

// ── Pomelo SVG (cross-section) ───────────────────────────
function PomeloSVG({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="url(#pg)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
        <line key={i} x1="32" y1="32"
          x2={32 + 21 * Math.cos(a * Math.PI / 180)} y2={32 + 21 * Math.sin(a * Math.PI / 180)}
          stroke="rgba(255,255,255,0.22)" strokeWidth="1"
        />
      ))}
      <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="32" cy="32" r="6" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="48" cy="14" rx="6" ry="10" fill="url(#lg)" transform="rotate(-40 48 14)" />
      <line x1="48" y1="14" x2="43" y2="23" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <defs>
        <radialGradient id="pg" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffa0a8" />
          <stop offset="40%" stopColor="#e84f6b" />
          <stop offset="100%" stopColor="#8b1c2a" />
        </radialGradient>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5ec412" />
          <stop offset="100%" stopColor="#1b4332" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── AI Confidence Arc ─────────────────────────────────────
function AIArc({ value, isDiseased }) {
  const color = isDiseased ? '#c25c52' : '#2d6a4f'
  const trackC = isDiseased ? '#faeae8' : '#eef7f1'
  const r = 34
  const circ = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute">
        <circle cx="50" cy="50" r={r} fill="none" stroke={trackC} strokeWidth="7" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - value / 100) }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.8 }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="text-center z-10">
        <motion.span
          className="block font-mono text-lg sm:text-xl font-bold"
          style={{ color }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        >
          {value}%
        </motion.span>
        <span className="block font-mono text-xs uppercase tracking-wider mt-0.5 font-bold" style={{ color: '#78716c' }}>
          AI Score
        </span>
      </div>
    </div>
  )
}

const TIMELINE_ICONS = {
  seed: Sprout,
  water: Droplets,
  fertilize: FlaskConical,
  ai: Zap,
  harvest: PackageCheck,
}

// ── Timeline Entry ─────────────────────────────────────────
function TimelineEntry({ item, index, totalItems = 5 }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = item.icon || TIMELINE_ICONS[item.id] || Leaf
  const isLast = index === totalItems - 1

  return (
    <motion.div variants={itemV} className="relative flex gap-4">
      {!isLast && (
        <div className="absolute left-[20px] sm:left-[24px] top-11 sm:top-12 bottom-0 w-[2px] timeline-line" style={{ minHeight: 36 }} />
      )}

      <div className="flex-shrink-0 z-10">
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
          style={{ background: item.bg || '#eef7f1', border: `1.5px solid ${item.borderColor || '#b7e4c7'}` }}
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.18 }}
        >
          <Icon size={17} style={{ color: item.accent || '#2d6a4f' }} />
        </motion.div>
      </div>

      <div className="flex-1 min-w-0 pb-7">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <span className="font-mono text-xs uppercase tracking-wider font-bold" style={{ color: item.accent }}>
              {item.phase}
            </span>
            <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-tight mt-0.5">
              {item.label}
            </h3>
          </div>
          <span className="font-sans text-xs text-stone-900 font-bold bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 flex-shrink-0 mt-1 whitespace-nowrap">
            {item.date}
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">{item.detail}</p>

        {item.entries && (
          <>
            <button
              id={`expand-${item.id}`}
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider min-h-[36px] font-bold transition-colors"
              style={{ color: item.accent }}
            >
              <ChevronDown size={14} className="transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
              {expanded ? 'Sembunyikan' : 'Lihat riwayat lengkap'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl overflow-hidden border border-stone-200 overflow-x-auto">
                    <table className="data-table w-full min-w-[280px]">
                      <thead>
                        <tr>
                          <th>Tanggal</th><th>Jenis Pupuk</th><th>Dosis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.entries.map((e, i) => (
                          <tr key={i}>
                            <td>{e.date}</td>
                            <td>{e.type}</td>
                            <td style={{ color: item.accent, fontWeight: 500 }}>{e.dose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Disease Banner ─────────────────────────────────────────
function DiseaseBanner({ tree }) {
  return (
    <motion.div variants={dangerV} className="card-coral p-4 sm:p-5 mb-5 sm:mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-coral-600 to-red-400 rounded-t-xl pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #c25c52, #ef4444)' }}
      />
      <div className="flex gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <motion.div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: '#faeae8', border: '1.5px solid #f0b8b3' }}
            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShieldX size={20} style={{ color: '#c25c52' }} />
          </motion.div>
        </div>
        <div className="min-w-0">
          <span className="badge-coral mb-2">⚠ Akses Ditolak — Terdeteksi Penyakit</span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 mt-2 mb-1.5 leading-tight">
            Pohon Ini Tidak Dapat Diperdagangkan
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">{tree.flagReason}</p>
          <div className="mt-3 bg-white border border-stone-200 p-3 rounded-xl">
            <div className="flex items-start gap-2">
              <Info size={12} style={{ color: '#c25c52' }} className="mt-0.5 flex-shrink-0" />
              <p className="font-mono text-[9px] text-stone-500 leading-relaxed">{tree.flagDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Loading Screen ─────────────────────────────────────────
function LoadingScreen() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-canvas-base"
      style={{ background: '#f9f8f5' }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} className="mb-5">
        <PomeloSVG size={52} />
      </motion.div>
      <div className="font-display text-xl sm:text-2xl tracking-[0.1em] text-forest-800">
        MEMVERIFIKASI
      </div>
      <div className="flex gap-1.5 mt-3">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-forest-600"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="font-mono text-[10px] text-stone-400 mt-2 tracking-widest uppercase">AI Blockchain Scan</div>
    </motion.div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function TraceabilityPage({ treeStatus = 'healthy' }) {
  const { treeId } = useParams()
  const isDiseasedParam = treeStatus === 'diseased'
  const [tree, setTree] = useState(isDiseasedParam ? DISEASED_TREE : HEALTHY_TREE)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(treeId || '')

  useEffect(() => {
    let isMounted = true
    const identifier = treeId || (treeStatus === 'diseased' ? 'diseased' : 'healthy')

    fetchTraceabilityData(identifier)
      .then((data) => {
        if (isMounted && data) {
          setTree(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setTree(treeStatus === 'diseased' ? DISEASED_TREE : HEALTHY_TREE)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [treeId, treeStatus])

  const isDiseased = tree?.flagged || treeStatus === 'diseased'

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isDiseased ? 'qr-page-bg-diseased' : 'qr-page-bg'}`}
      style={{
        background: isDiseased
          ? 'radial-gradient(ellipse 60% 40% at 50% -5%, #faeae8, transparent 65%), #f9f8f5'
          : undefined
      }}
    >
      <AnimatePresence>
        {loading ? <LoadingScreen key="loader" /> : (

          <motion.div
            key="content" variants={pageV} initial="hidden" animate="visible"
            className="relative w-full max-w-lg mx-auto px-4 sm:px-5 pt-6 pb-20"
          >

            {/* ── Top bar ── */}
            <motion.div variants={itemV} className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10">
                  <PomeloSVG size={40} />
                </div>
                <div>
                  <div className="font-display text-sm sm:text-base tracking-[0.08em] text-forest-800 font-bold">POMELO TRACE</div>
                  <div className="font-mono text-[8px] sm:text-[9px] text-stone-500 tracking-widest uppercase font-semibold">Desa Bibis · Magetan</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`status-dot ${isDiseased ? 'danger' : 'healthy'}`} />
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-700 font-bold">
                  {isDiseased ? 'Flagged / Ditolak' : 'Verified AI'}
                </span>
              </div>
            </motion.div>

            {/* ── Public Search / Lookup Bar ── */}
            <motion.div variants={itemV} className="bg-white border border-stone-200 rounded-2xl p-3 mb-5 shadow-xs space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchInput.trim()) {
                    window.location.href = `/trace/${encodeURIComponent(searchInput.trim())}`
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Scan / Masukkan Batch ID atau Kode Pohon..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 text-xs font-mono font-semibold focus:outline-none focus:border-forest-700"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-forest-800 hover:bg-forest-700 text-white font-mono text-xs font-bold px-3.5 py-2 rounded-xl flex-shrink-0 transition-colors shadow-xs"
                >
                  Cari
                </button>
              </form>

              {/* Quick Presets from Backend */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 font-mono text-[10px]">
                <span className="text-stone-400 font-semibold flex-shrink-0">Contoh:</span>
                <a
                  href="/trace/BATCH-BBS001-20260315"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex-shrink-0 font-bold transition-colors"
                >
                  ✓ [Batch] BATCH-BBS001 (Sehat)
                </a>
                <a
                  href="/trace/BATCH-SICK-20260320"
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex-shrink-0 font-bold transition-colors"
                >
                  ⚠ [Batch] BATCH-SICK (Karantina)
                </a>
                <a
                  href="/trace/PHN-BBS-001"
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md flex-shrink-0 font-semibold transition-colors"
                >
                  🌳 [ID Pohon] PHN-BBS-001
                </a>
              </div>
            </motion.div>

            {/* ── Disease warning ── */}
            {isDiseased && <DiseaseBanner tree={tree} />}

            {/* ── Hero identity card ── */}
            <motion.div variants={cardV} className={`card${isDiseased ? '-coral' : '-forest'} p-4 sm:p-6 mb-4 sm:mb-5`}>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Stamp */}
                <div className="authentic-stamp w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center flex-shrink-0 p-1"
                  style={{ borderColor: isDiseased ? '#f0b8b3' : '#b7e4c7' }}
                >
                  <PomeloSVG size={56} />
                </div>

                <div className="flex-1 min-w-0">
                  {isDiseased
                    ? <span className="badge-coral">Terdeteksi Sakit</span>
                    : <span className="badge-forest">✓ Organik Tersertifikasi</span>
                  }
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold leading-tight mt-2"
                    style={{ color: isDiseased ? '#9b2226' : '#1c1917' }}
                  >
                    {tree.variety}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1.5 text-stone-600">
                    <MapPin size={10} className="flex-shrink-0 text-stone-500" />
                    <span className="font-mono text-[9px] sm:text-[10px] truncate">{tree.location}</span>
                  </div>
                  <div className="font-mono text-[8px] text-stone-500 mt-0.5 hidden sm:block">
                    {tree.coordinates}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100">
                {[
                  { label: 'ID Pohon', value: tree.id, Icon: QrCode },
                  { label: 'Petani', value: tree.farmer, Icon: Leaf },
                  { label: 'Batch', value: tree.batch, Icon: PackageCheck },
                ].map(s => (
                  <div key={s.label} className="text-center px-1">
                    <s.Icon size={13} className="mx-auto mb-1 text-stone-500" />
                    <div className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.1em] text-stone-500 mb-0.5 font-medium">{s.label}</div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-stone-700 truncate font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── AI Confidence card ── */}
            <motion.div variants={cardV} className="card p-4 sm:p-5 mb-4 sm:mb-5 flex items-center gap-4">
              <AIArc value={tree.aiConfidence} isDiseased={isDiseased} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-stone-500 mb-1 font-semibold">
                  Analisis AI — MobileNetV2
                </div>
                <h2 className="font-heading text-base sm:text-lg font-semibold leading-tight"
                  style={{ color: isDiseased ? '#c25c52' : '#1b4332' }}
                >
                  {isDiseased ? 'Penyakit HLB Terdeteksi' : 'Pohon Sehat & Bebas Penyakit'}
                </h2>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                  {isDiseased
                    ? 'Distribusi diblokir otomatis. Notifikasi dikirim ke Dinas Pertanian.'
                    : 'Tidak ada patogen pada 7 sampel foto daun terbaru.'}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock size={9} className="text-stone-400 flex-shrink-0" />
                  <span className="font-mono text-[8px] sm:text-[9px] text-stone-500 font-medium">Scan: {tree.lastScanned}</span>
                </div>
              </div>
            </motion.div>

            {/* ── Section divider ── */}
            {!isDiseased && (
              <motion.div variants={itemV} className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-stone-300" />
                  <span className="font-display text-[9px] sm:text-[10px] tracking-[0.2em] text-stone-500 px-2 whitespace-nowrap font-semibold">
                    TANAH KE MEJA
                  </span>
                  <div className="h-px flex-1 bg-stone-300" />
                </div>
              </motion.div>
            )}

            {/* ── Timeline ── */}
            {!isDiseased && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {tree.timeline?.map((item, i) => (
                  <TimelineEntry key={item.id || i} item={item} index={i} totalItems={tree.timeline?.length || 5} />
                ))}
              </motion.div>
            )}

            {/* ── Harvest card ── */}
            {!isDiseased && (
              <motion.div variants={cardV} className="card-sage p-4 sm:p-5 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0"
                    style={{ background: '#1b4332', minHeight: 'auto', padding: 0 }}
                  >
                    <CalendarDays size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold">Target Panen</div>
                    <div className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-forest-900">{tree.harvestDate}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Footer ── */}
            <motion.div variants={itemV} className="mt-8 sm:mt-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isDiseased
                  ? <ShieldX size={13} style={{ color: '#c25c52' }} />
                  : <ShieldCheck size={13} style={{ color: '#2d6a4f' }} />
                }
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-stone-500 font-semibold">
                  {isDiseased ? 'Diblokir oleh Sistem AI' : 'Diverifikasi oleh Sistem AI'}
                </span>
              </div>
              <div className="font-mono text-[8px] text-stone-500 font-medium">
                Pomelo Trace · © 2026 Desa Bibis Digital Farm
              </div>
              <a href="/admin"
                className="inline-flex items-center justify-center gap-1.5 mt-4 font-mono text-[9px] uppercase tracking-wider text-stone-500 hover:text-forest-800 transition-colors duration-200 min-h-[44px] px-4 font-semibold"
              >
                Admin Panel <ExternalLink size={9} />
              </a>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
