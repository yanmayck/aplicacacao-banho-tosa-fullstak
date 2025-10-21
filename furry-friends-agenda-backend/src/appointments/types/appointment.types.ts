import {
  Appointment as PrismaAppointment,
  ServicePackage as PrismaServicePackage,
} from '@prisma/client';

export interface Appointment extends PrismaAppointment {
  appointmentServices?: {
    service: PrismaServicePackage;
  }[];
}

export type ServicePackage = PrismaServicePackage;
