"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PetsService = class PetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPetDto) {
        const { clientId, ...petData } = createPetDto;
        const data = {
            ...petData,
            client: { connect: { id: clientId } },
            lastTickMedicine: petData.lastTickMedicine ? (JSON.parse(JSON.stringify(petData.lastTickMedicine))) : undefined,
            rabiesVaccine: petData.rabiesVaccine ? (JSON.parse(JSON.stringify(petData.rabiesVaccine))) : undefined,
            vaccineHistory: petData.vaccineHistory ? (JSON.parse(JSON.stringify(petData.vaccineHistory))) : undefined,
        };
        return this.prisma.pet.create({ data });
    }
    async findAllByOwner(clientId) {
        return this.prisma.pet.findMany({
            where: { clientId },
        });
    }
    async findOneByOwner(id, clientId) {
        const pet = await this.prisma.pet.findUnique({
            where: { id },
        });
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID "${id}" not found`);
        }
        if (pet.clientId !== clientId) {
            throw new common_1.ForbiddenException('You are not allowed to access this pet');
        }
        return pet;
    }
    async update(id, updatePetDto, clientId) {
        const pet = await this.findOneByOwner(id, clientId);
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID "${id}" not found or not owned by client.`);
        }
        return this.prisma.pet.update({
            where: { id },
            data: {
                ...updatePetDto,
                lastTickMedicine: updatePetDto.lastTickMedicine ? updatePetDto.lastTickMedicine : undefined,
                rabiesVaccine: updatePetDto.rabiesVaccine ? updatePetDto.rabiesVaccine : undefined,
                vaccineHistory: updatePetDto.vaccineHistory ? JSON.parse(JSON.stringify(updatePetDto.vaccineHistory)) : undefined,
            },
        });
    }
    async remove(id, clientId) {
        const pet = await this.findOneByOwner(id, clientId);
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID "${id}" not found or not owned by client.`);
        }
        return this.prisma.pet.delete({
            where: { id },
        });
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PetsService);
//# sourceMappingURL=pets.service.js.map