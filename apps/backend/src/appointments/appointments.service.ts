import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  Prisma,
  AppointmentStatus as PrismaAppointmentStatus,
} from '@prisma/client';
import { FinancialService } from '../financial/financial.service';
import { FullAppointment } from './types/appointment.types';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private financialService: FinancialService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    currentClientId: string,
  ): Promise<FullAppointment> {
    const { petId, serviceIds, dateTime, notes, groomerId, status } =
      createAppointmentDto;

    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID "${petId}" not found.`);
    }
    if (pet.clientId !== currentClientId) {
      throw new ForbiddenException(
        'You can only create appointments for your own pets.',
      );
    }

    if (groomerId) {
      const groomer = await this.prisma.groomer.findUnique({
        where: { id: groomerId },
      });
      if (!groomer) {
        throw new NotFoundException(
          `Groomer with ID "${groomerId}" not found.`,
        );
      }
    }

    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('At least one service must be selected.');
    }

    let calculatedTotalPrice = 0;
    const servicesToConnect: Prisma.ServiceGetPayload<{}>[] = [];
    for (const serviceId of serviceIds) {
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }
      servicesToConnect.push(service);
      calculatedTotalPrice += Number(service.price);
    }

    return this.prisma.appointment.create({
      data: {
        dateTime: new Date(dateTime),
        notes,
        status: status || PrismaAppointmentStatus.SCHEDULED,
        totalPrice: calculatedTotalPrice,
        pet: { connect: { id: petId } },
        client: { connect: { id: currentClientId } },
        groomer: groomerId ? { connect: { id: groomerId } } : undefined,
        appointmentServices: {
          create: servicesToConnect.map((service) => ({
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
    }) as unknown as FullAppointment;
  }

  async findAllByClient(clientId: string): Promise<FullAppointment[]> {
    return (await this.prisma.appointment.findMany({
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
    })) as unknown as FullAppointment[];
  }

  async findOneByClient(
    id: string,
    clientId: string,
  ): Promise<FullAppointment | null> {
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
      throw new ForbiddenException(
        'You are not allowed to access this appointment',
      );
    }
    return appointment as unknown as FullAppointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    currentClientId: string,
  ): Promise<FullAppointment> {
    const existingAppointment = await this.findOneByClient(id, currentClientId);

    const dataToUpdate: Prisma.AppointmentUpdateInput = {};
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
      const groomerExists = await this.prisma.groomer.findUnique({
        where: { id: updateAppointmentDto.groomerId },
      });
      if (!groomerExists)
        throw new NotFoundException(
          `Groomer with ID "${updateAppointmentDto.groomerId}" not found.`,
        );
      dataToUpdate.groomer = {
        connect: { id: updateAppointmentDto.groomerId },
      };
    }

    if (updateAppointmentDto.serviceIds) {
      let newTotalPrice = 0;
      const newServicesToConnect: Prisma.ServiceGetPayload<{}>[] = [];
      for (const serviceId of updateAppointmentDto.serviceIds) {
        const service = await this.prisma.service.findUnique({
          where: { id: serviceId },
        });
        if (!service)
          throw new NotFoundException(
            `Service with ID "${serviceId}" not found.`,
          );
        newServicesToConnect.push(service);
        newTotalPrice += Number(service.price);
      }
      dataToUpdate.totalPrice = newTotalPrice;
      await this.prisma.appointmentService.deleteMany({
        where: { appointmentId: id },
      });
      dataToUpdate.appointmentServices = {
        create: newServicesToConnect.map((service) => ({
          service: { connect: { id: service.id } },
          priceAtTime: service.price,
        })),
      };
    }

    if (!existingAppointment) {
      throw new NotFoundException(
        `Appointment with ID "${id}" not found or not owned by client.`,
      );
    }
    // Se não houver dados para atualizar, retorna o agendamento existente.
    if (
      Object.keys(dataToUpdate).length === 0 &&
      (!updateAppointmentDto.serviceIds ||
        updateAppointmentDto.serviceIds.length === 0)
    ) {
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
    }) as unknown as FullAppointment;
  }

  async remove(id: string, clientId: string): Promise<FullAppointment> {
    await this.findOneByClient(id, clientId);
    return this.prisma.appointment.delete({
      where: { id },
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
    }) as unknown as FullAppointment;
  }

  // ========== INTEGRAÇÃO FINANCEIRA ==========

  async updateAppointmentStatus(
    id: string,
    status: PrismaAppointmentStatus,
    currentClientId: string,
  ): Promise<FullAppointment> {
    await this.findOneByClient(id, currentClientId);

    // Atualizar status do agendamento
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

    // Se o agendamento foi concluído, criar receita automática
    if (status === PrismaAppointmentStatus.COMPLETED) {
      try {
        await this.financialService.createAutomaticIncomeFromAppointment(id);
        console.log(`Receita automática criada para agendamento ${id}`);
      } catch (error) {
        console.error(
          `Erro ao criar receita automática para agendamento ${id}:`,
          error,
        );
        // Não falhar a operação principal se a receita automática falhar
      }
    }

    return updatedAppointment as unknown as FullAppointment;
  }

  async getAppointmentFinancialSummary(appointmentId: string): Promise<{
    appointment: FullAppointment;
    estimatedRevenue: number;
    commission: number;
    netRevenue: number;
  }> {
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
      throw new NotFoundException(
        `Agendamento com ID "${appointmentId}" não encontrado`,
      );
    }

    const estimatedRevenue = appointment.totalPrice;
    const commissionPercentage = appointment.groomer?.commissionPercentage || 0;
    const commission = estimatedRevenue * (commissionPercentage / 100);
    const netRevenue = estimatedRevenue - commission;

    return {
      appointment: appointment as unknown as FullAppointment,
      estimatedRevenue,
      commission,
      netRevenue,
    };
  }
}
