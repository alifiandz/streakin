import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Hash password menggunakan scrypt dengan random salt
 * Format hasil: salt:hash (dalam hex)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifikasi password terhadap format salt:hash
 * Mendukung fallback komparasi aman untuk plain text legacy demo user
 */
export function verifyPassword(password: string, storedHashOrPlain: string | null | undefined): boolean {
  if (!storedHashOrPlain) return false;

  // Cek apakah password tersimpan dalam format hash (salt:hash)
  if (storedHashOrPlain.includes(':')) {
    const [salt, key] = storedHashOrPlain.split(':');
    if (!salt || !key) return false;

    try {
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = scryptSync(password, salt, 64);
      return timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }

  // Fallback untuk akun demo lama dengan plain text
  try {
    const inputBuf = Buffer.from(password);
    const storedBuf = Buffer.from(storedHashOrPlain);
    if (inputBuf.length !== storedBuf.length) return false;
    return timingSafeEqual(inputBuf, storedBuf);
  } catch {
    return password === storedHashOrPlain;
  }
}

