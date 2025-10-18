import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientPetHealthService {
  constructor(private prisma: PrismaService) {}

  async getPetHealth(petId: string, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
        clientId
      }
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado ou não pertence ao cliente');
    }

    return {
      pet: {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
      },
      rabiesVaccine: pet.rabiesVaccine,
      lastTickMedicine: pet.lastTickMedicine,
      vaccineHistory: pet.vaccineHistory,
    };
  }

  async addVaccineRecord(petId: string, vaccineData: any, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
        clientId
      }
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado ou não pertence ao cliente');
    }

    // Obter histórico atual
    const currentHistory = pet.vaccineHistory || [];

    // Adicionar nova vacina
    const updatedHistory = [...currentHistory, vaccineData];

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        vaccineHistory: updatedHistory
      }
    });
  }

  async updateRabiesVaccine(petId: string, rabiesData: any, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
        clientId
      }
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado ou não pertence ao cliente');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        rabiesVaccine: rabiesData
      }
    });
  }

  async updateTickMedicine(petId: string, medicineData: any, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
        clientId
      }
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado ou não pertence ao cliente');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        lastTickMedicine: medicineData
      }
    });
  }

  async getVaccinesDueSoon(clientId: string, daysAhead: number = 30) {
    // Por ora, retornar array vazio - funcionalidade pode ser expandida posteriormente
    return [];
  }
}
