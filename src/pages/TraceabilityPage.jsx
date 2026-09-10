// ════════════════════════════════════════════════════════
//  Traceability Page — Public QR Scan Result
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  MOBILE-FIRST — optimised for smartphone QR scanning
// ════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Leaf, Droplets, FlaskConical, PackageCheck, ShieldCheck,
  ShieldX, MapPin, CalendarDays, Sprout, Zap, AlertTriangle,
  ChevronDown, ExternalLink, QrCode, Info, Clock, Printer, Share2
} from 'lucide-react'
import { fetchTraceabilityData } from '../services/treeService'

// ── Animation variants ────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const cardVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const dangerVariants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
}

// ── Pomelo SVG ────────────────────────────────────────────
function PomeloSVGIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="url(#pomelo-grad)" opacity="0.9" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
        <line key={i} x1="32" y1="32"
          x2={32 + 22 * Math.cos((angle * Math.PI) / 180)}
          y2={32 + 22 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1"
        />
      ))}
      <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="32" cy="32" r="6"  fill="rgba(255,255,255,0.15)" />
      <ellipse cx="50" cy="14" rx="7" ry="12" fill="url(#leaf-grad)" transform="rotate(-40 50 14)" />
      <line x1="50" y1="14" x2="44" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <defs>
        <radialGradient id="pomelo-grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#ff8fa0" />
          <stop offset="40%"  stopColor="#f83b3b" />
          <stop offset="100%" stopColor="#8b1c1c" />
        </radialGradient>
        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7fe030" />
          <stop offset="100%" stopColor="#2c5e10" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── AI Confidence Arc Meter ───────────────────────────────
function AIConfidenceMeter({ value, isDiseased }) {
  const color = isDiseased ? '#f83b3b' : '#7fe030'
  const r = 34
  const circumference = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
      <svg
        width="100%" height="100%"
        viewBox="0 0 100 100"
        className="absolute"
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 1.0 }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="text-center z-10">
        <motion.span
          className="block font-mono text-lg sm:text-xl font-medium"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {value}%
        </motion.span>
        <span className="block font-mono text-[8px] uppercase tracking-widest opacity-50 mt-0.5">
          AI Score
        </span>
      </div>
    </div>
  )
}

const PHASE_ICONS = {
  seed: Sprout,
  water: Droplets,
  fertilize: FlaskConical,
  ai: Zap,
  harvest: PackageCheck
}

