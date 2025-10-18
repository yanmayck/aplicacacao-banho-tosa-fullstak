declare namespace NodeJS {
  interface ProcessEnv {
    // Server configuration
    readonly PORT?: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';

    // Database
    readonly DATABASE_URL: string;

    // JWT Configuration
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRES_IN?: string;

    // CORS Configuration
    readonly CORS_ALLOWED_ORIGINS?: string;

    // Replit deployment
    readonly REPLIT_DEV_DOMAIN?: string;

    // Rate limiting
    readonly RATE_LIMIT_TTL?: string;
    readonly RATE_LIMIT_MAX?: string;

    // Email configuration (for future use)
    readonly SMTP_HOST?: string;
    readonly SMTP_PORT?: string;
    readonly SMTP_USER?: string;
    readonly SMTP_PASS?: string;

    // File upload (for future use)
    readonly MAX_FILE_SIZE?: string;
    readonly UPLOAD_DIR?: string;

    // Logging
    readonly LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';

    // API Configuration
    readonly API_PREFIX?: string;
    readonly API_VERSION?: string;

    // Security
    readonly BCRYPT_SALT_ROUNDS?: string;
    readonly SESSION_SECRET?: string;

    // Monitoring (for future use)
    readonly SENTRY_DSN?: string;
    readonly NEW_RELIC_LICENSE_KEY?: string;
  }
}