export enum NotificationType {
    APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
    APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
    APPOINTMENT_CANCELLATION = 'APPOINTMENT_CANCELLATION',
    APPOINTMENT_RESCHEDULED = 'APPOINTMENT_RESCHEDULED',
    MARKETING = 'MARKETING',
    SYSTEM = 'SYSTEM',
    VACCINATION_REMINDER = 'VACCINATION_REMINDER',
    BIRTHDAY = 'BIRTHDAY',
}

export enum NotificationChannel {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    WHATSAPP = 'WHATSAPP',
    PUSH = 'PUSH',
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    CANCELED = 'CANCELED',
}

export interface NotificationTarget {
    clientId?: string;
    email?: string;
    phone?: string;
    recipientType?: 'email' | 'phone' | 'user_id';
}

export interface BulkNotificationRequest {
    title: string;
    message: string;
    type: NotificationType;
    targets: NotificationTarget[];
    data?: Record<string, unknown>;
    channels?: string[];
    scheduledFor?: string;
}

export interface CreateNotificationQueueRequest {
    type: NotificationType;
    channel: NotificationChannel;
    recipient: string;
    recipientType: 'email' | 'phone' | 'user_id';
    title?: string;
    content: string;
    templateId?: string;
    data?: Record<string, unknown>;
    clientId?: string;
    groomerId?: string;
    appointmentId?: string;
    status?: NotificationStatus;
    scheduledFor?: string;
    metadata?: Record<string, unknown>;
}

export interface CreateNotificationTemplateRequest {
    name: string;
    title: string;
    content: string;
    type: NotificationType;
    channel?: NotificationChannel;
    isActive?: boolean;
    variables?: string[];
    metadata?: Record<string, unknown>;
}

export interface NotificationFilters {
    type?: NotificationType;
    channel?: NotificationChannel;
    status?: NotificationStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
    clientId?: string;
    groomerId?: string;
    appointmentId?: string;
}

export interface UpdateNotificationPreferencesRequest {
    preferences?: Record<string, Record<string, boolean>>;
}
