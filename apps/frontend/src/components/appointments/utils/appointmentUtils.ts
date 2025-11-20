
import { AppointmentStatus, ServiceType } from "@/context/StoreContext";

export const translateServiceType = (type: string): string => {
  switch (type) {
    case "bath": return "Banho";
    case "grooming": return "Tosa";
    case "both": return "Banho e Tosa";
    default: return type;
  }
};

export const translateStatus = (status: AppointmentStatus): string => {
  switch (status) {
    case "waiting": return "Em espera";
    case "progress": return "Em andamento";
    case "completed": return "Concluído";
    default: return status;
  }
};

export const getStatusClassName = (status: AppointmentStatus): string => {
  switch (status) {
    case "waiting": return "bg-yellow-100 text-yellow-800";
    case "progress": return "bg-blue-100 text-blue-800";
    case "completed": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
