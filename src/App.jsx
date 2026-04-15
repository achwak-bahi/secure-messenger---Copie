// import { useState } from 'react'
// import {
//   Shield, Lock, Unlock, Key, Send, AlertTriangle,
//   CheckCircle, XCircle, Copy, RefreshCw, Eye, EyeOff,
//   ChevronDown, ChevronUp, Hash, Wifi, WifiOff
// } from 'lucide-react'
// import { generateRSAKeyPair, encryptMessage, decryptMessage } from './crypto/cryptoUtils'

// // ── Reusable UI Components ────────────────────────────────────────────────────

// const Badge = ({ color, children, className = '' }) => {
//   const v = {
//     cyan:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
//     purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
//     green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
//     red:    'bg-red-500/10 text-red-400 border-red-500/30',
//     yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
//     gray:   'bg-slate-500/10 text-slate-400 border-slate-500/30',
//   }
//   return (
//     <span className={`text-xs px-2 py-0.5 rounded font-mono border ${v[color]} ${className}`}>
//       {children}
//     </span>
//   )
// }

// const Card = ({ children, className = '', glow = '' }) => {
//   const g = {
//     cyan:  'shadow-[0_0_20px_rgba(0,212,255,0.08)] border-cyan-500/25',
//     green: 'shadow-[0_0_20px_rgba(0,255,136,0.08)] border-emerald-500/25',
//     red:   'shadow-[0_0_20px_rgba(255,51,102,0.08)] border-red-500/25',
//     '':    'border-[#1e2d4a]',
//   }
//   return (
//     <div className={`bg-[#0f1629] rounded-2xl border ${g[glow]} p-6 ${className}`}>
//       {children}
//     </div>
//   )
// }

// const CopyBtn = ({ text }) => {
//   const [copied, setCopied] = useState(false)
//   return (
//     <button
//       onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
//       className="p-1.5 rounded hover:bg-[#1e2d4a] text-slate-500 hover:text-cyan-400 transition-colors"
//     >
//       {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
//     </button>
//   )
// }

// const Step = ({ n, label, active, done }) => (
//   <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
//     done   ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' :
//     active ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' :
//              'border-[#1e2d4a] bg-[#0a0e1a] text-slate-500'
//   }`}>
//     <span className={`w-5 h-5 rounded-full text-xs font-bold font-mono flex items-center justify-center ${
//       done ? 'bg-emerald-500 text-black' : active ? 'bg-cyan-500 text-black' : 'bg-[#1e2d4a] text-slate-400'
//     }`}>{done ? '✓' : n}</span>
//     <span className="text-xs font-mono font-medium">{label}</span>
//   </div>
// )

// // ── Main App ──────────────────────────────────────────────────────────────────

// export default function App() {
//   const [keys,            setKeys]            = useState(null)
//   const [loadingKeys,     setLoadingKeys]     = useState(false)
//   const [showPub,         setShowPub]         = useState(false)
//   const [showPriv,        setShowPriv]        = useState(false)
//   const [message,         setMessage]         = useState('')
//   const [packet,          setPacket]          = useState(null)
//   const [encrypting,      setEncrypting]      = useState(false)
//   const [steps,           setSteps]           = useState([])
//   const [simulateAttack,  setSimulateAttack]  = useState(false)
//   const [decryptResult,   setDecryptResult]   = useState(null)
//   const [decrypting,      setDecrypting]      = useState(false)
//   const [showPacket,      setShowPacket]      = useState(false)

//   const handleGenKeys = async () => {
//     setLoadingKeys(true); setPacket(null); setDecryptResult(null); setSteps([])
//     try { setKeys(await generateRSAKeyPair()) }
//     catch (e) { console.error(e) }
//     setLoadingKeys(false)
//   }

//   const handleEncrypt = async () => {
//     if (!message.trim() || !keys) return
//     setEncrypting(true); setDecryptResult(null); setSteps([]); setPacket(null)
//     for (let i = 1; i <= 4; i++) {
//       await new Promise(r => setTimeout(r, 450))
//       setSteps(prev => [...prev, i])
//     }
//     try { setPacket(await encryptMessage(message, keys.publicKey)) }
//     catch (e) { console.error(e) }
//     setEncrypting(false)
//   }

//   const handleDecrypt = async () => {
//     if (!packet || !keys) return
//     setDecrypting(true)
//     try { setDecryptResult(await decryptMessage(packet, keys.privateKey, simulateAttack)) }
//     catch (e) { console.error(e) }
//     setDecrypting(false)
//   }

//   return (
//     <div className="min-h-screen bg-[#060910] text-slate-100">

//       {/* ── Header ── */}
//       <header className="border-b border-[#1e2d4a] bg-[#0a0e1a]/90 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_18px_rgba(0,212,255,0.4)]">
//               <Shield size={20} className="text-white" />
//             </div>
//             <div>
//               <h1
//                 className="text-xl font-bold font-mono"
//                 style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
//               >
//                 SECURE MESSENGER
//               </h1>
//               <p className="text-[11px] text-slate-500 font-mono tracking-widest">END-TO-END ENCRYPTED COMMUNICATION</p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-2">
//             <Badge color="cyan">AES-256-GCM</Badge>
//             <Badge color="purple">RSA-2048-OAEP</Badge>
//             <Badge color="green">SHA-256</Badge>
//             <Badge color="gray">Web Crypto API</Badge>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

//         {/* ── RSA Keys Section ── */}
//         <Card glow={keys ? 'cyan' : ''}>
//           <div className="flex items-center justify-between mb-5">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
//                 <Key size={15} className="text-cyan-400" />
//               </div>
//               <div>
//                 <h2 className="font-bold font-mono text-cyan-400 text-sm">RSA KEY MANAGEMENT</h2>
//                 <p className="text-xs text-slate-500">Generate 2048-bit asymmetric key pair</p>
//               </div>
//             </div>
//             <button
//               onClick={handleGenKeys}
//               disabled={loadingKeys}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono text-sm font-semibold transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] disabled:opacity-50"
//             >
//               <RefreshCw size={14} className={loadingKeys ? 'animate-spin' : ''} />
//               {loadingKeys ? 'Generating…' : 'Generate RSA Keys'}
//             </button>
//           </div>

//           {keys ? (
//             <div className="grid md:grid-cols-2 gap-4">
//               {/* Public Key */}
//               <div className="bg-[#0a0e1a] rounded-xl border border-emerald-500/20 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Unlock size={13} className="text-emerald-400" />
//                     <span className="text-xs font-mono font-semibold text-emerald-400">PUBLIC KEY</span>
//                     <Badge color="green">Shareable</Badge>
//                   </div>
//                   <div className="flex gap-1">
//                     <button onClick={() => setShowPub(p => !p)} className="p-1.5 rounded hover:bg-[#1e2d4a] text-slate-500 hover:text-cyan-400 transition-colors">
//                       {showPub ? <EyeOff size={13} /> : <Eye size={13} />}
//                     </button>
//                     <CopyBtn text={keys.publicKeyPEM} />
//                   </div>
//                 </div>
//                 <pre
//                   className="text-[10px] text-emerald-300/70 font-mono leading-relaxed overflow-auto transition-all duration-300"
//                   style={{ maxHeight: showPub ? '200px' : '56px', overflow: showPub ? 'auto' : 'hidden' }}
//                 >
//                   {keys.publicKeyPEM}
//                 </pre>
//               </div>

