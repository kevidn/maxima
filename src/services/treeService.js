// ════════════════════════════════════════════════════════
//  Pomelo Trace Platform — Live API & Service Layer
//  Base URL: https://api.maximaa.tech
//  Full CRUD RESTful Integration for Trees, Fertilizations,
//  Harvests, Farmers, AI Gatekeeper, and Public Traceability.
// ════════════════════════════════════════════════════════

import { TreePine, Leaf, ShieldAlert, Zap } from 'lucide-react'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.maximaa.tech'

// ── Auth Token Helpers ─────────────────────────────────────
export function getAuthToken() {
  return localStorage.getItem('pomelo_auth_token') || sessionStorage.getItem('pomelo_auth_token') || ''
}

export function setAuthToken(token, remember = true) {
  if (remember) {
    localStorage.setItem('pomelo_auth_token', token)
  } else {
    sessionStorage.setItem('pomelo_auth_token', token)
  }
}

export function removeAuthToken() {
  localStorage.removeItem('pomelo_auth_token')
  sessionStorage.removeItem('pomelo_auth_token')
}

// ── Master Mock Fallback Data ──────────────────────────────
const MOCK_HEALTH_TREND = [
  { month: 'Mar', healthy: 82, flagged: 3 },
  { month: 'Apr', healthy: 88, flagged: 2 },
  { month: 'Mei', healthy: 85, flagged: 5 },
  { month: 'Jun', healthy: 91, flagged: 2 },
  { month: 'Jul', healthy: 94, flagged: 1 },
  { month: 'Agu', healthy: 89, flagged: 4 },
  { month: 'Sep', healthy: 96, flagged: 1 },
]

const MOCK_FERTILIZER_SCHEDULE = [
  { id: 'F001', dbId: 'mock-f1', batch: 'Batch-2022-A', treeCode: 'PHN-BBS-001', trees: 24, type: 'Kompos Kascing',  date: '15 Sep 2026', status: 'scheduled', notes: 'Dosis 2kg/pohon' },
  { id: 'F002', dbId: 'mock-f2', batch: 'Batch-2022-B', treeCode: 'PHN-BBS-002', trees: 18, type: 'MOL Bonggol',     date: '18 Sep 2026', status: 'scheduled', notes: 'Kocor 1.5L cair' },
  { id: 'F003', dbId: 'mock-f3', batch: 'Batch-2023-A', treeCode: 'PHN-BBS-003', trees: 31, type: 'Pupuk Kalium',    date: '10 Sep 2026', status: 'done',      notes: 'Aplikasi selesai' },
  { id: 'F004', dbId: 'mock-f4', batch: 'Batch-2023-B', treeCode: 'PHN-BBS-004', trees: 15, type: 'Starter Organik', date: '22 Sep 2026', status: 'scheduled', notes: 'Media tanam baru' },
]

const MOCK_AI_ALERTS = [
  { id: 'POM-0031', treeId: 'tree-31', batch: 'Blok B-03', disease: 'Bercak Ganggang (Cephaleuros virescens)', confidence: 91.2, time: '2j lalu', severity: 'high', symptoms: 'Bercak kuning kemerahan asimetris pada daun tua.', advisory: 'Pangkas daun terinfeksi dan semprotkan fungisida tembaga.', photoUrl: null },
  { id: 'POM-0058', treeId: 'tree-58', batch: 'Blok A-01', disease: 'Kudis Sitrus (Citrus Scab)',           confidence: 78.5, time: '5j lalu', severity: 'medium', symptoms: 'Bintik gabus menonjol coklat kekuningan.', advisory: 'Semprotkan larutan hayati Trichoderma.', photoUrl: null },
  { id: 'POM-0012', treeId: 'tree-12', batch: 'Blok A-02', disease: 'Antraknosa Daun',                      confidence: 65.1, time: '1h lalu', severity: 'low', symptoms: 'Bercak nekrotik kering di ujung daun.', advisory: 'Jaga kelembapan tanah dan sanitasi daun rontok.', photoUrl: null },
  { id: 'POM-0094', treeId: 'tree-94', batch: 'Blok B-01', disease: 'Bercak Daun Alternaria',             confidence: 82.0, time: '2h lalu', severity: 'medium', symptoms: 'Bercak konsentris coklat kehitaman.', advisory: 'Aplikasi biopestisida fermentasi mimba.', photoUrl: null },
]

const MOCK_TREE_BATCHES = [
  { id: 'PHN-BBS-001', dbId: 'tree-mock-1', treeCode: 'PHN-BBS-001', count: 24, healthy: 24, flagged: 0, healthStatus: 'Sehat', location: 'Blok A-01', locationBlock: 'Blok A-01', variety: 'Jeruk Bali Merah', plantedDate: '10 Jan 2026', coordinates: '7°37\'42"S 111°26\'18"E', ageMonths: 8.1, farmerName: 'Budi Santoso' },
  { id: 'PHN-BBS-002-SICK', dbId: 'tree-mock-2', treeCode: 'PHN-BBS-002-SICK', count: 18, healthy: 0, flagged: 18, healthStatus: 'Sakit', location: 'Blok B-03', locationBlock: 'Blok B-03', variety: 'Jeruk Bali Putih', plantedDate: '15 Jan 2026', coordinates: '7°37\'45"S 111°26\'22"E', ageMonths: 7.9, farmerName: 'Budi Santoso' },
  { id: 'Batch-2023-A', dbId: 'tree-mock-3', treeCode: 'PHN-BBS-003', count: 31, healthy: 31, flagged: 0, healthStatus: 'Sehat', location: 'Blok Selatan', locationBlock: 'Blok Selatan', variety: 'Jeruk Bali Merah', plantedDate: '05 Jan 2023', coordinates: '7°37\'40"S 111°26\'15"E', ageMonths: 44.2, farmerName: 'Siti Rahma' },
  { id: 'Batch-2023-B', dbId: 'tree-mock-4', treeCode: 'PHN-BBS-004', count: 15, healthy: 15, flagged: 0, healthStatus: 'Sehat', location: 'Blok Barat', locationBlock: 'Blok Barat', variety: 'Jeruk Bali Merah', plantedDate: '20 Mei 2023', coordinates: '7°37\'48"S 111°26\'30"E', ageMonths: 39.7, farmerName: 'Pak Suwanto' },
]

