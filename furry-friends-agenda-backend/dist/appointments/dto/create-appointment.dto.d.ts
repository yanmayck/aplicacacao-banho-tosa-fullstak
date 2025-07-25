import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';
export declare class CreateAppointmentDto {
    petId: string;
    serviceIds: string[];
    groomerId: string;
    dateTime: string;
    notes?: string;
    status?: PrismaAppointmentStatus;
}
