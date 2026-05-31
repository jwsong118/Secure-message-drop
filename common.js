// shared helpers and the receiver keypair.

// base64 <-> bytes
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (str) => Uint8Array.from(atob(str), c => c.charCodeAt(0));
const enc = new TextEncoder();
const dec = new TextDecoder();

// receiver keypair, generated once on load.
let receiverKeyPair;

async function initKeys() {
  receiverKeyPair = await crypto.subtle.generateKey(
    { name: "X25519" }, true, ["deriveBits"]
  );
}

// shared secret
async function deriveSharedSecret(privateKey, publicKey) {
  return await crypto.subtle.deriveBits(
    { name: "X25519", public: publicKey }, privateKey, 256
  );
}

// HKDF-SHA256 to 32-byte AES key
async function hkdfToAesKey(sharedSecretBytes) {
  const hkdfKey = await crypto.subtle.importKey(
    "raw", sharedSecretBytes, "HKDF", false, ["deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),                
      info: enc.encode("e2ee-aes-key")         
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },          // AES-256
    false, ["encrypt", "decrypt"]
  );
}