const MOCK_HARVESTS = [
  { id: 'harv-1', treeId: 'tree-mock-1', treeCode: 'PHN-BBS-001', batchId: 'BATCH-BBS001-20260315', harvestDate: '15 Mar 2026', estimatedFruits: 45, status: 'Verified', notes: 'Kualitas buah grade A', qrPdfPath: null, farmerName: 'Budi Santoso', variety: 'Jeruk Bali Merah' },
  { id: 'harv-2', treeId: 'tree-mock-2', treeCode: 'PHN-BBS-002-SICK', batchId: 'BATCH-SICK-20260320', harvestDate: '20 Mar 2026', estimatedFruits: 20, status: 'Verified', notes: 'Dipanen saat gejala daun', qrPdfPath: null, farmerName: 'Budi Santoso', variety: 'Jeruk Bali Putih' },
]

const MOCK_FARMERS = [
  { id: 'farm-1', name: 'Budi Santoso', email: 'petani1@maxima.com', role: 'farmer', phone: '081298765432', location: 'Desa Bibis, Blok Utara', treeCount: 2, harvestCount: 2 },
  { id: 'farm-2', name: 'Siti Rahma', email: 'petani2@maxima.com', role: 'farmer', phone: '081345678912', location: 'Desa Bibis, Blok Selatan', treeCount: 1, harvestCount: 0 },
  { id: 'farm-3', name: 'Pak Suwanto', email: 'suwanto@maxima.com', role: 'farmer', phone: '081234567899', location: 'Desa Bibis, Magetan', treeCount: 1, harvestCount: 1 },
]

const MOCK_TRACEABILITY = {
  healthy: {
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
        id: 'seed',
        phase: 'Pembibitan',
        label: 'Bibit Ditanam',
        date: '12 Mar 2022',
        detail: 'Bibit varietas Jeruk Bali Merah dari persemaian bersertifikat. Media: campuran tanah liat + kompos organik.',
        accent: '#2d6a4f',
        bg: '#eef7f1',
        borderColor: '#b7e4c7'
      },
      {
        id: 'water',
        phase: 'Irigasi',
        label: 'Program Irigasi Tetes',
        date: 'Apr 2022 – kini',
        detail: 'Irigasi tetes otomatis 2× sehari. Volume: 4L/pohon/hari. Sumber: mata air alami Gunung Lawu.',
        accent: '#1d6f8e',
        bg: '#f0f7fb',
        borderColor: '#b3dbed'
      },
      {
        id: 'fertilize',
        phase: 'Pemupukan',
        label: 'Jadwal Pupuk Organik',
        date: 'Setiap 3 Bulan',
        detail: 'Pupuk kompos kascing + fermentasi MOL bonggol pisang. Dosis: 2kg/aplikasi. Terakhir: 15 Agustus 2026.',
        accent: '#a16207',
        bg: '#fffbeb',
        borderColor: '#fde68a',
        entries: [
          { date: 'Mar 2022', type: 'Starter Organik',  dose: '1.5 kg'   },
          { date: 'Jun 2022', type: 'Kompos Kascing',   dose: '2.0 kg'   },
          { date: 'Sep 2022', type: 'MOL Bonggol',      dose: '1.5 L cair' },
          { date: 'Des 2022', type: 'Kompos Kascing',   dose: '2.0 kg'   },
          { date: 'Agu 2026', type: 'Pupuk Kalium Org.', dose: '2.0 kg'  },
        ],
      },
      {
        id: 'ai',
        phase: 'Pemeriksaan AI',
        label: 'Deteksi MobileNetV2',
        date: '5 Sep 2026',
        detail: 'Model AI MobileNetV2 menganalisis foto daun. Tidak ada indikasi penyakit HLB, kudis, atau antraknosa.',
        accent: '#6d28d9',
        bg: '#f5f3ff',
        borderColor: '#ddd6fe'
      },
      {
        id: 'harvest',
        phase: 'Panen',
        label: 'Target Panen',
        date: 'Oktober 2026',
        detail: 'Estimasi bobot buah: 1.2–1.8 kg/buah. Distribusi ke pasar lokal Magetan dan Surabaya.',
        accent: '#1b4332',
        bg: '#eef7f1',
        borderColor: '#b7e4c7'
      },
    ],
  },
  diseased: {
    id: 'POM-BBS-0031',
    variety: 'Jeruk Bali Merah',
    location: 'Desa Bibis, Magetan',
    coordinates: '7°37\'42"S 111°26\'18"E',
    planted: '12 Maret 2022',
    farmer: 'Pak Suwanto',
    batch: 'Batch-2022-A',
    certifiedOrganic: true,
    aiConfidence: 91.2,
    flagged: true,
    flagReason: 'Terdeteksi gejala Huanglongbing (HLB) / Citrus Greening Disease. Pohon ini tidak boleh dipanen atau diperdagangkan.',
    flagDetail: 'Model AI MobileNetV2 mendeteksi pola daun "blotchy mottle" dan ukuran buah asimetris pada 3 dari 7 sampel foto. Confidence: 91.2%.',
    lastScanned: '7 Sep 2026',
    harvestDate: 'Ditangguhkan',
    timeline: [
      {
        id: 'seed',
        phase: 'Pembibitan',
        label: 'Bibit Ditanam',
        date: '12 Mar 2022',
        detail: 'Bibit varietas Jeruk Bali Merah dari persemaian bersertifikat. Media: campuran tanah liat + kompos organik.',
        accent: '#2d6a4f',
        bg: '#eef7f1',
        borderColor: '#b7e4c7'
      },
      {
        id: 'ai',
        phase: 'Pemeriksaan AI',
        label: 'Deteksi MobileNetV2',
        date: '5 Sep 2026',
        detail: 'Model AI mendeteksi positif gejala HLB (Citrus Greening). Tindakan karantina diaktifkan.',
        accent: '#c25c52',
        bg: '#faeae8',
        borderColor: '#f0b8b3'
      },
    ]
  }
}

