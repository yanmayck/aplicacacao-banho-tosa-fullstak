import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from '@prisma/client';
export declare class PetsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPetDto: CreatePetDto, userId: string): Promise<Pet>;
    findAllByOwner(clientId: string): Promise<Pet[]>;
    findOneByOwner(id: string, clientId: string): Promise<Pet | null>;
    update(id: string, updatePetDto: UpdatePetDto, clientId: string): Promise<Pet>;
    remove(id: string, clientId: string): Promise<Pet>;
}
