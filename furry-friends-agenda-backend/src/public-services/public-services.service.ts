import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicTenantInfo } from '../auth/types/tenant.types';

@Injectable()
export class PublicServicesService {
  constructor(private prisma: PrismaService) {}

  private getCompanyIdFromRequest(req: any): string | null {
    return req.tenant?.id || null;
  }

  async findAll(req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    return this.prisma.servicePackage.findMany({
      where: {
        ...(companyId && { companyId }),
      },
      orderBy: { price: 'asc' },
    });
  }

  async findOne(id: string, req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    return this.prisma.servicePackage.findUnique({
      where: {
        id,
        ...(companyId && { companyId }),
      },
    });
  }

  async findAvailableGroomers(req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    return this.prisma.groomer.findMany({
      where: {
        status: 'available',
        ...(companyId && { companyId }),
      },
      select: {
        id: true,
        name: true,
        specialties: true,
        status: true,
      },
    });
  }

  async findAvailableTimeSlots(date: Date, req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    // Esta é uma implementação básica - você pode expandir conforme necessário
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0); // Início do dia às 9h

    const dayEnd = new Date(date);
    dayEnd.setHours(18, 0, 0, 0); // Fim do dia às 18h

    // Buscar agendamentos existentes para o dia (filtrados por empresa)
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
        ...(companyId && { companyId }),
      },
      select: {
        dateTime: true,
        appointmentServices: {
          select: {
            service: {
              select: {
                durationMin: true,
              },
            },
          },
        },
      },
    });

    // Gerar slots disponíveis (simplificado)
    const availableSlots = [];
    const currentTime = new Date(dayStart);

    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hora slots

      // Verificar se há conflito com agendamentos existentes
      const hasConflict = existingAppointments.some((apt) => {
        const aptEnd = new Date(apt.dateTime.getTime() + 60 * 60 * 1000); // 1 hora duração assumida
        return currentTime < aptEnd && slotEnd > apt.dateTime;
      });

      if (!hasConflict) {
        availableSlots.push({
          startTime: new Date(currentTime),
          endTime: slotEnd,
        });
      }

      currentTime.setTime(slotEnd.getTime());
    }

    return availableSlots;
  }
}
