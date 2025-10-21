import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto, req: {
        user: JwtPayload;
    }): Promise<import("./types/appointment.types").Appointment>;
    findAll(req: {
        user: JwtPayload;
    }): Promise<import("./types/appointment.types").Appointment[]>;
    findOne(id: string, req: {
        user: JwtPayload;
    }): Promise<import("./types/appointment.types").Appointment | null>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, req: {
        user: JwtPayload;
    }): Promise<import("./types/appointment.types").Appointment>;
    remove(id: string, req: {
        user: JwtPayload;
    }): Promise<import("./types/appointment.types").Appointment>;
}