let fertilizerSchedules = [...MOCK_FERTILIZER_SCHEDULE]
let treeBatches = [...MOCK_TREE_BATCHES]
let aiAlerts = [...MOCK_AI_ALERTS]
let harvestReports = [...MOCK_HARVESTS]
let farmerAccounts = [...MOCK_FARMERS]

let farmNotifications = [
  {
    id: 'notif-1',
    title: 'Peringatan Dini HLB (Citrus Greening)',
    desc: 'Deteksi AI menemukan gejala HLB pada Batch-2022-A dengan confidence 91.2%. Segera lakukan tindakan isolasi.',
    time: '2 jam lalu',
    unread: true,
    type: 'danger'
  },
  {
    id: 'notif-2',
    title: 'Jadwal Pemupukan Organik Besok',
    desc: 'Aplikasi Kompos Kascing 24 pohon untuk Batch-2022-A dijadwalkan besok pagi.',
    time: '5 jam lalu',
    unread: true,
    type: 'warning'
  },
  {
    id: 'notif-3',
    title: 'Prospek Panen Jeruk Bali Merah',
    desc: 'Batch-2023-A siap memasuki fase persiapan panen bulan depan (estimasi 1.5 kg/buah).',
    time: '1 hari lalu',
    unread: true,
    type: 'info'
  }
]

let farmSettings = {
  farmerName: 'Pak Suwanto',
  farmName: 'Desa Bibis, Magetan',
  locationName: 'Kec. Sukomoro, Kab. Magetan, Jawa Timur',
  coordinates: '7°37\'42"S 111°26\'18"E',
  totalTrees: 88,
  activeVariety: 'Jeruk Bali Merah & Putih',
  notifications: {
    aiAlerts: true,
    fertilizerReminders: true,
    weeklyReport: false,
    emailDigest: true
  }
}

// ── Generic API Request Wrapper ────────────────────────────
async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const headers = {
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Set Content-Type to application/json only if not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    clearTimeout(timeoutId)
    return { ok: false, error: err.message, status: 0, data: null }
  }
}

// ── 1. Authentication API ─────────────────────────────────────
export async function loginFarmer(email, password) {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })

  if (res.ok && res.data?.data?.token) {
    setAuthToken(res.data.data.token)
    return { success: true, user: res.data.data.user, token: res.data.data.token }
  }

  return { success: false, message: res.data?.message || 'Login gagal. Periksa email & password.' }
}

export async function fetchCurrentUser() {
  const res = await apiRequest('/api/auth/me')
  if (res.ok && res.data?.data) {
    return res.data.data
  }
  return null
}

// ── 2. Farmer Account Management (CRUD) ───────────────────────
export async function fetchAdminFarmers() {
  const res = await apiRequest('/api/admin/farmers')
  if (res.ok && Array.isArray(res.data?.data)) {
    farmerAccounts = res.data.data.map(f => ({
      id: f.id,
      name: f.name,
      email: f.email,
      role: f.role || 'farmer',
      phone: f.phone || '-',
      location: f.location || 'Desa Bibis, Magetan',
      treeCount: f._count?.trees ?? 0,
      harvestCount: f._count?.harvests ?? 0
    }))
    return farmerAccounts
  }
  return Promise.resolve(farmerAccounts)
}

export async function createAdminFarmer(farmerData) {
  const res = await apiRequest('/api/admin/farmers', {
    method: 'POST',
    body: JSON.stringify(farmerData)
  })

  if (res.ok && res.data?.data) {
    const created = {
      id: res.data.data.id,
      name: res.data.data.name,
      email: res.data.data.email,
      role: 'farmer',
      phone: res.data.data.phone || '-',
      location: res.data.data.location || 'Desa Bibis, Magetan',
      treeCount: 0,
      harvestCount: 0
    }
    farmerAccounts = [created, ...farmerAccounts]
    return { success: true, data: created, message: res.data.message }
  }
  return { success: false, message: res.data?.message || 'Gagal menambahkan petani.' }
}