//               {/* Private Key */}
//               <div className="bg-[#0a0e1a] rounded-xl border border-red-500/20 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Lock size={13} className="text-red-400" />
//                     <span className="text-xs font-mono font-semibold text-red-400">PRIVATE KEY</span>
//                     <Badge color="red">Secret</Badge>
//                   </div>
//                   <div className="flex gap-1">
//                     <button onClick={() => setShowPriv(p => !p)} className="p-1.5 rounded hover:bg-[#1e2d4a] text-slate-500 hover:text-cyan-400 transition-colors">
//                       {showPriv ? <EyeOff size={13} /> : <Eye size={13} />}
//                     </button>
//                     <CopyBtn text={keys.privateKeyPEM} />
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <pre
//                     className="text-[10px] text-red-300/70 font-mono leading-relaxed transition-all duration-300"
//                     style={{ maxHeight: showPriv ? '200px' : '56px', overflow: showPriv ? 'auto' : 'hidden', filter: showPriv ? 'none' : 'blur(5px)' }}
//                   >
//                     {keys.privateKeyPEM}
//                   </pre>
//                   {!showPriv && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-xs text-red-400 font-mono flex items-center gap-1.5">
//                         <EyeOff size={12} /> Click eye icon to reveal
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-[#0a0e1a] rounded-xl border border-dashed border-[#1e2d4a] p-10 text-center">
//               <Key size={36} className="text-slate-700 mx-auto mb-3" />
//               <p className="text-slate-500 font-mono text-sm">No keys generated yet</p>
//               <p className="text-slate-600 text-xs mt-1">Click "Generate RSA Keys" to begin secure communication</p>
//             </div>
//           )}
//         </Card>

//         {/* ── Main Layout ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_1fr] gap-5 items-start">

//           {/* SENDER */}
//           <Card>
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
//                 <Send size={14} className="text-blue-400" />
//               </div>
//               <div>
//                 <h2 className="font-bold font-mono text-blue-400 text-sm">SENDER</h2>
//                 <p className="text-xs text-slate-500">Encrypt & transmit message</p>
//               </div>
//             </div>

//             <label className="block text-xs font-mono text-slate-400 mb-2">✉️ PLAINTEXT MESSAGE</label>
//             <textarea
//               value={message}
//               onChange={e => setMessage(e.target.value)}
//               placeholder="Type your secret message here…"
//               rows={4}
//               className="w-full bg-[#0a0e1a] border border-[#1e2d4a] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(0,212,255,0.08)] resize-none transition-all mb-4"
//             />

//             <button
//               onClick={handleEncrypt}
//               disabled={!message.trim() || !keys || encrypting}
//               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 font-mono text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <Lock size={14} className={encrypting ? 'animate-pulse' : ''} />
//               {encrypting ? 'Encrypting…' : '🔒 Encrypt & Send'}
//             </button>

//             {steps.length > 0 && (
//               <div className="mt-4 space-y-2 animate-slide-in">
//                 <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-2">ENCRYPTION PROCESS</p>
//                 <Step n="1" label="AES-256 Key Generated" active={steps.includes(1) && !steps.includes(2)} done={steps.includes(2)} />
//                 <Step n="2" label="Message → AES-GCM Encrypted" active={steps.includes(2) && !steps.includes(3)} done={steps.includes(3)} />
//                 <Step n="3" label="AES Key → RSA-OAEP Wrapped" active={steps.includes(3) && !steps.includes(4)} done={steps.includes(4)} />
//                 <Step n="4" label="SHA-256 Hash Computed" active={steps.includes(4) && !packet} done={steps.includes(4) && !!packet} />
//               </div>
//             )}

//             {packet && (
//               <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 animate-slide-in">
//                 <CheckCircle size={14} className="text-emerald-400" />
//                 <span className="text-xs font-mono text-emerald-400">Packet transmitted successfully!</span>
//               </div>
//             )}
//           </Card>

//           {/* NETWORK CHANNEL */}
//           <div className="flex flex-col items-center justify-start gap-3 pt-4 lg:pt-16">
//             <span className="text-[10px] font-mono text-slate-500 tracking-widest">NETWORK</span>

//             <div className="flex flex-col items-center gap-0">
//               <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#1e2d4a]" />

//               {/* Channel icon */}
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
//                 simulateAttack
//                   ? 'bg-red-500/15 border-red-500/40 shadow-[0_0_12px_rgba(255,51,102,0.25)]'
//                   : packet
//                     ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_12px_rgba(0,255,136,0.2)]'
//                     : 'bg-[#0a0e1a] border-[#1e2d4a]'
//               }`}>
//                 {simulateAttack
//                   ? <AlertTriangle size={20} className="text-red-400" />
//                   : packet
//                     ? <Wifi size={20} className="text-emerald-400 animate-packet" />
//                     : <WifiOff size={20} className="text-slate-600" />
//                 }
//               </div>

//               <div className="w-px h-10 bg-gradient-to-b from-[#1e2d4a] to-transparent" />
//             </div>

//             {/* Attack toggle */}
//             <div className="flex flex-col items-center gap-1.5 mt-1">
//               <span className="text-[9px] font-mono text-slate-500">MITM SIM</span>
//               <button
//                 onClick={() => { setSimulateAttack(p => !p); setDecryptResult(null) }}
//                 className={`relative w-11 h-6 rounded-full transition-all duration-300 ${simulateAttack ? 'bg-red-500' : 'bg-[#1e2d4a]'}`}
//               >
//                 <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${simulateAttack ? 'translate-x-5' : ''}`} />
//               </button>
//               {simulateAttack && <span className="text-[9px] font-mono text-red-400 text-center">☠️ Active</span>}
//             </div>
//           </div>

//           {/* RECEIVER */}
//           <Card glow={decryptResult ? (decryptResult.integrityOk ? 'green' : 'red') : ''}>
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
//                 <Unlock size={14} className="text-violet-400" />
//               </div>
//               <div>
//                 <h2 className="font-bold font-mono text-violet-400 text-sm">RECEIVER</h2>
//                 <p className="text-xs text-slate-500">Decrypt & verify integrity</p>
//               </div>
//             </div>

//             {simulateAttack && (
//               <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
//                 <AlertTriangle size={13} className="text-red-400" />
//                 <span className="text-xs font-mono text-red-400">⚠️ MITM Attack Simulation Active</span>
//               </div>
//             )}

//             <button
//               onClick={handleDecrypt}
//               disabled={!packet || !keys || decrypting}
//               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 hover:border-violet-500/50 text-violet-400 font-mono text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-4"
//             >
//               <Unlock size={14} className={decrypting ? 'animate-pulse' : ''} />
//               {decrypting ? 'Decrypting…' : '🔓 Decrypt & Verify'}
//             </button>

//             {decryptResult ? (
//               <div className="space-y-3 animate-slide-in">
//                 {/* Decrypted message */}
//                 <div className="bg-[#0a0e1a] rounded-xl border border-[#1e2d4a] p-4">
//                   <p className="text-[10px] font-mono text-slate-500 mb-2">💬 DECRYPTED MESSAGE</p>
//                   <p className="text-sm font-mono text-slate-100 break-words">{decryptResult.plaintext}</p>
//                 </div>

//                 {/* Integrity result */}
//                 <div className={`p-4 rounded-xl border ${decryptResult.integrityOk ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
//                   <div className="flex items-center gap-2 mb-1.5">
//                     {decryptResult.integrityOk
//                       ? <CheckCircle size={15} className="text-emerald-400" />
//                       : <XCircle size={15} className="text-red-400" />
//                     }
//                     <span className={`font-mono text-sm font-bold ${decryptResult.integrityOk ? 'text-emerald-400' : 'text-red-400'}`}>
//                       {decryptResult.integrityOk ? 'INTEGRITY VERIFIED ✓' : 'INTEGRITY COMPROMISED ✗'}
//                     </span>
//                   </div>
//                   <p className={`text-xs font-mono ${decryptResult.integrityOk ? 'text-emerald-300/70' : 'text-red-300/70'}`}>
//                     {decryptResult.integrityOk
//                       ? 'Message is authentic and has not been altered in transit.'
//                       : 'WARNING: Message was tampered with! Hashes do not match.'
//                     }
//                   </p>
//                 </div>

//                 {/* Hash comparison */}
//                 <div className="bg-[#0a0e1a] rounded-xl border border-[#1e2d4a] p-4 space-y-3">
//                   <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 tracking-widest">
//                     <Hash size={11} /> HASH VERIFICATION
//                   </p>
//                   <div>
//                     <p className="text-[9px] text-slate-600 font-mono mb-1">ORIGINAL (Sender's SHA-256):</p>
//                     <p className="text-[10px] font-mono text-cyan-300 break-all leading-relaxed">{decryptResult.receivedHash}</p>
//                   </div>
//                   <div>
//                     <p className="text-[9px] text-slate-600 font-mono mb-1">COMPUTED (Receiver's SHA-256):</p>
//                     <p className={`text-[10px] font-mono break-all leading-relaxed ${decryptResult.integrityOk ? 'text-emerald-300' : 'text-red-300'}`}>
//                       {decryptResult.computedHash}
//                     </p>
//                   </div>
//                   <div className="pt-2 border-t border-[#1e2d4a] flex items-center gap-2">
//                     <span className="text-[10px] font-mono text-slate-500">Result:</span>
//                     <Badge color={decryptResult.integrityOk ? 'green' : 'red'}>
//                       {decryptResult.integrityOk ? '✓ IDENTICAL' : '✗ MISMATCH'}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-[#0a0e1a] rounded-xl border border-dashed border-[#1e2d4a] p-10 text-center">
//                 <Unlock size={36} className="text-slate-700 mx-auto mb-3" />
//                 <p className="text-slate-500 font-mono text-sm">Awaiting encrypted packet</p>
//                 <p className="text-slate-600 text-xs mt-1">Sender must encrypt a message first</p>
//               </div>
//             )}
//           </Card>
//         </div>

//         {/* ── Packet Inspector ── */}
//         {packet && (
//           <Card>
//             <button
//               onClick={() => setShowPacket(p => !p)}
//               className="w-full flex items-center justify-between text-slate-300 hover:text-cyan-400 transition-colors"
//             >
//               <div className="flex items-center gap-2">
//                 <Hash size={15} className="text-cyan-400" />
//                 <span className="font-mono text-sm font-semibold">ENCRYPTED PACKET INSPECTOR</span>
//                 <Badge color="gray">Base64</Badge>
//                 <Badge color="cyan">4 fields</Badge>
//               </div>
//               {showPacket ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </button>

//             {showPacket && (
//               <div className="mt-5 grid md:grid-cols-2 gap-4 animate-slide-in">
//                 {[
//                   { label: '🔐 Ciphertext', sub: 'AES-GCM Encrypted', key: 'ciphertext',      col: 'text-cyan-300' },
//                   { label: '🗝️ Encrypted AES Key', sub: 'RSA-OAEP Wrapped', key: 'encryptedAesKey', col: 'text-purple-300' },
//                   { label: '🎲 IV / Nonce', sub: '96-bit Random', key: 'iv',              col: 'text-yellow-300' },
//                   { label: '# SHA-256 Hash', sub: 'Integrity Fingerprint', key: 'msgHash',        col: 'text-emerald-300' },
//                 ].map(({ label, sub, key, col }) => (
//                   <div key={key} className="bg-[#0a0e1a] rounded-xl border border-[#1e2d4a] p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <p className="text-xs font-mono text-slate-300">{label}</p>
//                         <p className="text-[10px] text-slate-600">{sub}</p>
//                       </div>
//                       <CopyBtn text={packet[key]} />
//                     </div>
//                     <p className={`text-[10px] font-mono break-all leading-relaxed ${col}`}>
//                       {packet[key].slice(0, 128)}{packet[key].length > 128 ? '…' : ''}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>
//         )}

//         {/* ── Footer ── */}
//         <div className="text-center py-4 border-t border-[#1e2d4a]">
//           <p className="text-xs font-mono text-slate-600">
//             Powered by <span className="text-cyan-500">Web Crypto API</span> · All cryptographic operations run locally in your browser · No data is ever transmitted to a server
//           </p>
//         </div>
//       </main>
//     </div>
//   )
// }



// import { useState, useEffect, useRef } from 'react'
// import {
//   Shield, Lock, Unlock, Key, Send, AlertTriangle,
//   CheckCircle, XCircle, Copy, RefreshCw, Eye, EyeOff,
//   ChevronDown, ChevronUp, Hash, Wifi, WifiOff,
//   Cpu, Database, Radio, Activity, Zap, Globe
// } from 'lucide-react'
// import { generateRSAKeyPair, encryptMessage, decryptMessage } from './crypto/cryptoUtils'

// // ════════════════════════════════════════════════════════════
// // UTILITY COMPONENTS
// // ════════════════════════════════════════════════════════════

// const Chip = ({ color = 'gray', children, icon }) => (
//   <span className={`chip chip-${color}`}>
//     {icon && <span>{icon}</span>}
//     {children}
//   </span>
// )

// const CopyBtn = ({ text, small }) => {
//   const [copied, setCopied] = useState(false)
//   const size = small ? 12 : 14
//   return (
//     <button
//       onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
//       title="Copy"
//       className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all group"
//     >
//       {copied
//         ? <CheckCircle size={size} className="text-emerald-400" />
//         : <Copy size={size} className="group-hover:scale-110 transition-transform" />
//       }
//     </button>
//   )
// }

// const GlassCard = ({ children, className = '', glow = '' }) => (
//   <div className={`glass rounded-2xl ${glow} ${className}`} style={{ position: 'relative', zIndex: 1 }}>
//     {children}
//   </div>
// )

// // Animated step with connector line
// const EncStep = ({ n, label, sub, active, done, last }) => (
//   <div className={`flex gap-3 ${!last ? 'pb-4 step-line' : ''}`}>
//     <div className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500 ${
//       done   ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]' :
//       active ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,212,255,0.5)] anim-pulse-glow' :
//                'bg-[#1e2d4a] text-slate-500'
//     }`}>
//       {done ? '✓' : n}
//     </div>
//     <div className="pt-0.5">
//       <p className={`text-xs font-mono font-semibold transition-colors duration-300 ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-500'}`}>
//         {label}
//       </p>
//       {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
//     </div>
//   </div>
// )

// // Animated typing header
// const TypingText = ({ text }) => {
//   const [displayed, setDisplayed] = useState('')
//   useEffect(() => {
//     setDisplayed('')
//     let i = 0
//     const t = setInterval(() => {
//       if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
//       else clearInterval(t)
//     }, 55)
//     return () => clearInterval(t)
//   }, [text])
//   return (
//     <span>
//       {displayed}
//       <span className="anim-blink text-cyan-400">|</span>
//     </span>
//   )
// }

// // Stat badge for header
// const StatBadge = ({ icon: Icon, label, value, color }) => (
//   <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
//     <Icon size={13} className={`text-${color}-400`} />
//     <div>
//       <p className="text-[9px] text-slate-500 font-mono tracking-wider">{label}</p>
//       <p className={`text-[11px] font-bold font-mono text-${color}-300`}>{value}</p>
//     </div>
//   </div>
// )

// // Hash display with colored chars
// const HashDisplay = ({ hash, color = 'cyan' }) => {
//   if (!hash) return null
//   return (
//     <span className="font-mono text-[10px] break-all leading-relaxed">
//       {hash.split('').map((c, i) => (
//         <span
//           key={i}
//           className={`hash-char`}
//           style={{ color: /[0-9]/.test(c) ? `rgba(${color === 'emerald' ? '52,211,153' : '0,212,255'},0.9)` : `rgba(${color === 'emerald' ? '110,231,183' : '139,92,246'},0.85)` }}
//         >
//           {c}
//         </span>
//       ))}
//     </span>
//   )
// }

// // Network channel visualizer
// const NetworkChannel = ({ hasPacket, simulateAttack }) => {
//   const bits = Array.from({ length: 16 }, (_, i) => ({
//     char: Math.random() > 0.5 ? '1' : '0',
//     delay: i * 0.15,
//     left: 15 + Math.random() * 70,
//   }))
//   return (
//     <div className="relative h-40 w-full flex flex-col items-center justify-center">
//       {/* Vertical wire */}
//       <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
//         style={{ background: hasPacket
//           ? simulateAttack
//             ? 'linear-gradient(to bottom, transparent, rgba(255,51,102,0.6), transparent)'
//             : 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.5), rgba(0,255,136,0.5), transparent)'
//           : 'linear-gradient(to bottom, transparent, rgba(30,45,74,0.6), transparent)'
//         }}
//       />

//       {/* Floating data bits */}
//       {hasPacket && bits.map((b, i) => (
//         <span
//           key={i}
//           className="absolute text-[8px] font-mono pointer-events-none"
//           style={{
//             left: `${b.left}%`,
//             color: simulateAttack ? 'rgba(255,51,102,0.5)' : 'rgba(0,212,255,0.4)',
//             animation: `data-flow ${1.8 + Math.random()}s linear ${b.delay}s infinite`,
//           }}
//         >
//           {b.char}
//         </span>
//       ))}

//       {/* Center node */}
//       <div className={`relative z-10 w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all duration-500 ${
//         simulateAttack && hasPacket ? 'glow-red border-red-500/40' :
//         hasPacket ? 'glow-green border-emerald-500/30' : 'border-[#1e2d4a]'
//       }`}>
//         {simulateAttack && hasPacket
//           ? <AlertTriangle size={22} className="text-red-400" />
//           : hasPacket
//             ? <Wifi size={22} className="text-emerald-400 anim-pulse-glow" />
//             : <WifiOff size={22} className="text-slate-600" />
//         }
//       </div>

//       <p className={`mt-2 text-[9px] font-mono tracking-widest transition-colors ${
//         simulateAttack && hasPacket ? 'text-red-500' : hasPacket ? 'text-emerald-500' : 'text-slate-600'
//       }`}>
//         {simulateAttack && hasPacket ? '☠ MITM ACTIVE' : hasPacket ? '● TRANSMITTING' : '○ IDLE'}
//       </p>
//     </div>
//   )
// }

// // ════════════════════════════════════════════════════════════
// // MAIN APP
// // ════════════════════════════════════════════════════════════

// export default function App() {
//   const [keys,           setKeys]           = useState(null)
//   const [loadingKeys,    setLoadingKeys]    = useState(false)
//   const [showPub,        setShowPub]        = useState(false)
//   const [showPriv,       setShowPriv]       = useState(false)
//   const [message,        setMessage]        = useState('')
//   const [charCount,      setCharCount]      = useState(0)
//   const [packet,         setPacket]         = useState(null)
//   const [encrypting,     setEncrypting]     = useState(false)
//   const [steps,          setSteps]          = useState([])
//   const [simulateAttack, setSimulateAttack] = useState(false)
//   const [decryptResult,  setDecryptResult]  = useState(null)
//   const [decrypting,     setDecrypting]     = useState(false)
//   const [showPacket,     setShowPacket]     = useState(false)
//   const [msgCount,       setMsgCount]       = useState(0)

//   const handleGenKeys = async () => {
//     setLoadingKeys(true); setPacket(null); setDecryptResult(null); setSteps([])
//     try { setKeys(await generateRSAKeyPair()) }
//     catch (e) { console.error(e) }
//     setLoadingKeys(false)
//   }

//   const handleEncrypt = async () => {
//     if (!message.trim() || !keys) return
//     setEncrypting(true); setDecryptResult(null); setSteps([]); setPacket(null)
//     const delays = [500, 500, 500, 500]
//     for (let i = 0; i < delays.length; i++) {
//       await new Promise(r => setTimeout(r, delays[i]))
//       setSteps(prev => [...prev, i + 1])
//     }
//     try {
//       setPacket(await encryptMessage(message, keys.publicKey))
//       setMsgCount(p => p + 1)
//     } catch (e) { console.error(e) }
//     setEncrypting(false)
//   }

//   const handleDecrypt = async () => {
//     if (!packet || !keys) return
//     setDecrypting(true)
//     await new Promise(r => setTimeout(r, 600))
//     try { setDecryptResult(await decryptMessage(packet, keys.privateKey, simulateAttack)) }
//     catch (e) { console.error(e) }
//     setDecrypting(false)
//   }

//   return (
//     <div className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>

//       {/* ── HEADER ─────────────────────────────────────────────── */}
//       <header className="sticky top-0 z-50 border-b border-white/[0.04] scanline-overlay"
//         style={{ background: 'rgba(3,5,10,0.92)', backdropFilter: 'blur(24px)' }}>

//         {/* Top accent line */}
//         <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #8b5cf6, transparent)' }} />

//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between gap-4 flex-wrap">

//             {/* Logo */}
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
//                   style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
//                   <Shield size={22} className="text-white" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#03050a] anim-pulse-glow" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-black tracking-tight grad-cyan-violet font-mono">
//                   SECURE MESSENGER
//                 </h1>
//                 <p className="text-[11px] text-slate-500 font-mono tracking-[0.25em]">
//                   END-TO-END ENCRYPTED COMMUNICATION SYSTEM
//                 </p>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="hidden lg:flex items-center gap-2">
//               <StatBadge icon={Cpu}      label="ENCRYPTION" value="AES-256-GCM" color="cyan"   />
//               <StatBadge icon={Key}      label="KEY EXCHANGE" value="RSA-2048"  color="violet" />
//               <StatBadge icon={Hash}     label="INTEGRITY"   value="SHA-256"   color="green"  />
//               <StatBadge icon={Activity} label="MESSAGES"    value={`${msgCount} sent`} color="yellow" />
//             </div>
//           </div>

//           {/* Bottom chips */}
//           <div className="flex items-center gap-2 mt-3 flex-wrap">
//             <Chip color="cyan">🔐 AES-256-GCM</Chip>
//             <Chip color="violet">🔑 RSA-OAEP</Chip>
//             <Chip color="green">🛡 SHA-256</Chip>
//             <Chip color="gray">⚡ Web Crypto API</Chip>
//             <Chip color="yellow">🔒 Zero Server</Chip>
//             <span className="ml-auto text-[10px] text-slate-600 font-mono hidden md:flex items-center gap-1.5">
//               <Globe size={10} /> All crypto runs locally in your browser
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

//         {/* ── RSA KEY MANAGEMENT ─────────────────────────────────── */}
//         <div className="anim-fade-up">
//           <GlassCard glow={keys ? 'glow-cyan' : ''} className="p-6">
//             {/* Section header */}
//             <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                   style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
//                   <Key size={17} className="text-cyan-400" />
//                 </div>
//                 <div>
//                   <h2 className="font-bold font-mono text-sm text-cyan-400 tracking-wide">
//                     RSA KEY MANAGEMENT
//                   </h2>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Generate asymmetric 2048-bit key pair for secure AES key exchange
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleGenKeys}
//                 disabled={loadingKeys}
//                 className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-mono text-sm font-bold"
//               >
//                 <RefreshCw size={15} className={loadingKeys ? 'animate-spin' : ''} />
//                 {loadingKeys ? 'Generating keypair…' : '⚙ Generate RSA Keys'}
//               </button>
//             </div>

