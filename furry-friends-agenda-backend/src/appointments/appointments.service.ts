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
  Appointment,
  Prisma,
  AppointmentStatus as PrismaAppointmentStatus,
  ServicePackage,
} from '@prisma/client';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto, currentClientId: string): Promise<Appointment> {
        const { petId, serviceIds, dateTime, notes, groomerId, status } = createAppointmentDto;

        const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
        if (!pet) {
            throw new NotFoundException(`Pet with ID "${petId}" not found.`);
        }
        if (pet.clientId !== currentClientId) {
            throw new ForbiddenException('You can only create appointments for your own pets.');
        }

        if (groomerId) {
            const groomer = await this.prisma.groomer.findUnique({ where: { id: groomerId } });
            if (!groomer) {
                throw new NotFoundException(`Groomer with ID "${groomerId}" not found.`);
            }
        }

        if (!serviceIds || serviceIds.length === 0) {
            throw new BadRequestException('At least one service must be selected.');
        }

        const foundServices = await this.prisma.servicePackage.findMany({
            where: {
                id: { in: serviceIds }
            }
        });

        const serviceMap = new Map<string, ServicePackage>(foundServices.map(s => [s.id, s]));

        const servicesToConnect: ServicePackage[] = [];
        let calculatedTotalPrice = 0;

        for (const serviceId of serviceIds) {
            const service = serviceMap.get(serviceId);
            if (!service) {
                throw new NotFoundException(`Service with ID "${serviceId}" not found.`);
            }
            servicesToConnect.push(service);
            calculatedTotalPrice += service.price;
        }

        try {
            return await this.prisma.appointment.create({
                data: {
                    dateTime: new Date(dateTime),
                    notes,
                    status: status || PrismaAppointmentStatus.SCHEDULED,
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error("Prisma Error creating appointment: ", error.code, error.message);
            }
            throw new BadRequestException('Could not create appointment. Please check input data.');
        }
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
    const servicesToConnect: ServicePackage[] = [];
    for (const serviceId of serviceIds) {
      const service = await this.prisma.servicePackage.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }
      servicesToConnect.push(service);
      calculatedTotalPrice += service.price;
    }

    try {
      return await this.prisma.appointment.create({
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
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(
          'Prisma Error creating appointment: ',
          error.code,
          error.message,
        );
      }
      throw new BadRequestException(
        'Could not create appointment. Please check input data.',
      );
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
      orderBy: { dateTime: 'asc' },
    });
  }

  async findOneByClient(
    id: string,
    clientId: string,
  ): Promise<Appointment | null> {
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
    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    currentClientId: string,
  ): Promise<Appointment> {
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
      const newServicesToConnect: ServicePackage[] = [];
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

  async remove(id: string, clientId: string): Promise<Appointment> {
    await this.findOneByClient(id, clientId);
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
