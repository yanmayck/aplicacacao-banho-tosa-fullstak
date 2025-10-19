import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(createPetDto: CreatePetDto, req: {
        user: JwtPayload;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        species: string;
        breed: string | null;
        birthDate: string | null;
        observations: string | null;
        foodType: string | null;
        lastTickMedicine: import("@prisma/client/runtime/library").JsonValue | null;
        rabiesVaccine: import("@prisma/client/runtime/library").JsonValue | null;
        vaccineHistory: import("@prisma/client/runtime/library").JsonValue[];
    }>;
    findAll(req: {
        user: JwtPayload;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        species: string;
        breed: string | null;
        birthDate: string | null;
        observations: string | null;
        foodType: string | null;
        lastTickMedicine: import("@prisma/client/runtime/library").JsonValue | null;
        rabiesVaccine: import("@prisma/client/runtime/library").JsonValue | null;
        vaccineHistory: import("@prisma/client/runtime/library").JsonValue[];
    }[]>;
    findOne(id: string, req: {
        user: JwtPayload;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        species: string;
        breed: string | null;
        birthDate: string | null;
        observations: string | null;
        foodType: string | null;
        lastTickMedicine: import("@prisma/client/runtime/library").JsonValue | null;
        rabiesVaccine: import("@prisma/client/runtime/library").JsonValue | null;
        vaccineHistory: import("@prisma/client/runtime/library").JsonValue[];
    } | null>;
    update(id: string, updatePetDto: UpdatePetDto, req: {
        user: JwtPayload;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        species: string;
        breed: string | null;
        birthDate: string | null;
        observations: string | null;
        foodType: string | null;
        lastTickMedicine: import("@prisma/client/runtime/library").JsonValue | null;
        rabiesVaccine: import("@prisma/client/runtime/library").JsonValue | null;
        vaccineHistory: import("@prisma/client/runtime/library").JsonValue[];
    }>;
    remove(id: string, req: {
        user: JwtPayload;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        species: string;
        breed: string | null;
        birthDate: string | null;
        observations: string | null;
        foodType: string | null;
        lastTickMedicine: import("@prisma/client/runtime/library").JsonValue | null;
        rabiesVaccine: import("@prisma/client/runtime/library").JsonValue | null;
        vaccineHistory: import("@prisma/client/runtime/library").JsonValue[];
    }>;
}
