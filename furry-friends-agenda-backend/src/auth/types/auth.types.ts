import { UserRole } from '@prisma/client';

export interface AuthPayload {
  sub: string;
  username: string;
  role: UserRole;
  companyId: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
  };
}
