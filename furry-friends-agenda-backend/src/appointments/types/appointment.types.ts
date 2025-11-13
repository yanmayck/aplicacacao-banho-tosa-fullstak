import {
  Appointment as PrismaAppointment,
  Service as PrismaService,
  Client as PrismaClient,
  Pet as PrismaPet,
  Groomer as PrismaGroomer,
} from '@prisma/client';

export interface Appointment extends PrismaAppointment {
  appointmentServices?: {
    service: PrismaService;
  }[];
}

export interface FullAppointment extends PrismaAppointment {
  client: PrismaClient;
  pet: PrismaPet;
  groomer: PrismaGroomer | null;
  appointmentServices: {
    service: PrismaService;
  }[];
}
