// ════════════════════════════════════════════════════════
//  Pomelo Trace Platform — Mock Service Layer
//  Isolates data access logic to facilitate future API backend integration.
// ════════════════════════════════════════════════════════

import { TreePine, Leaf, ShieldAlert, Zap } from 'lucide-react'

// ── Master Mock Data ──────────────────────────────────────

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
  { id: 'F001', batch: 'Batch-2022-A', trees: 24, type: 'Kompos Kascing',  date: '15 Sep 2026', status: 'scheduled' },
  { id: 'F002', batch: 'Batch-2022-B', trees: 18, type: 'MOL Bonggol',     date: '18 Sep 2026', status: 'scheduled' },
  { id: 'F003', batch: 'Batch-2023-A', trees: 31, type: 'Pupuk Kalium',    date: '10 Sep 2026', status: 'done'      },
  { id: 'F004', batch: 'Batch-2023-B', trees: 15, type: 'Starter Organik', date: '22 Sep 2026', status: 'scheduled' },
]

const MOCK_AI_ALERTS = [
  { id: 'POM-0031', batch: 'Batch-2022-A', disease: 'HLB / Citrus Greening', confidence: 91.2, time: '2j lalu', severity: 'high'   },
  { id: 'POM-0058', batch: 'Batch-2023-A', disease: 'Kudis Sitrus',           confidence: 78.5, time: '5j lalu', severity: 'medium' },
  { id: 'POM-0012', batch: 'Batch-2022-B', disease: 'Antraknosa',             confidence: 65.1, time: '1h lalu', severity: 'low'    },
  { id: 'POM-0094', batch: 'Batch-2023-B', disease: 'Bercak Daun Alternaria', confidence: 82.0, time: '2h lalu', severity: 'medium' },
]

const MOCK_TREE_BATCHES = [
  { id: 'Batch-2022-A', count: 24, healthy: 22, flagged: 2, location: 'Blok Utara',   variety: 'Jeruk Bali Merah', plantedDate: '12 Mar 2022' },
  { id: 'Batch-2022-B', count: 18, healthy: 17, flagged: 1, location: 'Blok Timur',   variety: 'Jeruk Bali Putih', plantedDate: '18 Apr 2022' },
  { id: 'Batch-2023-A', count: 31, healthy: 31, flagged: 0, location: 'Blok Selatan', variety: 'Jeruk Bali Merah', plantedDate: '05 Jan 2023' },
  { id: 'Batch-2023-B', count: 15, healthy: 15, flagged: 0, location: 'Blok Barat',   variety: 'Jeruk Bali Merah', plantedDate: '20 Mei 2023' },
]

const MOCK_STAT_CARDS = [
  { label: 'Total Pohon', value: '88',  sub: '+4 bulan ini',   trend: 'up',   icon: TreePine,    accent: '#7fe030' },
  { label: 'Pohon Sehat', value: '85',  sub: '96.6% sehat',    trend: 'up',   icon: Leaf,        accent: '#5ec412' },
  { label: 'Terdeteksi',  value: '3',   sub: '–1 dari Jul',    trend: 'down', icon: ShieldAlert, accent: '#f83b3b' },
  { label: 'AI Scans',    value: '247', sub: 'scan minggu ini', trend: 'up',   icon: Zap,         accent: '#a855f7' },
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
        accent: '#7fe030',
        bgAccent: 'rgba(127,224,48,0.08)',
      },
      {
        id: 'water',
        phase: 'Irigasi',
        label: 'Program Irigasi Tetes',
        date: 'Apr 2022 – kini',
        detail: 'Irigasi tetes otomatis 2× sehari. Volume: 4L/pohon/hari. Sumber: mata air alami Gunung Lawu.',
        accent: '#4aadcc',
        bgAccent: 'rgba(74,173,204,0.08)',
      },
      {
        id: 'fertilize',
        phase: 'Pemupukan',
        label: 'Jadwal Pupuk Organik',
        date: 'Setiap 3 Bulan',
        detail: 'Pupuk kompos kascing + fermentasi MOL bonggol pisang. Dosis: 2kg/aplikasi. Terakhir: 15 Agustus 2026.',
        accent: '#f98208',
        bgAccent: 'rgba(249,130,8,0.08)',
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
        accent: '#a855f7',
        bgAccent: 'rgba(168,85,247,0.08)',
      },
      {
        id: 'harvest',
        phase: 'Panen',
        label: 'Target Panen',
        date: 'Oktober 2026',
        detail: 'Estimasi bobot buah: 1.2–1.8 kg/buah. Distribusi ke pasar lokal Magetan dan Surabaya.',
        accent: '#ffa720',
        bgAccent: 'rgba(255,167,32,0.08)',
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
        accent: '#7fe030',
        bgAccent: 'rgba(127,224,48,0.08)',
      },
      {
        id: 'water',
        phase: 'Irigasi',
        label: 'Program Irigasi Tetes',
        date: 'Apr 2022 – kini',
        detail: 'Irigasi tetes otomatis 2× sehari. Volume: 4L/pohon/hari. Sumber: mata air alami Gunung Lawu.',
        accent: '#4aadcc',
        bgAccent: 'rgba(74,173,204,0.08)',
      },
      {
        id: 'fertilize',
        phase: 'Pemupukan',
        label: 'Jadwal Pupuk Organik',
        date: 'Setiap 3 Bulan',
        detail: 'Pupuk kompos kascing + fermentasi MOL bonggol pisang. Dosis: 2kg/aplikasi. Terakhir: 15 Agustus 2026.',
        accent: '#f98208',
        bgAccent: 'rgba(249,130,8,0.08)',
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
        detail: 'Model AI mendeteksi positif gejala HLB (Citrus Greening). Tindakan karantina diaktifkan.',
        accent: '#f83b3b',
        bgAccent: 'rgba(248,59,59,0.08)',
      },
    ]
  }
}

