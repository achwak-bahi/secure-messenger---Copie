import { WebSocketServer } from 'ws'
import { parse } from 'url'

const PORT = 8080
const wss = new WebSocketServer({ port: PORT })
const clients = new Map() // role → WebSocket

const log = (role, msg) =>
    console.log(`[${new Date().toISOString()}] [${role.toUpperCase()}] ${msg}`)

wss.on('connection', (ws, req) => {
    const { query } = parse(req.url, true)
    const role = query.role || 'unknown'

    // إذا كان الـ role موجود، أغلق الاتصال القديم
    if (clients.has(role)) {
        clients.get(role).terminate()
        log(role, 'Previous connection replaced')
    }

    clients.set(role, ws)
    log(role, `Connected ✓  (Total clients: ${clients.size})`)

    // أرسل له تأكيد الاتصال
    ws.send(JSON.stringify({ type: 'CONNECTED', role, timestamp: Date.now() }))

    // أعلم الطرف الآخر أن شريكه متصل
    const partner = role === 'alice' ? 'bob' : 'alice'
    if (clients.has(partner)) {
        clients.get(partner) && clients.get(partner).send(JSON.stringify({
                type: 'PARTNER_ONLINE',
                partner: role,
            }))
            // أعلم الطرف الجديد أن شريكه كذلك متصل
        ws.send(JSON.stringify({ type: 'PARTNER_ONLINE', partner }))
    }

    // ─── استقبال رسائل ──────────────────────────────────────
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString())

            if (msg.type === 'PACKET') {
                log(role, `📦 Packet received → relaying to ${partner}`)

                if (clients.has(partner) && clients.get(partner).readyState === 1) {
                    clients.get(partner).send(JSON.stringify({
                        type: 'PACKET',
                        payload: msg.payload,
                        from: role,
                        timestamp: Date.now(),
                    }))
                    log(partner, '📨 Packet delivered ✓')

                    // أرسل تأكيد للمرسل
                    ws.send(JSON.stringify({ type: 'DELIVERED', timestamp: Date.now() }))
                } else {
                    log(role, `⚠ Partner (${partner}) is offline — packet dropped`)
                    ws.send(JSON.stringify({ type: 'PARTNER_OFFLINE' }))
                }
            }

            if (msg.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG' }))
            }
        } catch (e) {
            log(role, `Parse error: ${e.message}`)
        }
    })

    // ─── قطع الاتصال ────────────────────────────────────────
    ws.on('close', () => {
        clients.delete(role)
        log(role, `Disconnected  (Remaining: ${clients.size})`)

        // أعلم الشريك
        if (clients.has(partner)) {
            clients.get(partner) && clients.get(partner).send(JSON.stringify({
                type: 'PARTNER_OFFLINE',
                partner: role,
            }))
        }
    })

    ws.on('error', (err) => log(role, `Error: ${err.message}`))
})

console.log(`
╔══════════════════════════════════════════════╗
║   🔐  SECURE MESSENGER  ─  WebSocket Server  ║
║   ws://localhost:${PORT}                        ║
║   Waiting for Alice & Bob to connect…        ║
╚══════════════════════════════════════════════╝
`)