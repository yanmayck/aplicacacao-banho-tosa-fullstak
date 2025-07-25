import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: {
        sub: string;
        username: string;
        role: UserRole;
    }): {
        userId: string;
        username: string;
        role: UserRole;
    };
}
export {};
