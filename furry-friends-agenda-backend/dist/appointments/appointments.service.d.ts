import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';
import { FinancialService } from '../financial/financial.service';
export declare class AppointmentsService {
    private prisma;
    private financialService;
    constructor(prisma: PrismaService, financialService: FinancialService);
    create(createAppointmentDto: CreateAppointmentDto, currentClientId: string): Promise<Appointment>;
    findAllByClient(clientId: string): Promise<Appointment[]>;
    findOneByClient(id: string, clientId: string): Promise<Appointment | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, currentClientId: string): Promise<Appointment>;
    remove(id: string, clientId: string): Promise<Appointment>;
    updateAppointmentStatus(id: string, status: PrismaAppointmentStatus, currentClientId: string): Promise<Appointment>;
    getAppointmentFinancialSummary(appointmentId: string): Promise<{
        appointment: Appointment;
        estimatedRevenue: number;
        commission: number;
        netRevenue: number;
    }>;
}
