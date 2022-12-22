import { registerAs } from '@nestjs/config';
import path from 'path';

export default registerAs('storage', () => ({
	driver: process.env.STORAGE_TYPE || 'local',
	maxFileSize: 5242880, // 5mb

	awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	awsRegion: process.env.AWS_REGION,

	awsS3Bucket: process.env.AWS_S3_BUCKET_NAME,

	storagePaths: {
		storage: path.resolve(__dirname, '../../storage'),
		uploads: path.resolve(__dirname, '../../storage/uploads'),
	},
}));
