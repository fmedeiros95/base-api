import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
	nodeEnv: process.env.NODE_ENV,
	name: process.env.APP_NAME,
	workingDirectory: process.env.PWD || process.cwd(),
	frontendDomain: process.env.FRONTEND_DOMAIN,
	backendDomain: process.env.BACKEND_DOMAIN,
	port: Number(process.env.APP_PORT || process.env.PORT) || 3000,
}));