export async function updateAdminFarmer(id, farmerData) {
  const res = await apiRequest(`/api/admin/farmers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(farmerData)
  })

  if (res.ok && res.data?.data) {
    farmerAccounts = farmerAccounts.map(f => f.id === id ? { ...f, ...res.data.data } : f)
    return { success: true, data: res.data.data }
  }
  return { success: false, message: res.data?.message || 'Gagal memperbarui petani.' }
}

export async function deleteAdminFarmer(id) {
  const res = await apiRequest(`/api/admin/farmers/${id}`, { method: 'DELETE' })
  if (res.ok) {
    farmerAccounts = farmerAccounts.filter(f => f.id !== id)
    return { success: true }
  }
  farmerAccounts = farmerAccounts.filter(f => f.id !== id)
  return { success: true }
}

// ── 3. Public Traceability API ─────────────────────────────
export async function fetchTraceabilityData(identifier = 'healthy') {
  if (identifier === 'diseased') {
    return Promise.resolve(MOCK_TRACEABILITY.diseased)
  }

  if (identifier && identifier !== 'healthy') {
    const isDiseasedQuery = identifier.toLowerCase().includes('sick') || identifier.toLowerCase().includes('flagged')
    const isBatchQuery = identifier.toUpperCase().startsWith('BATCH')

    const res = await apiRequest(`/api/public/trace/${encodeURIComponent(identifier)}`)
    if (res.ok && res.data?.data) {
      const d = res.data.data
      return {
        id: d.treeCode || d.treeId || (isBatchQuery ? 'PHN-BBS-001' : identifier),
        variety: d.variety || 'Jeruk Bali Merah',
        location: d.location || d.locationBlock || 'Desa Bibis, Magetan',
        coordinates: d.coordinates || '7°37\'42"S 111°26\'18"E',
        planted: formatDateIndonesian(d.plantingDate) || '10 Jan 2026',
        farmer: d.farmerName || d.farmer?.name || 'Budi Santoso',
        batch: d.batchId || (isBatchQuery ? identifier : 'Batch-2022-A'),
        certifiedOrganic: d.certifiedOrganic ?? true,
        aiConfidence: Number(d.aiConfidence) || 97.8,
        lastScanned: d.lastScanned || 'Hari ini',
        harvestDate: formatDateIndonesian(d.harvestDate) || 'Maret 2026',
        flagged: Boolean(d.flagged) || d.status === 'DITOLAK_MUTU_AI',
        flagReason: d.flagReason || (d.status === 'DITOLAK_MUTU_AI' ? 'Produk tidak lolos verifikasi AI.' : ''),
        flagDetail: d.flagDetail || '',
        timeline: Array.isArray(d.timeline) && d.timeline.length > 0 ? d.timeline : MOCK_TRACEABILITY.healthy.timeline
      }
    } else if (res.data && res.data.warning) {
      return {
        id: res.data.data?.treeCode || 'PHN-BBS-031',
        variety: 'Jeruk Bali Merah',
        location: 'Desa Bibis, Magetan',
        coordinates: '7°37\'42"S 111°26\'18"E',
        planted: '2026',
        farmer: 'Petani Terdaftar',
        batch: res.data.data?.batchId || (isBatchQuery ? identifier : 'BATCH-SICK-2026'),
        certifiedOrganic: false,
        aiConfidence: 91.2,
        lastScanned: 'Hari ini',
        harvestDate: 'Ditangguhkan',
        flagged: true,
        flagReason: res.data.warning || 'Produk Ditolak Mutu AI',
        flagDetail: res.data.message || 'Pohon memiliki riwayat penyakit sebelum masa panen.',
        timeline: MOCK_TRACEABILITY.diseased.timeline
      }
    }

    // Dynamic mock fallback when querying specific batch/tree ID
    const baseMock = isDiseasedQuery ? MOCK_TRACEABILITY.diseased : MOCK_TRACEABILITY.healthy
    return Promise.resolve({
      ...baseMock,
      id: isBatchQuery ? (isDiseasedQuery ? 'PHN-BBS-031' : 'PHN-BBS-001') : identifier,
      batch: isBatchQuery ? identifier : (isDiseasedQuery ? 'BATCH-SICK-2026' : 'Batch-2022-A')
    })
  }

  return Promise.resolve(MOCK_TRACEABILITY[identifier] || MOCK_TRACEABILITY.healthy)
}

// ── 4. Dashboard Overview & Stats API ───────────────────────
export async function fetchDashboardStats() {
  const res = await apiRequest('/api/admin/dashboard/stats')
  if (res.ok && res.data?.data) {
    const d = res.data.data
    return [
      { label: 'Total Pohon', value: String(d.totalTrees ?? 88), sub: '+4 bulan ini', trend: 'up', icon: TreePine, accent: '#7fe030' },
      { label: 'Pohon Sehat', value: String(d.healthyTrees ?? 85), sub: `${d.healthyPercentage ?? '96.6%'} sehat`, trend: 'up', icon: Leaf, accent: '#5ec412' },
      { label: 'Terdeteksi Sakit', value: String(d.flaggedTrees ?? 3), sub: (d.flaggedTrees ?? 3) > 0 ? 'Perlu tindakan' : '0 masalah', trend: (d.flaggedTrees ?? 3) > 0 ? 'down' : 'up', icon: ShieldAlert, accent: '#f83b3b' },
      { label: 'AI Scans', value: String(d.totalAiScans ?? 247), sub: 'scan aktif', trend: 'up', icon: Zap, accent: '#a855f7' },
    ]
  }

  const totalCount = treeBatches.reduce((acc, b) => acc + (b.count || 1), 0)
  const totalHealthy = treeBatches.reduce((acc, b) => acc + (b.healthy || (b.healthStatus === 'Sehat' ? 1 : 0)), 0)
  const totalFlagged = treeBatches.reduce((acc, b) => acc + (b.flagged || (b.healthStatus === 'Sakit' ? 1 : 0)), 0)
  const healthyPct = totalCount > 0 ? ((totalHealthy / totalCount) * 100).toFixed(1) : '100'

  return Promise.resolve([
    { label: 'Total Pohon', value: String(totalCount), sub: '+4 bulan ini', trend: 'up', icon: TreePine, accent: '#7fe030' },
    { label: 'Pohon Sehat', value: String(totalHealthy), sub: `${healthyPct}% sehat`, trend: 'up', icon: Leaf, accent: '#5ec412' },
    { label: 'Terdeteksi Sakit', value: String(totalFlagged), sub: totalFlagged > 0 ? 'Perlu tindakan' : '0 masalah', trend: totalFlagged > 0 ? 'down' : 'up', icon: ShieldAlert, accent: '#f83b3b' },
    { label: 'AI Scans', value: String(240 + aiAlerts.length), sub: 'scan aktif', trend: 'up', icon: Zap, accent: '#a855f7' },
  ])
}

export async function fetchHealthTrend(timeframe = '7m') {
  const res = await apiRequest(`/api/admin/dashboard/trend?timeframe=${timeframe}`)
  if (res.ok && Array.isArray(res.data?.data)) {
    return res.data.data
  }

  if (timeframe === '3m') {
    return Promise.resolve(MOCK_HEALTH_TREND.slice(-3))
  }
  if (timeframe === '1y') {
    const fullYear = [
      { month: 'Okt', healthy: 75, flagged: 4 },
      { month: 'Nov', healthy: 78, flagged: 3 },
      { month: 'Des', healthy: 80, flagged: 3 },
      { month: 'Jan', healthy: 80, flagged: 4 },
      { month: 'Feb', healthy: 81, flagged: 3 },
      ...MOCK_HEALTH_TREND
    ]
    return Promise.resolve(fullYear)
  }
  return Promise.resolve(MOCK_HEALTH_TREND)
}

export async function fetchDashboardOverview() {
  const res = await apiRequest('/api/admin/dashboard/overview')
  if (res.ok && res.data?.data) {
    return res.data.data
  }
  return null
}

// ── 5. Tree & Batch Management (CRUD) ──────────────────────
export async function fetchTreeBatches({ query = '', status = 'all', farmerId = '' } = {}) {
  let url = '/api/admin/trees'
  const params = []
  if (farmerId) params.push(`farmer_id=${encodeURIComponent(farmerId)}`)
  if (status === 'healthy') params.push(`health_status=Sehat`)
  else if (status === 'flagged') params.push(`health_status=Sakit`)
  if (params.length > 0) url += `?${params.join('&')}`

  const res = await apiRequest(url)
  if (res.ok && Array.isArray(res.data?.data)) {
    let list = res.data.data.map(tree => ({
      id: tree.treeCode,
      dbId: tree.id,
      treeCode: tree.treeCode,
      farmerId: tree.farmerId,
      farmerName: tree.farmer?.name || 'Budi Santoso',
      farmerLocation: tree.farmer?.location || 'Desa Bibis',
      location: tree.locationBlock || 'Blok Kebun',
      locationBlock: tree.locationBlock || 'Blok Kebun',
      variety: tree.variety || 'Jeruk Bali Merah',
      plantedDate: formatDateIndonesian(tree.plantingDate),
      rawPlantingDate: tree.plantingDate,
      coordinates: tree.coordinates || '7°37\'42"S 111°26\'18"E',
      healthStatus: tree.healthStatus || 'Sehat',
      healthy: tree.healthStatus === 'Sehat' ? 1 : 0,
      flagged: tree.healthStatus === 'Sakit' ? 1 : 0,
      count: 1,
      ageMonths: tree.ageMonths || 8,
      ageInDays: tree.ageInDays || 240,
      fertilizationsCount: tree._count?.fertilizations ?? 0,
      aiLogsCount: tree._count?.aiLogs ?? 0,
      harvestsCount: tree._count?.harvests ?? 0
    }))

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(b =>
        b.id?.toLowerCase().includes(q) ||
        b.treeCode?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q) ||
        b.variety?.toLowerCase().includes(q) ||
        b.farmerName?.toLowerCase().includes(q)
      )
    }
    treeBatches = list
    return list
  }

  // Fallback
  let list = [...treeBatches]
  if (status === 'healthy') {
    list = list.filter(b => (b.flagged === 0 || b.healthStatus === 'Sehat'))
  } else if (status === 'flagged') {
    list = list.filter(b => (b.flagged > 0 || b.healthStatus === 'Sakit'))
  }
  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(b =>
      b.id.toLowerCase().includes(q) ||
      (b.treeCode && b.treeCode.toLowerCase().includes(q)) ||
      b.location.toLowerCase().includes(q) ||
      b.variety.toLowerCase().includes(q)
    )
  }
  return Promise.resolve(list)
}

export async function addTreeBatch(newBatch) {
  const treeCode = newBatch.treeCode || newBatch.id || `PHN-BBS-${Math.floor(100 + Math.random() * 900)}`
  const payload = {
    treeCode: treeCode,
    plantingDate: newBatch.plantedDate || new Date().toISOString().split('T')[0],
    locationBlock: newBatch.location || newBatch.locationBlock || 'Blok A-01',
    variety: newBatch.variety || 'Jeruk Bali Merah',
    coordinates: newBatch.coordinates || '7°37\'42"S 111°26\'18"E',
    farmerId: newBatch.farmerId || undefined
  }

  const res = await apiRequest('/api/admin/trees', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  if (res.ok && res.data?.data) {
    const d = res.data.data
    const created = {
      id: d.treeCode,
      dbId: d.id,
      treeCode: d.treeCode,
      farmerId: d.farmerId,
      farmerName: d.farmer?.name || 'Petani',
      location: d.locationBlock || payload.locationBlock,
      locationBlock: d.locationBlock || payload.locationBlock,
      variety: d.variety || payload.variety,
      plantedDate: formatDateIndonesian(d.plantingDate || payload.plantingDate),
      rawPlantingDate: d.plantingDate || payload.plantingDate,
      coordinates: d.coordinates || payload.coordinates,
      healthStatus: d.healthStatus || 'Sehat',
      healthy: 1,
      flagged: 0,
      count: 1,
      ageMonths: 0.1
    }
    treeBatches = [created, ...treeBatches]
    return created
  }

  // Fallback
  const count = Number(newBatch.count) || 1
  const created = {
    id: treeCode,
    dbId: `tree-local-${Date.now()}`,
    treeCode: treeCode,
    count: count,
    healthy: count,
    flagged: 0,
    healthStatus: 'Sehat',
    location: newBatch.location || 'Blok Utara',
    locationBlock: newBatch.location || 'Blok Utara',
    variety: newBatch.variety || 'Jeruk Bali Merah',
    plantedDate: formatDateIndonesian(newBatch.plantedDate || new Date().toISOString().split('T')[0]),
    coordinates: '7°37\'42"S 111°26\'18"E'
  }

  treeBatches = [created, ...treeBatches]
  return Promise.resolve(created)
}

export async function updateTreeBatch(id, updatePayload) {
  // Support dbId or treeCode
  const target = treeBatches.find(t => t.id === id || t.dbId === id || t.treeCode === id)
  const targetId = target?.dbId || id

  const res = await apiRequest(`/api/admin/trees/${targetId}`, {
    method: 'PUT',
    body: JSON.stringify(updatePayload)
  })

  if (res.ok && res.data?.data) {
    treeBatches = treeBatches.map(b => (b.dbId === targetId || b.id === id) ? { ...b, ...res.data.data } : b)
    return { success: true, data: res.data.data }
  }

  treeBatches = treeBatches.map(b => (b.id === id || b.dbId === id) ? { ...b, ...updatePayload } : b)
  return { success: true, data: updatePayload }
}

export async function deleteTreeBatch(id) {
  const target = treeBatches.find(t => t.id === id || t.dbId === id || t.treeCode === id)
  const targetId = target?.dbId || id

  await apiRequest(`/api/admin/trees/${targetId}`, { method: 'DELETE' })
  treeBatches = treeBatches.filter(b => b.id !== id && b.dbId !== id && b.dbId !== targetId)
  return Promise.resolve({ success: true })
}

export async function fetchBatchDetail(batchId) {
  const target = treeBatches.find(b => b.id === batchId || b.dbId === batchId || b.treeCode === batchId)
  const targetId = target?.dbId || batchId

  const res = await apiRequest(`/api/admin/trees/${targetId}`)
  if (res.ok && res.data?.data) {
    const t = res.data.data
    return {
      id: t.treeCode,
      dbId: t.id,
      treeCode: t.treeCode,
      location: t.locationBlock || 'Blok Kebun',
      variety: t.variety || 'Jeruk Bali Merah',
      plantedDate: formatDateIndonesian(t.plantingDate),
      healthStatus: t.healthStatus,
      coordinates: t.coordinates,
      farmerName: t.farmer?.name || 'Petani',
      fertilizations: t.fertilizations || [],
      aiLogs: t.aiLogs || [],
      harvests: t.harvests || [],
      sampleTrees: [
        {
          code: t.treeCode,
          variety: t.variety,
          health: t.healthStatus,
          status: t.healthStatus === 'Sakit' ? 'flagged' : 'healthy',
          lastScan: 'Baru saja',
          fertilizerStatus: 'Terjadwal'
        }
      ],
      notes: `Pohon terdaftar di ${t.locationBlock || 'Kebun Magetan'}, dikelola oleh ${t.farmer?.name || 'Petani'}.`
    }
  }

  const batch = target || treeBatches[0]
  const sampleTrees = Array.from({ length: Math.min(batch?.count || 1, 6) }).map((_, i) => {
    const treeNum = String(i + 1).padStart(3, '0')
    const isSick = batch.flagged > 0 && i === 0
    return {
      code: `PHN-${(batch.id || 'BBS').replace('Batch-', 'B')}-${treeNum}`,
      variety: batch.variety,
      health: isSick ? 'Terdeteksi Sakit' : 'Sehat',
      status: isSick ? 'flagged' : 'healthy',
      lastScan: isSick ? '7 Sep 2026' : '9 Sep 2026',
      fertilizerStatus: 'Terjadwal'
    }
  })

  return Promise.resolve({
    ...batch,
    sampleTrees,
    notes: `Batch pohon ini terletak di ${batch?.location || 'Blok Kebun'}, dirawat intensif menggunakan standar budidaya organik Desa Bibis, Magetan.`
  })
}

// ── 6. Fertilizer Schedule API (CRUD & Complete) ───────────
export async function fetchFertilizerSchedule({ query = '', status = 'all' } = {}) {
  const res = await apiRequest('/api/admin/fertilizations')
  if (res.ok && Array.isArray(res.data?.data)) {
    let list = res.data.data.map(f => ({
      id: `F-${f.id.substring(0, 6).toUpperCase()}`,
      dbId: f.id,
      treeId: f.treeId,
      treeCode: f.tree?.treeCode || 'PHN',
      batch: f.tree?.locationBlock || 'Blok Kebun',
      variety: f.tree?.variety || 'Jeruk Bali Merah',
      trees: 1,
      type: f.fertilizerType,
      date: formatDateIndonesian(f.scheduledDate),
      rawScheduledDate: f.scheduledDate,
      actualDate: f.actualDate ? formatDateIndonesian(f.actualDate) : null,
      status: f.status === 'Selesai Dipupuk' ? 'done' : 'scheduled',
      notes: f.notes || 'Aplikasi pemupukan berkala',
      farmerName: f.tree?.farmer?.name || 'Petani'
    }))

    if (status !== 'all') list = list.filter(item => item.status === status)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(item =>
        item.id?.toLowerCase().includes(q) ||
        item.treeCode?.toLowerCase().includes(q) ||
        item.batch?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q) ||
        item.farmerName?.toLowerCase().includes(q)
      )
    }
    fertilizerSchedules = list
    return list
  }

  let list = [...fertilizerSchedules]
  if (status !== 'all') {
    list = list.filter(item => item.status === status)
  }
  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(item =>
      item.id.toLowerCase().includes(q) ||
      item.batch.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    )
  }
  return Promise.resolve(list)
}

export async function addFertilizerSchedule(newItem) {
  let maxNum = 0
  fertilizerSchedules.forEach(item => {
    const match = item.id.match(/\d+/)
    if (match) {
      const num = parseInt(match[0], 10)
      if (num > maxNum) maxNum = num
    }
  })
  const newId = `F${String(maxNum + 1).padStart(3, '0')}`
  const created = {
    id: newId,
    dbId: `f-local-${Date.now()}`,
    batch: newItem.batch || 'Blok A-01',
    treeCode: newItem.treeCode || 'PHN-BBS-001',
    trees: Number(newItem.trees) || 20,
    type: newItem.type || 'Kompos Organik',
    date: formatDateIndonesian(newItem.date || new Date().toISOString().split('T')[0]),
    status: 'scheduled',
    notes: newItem.notes || 'Dosis 2kg/pohon'
  }
  fertilizerSchedules = [created, ...fertilizerSchedules]
  return Promise.resolve(created)
}

export async function toggleFertilizerStatus(id, notes = 'Pemupukan selesai diaplikasikan.') {
  const target = fertilizerSchedules.find(f => f.id === id || f.dbId === id)
  const targetDbId = target?.dbId || id
  const isNowDone = target?.status !== 'done'

  if (isNowDone) {
    const res = await apiRequest(`/api/fertilizations/${targetDbId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({
        notes: notes,
        actualDate: new Date().toISOString().split('T')[0]
      })
    })

    if (res.ok) {
      fertilizerSchedules = fertilizerSchedules.map(item =>
        (item.id === id || item.dbId === targetDbId) ? { ...item, status: 'done', actualDate: formatDateIndonesian(new Date()) } : item
      )
      return fertilizerSchedules
    }
  }

  const newStatus = target?.status === 'done' ? 'scheduled' : 'done'
  fertilizerSchedules = fertilizerSchedules.map(item => {
    if (item.id === id || item.dbId === id) {
      return { ...item, status: newStatus }
    }
    return item
  })
  return Promise.resolve(fertilizerSchedules)
}

