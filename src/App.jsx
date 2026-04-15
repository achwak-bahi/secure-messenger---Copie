import { useState, useEffect } from 'react'
import {
  Shield, Lock, Unlock, Key, Send, AlertTriangle,
  CheckCircle, XCircle, Copy, RefreshCw, Eye, EyeOff,
  ChevronDown, ChevronUp, Hash, Wifi, WifiOff,
  Zap, Globe, Radio, Database, Signal, SignalZero
} from 'lucide-react'
import { generateRSAKeyPair, encryptMessage, decryptMessage } from './crypto/cryptoUtils'
import { useSocket } from './hooks/useSocket'

// ── UI helpers ───────────────────────────────────────────────────
const Chip = ({ color = 'gray', children }) => (
  <span className={`chip chip-${color}`}>{children}</span>
)

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all">
      {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  )
}

const GlassCard = ({ children, className = '', glow = '' }) => (
  <div className={`glass rounded-2xl ${glow} ${className}`} style={{ position: 'relative', zIndex: 1 }}>
    {children}
  </div>
)

const EncStep = ({ n, label, sub, active, done, last }) => (
  <div className={`flex gap-3 ${!last ? 'pb-4 step-line' : ''}`}>
    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500 ${
      done ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]' :
      active ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,212,255,0.5)] anim-pulse-glow' :
      'bg-[#1e2d4a] text-slate-500'
    }`}>{done ? '✓' : n}</div>
    <div className="pt-0.5">
      <p className={`text-xs font-mono font-semibold transition-colors ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-500'}`}>{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  </div>
)

const HashDisplay = ({ hash, color = 'cyan' }) => {
  if (!hash) return null
  return (
    <span className="font-mono text-[10px] break-all leading-relaxed">
      {hash.split('').map((c, i) => (
        <span key={i} style={{ color: /[0-9]/.test(c)
          ? `rgba(${color === 'emerald' ? '52,211,153' : '0,212,255'},0.9)`
          : `rgba(${color === 'emerald' ? '110,231,183' : '139,92,246'},0.85)` }}>{c}</span>
      ))}
    </span>
  )
}

const SocketBadge = ({ status, partnerOnline, role }) => {
  const cfg = {
    connected:    { color: 'text-emerald-400', bg: 'rgba(0,255,136,0.08)',   border: 'rgba(0,255,136,0.2)',   dot: 'bg-emerald-500',              label: 'CONNECTED' },
    connecting:   { color: 'text-yellow-400',  bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', dot: 'bg-yellow-500 animate-pulse', label: 'CONNECTING…' },
    disconnected: { color: 'text-slate-500',   bg: 'rgba(30,45,74,0.3)',    border: 'rgba(30,45,74,0.6)',   dot: 'bg-slate-600',                label: 'DISCONNECTED' },
    error:        { color: 'text-red-400',     bg: 'rgba(255,51,102,0.08)', border: 'rgba(255,51,102,0.2)', dot: 'bg-red-500',                  label: 'ERROR' },
  }
  const c = cfg[status] || cfg.disconnected
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <div>
        <p className={`text-[10px] font-mono font-bold ${c.color}`}>{c.label}</p>
        <p className="text-[9px] text-slate-600 font-mono">{role.toUpperCase()} · partner {partnerOnline ? '🟢 online' : '🔴 offline'}</p>
      </div>
    </div>
  )
}