//             {keys ? (
//               <div className="grid md:grid-cols-2 gap-4 anim-fade-in">

//                 {/* Public Key */}
//                 <div className="rounded-xl p-4 transition-all" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <Unlock size={13} className="text-emerald-400" />
//                       <span className="text-xs font-mono font-bold text-emerald-400">PUBLIC KEY</span>
//                       <Chip color="green">Shareable</Chip>
//                     </div>
//                     <div className="flex gap-1">
//                       <button onClick={() => setShowPub(p => !p)}
//                         className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-emerald-400 transition-all">
//                         {showPub ? <EyeOff size={13} /> : <Eye size={13} />}
//                       </button>
//                       <CopyBtn text={keys.publicKeyPEM} small />
//                     </div>
//                   </div>
//                   <pre className="code-block transition-all duration-500 overflow-auto"
//                     style={{
//                       color: 'rgba(110,231,183,0.75)',
//                       maxHeight: showPub ? '200px' : '48px',
//                       overflow: showPub ? 'auto' : 'hidden',
//                     }}>
//                     {keys.publicKeyPEM}
//                   </pre>
//                 </div>

//                 {/* Private Key */}
//                 <div className="rounded-xl p-4 transition-all" style={{ background: 'rgba(255,51,102,0.04)', border: '1px solid rgba(255,51,102,0.15)' }}>
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <Lock size={13} className="text-red-400" />
//                       <span className="text-xs font-mono font-bold text-red-400">PRIVATE KEY</span>
//                       <Chip color="red">Secret</Chip>
//                     </div>
//                     <div className="flex gap-1">
//                       <button onClick={() => setShowPriv(p => !p)}
//                         className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all">
//                         {showPriv ? <EyeOff size={13} /> : <Eye size={13} />}
//                       </button>
//                       <CopyBtn text={keys.privateKeyPEM} small />
//                     </div>
//                   </div>
//                   <div className="relative">
//                     <pre className="code-block transition-all duration-500"
//                       style={{
//                         color: 'rgba(252,165,165,0.7)',
//                         maxHeight: showPriv ? '200px' : '48px',
//                         overflow: showPriv ? 'auto' : 'hidden',
//                         filter: showPriv ? 'none' : 'blur(6px)',
//                       }}>
//                       {keys.privateKeyPEM}
//                     </pre>
//                     {!showPriv && (
//                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <span className="text-xs font-mono text-red-400 flex items-center gap-1.5 bg-[#03050a]/80 px-3 py-1.5 rounded-lg">
//                           <EyeOff size={11} /> Click eye to reveal private key
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="rounded-xl border border-dashed border-[#1e2d4a] p-12 text-center">
//                 <div className="anim-float inline-block mb-4">
//                   <Key size={44} className="text-slate-700 mx-auto" />
//                 </div>
//                 <p className="text-slate-400 font-mono text-sm mb-1">No RSA keys generated</p>
//                 <p className="text-slate-600 text-xs">Click "Generate RSA Keys" to start secure communication</p>
//               </div>
//             )}
//           </GlassCard>
//         </div>

