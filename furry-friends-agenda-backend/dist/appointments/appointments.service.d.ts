import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '@prisma/client';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, currentClientId: string): Promise<Appointment>;
    findAllByClient(clientId: string): Promise<Appointment[]>;
    findOneByClient(id: string, clientId: string): Promise<Appointment | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, currentClientId: string): Promise<Appointment>;
    remove(id: string, clientId: string): Promise<Appointment>;
}
