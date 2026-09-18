// ════════════════════════════════════════════════════════
//  Smart Farm Admin Dashboard — Complete Layout & Features
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  Full CRUD Integration for Trees, Fertilizations,
//  Harvests, Farmers, AI Detection, and Public Traceability.
// ════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TreePine, FlaskConical, ScanLine,
  ChevronRight, Menu, X,
  AlertTriangle, Leaf, Zap, PackageCheck,
  ArrowUpRight, ArrowDownRight, Eye, MoreHorizontal,
  Check, Clock, ShieldAlert, QrCode, Search, Filter,
  Copy, Printer, Download, ExternalLink, Plus, Trash2,
  Save, CheckCircle2, Calendar, MapPin, User, Building,
  ShieldCheck, Layers, Users, Edit3, Phone, Mail, FileText,
  FileCheck, Sparkles, RefreshCw, MessageSquare, Send,
  Bot, MessageCircle, HelpCircle, LogOut, LogIn,
  Camera, CameraOff, SwitchCamera, Upload, RotateCcw
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
  updateTreeBatch,
  deleteTreeBatch,
  fetchBatchDetail,
  analyzeLeafPhoto,
  fetchAdminHarvests,
  reportHarvest,
  verifyHarvestAndGenerateQR,
  fetchAdminFarmers,
  createAdminFarmer,
  updateAdminFarmer,
  deleteAdminFarmer,
  sendChatMessage,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getAuthUser,
  setAuthUser,
  removeAuthUser,
  loginFarmer
} from '../services/treeService'
import MarkdownRenderer from '../components/MarkdownRenderer'
import Pagination from '../components/Pagination'

// ── Navigation config by Role ─────────────────────────────
const NAV_ITEMS_ADMIN = [
  { path: '/admin',           icon: LayoutDashboard, label: 'Dashboard',       exact: true },
  { path: '/admin/trees',     icon: TreePine,        label: 'Pohon & Lahan'   },
  { path: '/admin/fertilize', icon: FlaskConical,    label: 'Jadwal Pupuk'    },
  { path: '/admin/ai-scan',   icon: ScanLine,        label: 'Deteksi AI'      },
  { path: '/admin/harvests',  icon: PackageCheck,    label: 'Lapor & QR Panen'},
  { path: '/admin/farmers',   icon: Users,           label: 'Petani Terdaftar'},
]

const NAV_ITEMS_FARMER = [
  { path: '/admin',           icon: LayoutDashboard, label: 'Dashboard',       exact: true },
  { path: '/admin/trees',     icon: TreePine,        label: 'Pohon & Lahan'   },
  { path: '/admin/fertilize', icon: FlaskConical,    label: 'Jadwal Pupuk'    },
  { path: '/admin/ai-scan',   icon: ScanLine,        label: 'Deteksi AI'      },
  { path: '/admin/chat',      icon: MessageSquare,   label: 'Konsultasi AI'   },
]

// ── Animation variants ────────────────────────────────────
const mobileSidebarVariants = {
  hidden:  { x: '-100%', transition: { type: 'spring', stiffness: 400, damping: 35 } },
  visible: { x: 0,       transition: { type: 'spring', stiffness: 400, damping: 35 } },
}

const contentVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const staggerItem = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

// ── Brand Mark ────────────────────────────────────────────
function PomeloMark() {
  return (
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
      style={{
        background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
        border: '1.5px solid rgba(255,255,255,0.2)',
      }}
    >
      <span className="font-heading font-bold text-xl text-white select-none">P</span>
    </div>
  )
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase() || 'P'
}

// ── Severity Badge Helper ─────────────────────────────────
function SeverityBadge({ level }) {
  if (level === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase bg-red-100 text-red-700 border border-red-200">
        <AlertTriangle size={13} /> Bahaya
      </span>
    )
  }
  if (level === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase bg-amber-100 text-amber-800 border border-amber-200">
        <Clock size={13} /> Perhatian
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
      <Check size={13} /> Aman
    </span>
  )
}