// ── Timeline Entry ────────────────────────────────────────
function TimelineEntry({ item, index, totalItems }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = PHASE_ICONS[item.id] || Leaf

  const isLast = index === totalItems - 1

  return (
    <motion.div variants={itemVariants} className="relative flex gap-4">
      {/* Vertical connector */}
      {!isLast && (
        <div
          className="absolute left-[22px] sm:left-[27px] top-12 sm:top-14 bottom-0 w-[2px] timeline-line"
          style={{ minHeight: 40 }}
        />
      )}

      {/* Icon node — min 44px touch area on mobile */}
      <div className="flex-shrink-0 relative z-10">
        <motion.div
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: item.bgAccent,
            border: `1px solid ${item.accent}30`,
            boxShadow: `0 4px 20px ${item.accent}20`,
          }}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.06, boxShadow: `0 6px 28px ${item.accent}40` }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={18} style={{ color: item.accent }} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-7">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em]" style={{ color: item.accent }}>
              {item.phase}
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-[#fdf6f0] leading-tight mt-0.5">
              {item.label}
            </h3>
          </div>
          <span className="font-mono text-[9px] text-[#9e7a50] bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 flex-shrink-0 mt-1 whitespace-nowrap">
            {item.date}
          </span>
        </div>
        <p className="font-body text-sm text-[#dacdb8]/70 leading-relaxed">{item.detail}</p>

        {/* Fertilizer history toggle */}
        {item.entries && (
          <>
            {/* min-h-[44px] for touch target */}
            <button
              id={`expand-${item.id}`}
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider min-h-[36px] no-print"
              style={{ color: item.accent }}
            >
              <ChevronDown
                size={13}
                className="transition-transform duration-300"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
              {expanded ? 'Sembunyikan' : 'Lihat riwayat lengkap'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {/* overflow-x-auto prevents horizontal overflow on narrow screens */}
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/[0.06] overflow-x-auto">
                    <table className="data-table w-full min-w-[280px]">
                      <thead>
                        <tr style={{ background: 'rgba(249,130,8,0.06)' }}>
                          <th>Tanggal</th>
                          <th>Jenis Pupuk</th>
                          <th>Dosis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.entries.map((e, i) => (
                          <tr key={i}>
                            <td>{e.date}</td>
                            <td>{e.type}</td>
                            <td style={{ color: item.accent }}>{e.dose}</td>
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

// ── Disease Warning Banner ────────────────────────────────
function DiseasedWarningBanner({ tree }) {
  return (
    <motion.div
      variants={dangerVariants}
      className="glass-card-danger p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #f83b3b, transparent 70%)', animation: 'danger-pulse 2s ease-in-out infinite' }}
      />
      <div className="relative z-10 flex gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <motion.div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pomelo-900/60 border border-pomelo-500/40 flex items-center justify-center"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShieldX size={22} className="text-pomelo-400" />
          </motion.div>
        </div>
        <div className="min-w-0">
          <span className="badge-danger text-white font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] px-2 sm:px-2.5 py-1 rounded-lg inline-block">
            ⚠ Akses Ditolak — Terdeteksi Penyakit
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-pomelo-300 mt-2 mb-1.5 leading-tight">
            Pohon Ini Tidak Dapat Diperdagangkan
          </h3>
          <p className="font-body text-sm text-pomelo-200/70 leading-relaxed">{tree.flagReason}</p>
          <div className="mt-3 glass-card p-3 rounded-xl">
            <div className="flex items-start gap-2">
              <Info size={12} className="text-pomelo-400 mt-0.5 flex-shrink-0" />
              <p className="font-mono text-[9px] text-pomelo-200/60 leading-relaxed">{tree.flagDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function TraceabilityPage({ treeStatus = 'healthy' }) {
  const isDiseased = treeStatus === 'diseased'
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchTraceabilityData(treeStatus).then((data) => {
      if (isMounted) {
        setTree(data)
        setTimeout(() => setLoading(false), 400)
      }
    })
    return () => { isMounted = false }
  }, [treeStatus])

  if (!tree && !loading) return null


  return (
    <div className="min-h-screen qr-hero-bg relative overflow-x-hidden">

      {/* Decorative orbs — smaller on mobile */}
      <div
        className="citrus-orb w-56 h-56 sm:w-96 sm:h-96 -top-16 -right-16 sm:-top-24 sm:-right-24 opacity-25 sm:opacity-30"
        style={{ background: isDiseased ? 'radial-gradient(circle,#f83b3b,transparent)' : 'radial-gradient(circle,#ffa720,transparent)' }}
      />
      <div
        className="citrus-orb w-40 h-40 sm:w-64 sm:h-64 bottom-24 -left-10 sm:-left-16 opacity-15 sm:opacity-20"
        style={{ background: 'radial-gradient(circle,#5ec412,transparent)', animationDelay: '3s' }}
      />

      <AnimatePresence>
        {loading ? (
          /* ─ Loading screen ─ */
          <motion.div
            key="loader"
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{ background: 'linear-gradient(160deg,#180b04 0%,#2c1508 100%)' }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 sm:w-16 sm:h-16 mb-5"
            >
              <PomeloSVGIcon size={64} />
            </motion.div>
            <div className="font-display text-xl sm:text-2xl tracking-[0.1em] text-[#ffa720]/80">MEMVERIFIKASI...</div>
            <div className="font-mono text-xs text-[#9e7a50] mt-2 tracking-widest">AI BLOCKCHAIN SCAN</div>
          </motion.div>
        ) : (
          /* ─ Main content ─ */
          <motion.div
            key="content"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            /* Mobile-first: px-4 default, wider on sm+ */
            className="relative w-full max-w-lg mx-auto px-4 sm:px-5 pt-6 pb-20 sm:py-8 sm:pb-24"
          >

            {/* ── Top bar ── */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                {/* Smaller icon on mobile */}
                <div className="w-10 h-10 sm:w-auto sm:h-auto">
                  <PomeloSVGIcon size={40} />
                </div>
                <div>
                  <div className="font-display text-sm sm:text-base tracking-[0.08em] text-[#ffa720]">POMELO TRACE</div>
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50] tracking-widest">DESA BIBIS · MAGETAN</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`status-dot ${isDiseased ? 'danger' : 'healthy'}`} />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#9e7a50]">
                  {isDiseased ? 'FLAGGED' : 'VERIFIED'}
                </span>
              </div>
            </motion.div>

            {/* ── Disease warning ── */}
            {isDiseased && <DiseasedWarningBanner tree={tree} />}

            {/* ── Hero identity card ── */}
            <motion.div variants={cardVariants} className={`glass-card${isDiseased ? '-danger' : '-warm'} p-4 sm:p-6 mb-5 sm:mb-6`}>
              {/* Stack vertically on very small screens, row on sm+ */}
              <div className="flex flex-col xs:flex-row sm:flex-row items-start gap-4 sm:gap-5">
                <div
                  className={`authentic-stamp w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0`}
                  style={{ borderColor: isDiseased ? 'rgba(248,59,59,0.3)' : 'rgba(255,167,32,0.3)' }}
                >
                  <PomeloSVGIcon size={52} />
                </div>
                <div className="flex-1 min-w-0">
                  {isDiseased ? (
                    <span className="badge-danger text-white font-mono text-[8px] uppercase tracking-[0.14em] px-2 py-1 rounded-lg">
                      Terdeteksi Sakit
                    </span>
                  ) : (
                    <span className="badge-lime text-white font-mono text-[8px] uppercase tracking-[0.14em] px-2 py-1 rounded-lg">
                      ✓ Organik Tersertifikasi
                    </span>
                  )}
                  <h1
                    className="font-heading text-2xl sm:text-3xl font-bold leading-tight mt-2"
                    style={{ color: isDiseased ? '#ffa0a0' : '#fdf6f0' }}
                  >
                    {tree.variety}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[#9e7a50]">
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="font-mono text-[9px] sm:text-[10px] truncate">{tree.location}</span>
                  </div>
                  <div className="font-mono text-[8px] text-[#9e7a50]/60 mt-0.5 hidden sm:block">
                    {tree.coordinates}
                  </div>
                </div>
              </div>

              {/* Stats row — 3 equal columns, truncate prevents overflow */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 border-t border-white/[0.06]">
                {[
                  { label: 'ID Pohon', value: tree.id,      Icon: QrCode      },
                  { label: 'Petani',   value: tree.farmer,  Icon: Leaf        },
                  { label: 'Batch',    value: tree.batch,   Icon: PackageCheck },
                ].map((stat) => (
                  <div key={stat.label} className="text-center px-1">
                    <stat.Icon size={13} className="mx-auto mb-1 text-[#9e7a50]" />
                    <div className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.1em] text-[#9e7a50] mb-0.5">{stat.label}</div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-[#dacdb8] truncate">{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── AI Confidence card ── */}
            <motion.div variants={cardVariants} className="glass-card p-4 sm:p-5 mb-5 sm:mb-6 flex items-center gap-4 sm:gap-5">
              <AIConfidenceMeter value={tree.aiConfidence} isDiseased={isDiseased} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-[#9e7a50] mb-1">
                  Analisis AI — MobileNetV2
                </div>
                <h2 className="font-heading text-base sm:text-lg font-semibold text-[#fdf6f0] leading-tight">
                  {isDiseased ? 'Penyakit HLB Terdeteksi' : 'Pohon Sehat & Bebas Penyakit'}
                </h2>
                <p className="font-body text-xs text-[#dacdb8]/60 mt-1 leading-relaxed line-clamp-2">
                  {isDiseased
                    ? 'Distribusi diblokir otomatis. Notifikasi ke Dinas Pertanian.'
                    : 'Tidak ada patogen pada 7 sampel foto daun terbaru.'}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock size={9} className="text-[#9e7a50] flex-shrink-0" />
                  <span className="font-mono text-[8px] sm:text-[9px] text-[#9e7a50]">Scan: {tree.lastScanned}</span>
                </div>
              </div>
            </motion.div>

            {/* ── Section divider ── */}
            {!isDiseased && (
              <motion.div variants={itemVariants} className="mb-5 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ffa72030] to-transparent" />
                  <span className="font-display text-[9px] sm:text-xs tracking-[0.18em] sm:tracking-[0.2em] text-[#ffa720]/70 px-2 sm:px-3 whitespace-nowrap">
                    TANAH KE MEJA
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#ffa72030] to-transparent" />
                </div>
              </motion.div>
            )}

            {/* ── Timeline ── */}
            {!isDiseased && tree?.timeline && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
                {tree.timeline.map((item, i) => (
                  <TimelineEntry key={item.id} item={item} index={i} totalItems={tree.timeline.length} />
                ))}
              </motion.div>
            )}

            {/* ── Harvest card ── */}
            {!isDiseased && tree?.harvestDate && (
              <motion.div variants={cardVariants} className="glass-card-warm p-4 sm:p-5 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl badge-citrus flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-[#f98208]">Target Panen</div>
                    <div className="font-heading text-xl sm:text-2xl font-semibold text-[#fdf6f0]">{tree.harvestDate}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Print / Save Action Bar ── */}
            <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-3 no-print">
              <button
                onClick={() => window.print()}
                className="badge-citrus text-white font-mono text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <Printer size={14} /> Cetak / Simpan Kartu
              </button>
            </motion.div>

            {/* ── Footer ── */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isDiseased
                  ? <ShieldX size={13} className="text-pomelo-500" />
                  : <ShieldCheck size={13} className="text-lime-500" />
                }
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-[#9e7a50]">
                  {isDiseased ? 'Diblokir oleh Sistem AI' : 'Diverifikasi oleh Sistem AI'}
                </span>
              </div>
              <div className="font-mono text-[8px] text-[#9e7a50]/50">
                Pomelo Trace · © 2026 Desa Bibis Digital Farm
              </div>
              {/* min-h-[44px] touch target */}
              <a
                href="/admin"
                className="inline-flex items-center justify-center gap-1.5 mt-4 font-mono text-[9px] uppercase tracking-wider text-[#9e7a50]/50 hover:text-[#ffa720] transition-colors duration-200 min-h-[44px] px-4 no-print"
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
