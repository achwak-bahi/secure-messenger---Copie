import { WebSocketServer } from 'ws'
import { parse } from 'url'
import os from 'os'

const PORT = 8080
const HOST = '0.0.0.0'
const wss  = new WebSocketServer({ host: HOST, port: PORT })
const clients = new Map()

const log = (role, msg) =>
  console.log(`[${new Date().toLocaleTimeString()}] [${role.toUpperCase()}] ${msg}`)

const getLocalIP = () => {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return 'localhost'
}

const localIP = getLocalIP()

wss.on('connection', (ws, req) => {
  const { query } = parse(req.url, true)
  const role = query.role || 'unknown'

  if (clients.has(role)) {
    clients.get(role).terminate()
    log(role, 'Previous connection replaced')
  }

  clients.set(role, ws)
  log(role, `Connected from ${req.socket.remoteAddress}  (Total: ${clients.size})`)

  ws.send(JSON.stringify({ type: 'CONNECTED', role, serverIP: localIP, timestamp: Date.now() }))

  const partner = role === 'alice' ? 'bob' : 'alice'
  if (clients.has(partner)) {
    clients.get(partner)?.send(JSON.stringify({ type: 'PARTNER_ONLINE', partner: role }))
    ws.send(JSON.stringify({ type: 'PARTNER_ONLINE', partner }))
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString())

      if (msg.type === 'PACKET') {
        log(role, `📦 Packet received → relaying to ${partner}`)
        const partnerWS = clients.get(partner)
        if (partnerWS?.readyState === 1) {
          partnerWS.send(JSON.stringify({
            type: 'PACKET',
            payload: msg.payload,
            from: role,
            timestamp: Date.now(),
          }))
          log(partner, '📨 Packet delivered ✓')
          ws.send(JSON.stringify({ type: 'DELIVERED', timestamp: Date.now() }))
        } else {
          log(role, `⚠ Partner (${partner}) is offline — packet dropped`)
          ws.send(JSON.stringify({ type: 'PARTNER_OFFLINE' }))
        }
      }

      if (msg.type === 'PING') ws.send(JSON.stringify({ type: 'PONG' }))
    } catch (e) {
      log(role, `Parse error: ${e.message}`)
    }
  })

  ws.on('close', () => {
    clients.delete(role)
    log(role, `Disconnected  (Remaining: ${clients.size})`)
    const partner = role === 'alice' ? 'bob' : 'alice'
    clients.get(partner)?.send(JSON.stringify({ type: 'PARTNER_OFFLINE', partner: role }))
  })

  ws.on('error', (err) => log(role, `Error: ${err.message}`))
})

console.log(`
╔══════════════════════════════════════════════════════╗
║     🔐  SECURE MESSENGER  —  WebSocket Server        ║
║                                                      ║
║  📡  Listening on  : ws://${localIP}:${PORT}            ║
║  🌐  Frontend URL  : http://${localIP}:5173            ║
║                                                      ║
║  👥  Instructions:                                   ║
║    1. Share this IP with your partner                ║
║    2. Both open  http://${localIP}:5173               ║
║    3. Alice connects on one device                   ║
║    4. Bob   connects on another device               ║
╚══════════════════════════════════════════════════════╝
`)
