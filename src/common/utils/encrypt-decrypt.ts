import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const iv = randomBytes(16);
const password = 'Password used to generate key';

export const encrypt = async (textToEncrypt) => {
  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([cipher.update(textToEncrypt), cipher.final()]).toString('hex');
};

export const decrypt = async (encryptedText) => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  return Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]).toString();
};
