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
let treeBatches = [...MOCK_TREE_BATCHES]
let aiAlerts = [...MOCK_AI_ALERTS]

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

export async function fetchDashboardStats() {
  const totalCount = treeBatches.reduce((acc, b) => acc + b.count, 0)
  const totalHealthy = treeBatches.reduce((acc, b) => acc + b.healthy, 0)
  const totalFlagged = treeBatches.reduce((acc, b) => acc + b.flagged, 0)
  const healthyPct = totalCount > 0 ? ((totalHealthy / totalCount) * 100).toFixed(1) : '100'

  const stats = [
    { label: 'Total Pohon', value: String(totalCount), sub: '+4 bulan ini', trend: 'up', icon: TreePine, accent: '#7fe030' },
    { label: 'Pohon Sehat', value: String(totalHealthy), sub: `${healthyPct}% sehat`, trend: 'up', icon: Leaf, accent: '#5ec412' },
    { label: 'Terdeteksi', value: String(totalFlagged), sub: totalFlagged > 0 ? 'Perlu tindakan' : '0 masalah', trend: totalFlagged > 0 ? 'down' : 'up', icon: ShieldAlert, accent: '#f83b3b' },
    { label: 'AI Scans', value: String(240 + aiAlerts.length), sub: 'scan aktif', trend: 'up', icon: Zap, accent: '#a855f7' },
  ]
  return Promise.resolve(stats)
}

export async function fetchHealthTrend(timeframe = '7m') {
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

export async function fetchFarmNotifications() {
  return Promise.resolve([...farmNotifications])
}

export async function markAllNotificationsRead() {
  farmNotifications = farmNotifications.map(n => ({ ...n, unread: false }))
  return Promise.resolve([...farmNotifications])
}

export async function fetchAIAlerts({ query = '', severity = 'all' } = {}) {
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

export async function fetchTreeBatches({ query = '', status = 'all' } = {}) {
  let list = [...treeBatches]
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

export async function addTreeBatch(newBatch) {
  let batchId = newBatch.id
  if (!batchId || !batchId.trim()) {
    const year = new Date().getFullYear()
    const nextLetter = String.fromCharCode(65 + (treeBatches.length % 26))
    batchId = `Batch-${year}-${nextLetter}`
  }

  const count = Number(newBatch.count) || 20
  const created = {
    id: batchId,
    count: count,
    healthy: count,
    flagged: 0,
    location: newBatch.location || 'Blok Utara',
    variety: newBatch.variety || 'Jeruk Bali Merah',
    plantedDate: formatDateIndonesian(newBatch.plantedDate || new Date().toISOString().split('T')[0])
  }

  treeBatches = [created, ...treeBatches]
  return Promise.resolve(created)
}

export async function fetchBatchDetail(batchId) {
  const batch = treeBatches.find(b => b.id === batchId) || treeBatches[0]
  const sampleTrees = Array.from({ length: Math.min(batch.count, 6) }).map((_, i) => {
    const treeNum = String(i + 1).padStart(3, '0')
    const isSick = batch.flagged > 0 && i === 0
    return {
      code: `PHN-${batch.id.replace('Batch-', 'B')}-${treeNum}`,
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
    notes: `Batch pohon ini terletak di ${batch.location}, dirawat intensif menggunakan standar budidaya organik Desa Bibis, Magetan.`
  })
}

export async function analyzeLeafPhoto(file, batchId = 'Batch-2022-A') {
  // Simulate intelligent MobileNetV2 diagnosis or call backend if available
  const sampleId = `POM-${String(Math.floor(1000 + Math.random() * 9000))}`
  
  // Diverse realistic results
  const outcomes = [
    {
      disease: 'Daun Sehat (Healthy Plant)',
      confidence: 96.8,
      severity: 'low',
      symptoms: 'Warna hijau segar merata, kutikula daun mengkilap tanpa bercak klorosis atau nekrotik.',
      advisory: 'Pohon dalam kondisi prima. Lanjutkan jadwal penyiraman tetes dan pemupukan kompos kascing berkala.',
    },
    {
      disease: 'HLB / Citrus Greening',
      confidence: 93.4,
      severity: 'high',
      symptoms: 'Bercak kuning asimetris (blotchy mottle), urat daun menebal dan mengeras, indikasi infeksi Liberibacter asiaticus.',
      advisory: 'Segera lakukan karantina blok pohon. Hindari perbanyakan stek/bibit, dan semprotkan biopestisida organik untuk mengendalikan vektor kutu loncat Diaphorina citri.',
    },
    {
      disease: 'Kudis Sitrus (Citrus Scab)',
      confidence: 84.2,
      severity: 'medium',
      symptoms: 'Bintik gabus menonjol berwarna coklat kekuningan pada permukaan daun muda.',
      advisory: 'Lakukan pemangkasan ringan pada cabang yang terlalu rapat dan aplikasikan larutan fungisida hayati Trichoderma sp.',
    },
    {
      disease: 'Bercak Daun Alternaria',
      confidence: 81.5,
      severity: 'medium',
      symptoms: 'Bercak coklat kehitaman dikelilingi halo kekuningan pada helai daun.',
      advisory: 'Jaga aerasi tajuk tanaman dan semprotkan pestisida nabati fermentasi bawang putih dan daun mimba.',
    }
  ]

  // Pick random outcome
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]

  const newAlert = {
    id: sampleId,
    batch: batchId,
    disease: outcome.disease,
    confidence: outcome.confidence,
    time: 'Baru saja',
    severity: outcome.severity,
    symptoms: outcome.symptoms,
    advisory: outcome.advisory,
    photoUrl: file ? (typeof file === 'string' ? file : URL.createObjectURL(file)) : null
  }

  aiAlerts = [newAlert, ...aiAlerts]
  return Promise.resolve(newAlert)
}

export async function fetchTraceabilityData(identifier = 'healthy') {
  if (identifier === 'diseased') {
    return Promise.resolve(MOCK_TRACEABILITY.diseased)
  }

  // Try real backend API with short timeout
  if (identifier && identifier !== 'healthy') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)
      const res = await fetch(`http://localhost:3000/api/public/trace/${encodeURIComponent(identifier)}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data
          return {
            id: d.identifier || d.treeCode || identifier,
            variety: d.variety || 'Jeruk Bali Merah',
            location: d.location || 'Desa Bibis, Magetan',
            coordinates: d.coordinates || '7°37\'42"S 111°26\'18"E',
            planted: d.plantedDate || '12 Maret 2022',
            farmer: d.farmer?.name || 'Pak Suwanto',
            batch: d.batchId || identifier,
            certifiedOrganic: d.certifiedOrganic ?? true,
            aiConfidence: d.aiConfidence ?? 98.4,
            lastScanned: '7 Sep 2026',
            harvestDate: d.harvestDate || 'Oktober 2026',
            flagged: d.flagged || false,
            flagReason: d.flagReason,
            flagDetail: d.flagDetail,
            timeline: d.timeline || MOCK_TRACEABILITY.healthy.timeline
          }
        }
      }
    } catch {
      // Backend unavailable or network timeout, gracefully proceed to mock
    }
  }

  return Promise.resolve(MOCK_TRACEABILITY[identifier] || MOCK_TRACEABILITY.healthy)
}