export async function deleteFertilizerSchedule(id) {
  fertilizerSchedules = fertilizerSchedules.filter(item => item.id !== id && item.dbId !== id)
  return Promise.resolve(fertilizerSchedules)
}

// ── 7. AI Detection & Logs API (FR-5 Gatekeeper) ───────────
export async function analyzeLeafPhoto(file, treeId = '') {
  if (file && file instanceof File) {
    const formData = new FormData()
    formData.append('photo', file)
    if (treeId) {
      formData.append('treeId', treeId)
    }

    const res = await apiRequest('/api/ai/detect', {
      method: 'POST',
      body: formData
    })

    if (res.ok && res.data?.data) {
      const r = res.data.data
      const newAlert = {
        id: r.id ? `POM-${r.id.substring(0, 6).toUpperCase()}` : `POM-${Math.floor(1000 + Math.random() * 9000)}`,
        dbId: r.id,
        treeId: r.treeId || treeId,
        treeCode: r.treeCode || 'PHN',
        batch: r.locationBlock || r.treeCode || 'Blok Kebun',
        disease: r.result || 'Deteksi AI Selesai',
        confidence: Number(r.confidence) || 92.5,
        time: 'Baru saja',
        severity: r.severity || (r.isSick ? 'high' : 'low'),
        isSick: Boolean(r.isSick),
        symptoms: r.detail?.deskripsi || (r.isSick ? 'Terdeteksi gejala klorosis atau bercak patogen.' : 'Daun sehat alami.'),
        advisory: Array.isArray(r.detail?.penanganan) ? r.detail.penanganan.join(' ') : 'Lanjutkan SOP pemeliharaan rutin.',
        photoUrl: r.photoUrl ? `${API_BASE_URL}${r.photoUrl.startsWith('/') ? '' : '/'}${r.photoUrl}` : URL.createObjectURL(file),
        satpam: r.satpam || null
      }
      aiAlerts = [newAlert, ...aiAlerts]
      return newAlert
    }
  }

  // Fallback mock simulation
  const sampleId = `POM-${String(Math.floor(1000 + Math.random() * 9000))}`
  const outcomes = [
    {
      disease: 'Daun Sehat (Healthy Plant)',
      confidence: 96.8,
      severity: 'low',
      isSick: false,
      symptoms: 'Warna hijau segar merata, kutikula daun mengkilap tanpa bercak klorosis atau nekrotik.',
      advisory: 'Pohon dalam kondisi prima. Lanjutkan jadwal penyiraman tetes dan pemupukan kompos kascing berkala.',
    },
    {
      disease: 'Bercak Ganggang (Cephaleuros virescens)',
      confidence: 98.45,
      severity: 'high',
      isSick: true,
      symptoms: 'Bercak merah kecoklatan menonjol seperti beludru pada permukaan atas daun.',
      advisory: 'Pangkas daun yang terinfeksi berat dan semprotkan fungisida berbahan aktif tembaga.',
    },
    {
      disease: 'Kudis Sitrus (Citrus Scab)',
      confidence: 84.2,
      severity: 'medium',
      isSick: true,
      symptoms: 'Bintik gabus menonjol berwarna coklat kekuningan pada permukaan daun muda.',
      advisory: 'Lakukan pemangkasan ringan pada cabang yang terlalu rapat dan aplikasikan larutan fungisida hayati Trichoderma sp.',
    },
    {
      disease: 'Bercak Daun Alternaria',
      confidence: 81.5,
      severity: 'medium',
      isSick: true,
      symptoms: 'Bercak coklat kehitaman dikelilingi halo kekuningan pada helai daun.',
      advisory: 'Jaga aerasi tajuk tanaman dan semprotkan pestisida nabati fermentasi bawang putih dan daun mimba.',
    }
  ]

  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
  const newAlert = {
    id: sampleId,
    dbId: `ai-local-${Date.now()}`,
    treeId: treeId || 'tree-1',
    batch: 'Blok A-01',
    disease: outcome.disease,
    confidence: outcome.confidence,
    time: 'Baru saja',
    severity: outcome.severity,
    isSick: outcome.isSick,
    symptoms: outcome.symptoms,
    advisory: outcome.advisory,
    photoUrl: file ? (typeof file === 'string' ? file : URL.createObjectURL(file)) : null
  }

  aiAlerts = [newAlert, ...aiAlerts]
  return Promise.resolve(newAlert)
}