const NetworkChannel = ({ aliceConnected, bobConnected, hasPacket, simulateAttack }) => {
  const bothOnline = aliceConnected && bobConnected
  return (
    <div className="relative h-52 w-full flex flex-col items-center justify-center gap-1">
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
        style={{ background: hasPacket
          ? simulateAttack
            ? 'linear-gradient(to bottom, transparent, rgba(255,51,102,0.7), transparent)'
            : 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.6), rgba(0,255,136,0.5), transparent)'
          : `linear-gradient(to bottom, transparent, ${bothOnline ? 'rgba(0,212,255,0.15)' : 'rgba(30,45,74,0.4)'}, transparent)` }} />

      {hasPacket && Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="absolute text-[8px] font-mono pointer-events-none"
          style={{ left: `${20 + Math.random() * 60}%`, color: simulateAttack ? 'rgba(255,51,102,0.5)' : 'rgba(0,212,255,0.45)',
            animation: `data-flow ${1.5 + Math.random() * 1.5}s linear ${i * 0.12}s infinite` }}>
          {Math.random() > 0.5 ? '1' : '0'}
        </span>
      ))}

      <div className={`w-8 h-8 rounded-xl glass flex items-center justify-center border transition-all ${
        aliceConnected ? 'border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-[#1e2d4a]'}`}>
        <span className="text-[10px] font-mono font-bold text-sky-400">A</span>
      </div>

      <div className={`relative z-10 w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all duration-500 ${
        simulateAttack && hasPacket ? 'border-red-500/40 shadow-[0_0_18px_rgba(255,51,102,0.35)]' :
        hasPacket ? 'border-emerald-500/30 shadow-[0_0_18px_rgba(0,255,136,0.2)]' :
        bothOnline ? 'border-cyan-500/20 shadow-[0_0_10px_rgba(0,212,255,0.1)]' : 'border-[#1e2d4a]'}`}>
        {simulateAttack && hasPacket ? <AlertTriangle size={20} className="text-red-400" /> :
         hasPacket ? <Radio size={20} className="text-emerald-400 anim-pulse-glow" /> :
         bothOnline ? <Signal size={20} className="text-cyan-400" /> : <SignalZero size={20} className="text-slate-600" />}
      </div>

      <div className={`w-8 h-8 rounded-xl glass flex items-center justify-center border transition-all ${
        bobConnected ? 'border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'border-[#1e2d4a]'}`}>
        <span className="text-[10px] font-mono font-bold text-violet-400">B</span>
      </div>

      <p className={`text-[9px] font-mono tracking-widest transition-colors mt-1 ${
        simulateAttack && hasPacket ? 'text-red-500' : hasPacket ? 'text-emerald-500' :
        bothOnline ? 'text-cyan-600' : 'text-slate-600'}`}>
        {simulateAttack && hasPacket ? '☠ MITM ACTIVE' : hasPacket ? '● TRANSMITTING' : bothOnline ? '● SECURE CHANNEL' : '○ WAITING'}
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════
export default function App() {
  // ─── role state — toggled from UI ────────────────────────────
  const [role, setRole] = useState('alice')
  const isAlice  = role === 'alice'
  const roleLabel = isAlice ? 'Alice' : 'Bob'
  const chipColor = isAlice ? 'cyan' : 'violet'

  // ─── crypto state ─────────────────────────────────────────────
  const [myKeys,           setMyKeys]           = useState(null)
  const [loadingKeys,      setLoadingKeys]      = useState(false)
  const [showPub,          setShowPub]          = useState(false)
  const [showPriv,         setShowPriv]         = useState(false)
  const [partnerCryptoKey, setPartnerCryptoKey] = useState(null)

  const [message,          setMessage]          = useState('')
  const [charCount,        setCharCount]        = useState(0)
  const [encrypting,       setEncrypting]       = useState(false)
  const [steps,            setSteps]            = useState([])
  const [encryptedPacket,  setEncryptedPacket]  = useState(null)
  const [simulateAttack,   setSimulateAttack]   = useState(false)
  const [decryptResult,    setDecryptResult]    = useState(null)
  const [decrypting,       setDecrypting]       = useState(false)
  const [showInspector,    setShowInspector]    = useState(false)
  const [msgCount,         setMsgCount]         = useState(0)

  // ─── socket ────────────────────────────────────────────────────
  const socket = useSocket(role)

  // ─── reset everything when role changes ────────────────────────
  const handleRoleSwitch = () => {
    socket.disconnect()
    setRole(r => r === 'alice' ? 'bob' : 'alice')
    setMyKeys(null)
    setPartnerCryptoKey(null)
    setEncryptedPacket(null)
    setDecryptResult(null)
    setSteps([])
    setMessage('')
  }

  // ─── import partner public key when received ───────────────────
  useEffect(() => {
    if (!socket.partnerPublicKeyPEM) return
    ;(async () => {
      try {
        const pem = socket.partnerPublicKeyPEM
        const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')
        const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
        const key = await crypto.subtle.importKey(
          'spki', der.buffer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          true, ['encrypt']
        )
        setPartnerCryptoKey(key)
      } catch (e) { console.error('Failed to import partner public key', e) }
    })()
  }, [socket.partnerPublicKeyPEM])

  // ─── store received packet ─────────────────────────────────────
  useEffect(() => {
    if (socket.receivedPacket) {
      setEncryptedPacket(socket.receivedPacket)
      setDecryptResult(null)
    }
  }, [socket.receivedPacket])

  // ─── handlers ──────────────────────────────────────────────────
  const handleGenKeys = async () => {
    setLoadingKeys(true)
    setEncryptedPacket(null); setDecryptResult(null); setSteps([]); setPartnerCryptoKey(null)
    try {
      const kp = await generateRSAKeyPair()
      setMyKeys(kp)
      if (socket.connected) socket.sendPublicKey(kp.publicKeyPEM)
    } catch (e) { console.error(e) }
    setLoadingKeys(false)
  }

  const handleConnect = () => socket.connect(myKeys?.publicKeyPEM)

  const handleEncrypt = async () => {
    if (!message.trim() || !myKeys) return
    if (!socket.connected)  { alert('Connect to WebSocket first!'); return }
    if (!partnerCryptoKey)  { alert('⏳ Waiting for partner\'s public key…'); return }

    setEncrypting(true); setDecryptResult(null); setSteps([]); setEncryptedPacket(null)
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 500))
      setSteps(prev => [...prev, i])
    }
    try {
      const packet = await encryptMessage(message, partnerCryptoKey)
      const sent   = socket.sendPacket(packet)
      if (sent) { setEncryptedPacket(packet); setMsgCount(p => p + 1) }
      else alert('❌ Send failed — not connected!')
    } catch (e) { console.error(e) }
    setEncrypting(false)
  }

  const handleDecrypt = async () => {
    if (!encryptedPacket || !myKeys) return
    setDecrypting(true)
    await new Promise(r => setTimeout(r, 600))
    try { setDecryptResult(await decryptMessage(encryptedPacket, myKeys.privateKey, simulateAttack)) }
    catch (e) { console.error(e) }
    setDecrypting(false)
  }

  return (
    <div className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] scanline-overlay"
        style={{ background: 'rgba(3,5,10,0.92)', backdropFilter: 'blur(24px)' }}>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #8b5cf6, transparent)' }} />
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
                  <Shield size={22} className="text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#03050a] transition-colors ${
                  socket.connected ? 'bg-emerald-500 anim-pulse-glow' : 'bg-slate-600'}`} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight grad-cyan-violet font-mono">SECURE MESSENGER</h1>
                <p className="text-[11px] text-slate-500 font-mono tracking-[0.2em]">END-TO-END ENCRYPTED · REAL WEBSOCKET</p>
              </div>
            </div>

            {/* Chips + Toggle Role Button */}
            <div className="flex items-center gap-2 flex-wrap">
              <Chip color={chipColor}>👤 {roleLabel}</Chip>
              <Chip color="cyan">🔐 AES-256-GCM</Chip>
              <Chip color="violet">🔑 RSA-2048</Chip>
              <Chip color="green">🛡 SHA-256</Chip>

              {/* ── TOGGLE ROLE BUTTON ── */}
              <button
                onClick={handleRoleSwitch}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold transition-all"
                style={{
                  background: isAlice
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))'
                    : 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.05))',
                  border: isAlice ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(56,189,248,0.4)',
                  color: isAlice ? '#a78bfa' : '#38bdf8',
                  boxShadow: isAlice ? '0 0 12px rgba(139,92,246,0.2)' : '0 0 12px rgba(56,189,248,0.2)',
                }}
              >
                {isAlice ? '🔄 Switch to Bob' : '🔄 Switch to Alice'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* KEY MANAGEMENT */}
        <GlassCard glow={myKeys ? 'glow-cyan' : ''} className="p-6">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Key size={17} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="font-bold font-mono text-sm text-cyan-400">MY RSA KEY PAIR — {roleLabel}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Generate your 2048-bit asymmetric key pair</p>
              </div>
            </div>
            <button onClick={handleGenKeys} disabled={loadingKeys}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-mono text-sm font-bold">
              <RefreshCw size={15} className={loadingKeys ? 'animate-spin' : ''} />
              {loadingKeys ? 'Generating…' : '⚙ Generate My Keys'}
            </button>
          </div>

          {myKeys ? (
            <div className="grid md:grid-cols-2 gap-4 anim-fade-in">
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Unlock size={13} className="text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400">MY PUBLIC KEY</span>
                    <Chip color="green">Shared via WS</Chip>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setShowPub(p => !p)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-emerald-400 transition-all">
                      {showPub ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                    <CopyBtn text={myKeys.publicKeyPEM} />
                  </div>
                </div>
                <pre className="code-block transition-all duration-500"
                  style={{ color: 'rgba(110,231,183,0.75)', maxHeight: showPub ? '180px' : '48px', overflow: showPub ? 'auto' : 'hidden' }}>
                  {myKeys.publicKeyPEM}
                </pre>
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(255,51,102,0.04)', border: '1px solid rgba(255,51,102,0.15)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-red-400" />
                    <span className="text-xs font-mono font-bold text-red-400">MY PRIVATE KEY</span>
                    <Chip color="red">Never shared</Chip>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setShowPriv(p => !p)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all">
                      {showPriv ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                    <CopyBtn text={myKeys.privateKeyPEM} />
                  </div>
                </div>
                <div className="relative">
                  <pre className="code-block transition-all duration-500"
                    style={{ color: 'rgba(252,165,165,0.7)', maxHeight: showPriv ? '180px' : '48px', overflow: showPriv ? 'auto' : 'hidden', filter: showPriv ? 'none' : 'blur(6px)' }}>
                    {myKeys.privateKeyPEM}
                  </pre>
                  {!showPriv && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-mono text-red-400 flex items-center gap-1.5 bg-[#03050a]/80 px-3 py-1.5 rounded-lg">
                        <EyeOff size={11}/> Click eye to reveal
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#1e2d4a] p-12 text-center">
              <div className="anim-float inline-block mb-4"><Key size={44} className="text-slate-700 mx-auto"/></div>
              <p className="text-slate-400 font-mono text-sm">No keys generated yet</p>
              <p className="text-slate-600 text-xs mt-1">Generate keys first, then connect</p>
            </div>
          )}

          {/* Partner key status */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p className="text-xs font-mono font-bold text-violet-400 flex items-center gap-2">
              {partnerCryptoKey
                ? <><CheckCircle size={13} className="text-emerald-400" /> Partner's public key received ✓ — ready to encrypt!</>
                : <><AlertTriangle size={13} className="text-yellow-400" /> Waiting for partner's public key…</>
              }
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-1">
              {partnerCryptoKey
                ? 'Messages will be encrypted with partner\'s public key'
                : 'Partner must generate keys & connect for key exchange'
              }
            </p>
          </div>
        </GlassCard>

        {/* CONNECTION */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <SocketBadge status={socket.status} partnerOnline={socket.partnerOnline} role={role} />
            {!socket.connected ? (
              <button onClick={handleConnect} disabled={!myKeys}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono font-bold text-white transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#0891b2,#7c3aed)', boxShadow: '0 0 14px rgba(0,212,255,0.2)' }}>
                <Wifi size={14}/> Connect as {roleLabel}
              </button>
            ) : (
              <button onClick={socket.disconnect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono font-bold text-red-400 transition-all"
                style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)' }}>
                <WifiOff size={14}/> Disconnect
              </button>
            )}
            {!myKeys && (
              <p className="text-[11px] font-mono text-yellow-400 flex items-center gap-1.5">
                <AlertTriangle size={11}/> Generate keys first
              </p>
            )}
            {socket.lastDelivered && (
              <p className="text-[10px] font-mono text-emerald-500 ml-auto">
                ✓ Last delivered at {new Date(socket.lastDelivered).toLocaleTimeString()}
              </p>
            )}
          </div>
        </GlassCard>

        {/* SEND / RECEIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_1fr] gap-5 items-start">

          {/* SEND */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                <Send size={16} className="text-sky-400"/>
              </div>
              <div>
                <h2 className="font-bold font-mono text-sky-400 text-sm">SEND MESSAGE</h2>
                <p className="text-xs text-slate-500">Encrypted with partner's public key</p>
              </div>
            </div>

            {socket.partnerOfflineAlert && (
              <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)' }}>
                <p className="text-xs font-mono text-red-400 flex items-center gap-2">
                  <AlertTriangle size={11}/> Partner went offline — packet not delivered
                </p>
              </div>
            )}

            <div className="neon-divider mb-4" />
            <label className="block text-[10px] font-mono text-slate-400 tracking-widest mb-2">✉ PLAINTEXT MESSAGE</label>
            <div className="relative">
              <textarea value={message} onChange={e => { setMessage(e.target.value); setCharCount(e.target.value.length) }}
                placeholder="Type your secret message…" rows={4} className="cyber-input w-full rounded-xl px-4 py-3 resize-none" />
              <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-600">{charCount}</span>
            </div>

            <button onClick={handleEncrypt}
              disabled={!message.trim() || !myKeys || encrypting || !socket.connected || !partnerCryptoKey}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl mt-4 text-white font-mono text-sm font-bold">
              <Lock size={15} className={encrypting ? 'animate-pulse' : ''}/>
              {encrypting ? 'Encrypting…' : '🔒 Encrypt & Send'}
            </button>

            {!partnerCryptoKey && socket.connected && (
              <p className="mt-2 text-[11px] font-mono text-yellow-500/80 flex items-center gap-1.5">
                <AlertTriangle size={11}/> Waiting for partner to generate & connect with keys
              </p>
            )}

            {steps.length > 0 && (
              <div className="mt-5 anim-fade-in">
                <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                  <Zap size={10} className="text-cyan-500"/> ENCRYPTION PIPELINE
                </p>
                <EncStep n="1" label="AES-256 Session Key"     sub="Generated via CSPRNG"                  active={steps.includes(1) && !steps.includes(2)} done={steps.includes(2)} />
                <EncStep n="2" label="AES-GCM Encryption"      sub="Message → Ciphertext + Auth Tag"       active={steps.includes(2) && !steps.includes(3)} done={steps.includes(3)} />
                <EncStep n="3" label="RSA-OAEP Key Wrap"       sub="AES key encrypted w/ partner's pubkey" active={steps.includes(3) && !steps.includes(4)} done={steps.includes(4)} />
                <EncStep n="4" label="SHA-256 + WebSocket Send" sub="Hash computed → Packet sent via WS"   last active={steps.includes(4) && !encryptedPacket} done={!!encryptedPacket} />
              </div>
            )}

            {encryptedPacket && socket.connected && (
              <div className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5 anim-fade-in"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}>
                <CheckCircle size={15} className="text-emerald-400 flex-shrink-0"/>
                <p className="text-xs font-mono font-bold text-emerald-400">📡 Sent via WebSocket ✓</p>
              </div>
            )}
          </GlassCard>

          {/* CHANNEL */}
          <div className="flex flex-col items-center gap-3 pt-4 lg:pt-8">
            <span className="text-[9px] font-mono text-slate-500 tracking-[0.3em]">WS CHANNEL</span>
            <NetworkChannel aliceConnected={socket.connected} bobConnected={socket.partnerOnline}
              hasPacket={!!encryptedPacket} simulateAttack={simulateAttack} />
            <div className="glass rounded-xl p-3 w-full text-center">
              <p className="text-[9px] font-mono text-slate-500 tracking-widest mb-2">MITM ATTACK</p>
              <button onClick={() => { setSimulateAttack(p => !p); setDecryptResult(null) }}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${simulateAttack ? 'bg-red-500 shadow-[0_0_12px_rgba(255,51,102,0.5)]' : 'bg-[#1e2d4a]'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${simulateAttack ? 'translate-x-6' : ''}`}/>
              </button>
              <p className={`text-[9px] font-mono mt-2 ${simulateAttack ? 'text-red-400' : 'text-slate-600'}`}>
                {simulateAttack ? '☠ ACTIVE' : '○ OFF'}
              </p>
            </div>
          </div>

          {/* RECEIVE */}
          <GlassCard glow={decryptResult ? (decryptResult.integrityOk ? 'glow-green' : 'glow-red') : ''} className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Unlock size={16} className="text-violet-400"/>
              </div>
              <div>
                <h2 className="font-bold font-mono text-violet-400 text-sm">RECEIVE & DECRYPT</h2>
                <p className="text-xs text-slate-500">Decrypted with your private key</p>
              </div>
            </div>

            {socket.receivedPacket && !decryptResult && (
              <div className="mb-4 p-3 rounded-xl anim-fade-in"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <p className="text-xs font-mono font-bold text-violet-400 flex items-center gap-2">
                  <Radio size={12} className="anim-pulse-glow"/> 📨 Packet received via WebSocket!
                </p>
                <p className="text-[10px] text-violet-600 mt-1 font-mono">
                  Received at {new Date(socket.receivedPacket._receivedAt || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            )}

            {simulateAttack && (
              <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,51,102,0.07)', border: '1px solid rgba(255,51,102,0.25)' }}>
                <p className="text-xs font-mono font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle size={13}/> ⚠ MITM ATTACK ACTIVE
                </p>
              </div>
            )}

            <div className="neon-divider mb-4" />

            <button onClick={handleDecrypt}
              disabled={!encryptedPacket || !myKeys || decrypting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-mono text-sm font-bold mb-5">
              <Unlock size={15} className={decrypting ? 'animate-pulse' : ''}/>
              {decrypting ? 'Decrypting…' : '🔓 Decrypt & Verify'}
            </button>

            {decryptResult ? (
              <div className="space-y-4 anim-fade-in">
                <div className="rounded-xl p-4" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.8)' }}>
                  <p className="text-[9px] font-mono text-slate-500 tracking-widest mb-2">💬 DECRYPTED MESSAGE</p>
                  <p className="text-sm font-mono text-slate-100 break-words leading-relaxed">{decryptResult.plaintext}</p>
                </div>

                <div className={`p-4 rounded-xl ${decryptResult.integrityOk ? 'anim-pulse-glow' : ''}`}
                  style={{
                    background: decryptResult.integrityOk ? 'rgba(0,255,136,0.06)' : 'rgba(255,51,102,0.06)',
                    border: `1px solid ${decryptResult.integrityOk ? 'rgba(0,255,136,0.25)' : 'rgba(255,51,102,0.25)'}`,
                  }}>
                  <div className="flex items-center gap-2.5">
                    {decryptResult.integrityOk ? <CheckCircle size={18} className="text-emerald-400"/> : <XCircle size={18} className="text-red-400"/>}
                    <div>
                      <p className={`font-mono text-sm font-bold ${decryptResult.integrityOk ? 'text-emerald-400' : 'text-red-400'}`}>
                        {decryptResult.integrityOk ? 'INTEGRITY VERIFIED ✓' : 'INTEGRITY COMPROMISED ✗'}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 ${decryptResult.integrityOk ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                        {decryptResult.integrityOk ? 'Hashes match — message is authentic' : 'ALERT: Message was tampered!'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.6)' }}>
                  <p className="text-[9px] font-mono text-slate-500 tracking-widest flex items-center gap-1.5">
                    <Hash size={10}/> HASH COMPARISON
                  </p>
                  <div>
                    <p className="text-[9px] text-slate-600 font-mono mb-1.5">ORIGINAL (Sender SHA-256)</p>
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                      <HashDisplay hash={decryptResult.receivedHash} color="cyan"/>
                    </div>
                  </div>
                  <div>
                    <p className={`text-[9px] font-mono mb-1.5 ${decryptResult.integrityOk ? 'text-slate-600' : 'text-red-600'}`}>COMPUTED (Receiver SHA-256)</p>
                    <div className="p-2 rounded-lg" style={{
                      background: decryptResult.integrityOk ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,102,0.04)',
                      border: `1px solid ${decryptResult.integrityOk ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.15)'}`}}>
                      <HashDisplay hash={decryptResult.computedHash} color={decryptResult.integrityOk ? 'emerald' : 'red'}/>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">Verdict:</span>
                    <Chip color={decryptResult.integrityOk ? 'green' : 'red'}>
                      {decryptResult.integrityOk ? '✓ IDENTICAL' : '✗ MISMATCH'}
                    </Chip>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#1e2d4a] p-10 text-center">
                <div className="anim-float inline-block mb-4"><Database size={44} className="text-slate-700 mx-auto"/></div>
                <p className="text-slate-400 font-mono text-sm">Awaiting encrypted packet</p>
                <p className="text-slate-600 text-xs mt-1.5">Will arrive automatically via WebSocket</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* PACKET INSPECTOR */}
        {encryptedPacket && (
          <GlassCard className="overflow-hidden">
            <button onClick={() => setShowInspector(p => !p)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors group">
              <div className="flex items-center gap-3">
                <Radio size={14} className="text-cyan-400"/>
                <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">ENCRYPTED PACKET INSPECTOR</span>
                <Chip color="gray">Base64</Chip><Chip color="cyan">4 fields</Chip>
              </div>
              {showInspector ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
            </button>
            {showInspector && (
              <div className="px-6 pb-6">
                <div className="neon-divider mb-5"/>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: '🔐 CIPHERTEXT',        sub: 'AES-256-GCM Encrypted',         key: 'ciphertext',      color: '#00d4ff' },
                    { label: '🗝 ENCRYPTED AES KEY', sub: 'RSA-OAEP Wrapped Session Key', key: 'encryptedAesKey', color: '#a78bfa' },
                    { label: '🎲 IV / NONCE',         sub: '96-bit Random',                key: 'iv',              color: '#fbbf24' },
                    { label: '# SHA-256 HASH',        sub: 'Integrity Fingerprint',        key: 'msgHash',         color: '#00ff88' },
                  ].map(({ label, sub, key, color }) => (
                    <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.7)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs font-mono font-bold" style={{ color }}>{label}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
                        </div>
                        <CopyBtn text={encryptedPacket[key]}/>
                      </div>
                      <p className="font-mono text-[10px] break-all leading-loose" style={{ color: `${color}99` }}>
                        {encryptedPacket[key].slice(0, 120)}{encryptedPacket[key].length > 120 ? '…' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        )}

        <div className="py-6 text-center">
          <div className="neon-divider mb-5"/>
          <p className="text-xs font-mono text-slate-600">
            <span className="text-cyan-600">SECURE MESSENGER</span> · WebSocket on <span className="text-yellow-500">ws://localhost:8080</span> ·
            Crypto via <span className="text-cyan-500">Web Crypto API</span> · <span className="text-violet-500">Zero trust</span>
          </p>
        </div>
      </main>
    </div>
  )
}
