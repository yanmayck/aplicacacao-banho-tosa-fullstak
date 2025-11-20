export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

export interface CreateAppointmentRequest {
    petId: string;
    serviceIds: string[];
    groomerId: string;
    dateTime: string;
    notes?: string;
    status?: AppointmentStatus;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> { }