//         {/* ── MAIN 3-COLUMN LAYOUT ───────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_1fr] gap-5 items-start">

//           {/* ─────────── SENDER ─────────── */}
//           <div className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
//             <GlassCard className="p-6">
//               {/* Header */}
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                   style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
//                   <Send size={16} className="text-sky-400" />
//                 </div>
//                 <div>
//                   <h2 className="font-bold font-mono text-sky-400 text-sm tracking-wide">SENDER</h2>
//                   <p className="text-xs text-slate-500">Compose, encrypt & transmit</p>
//                 </div>
//                 <div className="ml-auto">
//                   <Chip color="cyan">Alice</Chip>
//                 </div>
//               </div>

//               <div className="neon-divider mb-5" />

//               {/* Message input */}
//               <label className="block text-[10px] font-mono text-slate-400 tracking-widest mb-2">
//                 ✉ PLAINTEXT MESSAGE
//               </label>
//               <div className="relative">
//                 <textarea
//                   value={message}
//                   onChange={e => { setMessage(e.target.value); setCharCount(e.target.value.length) }}
//                   placeholder="Type your secret message…"
//                   rows={4}
//                   className="cyber-input w-full rounded-xl px-4 py-3 resize-none"
//                 />
//                 <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-600">
//                   {charCount} chars
//                 </span>
//               </div>

//               {!keys && (
//                 <p className="mt-2 text-[11px] font-mono text-yellow-500/80 flex items-center gap-1.5">
//                   <AlertTriangle size={11} /> Generate RSA keys first
//                 </p>
//               )}

//               {/* Encrypt button */}
//               <button
//                 onClick={handleEncrypt}
//                 disabled={!message.trim() || !keys || encrypting}
//                 className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl mt-4 text-white font-mono text-sm font-bold"
//               >
//                 <Lock size={15} className={encrypting ? 'animate-pulse' : ''} />
//                 {encrypting ? 'Encrypting message…' : '🔒 Encrypt & Send'}
//               </button>

