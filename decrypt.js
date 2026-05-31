// decryption

// Takes the encryptMessage and recovers the plaintext.
async function decryptMessage(bundleB64) {
  const json = JSON.parse(dec.decode(unb64(bundleB64)));
  const senderPub = await crypto.subtle.importKey(
    "raw", unb64(json.senderPub), { name: "X25519" }, true, []
  );
  const shared = await deriveSharedSecret(receiverKeyPair.privateKey, senderPub);
  const aesKey = await hkdfToAesKey(shared);

  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(json.nonce), tagLength: 128 },
    aesKey, unb64(json.ct)
  );
  return dec.decode(pt);
}