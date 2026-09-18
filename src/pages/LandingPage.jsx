// ════════════════════════════════════════════════════════
//  Landing Page — Modern Editorial Portal
//  Pomelo Trace Platform · Desa Bibis, Magetan
// ════════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthToken } from '../services/treeService'
import {
  Leaf, Search, QrCode, LayoutDashboard, ShieldCheck,
  Sparkles, ArrowRight, Activity, MapPin, Sprout,
  CheckCircle2, Cpu, Zap, ChevronRight, BarChart3, Users, LogIn
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchError, setSearchError] = useState('')

  const isLoggedIn = Boolean(getAuthToken())

  const handleSearch = (e) => {
    e?.preventDefault()
    const query = searchQuery.trim()
    if (!query) {
      setSearchError('Silakan masukkan ID Pohon atau Kode Batch terlebih dahulu.')
      return
    }
    setSearchError('')
    navigate(`/trace/${encodeURIComponent(query)}`)
  }

  const handleQuickChip = (code) => {
    setSearchQuery(code)
    setSearchError('')
    navigate(`/trace/${encodeURIComponent(code)}`)
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1c1917] font-sans selection:bg-[#d8f3dc] selection:text-[#0d2b1d] flex flex-col">
      {/* ── NAVBAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#f9f8f5]/90 backdrop-blur-md border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] flex items-center justify-center text-white shadow-md shadow-[#1b4332]/10">
              <Leaf className="w-6 h-6 text-[#74c69d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#0d2b1d] tracking-tight">
                  POMELO TRACE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#eef7f1] text-[#2d6a4f] border border-[#74c69d]/40 rounded-full uppercase tracking-wider">
                  Magetan
                </span>
              </div>
              <p className="text-xs text-[#78716c] font-medium hidden sm:block">
                Sistem Traseabilitas & Diagnostik AI Kebun Jeruk Bali
              </p>
            </div>
          </div>

          {/* Action Button: Login Admin / Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(isLoggedIn ? '/admin' : '/login')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white font-semibold text-sm hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-[#1b4332]/15 hover:shadow-lg"
            >
              {isLoggedIn ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-[#74c69d]" />
                  <span>Dashboard Admin</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#74c69d]" />
                  <span>Login Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#d8f3dc]/60 via-[#eef7f1]/40 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0d2b1d] leading-[1.15] tracking-tight mb-6"
            >
              Transparansi Mutu Jeruk Bali Merah <br className="hidden sm:block" />
              <span className="italic font-normal text-[#2d6a4f]">Dari Akar Kebun Hingga Meja Konsumen</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-[#44403c] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Lacak riwayat pemupukan organik, asal lokasi kebun Magetan, tanggal target panen, hingga sertifikasi diagnosis kesehatan daun berstandar kecerdasan buatan (AI).
            </motion.p>

            {/* ── INTERACTIVE SEARCH BAR ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#d6d3d1] shadow-lg shadow-[#0d2b1d]/5 mb-6"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-1">
                  <Search className="w-5 h-5 text-[#78716c] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan ID Pohon (PHN-BBS-001) atau Batch ID..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl sm:rounded-2xl bg-[#f9f8f5] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder-[#a8a29e] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#74c69d]/30 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/20 shrink-0"
                >
                  <Search className="w-4 h-4 text-[#74c69d]" />
                  <span>Cari & Lacak</span>
                </button>
              </form>

              {searchError && (
                <p className="text-xs text-[#c25c52] mt-2 text-left px-2 font-medium">
                  ⚠️ {searchError}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── PORTAL AKSES UTAMA (DUAL HUB CARDS) ─────────────── */}
        <section className="py-12 bg-white border-y border-[#e7e5e4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d2b1d]">
                Pilih Akses Portal Halaman
              </h2>
              <p className="text-sm text-[#78716c] mt-2">
                Akses sesuai dengan kebutuhan Anda sebagai publik/konsumen atau pengelola kebun.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Card Halaman Publik */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-[#f9f8f5] border border-[#e7e5e4] p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#74c69d] transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d8f3dc]/50 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#eef7f1] border border-[#74c69d]/40 flex items-center justify-center text-[#2d6a4f] mb-6 shadow-xs">
                    <QrCode className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#d8f3dc] text-[#0d2b1d] uppercase tracking-wider">
                      Publik & Konsumen
                    </span>
                    <span className="text-xs text-[#78716c]">Tanpa Login</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#0d2b1d] mb-3">
                    Halaman Publik Traceability
                  </h3>
                  <p className="text-sm text-[#44403c] leading-relaxed mb-6">
                    Lihat hasil pemindaian QR Code buah, lokasi kebun Desa Bibis, riwayat perawatan organik, sertifikat diagnosis AI, serta estimasi tanggal target panen.
                  </p>

                  <ul className="space-y-2 mb-8 text-xs text-[#44403c]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Lokasi Kebun & Blok Perkebunan Magetan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Timeline Riwayat Pupuk Kascing & Irigasi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Status AI Confidence (Healthy vs Karantina)</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/trace/BATCH-BBS001-20260315')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#1b4332] group-hover:bg-[#2d6a4f] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Buka Halaman Publik</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Card Halaman Admin */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-[#f9f8f5] border border-[#e7e5e4] p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#1b4332] transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1b4332]/10 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0d2b1d] text-[#74c69d] flex items-center justify-center mb-6 shadow-xs">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0d2b1d] text-white uppercase tracking-wider">
                      Petani & Pengelola
                    </span>
                    <span className="text-xs text-[#78716c]">Portal Manajemen</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#0d2b1d] mb-3">
                    Dashboard Admin Kebun
                  </h3>
                  <p className="text-sm text-[#44403c] leading-relaxed mb-6">
                    Kelola data pohon jeruk, catat aktivitas pemupukan, lakukan Scan AI Diagnostik daun, serta konsultasi langsung dengan Asisten AI Kebun.
                  </p>

                  <ul className="space-y-2 mb-8 text-xs text-[#44403c]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Manajemen Data Pohon & Petani Kebun</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Pencatatan Pemupukan & Riwayat Panen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Diagnostik AI Scan Daun & Fitur AI Chatbot</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/admin')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0d2b1d] to-[#1b4332] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Buka Halaman Admin</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#74c69d]" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FITUR UNGGULAN GRID ─────────────────────────────── */}
        <section className="py-16 bg-[#f9f8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-semibold text-[#2d6a4f] uppercase tracking-widest">
                Fitur Unggulan Platform
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d2b1d] mt-2">
                Teknologi Pertanian Modern & Terpercaya
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e7e5e4] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#eef7f1] text-[#2d6a4f] flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0d2b1d] text-base mb-2">Diagnostik AI Daun</h4>
                <p className="text-xs text-[#78716c] leading-relaxed">
                  Pemindaian penyakit daun secara real-time dengan model AI berpresisi hingga 97.8%.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e7e5e4] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#eef7f1] text-[#2d6a4f] flex items-center justify-center mb-4">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0d2b1d] text-base mb-2">Traseabilitas QR Code</h4>
                <p className="text-xs text-[#78716c] leading-relaxed">
                  Setiap batch panen memiliki identitas unik QR Code yang dapat diverifikasi publik.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e7e5e4] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#eef7f1] text-[#2d6a4f] flex items-center justify-center mb-4">
                  <Sprout className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0d2b1d] text-base mb-2">Pupuk Organik Terjadwal</h4>
                <p className="text-xs text-[#78716c] leading-relaxed">
                  Pencatatan rutin pupuk kascing, MOL pisang, dan nutrisi alami tanpa kimia berbahaya.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e7e5e4] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#fdf4f3] text-[#c25c52] flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0d2b1d] text-base mb-2">Peringatan Dini Penyakit</h4>
                <p className="text-xs text-[#78716c] leading-relaxed">
                  Fitur penanganan cepat & karantina otomatis saat terdeteksi indikasi penyakit hawar / HLB.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATISTIK KEBUN MAGETAN ────────────────────────── */}
        <section className="py-12 bg-[#0d2b1d] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#74c69d]">120+</p>
                <p className="text-xs text-[#d8f3dc]/80 font-medium mt-1 uppercase tracking-wider">Pohon Terdaftar</p>
              </div>
              <div className="p-4">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#74c69d]">100%</p>
                <p className="text-xs text-[#d8f3dc]/80 font-medium mt-1 uppercase tracking-wider">Organik Desa Bibis</p>
              </div>
              <div className="p-4">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#74c69d]">97.8%</p>
                <p className="text-xs text-[#d8f3dc]/80 font-medium mt-1 uppercase tracking-wider">Presisi AI Scanner</p>
              </div>
              <div className="p-4">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#74c69d]">4.2 Ton</p>
                <p className="text-xs text-[#d8f3dc]/80 font-medium mt-1 uppercase tracking-wider">Panen Terverifikasi</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-[#f0ede6] border-t border-[#e7e5e4] py-8 text-xs text-[#78716c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#2d6a4f]" />
            <span className="font-semibold text-[#1c1917]">POMELO TRACE MAGETAN</span>
            <span>— Desa Bibis, Kec. Sukomoro, Magetan</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/trace/BATCH-BBS001-20260315')} className="hover:text-[#1c1917] transition-colors">
              Halaman Publik
            </button>
            <button onClick={() => navigate('/admin')} className="hover:text-[#1c1917] transition-colors">
              Halaman Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
