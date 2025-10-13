"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const prisma_exception_filter_1 = require("./prisma/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    const replitDomain = process.env.REPLIT_DEV_DOMAIN;
    const defaultAllowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:8080'
    ];
    if (replitDomain) {
        defaultAllowedOrigins.push(`https://${replitDomain}`);
    }
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(',')
        : defaultAllowedOrigins;
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            else {
                return callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 3333;
    await app.listen(port, 'localhost');
    console.log(`Application is running on: ${await app.getUrl()} - accessible externally if port is mapped.`);
}
bootstrap().catch((err) => {
    console.error('Failed to bootstrap the application', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map