// ── Exported Async API Functions ─────────────────────────

let fertilizerSchedules = [...MOCK_FERTILIZER_SCHEDULE]

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

export async function fetchDashboardStats() {
  return Promise.resolve(MOCK_STAT_CARDS)
}

export async function fetchHealthTrend() {
  return Promise.resolve(MOCK_HEALTH_TREND)
}

export async function fetchFertilizerSchedule({ query = '', status = 'all' } = {}) {
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

export function formatDateIndonesian(dateStr) {
  if (!dateStr) return ''
  if (dateStr.includes('Sep') || dateStr.includes('Agu') || dateStr.includes('Okt') || dateStr.includes('Mar') || dateStr.includes('Mei') || dateStr.includes('Jun') || dateStr.includes('Jul')) {
    return dateStr
  }
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const day = dateObj.getDate()
  const month = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  return `${day} ${month} ${year}`
}

export async function addFertilizerSchedule(newItem) {
  const newId = `F${String(fertilizerSchedules.length + 1).padStart(3, '0')}`
  const created = {
    id: newId,
    batch: newItem.batch || 'Batch-2023-A',
    trees: Number(newItem.trees) || 20,
    type: newItem.type || 'Kompos Organik',
    date: formatDateIndonesian(newItem.date || new Date().toISOString().split('T')[0]),
    status: 'scheduled',
    notes: newItem.notes || ''
  }
  fertilizerSchedules = [created, ...fertilizerSchedules]
  return Promise.resolve(created)
}


export async function toggleFertilizerStatus(id) {
  fertilizerSchedules = fertilizerSchedules.map(item => {
    if (item.id === id) {
      return { ...item, status: item.status === 'done' ? 'scheduled' : 'done' }
    }
    return item
  })
  return Promise.resolve(fertilizerSchedules)
}

export async function deleteFertilizerSchedule(id) {
  fertilizerSchedules = fertilizerSchedules.filter(item => item.id !== id)
  return Promise.resolve(fertilizerSchedules)
}

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

export async function fetchAIAlerts({ query = '', severity = 'all' } = {}) {
  let list = [...MOCK_AI_ALERTS]
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

export async function fetchTreeBatches({ query = '', status = 'all' } = {}) {
  let list = [...MOCK_TREE_BATCHES]
  if (status === 'healthy') {
    list = list.filter(b => b.flagged === 0)
  } else if (status === 'flagged') {
    list = list.filter(b => b.flagged > 0)
  }
  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.variety.toLowerCase().includes(q)
    )
  }
  return Promise.resolve(list)
}

export async function fetchTraceabilityData(treeStatus = 'healthy') {
  return Promise.resolve(MOCK_TRACEABILITY[treeStatus] || MOCK_TRACEABILITY.healthy)
}

