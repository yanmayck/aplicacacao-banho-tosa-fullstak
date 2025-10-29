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
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import {
  Appointment as AppointmentType,
  ServicePackage as ServicePackageType,
} from './types/appointment.types';

@Injectable()
export class AppointmentsService extends BaseService {
  constructor(
    protected prisma: PrismaService,
    private financialService: FinancialService,
  ) {
    super(prisma);
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: JwtPayload,
  ): Promise<AppointmentType> {
    const { petId, serviceIds, dateTime, notes, groomerId, status } =
      createAppointmentDto;

    // Verificar se o pet existe e pertence à empresa do usuário
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true, clientId: true, companyId: true },
    });
    if (!pet) {
      throw new NotFoundException(`Pet with ID "${petId}" not found.`);
    }

    // Aplicar filtro de empresa
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      pet.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Pet belongs to another company');
    }

    // Verificar se o pet pertence ao cliente (se não for SUPER_ADMIN)
    if (user.role !== 'SUPER_ADMIN' && pet.clientId !== user.userId) {
      throw new ForbiddenException(
        'You can only create appointments for your own pets.',
      );
    }

    if (groomerId) {
      const groomer = await this.prisma.groomer.findUnique({
        where: { id: groomerId },
        select: { id: true, companyId: true },
      });
      if (!groomer) {
        throw new NotFoundException(
          `Groomer with ID "${groomerId}" not found.`,
        );
      }
      // Verificar se o groomer pertence à mesma empresa
      if (
        'companyId' in companyFilter &&
        groomer.companyId !== companyFilter.companyId
      ) {
        throw new ForbiddenException('Groomer belongs to another company');
      }
    }

    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('At least one service must be selected.');
    }

    let calculatedTotalPrice = 0;
    const servicesToConnect: { id: string; price: number }[] = [];
    for (const serviceId of serviceIds) {
      const service = await this.prisma.servicePackage.findUnique({
        where: { id: serviceId },
        select: { id: true, price: true, companyId: true },
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }
      // Verificar se o serviço pertence à mesma empresa
      if (
        'companyId' in companyFilter &&
        service.companyId !== companyFilter.companyId
      ) {
        throw new ForbiddenException('Service belongs to another company');
      }
      servicesToConnect.push({ id: service.id, price: service.price });
      calculatedTotalPrice += service.price;
    }

    const appointmentData = {
      dateTime: new Date(dateTime),
      notes,
      status: status || PrismaAppointmentStatus.SCHEDULED,
      totalPrice: calculatedTotalPrice,
      pet: { connect: { id: petId } },
      client: { connect: { id: pet.clientId } },
      groomer: groomerId ? { connect: { id: groomerId } } : undefined,
      appointmentServices: {
        create: servicesToConnect.map((service) => ({
          service: { connect: { id: service.id } },
          priceAtTime: service.price,
        })),
      },
    };

    const data = this.applyCompanyFilterToCreate(
      appointmentData,
      user,
      'Appointment',
    ) as any;

    return this.prisma.appointment.create({
      data,
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

  async findAllByClient(
    clientId: string,
    user: JwtPayload,
  ): Promise<AppointmentType[]> {
    // Verificar se o cliente pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }

    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      client.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Client belongs to another company');
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
        orderBy: { dateTime: 'asc' },
      },
      user,
      'Appointment',
    );
  }

  async findOneByClient(
    id: string,
    clientId: string,
    user: JwtPayload,
  ): Promise<AppointmentType | null> {
    // Primeiro verificar se o cliente pertence à empresa
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }

    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      client.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Client belongs to another company');
    }

    const appointment = (await this.prisma.appointment.findUnique({
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
    })) as AppointmentType | null;

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    // Verificar se o agendamento pertence à empresa do usuário
    if (
      'companyId' in companyFilter &&
      appointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Appointment belongs to another company');
    }

    if (appointment.clientId !== clientId) {
      throw new ForbiddenException(
        'You are not allowed to access this appointment',
      );
    }
    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    user: JwtPayload,
  ): Promise<AppointmentType> {
    // Primeiro verificar se o agendamento existe e pertence à empresa
    const existingAppointment = await this.prisma.appointment.findUnique({
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
    });

    if (!existingAppointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    // Verificar se o agendamento pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      existingAppointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Appointment belongs to another company');
    }

    // Verificar se o pet pertence ao cliente (se não for SUPER_ADMIN)
    if (
      user.role !== 'SUPER_ADMIN' &&
      existingAppointment.pet.clientId !== user.userId
    ) {
      throw new ForbiddenException(
        'You can only update appointments for your own pets',
      );
    }

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
      const newServicesToConnect: ServicePackageType[] = [];
      for (const serviceId of updateAppointmentDto.serviceIds) {
        const service = await this.prisma.servicePackage.findUnique({
          where: { id: serviceId },
        });
        if (!service)
          throw new NotFoundException(
            `Service with ID "${serviceId}" not found.`,
          );
        newServicesToConnect.push(service);
        newTotalPrice += service.price;
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
    });
  }

  async remove(id: string, user: JwtPayload): Promise<AppointmentType> {
    // Primeiro verificar se o agendamento existe e pertence à empresa
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        pet: true,
        client: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    // Verificar se o agendamento pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      appointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Appointment belongs to another company');
    }

    // Verificar se o pet pertence ao cliente (se não for SUPER_ADMIN)
    if (
      user.role !== 'SUPER_ADMIN' &&
      appointment.pet.clientId !== user.userId
    ) {
      throw new ForbiddenException(
        'You can only delete appointments for your own pets',
      );
    }

    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  // ========== INTEGRAÇÃO FINANCEIRA ==========

  async updateAppointmentStatus(
    id: string,
    status: PrismaAppointmentStatus,
    user: JwtPayload,
  ): Promise<AppointmentType> {
    // Primeiro verificar se o agendamento existe e pertence à empresa
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        pet: true,
        client: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    // Verificar se o agendamento pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      appointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Appointment belongs to another company');
    }

    // Verificar se o pet pertence ao cliente (se não for SUPER_ADMIN)
    if (
      user.role !== 'SUPER_ADMIN' &&
      appointment.pet.clientId !== user.userId
    ) {
      throw new ForbiddenException(
        'You can only update status for appointments of your own pets',
      );
    }

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
        await this.financialService.createAutomaticIncomeFromAppointment(
          id,
          user,
        );
        console.log(`Receita automática criada para agendamento ${id}`);
      } catch (error) {
        console.error(
          `Erro ao criar receita automática para agendamento ${id}:`,
          error,
        );
        // Não falhar a operação principal se a receita automática falhar
      }
    }

    return updatedAppointment;
  }

  async getAppointmentFinancialSummary(
    appointmentId: string,
    user: JwtPayload,
  ): Promise<{
    appointment: AppointmentType;
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

    // Verificar se o agendamento pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      appointment.companyId !== companyFilter.companyId
    ) {
      throw new ForbiddenException('Appointment belongs to another company');
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
}
