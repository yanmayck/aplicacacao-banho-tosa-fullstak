"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const financial_service_1 = require("../financial/financial.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    financialService;
    constructor(prisma, financialService) {
        this.prisma = prisma;
        this.financialService = financialService;
    }
    async create(createAppointmentDto, currentClientId) {
        const { petId, serviceIds, dateTime, notes, groomerId, status } = createAppointmentDto;
        const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID "${petId}" not found.`);
        }
        if (pet.clientId !== currentClientId) {
            throw new common_1.ForbiddenException('You can only create appointments for your own pets.');
        }
        if (groomerId) {
            const groomer = await this.prisma.groomer.findUnique({ where: { id: groomerId } });
            if (!groomer) {
                throw new common_1.NotFoundException(`Groomer with ID "${groomerId}" not found.`);
            }
        }
        if (!serviceIds || serviceIds.length === 0) {
            throw new common_1.BadRequestException('At least one service must be selected.');
        }
        let calculatedTotalPrice = 0;
        const servicesToConnect = [];
        for (const serviceId of serviceIds) {
            const service = await this.prisma.servicePackage.findUnique({ where: { id: serviceId } });
            if (!service) {
                throw new common_1.NotFoundException(`Service with ID "${serviceId}" not found.`);
            }
            servicesToConnect.push(service);
            calculatedTotalPrice += service.price;
        }
        try {
            return await this.prisma.appointment.create({
                data: {
                    dateTime: new Date(dateTime),
                    notes,
                    status: status || client_1.AppointmentStatus.SCHEDULED,
                    totalPrice: calculatedTotalPrice,
                    pet: { connect: { id: petId } },
                    client: { connect: { id: currentClientId } },
                    groomer: groomerId ? { connect: { id: groomerId } } : undefined,
                    appointmentServices: {
                        create: servicesToConnect.map(service => ({
                            service: { connect: { id: service.id } },
                            priceAtTime: service.price,
                        })),
                    },
                },
                include: {
                    pet: true,
                    client: true,
                    groomer: true,
                    appointmentServices: {
                        include: {
                            service: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                console.error("Prisma Error creating appointment: ", error.code, error.message);
            }
            throw new common_1.BadRequestException('Could not create appointment. Please check input data.');
        }
    }
    async findAllByClient(clientId) {
        return this.prisma.appointment.findMany({
            where: { clientId },
            include: {
                pet: true,
                groomer: true,
                appointmentServices: {
                    include: {
                        service: true,
                    },
                },
            },
            orderBy: { dateTime: 'asc' },
        });
    }
    async findOneByClient(id, clientId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                pet: true,
                groomer: true,
                appointmentServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID "${id}" not found`);
        }
        if (appointment.clientId !== clientId) {
            throw new common_1.ForbiddenException('You are not allowed to access this appointment');
        }
        return appointment;
    }
    async update(id, updateAppointmentDto, currentClientId) {
        const existingAppointment = await this.findOneByClient(id, currentClientId);
        const dataToUpdate = {};
        if (updateAppointmentDto.dateTime) {
            dataToUpdate.dateTime = new Date(updateAppointmentDto.dateTime);
        }
        if (updateAppointmentDto.status) {
            dataToUpdate.status = updateAppointmentDto.status;
        }
        if (updateAppointmentDto.notes !== undefined) {
            dataToUpdate.notes = updateAppointmentDto.notes;
        }
        if (updateAppointmentDto.groomerId) {
            const groomerExists = await this.prisma.groomer.findUnique({ where: { id: updateAppointmentDto.groomerId } });
            if (!groomerExists)
                throw new common_1.NotFoundException(`Groomer with ID "${updateAppointmentDto.groomerId}" not found.`);
            dataToUpdate.groomer = { connect: { id: updateAppointmentDto.groomerId } };
        }
        if (updateAppointmentDto.serviceIds) {
            let newTotalPrice = 0;
            const newServicesToConnect = [];
            for (const serviceId of updateAppointmentDto.serviceIds) {
                const service = await this.prisma.servicePackage.findUnique({ where: { id: serviceId } });
                if (!service)
                    throw new common_1.NotFoundException(`Service with ID "${serviceId}" not found.`);
                newServicesToConnect.push(service);
                newTotalPrice += service.price;
            }
            dataToUpdate.totalPrice = newTotalPrice;
            await this.prisma.appointmentService.deleteMany({ where: { appointmentId: id } });
            dataToUpdate.appointmentServices = {
                create: newServicesToConnect.map(service => ({
                    service: { connect: { id: service.id } },
                    priceAtTime: service.price,
                })),
            };
        }
        if (!existingAppointment) {
            throw new common_1.NotFoundException(`Appointment with ID "${id}" not found or not owned by client.`);
        }
        if (Object.keys(dataToUpdate).length === 0 && (!updateAppointmentDto.serviceIds || updateAppointmentDto.serviceIds.length === 0)) {
            return existingAppointment;
        }
        return this.prisma.appointment.update({
            where: { id },
            data: dataToUpdate,
            include: {
                pet: true,
                client: true,
                groomer: true,
                appointmentServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async remove(id, clientId) {
        await this.findOneByClient(id, clientId);
        return this.prisma.appointment.delete({
            where: { id },
        });
    }
    async updateAppointmentStatus(id, status, currentClientId) {
        const existingAppointment = await this.findOneByClient(id, currentClientId);
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id },
            data: { status },
            include: {
                pet: true,
                client: true,
                groomer: true,
                appointmentServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        if (status === client_1.AppointmentStatus.COMPLETED) {
            try {
                await this.financialService.createAutomaticIncomeFromAppointment(id);
                console.log(`Receita automática criada para agendamento ${id}`);
            }
            catch (error) {
                console.error(`Erro ao criar receita automática para agendamento ${id}:`, error);
            }
        }
        return updatedAppointment;
    }
    async getAppointmentFinancialSummary(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                pet: true,
                client: true,
                groomer: true,
                appointmentServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Agendamento com ID "${appointmentId}" não encontrado`);
        }
        const estimatedRevenue = appointment.totalPrice;
        const commissionPercentage = appointment.groomer?.commissionPercentage || 0;
        const commission = estimatedRevenue * (commissionPercentage / 100);
        const netRevenue = estimatedRevenue - commission;
        return {
            appointment,
            estimatedRevenue,
            commission,
            netRevenue,
        };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        financial_service_1.FinancialService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map