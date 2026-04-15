import { useEffect, useRef, useState, useCallback } from 'react'

const getWsUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  return `${protocol}//${host}/ws`
}

export const useSocket = (role) => {
  const wsRef                 = useRef(null)
  const [status,              setStatus]              = useState('disconnected')
  const [receivedPacket,      setReceivedPacket]      = useState(null)
  const [partnerOnline,       setPartnerOnline]       = useState(false)
  const [lastDelivered,       setLastDelivered]       = useState(null)
  const [partnerOfflineAlert, setPartnerOfflineAlert] = useState(false)
  const [partnerPublicKeyPEM, setPartnerPublicKeyPEM] = useState(null)

  const connect = useCallback((myPublicKeyPEM) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    setStatus('connecting')
    const ws = new WebSocket(`${getWsUrl()}?role=${role}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
      setPartnerOfflineAlert(false)
      if (myPublicKeyPEM) {
        ws.send(JSON.stringify({ type: 'PUBLIC_KEY', key: myPublicKeyPEM }))
      }
    }

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
          case 'PARTNER_PUBLIC_KEY':
            setPartnerPublicKeyPEM(msg.key)
            break
          default: break
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

  const sendPublicKey = useCallback((pem) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'PUBLIC_KEY', key: pem }))
    }
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
    partnerPublicKeyPEM,
    connect,
    disconnect,
    sendPacket,
    sendPublicKey,
    clearPacket,
  }
}
