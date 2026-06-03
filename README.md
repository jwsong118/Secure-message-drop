# End-to-End Encrypted Message Demo

A browser demonstration of an end-to-end encryption I wrote while learning cryptography.
( https://jwsong118.github.io/Secure-message-drop/)

## What it does

Type a message, encrypt it, and see the resulting ciphertext. Decrypt
it to recover the original.

## The algortihms.

The encryption follows a standard hybrid scheme:

1. **X25519** Diffie–Hellman key exchange. The sender and
   receiver each have a keypair. Combining one party's private key with the
   other's public key yields a shared secret that only they can compute.
2. **HKDF-SHA256** The raw shared secret is run through a key-derivation
   function (with the info string `e2ee-aes-key`) to produce a uniformly random
   256-bit symmetric key.
3. **AES-256-GCM** The message is encrypted with that key using an
   authenticated cipher (12-byte nonce, 128-bit authentication tag), providing
   both confidentiality and integrity.
