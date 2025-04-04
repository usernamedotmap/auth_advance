import { getEnv } from "../common/utils/env";


interface JWTConfig {
    SECRET: string;
    EXPIRES_IN: string;
    REFRESH_SECRET: string;
    REFRESH_EXPIRES_IN: string;
}

interface AppConfig {
    NODE_ENV: string;
    PORT: string;
    APP_ORIGIN: string;
    BASE_PATH: string;
    MONGODB_URI: string;
    JWT: JWTConfig;
    MAILER_SENDER: string;
    RESEND_API_KEY: string;
}

const appConfig = (): AppConfig => ({
    NODE_ENV: getEnv("NODE_ENV", "development") ,
    PORT: getEnv("PORT", "5000"),
    APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
    BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
    MONGODB_URI: getEnv("MONGODB_URI", "mongodb://localhost"),
    JWT: {
        SECRET: getEnv("JWT_SECRET", "JWT_SECRET"),
        EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
        REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "JWT_REFRESH_SECRET"),
        REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d") 
    },
    MAILER_SENDER: getEnv("MAILER_SENDER", ""),
    RESEND_API_KEY: getEnv("RESEND_API_KEY", ""),


}); 

export const config = appConfig();