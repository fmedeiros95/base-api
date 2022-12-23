import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
	host: process.env.MAIL_HOST,
	port: Number(process.env.MAIL_PORT) || 587,
	secure: Boolean(process.env.MAIL_SSL === 'true'),
	user: process.env.MAIL_USER,
	password: process.env.MAIL_PASS,
	defaultFrom: process.env.MAIL_FROM,
}));
