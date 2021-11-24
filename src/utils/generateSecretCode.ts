import * as crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

export type SecretType = 'phone' | 'email';

export const generateSecretCode = async (
  target: SecretType,
): Promise<string> => {
  if (target === 'phone') {
    return Math.floor(Math.random() * 100000).toString();
  }
  if (target === 'email') {
    const buffer = await randomBytes(2);
    return buffer.toString('hex').toLocaleUpperCase();
  }
};