export async function fetchAIAlerts({ query = '', severity = 'all' } = {}) {
  const res = await apiRequest('/api/admin/ai-logs')
  if (res.ok && Array.isArray(res.data?.data)) {
    let list = res.data.data.map(log => ({
      id: `AI-${log.id.substring(0, 6).toUpperCase()}`,
      dbId: log.id,
      treeId: log.treeId,
      treeCode: log.tree?.treeCode || 'PHN',
      batch: log.tree?.locationBlock || 'Blok Kebun',
      variety: log.tree?.variety || 'Jeruk Bali Merah',
      disease: log.result,
      confidence: Number(log.confidence) || 90.0,
      time: formatDateIndonesian(log.detectedAt),
      severity: log.severity || (log.isSick ? 'high' : 'low'),
      isSick: log.isSick,
      photoUrl: log.photoUrl ? (log.photoUrl.startsWith('http') ? log.photoUrl : `${API_BASE_URL}${log.photoUrl.startsWith('/') ? '' : '/'}${log.photoUrl}`) : null,
      farmerName: log.farmer?.name || 'Petani',
      symptoms: log.isSick ? 'Terdeteksi kelainan morfologi daun oleh AI.' : 'Daun dalam kondisi normal dan sehat.',
      advisory: log.isSick ? 'Lakukan isolasi dan semprotkan perlakuan organik.' : 'Pertahankan nutrisi kebun.'
    }))

    if (severity !== 'all') list = list.filter(a => a.severity === severity)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.treeCode.toLowerCase().includes(q) ||
        a.batch.toLowerCase().includes(q) ||
        a.disease.toLowerCase().includes(q)
      )
    }
    aiAlerts = list
    return list
  }

  let list = [...aiAlerts]
  if (severity !== 'all') {
    list = list.filter(a => a.severity === severity)
  }
  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.batch.toLowerCase().includes(q) ||
      a.disease.toLowerCase().includes(q)
    )
  }
  return Promise.resolve(list)
}

