import { useEffect, useRef, useState, useCallback } from 'react'

// ✨ Dynamic IP: uses the same host as the page, port 8080
const WS_URL = `ws://${window.location.hostname}:8080`

export const useSocket = (role) => {
  const wsRef               = useRef(null)
  const [status,            setStatus]            = useState('disconnected')
  const [receivedPacket,    setReceivedPacket]    = useState(null)
  const [partnerOnline,     setPartnerOnline]     = useState(false)
  const [lastDelivered,     setLastDelivered]     = useState(null)
  const [partnerOfflineAlert, setPartnerOfflineAlert] = useState(false)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus('connecting')
    const ws = new WebSocket(`${WS_URL}?role=${role}`)
    wsRef.current = ws

    ws.onopen  = () => { setStatus('connected'); setPartnerOfflineAlert(false) }
    ws.onclose = () => { setStatus('disconnected'); setPartnerOnline(false) }
    ws.onerror = () => setStatus('error')

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        switch (msg.type) {
          case 'PACKET':
            setReceivedPacket({ ...msg.payload, _receivedAt: msg.timestamp })
            break
          case 'PARTNER_ONLINE':
            setPartnerOnline(true)
            setPartnerOfflineAlert(false)
            break
          case 'PARTNER_OFFLINE':
            setPartnerOnline(false)
            setPartnerOfflineAlert(true)
            setTimeout(() => setPartnerOfflineAlert(false), 4000)
            break
          case 'DELIVERED':
            setLastDelivered(msg.timestamp)
            break
          default:
            break
        }
      } catch {}
    }
  }, [role])

  const disconnect = useCallback(() => { wsRef.current?.close() }, [])

  const sendPacket = useCallback((packet) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'PACKET', payload: packet }))
      return true
    }
    return false
  }, [])

  const clearPacket = useCallback(() => setReceivedPacket(null), [])

  useEffect(() => () => wsRef.current?.close(), [])

  return {
    status,
    connected: status === 'connected',
    partnerOnline,
    partnerOfflineAlert,
    lastDelivered,
    receivedPacket,
    connect,
    disconnect,
    sendPacket,
    clearPacket,
  }
}