//               {/* Steps animation */}
//               {steps.length > 0 && (
//                 <div className="mt-5 anim-fade-in">
//                   <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-4 flex items-center gap-2">
//                     <Zap size={10} className="text-cyan-500" />
//                     ENCRYPTION PIPELINE
//                   </p>
//                   <div>
//                     <EncStep n="1" label="AES-256 Session Key" sub="Generated via CSPRNG"
//                       active={steps.includes(1) && !steps.includes(2)} done={steps.includes(2)} />
//                     <EncStep n="2" label="AES-GCM Encryption"  sub="Message → Ciphertext + Auth Tag"
//                       active={steps.includes(2) && !steps.includes(3)} done={steps.includes(3)} />
//                     <EncStep n="3" label="RSA-OAEP Key Wrap"   sub="AES key → Encrypted with public key"
//                       active={steps.includes(3) && !steps.includes(4)} done={steps.includes(4)} />
//                     <EncStep n="4" label="SHA-256 Digest"      sub="Integrity fingerprint computed" last
//                       active={steps.includes(4) && !packet} done={!!packet} />
//                   </div>
//                 </div>
//               )}

//               {/* Success */}
//               {packet && (
//                 <div className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5 anim-fade-in"
//                   style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}>
//                   <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
//                   <div>
//                     <p className="text-xs font-mono font-bold text-emerald-400">Packet transmitted!</p>
//                     <p className="text-[10px] text-emerald-600 mt-0.5">4 fields · AES+RSA+SHA256 · ready for decryption</p>
//                   </div>
//                 </div>
//               )}
//             </GlassCard>
//           </div>

//           {/* ─────────── NETWORK CHANNEL ─────────── */}
//           <div className="flex flex-col items-center gap-2 pt-4 lg:pt-10"
//             style={{ position: 'relative', zIndex: 1 }}>

//             <span className="text-[9px] font-mono text-slate-500 tracking-[0.3em]">CHANNEL</span>

//             <NetworkChannel hasPacket={!!packet} simulateAttack={simulateAttack} />

//             {/* MITM Toggle */}
//             <div className="glass rounded-xl p-3 w-full text-center">
//               <p className="text-[9px] font-mono text-slate-500 tracking-widest mb-2">MITM ATTACK</p>
//               <button
//                 onClick={() => { setSimulateAttack(p => !p); setDecryptResult(null) }}
//                 className={`relative w-12 h-6 rounded-full transition-all duration-300 ${simulateAttack ? 'bg-red-500 shadow-[0_0_12px_rgba(255,51,102,0.5)]' : 'bg-[#1e2d4a]'}`}
//               >
//                 <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${simulateAttack ? 'translate-x-6' : ''}`} />
//               </button>
//               <p className={`text-[9px] font-mono mt-2 transition-colors ${simulateAttack ? 'text-red-400' : 'text-slate-600'}`}>
//                 {simulateAttack ? '☠ ACTIVE' : '○ OFF'}
//               </p>
//             </div>
//           </div>

//           {/* ─────────── RECEIVER ─────────── */}
//           <div className="anim-fade-up" style={{ animationDelay: '0.2s' }}>
//             <GlassCard
//               glow={decryptResult ? (decryptResult.integrityOk ? 'glow-green' : 'glow-red') : ''}
//               className="p-6"
//             >
//               {/* Header */}
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                   style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
//                   <Unlock size={16} className="text-violet-400" />
//                 </div>
//                 <div>
//                   <h2 className="font-bold font-mono text-violet-400 text-sm tracking-wide">RECEIVER</h2>
//                   <p className="text-xs text-slate-500">Decrypt & verify integrity</p>
//                 </div>
//                 <div className="ml-auto">
//                   <Chip color="violet">Bob</Chip>
//                 </div>
//               </div>

//               <div className="neon-divider mb-5" />

//               {simulateAttack && (
//                 <div className="mb-4 p-3 rounded-xl anim-fade-in"
//                   style={{ background: 'rgba(255,51,102,0.07)', border: '1px solid rgba(255,51,102,0.25)' }}>
//                   <div className="flex items-center gap-2">
//                     <AlertTriangle size={13} className="text-red-400" />
//                     <p className="text-xs font-mono font-bold text-red-400">⚠ MITM ATTACK ACTIVE</p>
//                   </div>
//                   <p className="text-[10px] text-red-400/60 mt-1 font-mono">Attacker is intercepting & modifying the message</p>
//                 </div>
//               )}

//               {/* Decrypt button */}
//               <button
//                 onClick={handleDecrypt}
//                 disabled={!packet || !keys || decrypting}
//                 className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-mono text-sm font-bold mb-5"
//                 style={{ background: decryptResult ? (decryptResult.integrityOk ? 'linear-gradient(135deg,#065f46,#1e3a5f)' : 'linear-gradient(135deg,#7f1d1d,#3b1e54)') : undefined }}
//               >
//                 <Unlock size={15} className={decrypting ? 'animate-pulse' : ''} />
//                 {decrypting ? 'Decrypting…' : '🔓 Decrypt & Verify'}
//               </button>

//               {decryptResult ? (
//                 <div className="space-y-4 anim-fade-in">

//                   {/* Decrypted message */}
//                   <div className="rounded-xl p-4" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.8)' }}>
//                     <p className="text-[9px] font-mono text-slate-500 tracking-widest mb-2">💬 DECRYPTED MESSAGE</p>
//                     <p className="text-sm font-mono text-slate-100 break-words leading-relaxed">
//                       {decryptResult.plaintext}
//                     </p>
//                   </div>

//                   {/* Integrity status */}
//                   <div className={`p-4 rounded-xl ${decryptResult.integrityOk ? 'anim-pulse-glow' : ''}`}
//                     style={{
//                       background: decryptResult.integrityOk ? 'rgba(0,255,136,0.06)' : 'rgba(255,51,102,0.06)',
//                       border: `1px solid ${decryptResult.integrityOk ? 'rgba(0,255,136,0.25)' : 'rgba(255,51,102,0.25)'}`,
//                     }}>
//                     <div className="flex items-center gap-2.5">
//                       {decryptResult.integrityOk
//                         ? <CheckCircle size={18} className="text-emerald-400" />
//                         : <XCircle size={18} className="text-red-400" />
//                       }
//                       <div>
//                         <p className={`font-mono text-sm font-bold ${decryptResult.integrityOk ? 'text-emerald-400' : 'text-red-400'}`}>
//                           {decryptResult.integrityOk ? 'INTEGRITY VERIFIED ✓' : 'INTEGRITY COMPROMISED ✗'}
//                         </p>
//                         <p className={`text-[10px] font-mono mt-0.5 ${decryptResult.integrityOk ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
//                           {decryptResult.integrityOk
//                             ? 'Message is authentic — hashes match perfectly'
//                             : 'ALERT: Message was tampered in transit!'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Hash comparison */}
//                   <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.6)' }}>
//                     <p className="text-[9px] font-mono text-slate-500 tracking-widest flex items-center gap-1.5">
//                       <Hash size={10} /> HASH COMPARISON TABLE
//                     </p>

//                     <div className="space-y-3">
//                       <div>
//                         <p className="text-[9px] text-slate-600 font-mono mb-1.5 flex items-center gap-1">
//                           <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
//                           ORIGINAL HASH (Sender SHA-256)
//                         </p>
//                         <div className="p-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
//                           <HashDisplay hash={decryptResult.receivedHash} color="cyan" />
//                         </div>
//                       </div>

//                       <div>
//                         <p className={`text-[9px] font-mono mb-1.5 flex items-center gap-1 ${decryptResult.integrityOk ? 'text-slate-600' : 'text-red-600'}`}>
//                           <span className={`w-2 h-2 rounded-full inline-block ${decryptResult.integrityOk ? 'bg-emerald-500' : 'bg-red-500'}`} />
//                           COMPUTED HASH (Receiver SHA-256)
//                         </p>
//                         <div className="p-2 rounded-lg" style={{
//                           background: decryptResult.integrityOk ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,102,0.04)',
//                           border: `1px solid ${decryptResult.integrityOk ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.15)'}`
//                         }}>
//                           <HashDisplay hash={decryptResult.computedHash} color={decryptResult.integrityOk ? 'emerald' : 'red'} />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
//                       <span className="text-[10px] font-mono text-slate-500">Verdict:</span>
//                       <Chip color={decryptResult.integrityOk ? 'green' : 'red'}>
//                         {decryptResult.integrityOk ? '✓ HASHES IDENTICAL' : '✗ HASH MISMATCH'}
//                       </Chip>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="rounded-xl border border-dashed border-[#1e2d4a] p-10 text-center">
//                   <div className="anim-float inline-block mb-4">
//                     <Database size={44} className="text-slate-700 mx-auto" />
//                   </div>
//                   <p className="text-slate-400 font-mono text-sm">Awaiting encrypted packet</p>
//                   <p className="text-slate-600 text-xs mt-1.5">Sender must encrypt a message first</p>
//                 </div>
//               )}
//             </GlassCard>
//           </div>
//         </div>

