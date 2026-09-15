// ════════════════════════════════════════════════════════
//  Floating AI Chatbot Widget — Pomelo Assistant
//  Pomelo Trace Platform · Desa Bibis, Magetan
// ════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, X, Send, Bot, Sparkles, User,
  Leaf, AlertTriangle, ShieldCheck, ChevronDown, RotateCcw
} from 'lucide-react'
import { sendChatMessage } from '../services/treeService'

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    time: 'Baru saja',
    text: 'Halo! Saya Asisten AI Pomelo Trace 🍊. Ada yang bisa saya bantu terkait budidaya jeruk bali, deteksi penyakit daun, atau jadwal pemupukan organik?'
  }
]

const QUICK_PROMPTS = [
  'Bagaimana cara atasi penyakit HLB?',
  'Jadwal pupuk organik bulan ini',
  'Standar panen Jeruk Bali Merah',
  'Cara kerja AI MobileNetV2'
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isTyping])

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputValue.trim()
    if (!text) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    // Build history for backend AI context
    const historyPayload = messages
      .filter(m => m.sender === 'user' || m.sender === 'bot')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))

    try {
      const replyText = await sendChatMessage(text, null, null, historyPayload)
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Mohon maaf, terjadi kendala saat menghubungi asisten AI. Silakan coba sesaat lagi.'
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
  }

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 no-print flex flex-col items-end pointer-events-none">
      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[calc(100vw-2.5rem)] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden pointer-events-auto mb-3"
          >
            {/* Header */}
            <div className="bg-forest-800 text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-white leading-tight">Asisten AI Pomelo</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="font-mono text-[10px] text-forest-200 tracking-wider">Pakar Agrikultur & Deteksi AI</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-forest-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset percakapan"
                  aria-label="Reset chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-forest-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Tutup chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-forest-800 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span
                      className={`block font-mono text-[9px] mt-1 text-right ${
                        m.sender === 'user' ? 'text-forest-200' : 'text-stone-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center text-stone-400">
                  <div className="w-7 h-7 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-3.5 py-2 flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="p-2.5 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-forest-50 hover:text-forest-800 text-stone-600 border border-stone-200 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan ke asisten AI..."
                className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-forest-800 hover:bg-forest-700 disabled:opacity-40 disabled:hover:bg-forest-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
                aria-label="Kirim pesan"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white shadow-xl flex items-center justify-center cursor-pointer border border-emerald-600/30 transition-colors relative group"
        aria-label="Buka Chatbot AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center relative"
            >
              <MessageSquare size={26} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-forest-800" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Tooltip on desktop */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            Tanya Asisten AI 🍊
          </div>
        )}
      </motion.button>
    </div>
  )
}
