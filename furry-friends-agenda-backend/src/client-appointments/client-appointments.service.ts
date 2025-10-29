import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ClientAppointmentsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    clientId: string,
    user: JwtPayload,
  ) {
    // Verificar se o cliente existe e pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar isolamento de empresa
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      client.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Cliente pertence a outra empresa');
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

        totalPrice += service.price;
      }
    }

    // Criar o agendamento com isolamento de empresa
    const appointmentData = this.applyCompanyFilterToCreate(
      {
        dateTime: new Date(createAppointmentDto.dateTime),
        status: 'SCHEDULED' as const,
        notes: createAppointmentDto.notes,
        totalPrice,
        clientId,
        petId: createAppointmentDto.petId,
        groomerId: createAppointmentDto.groomerId,
      },
      user,
      'Appointment',
    );

    const appointment = await this.prisma.appointment.create({
      data: appointmentData,
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
            priceAtTime: service.price,
            quantity: 1,
          },
        });
      }
    }

    return appointment;
  }

  async findAllByClient(clientId: string, user: JwtPayload) {
    // Verificar se o cliente pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });

    if (!client) {
      throw new NotFoundException(
        `Cliente com ID "${clientId}" não encontrado`,
      );
    }

    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      client.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Cliente pertence a outra empresa');
    }

    return this.findManyWithCompanyFilter(
      this.prisma.appointment,
      {
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
      },
      user,
      'Appointment',
    );
  }

  async findOneByClient(id: string, clientId: string, user: JwtPayload) {
    // Verificar se o cliente pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });

    if (!client) {
      throw new NotFoundException(
        `Cliente com ID "${clientId}" não encontrado`,
      );
    }

    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      client.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Cliente pertence a outra empresa');
    }

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

    // Verificar se o agendamento pertence à empresa do usuário
    if (
      'companyId' in companyFilter &&
      appointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Agendamento pertence a outra empresa');
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    clientId: string,
    user: JwtPayload,
  ) {
    // Verificar se o agendamento pertence ao cliente e à empresa
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: { id, clientId },
    });

    if (!existingAppointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence ao cliente',
      );
    }

    // Verificar isolamento de empresa
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      existingAppointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Agendamento pertence a outra empresa');
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

  async cancel(id: string, clientId: string, user: JwtPayload) {
    // Verificar se o agendamento pertence ao cliente e à empresa
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: { id, clientId },
    });

    if (!existingAppointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence ao cliente',
      );
    }

    // Verificar isolamento de empresa
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      existingAppointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Agendamento pertence a outra empresa');
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
