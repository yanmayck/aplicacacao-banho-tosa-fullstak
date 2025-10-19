import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.servicePackage.findMany({
      where: {},
      orderBy: { price: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.servicePackage.findUnique({
      where: { id },
    });
  }

  async findAvailableGroomers() {
    return this.prisma.groomer.findMany({
      where: {
        status: 'available',
      },
      select: {
        id: true,
        name: true,
        specialties: true,
        status: true,
      },
    });
  }

  async findAvailableTimeSlots(date: Date, serviceId: string) {
    // Esta é uma implementação básica - você pode expandir conforme necessário
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0); // Início do dia às 9h

    const dayEnd = new Date(date);
    dayEnd.setHours(18, 0, 0, 0); // Fim do dia às 18h

    // Buscar agendamentos existentes para o dia
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
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
