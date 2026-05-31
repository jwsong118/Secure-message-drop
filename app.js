// Start app

document.getElementById("encryptBtn").onclick = async () => {
  const out = await encryptMessage(document.getElementById("plaintext").value);
  document.getElementById("ciphertextOut").value = out;       // .value for <textarea>
};

document.getElementById("decryptBtn").onclick = async () => {
  try {
    const txt = document.getElementById("ciphertextOut").value;
    document.getElementById("plaintextOut").value = await decryptMessage(txt);
  } catch (e) {
    document.getElementById("plaintextOut").value = "Decryption failed: " + e.message;
  }
};

initKeys();