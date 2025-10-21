import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';
import { FinancialService } from '../financial/financial.service';
import { Appointment as AppointmentType } from './types/appointment.types';
export declare class AppointmentsService {
    private prisma;
    private financialService;
    constructor(prisma: PrismaService, financialService: FinancialService);
    create(createAppointmentDto: CreateAppointmentDto, currentClientId: string): Promise<AppointmentType>;
    findAllByClient(clientId: string): Promise<AppointmentType[]>;
    findOneByClient(id: string, clientId: string): Promise<AppointmentType | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, currentClientId: string): Promise<AppointmentType>;
    remove(id: string, clientId: string): Promise<AppointmentType>;
    updateAppointmentStatus(id: string, status: PrismaAppointmentStatus, currentClientId: string): Promise<AppointmentType>;
    getAppointmentFinancialSummary(appointmentId: string): Promise<{
        appointment: AppointmentType;
        estimatedRevenue: number;
        commission: number;
        netRevenue: number;
    }>;
}
