import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto, req: {
        user: JwtPayload;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        petId: string;
        groomerId: string | null;
        dateTime: Date;
        notes: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        totalPrice: number;
    }>;
    findAll(req: {
        user: JwtPayload;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        petId: string;
        groomerId: string | null;
        dateTime: Date;
        notes: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        totalPrice: number;
    }[]>;
    findOne(id: string, req: {
        user: JwtPayload;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        petId: string;
        groomerId: string | null;
        dateTime: Date;
        notes: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        totalPrice: number;
    } | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, req: {
        user: JwtPayload;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        petId: string;
        groomerId: string | null;
        dateTime: Date;
        notes: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        totalPrice: number;
    }>;
    remove(id: string, req: {
        user: JwtPayload;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        petId: string;
        groomerId: string | null;
        dateTime: Date;
        notes: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        totalPrice: number;
    }>;
}
