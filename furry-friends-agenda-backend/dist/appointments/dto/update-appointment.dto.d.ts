import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';
export declare class UpdateAppointmentDto {
    dateTime?: string;
    status?: PrismaAppointmentStatus;
    notes?: string;
    serviceIds?: string[];
    groomerId?: string;
}
