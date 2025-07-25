import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: {
        user: JwtPayload;
    }): Promise<Omit<User, 'password'> | null>;
    updateMyProfile(req: {
        user: JwtPayload;
    }, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'> | null>;
}
