// ════════════════════════════════════════════════════════
//  Smart Farm Admin Dashboard — Layout Shell
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  MOBILE-FIRST — field-accessible from smartphones
// ════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  LayoutDashboard, TreePine, FlaskConical, ScanLine,
  Settings, ChevronRight, Bell, Menu, X,
  AlertTriangle, Leaf, Zap, PackageCheck,
  ArrowUpRight, ArrowDownRight, Eye, MoreHorizontal,
  Check, Clock, ShieldAlert, QrCode, Search, Filter,
  Copy, Printer, Download, ExternalLink, Plus, Trash2,
  Save, CheckCircle2, Calendar, MapPin, User, Building,
  ShieldCheck, Layers
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  fetchDashboardStats,
  fetchHealthTrend,
  fetchFertilizerSchedule,
  addFertilizerSchedule,
  toggleFertilizerStatus,
  deleteFertilizerSchedule,
  fetchFarmSettings,
  updateFarmSettings,
  fetchAIAlerts,
  fetchTreeBatches,
  addTreeBatch,
  fetchBatchDetail,
  analyzeLeafPhoto,
  fetchFarmNotifications,
  markAllNotificationsRead,
} from '../services/treeService'


// ── Navigation config ─────────────────────────────────────
const NAV_ITEMS = [
  { path: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   exact: true },
  { path: '/admin/trees',     icon: TreePine,        label: 'Batch Pohon'   },
  { path: '/admin/fertilize', icon: FlaskConical,    label: 'Jadwal Pupuk'  },
  { path: '/admin/ai-scan',   icon: ScanLine,        label: 'Deteksi AI'    },
  { path: '/admin/settings',  icon: Settings,        label: 'Pengaturan'    },
]

