const ENCRYPTION_KEY_PREFIX = "notes_encryption_key_";

async function deriveKey(walletAddress: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ENCRYPTION_KEY_PREFIX + walletAddress);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptContent(
  content: string,
  walletAddress: string
): Promise<string> {
  const key = await deriveKey(walletAddress);
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptContent(
  encryptedContent: string,
  walletAddress: string
): Promise<string> {
  try {
    const key = await deriveKey(walletAddress);
    const combined = Uint8Array.from(atob(encryptedContent), (c) =>
      c.charCodeAt(0)
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch {
    return encryptedContent;
  }
}
