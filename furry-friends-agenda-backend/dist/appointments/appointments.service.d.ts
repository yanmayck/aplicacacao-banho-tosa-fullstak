import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '@prisma/client';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, userId: string): Promise<Appointment>;
    findAllByClient(userId: string): Promise<Appointment[]>;
    findOneByClient(id: string, userId: string): Promise<Appointment | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, userId: string): Promise<Appointment>;
    remove(id: string, userId: string): Promise<Appointment>;
}