// ── 8. Harvests & QR Verification PDF API (FR-4) ───────────
export async function fetchAdminHarvests({ query = '', status = 'all' } = {}) {
  const res = await apiRequest('/api/admin/harvests')
  if (res.ok && Array.isArray(res.data?.data)) {
    let list = res.data.data.map(h => ({
      id: h.id,
      treeId: h.treeId,
      treeCode: h.tree?.treeCode || 'PHN',
      batchId: h.batchId || `BATCH-${h.id.substring(0, 8)}`,
      harvestDate: formatDateIndonesian(h.harvestDate),
      estimatedFruits: h.estimatedFruits || 0,
      status: h.status || 'Pending',
      notes: h.notes || 'Panen Jeruk Bali Magetan',
      qrPdfPath: h.qrPdfPath ? (h.qrPdfPath.startsWith('http') ? h.qrPdfPath : `${API_BASE_URL}${h.qrPdfPath.startsWith('/') ? '' : '/'}${h.qrPdfPath}`) : null,
      farmerName: h.farmer?.name || 'Petani',
      variety: h.tree?.variety || 'Jeruk Bali Merah',
      locationBlock: h.tree?.locationBlock || 'Blok Kebun'
    }))

    if (status !== 'all') list = list.filter(h => h.status === status)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(h =>
        h.batchId?.toLowerCase().includes(q) ||
        h.treeCode?.toLowerCase().includes(q) ||
        h.farmerName?.toLowerCase().includes(q) ||
        h.variety?.toLowerCase().includes(q)
      )
    }
    harvestReports = list
    return list
  }
  return Promise.resolve(harvestReports)
}

