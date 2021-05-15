import { createDecipheriv } from 'crypto';

const key = Buffer.from(process.env.DEVSINCRYPTO_DB_AES_KEY as string, 'hex');
const decipher = createDecipheriv('aes-128-gcm', key, Buffer.alloc(12));

export function decrypt(text: string): string {
	const dec = decipher.update(text, 'base64', 'utf-8');

	return dec;
}
