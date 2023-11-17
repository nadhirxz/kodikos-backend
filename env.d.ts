declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: 'development' | 'production' | 'test';
			readonly PORT: string;
			readonly DATABASE_URL: string;
			readonly FRONTEND_URL: string;
			readonly HASH_SECRET_SALT: string;
			readonly STRIPE_SECRET_KEY: string;
			readonly ENDPOINT_SECRET: string;
			readonly PROCESSING_ENDPOINT: string;
		}
	}
}

export {};