// ── Batch Detail Modal Component ──────────────────────────
function BatchDetailModal({ batch, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (batch?.id || batch?.dbId) {
      fetchBatchDetail(batch.dbId || batch.id).then(res => {
        setDetail(res)
        setLoading(false)
      })
    }
  }, [batch])

  if (!batch) return null

  const isSick = (detail?.healthStatus === 'Sakit') || (batch?.healthStatus === 'Sakit') || (batch?.flagged > 0)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md p-2.5 flex-shrink-0 ${
                isSick ? 'bg-red-600 text-white' : 'bg-forest-800 text-white'
              }`}>
                <TreePine size={24} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">
                  Detail Pohon / Lahan
                </span>
                <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 truncate">
                  {batch.treeCode || batch.id}
                </h2>
                <div className="font-body text-sm font-semibold text-stone-600 truncate">
                  {batch.variety} · {batch.location || batch.locationBlock}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Tutup modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                <div className="font-heading text-xl sm:text-2xl font-bold text-stone-900">{batch.ageMonths || 8} Bln</div>
                <div className="font-mono text-[11px] sm:text-xs text-stone-500 uppercase font-bold">Umur Pohon</div>
              </div>
              <div className={`p-3 rounded-xl text-center border ${isSick ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className={`font-heading text-xl sm:text-2xl font-bold ${isSick ? 'text-red-700' : 'text-emerald-800'}`}>
                  {isSick ? 'Sakit' : 'Sehat'}
                </div>
                <div className={`font-mono text-[11px] sm:text-xs uppercase font-bold ${isSick ? 'text-red-600' : 'text-emerald-700'}`}>
                  Status Mutu
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-800">{detail?.fertilizations?.length ?? 5}</div>
                <div className="font-mono text-[11px] sm:text-xs text-amber-700 uppercase font-bold">Jadwal Pupuk</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-center">
                <div className="font-heading text-xl sm:text-2xl font-bold text-purple-800">{detail?.aiLogs?.length ?? 1}</div>
                <div className="font-mono text-[11px] sm:text-xs text-purple-700 uppercase font-bold">Scan AI</div>
              </div>
            </div>

            {/* Planted & Location Details */}
            <div className="bg-stone-50 p-4 rounded-2xl space-y-2 border border-stone-200">
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-stone-500">Petani Pengelola:</span>
                <span className="text-stone-800 font-bold">{batch.farmerName || 'Budi Santoso'}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-stone-500">Tanggal Tanam:</span>
                <span className="text-stone-800 font-bold">{batch.plantedDate || '10 Jan 2026'}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="text-stone-500">Sertifikasi Organik:</span>
                <span className="text-emerald-700 font-bold">✓ Terverifikasi Standar Desa Bibis</span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-stone-700 text-sm">
              <p className="font-medium">{detail?.notes || 'Pohon dirawat dengan standar budidaya organik Desa Bibis, Magetan.'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`/trace/${batch.treeCode || batch.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold text-forest-700 hover:text-forest-900 px-4 py-2.5 rounded-xl border border-forest-700/30 min-h-[44px] transition-colors"
            >
              Lihat di Halaman Publik <ExternalLink size={15} />
            </a>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm px-6 py-2.5 rounded-xl min-h-[44px] cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Add Batch / Tree Modal Component (FR-1) ───────────────
function AddBatchModal({ onClose, onSuccess }) {
  const [farmers, setFarmers] = useState([])
  const [formData, setFormData] = useState({
    treeCode: `PHN-BBS-${Math.floor(100 + Math.random() * 900)}`,
    locationBlock: 'Blok A-01',
    variety: 'Jeruk Bali Merah',
    plantingDate: new Date().toISOString().split('T')[0],
    coordinates: '7°37\'42"S 111°26\'18"E',
    farmerId: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAdminFarmers().then(setFarmers)
  }, [])

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
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <TreePine size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">Tambah Pohon Baru</h3>
                <p className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold">Auto Generate 5 Jadwal Pupuk</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 pb-8 space-y-4">
              <div>
                <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">
                  ID / Kode Pohon
                </label>
                <input
                  type="text"
                  required
                  value={formData.treeCode}
                  onChange={(e) => setFormData({ ...formData, treeCode: e.target.value })}
                  placeholder="Contoh: PHN-BBS-010"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">
                  Petani Penanggung Jawab
                </label>
                <select
                  value={formData.farmerId}
                  onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20 transition-all"
                >
                  <option value="">Default (Petani Aktif)</option>
                  {farmers.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">
                    Lokasi Blok
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationBlock}
                    onChange={(e) => setFormData({ ...formData, locationBlock: e.target.value })}
                    placeholder="Blok A-01"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">
                    Tanggal Tanam
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">
                  Varietas Tanaman
                </label>
                <select
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20 transition-all"
                >
                  <option value="Jeruk Bali Merah">Jeruk Bali Merah (Unggulan)</option>
                  <option value="Jeruk Bali Putih">Jeruk Bali Putih</option>
                  <option value="Pamelo Magetan Super">Pamelo Magetan Super</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-body text-base font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 min-h-[44px] cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-forest-800 hover:bg-forest-700 px-6 py-2.5 rounded-xl font-body text-base font-bold text-white flex items-center gap-2 min-h-[44px] cursor-pointer transition-colors shadow-md"
              >
                <Plus size={18} /> {submitting ? 'Menyimpan...' : 'Simpan Pohon'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Edit Batch / Tree Modal Component ─────────────────────
function EditBatchModal({ batch, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    treeCode: batch?.treeCode || batch?.id || '',
    locationBlock: batch?.location || batch?.locationBlock || 'Blok A-01',
    variety: batch?.variety || 'Jeruk Bali Merah',
    healthStatus: batch?.healthStatus || 'Sehat',
    coordinates: batch?.coordinates || '7°37\'42"S 111°26\'18"E'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await updateTreeBatch(batch.dbId || batch.id, formData)
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        >
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">Edit Data Pohon</h3>
                <p className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold">{batch.treeCode || batch.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 pb-8 space-y-4">
              <div>
                <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">Kode Pohon</label>
                <input
                  type="text"
                  required
                  value={formData.treeCode}
                  onChange={(e) => setFormData({ ...formData, treeCode: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">Lokasi Blok</label>
                <input
                  type="text"
                  required
                  value={formData.locationBlock}
                  onChange={(e) => setFormData({ ...formData, locationBlock: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">Status Kesehatan</label>
                  <select
                    value={formData.healthStatus}
                    onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20"
                  >
                    <option value="Sehat">Sehat</option>
                    <option value="Sakit">Sakit / Perlu Karantina</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm font-bold text-stone-800 mb-1.5">Varietas</label>
                  <select
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-3 font-body text-base text-stone-900 focus:outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-600/20"
                  >
                    <option value="Jeruk Bali Merah">Jeruk Bali Merah</option>
                    <option value="Jeruk Bali Putih">Jeruk Bali Putih</option>
                    <option value="Pamelo Magetan Super">Pamelo Magetan Super</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex-shrink-0 p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-body text-base font-bold bg-stone-200 text-stone-800 min-h-[44px]">
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-forest-800 hover:bg-forest-700 px-6 py-2.5 rounded-xl font-body text-base font-bold text-white flex items-center gap-2 min-h-[44px] shadow-md"
              >
                <Save size={18} /> {submitting ? 'Menyimpan...' : 'Perbarui'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────
function DeleteBatchModal({ batch, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await deleteTreeBatch(batch.dbId || batch.id)
    setDeleting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <Trash2 size={26} />
          </div>
          <h3 className="font-heading text-xl font-bold text-stone-900 mb-2">Hapus Pohon Ini?</h3>
          <p className="font-body text-sm text-stone-600 mb-6">
            Pohon <span className="font-bold text-stone-900">{batch?.treeCode || batch?.id}</span> beserta riwayat pemupukan dan scan AI terkait akan dihapus secara permanen dari database kebun.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 min-h-[44px]">
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white min-h-[44px] shadow-md"
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg max-h-[88vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md p-2.5 flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-red-100 border border-red-300 text-red-700' :
                alert.severity === 'medium' ? 'bg-amber-100 border border-amber-300 text-amber-800' :
                'bg-emerald-100 border border-emerald-300 text-emerald-800'
              }`}>
                <AlertTriangle size={26} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">
                  Laporan Deteksi MobileNetV2 · {alert.treeCode || alert.id}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 truncate">
                  {alert.disease}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-stone-600 font-semibold">{alert.batch}</span>
                  <span className="font-mono text-xs text-stone-500">· {alert.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {alert.photoUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200 max-h-48 bg-stone-100 flex items-center justify-center">
                <img src={alert.photoUrl} alt="Sampel Daun" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs uppercase text-stone-500 font-bold">Skor Keyakinan AI</div>
                <div className="font-heading text-2xl font-bold text-stone-900">{alert.confidence}%</div>
              </div>
              <SeverityBadge level={alert.severity} />
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="font-mono text-xs uppercase text-forest-800 font-bold mb-1">
                Gejala Klinis Terdeteksi
              </div>
              <p className="font-body text-sm sm:text-base text-stone-700 leading-relaxed">
                {alert.symptoms || 'Bercak abnormal pada permukaan helai daun dengan pola klorosis khas.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="font-mono text-xs uppercase text-amber-900 font-bold mb-1">
                SOP Rekomendasi Tindakan Kebun
              </div>
              <p className="font-body text-sm sm:text-base text-stone-700 leading-relaxed">
                {alert.advisory || 'Lakukan sanitasi kebun, isolasi pohon yang terindikasi agar tidak menular ke baris lain, serta laporkan ke koordinator POPT setempat.'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-forest-800 hover:bg-forest-700 font-bold text-base px-6 py-2.5 rounded-xl min-h-[44px] text-white cursor-pointer transition-colors shadow-md"
            >
              Tutup Rincian
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Dedicated Direct Login Screen (No Pop-up Modals, No JWT inputs) ──
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setErrorMsg('Harap isi username dan kata sandi.')
      return
    }
    setLoading(true)
    setErrorMsg('')

    const res = await loginFarmer(username.trim(), password)
    setLoading(false)

    if (res.success && res.user) {
      onLoginSuccess(res.user)
    } else {
      setErrorMsg(res.message || 'Login gagal. Periksa kembali username dan kata sandi.')
    }
  }

  const handlePreset = (u, p) => {
    setUsername(u)
    setPassword(p)
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#2d6a4f]/15 to-transparent blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden"
      >
        {/* Header Branding */}
        <div className="p-6 sm:p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50/80 to-white">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
               style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)' }}>
            <span className="font-heading font-bold text-3xl text-white select-none">P</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">Portal Masuk Maxima</h2>
          <p className="font-mono text-xs text-forest-700 font-bold tracking-wider uppercase mt-1">
            Kebun Jeruk Bali · Desa Bibis
          </p>
          <p className="font-body text-xs text-stone-500 mt-1">
            Silakan masukkan username dan kata sandi Anda
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-bold text-stone-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin atau petani1"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:outline-none focus:border-forest-700 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-body text-xs font-bold text-stone-700 mb-1.5">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:outline-none focus:border-forest-700 focus:bg-white transition-colors"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block font-mono text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1.5">
                Akses Cepat Pengujian:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset('admin', 'Admin123!')}
                  className="text-[11px] font-mono font-bold text-forest-800 bg-forest-50 border border-forest-200 px-3 py-2 rounded-xl hover:bg-forest-100 transition-colors text-left cursor-pointer"
                >
                  👑 Admin (admin)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('petani1', 'Petani123!')}
                  className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors text-left cursor-pointer"
                >
                  🧑‍🌾 Petani (petani1)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-800 hover:bg-forest-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md min-h-[48px] flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Public Trace Link */}
          <div className="pt-4 border-t border-stone-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-stone-500 hover:text-forest-800 font-bold transition-colors"
            >
              <QrCode size={13} />
              <span>← Kembali ke Halaman Publik Traceability</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Sidebar Content Component ─────────────────────────────
