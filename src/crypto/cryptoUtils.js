const ab2b64 = (buf) => {
    const bytes = new Uint8Array(buf)
    let bin = ''
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i])
    return btoa(bin)
}

const b642ab = (b64) => {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes.buffer
}

const ab2pem = (buf, label) => {
    const lines = ab2b64(buf).match(/.{1,64}/g) || []
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`
}

export const generateRSAKeyPair = async() => {
    const kp = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true, ['encrypt', 'decrypt']
    )
    const pubBuf = await crypto.subtle.exportKey('spki', kp.publicKey)
    const privBuf = await crypto.subtle.exportKey('pkcs8', kp.privateKey)
    return {
        publicKey: kp.publicKey,
        privateKey: kp.privateKey,
        publicKeyPEM: ab2pem(pubBuf, 'PUBLIC KEY'),
        privateKeyPEM: ab2pem(privBuf, 'PRIVATE KEY'),
    }
}

export const encryptMessage = async(message, publicKey) => {
    const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(message)

    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded)
    const rawAes = await crypto.subtle.exportKey('raw', aesKey)
    const encryptedAesKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawAes)
    const msgHash = await sha256(message)

    return {
        ciphertext: ab2b64(ciphertext),
        iv: ab2b64(iv),
        encryptedAesKey: ab2b64(encryptedAesKey),
        msgHash,
    }
}

export const decryptMessage = async(packet, privateKey, simulateAttack = false) => {
    const rawAes = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, b642ab(packet.encryptedAesKey))
    const aesKey = await crypto.subtle.importKey('raw', rawAes, { name: 'AES-GCM' }, false, ['decrypt'])
    const decBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b642ab(packet.iv) }, aesKey, b642ab(packet.ciphertext))

    let plaintext = new TextDecoder().decode(decBuf)
    if (simulateAttack) plaintext += ' [TAMPERED BY ATTACKER ☠️]'

    const computedHash = await sha256(plaintext)
    return { plaintext, computedHash, receivedHash: packet.msgHash, integrityOk: computedHash === packet.msgHash }
}

const sha256 = async(msg) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}