//         {/* ── PACKET INSPECTOR ───────────────────────────────────── */}
//         {packet && (
//           <div className="anim-fade-up">
//             <GlassCard className="overflow-hidden">
//               <button
//                 onClick={() => setShowPacket(p => !p)}
//                 className="w-full flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors group"
//               >
//                 <div className="flex items-center gap-3 flex-wrap">
//                   <div className="w-8 h-8 rounded-lg flex items-center justify-center"
//                     style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
//                     <Radio size={14} className="text-cyan-400" />
//                   </div>
//                   <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
//                     ENCRYPTED PACKET INSPECTOR
//                   </span>
//                   <Chip color="gray">Base64</Chip>
//                   <Chip color="cyan">4 fields</Chip>
//                   <Chip color="green">Read-only</Chip>
//                 </div>
//                 {showPacket
//                   ? <ChevronUp size={16} className="text-slate-400" />
//                   : <ChevronDown size={16} className="text-slate-400" />
//                 }
//               </button>

//               {showPacket && (
//                 <div className="px-6 pb-6 anim-fade-in">
//                   <div className="neon-divider mb-5" />
//                   <div className="grid md:grid-cols-2 gap-4">
//                     {[
//                       { label: '🔐 CIPHERTEXT',        sub: 'AES-256-GCM Encrypted Message',  key: 'ciphertext',       color: '#00d4ff' },
//                       { label: '🗝 ENCRYPTED AES KEY', sub: 'RSA-2048-OAEP Wrapped Session Key', key: 'encryptedAesKey', color: '#a78bfa' },
//                       { label: '🎲 IV / NONCE',        sub: '96-bit Random Initialization Vector', key: 'iv',           color: '#fbbf24' },
//                       { label: '# SHA-256 HASH',       sub: 'Message Integrity Fingerprint',   key: 'msgHash',         color: '#00ff88' },
//                     ].map(({ label, sub, key, color }) => (
//                       <div key={key} className="rounded-xl p-4 transition-all hover:border-white/10"
//                         style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.7)' }}>
//                         <div className="flex items-start justify-between mb-3">
//                           <div>
//                             <p className="text-xs font-mono font-bold" style={{ color }}>{label}</p>
//                             <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
//                           </div>
//                           <CopyBtn text={packet[key]} small />
//                         </div>
//                         <p className="font-mono text-[10px] break-all leading-loose" style={{ color: `${color}99` }}>
//                           {packet[key].slice(0, 120)}{packet[key].length > 120 ? '…' : ''}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </GlassCard>
//           </div>
//         )}

//         {/* ── FOOTER ─────────────────────────────────────────────── */}
//         <div className="py-6 text-center">
//           <div className="neon-divider mb-5" />
//           <p className="text-xs font-mono text-slate-600">
//             <span className="text-cyan-600">SECURE MESSENGER</span> · Powered by <span className="text-cyan-500">Web Crypto API</span> ·
//             All operations run locally in your browser · No data is ever sent to a server ·
//             <span className="text-violet-500"> Zero trust architecture</span>
//           </p>
//         </div>
//       </main>
//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import {
  Shield, Lock, Unlock, Key, Send, AlertTriangle,
  CheckCircle, XCircle, Copy, RefreshCw, Eye, EyeOff,
  ChevronDown, ChevronUp, Hash, Wifi, WifiOff,
  Cpu, Activity, Zap, Globe, Radio, Database,
  Signal, SignalZero, SignalLow, SignalMedium
} from 'lucide-react'
import { generateRSAKeyPair, encryptMessage, decryptMessage } from './crypto/cryptoUtils'
import { useSocket } from './hooks/useSocket'

// ════════════════════════════════════════════════════════════
// UI COMPONENTS
// ════════════════════════════════════════════════════════════

const Chip = ({ color = 'gray', children }) => (
  <span className={`chip chip-${color}`}>{children}</span>
)

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all"
    >
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
          : `rgba(${color === 'emerald' ? '110,231,183' : '139,92,246'},0.85)` }}>
          {c}
        </span>
      ))}
    </span>
  )
}

// ─── Socket Status Badge ──────────────────────────────────────────
const SocketBadge = ({ status, partnerOnline, role }) => {
  const cfg = {
    connected:    { color: 'text-emerald-400', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.2)', dot: 'bg-emerald-500', label: 'CONNECTED' },
    connecting:   { color: 'text-yellow-400',  bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', dot: 'bg-yellow-500 animate-pulse', label: 'CONNECTING…' },
    disconnected: { color: 'text-slate-500',   bg: 'rgba(30,45,74,0.3)',  border: 'rgba(30,45,74,0.6)',  dot: 'bg-slate-600', label: 'DISCONNECTED' },
    error:        { color: 'text-red-400',     bg: 'rgba(255,51,102,0.08)', border: 'rgba(255,51,102,0.2)', dot: 'bg-red-500',  label: 'ERROR' },
  }
  const c = cfg[status] || cfg.disconnected
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <div>
        <p className={`text-[10px] font-mono font-bold ${c.color}`}>{c.label}</p>
        <p className="text-[9px] text-slate-600 font-mono">
          {role.toUpperCase()} · partner {partnerOnline ? '🟢 online' : '🔴 offline'}
        </p>
      </div>
    </div>
  )
}

// ─── Live Network Channel ─────────────────────────────────────────
const NetworkChannel = ({ aliceConnected, bobConnected, hasPacket, simulateAttack, partnerOnlineAlice }) => {
  const bothOnline = aliceConnected && bobConnected
  return (
    <div className="relative h-52 w-full flex flex-col items-center justify-center gap-1">
      {/* Wire */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
        style={{ background: hasPacket
          ? simulateAttack
            ? 'linear-gradient(to bottom, transparent, rgba(255,51,102,0.7), transparent)'
            : 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.6), rgba(0,255,136,0.5), transparent)'
          : `linear-gradient(to bottom, transparent, ${bothOnline ? 'rgba(0,212,255,0.15)' : 'rgba(30,45,74,0.4)'}, transparent)`
        }} />

      {/* Moving data bits */}
      {hasPacket && Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="absolute text-[8px] font-mono pointer-events-none"
          style={{
            left: `${20 + Math.random() * 60}%`,
            color: simulateAttack ? 'rgba(255,51,102,0.5)' : 'rgba(0,212,255,0.45)',
            animation: `data-flow ${1.5 + Math.random() * 1.5}s linear ${i * 0.12}s infinite`,
          }}>
          {Math.random() > 0.5 ? '1' : '0'}
        </span>
      ))}

      {/* Alice node */}
      <div className={`w-8 h-8 rounded-xl glass flex items-center justify-center border transition-all ${
        aliceConnected ? 'border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-[#1e2d4a]'
      }`}>
        <span className="text-[10px] font-mono font-bold text-sky-400">A</span>
      </div>

      {/* Center relay node */}
      <div className={`relative z-10 w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all duration-500 ${
        simulateAttack && hasPacket ? 'border-red-500/40 shadow-[0_0_18px_rgba(255,51,102,0.35)]' :
        hasPacket ? 'border-emerald-500/30 shadow-[0_0_18px_rgba(0,255,136,0.2)]' :
        bothOnline ? 'border-cyan-500/20 shadow-[0_0_10px_rgba(0,212,255,0.1)]' :
        'border-[#1e2d4a]'
      }`}>
        {simulateAttack && hasPacket
          ? <AlertTriangle size={20} className="text-red-400" />
          : hasPacket
            ? <Radio size={20} className="text-emerald-400 anim-pulse-glow" />
            : bothOnline
              ? <Signal size={20} className="text-cyan-400" />
              : <SignalZero size={20} className="text-slate-600" />
        }
      </div>

      {/* Bob node */}
      <div className={`w-8 h-8 rounded-xl glass flex items-center justify-center border transition-all ${
        bobConnected ? 'border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'border-[#1e2d4a]'
      }`}>
        <span className="text-[10px] font-mono font-bold text-violet-400">B</span>
      </div>

      <p className={`text-[9px] font-mono tracking-widest transition-colors mt-1 ${
        simulateAttack && hasPacket ? 'text-red-500' :
        hasPacket ? 'text-emerald-500' :
        bothOnline ? 'text-cyan-600' : 'text-slate-600'
      }`}>
        {simulateAttack && hasPacket ? '☠ MITM ACTIVE' :
         hasPacket ? '● TRANSMITTING' :
         bothOnline ? '● SECURE CHANNEL' : '○ WAITING'}
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════

