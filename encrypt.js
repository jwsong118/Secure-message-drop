// encryption

// Returns sender public key + nonce + ciphertext.
async function encryptMessage(plaintextStr) {
  // fresh sender keypair each time (Encrypt.java calls KeyGen.keyPairGeneration())
  const senderKeyPair = await crypto.subtle.generateKey(
    { name: "X25519" }, true, ["deriveBits"]
  );
  const shared = await deriveSharedSecret(senderKeyPair.privateKey, receiverKeyPair.publicKey);
  const aesKey = await hkdfToAesKey(shared);

  const nonce = crypto.getRandomValues(new Uint8Array(12));   // 12-byte nonce
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce, tagLength: 128 },           // 128-bit tag
    aesKey, enc.encode(plaintextStr)
  );

  const senderPubRaw = await crypto.subtle.exportKey("raw", senderKeyPair.publicKey);

  // bundle the three "files" (sender_public_key, nonce, ciphertext)
  const inner = JSON.stringify({
    senderPub: b64(senderPubRaw),
    nonce: b64(nonce),
    ct: b64(ct)
  });
  return b64(enc.encode(inner));
}