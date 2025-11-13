import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';

@Injectable()
export class ClientAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, clientId: string) {
    // Verificar se o cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: createAppointmentDto.petId,
        clientId,
      },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    // Calcular preço total baseado nos serviços selecionados
    let totalPrice = 0;
    if (
      createAppointmentDto.serviceIds &&
      createAppointmentDto.serviceIds.length > 0
    ) {
      for (const serviceId of createAppointmentDto.serviceIds) {
        const service = await this.prisma.servicePackage.findUnique({
          where: { id: serviceId },
        });

        if (!service) {
          throw new NotFoundException(`Serviço ${serviceId} não encontrado`);
        }

        totalPrice += service.basePrice.toNumber();
      }
    }

    // Criar o agendamento
    const appointment = await this.prisma.appointment.create({
      data: {
        dateTime: new Date(createAppointmentDto.dateTime),
        status: 'SCHEDULED',
        notes: createAppointmentDto.notes,
        totalPrice,
        clientId,
        petId: createAppointmentDto.petId,
        groomerId: createAppointmentDto.groomerId,
      },
      include: {
        client: true,
        pet: true,
        groomer: true,
      },
    });

    // Criar os serviços do agendamento
    if (
      createAppointmentDto.serviceIds &&
      createAppointmentDto.serviceIds.length > 0
    ) {
      for (const serviceId of createAppointmentDto.serviceIds) {
        const service = await this.prisma.servicePackage.findUnique({
          where: { id: serviceId },
        });

        if (!service) {
          throw new NotFoundException(`Serviço ${serviceId} não encontrado`);
        }

        await this.prisma.appointmentService.create({
          data: {
            appointmentId: appointment.id,
            serviceId: serviceId,
            priceAtTime: service.basePrice.toNumber(),
            quantity: 1,
          },
        });
      }
    }

    return appointment;
  }

  async findAllByClient(clientId: string) {
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
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOneByClient(id: string, clientId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        clientId,
      },
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
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence ao cliente',
      );
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    clientId: string,
  ) {
    // Verificar se o agendamento pertence ao cliente
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: { id, clientId },
    });

    if (!existingAppointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence ao cliente',
      );
    }

    // Não permitir atualização se o status não for SCHEDULED
    if (existingAppointment.status !== 'SCHEDULED') {
      throw new BadRequestException(
        'Não é possível alterar agendamentos confirmados ou em andamento',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        dateTime: updateAppointmentDto.dateTime
          ? new Date(updateAppointmentDto.dateTime)
          : undefined,
        notes: updateAppointmentDto.notes,
        groomerId: updateAppointmentDto.groomerId,
      },
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
  }

  async cancel(id: string, clientId: string) {
    // Verificar se o agendamento pertence ao cliente
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: { id, clientId },
    });

    if (!existingAppointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence ao cliente',
      );
    }

    // Não permitir cancelamento se o status não for SCHEDULED
    if (existingAppointment.status !== 'SCHEDULED') {
      throw new BadRequestException(
        'Não é possível cancelar agendamentos confirmados ou em andamento',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
