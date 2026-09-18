// ════════════════════════════════════════════════════════
//  Login Page — Admin & Farmer Auth
//  Pomelo Trace Platform · Desa Bibis, Magetan
//  Integration: POST /api/auth/login & GET /api/auth/me
// ════════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginFarmer, setAuthToken } from '../services/treeService'
import {
  Leaf, Lock, Mail, ArrowRight, ShieldCheck, QrCode,
  AlertCircle, CheckCircle2, KeyRound, User, Loader2,
  Eye, EyeOff
} from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Where user was trying to go before redirecting to login
  const from = location.state?.from?.pathname || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleLoginSubmit = async (e) => {
    e?.preventDefault()
    if (!username.trim() || !password) {
      setErrorMessage('Silakan isi username dan kata sandi Anda.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const res = await loginFarmer(username.trim(), password)
      if (res.success && res.token) {
        setAuthToken(res.token, remember)
        setSuccessMessage(`Login berhasil! Selamat datang kembali, ${res.user?.name || 'Pengguna'}.`)
        
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 600)
      } else {
        setErrorMessage(res.message || 'Kombinasi username atau kata sandi tidak valid.')
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan koneksi ke server. Silakan coba beberapa saat lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1c1917] font-sans selection:bg-[#d8f3dc] selection:text-[#0d2b1d] flex flex-col justify-between">
      {/* ── TOP HEADER ────────────────────────────────────── */}
      <header className="px-4 sm:px-8 py-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] flex items-center justify-center text-white shadow-md shadow-[#1b4332]/10">
            <Leaf className="w-5 h-5 text-[#74c69d]" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-[#0d2b1d] tracking-tight">
              POMELO TRACE
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-[#eef7f1] text-[#2d6a4f] border border-[#74c69d]/40 rounded-full uppercase tracking-wider">
              Magetan
            </span>
          </div>
        </div>

        {/* Public Page Button (Without Login) */}
        <button
          onClick={() => navigate('/trace/BATCH-BBS001-20260315')}
          className="px-4 py-2 rounded-xl border border-[#2d6a4f]/30 bg-white text-[#1b4332] font-semibold text-xs sm:text-sm hover:bg-[#eef7f1] transition-all flex items-center gap-2 shadow-xs"
        >
          <QrCode className="w-4 h-4 text-[#2d6a4f]" />
          <span>Halaman Publik (Tanpa Login)</span>
        </button>
      </header>

      {/* ── MAIN LOGIN CONTAINER ──────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#d6d3d1] p-6 sm:p-8 shadow-xl shadow-[#0d2b1d]/5 relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#74c69d]" />

            {/* Title & Subtitle */}
            <div className="text-center mb-6 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#eef7f1] text-[#2d6a4f] flex items-center justify-center mx-auto mb-3 border border-[#74c69d]/30">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d2b1d]">
                Masuk Portal Kebun
              </h1>
              <p className="text-xs sm:text-sm text-[#78716c] mt-1">
                Silakan masuk untuk mengelola data kebun & diagnostik AI
              </p>
            </div>

            {/* Error & Success Banners */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-[#fdf4f3] border border-[#e8958d]/50 text-[#c25c52] text-xs font-medium flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#c25c52] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-[#eef7f1] border border-[#74c69d]/50 text-[#1b4332] text-xs font-medium flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5 uppercase tracking-wider">
                  Username Akun
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f9f8f5] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder-[#a8a29e] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#74c69d]/30 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#f9f8f5] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder-[#a8a29e] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#74c69d]/30 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917] transition-colors p-1"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#2d6a4f]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#78716c]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#44403c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-[#d6d3d1] text-[#2d6a4f] focus:ring-[#2d6a4f]"
                  />
                  <span>Ingat Sesi Login Saya</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:opacity-95 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/20 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#74c69d]" />
                    <span>Memproses Login...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#74c69d]" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-4 text-center text-xs text-[#78716c]">
        <p>© 2026 Pomelo Trace Platform — Desa Bibis, Magetan</p>
      </footer>
    </div>
  )
}