function SidebarContent({ location, onNavClick, farmSettings, currentUser, onLogout }) {
  const role = currentUser?.role || 'admin'
  const navItems = role === 'admin' ? NAV_ITEMS_ADMIN : NAV_ITEMS_FARMER
  const displayName = currentUser?.name || (role === 'admin' ? 'Admin Maxima' : 'Budi Santoso')
  const displayRole = role === 'admin' ? 'Administrator' : 'Petani Pomelo'
  const displayUsername = currentUser?.username ? `@${currentUser.username}` : (role === 'admin' ? '@admin' : '@petani1')
  const farmLocation = currentUser?.location || farmSettings?.farmName || 'Desa Bibis, Magetan'

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
        <PomeloMark />
        <div>
          <div className="font-display text-lg tracking-[0.06em] font-bold text-white">POMELO TRACE</div>
          <div className="font-mono text-xs tracking-widest uppercase font-semibold text-white/50">
            {role === 'admin' ? 'Portal Administrator' : 'Portal Petani'}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 mx-3 mt-3 rounded-2xl shrink-0 bg-white/[0.08] border border-white/[0.12]">
        <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white/50 mb-0.5">Lokasi & Wilayah</div>
        <div className="font-body text-sm font-bold text-white truncate">{farmLocation}</div>
        <div className="font-mono text-xs text-white/60 mt-0.5">{displayRole} · {displayUsername}</div>
      </div>

      <nav className="flex-1 px-3 mt-3 space-y-1 overflow-y-auto">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 mb-1 font-bold text-white/40">
          Menu {role === 'admin' ? 'Admin' : 'Petani'}
        </div>
        {navItems.map(({ path, icon: Icon, label, exact }) => {
          const active = isActive(path, exact)
          return (
            <Link
              key={path}
              to={path}
              className={`sidebar-nav-item min-h-[46px] text-sm font-semibold ${active ? 'active' : ''}`}
              onClick={onNavClick}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-2 h-2 rounded-full bg-[#74c69d]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Dynamic Profile Tab following logged-in user with prominent Logout button */}
      <div className="mt-auto p-3.5 shrink-0 border-t border-white/[0.10]">
        <div className="p-3 rounded-2xl bg-white/[0.07] border border-white/[0.08]">
          <div className="flex items-center gap-2.5 min-w-0 mb-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 ${
              role === 'admin' ? 'bg-[#2d6a4f] text-white shadow-xs' : 'bg-[#e76f51] text-white shadow-xs'
            }`}>
              {getInitials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-body text-sm font-bold text-white truncate">{displayName}</div>
              <div className="font-mono text-[11px] text-white/60 truncate">{displayRole} · {displayUsername}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-200 hover:text-white font-body text-xs font-bold transition-colors cursor-pointer"
            title="Keluar dari sesi portal"
          >
            <LogOut size={14} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    </>
  )
}

// ── 1. Dashboard Overview Page ────────────────────────────
function DashboardOverview({ farmSettings }) {
  const [stats, setStats] = useState([])
  const [healthTrend, setHealthTrend] = useState([])
  const [fertilizerSchedule, setFertilizerSchedule] = useState([])
  const [aiAlerts, setAiAlerts] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [timeframe, setTimeframe] = useState('7m')

  useEffect(() => {
    fetchDashboardStats().then(setStats)
    fetchFertilizerSchedule().then(setFertilizerSchedule)
    fetchAIAlerts().then(setAiAlerts)
  }, [])

  useEffect(() => {
    fetchHealthTrend(timeframe).then(setHealthTrend)
  }, [timeframe])

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      {/* Welcome heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">
            Selamat datang, <span className="text-forest-800">{farmSettings?.farmerName || 'Pak Suwanto'}</span>
          </h1>
          <p className="font-body text-base text-stone-600 mt-1 font-medium">
            Ringkasan kebun pomelo Anda — {farmSettings?.farmName || 'Desa Bibis, Magetan'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/trees"
            className="btn-action-green text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md"
          >
            <TreePine size={16} /> Kelola Pohon
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon || TreePine
          return (
            <motion.div key={s.label} variants={staggerItem} className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-stone-500 font-bold">{s.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.accent}20`, color: s.accent }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">{s.value}</div>
              <div className="font-mono text-xs text-stone-500 mt-1 flex items-center gap-1 font-medium">
                {s.trend === 'up' ? <ArrowUpRight size={13} className="text-emerald-600" /> : <ArrowDownRight size={13} className="text-red-500" />}
                <span>{s.sub}</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Monthly Health Trend Chart */}
      <motion.div variants={staggerItem} className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">
              Tren Kesehatan Kebun
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Pohon Sehat vs Terdeteksi Penyakit
            </h3>
          </div>
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 self-start sm:self-auto">
            {['3m', '7m', '1y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  timeframe === t ? 'bg-forest-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthTrend}>
              <defs>
                <linearGradient id="healthyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#a8a29e" tickLine={false} />
              <YAxis stroke="#a8a29e" tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="healthy" stroke="#2d6a4f" strokeWidth={2.5} fillOpacity={1} fill="url(#healthyGradient)" name="Pohon Sehat" />
              <Area type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#flaggedGradient)" name="Terindikasi Sakit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Grid: AI Alerts & Fertilizer Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent AI Alerts */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">MobileNetV2</span>
              <h3 className="font-heading text-lg font-bold text-stone-900">Alert Penyakit Terkini</h3>
            </div>
            <Link to="/admin/ai-scan" className="text-xs font-mono font-bold text-forest-700 hover:underline flex items-center gap-1">
              Buka Deteksi <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {aiAlerts.slice(0, 4).map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAlert(a)}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-forest-600 bg-stone-50/60 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-body text-sm font-bold text-stone-900 truncate">{a.disease}</div>
                  <div className="font-mono text-xs text-stone-500 mt-0.5">{a.treeCode || a.id} · {a.batch}</div>
                </div>
                <SeverityBadge level={a.severity} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Fertilizer */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">Jadwal Kalender</span>
              <h3 className="font-heading text-lg font-bold text-stone-900">Pemupukan Mendatang</h3>
            </div>
            <Link to="/admin/fertilize" className="text-xs font-mono font-bold text-forest-700 hover:underline flex items-center gap-1">
              Kelola Jadwal <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {fertilizerSchedule.slice(0, 4).map((f) => (
              <div key={f.id} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-body text-sm font-bold text-stone-900 truncate">{f.type}</div>
                  <div className="font-mono text-xs text-stone-500 mt-0.5">{f.treeCode || f.batch} · {f.date}</div>
                </div>
                {f.status === 'done' ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-100 text-emerald-800">Selesai</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-100 text-amber-800">Terjadwal</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAlert && <AIAlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />}
    </motion.div>
  )
}

// ── 2. Tree & Land Management Page (CRUD) ─────────────────
function TreeBatchesPage() {
  const [batches, setBatches] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDetailBatch, setSelectedDetailBatch] = useState(null)
  const [editingBatch, setEditingBatch] = useState(null)
  const [deletingBatch, setDeletingBatch] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const loadBatches = useCallback(() => {
    fetchTreeBatches({ query: searchQuery, status: statusFilter }).then(setBatches)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    loadBatches()
    setCurrentPage(1)
  }, [loadBatches])

  const totalPages = Math.ceil(batches.length / itemsPerPage) || 1
  const paginatedBatches = batches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">Pohon & Lahan Jeruk Pamelo</h1>
          <p className="font-body text-base text-stone-600 mt-1 font-medium">
            Manajemen pohon terdaftar, kalkulasi umur, dan isolasi status mutu budidaya
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-action-green text-white font-bold text-base px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto min-h-[48px]"
        >
          <Plus size={20} /> Tambah Pohon Baru
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari kode pohon, lokasi blok, varietas, atau nama petani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-10 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-forest-700"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 p-1">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all',     label: 'Semua Pohon' },
            { id: 'healthy', label: '100% Sehat' },
            { id: 'flagged', label: 'Sakit / Karantina' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id ? 'bg-forest-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trees */}
      {batches.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center text-stone-500 font-medium">
          Tidak ada data pohon yang sesuai filter pencarian.
        </div>
      ) : (
        <>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {paginatedBatches.map((b) => {
              const isSick = b.healthStatus === 'Sakit' || b.flagged > 0
              return (
                <motion.div key={b.id || b.dbId} variants={staggerItem} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-forest-700/50 transition-all">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold block">{b.location || b.locationBlock}</span>
                        <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-0.5">{b.treeCode || b.id}</h3>
                        <p className="font-body text-sm font-semibold text-stone-600">{b.variety}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                        isSick ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isSick ? 'Sakit' : 'Sehat'}
                      </span>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 mb-4 text-xs font-mono text-stone-600">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Petani:</span>
                        <span className="font-bold text-stone-800">{b.farmerName || 'Budi Santoso'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Tgl Tanam:</span>
                        <span className="font-bold text-stone-800">{b.plantedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Umur:</span>
                        <span className="font-bold text-stone-800">{b.ageMonths || 8} Bulan</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDetailBatch(b)}
                      className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Lihat Rincian Pohon"
                    >
                      <Eye size={16} /> Rincian
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBatch(b)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                        title="Edit Data Pohon"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingBatch(b)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                        title="Hapus Pohon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={batches.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {selectedDetailBatch && (
        <BatchDetailModal
          batch={selectedDetailBatch}
          onClose={() => setSelectedDetailBatch(null)}
        />
      )}
      {showAddModal && <AddBatchModal onClose={() => setShowAddModal(false)} onSuccess={loadBatches} />}
      {editingBatch && <EditBatchModal batch={editingBatch} onClose={() => setEditingBatch(null)} onSuccess={loadBatches} />}
      {deletingBatch && <DeleteBatchModal batch={deletingBatch} onClose={() => setDeletingBatch(null)} onSuccess={loadBatches} />}
    </motion.div>
  )
}

// ── 3. Fertilization Schedules Page (CRUD & Complete) ─────
function FertilizerManagementPage() {
  const [schedules, setSchedules] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadData = useCallback(() => {
    fetchFertilizerSchedule({ query: searchQuery, status: statusFilter }).then(setSchedules)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    loadData()
    setCurrentPage(1)
  }, [loadData])

  const totalPages = Math.ceil(schedules.length / itemsPerPage) || 1
  const paginatedSchedules = schedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">Jadwal Pemupukan</h1>
          <p className="font-body text-base text-stone-600 mt-1 font-medium">
            Program pemupukan berkala otomatis (Day 7, 30, 60, 90, 180) & status eksekusi lapangan
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-action-green text-white font-bold text-base px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto min-h-[48px]"
        >
          <Plus size={20} /> Tambah Jadwal Manual
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari ID jadwal, kode pohon, lokasi, atau jenis pupuk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-10 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-forest-700"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 p-1">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all',       label: 'Semua Jadwal' },
            { id: 'scheduled', label: 'Terjadwal' },
            { id: 'done',      label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id ? 'bg-forest-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-stone-200 font-mono text-xs uppercase tracking-wider text-stone-500 pb-3">
                <th className="pb-3 px-3">Kode Pohon / ID</th>
                <th className="pb-3 px-3">Lokasi Blok</th>
                <th className="pb-3 px-3">Jenis Pupuk</th>
                <th className="pb-3 px-3">Tanggal Jadwal</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-stone-500 font-medium">
                    Tidak ada jadwal pemupukan ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedSchedules.map((f) => (
                  <tr key={f.id || f.dbId} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-sans font-bold tracking-tight text-forest-800 text-sm">
                      {f.treeCode || f.id}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-stone-900 text-sm">
                      {f.batch}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-stone-700 text-sm">
                      {f.type}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs font-semibold text-stone-600">
                      {f.date}
                    </td>
                    <td className="py-3.5 px-3">
                      {f.status === 'done' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                          <Check size={13} /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-amber-100 text-amber-800">
                          <Clock size={13} /> Terjadwal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(f.id)}
                          title={f.status === 'done' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                          className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                            f.status === 'done'
                              ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          title="Hapus Jadwal"
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={schedules.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showAddModal && (
        <AddFertilizerModal onClose={() => setShowAddModal(false)} onSuccess={loadData} />
      )}
    </motion.div>
  )
}

function AddFertilizerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    batch: 'Blok A-01',
    treeCode: 'PHN-BBS-001',
    trees: 20,
    type: 'Kompos Kascing',
    date: new Date().toISOString().split('T')[0],
    notes: 'Dosis 2kg/pohon'
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50/80">
            <h3 className="font-heading text-xl font-bold text-stone-900">Tambah Jadwal Pupuk</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 text-stone-500"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Kode Pohon</label>
              <input
                type="text"
                required
                value={formData.treeCode}
                onChange={(e) => setFormData({ ...formData, treeCode: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Jenis Pupuk</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:border-forest-700"
              >
                <option value="Kompos Kascing">Kompos Kascing (Kasut Cacing)</option>
                <option value="MOL Bonggol">MOL Bonggol Pisang</option>
                <option value="Pupuk Kalium Organik">Pupuk Kalium Organik</option>
                <option value="NPK 16-16-16 Vegetatif">NPK 16-16-16 Vegetatif</option>
                <option value="Starter Organik">Starter Organik</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal Pelaksanaan</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Catatan & Dosis</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 text-sm focus:border-forest-700"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold">Batal</button>
              <button type="submit" className="px-5 py-2 bg-forest-800 text-white rounded-xl font-bold shadow-md">Simpan</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Live Camera Scanner Modal ──────────────────────────────
function CameraScannerModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // Default back camera for mobile
  const [cameraError, setCameraError] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)

  const stopTracks = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = useCallback(async (mode) => {
    stopTracks()
    setIsInitializing(true)
    setCameraError('')
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera langsung.')
      }
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }
      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda.'
          : 'Kamera tidak dapat diakses atau sedang digunakan aplikasi lain.'
      )
    } finally {
      setIsInitializing(false)
    }
  }, [stopTracks])

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode)
    } else {
      stopTracks()
    }
    return () => {
      stopTracks()
    }
  }, [isOpen, facingMode, startCamera, stopTracks])

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    startCamera(nextMode)
  }

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `scan_daun_kamera_${Date.now()}.jpg`, { type: 'image/jpeg' })
        stopTracks()
        onCapture(file)
        onClose()
      }
    }, 'image/jpeg', 0.92)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => {
            stopTracks()
            onClose()
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg bg-stone-900 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-stone-900/90">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">Kamera Scanner Daun</h3>
                <p className="font-mono text-[11px] text-emerald-400 font-bold uppercase">
                  {facingMode === 'environment' ? 'Kamera Belakang (HP)' : 'Kamera Depan / Webcam'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                stopTracks()
                onClose()
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video Viewfinder */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[380px]">
            {cameraError ? (
              <div className="p-6 text-center max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
                  <CameraOff size={24} />
                </div>
                <h4 className="font-heading text-lg font-bold text-white mb-1">Gagal Membuka Kamera</h4>
                <p className="font-body text-xs text-stone-400 leading-relaxed mb-4">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />

                {/* Viewfinder Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-emerald-400/70 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                    {/* Scanning Laser Line */}
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399]"
                    />
                  </div>
                  <span className="mt-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    Arahkan daun jeruk ke dalam kotak
                  </span>
                </div>
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls Footer */}
          <div className="p-4 sm:p-5 bg-stone-950 border-t border-white/10 flex items-center justify-between gap-3">
            {/* Switch Camera Button (for phones/devices with multiple cameras) */}
            <button
              type="button"
              onClick={handleSwitchCamera}
              disabled={Boolean(cameraError)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white transition-colors flex items-center gap-2 text-xs font-mono font-bold cursor-pointer"
              title="Ganti Kamera Depan/Belakang"
            >
              <SwitchCamera size={18} />
              <span className="hidden sm:inline">Ganti Kamera</span>
            </button>

            {/* Shutter Button */}
            <button
              type="button"
              onClick={handleCapturePhoto}
              disabled={Boolean(cameraError) || isInitializing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/30 cursor-pointer"
            >
              <Camera size={20} />
              <span>Ambil Foto Daun</span>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                stopTracks()
                onClose()
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── 4. AI Leaf Disease Detection & Logs (FR-5) ────────────
function AIScanPage({ onScanComplete }) {
  const [alerts, setAlerts] = useState([])
  const [trees, setTrees] = useState([])
  const [selectedTreeId, setSelectedTreeId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [latestResult, setLatestResult] = useState(null)
  const [selectedAlertDetail, setSelectedAlertDetail] = useState(null)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const fileInputRef = useRef(null)
  const nativeCameraInputRef = useRef(null)
  const navigate = useNavigate()

  const loadAlerts = useCallback(() => {
    fetchAIAlerts({ query: searchQuery, severity: severityFilter }).then(setAlerts)
  }, [searchQuery, severityFilter])

  useEffect(() => {
    loadAlerts()
    setCurrentPage(1)
    fetchTreeBatches().then(res => {
      setTrees(res)
      if (res.length > 0 && !selectedTreeId) {
        setSelectedTreeId(res[0].dbId || res[0].id)
      }
    })
  }, [loadAlerts])

  const totalPages = Math.ceil(alerts.length / itemsPerPage) || 1
  const paginatedAlerts = alerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const processAnalysis = async (file = null) => {
    setIsAnalyzing(true)
    setLatestResult(null)
    const result = await analyzeLeafPhoto(file, selectedTreeId)
    setIsAnalyzing(false)
    setLatestResult(result)
    loadAlerts()
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = ''

    // If diagnosis succeeds, notify context & auto-navigate to Chatbot Consultation page
    if (result && !result.error) {
      const selectedTree = trees.find(t => (t.dbId || t.id) === selectedTreeId) || trees[0]
      const scanContext = {
        treeId: selectedTreeId,
        treeCode: selectedTree?.treeCode || result.treeCode || 'PHN-BBS-001',
        variety: selectedTree?.variety || result.variety || 'Jeruk Bali Merah',
        location: selectedTree?.location || selectedTree?.locationBlock || result.batch || 'Blok A-01',
        farmerName: selectedTree?.farmerName || 'Budi Santoso',
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        isSick: result.isSick,
        symptoms: result.symptoms,
        advisory: result.advisory,
        photoUrl: result.photoUrl,
        satpam: result.satpam,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      if (typeof onScanComplete === 'function') {
        onScanComplete(scanContext)
      }

      // Smooth auto transition to Chatbot Consultation Page after 1.2s
      setTimeout(() => {
        navigate('/admin/chat')
      }, 1200)
    }
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
        <span className="bg-forest-100 text-forest-800 border border-forest-200 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg font-bold">
          Gatekeeper & MobileNetV2 Active
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-2">Deteksi Penyakit AI</h1>
        <p className="font-body text-base text-stone-600 mt-1 font-medium">
          Ambil foto daun via kamera HP / Laptop atau unggah foto, diagnosis otomatis penyakit botani jeruk bali.
        </p>
      </div>

      {/* Hidden File & Native Camera Inputs */}
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
      <input type="file" ref={nativeCameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

      {/* Target Tree Selector */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="font-mono text-xs uppercase text-forest-700 font-bold block">Pilih Target Pohon yang Discan</span>
          <p className="font-body text-sm font-semibold text-stone-800">Hubungkan hasil diagnosa AI langsung dengan kode pohon di database:</p>
        </div>
        <select
          value={selectedTreeId}
          onChange={(e) => setSelectedTreeId(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 font-bold text-sm text-stone-900 focus:outline-none focus:border-forest-700 min-w-[220px]"
        >
          {trees.map(t => (
            <option key={t.dbId || t.id} value={t.dbId || t.id}>
              {t.treeCode || t.id} — {t.location || t.locationBlock} ({t.variety})
            </option>
          ))}
        </select>
      </div>

      {/* Result Notification Banner */}
      {latestResult && (
        latestResult.error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-red-50 border border-red-200 shadow-md flex items-start gap-4 text-red-900"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-700">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-red-700 font-bold tracking-wider mb-0.5">
                Peringatan Verifikasi AI Gatekeeper
              </div>
              <div className="font-heading text-lg font-bold text-red-900">
                {latestResult.message || 'Gambar tidak valid atau objek bukan daun Jeruk Bali.'}
              </div>
              <p className="text-xs text-red-700 mt-1">
                Sistem Gatekeeper memastikan hanya citra daun/tanaman jeruk bali yang dapat diproses untuk menjaga akurasi diagnosis botani.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-white border border-emerald-300 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs uppercase text-forest-700 font-bold tracking-wider">
                  Hasil Diagnosis Selesai ({latestResult.id})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                  Mengalihkan ke Konsultasi AI...
                </span>
              </div>
              <div className="font-heading text-2xl font-bold text-stone-900">
                {latestResult.disease}
              </div>
              <div className="font-mono text-xs text-stone-600 mt-1 font-medium">
                Confidence: <span className="font-bold text-stone-800">{latestResult.confidence}%</span> · Severity: <span className="font-bold uppercase">{latestResult.severity}</span>
                {latestResult.satpam?.skor_keyakinan_daun_persen && (
                  <span> · Satpam AI: <span className="font-bold text-emerald-700">{latestResult.satpam.skor_keyakinan_daun_persen}% Lolos</span></span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedAlertDetail(latestResult)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Eye size={16} /> SOP Detail
              </button>
              <button
                onClick={() => navigate('/admin/chat')}
                className="btn-action-green text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer min-h-[44px]"
              >
                <MessageSquare size={16} /> Konsultasi Sekarang
              </button>
            </div>
          </motion.div>
        )
      )}

      {/* Upload & Camera Trigger Zone */}
      <motion.div
        variants={staggerItem}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-9 text-center transition-all shadow-xs relative overflow-hidden ${
          isAnalyzing ? 'border-amber-400 bg-amber-50/60' : 'border-forest-200 hover:border-forest-400 bg-emerald-50/30'
        }`}
      >
        {isAnalyzing ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-forest-800 text-white shadow-md"
            >
              <Zap size={32} />
            </motion.div>
            <h3 className="font-heading text-2xl font-bold text-stone-800 mb-1">
              Menganalisis Daun Melalui Gateway AI...
            </h3>
            <p className="font-mono text-xs text-forest-700 font-bold uppercase tracking-wider">
              Verifikasi Daun Satpam & Model Klasifikasi Pakar
            </p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-forest-800 text-white shadow-md">
              <Camera size={32} />
            </div>
            <h3 className="font-heading text-2xl font-bold text-stone-900 mb-1">
              Pindai & Deteksi Daun Jeruk
            </h3>
            <p className="font-body text-sm text-stone-500 font-medium max-w-md mx-auto">
              Gunakan kamera langsung dari HP / Webcam Laptop atau pilih file foto daun untuk mendeteksi penyakit tanaman secara akurat.
            </p>

            <div className="mt-6 pt-5 border-t border-stone-200/80 flex flex-wrap items-center justify-center gap-3">
              {/* Single Unified Camera Button */}
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2.5 cursor-pointer shadow-md min-h-[46px] transition-all hover:scale-102"
              >
                <Camera size={19} />
                <span>Buka Kamera</span>
              </button>

              {/* Gallery / File Picker */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-sm px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors min-h-[46px]"
              >
                <Upload size={18} />
                <span>Pilih dari Galeri</span>
              </button>

              {/* Quick Simulation */}
              <button
                type="button"
                onClick={() => processAnalysis()}
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-sm px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-md min-h-[46px]"
              >
                <Zap size={18} />
                <span>Simulasi Cepat</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Live Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(file) => processAnalysis(file)}
      />

      {/* Search & Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari ID log, kode pohon, atau jenis penyakit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-10 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-forest-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all',    label: 'Semua Log' },
            { id: 'high',   label: 'Tinggi (Bahaya)' },
            { id: 'medium', label: 'Sedang' },
            { id: 'low',    label: 'Rendah (Aman)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSeverityFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                severityFilter === tab.id ? 'bg-forest-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Log List */}
      <div className="space-y-3">
        <div className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold mb-2">
          Riwayat Deteksi AI Terdaftar ({alerts.length})
        </div>
        {alerts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center text-stone-500 font-medium">
            Belum ada riwayat deteksi yang sesuai filter.
          </div>
        ) : (
          <>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {paginatedAlerts.map((a) => (
                <motion.div
                  key={a.id || a.dbId}
                  variants={staggerItem}
                  onClick={() => setSelectedAlertDetail(a)}
                  className="bg-white border border-stone-200 hover:border-forest-700/60 p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      a.severity === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                      a.severity === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-stone-500">{a.treeCode || a.id} · {a.batch}</div>
                      <div className="font-heading text-base sm:text-lg font-bold text-stone-900 truncate">{a.disease}</div>
                      <div className="font-mono text-xs text-stone-500">Keyakinan: {a.confidence}% · {a.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge level={a.severity} />
                    <div className="p-2 rounded-xl bg-stone-100 text-stone-600 hidden sm:flex"><Eye size={16} /></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={alerts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {selectedAlertDetail && <AIAlertDetailModal alert={selectedAlertDetail} onClose={() => setSelectedAlertDetail(null)} />}
    </motion.div>
  )
}

// ── 4B. AI Consultation Page / Chatbot Fullview ───────────
function AIConsultationPage({ scannedLeafContext, onClearContext }) {
  const [trees, setTrees] = useState([])
  const [selectedTreeId, setSelectedTreeId] = useState('')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const initializedContextRef = useRef(null)

  // Load tree database
  useEffect(() => {
    fetchTreeBatches().then(res => {
      setTrees(res)
      if (res.length > 0 && !selectedTreeId) {
        if (scannedLeafContext?.treeId) {
          setSelectedTreeId(scannedLeafContext.treeId)
        } else {
          setSelectedTreeId(res[0].dbId || res[0].id)
        }
      }
    })
  }, [scannedLeafContext])

  // Generate initial greeting message based on scan context or general mode
  useEffect(() => {
    if (scannedLeafContext && initializedContextRef.current !== scannedLeafContext.timestamp) {
      initializedContextRef.current = scannedLeafContext.timestamp
      if (scannedLeafContext.treeId) {
        setSelectedTreeId(scannedLeafContext.treeId)
      }

      const initialBotMessage = {
        id: 'init-scan-' + Date.now(),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Halo Petani! Hasil diagnosis AI untuk daun pohon **${scannedLeafContext.treeCode}** (${scannedLeafContext.variety} - ${scannedLeafContext.location}) terdeteksi indikasi: **${scannedLeafContext.disease}** dengan tingkat keyakinan **${scannedLeafContext.confidence}%**.\n\n📌 **Ringkasan SOP & Penanganan Awal:**\n${scannedLeafContext.advisory || scannedLeafContext.symptoms}\n\nSilakan tanyakan apa saja seputar dosis fungisida/bakterisida, jadwal isolasi pohon, cara pemangkasan, atau tindakan lanjutan yang perlu dilakukan! 🍊`
      }
      setMessages([initialBotMessage])
    } else if (!scannedLeafContext && messages.length === 0) {
      setMessages([
        {
          id: 'init-default',
          sender: 'bot',
          time: 'Baru saja',
          text: `Halo! Saya **Maxist**, Asisten AI Pomelo Trace 🍊.\n\nSaya siap membantu Anda dalam:\n• Konsultasi penyakit daun & hama jeruk bali (HLB, Bercak Ganggang, Kudis)\n• Rekomendasi dosis pupuk organik, MOL, dan NPK\n• Standar operasional budidaya & penanganan pohon sakit\n\nPilih pohon target di atas atau langsung tanyakan masalah kebun Anda!`
        }
      ])
    }
  }, [scannedLeafContext])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputValue.trim()
    if (!text || isTyping) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    // Build context payload
    const activeTree = trees.find(t => (t.dbId || t.id) === selectedTreeId) || null
    const historyPayload = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text
    }))

    const dbContext = {
      scannedLeaf: scannedLeafContext ? {
        treeCode: scannedLeafContext.treeCode,
        disease: scannedLeafContext.disease,
        confidence: scannedLeafContext.confidence,
        severity: scannedLeafContext.severity,
        symptoms: scannedLeafContext.symptoms,
        advisory: scannedLeafContext.advisory
      } : null,
      selectedTree: activeTree ? {
        treeCode: activeTree.treeCode || activeTree.id,
        variety: activeTree.variety,
        location: activeTree.location || activeTree.locationBlock,
        farmerName: activeTree.farmerName,
        healthStatus: activeTree.healthStatus
      } : null
    }

    try {
      const reply = await sendChatMessage(
        text,
        selectedTreeId || undefined,
        scannedLeafContext?.photoUrl || undefined,
        historyPayload,
        dbContext
      )

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Mohon maaf, terjadi gangguan koneksi ke server AI Maxist. Silakan ulangi pertanyaan Anda.'
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleResetChat = () => {
    if (scannedLeafContext) {
      setMessages([
        {
          id: 'reset-' + Date.now(),
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Percakapan direset. Konteks aktif: **${scannedLeafContext.treeCode}** (${scannedLeafContext.disease}). Ada yang ingin Anda tanyakan lagi seputar daun pohon ini?`
        }
      ])
    } else {
      setMessages([
        {
          id: 'reset-' + Date.now(),
          sender: 'bot',
          time: 'Baru saja',
          text: 'Halo! Saya Maxist, Asisten AI Pomelo Trace. Silakan tanyakan hal seputar kesehatan pohon atau perawatan kebun jeruk bali.'
        }
      ])
    }
  }

  // Dynamic quick prompt chips
  const quickPrompts = scannedLeafContext ? [
    `Apa rekomendasi obat & fungisida untuk ${scannedLeafContext.disease}?`,
    `Berapa takaran dosis per tangki semprot?`,
    `Apakah pohon ${scannedLeafContext.treeCode} perlu dikarantina?`,
    `Berapa estimasi waktu pemulihan daun ini?`,
    `Bagaimana cara pemangkasan ranting yang tepat?`
  ] : [
    'Bagaimana cara cegah penyakit HLB pada daun jeruk?',
    'Berapa takaran kompos kascing & MOL bonggol pisang?',
    'Kapan waktu pemupukan NPK terbaik untuk fase buah?',
    'Standar mutu panen Jeruk Bali Merah Magetan'
  ]

  const activeTree = trees.find(t => (t.dbId || t.id) === selectedTreeId)

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col min-h-0 h-full space-y-2.5 sm:space-y-3"
    >
      {/* Streamlined Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                Konsultasi & Asisten AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold">
                <Sparkles size={11} className="text-emerald-700" /> Maxist 2.5
              </span>
            </div>
            <p className="font-body text-xs text-stone-500 font-medium">
              Diagnosis patogen daun, rekomendasi obat fungisida, dan SOP perkebunan jeruk pamelo.
            </p>
          </div>
        </div>

        {/* Tree Selector & Top Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5">
            <TreePine size={14} className="text-forest-700" />
            <select
              value={selectedTreeId}
              onChange={(e) => setSelectedTreeId(e.target.value)}
              className="bg-transparent font-bold text-xs text-stone-900 focus:outline-none cursor-pointer max-w-[190px] sm:max-w-[220px]"
            >
              {trees.map(t => (
                <option key={t.dbId || t.id} value={t.dbId || t.id}>
                  {t.treeCode || t.id} ({t.location || t.locationBlock || 'Kebun'})
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/admin/ai-scan"
            className="btn-action-green text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ScanLine size={14} /> Scan Baru
          </Link>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            title="Reset Percakapan"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Active Leaf Context Card (Compact Ribbon) */}
      {scannedLeafContext && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-emerald-50/90 border border-emerald-300/90 rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-2xs shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            {scannedLeafContext.photoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-300 shrink-0">
                <img src={scannedLeafContext.photoUrl} alt="Foto Daun" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
                <Leaf size={18} />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold uppercase text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                  Daun Discan ({scannedLeafContext.treeCode})
                </span>
                <span className="font-heading font-bold text-sm sm:text-base text-stone-900 truncate">
                  {scannedLeafContext.disease}
                </span>
                <SeverityBadge level={scannedLeafContext.severity} />
                <span className="font-mono text-[11px] text-emerald-900 font-semibold">
                  {scannedLeafContext.confidence}% Akurasi
                </span>
              </div>
              <p className="font-body text-[11px] sm:text-xs text-stone-600 truncate mt-0.5">
                {scannedLeafContext.advisory || scannedLeafContext.symptoms}
              </p>
            </div>
          </div>

          <button
            onClick={onClearContext}
            className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 font-mono text-[11px] font-bold border border-emerald-300/80 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            Lepas Konteks
          </button>
        </motion.div>
      )}

      {/* Main Chat Box — Full Height with Smooth Scroll */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-4 bg-[#fcfbfa] overscroll-contain">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 relative group break-words ${
                  m.sender === 'user'
                    ? 'bg-forest-800 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs shadow-2xs'
                }`}
              >
                {m.sender === 'user' ? (
                  <p className="font-body text-xs sm:text-sm leading-relaxed whitespace-pre-line text-white">
                    {m.text}
                  </p>
                ) : (
                  <MarkdownRenderer content={m.text} />
                )}

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-stone-100/40">
                  <span className={`font-mono text-[10px] ${m.sender === 'user' ? 'text-emerald-200' : 'text-stone-400'}`}>
                    {m.time}
                  </span>

                  {m.sender === 'bot' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="opacity-60 group-hover:opacity-100 text-stone-500 hover:text-forest-800 transition-opacity flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                      title="Salin jawaban AI"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check size={11} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 items-center"
            >
              <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-2 shadow-2xs">
                <span className="font-body text-xs font-semibold text-stone-600">Maxist sedang menganalisis...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3.5 py-2 bg-stone-50 border-t border-stone-200/90 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-forest-50 hover:text-forest-800 hover:border-forest-300 text-stone-700 border border-stone-200 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="p-2.5 sm:p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              scannedLeafContext
                ? `Tanyakan detail cara obat/penanganan untuk daun ${scannedLeafContext.disease}...`
                : 'Tanyakan rekomendasi dosis obat, pemupukan, atau panduan panen...'
            }
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-colors"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="btn-action-green text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:hover:opacity-40 shrink-0 text-xs sm:text-sm min-h-[42px]"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>
    </motion.div>
  )
}

// ── 5. Harvests Management & QR PDF Verification (FR-4) ───
function HarvestsPage() {
  const [harvests, setHarvests] = useState([])
  const [trees, setTrees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showReportModal, setShowReportModal] = useState(false)
  const [verifyingHarvest, setVerifyingHarvest] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const loadData = useCallback(() => {
    fetchAdminHarvests({ query: searchQuery, status: statusFilter }).then(setHarvests)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    loadData()
    setCurrentPage(1)
    fetchTreeBatches().then(setTrees)
  }, [loadData])

  const totalPages = Math.ceil(harvests.length / itemsPerPage) || 1
  const paginatedHarvests = harvests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">Lapor & Verifikasi Panen</h1>
          <p className="font-body text-base text-stone-600 mt-1 font-medium">
            Verifikasi mutu panen jeruk bali, penerbitan Batch ID unik, & cetak file stiker QR Code PDF siap print
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="btn-action-green text-white font-bold text-base px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto min-h-[48px]"
        >
          <Plus size={20} /> Lapor Panen Baru
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center gap-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari Batch ID panen, kode pohon, varietas, atau nama petani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-10 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-forest-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all',      label: 'Semua Laporan' },
            { id: 'Pending',  label: 'Menunggu Verifikasi' },
            { id: 'Verified', label: 'Terverifikasi (Siap Cetak)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id ? 'bg-forest-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Harvest Reports Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-stone-200 font-mono text-xs uppercase tracking-wider text-stone-500 pb-3">
                <th className="pb-3 px-3">Batch ID / Kode Pohon</th>
                <th className="pb-3 px-3">Petani & Lokasi</th>
                <th className="pb-3 px-3">Tgl Panen</th>
                <th className="pb-3 px-3">Estimasi Buah</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Aksi & Stiker QR PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {harvests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-stone-500 font-medium">
                    Belum ada data laporan panen.
                  </td>
                </tr>
              ) : (
                paginatedHarvests.map((h) => {
                  const isVerified = h.status === 'Verified'
                  return (
                    <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-mono font-bold text-forest-800 text-sm">{h.batchId}</div>
                        <div className="font-mono text-xs text-stone-500">{h.treeCode} · {h.variety}</div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-semibold text-stone-900 text-sm">{h.farmerName || 'Budi Santoso'}</div>
                        <div className="font-mono text-xs text-stone-500">{h.locationBlock || 'Desa Bibis'}</div>
                      </td>
                      <td className="py-4 px-3 font-mono text-xs text-stone-700 font-semibold">
                        {h.harvestDate}
                      </td>
                      <td className="py-4 px-3 font-bold text-stone-900 text-sm">
                        {h.estimatedFruits} buah
                      </td>
                      <td className="py-4 px-3">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={13} /> Menunggu Admin
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isVerified ? (
                            <>
                              {h.qrPdfPath ? (
                                <a
                                  href={h.qrPdfPath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-action-green text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                                >
                                  <Download size={14} /> Unduh PDF Stiker QR
                                </a>
                              ) : (
                                <button
                                  onClick={() => setVerifyingHarvest(h)}
                                  className="bg-forest-50 text-forest-800 border border-forest-300 font-bold text-xs px-3 py-2 rounded-xl hover:bg-forest-100"
                                >
                                  <RefreshCw size={13} className="inline mr-1" /> Re-generate PDF
                                </button>
                              )}
                              <a
                                href={`/trace/${h.batchId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
                                title="Buka Halaman Traceability"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </>
                          ) : (
                            <button
                              onClick={() => setVerifyingHarvest(h)}
                              className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                            >
                              <ShieldCheck size={15} /> Verifikasi & Buat QR PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={harvests.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showReportModal && (
        <ReportHarvestModal trees={trees} onClose={() => setShowReportModal(false)} onSuccess={loadData} />
      )}
      {verifyingHarvest && (
        <VerifyHarvestModal harvest={verifyingHarvest} onClose={() => setVerifyingHarvest(null)} onSuccess={loadData} />
      )}
    </motion.div>
  )
}

function ReportHarvestModal({ trees, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    treeId: trees.length > 0 ? (trees[0].dbId || trees[0].id) : '',
    harvestDate: new Date().toISOString().split('T')[0],
    estimatedFruits: 45,
    notes: 'Kualitas panen grade A super'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await reportHarvest(formData)
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
            <h3 className="font-heading text-xl font-bold text-stone-900">Lapor Siap Panen</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 text-stone-500"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Pohon yang Dipanen</label>
              <select
                value={formData.treeId}
                onChange={(e) => setFormData({ ...formData, treeId: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              >
                {trees.map(t => (
                  <option key={t.dbId || t.id} value={t.dbId || t.id}>
                    {t.treeCode || t.id} — {t.location || t.locationBlock} ({t.variety})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal Panen</label>
              <input
                type="date"
                required
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Estimasi Jumlah Buah (Butir)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.estimatedFruits}
                onChange={(e) => setFormData({ ...formData, estimatedFruits: Number(e.target.value) })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Mutu</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold">Batal</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-forest-800 text-white rounded-xl font-bold shadow-md">
                {submitting ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function VerifyHarvestModal({ harvest, onClose, onSuccess }) {
  const [stickerCount, setStickerCount] = useState(6)
  const [verifying, setVerifying] = useState(false)
  const [resultData, setResultData] = useState(null)

  const handleVerify = async () => {
    setVerifying(true)
    const res = await verifyHarvestAndGenerateQR(harvest.id, { stickerCount })
    setVerifying(false)
    if (res.success) {
      setResultData(res.data)
      onSuccess()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
            <h3 className="font-heading text-xl font-bold text-stone-900">Verifikasi Panen & Buat QR PDF</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 text-stone-500"><X size={18} /></button>
          </div>

          {resultData ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 size={30} />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-stone-900">Batch Berhasil Diverifikasi!</h4>
                <p className="font-mono text-xs text-forest-700 font-bold mt-1">{resultData.batchId}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-mono text-stone-600 break-all">
                {resultData.traceUrl}
              </div>
              {resultData.pdfDownloadUrl && (
                <a
                  href={resultData.pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-action-green text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Download size={18} /> Unduh File PDF Stiker QR
                </a>
              )}
              <button onClick={onClose} className="w-full bg-stone-200 text-stone-800 font-bold py-2.5 rounded-xl">
                Selesai
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Sistem akan memvalidasi histori pohon <span className="font-bold text-stone-900">{harvest.treeCode}</span>, menghasilkan Batch ID resmi, dan membuat file PDF lembar stiker QR Code panen siap cetak.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Jumlah Stiker QR per Lembar PDF</label>
                <select
                  value={stickerCount}
                  onChange={(e) => setStickerCount(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm font-bold"
                >
                  <option value="6">6 Stiker (Layout 2x3)</option>
                  <option value="12">12 Stiker (Layout 3x4)</option>
                  <option value="24">24 Stiker (Layout 4x6)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold">Batal</button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying}
                  className="px-5 py-2 bg-forest-800 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                >
                  <FileCheck size={16} /> {verifying ? 'Memproses...' : 'Proses Verifikasi'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── 6. Farmers Account Management Page (CRUD) ─────────────
function FarmersPage() {
  const [farmers, setFarmers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFarmer, setEditingFarmer] = useState(null)
  const [deletingFarmer, setDeletingFarmer] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const loadFarmers = useCallback(() => {
    fetchAdminFarmers().then(setFarmers)
  }, [])

  useEffect(() => {
    loadFarmers()
    setCurrentPage(1)
  }, [loadFarmers])

  const filtered = farmers.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginatedFarmers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">Petani Terdaftar</h1>
          <p className="font-body text-base text-stone-600 mt-1 font-medium">
            Kelola akun petani Desa Bibis, alokasi pohon binaan, & hak akses sistem kebun
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-action-green text-white font-bold text-base px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto min-h-[48px]"
        >
          <Plus size={20} /> Tambah Petani Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs">
        <Search size={18} className="text-stone-400" />
        <input
          type="text"
          placeholder="Cari nama petani, username, atau lokasi blok kebun..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-stone-900 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-stone-400 p-1"><X size={16} /></button>
        )}
      </div>

      {/* Grid of Farmers */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center text-stone-500 font-medium">
          Tidak ada data petani terdaftar yang sesuai filter.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {paginatedFarmers.map(f => (
              <div key={f.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-forest-700/50 transition-all">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md">
                        {getInitials(f.name)}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-stone-900 leading-tight">{f.name}</h3>
                        <span className="font-mono text-xs text-forest-700 font-bold">@{f.username || 'petani'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 mb-4 text-xs font-mono text-stone-600">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-stone-400" />
                      <span className="text-stone-800 font-semibold">Username: @{f.username || 'petani'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-stone-400" />
                      <span className="text-stone-800">{f.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-stone-400" />
                      <span className="text-stone-800">{f.location || 'Desa Bibis, Magetan'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <div className="font-heading text-lg font-bold text-emerald-900">{f.treeCount ?? 0}</div>
                      <div className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Pohon Dikelola</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                      <div className="font-heading text-lg font-bold text-purple-900">{f.harvestCount ?? 0}</div>
                      <div className="font-mono text-[10px] text-purple-700 uppercase font-bold">Laporan Panen</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingFarmer(f)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit3 size={15} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingFarmer(f)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showAddModal && <AddFarmerModal onClose={() => setShowAddModal(false)} onSuccess={loadFarmers} />}
      {editingFarmer && <EditFarmerModal farmer={editingFarmer} onClose={() => setEditingFarmer(null)} onSuccess={loadFarmers} />}
      {deletingFarmer && <DeleteFarmerModal farmer={deletingFarmer} onClose={() => setDeletingFarmer(null)} onSuccess={loadFarmers} />}
    </motion.div>
  )
}

function AddFarmerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: 'Petani123!',
    phone: '08123456789',
    location: 'Desa Bibis, Blok Utara'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await createAdminFarmer(formData)
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
            <h3 className="font-heading text-xl font-bold text-stone-900">Tambah Akun Petani</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 text-stone-500"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Petani</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Pak Joko"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Username Akun</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="Contoh: pak_joko atau joko123"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Kata Sandi Akun</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi Kebun / Blok</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold">Batal</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-forest-800 text-white rounded-xl font-bold shadow-md">
                {submitting ? 'Menyimpan...' : 'Simpan Akun'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function EditFarmerModal({ farmer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: farmer?.name || '',
    username: farmer?.username || '',
    phone: farmer?.phone || '',
    location: farmer?.location || ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await updateAdminFarmer(farmer.id, formData)
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
            <h3 className="font-heading text-xl font-bold text-stone-900">Edit Profil Petani</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-stone-100 text-stone-500"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl font-bold">Batal</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-forest-800 text-white rounded-xl font-bold shadow-md">
                {submitting ? 'Menyimpan...' : 'Perbarui'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function DeleteFarmerModal({ farmer, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await deleteAdminFarmer(farmer.id)
    setDeleting(false)
    onSuccess()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <Trash2 size={26} />
          </div>
          <h3 className="font-heading text-xl font-bold text-stone-900 mb-2">Hapus Akun Petani?</h3>
          <p className="font-body text-sm text-stone-600 mb-6">
            Akun <span className="font-bold text-stone-900">{farmer?.name}</span> (@{farmer?.username || 'petani'}) akan dihapus dari sistem.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Batal</button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2.5 rounded-xl font-bold bg-red-600 text-white shadow-md">
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── Main Shell ────────────────────────────────────────────
export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [farmSettings, setFarmSettings] = useState(null)
  const [scannedLeafContext, setScannedLeafContext] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => {
    return getAuthUser() || {
      id: 'admin-01',
      name: 'Admin Maxima',
      username: 'admin',
      role: 'admin',
      location: 'Magetan Pusat'
    }
  })

  useEffect(() => {
    fetchFarmSettings().then(setFarmSettings)
    const storedUser = getAuthUser()
    if (storedUser) {
      setCurrentUser(storedUser)
    }
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleLoginSuccess = (user) => {
    if (user) {
      setCurrentUser(user)
      navigate('/admin')
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    removeAuthUser()
    setCurrentUser(null)
    navigate('/admin')
  }

  // If user is logged out, render the direct Login Page without popup modals
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  const isAdmin = currentUser?.role === 'admin'
  const activeNavList = isAdmin ? NAV_ITEMS_ADMIN : NAV_ITEMS_FARMER
  const currentNav = activeNavList.find(n => n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path))

  const sidebarBg = {
    background: 'linear-gradient(180deg, #1b4332 0%, #0d2b1d 100%)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sidebar-wrap z-20" style={sidebarBg}>
        <SidebarContent
          location={location}
          onNavClick={closeSidebar}
          farmSettings={farmSettings}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeSidebar}
            />
            <motion.aside
              key="drawer"
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 flex flex-col sidebar-wrap shadow-2xl lg:hidden"
              style={sidebarBg}
            >
              <button
                onClick={closeSidebar}
                className="absolute top-3.5 right-3.5 z-10 p-2 rounded-xl text-white/50 hover:text-white bg-white/[0.08] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Tutup menu"
              >
                <X size={16} />
              </button>
              <SidebarContent
                location={location}
                onNavClick={closeSidebar}
                farmSettings={farmSettings}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid #e7e5e4',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <button
            id="mobile-menu-btn"
            className="lg:hidden p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={18} className="text-stone-600" />
          </button>

          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-stone-400">
            <span>Pomelo Trace</span>
            <ChevronRight size={11} />
            <span className="text-forest-800 font-bold bg-forest-50 px-2 py-0.5 rounded">
              {isAdmin ? 'Mode Admin' : 'Mode Petani'}
            </span>
            <ChevronRight size={11} />
            <span className="text-stone-700 font-medium">
              {currentNav?.label ?? 'Dashboard'}
            </span>
          </div>

          <div className="lg:hidden font-heading text-lg text-stone-800 ml-3">
            {currentNav?.label ?? 'Dashboard'}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* User Badge / Role Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
              <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-forest-600' : 'bg-amber-600'}`} />
              <span className="font-bold text-stone-800">{currentUser?.name}</span>
              <span className="font-mono text-[10px] text-stone-500 uppercase font-semibold">({currentUser?.role})</span>
            </div>

            {/* Public trace button */}
            <Link
              to="/trace/BATCH-BBS001-20260315"
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 min-h-[44px] whitespace-nowrap shrink-0 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-xs"
            >
              <QrCode size={15} className="text-[#2d6a4f]" />
              <span className="text-xs">Halaman Publik</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 min-h-[44px] whitespace-nowrap shrink-0 bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut size={15} />
              <span className="text-xs">Keluar</span>
            </button>
          </div>
        </header>

        {/* Content Views — Conditional by Role */}
        <main className={`flex-1 ${location.pathname.startsWith('/admin/chat') ? 'h-full flex flex-col min-h-0 overflow-hidden p-3 sm:p-4' : 'overflow-y-auto p-4 sm:p-6'} bg-[#f9f8f5]`}>
          <AnimatePresence mode="wait">
            {isAdmin ? (
              // ── Admin Pages: Dashboard, Pohon & Lahan, Jadwal Pupuk, Deteksi AI, Lapor & QR Panen, Petani Terdaftar ──
              <Routes location={location} key="admin-routes">
                <Route index            element={<DashboardOverview farmSettings={farmSettings} />} />
                <Route path="trees"     element={<TreeBatchesPage />} />
                <Route path="fertilize" element={<FertilizerManagementPage />} />
                <Route path="ai-scan"   element={<AIScanPage onScanComplete={(ctx) => setScannedLeafContext(ctx)} />} />
                <Route path="harvests"  element={<HarvestsPage />} />
                <Route path="farmers"   element={<FarmersPage />} />
                <Route path="*"         element={<Navigate to="/admin" replace />} />
              </Routes>
            ) : (
              // ── Petani Pages: Dashboard, Pohon & Lahan, Jadwal Pupuk, Deteksi AI, Konsultasi AI ──
              <Routes location={location} key="farmer-routes">
                <Route index            element={<DashboardOverview farmSettings={farmSettings} />} />
                <Route path="trees"     element={<TreeBatchesPage />} />
                <Route path="fertilize" element={<FertilizerManagementPage />} />
                <Route path="ai-scan"   element={<AIScanPage onScanComplete={(ctx) => setScannedLeafContext(ctx)} />} />
                <Route path="chat"      element={<AIConsultationPage scannedLeafContext={scannedLeafContext} onClearContext={() => setScannedLeafContext(null)} />} />
                <Route path="*"         element={<Navigate to="/admin" replace />} />
              </Routes>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