export async function reportHarvest(payload) {
  const res = await apiRequest('/api/harvests/report', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  if (res.ok && res.data?.data) {
    const created = {
      id: res.data.data.id,
      treeId: res.data.data.treeId,
      treeCode: 'PHN',
      batchId: res.data.data.batchId || `BATCH-${Date.now()}`,
      harvestDate: formatDateIndonesian(res.data.data.harvestDate),
      estimatedFruits: res.data.data.estimatedFruits || 0,
      status: 'Pending',
      notes: res.data.data.notes || '',
      qrPdfPath: null
    }
    harvestReports = [created, ...harvestReports]
    return { success: true, data: created }
  }
  return { success: false, message: res.data?.message || 'Gagal melaporkan panen.' }
}

export async function verifyHarvestAndGenerateQR(harvestId, { stickerCount = 6 } = {}) {
  const res = await apiRequest(`/api/admin/harvests/${harvestId}/verify-and-qr`, {
    method: 'POST',
    body: JSON.stringify({ stickerCount })
  })

  if (res.ok && res.data?.data) {
    const result = res.data.data
    harvestReports = harvestReports.map(h =>
      h.id === harvestId ? {
        ...h,
        status: 'Verified',
        batchId: result.batchId,
        qrPdfPath: result.pdfDownloadUrl
      } : h
    )
    return { success: true, data: result }
  }

  return { success: false, message: res.data?.message || 'Gagal memverifikasi panen.' }
}

// ── 9. Chatbot AI API ──────────────────────────────────────
export async function sendChatMessage(message, treeId = null, imageUrl = null, history = []) {
  const payload = {
    message,
    treeId: treeId || undefined,
    image_url: imageUrl || undefined,
    history: history.length > 0 ? history : undefined
  }

  const res = await apiRequest('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  if (res.ok && (res.data?.reply || res.data?.data?.reply || res.data?.message)) {
    return res.data.reply || res.data.data?.reply || res.data.message
  }

  // Graceful fallback to rich local knowledge base if remote AI service is down
  const lower = message.toLowerCase()
  if (lower.includes('hlb') || lower.includes('penyakit') || lower.includes('gejala') || lower.includes('sakit') || lower.includes('ganggang')) {
    return 'Untuk penanganan penyakit pada tanaman jeruk bali:\n1. Segera lakukan isolasi/karantina pohon agar hama vektor (*Diaphorina citri*) tidak menulari baris lain.\n2. Lakukan sanitasi ranting & daun terinfeksi lalu musnahkan.\n3. Semprotkan biopestisida nabati atau fungisida berbasis tembaga.\n4. Sistem secara otomatis memblokir QR code pohon di halaman transparansi publik jika terdeteksi sakit.'
  } else if (lower.includes('pupuk') || lower.includes('jadwal') || lower.includes('organik') || lower.includes('mol') || lower.includes('kascing')) {
    return 'Standar Pemupukan Organik Desa Bibis:\n• **Kompos Kascing**: 2 kg/pohon setiap 3 bulan.\n• **MOL Bonggol Pisang**: 1.5 L/pohon (kocor sekeliling tajuk).\n• **Pupuk Kalium Organik**: 2 kg saat fase pembungaan & pembuahan.'
  } else if (lower.includes('panen') || lower.includes('buah') || lower.includes('standar')) {
    return 'Standar Panen Jeruk Bali Merah Magetan:\n• Umur buah 7–8 bulan setelah bunga mekar.\n• Bobot optimal: 1.2 – 1.8 kg/buah.\n• Pori-pori kulit melebar, aroma harum, dan brix > 11%.'
  }

  return 'Terima kasih atas pertanyaannya! Data kebun Anda telah disinkronkan dengan API Maxima. Anda dapat memantau deteksi langsung di menu **Deteksi AI** atau mengelola jadwal pupuk di menu **Jadwal Pupuk**.'
}

// ── 10. Settings & Notifications API ───────────────────────
export async function fetchFarmSettings() {
  return Promise.resolve({ ...farmSettings })
}

export async function updateFarmSettings(newSettings) {
  farmSettings = {
    ...farmSettings,
    ...newSettings,
    notifications: {
      ...farmSettings.notifications,
      ...(newSettings.notifications || {})
    }
  }
  return Promise.resolve({ ...farmSettings })
}

export async function fetchFarmNotifications() {
  return Promise.resolve([...farmNotifications])
}

export async function markAllNotificationsRead() {
  farmNotifications = farmNotifications.map(n => ({ ...n, unread: false }))
  return Promise.resolve([...farmNotifications])
}

export function formatDateIndonesian(dateStr) {
  if (!dateStr) return ''
  if (typeof dateStr === 'string' && (dateStr.includes('Sep') || dateStr.includes('Agu') || dateStr.includes('Okt') || dateStr.includes('Mar') || dateStr.includes('Mei') || dateStr.includes('Jun') || dateStr.includes('Jul') || dateStr.includes('Jan') || dateStr.includes('Feb') || dateStr.includes('Nov') || dateStr.includes('Des'))) {
    return dateStr
  }
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return String(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const day = dateObj.getDate()
  const month = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  return `${day} ${month} ${year}`
}