export default function App() {
  // ─── Crypto state ───────────────────────────────────────
  const [keys,           setKeys]           = useState(null)
  const [loadingKeys,    setLoadingKeys]    = useState(false)
  const [showPub,        setShowPub]        = useState(false)
  const [showPriv,       setShowPriv]       = useState(false)
  const [message,        setMessage]        = useState('')
  const [charCount,      setCharCount]      = useState(0)
  const [encrypting,     setEncrypting]     = useState(false)
  const [steps,          setSteps]          = useState([])
  const [encryptedPacket, setEncryptedPacket] = useState(null)
  const [simulateAttack, setSimulateAttack] = useState(false)
  const [decryptResult,  setDecryptResult]  = useState(null)
  const [decrypting,     setDecrypting]     = useState(false)
  const [showPacketInspector, setShowPacketInspector] = useState(false)
  const [msgCount,       setMsgCount]       = useState(0)

  // ─── WebSocket ──────────────────────────────────────────
  const alice = useSocket('alice')
  const bob   = useSocket('bob')

  // عندما يستقبل Bob حزمة عبر الـ Socket
  useEffect(() => {
    if (bob.receivedPacket) {
      setEncryptedPacket(bob.receivedPacket)
      setDecryptResult(null)
    }
  }, [bob.receivedPacket])

  // ─── Handlers ───────────────────────────────────────────
  const handleGenKeys = async () => {
    setLoadingKeys(true); setEncryptedPacket(null); setDecryptResult(null); setSteps([])
    try { setKeys(await generateRSAKeyPair()) }
    catch (e) { console.error(e) }
    setLoadingKeys(false)
  }

  const handleEncrypt = async () => {
    if (!message.trim() || !keys) return
    if (!alice.connected) { alert('Alice is not connected to WebSocket server!'); return }

    setEncrypting(true); setDecryptResult(null); setSteps([]); setEncryptedPacket(null)
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 500))
      setSteps(prev => [...prev, i])
    }
    try {
      const packet = await encryptMessage(message, keys.publicKey)
      const sent = alice.sendPacket(packet)
      if (sent) {
        setEncryptedPacket(packet)
        setMsgCount(p => p + 1)
      } else {
        alert('❌ Failed to send — Alice is not connected!')
      }
    } catch (e) { console.error(e) }
    setEncrypting(false)
  }

  const handleDecrypt = async () => {
    if (!encryptedPacket || !keys) return
    setDecrypting(true)
    await new Promise(r => setTimeout(r, 600))
    try { setDecryptResult(await decryptMessage(encryptedPacket, keys.privateKey, simulateAttack)) }
    catch (e) { console.error(e) }
    setDecrypting(false)
  }

  const bothConnected = alice.connected && bob.connected

  return (
    <div className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] scanline-overlay"
        style={{ background: 'rgba(3,5,10,0.92)', backdropFilter: 'blur(24px)' }}>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #8b5cf6, transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
                  <Shield size={22} className="text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#03050a] transition-colors ${bothConnected ? 'bg-emerald-500 anim-pulse-glow' : 'bg-slate-600'}`} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight grad-cyan-violet font-mono">SECURE MESSENGER</h1>
                <p className="text-[11px] text-slate-500 font-mono tracking-[0.2em]">END-TO-END ENCRYPTED · REAL WEBSOCKET</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Cpu size={13} className="text-cyan-400" />
                <div>
                  <p className="text-[9px] text-slate-500 font-mono">ENCRYPTION</p>
                  <p className="text-[11px] font-bold font-mono text-cyan-300">AES-256-GCM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Key size={13} className="text-violet-400" />
                <div>
                  <p className="text-[9px] text-slate-500 font-mono">KEY EXCHANGE</p>
                  <p className="text-[11px] font-bold font-mono text-violet-300">RSA-2048</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Activity size={13} className={bothConnected ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <p className="text-[9px] text-slate-500 font-mono">CHANNEL</p>
                  <p className={`text-[11px] font-bold font-mono ${bothConnected ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {bothConnected ? 'LIVE ●' : 'OFFLINE ○'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Hash size={13} className="text-yellow-400" />
                <div>
                  <p className="text-[9px] text-slate-500 font-mono">MESSAGES</p>
                  <p className="text-[11px] font-bold font-mono text-yellow-300">{msgCount} sent</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Chip color="cyan">🔐 AES-256-GCM</Chip>
            <Chip color="violet">🔑 RSA-OAEP</Chip>
            <Chip color="green">🛡 SHA-256</Chip>
            <Chip color="yellow">⚡ WebSocket</Chip>
            <Chip color="gray">🔒 Zero Server Storage</Chip>
            <span className="ml-auto text-[10px] text-slate-600 font-mono hidden md:flex items-center gap-1.5">
              <Globe size={10} /> ws://localhost:8080
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── RSA KEYS ──────────────────────────────────────── */}
        <div className="anim-fade-up">
          <GlassCard glow={keys ? 'glow-cyan' : ''} className="p-6">
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Key size={17} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="font-bold font-mono text-sm text-cyan-400 tracking-wide">RSA KEY MANAGEMENT</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generate 2048-bit asymmetric key pair</p>
                </div>
              </div>
              <button onClick={handleGenKeys} disabled={loadingKeys}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-mono text-sm font-bold">
                <RefreshCw size={15} className={loadingKeys ? 'animate-spin' : ''} />
                {loadingKeys ? 'Generating…' : '⚙ Generate RSA Keys'}
              </button>
            </div>

            {keys ? (
              <div className="grid md:grid-cols-2 gap-4 anim-fade-in">
                <div className="rounded-xl p-4" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Unlock size={13} className="text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-400">PUBLIC KEY</span>
                      <Chip color="green">Shareable</Chip>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setShowPub(p => !p)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-emerald-400 transition-all">
                        {showPub ? <EyeOff size={13}/> : <Eye size={13}/>}
                      </button>
                      <CopyBtn text={keys.publicKeyPEM} />
                    </div>
                  </div>
                  <pre className="code-block transition-all duration-500"
                    style={{ color: 'rgba(110,231,183,0.75)', maxHeight: showPub ? '180px' : '48px', overflow: showPub ? 'auto' : 'hidden' }}>
                    {keys.publicKeyPEM}
                  </pre>
                </div>

                <div className="rounded-xl p-4" style={{ background: 'rgba(255,51,102,0.04)', border: '1px solid rgba(255,51,102,0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock size={13} className="text-red-400" />
                      <span className="text-xs font-mono font-bold text-red-400">PRIVATE KEY</span>
                      <Chip color="red">Secret</Chip>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setShowPriv(p => !p)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all">
                        {showPriv ? <EyeOff size={13}/> : <Eye size={13}/>}
                      </button>
                      <CopyBtn text={keys.privateKeyPEM} />
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="code-block transition-all duration-500"
                      style={{ color: 'rgba(252,165,165,0.7)', maxHeight: showPriv ? '180px' : '48px', overflow: showPriv ? 'auto' : 'hidden', filter: showPriv ? 'none' : 'blur(6px)' }}>
                      {keys.privateKeyPEM}
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
                <p className="text-slate-400 font-mono text-sm">No RSA keys generated</p>
                <p className="text-slate-600 text-xs mt-1">Click "Generate RSA Keys" to begin</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* ── SERVER CONNECTION BANNER ──────────────────────── */}
        {!bothConnected && (
          <div className="anim-fade-in p-4 rounded-2xl glass border border-yellow-500/20"
            style={{ background: 'rgba(251,191,36,0.04)' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-mono font-bold text-yellow-400">WebSocket Server Required</p>
                <p className="text-xs text-yellow-600 mt-0.5 font-mono">
                  Run <span className="text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded">npm run start</span> then connect Alice & Bob below
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 3-COLUMN LAYOUT ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_1fr] gap-5 items-start">

          {/* ─── ALICE (SENDER) ─── */}
          <div className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <Send size={16} className="text-sky-400"/>
                </div>
                <div>
                  <h2 className="font-bold font-mono text-sky-400 text-sm">SENDER</h2>
                  <p className="text-xs text-slate-500">Compose, encrypt & transmit</p>
                </div>
                <div className="ml-auto"><Chip color="cyan">Alice</Chip></div>
              </div>

              {/* Socket connect/status */}
              <div className="flex items-center gap-2 mb-4">
                <SocketBadge status={alice.status} partnerOnline={alice.partnerOnline} role="alice" />
                {!alice.connected ? (
                  <button onClick={alice.connect}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-cyan-400 transition-all"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <Wifi size={12}/> Connect
                  </button>
                ) : (
                  <button onClick={alice.disconnect}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-red-400 transition-all"
                    style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)' }}>
                    <WifiOff size={12}/> Disconnect
                  </button>
                )}
              </div>

              {alice.partnerOfflineAlert && (
                <div className="mb-3 p-3 rounded-xl anim-fade-in"
                  style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)' }}>
                  <p className="text-xs font-mono text-red-400 flex items-center gap-2">
                    <AlertTriangle size={11}/> Bob is offline — packet could not be delivered
                  </p>
                </div>
              )}

              <div className="neon-divider mb-4" />

              <label className="block text-[10px] font-mono text-slate-400 tracking-widest mb-2">✉ PLAINTEXT MESSAGE</label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={e => { setMessage(e.target.value); setCharCount(e.target.value.length) }}
                  placeholder="Type your secret message…"
                  rows={4}
                  className="cyber-input w-full rounded-xl px-4 py-3 resize-none"
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-600">{charCount}</span>
              </div>

              {!alice.connected && (
                <p className="mt-2 text-[11px] font-mono text-yellow-500/80 flex items-center gap-1.5">
                  <AlertTriangle size={11}/> Connect Alice to WebSocket first
                </p>
              )}

              <button onClick={handleEncrypt}
                disabled={!message.trim() || !keys || encrypting || !alice.connected}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl mt-4 text-white font-mono text-sm font-bold">
                <Lock size={15} className={encrypting ? 'animate-pulse' : ''}/>
                {encrypting ? 'Encrypting…' : '🔒 Encrypt & Send via Socket'}
              </button>

              {alice.lastDelivered && (
                <div className="mt-2 text-center">
                  <p className="text-[10px] font-mono text-emerald-500">
                    ✓ Delivered at {new Date(alice.lastDelivered).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {steps.length > 0 && (
                <div className="mt-5 anim-fade-in">
                  <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={10} className="text-cyan-500"/> ENCRYPTION PIPELINE
                  </p>
                  <EncStep n="1" label="AES-256 Session Key"    sub="Generated via CSPRNG"                  active={steps.includes(1) && !steps.includes(2)} done={steps.includes(2)} />
                  <EncStep n="2" label="AES-GCM Encryption"     sub="Message → Ciphertext + Auth Tag"       active={steps.includes(2) && !steps.includes(3)} done={steps.includes(3)} />
                  <EncStep n="3" label="RSA-OAEP Key Wrap"      sub="AES key encrypted with public key"     active={steps.includes(3) && !steps.includes(4)} done={steps.includes(4)} />
                  <EncStep n="4" label="SHA-256 + WebSocket Send" sub="Hash computed → Packet sent via WS" last active={steps.includes(4) && !encryptedPacket} done={!!encryptedPacket} />
                </div>
              )}

              {encryptedPacket && (
                <div className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5 anim-fade-in"
                  style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <CheckCircle size={15} className="text-emerald-400 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-mono font-bold text-emerald-400">📡 Packet sent via WebSocket!</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Traveling through ws://localhost:8080 → Bob</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ─── NETWORK CHANNEL ─── */}
          <div className="flex flex-col items-center gap-3 pt-4 lg:pt-8" style={{ zIndex: 1 }}>
            <span className="text-[9px] font-mono text-slate-500 tracking-[0.3em]">WS CHANNEL</span>
            <NetworkChannel
              aliceConnected={alice.connected}
              bobConnected={bob.connected}
              hasPacket={!!encryptedPacket}
              simulateAttack={simulateAttack}
            />
            {/* MITM toggle */}
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

          {/* ─── BOB (RECEIVER) ─── */}
          <div className="anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <GlassCard glow={decryptResult ? (decryptResult.integrityOk ? 'glow-green' : 'glow-red') : ''} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Unlock size={16} className="text-violet-400"/>
                </div>
                <div>
                  <h2 className="font-bold font-mono text-violet-400 text-sm">RECEIVER</h2>
                  <p className="text-xs text-slate-500">Decrypt & verify integrity</p>
                </div>
                <div className="ml-auto"><Chip color="violet">Bob</Chip></div>
              </div>

              {/* Socket connect/status */}
              <div className="flex items-center gap-2 mb-4">
                <SocketBadge status={bob.status} partnerOnline={bob.partnerOnline} role="bob" />
                {!bob.connected ? (
                  <button onClick={bob.connect}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-violet-400 transition-all"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Wifi size={12}/> Connect
                  </button>
                ) : (
                  <button onClick={bob.disconnect}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-red-400 transition-all"
                    style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)' }}>
                    <WifiOff size={12}/> Disconnect
                  </button>
                )}
              </div>

              {/* Live packet notification */}
              {bob.receivedPacket && !decryptResult && (
                <div className="mb-4 p-3 rounded-xl anim-fade-in"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <p className="text-xs font-mono font-bold text-violet-400 flex items-center gap-2">
                    <Radio size={12} className="anim-pulse-glow"/> 📨 New packet received via WebSocket!
                  </p>
                  <p className="text-[10px] text-violet-600 mt-1 font-mono">
                    Received at {new Date(bob.receivedPacket._receivedAt || Date.now()).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {simulateAttack && (
                <div className="mb-4 p-3 rounded-xl"
                  style={{ background: 'rgba(255,51,102,0.07)', border: '1px solid rgba(255,51,102,0.25)' }}>
                  <p className="text-xs font-mono font-bold text-red-400 flex items-center gap-2">
                    <AlertTriangle size={13}/> ⚠ MITM ATTACK ACTIVE
                  </p>
                  <p className="text-[10px] text-red-400/60 mt-1 font-mono">Attacker modifying message in transit</p>
                </div>
              )}

              <div className="neon-divider mb-4" />

              <button onClick={handleDecrypt}
                disabled={!encryptedPacket || !keys || decrypting}
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
                      {decryptResult.integrityOk
                        ? <CheckCircle size={18} className="text-emerald-400"/>
                        : <XCircle size={18} className="text-red-400"/>
                      }
                      <div>
                        <p className={`font-mono text-sm font-bold ${decryptResult.integrityOk ? 'text-emerald-400' : 'text-red-400'}`}>
                          {decryptResult.integrityOk ? 'INTEGRITY VERIFIED ✓' : 'INTEGRITY COMPROMISED ✗'}
                        </p>
                        <p className={`text-[10px] font-mono mt-0.5 ${decryptResult.integrityOk ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                          {decryptResult.integrityOk ? 'Hashes match — message is authentic' : 'ALERT: Message was tampered in transit!'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.6)' }}>
                    <p className="text-[9px] font-mono text-slate-500 tracking-widest flex items-center gap-1.5">
                      <Hash size={10}/> HASH COMPARISON
                    </p>
                    <div>
                      <p className="text-[9px] text-slate-600 font-mono mb-1.5 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"/> ORIGINAL (Sender)
                      </p>
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                        <HashDisplay hash={decryptResult.receivedHash} color="cyan"/>
                      </div>
                    </div>
                    <div>
                      <p className={`text-[9px] font-mono mb-1.5 flex items-center gap-1 ${decryptResult.integrityOk ? 'text-slate-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full inline-block ${decryptResult.integrityOk ? 'bg-emerald-500' : 'bg-red-500'}`}/>
                        COMPUTED (Receiver)
                      </p>
                      <div className="p-2 rounded-lg" style={{
                        background: decryptResult.integrityOk ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,102,0.04)',
                        border: `1px solid ${decryptResult.integrityOk ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.15)'}`
                      }}>
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
        </div>

        {/* ── PACKET INSPECTOR ──────────────────────────────── */}
        {encryptedPacket && (
          <div className="anim-fade-up">
            <GlassCard className="overflow-hidden">
              <button onClick={() => setShowPacketInspector(p => !p)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors group">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <Radio size={14} className="text-cyan-400"/>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                    ENCRYPTED PACKET INSPECTOR
                  </span>
                  <Chip color="gray">Base64</Chip>
                  <Chip color="cyan">4 fields</Chip>
                  <Chip color="yellow">⚡ Sent via WebSocket</Chip>
                </div>
                {showPacketInspector ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </button>

              {showPacketInspector && (
                <div className="px-6 pb-6 anim-fade-in">
                  <div className="neon-divider mb-5"/>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: '🔐 CIPHERTEXT',         sub: 'AES-256-GCM Encrypted Message',     key: 'ciphertext',       color: '#00d4ff' },
                      { label: '🗝 ENCRYPTED AES KEY',  sub: 'RSA-2048-OAEP Wrapped Session Key', key: 'encryptedAesKey',  color: '#a78bfa' },
                      { label: '🎲 IV / NONCE',          sub: '96-bit Random Initialization Vector', key: 'iv',             color: '#fbbf24' },
                      { label: '# SHA-256 HASH',         sub: 'Integrity Fingerprint',             key: 'msgHash',          color: '#00ff88' },
                    ].map(({ label, sub, key, color }) => (
                      <div key={key} className="rounded-xl p-4 hover:border-white/10 transition-all"
                        style={{ background: 'rgba(3,5,10,0.7)', border: '1px solid rgba(30,45,74,0.7)' }}>
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
          </div>
        )}

        {/* ── FOOTER ────────────────────────────────────────── */}
        <div className="py-6 text-center">
          <div className="neon-divider mb-5"/>
          <p className="text-xs font-mono text-slate-600">
            <span className="text-cyan-600">SECURE MESSENGER</span> · WebSocket Server on <span className="text-yellow-500">ws://localhost:8080</span> ·
            All crypto via <span className="text-cyan-500">Web Crypto API</span> · <span className="text-violet-500">Zero trust</span>
          </p>
        </div>
      </main>
    </div>
  )
}