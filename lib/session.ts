import { cookies } from 'next/headers';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { prisma } from './prisma';

export const SESSION_COOKIE_NAME = 'calisthenic_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  nama: string;
}

// Secret sementara khusus development (bertahan saat hot reload)
const globalForSession = globalThis as unknown as { __devSessionSecret?: string };

/**
 * Baca secret saat dipakai (bukan saat modul dimuat) supaya `next build`
 * tidak gagal ketika env belum ada. Di production wajib valid.
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 32) {
      throw new Error('SESSION_SECRET wajib diisi (minimal 32 karakter) pada mode production.');
    }
    return secret;
  }

  if (secret && secret.length > 0) return secret;

  if (!globalForSession.__devSessionSecret) {
    globalForSession.__devSessionSecret = randomBytes(32).toString('hex');
    console.warn(
      '[DEV] SESSION_SECRET belum diatur. Memakai secret sementara; sesi hilang saat server dimulai ulang.'
    );
  }
  return globalForSession.__devSessionSecret;
}

function signData(data: string): string {
  return createHmac('sha256', getSessionSecret()).update(data).digest('hex');
}

export function createSessionToken(payload: UserSessionPayload): string {
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = signData(payloadBase64);
  return `${payloadBase64}.${signature}`;
}

export function parseSessionToken(token: string): UserSessionPayload | null {
  if (!token || !token.includes('.')) return null;

  // Di luar try/catch: jika secret production tidak valid, error muncul jelas di log
  getSessionSecret();

  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;

    const expectedSignature = signData(payloadBase64);
    const sigBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded) as UserSessionPayload;
    if (!parsed || !parsed.userId) return null;

    return parsed;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = parseSessionToken(token);
    if (!session?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, nama: true }
    });

    return user;
  } catch (error) {
    console.error('Error getSessionUser:', error);
    return null;
  }
}