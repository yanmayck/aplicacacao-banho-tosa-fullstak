import { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  companyId: string;
}