// ── QRCode Modal Component ────────────────────────────────
function QRCodeModal({ batch, onClose }) {
  const [copied, setCopied] = useState(false)
  if (!batch) return null

  const targetUrl = `${window.location.origin}/trace/${batch.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-sm max-h-[90vh] flex flex-col glass-card-warm rounded-3xl border border-[#ffa720]/40 shadow-2xl print-area overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-white/[0.08] bg-black/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl btn-action-green flex items-center justify-center shadow-md flex-shrink-0">
                <QrCode size={20} className="text-white" />
              </div>
              <div className="text-left">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#ffa720] font-bold block">
                  Label Lacak Balak
                </span>
                <h3 className="font-heading text-xl font-bold text-[#fdf6f0] leading-tight">
                  {batch.id}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-[#dacdb8] hover:text-white transition-colors no-print min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-center">
            <p className="font-body text-sm font-semibold text-[#dacdb8] mb-3">
              {batch.variety} · {batch.location} ({batch.count} Pohon)
            </p>

            {/* QR Container */}
            <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mx-auto mb-3 border-4 border-[#ffa720]/40">
              <QRCodeSVG value={targetUrl} size={150} level="H" includeMargin={true} />
            </div>

            <div className="font-mono text-xs text-[#dacdb8] break-all bg-black/40 p-2.5 rounded-xl border border-white/[0.1] mb-2 font-semibold">
              {targetUrl}
            </div>

            <a
              href={`/trace/${batch.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#ffa720] font-bold uppercase tracking-wider hover:underline no-print py-1 min-h-[36px]"
            >
              Buka Halaman Publik <ExternalLink size={13} />
            </a>
          </div>

          {/* Pinned Footer */}
          <div className="flex-shrink-0 p-3.5 sm:p-4 bg-black/40 border-t border-white/[0.1] grid grid-cols-2 gap-2.5 no-print">
            <button
              onClick={handleCopy}
              className="glass-card py-2.5 px-3 rounded-xl font-body text-sm font-bold tracking-wider text-[#dacdb8] hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <Copy size={16} /> {copied ? 'Tersalin!' : 'Salin Link'}
            </button>

            <button
              onClick={handlePrint}
              className="btn-action-green py-2.5 px-3 rounded-xl font-body text-sm font-bold tracking-wider text-white shadow-lg flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <Printer size={16} /> Cetak QR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Batch Detail Modal Component ──────────────────────────
function BatchDetailModal({ batch, onClose, onOpenQr }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (batch?.id) {
      fetchBatchDetail(batch.id).then(res => {
        setDetail(res)
        setLoading(false)
      })
    }
  }, [batch])

  if (!batch) return null

  const pct = detail ? Math.round((detail.healthy / detail.count) * 100) : 100

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl max-h-[88vh] flex flex-col glass-card-warm rounded-3xl border border-[#ffa720]/40 shadow-2xl overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-white/[0.08] bg-black/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl btn-action-yellow flex items-center justify-center shadow-lg p-2.5 flex-shrink-0">
                <TreePine size={24} className="text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-wider text-[#ffa720] font-bold block">
                  Detail Batch Pohon
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdf6f0] truncate">
                  {batch.id}
                </h2>
                <div className="font-body text-sm font-semibold text-[#dacdb8] truncate">
                  {batch.variety} · {batch.location}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl glass-card text-[#dacdb8] hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Tutup modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="glass-card p-3 rounded-xl text-center">
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">{batch.count}</div>
                <div className="font-mono text-[11px] sm:text-xs text-[#dacdb8] uppercase font-bold">Total Pohon</div>
              </div>
              <div className="glass-card p-3 rounded-xl text-center border border-emerald-500/30">
                <div className="font-heading text-xl sm:text-2xl font-bold text-emerald-400">{batch.healthy}</div>
                <div className="font-mono text-[11px] sm:text-xs text-emerald-300 uppercase font-bold">Sehat</div>
              </div>
              <div className="glass-card p-3 rounded-xl text-center border border-red-500/30">
                <div className="font-heading text-xl sm:text-2xl font-bold text-red-400">{batch.flagged}</div>
                <div className="font-mono text-[11px] sm:text-xs text-red-300 uppercase font-bold">Terdeteksi</div>
              </div>
              <div className="glass-card p-3 rounded-xl text-center border border-[#ffa720]/30">
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#ffa720]">{pct}%</div>
                <div className="font-mono text-[11px] sm:text-xs text-[#ffa720] uppercase font-bold">Integritas</div>
              </div>
            </div>

            {/* Planted & Location Details */}
            <div className="glass-card p-4 rounded-2xl space-y-2 border border-white/[0.08]">
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-[#dacdb8]">Tanggal Tanam:</span>
                <span className="text-[#fdf6f0] font-bold">{batch.plantedDate || '12 Mar 2022'}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-[#dacdb8]">Sistem Irigasi:</span>
                <span className="text-[#fdf6f0] font-bold">Irigasi Tetes Otomatis (Mata Air Lawu)</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-[#dacdb8]">Sertifikasi Organik:</span>
                <span className="text-emerald-400 font-bold">✓ Terverifikasi Standar Desa Bibis</span>
              </div>
            </div>

            {/* Sample trees list */}
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#ffa720] font-bold mb-2 flex items-center justify-between">
                <span>Sampel Pohon Terdaftar</span>
                <span className="text-[#dacdb8] font-normal text-xs">Menampilkan {detail?.sampleTrees?.length || 0} sampel</span>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-6 text-[#dacdb8] font-mono text-xs">Memuat data pohon...</div>
                ) : (
                  detail?.sampleTrees?.map(t => (
                    <div key={t.code} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`status-dot ${t.status === 'flagged' ? 'danger' : 'healthy'}`} style={{ width: 10, height: 10 }} />
                        <span className="font-mono font-bold text-[#fdf6f0]">{t.code}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#dacdb8] hidden sm:inline">Scan: {t.lastScan}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                          t.status === 'flagged' ? 'badge-danger text-white' : 'badge-lime text-white'
                        }`}>
                          {t.health}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="flex-shrink-0 p-4 sm:p-5 bg-black/40 border-t border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`/trace/${batch.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold text-[#ffa720] hover:underline px-4 py-2.5 rounded-xl border border-[#ffa720]/40 min-h-[44px]"
            >
              Lihat di Halaman Publik <ExternalLink size={15} />
            </a>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => onOpenQr(batch)}
                className="btn-action-yellow text-black font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px] flex-1 sm:flex-initial cursor-pointer"
              >
                <QrCode size={18} /> Label QR
              </button>
              <button
                onClick={onClose}
                className="btn-action-red text-white font-bold text-sm px-5 py-2.5 rounded-xl min-h-[44px] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Add Batch Modal Component ─────────────────────────────
function AddBatchModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id: `Batch-${new Date().getFullYear()}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    count: 20,
    location: 'Blok Utara',
    variety: 'Jeruk Bali Merah',
    plantedDate: new Date().toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await addTreeBatch(formData)
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col glass-card-warm rounded-3xl border border-[#ffa720]/30 shadow-2xl overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-white/[0.08] bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl btn-action-green flex items-center justify-center shadow-md flex-shrink-0">
                <TreePine size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">Tambah Batch Pohon</h3>
                <p className="font-mono text-xs uppercase tracking-wider text-[#ffa720] font-bold">Registrasi Blok Baru</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-[#dacdb8] hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 pb-8 space-y-4">
              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  ID / Kode Batch
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                    Lokasi Blok
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-3 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                  >
                    <option value="Blok Utara">Blok Utara</option>
                    <option value="Blok Timur">Blok Timur</option>
                    <option value="Blok Selatan">Blok Selatan</option>
                    <option value="Blok Barat">Blok Barat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                    Jumlah Pohon
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-3 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  Varietas Tanaman
                </label>
                <select
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                >
                  <option value="Jeruk Bali Merah">Jeruk Bali Merah (Unggulan)</option>
                  <option value="Jeruk Bali Putih">Jeruk Bali Putih</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  Tanggal Tanam
                </label>
                <input
                  type="date"
                  required
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                />
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="flex-shrink-0 p-4 sm:p-5 bg-black/40 border-t border-white/[0.1] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-action-red px-5 py-2.5 rounded-xl font-body text-base font-bold text-white min-h-[44px] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-action-green px-6 py-2.5 rounded-xl font-body text-base font-bold text-white flex items-center gap-2 min-h-[44px] cursor-pointer"
              >
                <Plus size={18} /> {submitting ? 'Menyimpan...' : 'Simpan Batch'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── AI Alert Detail Modal Component ───────────────────────
function AIAlertDetailModal({ alert, onClose }) {
  if (!alert) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg max-h-[88vh] flex flex-col glass-card-warm rounded-3xl border border-[#ffa720]/40 shadow-2xl overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-white/[0.08] bg-black/20">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg p-2.5 flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-red-950/80 border-2 border-red-500 text-red-400' :
                alert.severity === 'medium' ? 'bg-amber-950/80 border-2 border-amber-500 text-amber-400' :
                'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400'
              }`}>
                <AlertTriangle size={26} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-wider text-[#ffa720] font-bold block">
                  Laporan Deteksi MobileNetV2 · {alert.id}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0] truncate">
                  {alert.disease}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-[#dacdb8] font-semibold">{alert.batch}</span>
                  <span className="font-mono text-xs text-[#dacdb8]">· {alert.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-[#dacdb8] hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Confidence badge */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-between">
              <div>
                <div className="font-mono text-xs uppercase text-[#dacdb8] font-bold">Skor Keyakinan AI</div>
                <div className="font-heading text-xl font-bold text-[#fdf6f0]">{alert.confidence}%</div>
              </div>
              <SeverityBadge level={alert.severity} />
            </div>

            {/* Symptoms */}
            <div className="glass-card p-4 rounded-2xl border border-white/[0.08]">
              <div className="font-mono text-xs uppercase text-[#ffa720] font-bold mb-1">
                Gejala Klinis Terdeteksi
              </div>
              <p className="font-body text-sm sm:text-base text-[#fdf6f0] leading-relaxed">
                {alert.symptoms || 'Bercak abnormal pada permukaan helai daun dengan pola klorosis khas.'}
              </p>
            </div>

            {/* SOP Advisory */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-[#ffa720]/30">
              <div className="font-mono text-xs uppercase text-[#ffa720] font-bold mb-1">
                SOP Rekomendasi Tindakan Kebun
              </div>
              <p className="font-body text-sm sm:text-base text-[#dacdb8] leading-relaxed">
                {alert.advisory || 'Lakukan sanitasi kebun, isolasi pohon yang terindikasi agar tidak menular ke baris lain, serta laporkan ke koordinator POPT setempat.'}
              </p>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="flex-shrink-0 p-4 sm:p-5 bg-black/40 border-t border-white/[0.1] flex justify-end">
            <button
              onClick={onClose}
              className="btn-action-green font-bold text-base px-6 py-2.5 rounded-xl min-h-[44px] text-white cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Notification Flyout Component ─────────────────────────
function NotificationFlyout({ onClose, onClearAll }) {
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    fetchFarmNotifications().then(setNotifs)
  }, [])

  const handleClear = async () => {
    await markAllNotificationsRead()
    const updated = await fetchFarmNotifications()
    setNotifs(updated)
    if (onClearAll) onClearAll()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 sm:pr-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 pointer-events-auto"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-sm max-h-[85vh] flex flex-col glass-card-warm p-5 rounded-3xl border border-[#ffa720]/40 shadow-2xl pointer-events-auto overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.1] flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#ffa720]" />
              <h3 className="font-heading text-lg font-bold text-[#fdf6f0]">Pemberitahuan Kebun</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#dacdb8] hover:text-white rounded-lg cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 py-2">
            {notifs.map(n => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-left text-xs ${
                  n.type === 'danger' ? 'bg-red-950/40 border-red-500/40' :
                  n.type === 'warning' ? 'bg-amber-950/30 border-amber-500/40' :
                  'bg-white/[0.04] border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[#fdf6f0] text-sm">{n.title}</span>
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#ffa720] shrink-0" />
                  )}
                </div>
                <p className="text-[#dacdb8] leading-relaxed">{n.desc}</p>
                <span className="font-mono text-[10px] text-[#dacdb8]/70 block mt-1.5">{n.time}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.1] flex items-center justify-between flex-shrink-0">
            <button
              onClick={handleClear}
              className="text-xs font-mono font-bold text-[#ffa720] hover:underline cursor-pointer min-h-[40px] flex items-center"
            >
              Tandai Semua Dibaca
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] text-xs font-mono font-bold text-[#dacdb8] hover:text-white cursor-pointer min-h-[40px] flex items-center"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}



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
          {/* min 48px touch target for icon area */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${stat.accent}25`, border: `1.5px solid ${stat.accent}50` }}
          >
            <Icon size={22} style={{ color: stat.accent }} />
          </div>
          <div className="flex items-center font-bold" style={{ color: stat.trend === 'up' ? '#4ade80' : '#f87171' }}>
            {stat.trend === 'up' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          </div>
        </div>
        <div className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0] mb-1">{stat.value}</div>
        <div className="font-body text-base font-bold text-[#fdf6f0] mb-0.5">{stat.label}</div>
        <div className="font-mono text-xs font-semibold text-[#dacdb8] tracking-wide uppercase">{stat.sub}</div>
      </div>
    </motion.div>
  )
}

function SeverityBadge({ level }) {
  const cfg = {
    high:   { short: 'TINGGI', full: 'TINGGI (BAHAYA)', bg: 'rgba(239,68,68,0.25)',   border: 'rgba(239,68,68,0.7)',   text: '#fca5a5' },
    medium: { short: 'SEDANG', full: 'SEDANG (HATI-HATI)', bg: 'rgba(245,158,11,0.25)', border: 'rgba(245,158,11,0.7)', text: '#fde68a' },
    low:    { short: 'RENDAH', full: 'RENDAH (AMAN)', bg: 'rgba(34,197,94,0.22)',   border: 'rgba(34,197,94,0.7)',   text: '#86efac' },
  }
  const c = cfg[level] || cfg.low
  return (
    <span
      className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap"
      style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text }}
    >
      <span className="sm:hidden">{c.short}</span>
      <span className="hidden sm:inline">{c.full}</span>
    </span>
  )
}

function getInitials(name) {
  if (!name) return 'SW'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── Sidebar inner content (shared between mobile & desktop) ─
function SidebarContent({ location, onNavClick, farmSettings }) {
  const isActive = (path, exact) => exact
    ? location.pathname === path
    : location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path))

  const farmerName = farmSettings?.farmerName || 'Pak Suwanto'
  const farmName = farmSettings?.farmName || 'Desa Bibis, Magetan'

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 sm:py-6 border-b border-white/[0.06] shrink-0">
        <PomeloMark />
        <div>
          <div className="font-display text-lg tracking-[0.06em] text-[#ffa720] font-bold">POMELO TRACE</div>
          <div className="font-mono text-xs text-[#dacdb8] tracking-widest uppercase font-semibold">Admin Dashboard</div>
        </div>
      </div>

      {/* Farm context chip */}
      <div className="px-4 py-3.5 mx-3 mt-4 rounded-2xl shrink-0"
        style={{ background: 'rgba(249,130,8,0.12)', border: '1px solid rgba(249,130,8,0.25)' }}
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[#ffa720] font-bold mb-1">Lokasi Kebun</div>
        <div className="font-body text-base text-[#fdf6f0] font-bold truncate">{farmName}</div>
        <div className="font-mono text-xs text-[#dacdb8] mt-1 font-medium">{farmSettings?.totalTrees || 88} pohon aktif</div>
      </div>

      {/* Navigation — flex-1 + overflow-y-auto for long nav lists */}
      <nav className="flex-1 px-3 mt-4 space-y-1.5 overflow-y-auto">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#dacdb8] px-3 mb-2 font-bold">
          Menu Utama
        </div>
        {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => {
          const active = isActive(path, exact)
          return (
            <Link
              key={path}
              to={path}
              /* min-h-[52px] for comfortable touch targets */
              className={`sidebar-nav-item min-h-[52px] text-base font-semibold ${active ? 'active' : ''}`}
              onClick={onNavClick}
            >
              <Icon size={20} />
              <span className="text-base">{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-2 h-2 rounded-full bg-[#ffa720]"
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
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer min-h-[56px]">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl badge-citrus flex items-center justify-center flex-shrink-0 text-white font-mono text-sm font-bold">
            {getInitials(farmerName)}
          </div>
          <div className="min-w-0">
            <div className="font-body text-base text-[#fdf6f0] font-bold truncate">{farmerName}</div>
            <div className="font-mono text-xs text-[#dacdb8] font-medium">Petani · Admin</div>
          </div>
        </div>
      </div>
    </>
  )
}


// ── Dashboard Overview ────────────────────────────────────
function DashboardOverview({ farmSettings }) {
  const [stats, setStats] = useState([])
  const [healthTrend, setHealthTrend] = useState([])
  const [fertilizerSchedule, setFertilizerSchedule] = useState([])
  const [aiAlerts, setAiAlerts] = useState([])
  const [treeBatches, setTreeBatches] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [timeframe, setTimeframe] = useState('7m')
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false)

  useEffect(() => {
    fetchDashboardStats().then(setStats)
    fetchFertilizerSchedule().then(setFertilizerSchedule)
    fetchAIAlerts().then(setAiAlerts)
    fetchTreeBatches().then(setTreeBatches)
  }, [])

  useEffect(() => {
    fetchHealthTrend(timeframe).then(setHealthTrend)
  }, [timeframe])

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">

      {/* Welcome heading */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">
          Selamat datang, <span className="shimmer-text">{farmSettings?.farmerName || 'Pak Suwanto'}</span>
        </h1>
        <p className="font-body text-base text-[#dacdb8] mt-1.5 font-medium">
          Ringkasan kebun pomelo Anda — {farmSettings?.farmName || 'Desa Bibis, Magetan'}
        </p>
      </div>


      {/* Stat cards: 1 col mobile → 2 col sm → 4 col xl */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map(s => <StatCard key={s.label} stat={s} />)}
      </motion.div>

      {/* Charts: single col mobile → 3-col xl */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Health trend area chart */}
        <motion.div variants={staggerItem} className="xl:col-span-2 glass-card p-4 sm:p-5 relative">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#ffa720] font-bold mb-1">
                Tren Kesehatan ({timeframe === '3m' ? '3 Bulan' : timeframe === '1y' ? '1 Tahun' : '7 Bulan'})
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">Status Pohon Bulanan</h2>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
                title="Pilih Rentang Waktu"
                className="p-2.5 rounded-xl glass-card hover:bg-white/[0.08] transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer"
              >
                <MoreHorizontal size={18} className="text-[#dacdb8]" />
              </button>
              {showTimeframeMenu && (
                <div className="absolute right-0 top-12 z-20 w-44 glass-card-warm p-1.5 rounded-2xl border border-[#ffa720]/40 shadow-xl space-y-1">
                  {[
                    { id: '3m', label: '3 Bulan Terakhir' },
                    { id: '7m', label: '7 Bulan (Standar)' },
                    { id: '1y', label: '1 Tahun Lengkap' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setTimeframe(opt.id); setShowTimeframeMenu(false) }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                        timeframe === opt.id ? 'bg-[#ffa720] text-black font-extrabold' : 'text-[#dacdb8] hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={healthTrend} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="flaggedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fill: '#dacdb8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fill: '#dacdb8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(30,15,8,0.98)', border: '1.5px solid rgba(255,167,32,0.3)', borderRadius: 10, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="healthy" stroke="#22c55e" strokeWidth={3} fill="url(#healthyGrad)" name="Sehat" />
              <Area type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={3} fill="url(#flaggedGrad)" name="Terdeteksi" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Batch distribution bars */}
        <motion.div variants={staggerItem} className="glass-card p-4 sm:p-5">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#ffa720] font-bold mb-1">Distribusi Batch</div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0] mb-4">Per Blok Kebun</h2>
          <div className="space-y-4">
            {treeBatches.map((b, i) => {
              const pct = Math.round((b.healthy / b.count) * 100)
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#fdf6f0] truncate mr-2">{b.id}</span>
                    <span className="font-mono text-xs sm:text-sm font-bold flex-shrink-0" style={{ color: pct === 100 ? '#4ade80' : '#fbbf24' }}>
                      {pct}% Sehat
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: pct === 100 ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#d97706,#f59e0b)' }}
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
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#ffa720] font-bold mb-1">AI MobileNetV2</div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">Peringatan Penyakit</h2>
          </div>
          <Link
            to="/admin/ai-scan"
            className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-[#ffa720] hover:underline min-h-[48px] px-3 py-2 rounded-xl bg-[#ffa720]/15 border border-[#ffa720]/30"
          >
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {aiAlerts.map((a) => (
            <motion.div key={a.id} variants={staggerItem}
              onClick={() => setSelectedAlert(a)}
              title="Klik untuk melihat SOP & detail deteksi"
              className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-colors cursor-pointer min-h-[72px] ${
                a.severity === 'high' ? 'bg-red-950/30 border-red-500/40 hover:bg-red-950/40' : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-pomelo-900/60 border border-pomelo-600/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-pomelo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#fdf6f0]">{a.id}</span>
                  <span className="font-mono text-xs text-[#dacdb8] font-medium hidden sm:inline">· {a.batch}</span>
                </div>
                <div className="font-body text-base font-bold text-[#fdf6f0] truncate">{a.disease}</div>
                <div className="font-mono text-xs text-[#dacdb8] mt-0.5 font-medium">Confidence: {a.confidence}% · {a.time}</div>
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
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#ffa720] font-bold mb-1">Jadwal Mendatang</div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">Pemupukan Terjadwal</h2>
          </div>
          <Link
            to="/admin/fertilize"
            className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-[#ffa720] hover:underline min-h-[48px] px-3 py-2 rounded-xl bg-[#ffa720]/15 border border-[#ffa720]/30"
          >
            Kelola <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
          <table className="data-table w-full min-w-[500px]">
            <thead>
              <tr>
                <th>ID</th><th>Batch</th><th>Pohon</th><th>Jenis Pupuk</th><th>Tanggal</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fertilizerSchedule.map((f) => (
                <tr key={f.id}>
                  <td className="font-mono font-bold text-[#ffa720] text-sm">{f.id}</td>
                  <td className="font-semibold text-[#fdf6f0] text-sm">{f.batch}</td>
                  <td className="font-medium text-[#dacdb8] text-sm">{f.trees} pohon</td>
                  <td className="font-medium text-[#fdf6f0] text-sm">{f.type}</td>
                  <td className="whitespace-nowrap font-mono text-xs font-medium text-[#dacdb8]">{f.date}</td>
                  <td>
                    {f.status === 'done'
                      ? <span className="badge-status-done inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"><Check size={14} /> Selesai</span>
                      : <span className="badge-status-scheduled inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"><Clock size={14} /> Terjadwal</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Render alert detail modal if clicked */}
      {selectedAlert && (
        <AIAlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </motion.div>
  )
}


// ── Batch Pohon Page ──────────────────────────────────────
function TreeBatchesPage() {
  const [batches, setBatches] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedQrBatch, setSelectedQrBatch] = useState(null)
  const [selectedDetailBatch, setSelectedDetailBatch] = useState(null)
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)

  const loadBatches = useCallback(() => {
    fetchTreeBatches({ query: searchQuery, status: statusFilter }).then(setBatches)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    loadBatches()
  }, [loadBatches])

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">Batch Pohon</h1>
          <p className="font-body text-base text-[#dacdb8] mt-1 font-medium">Kelola semua batch pohon pomelo aktif & QR Lacak Balak</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddBatchModal(true)}
          className="btn-action-green text-white font-body text-base font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 flex-shrink-0 min-h-[50px] self-start sm:self-auto shadow-xl cursor-pointer"
        >
          <Plus size={22} />
          <span>Tambah Batch</span>
        </motion.button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="glass-card p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#dacdb8]" />
          <input
            type="text"
            placeholder="Cari ID batch, lokasi, atau varietas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-11 pr-4 py-3 font-body text-base text-[#fdf6f0] placeholder-[#dacdb8]/60 focus:outline-none focus:border-[#ffa720] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#dacdb8] hover:text-white p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Batch' },
            { id: 'healthy', label: '100% Sehat' },
            { id: 'flagged', label: 'Terdeteksi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm uppercase tracking-wider font-bold whitespace-nowrap transition-colors min-h-[44px] cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#ffa720] text-black font-extrabold shadow-md'
                  : 'bg-white/[0.05] text-[#dacdb8] border border-white/[0.1] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Batches */}
      {batches.length === 0 ? (
        <div className="glass-card p-10 text-center text-[#dacdb8] text-base font-medium">
          Tidak ada batch pohon yang cocok dengan pencarian "{searchQuery}"
        </div>
      ) : (
        <motion.div
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {batches.map((b) => {
            const pct = Math.round((b.healthy / b.count) * 100)
            return (
              <motion.div key={b.id} variants={staggerItem}
                className="glass-card p-5 sm:p-6 hover:border-[#ffa72050] active:border-[#ffa720] transition-colors shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 mr-2">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#ffa720] font-bold">{b.location}</span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdf6f0] mt-0.5">{b.id}</h3>
                    <p className="font-body text-base font-semibold text-[#dacdb8]">{b.variety}</p>
                  </div>
                  <div className={`status-dot mt-2 flex-shrink-0 ${b.flagged > 0 ? 'danger' : 'healthy'}`} style={{ width: 12, height: 12 }} />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 pt-4 border-t border-white/[0.08]">
                  {[
                    { label: 'Total', val: b.count, color: '#fdf6f0' },
                    { label: 'Sehat', val: b.healthy, color: '#4ade80' },
                    { label: 'Flagged', val: b.flagged, color: b.flagged > 0 ? '#ef4444' : '#dacdb8' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="font-heading text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.val}</div>
                      <div className="font-mono text-xs uppercase tracking-wider text-[#dacdb8] font-bold">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="h-2.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: pct === 100 ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#d97706,#f59e0b)' }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => setSelectedQrBatch(b)}
                    className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#ffa720] hover:text-[#ffdb84] transition-colors min-h-[48px] px-4 py-2.5 rounded-xl bg-[#ffa720]/15 border border-[#ffa720]/40 cursor-pointer"
                  >
                    <QrCode size={16} /> Label QR Code
                  </button>
                  <button
                    onClick={() => setSelectedDetailBatch(b)}
                    className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#dacdb8] hover:text-white transition-colors min-h-[48px] px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] cursor-pointer hover:bg-white/[0.1]"
                  >
                    <Eye size={16} /> Detail
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Render QR Code Modal if selected */}
      {selectedQrBatch && (
        <QRCodeModal batch={selectedQrBatch} onClose={() => setSelectedQrBatch(null)} />
      )}

      {/* Render Batch Detail Modal if selected */}
      {selectedDetailBatch && (
        <BatchDetailModal
          batch={selectedDetailBatch}
          onClose={() => setSelectedDetailBatch(null)}
          onOpenQr={(b) => {
            setSelectedDetailBatch(null)
            setSelectedQrBatch(b)
          }}
        />
      )}

      {/* Render Add Batch Modal if active */}
      {showAddBatchModal && (
        <AddBatchModal
          onClose={() => setShowAddBatchModal(false)}
          onSuccess={loadBatches}
        />
      )}
    </motion.div>
  )
}

// ── AI Scan Page ──────────────────────────────────────────
function AIScanPage() {
  const [alerts, setAlerts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [latestResult, setLatestResult] = useState(null)
  const [selectedAlertDetail, setSelectedAlertDetail] = useState(null)
  const fileInputRef = useRef(null)

  const loadAlerts = useCallback(() => {
    fetchAIAlerts({ query: searchQuery, severity: severityFilter }).then(setAlerts)
  }, [searchQuery, severityFilter])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  const processAnalysis = async (file = null) => {
    setIsAnalyzing(true)
    setLatestResult(null)
    setTimeout(async () => {
      const result = await analyzeLeafPhoto(file)
      setIsAnalyzing(false)
      setLatestResult(result)
      loadAlerts()
      if (fileInputRef.current) fileInputRef.current.value = ''
    }, 1300)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processAnalysis(file)
    }
  }

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div>
        <span className="badge-citrus text-white font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg font-bold">
          MobileNetV2 Active
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0] mt-2">Deteksi Penyakit AI</h1>
        <p className="font-body text-base text-[#dacdb8] mt-1 font-medium">
          Model AI menganalisis foto daun dari seluruh batch secara real-time
        </p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Result Notification Banner */}
      {latestResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl glass-card-warm border-2 border-[#ffa720] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              latestResult.severity === 'high' ? 'bg-red-600' : latestResult.severity === 'medium' ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-[#ffa720] font-bold">Hasil Analisis Selesai ({latestResult.id})</div>
              <div className="font-heading text-xl font-bold text-[#fdf6f0]">{latestResult.disease}</div>
              <div className="font-mono text-xs text-[#dacdb8]">Keyakinan Model: {latestResult.confidence}% · {latestResult.batch}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedAlertDetail(latestResult)}
            className="btn-action-green text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md self-end sm:self-auto"
          >
            <Eye size={16} /> Baca SOP Penanganan
          </button>
        </motion.div>
      )}

      {/* Upload zone — full width on mobile, touch-friendly */}
      <motion.div variants={staggerItem}
        className={`border-2 border-dashed rounded-3xl p-7 sm:p-10 text-center transition-all shadow-lg relative overflow-hidden ${
          isAnalyzing
            ? 'border-[#ffa720] bg-amber-950/40'
            : 'border-[#ffa720]/40 hover:border-[#ffa720] active:border-[#ffa720] bg-black/20'
        }`}
      >
        {isAnalyzing ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl btn-action-yellow flex items-center justify-center mb-4 shadow-xl text-black"
            >
              <Zap size={32} />
            </motion.div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdf6f0] mb-2">
              Menganalisis Pola Daun...
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#ffa720] font-bold uppercase tracking-widest">
              Model MobileNetV2 mengekstraksi tekstur klorosis daun
            </p>
            <div className="w-64 h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                animate={{ x: [-100, 256] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl badge-citrus flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-105 transition-transform">
                <ScanLine size={32} className="text-white" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdf6f0] mb-2 group-hover:text-[#ffa720] transition-colors">
                Upload Foto Daun
              </h3>
              <p className="font-body text-base text-[#dacdb8] font-medium max-w-md mx-auto">
                Sentuh di sini untuk memilih foto daun jeruk dari galeri atau kamera smartphone (JPG/PNG)
              </p>
              <p className="font-mono text-xs text-[#ffa720] mt-2 uppercase tracking-widest font-bold">
                Analisis Otomatis dalam &lt;2 Detik
              </p>
            </div>

            {/* Quick Demo Button */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-action-green text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg min-h-[48px]"
              >
                <Plus size={18} /> Pilih File Foto
              </button>
              <button
                type="button"
                onClick={() => processAnalysis()}
                className="btn-action-yellow text-black font-extrabold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg min-h-[48px]"
              >
                <Zap size={18} /> Uji Coba Scan Cepat (Demo)
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Search & Filter Bar ── */}
      <div className="glass-card p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#dacdb8]" />
          <input
            type="text"
            placeholder="Cari ID sampel, batch, atau jenis penyakit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-11 pr-4 py-3 font-body text-base text-[#fdf6f0] placeholder-[#dacdb8]/60 focus:outline-none focus:border-[#ffa720] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#dacdb8] hover:text-white p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Alert' },
            { id: 'high', label: 'Tinggi (Bahaya)' },
            { id: 'medium', label: 'Sedang (Hati-hati)' },
            { id: 'low', label: 'Rendah (Aman)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSeverityFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors min-h-[44px] cursor-pointer ${
                severityFilter === tab.id
                  ? 'bg-[#ffa720] text-black font-extrabold shadow-md'
                  : 'bg-white/[0.05] text-[#dacdb8] border border-white/[0.1] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div>
        <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.15em] text-[#ffa720] font-bold mb-3 flex items-center justify-between">
          <span>Hasil Deteksi Terbaru ({alerts.length})</span>
          <span className="text-[#dacdb8] font-normal text-xs">Klik item untuk melihat SOP</span>
        </div>
        {alerts.length === 0 ? (
          <div className="glass-card p-10 text-center text-[#dacdb8] text-base font-medium">
            Tidak ada data deteksi yang sesuai filter.
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3.5">
            {alerts.map((a) => (
              <motion.div key={a.id} variants={staggerItem}
                onClick={() => setSelectedAlertDetail(a)}
                title="Klik untuk membuka SOP Penanganan Kebun"
                className={`p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 sm:gap-5 min-h-[80px] shadow-lg border-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  a.severity === 'high'
                    ? 'bg-red-950/40 border-red-500/60 hover:border-red-400'
                    : a.severity === 'medium'
                    ? 'bg-amber-950/30 border-amber-500/50 hover:border-amber-400'
                    : 'bg-emerald-950/25 border-emerald-500/40 hover:border-emerald-400'
                }`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: a.severity === 'high' ? 'rgba(239,68,68,0.25)' : a.severity === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.2)',
                    border: `1.5px solid ${a.severity === 'high' ? 'rgba(239,68,68,0.7)' : a.severity === 'medium' ? 'rgba(245,158,11,0.7)' : 'rgba(34,197,94,0.6)'}`,
                  }}
                >
                  <AlertTriangle size={24} style={{ color: a.severity === 'high' ? '#fca5a5' : a.severity === 'medium' ? '#fde68a' : '#86efac' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#fdf6f0]">{a.id}</span>
                    <span className="font-mono text-xs text-[#dacdb8] font-semibold hidden sm:inline">· {a.batch}</span>
                  </div>
                  <div className="font-body text-base sm:text-lg font-bold text-[#fdf6f0] truncate">{a.disease}</div>
                  <div className="font-mono text-xs sm:text-sm text-[#dacdb8] mt-1 font-semibold">
                    Confidence: <span style={{ color: a.severity === 'high' ? '#fca5a5' : '#fde68a' }}>{a.confidence}%</span>
                    {' · '}{a.time}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge level={a.severity} />
                  <div className="p-2 rounded-xl bg-white/[0.06] text-[#dacdb8] hidden sm:flex">
                    <Eye size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail SOP Modal */}
      {selectedAlertDetail && (
        <AIAlertDetailModal
          alert={selectedAlertDetail}
          onClose={() => setSelectedAlertDetail(null)}
        />
      )}
    </motion.div>
  )
}


// ── Add Fertilizer Modal ───────────────────────────────────
function AddFertilizerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    batch: 'Batch-2022-A',
    trees: 20,
    type: 'Kompos Kascing',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addFertilizerSchedule(formData)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col glass-card-warm rounded-3xl border border-[#ffa720]/30 shadow-2xl overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-white/[0.08] bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl btn-action-green flex items-center justify-center shadow-md flex-shrink-0">
                <FlaskConical size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#fdf6f0]">Tambah Jadwal Pupuk</h3>
                <p className="font-mono text-xs uppercase tracking-wider text-[#ffa720] font-bold">Form Pemupukan Organik</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-[#dacdb8] hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 pb-8 space-y-4">
              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  Pilih Batch Pohon
                </label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                >
                  <option value="Batch-2022-A">Batch-2022-A (Blok Utara)</option>
                  <option value="Batch-2022-B">Batch-2022-B (Blok Timur)</option>
                  <option value="Batch-2023-A">Batch-2023-A (Blok Selatan)</option>
                  <option value="Batch-2023-B">Batch-2023-B (Blok Barat)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                    Jumlah Pohon
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.trees}
                    onChange={(e) => setFormData({ ...formData, trees: e.target.value })}
                    className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-3 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  Jenis Pupuk Organik
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
                >
                  <option value="Kompos Kascing">Kompos Kascing (Kasut Cacing)</option>
                  <option value="MOL Bonggol">MOL Bonggol Pisang</option>
                  <option value="Pupuk Kalium">Pupuk Kalium Organik</option>
                  <option value="Starter Organik">Starter Organik Bio-Activator</option>
                  <option value="Pupuk Kasut Super">Pupuk Kasut Super</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5">
                  Catatan Dosis & Instruksi (Opsional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Dosis 2kg/pohon, siram setelah pemupukan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#180b04] border border-white/[0.2] rounded-xl p-3.5 font-body text-base text-[#fdf6f0] placeholder-[#dacdb8]/60 focus:outline-none focus:border-[#ffa720]"
                />
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="flex-shrink-0 p-4 sm:p-5 bg-black/40 border-t border-white/[0.1] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-action-red px-5 py-2.5 rounded-xl font-body text-base font-bold text-white min-h-[44px] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-action-green px-6 py-2.5 rounded-xl font-body text-base font-bold text-white flex items-center gap-2 min-h-[44px] cursor-pointer"
              >
                <Plus size={18} /> Simpan Jadwal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Jadwal Pupuk Page ──────────────────────────────────────
function FertilizerManagementPage() {
  const [schedules, setSchedules] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadData = useCallback(() => {
    fetchFertilizerSchedule({ query: searchQuery, status: statusFilter }).then(setSchedules)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggle = async (id) => {
    await toggleFertilizerStatus(id)
    loadData()
  }

  const handleDelete = async (id) => {
    await deleteFertilizerSchedule(id)
    loadData()
  }


  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">Jadwal Pemupukan</h1>
          <p className="font-body text-base text-[#dacdb8] mt-1 font-medium">Kelola program pemupukan organik terintegrasi per batch</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="btn-action-green text-white font-body text-base font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 flex-shrink-0 min-h-[50px] self-start sm:self-auto shadow-xl cursor-pointer"
        >
          <Plus size={22} />
          <span>Tambah Jadwal</span>
        </motion.button>
      </div>

      {/* Search & Filter bar */}
      <div className="glass-card p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#dacdb8]" />
          <input
            type="text"
            placeholder="Cari ID, nama batch, atau jenis pupuk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-11 pr-10 py-3 font-body text-base text-[#fdf6f0] placeholder-[#dacdb8]/60 focus:outline-none focus:border-[#ffa720] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#dacdb8] hover:text-white p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Jadwal' },
            { id: 'scheduled', label: 'Terjadwal (Perhatian)' },
            { id: 'done', label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm uppercase tracking-wider font-bold whitespace-nowrap transition-colors min-h-[44px] ${
                statusFilter === tab.id
                  ? 'bg-[#ffa720] text-black font-extrabold shadow-md'
                  : 'bg-white/[0.05] text-[#dacdb8] border border-white/[0.1] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedules Table */}
      <div className="glass-card p-4 sm:p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="data-table w-full min-w-[620px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Batch Pohon</th>
                <th>Target Pohon</th>
                <th>Jenis Pupuk</th>
                <th>Tanggal Eksekusi</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#dacdb8] text-base font-medium">
                    Tidak ada jadwal pemupukan ditemukan.
                  </td>
                </tr>
              ) : (
                schedules.map((f) => (
                  <tr key={f.id}>
                    <td className="font-mono text-[#ffa720] font-bold text-sm">{f.id}</td>
                    <td className="font-bold text-[#fdf6f0] text-base">{f.batch}</td>
                    <td className="font-medium text-[#dacdb8] text-base">{f.trees} pohon</td>
                    <td className="text-[#fdf6f0] font-medium text-base">{f.type}</td>
                    <td className="whitespace-nowrap font-mono text-xs font-semibold text-[#dacdb8]">{f.date}</td>
                    <td>
                      {f.status === 'done'
                        ? <span className="badge-status-done inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase"><Check size={14} /> Selesai</span>
                        : <span className="badge-status-scheduled inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase"><Clock size={14} /> Terjadwal</span>
                      }
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(f.id)}
                          title={f.status === 'done' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                          className={`p-2.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-md ${
                            f.status === 'done'
                              ? 'bg-white/[0.08] text-[#dacdb8] hover:text-white'
                              : 'btn-action-green'
                          }`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          title="Hapus Jadwal"
                          className="btn-action-red p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-md"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddFertilizerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadData}
        />
      )}
    </motion.div>
  )
}

// ── Settings Page ─────────────────────────────────────────
function SettingsPage({ onSettingsUpdate }) {
  const [settings, setSettings] = useState({
    farmerName: '',
    farmName: '',
    locationName: '',
    coordinates: '',
    totalTrees: 88,
    notifications: {
      aiAlerts: true,
      fertilizerReminders: true,
      weeklyReport: false,
    }
  })
  const [savedToast, setSavedToast] = useState(false)

  useEffect(() => {
    fetchFarmSettings().then(setSettings)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updated = await updateFarmSettings(settings)
    if (onSettingsUpdate) onSettingsUpdate(updated)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  const toggleNotif = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    })
  }

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fdf6f0]">Pengaturan Kebun</h1>
        <p className="font-body text-base text-[#dacdb8] mt-1 font-medium">Konfigurasi data profil kebun, lokasi, dan preferensi sistem</p>
      </div>

      {savedToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl badge-status-done text-[#4ade80] flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-wider shadow-lg"
        >
          <CheckCircle2 size={22} /> Pengaturan Berhasil Disimpan!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Profil Kebun & Petani */}
        <div className="glass-card p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Building size={22} className="text-[#ffa720]" />
            <h2 className="font-heading text-2xl font-bold text-[#fdf6f0]">Profil Kebun & Pengelola</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5 flex items-center gap-1.5">
                <User size={16} className="text-[#ffa720]" /> Nama Petani / Pengelola
              </label>
              <input
                type="text"
                value={settings.farmerName}
                onChange={(e) => setSettings({ ...settings, farmerName: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
              />
            </div>

            <div>
              <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5 flex items-center gap-1.5">
                <Building size={16} className="text-[#ffa720]" /> Nama Kebun
              </label>
              <input
                type="text"
                value={settings.farmName}
                onChange={(e) => setSettings({ ...settings, farmName: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
              />
            </div>

            <div>
              <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5 flex items-center gap-1.5">
                <MapPin size={16} className="text-[#ffa720]" /> Alamat Kebun
              </label>
              <input
                type="text"
                value={settings.locationName}
                onChange={(e) => setSettings({ ...settings, locationName: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
              />
            </div>

            <div>
              <label className="block font-body text-sm sm:text-base font-bold text-[#fdf6f0] mb-1.5 flex items-center gap-1.5">
                <MapPin size={16} className="text-[#ffa720]" /> Koordinat GPS Kebun
              </label>
              <input
                type="text"
                value={settings.coordinates}
                onChange={(e) => setSettings({ ...settings, coordinates: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-3 font-body text-base text-[#fdf6f0] focus:outline-none focus:border-[#ffa720]"
              />
            </div>
          </div>
        </div>

        {/* Preferensi Notifikasi */}
        <div className="glass-card p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Bell size={22} className="text-[#ffa720]" />
            <h2 className="font-heading text-2xl font-bold text-[#fdf6f0]">Preferensi Notifikasi</h2>
          </div>

          <div className="space-y-3.5">
            {[
              { key: 'aiAlerts', label: 'Notifikasi Peringatan Dini AI (HLB Alert)', desc: 'Kirim alert otomatis jika AI mendeteksi potensi penyakit >80% confidence' },
              { key: 'fertilizerReminders', label: 'Pengingat Jadwal Pemupukan Organik', desc: 'Pengingat 2 hari sebelum tanggal eksekusi pupuk kascing/MOL' },
              { key: 'weeklyReport', label: 'Laporan Ringkasan Kesehatan Kebun', desc: 'Kirim laporan ringkasan mingguan kesehatan 88 pohon' },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="min-w-0 mr-4">
                  <div className="font-body text-base font-bold text-[#fdf6f0]">{n.label}</div>
                  <div className="font-body text-sm text-[#dacdb8] mt-1">{n.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif(n.key)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                    settings.notifications[n.key] ? 'bg-[#22c55e]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                    animate={{ x: settings.notifications[n.key] ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-action-green text-white font-body text-base font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl min-h-[50px] cursor-pointer"
          >
            <Save size={20} /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </motion.div>
  )
}


// ── Main Admin Dashboard Shell ────────────────────────────
export default function AdminDashboard() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [farmSettings, setFarmSettings] = useState(null)

  const updateNotifCount = useCallback(() => {
    fetchFarmNotifications().then(items => {
      const unread = items.filter(i => i.unread).length
      setNotifications(unread)
    })
  }, [])

  useEffect(() => {
    fetchFarmSettings().then(setFarmSettings)
    updateNotifCount()
  }, [updateNotifCount])

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
        <SidebarContent location={location} onNavClick={closeSidebar} farmSettings={farmSettings} />
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
              <SidebarContent location={location} onNavClick={closeSidebar} farmSettings={farmSettings} />
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
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg glass-card hover:bg-white/[0.06] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              id="notifications-btn"
              title={`${notifications} notifikasi aktif kebun`}
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

            {/* Public page link — visible on all screens */}
            <Link
              to="/"
              id="header-public-page-btn"
              className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#ffa720] glass-card px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl hover:bg-[#ffa720]/15 border border-[#ffa720]/30 transition-all duration-200 min-h-[44px] whitespace-nowrap shrink-0"
              title="Buka Halaman Publik (Keterlacakan)"
            >
              <QrCode size={16} />
              <span className="text-xs">Halaman Publik</span>
            </Link>
          </div>
        </header>

        {/* ── Page content — scrollable ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index            element={<DashboardOverview farmSettings={farmSettings} />} />
              <Route path="trees"     element={<TreeBatchesPage />} />
              <Route path="fertilize" element={<FertilizerManagementPage />} />
              <Route path="ai-scan"   element={<AIScanPage />} />
              <Route path="settings"  element={<SettingsPage onSettingsUpdate={setFarmSettings} />} />
              <Route path="*"         element={<Navigate to="/admin" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Render Notification Flyout if active */}
      {showNotifications && (
        <NotificationFlyout
          onClose={() => setShowNotifications(false)}
          onClearAll={() => setNotifications(0)}
        />
      )}
    </div>
  )
}


