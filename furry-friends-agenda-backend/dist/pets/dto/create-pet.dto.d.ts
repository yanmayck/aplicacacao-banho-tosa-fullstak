declare class TickMedicineDto {
    name: string;
    date: string;
}
declare class RabiesVaccineDto {
    isUpToDate: boolean;
    lastDate: string;
}
declare class VaccineHistoryDto {
    name: string;
    date: string;
}
export declare class CreatePetDto {
    name: string;
    species: string;
    breed?: string;
    birthDate?: string;
    observations?: string;
    foodType?: string;
    lastTickMedicine?: TickMedicineDto;
    rabiesVaccine?: RabiesVaccineDto;
    vaccineHistory?: VaccineHistoryDto[];
    clientId: string;
}
export {};
