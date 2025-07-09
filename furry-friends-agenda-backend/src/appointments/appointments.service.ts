import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// Os DTOs serão atualizados na próxima etapa do plano.
// CreateAppointmentDto precisará de serviceIds: string[], groomerId: string, e dateTime em vez de appointmentDateTime.
// AppointmentStatus do DTO deve ser compatível com o enum do Prisma.
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, Prisma, AppointmentStatus as PrismaAppointmentStatus, Service } from '@prisma/client';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto, currentClientId: string): Promise<Appointment> {
        // Campos esperados do DTO (após atualização):
        // petId, serviceIds, dateTime, notes, groomerId, (status opcional, default SCHEDULED)
        const { petId, serviceIds, dateTime, notes, groomerId } = createAppointmentDto;

        // 1. Verificar se o cliente (usuário logado) existe (embora geralmente já validado pelo AuthGuard)
        // Esta verificação de 'currentClientId' vs 'appointment.clientId' é mais sobre propriedade.
        // O schema.prisma tem Appointment.clientId que deve ser o 'currentClientId'.

        // 2. Verificar se o pet existe e pertence ao cliente
        const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
        if (!pet) {
            throw new NotFoundException(`Pet with ID "${petId}" not found.`);
        }
        if (pet.clientId !== currentClientId) { // Alterado de ownerId para clientId
            throw new ForbiddenException('You can only create appointments for your own pets.');
        }

        // 3. Verificar se o groomer existe
        const groomer = await this.prisma.groomer.findUnique({ where: { id: groomerId } });
        if (!groomer) {
            throw new NotFoundException(`Groomer with ID "${groomerId}" not found.`);
        }

        // 4. Verificar se os serviços existem e calcular o preço total
        if (!serviceIds || serviceIds.length === 0) {
            throw new BadRequestException('At least one service must be selected.');
        }

        let calculatedTotalPrice = 0;
        const servicesToConnect: Service[] = [];
        for (const serviceId of serviceIds) {
            const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
            if (!service) {
                throw new NotFoundException(`Service with ID "${serviceId}" not found.`);
            }
            servicesToConnect.push(service);
            calculatedTotalPrice += service.price; // Assumindo que 'price' é um campo obrigatório em Service
        }

        // TODO: Adicionar lógica de verificação de disponibilidade (horários conflitantes, etc.)

        try {
            return await this.prisma.appointment.create({
                data: {
                    dateTime: new Date(dateTime), // Alterado de appointmentDateTime
                    notes,
                    status: createAppointmentDto.status || PrismaAppointmentStatus.SCHEDULED, // Usar enum do Prisma
                    totalPrice: calculatedTotalPrice,
                    pet: { connect: { id: petId } },
                    client: { connect: { id: currentClientId } }, // Conectar ao cliente que está criando
                    groomer: { connect: { id: groomerId } },
                    appointmentServices: {
                        create: servicesToConnect.map(service => ({
                            service: { connect: { id: service.id } },
                            priceAtTime: service.price, // Armazenar o preço do serviço no momento do agendamento
                            // quantity: 1, // Default é 1 no schema
                        })),
                    },
                },
                include: { // Incluir para retornar os dados completos
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Log específico para erros do Prisma
                console.error("Prisma Error creating appointment: ", error.code, error.message);
            } else {
                console.error("Generic Error creating appointment: ", error);
            }
            throw new BadRequestException('Could not create appointment. Please check input data.');
        }
    }

    async findAllByClient(clientId: string): Promise<Appointment[]> {
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
            orderBy: { dateTime: 'asc' }, // Alterado de appointmentDateTime
        });
    }

    async findOneByClient(id: string, clientId: string): Promise<Appointment | null> {
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
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }

        if (appointment.clientId !== clientId) {
            throw new ForbiddenException('You are not allowed to access this appointment');
        }
        return appointment;
    }

    async update(
        id: string,
        updateAppointmentDto: UpdateAppointmentDto, // DTO precisará ser atualizado
        currentClientId: string,
    ): Promise<Appointment> {
        // Verificar se o agendamento existe e pertence ao cliente
        const existingAppointment = await this.findOneByClient(id, currentClientId);
        if (!existingAppointment) {
            // findOneByClient já lança exceção, mas para clareza
            throw new NotFoundException(`Appointment with ID "${id}" not found or not owned by client.`);
        }

        // TODO: Lógica mais complexa se serviceIds ou groomerId puderem ser alterados,
        // o que pode envolver recálculo de preço, remoção/adição de AppointmentService.
        // Por enquanto, vamos focar em dateTime, notes, status.

        const dataToUpdate: Prisma.AppointmentUpdateInput = {};
        if (updateAppointmentDto.dateTime) { // Alterado de appointmentDateTime
            dataToUpdate.dateTime = new Date(updateAppointmentDto.dateTime);
        }
        if (updateAppointmentDto.status) {
            dataToUpdate.status = updateAppointmentDto.status as PrismaAppointmentStatus; // Cast para o enum do Prisma
        }
        if (updateAppointmentDto.notes !== undefined) {
            dataToUpdate.notes = updateAppointmentDto.notes;
        }
        // Atualizar groomerId se fornecido
        if (updateAppointmentDto.groomerId) {
            const groomerExists = await this.prisma.groomer.findUnique({ where: { id: updateAppointmentDto.groomerId }});
            if (!groomerExists) throw new NotFoundException(`Groomer with ID "${updateAppointmentDto.groomerId}" not found.`);
            dataToUpdate.groomer = { connect: { id: updateAppointmentDto.groomerId } };
        }

        // Lógica para atualizar services (mais complexa):
        // Se updateAppointmentDto.serviceIds for fornecido, precisaremos:
        // 1. Deletar os AppointmentService existentes para este agendamento.
        // 2. Criar novos AppointmentService com base nos novos serviceIds.
        // 3. Recalcular o totalPrice.
        if (updateAppointmentDto.serviceIds && updateAppointmentDto.serviceIds.length > 0) {
            let newTotalPrice = 0;
            const newServicesToConnect: Service[] = [];
            for (const serviceId of updateAppointmentDto.serviceIds) {
                const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
                if (!service) throw new NotFoundException(`Service with ID "${serviceId}" not found.`);
                newServicesToConnect.push(service);
                newTotalPrice += service.price;
            }
            dataToUpdate.totalPrice = newTotalPrice;
            // Transação para remover antigos e adicionar novos
            // Esta parte é complexa e pode ser melhorada com uma transação explícita
            await this.prisma.appointmentService.deleteMany({ where: { appointmentId: id } });
            dataToUpdate.appointmentServices = {
                create: newServicesToConnect.map(service => ({
                    service: { connect: { id: service.id } },
                    priceAtTime: service.price,
                })),
            };
        } else if (updateAppointmentDto.serviceIds && updateAppointmentDto.serviceIds.length === 0) {
            // Se uma lista vazia for enviada, remove todos os serviços e zera o preço.
            await this.prisma.appointmentService.deleteMany({ where: { appointmentId: id } });
            dataToUpdate.totalPrice = 0;
            dataToUpdate.appointmentServices = { deleteMany: {} }; // Garante que não haja serviços
        }


        if (Object.keys(dataToUpdate).length === 0 && !(updateAppointmentDto.serviceIds && updateAppointmentDto.serviceIds.length >=0) ) {
             // Se serviceIds for uma lista vazia, há algo para atualizar.
            return existingAppointment; // Nenhum dado para atualizar
        }

        return this.prisma.appointment.update({
            where: { id },
            data: dataToUpdate,
            include: { // Incluir para retornar os dados completos
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

    async remove(id: string, clientId: string): Promise<Appointment> {
        const appointment = await this.findOneByClient(id, clientId);
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found or not owned by client.`);
        }
        // A remoção em cascata deve cuidar dos AppointmentService relacionados (onDelete: Cascade)
        return this.prisma.appointment.delete({
            where: { id },
        });
    }
}