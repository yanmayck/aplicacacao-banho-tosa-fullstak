import { useEffect, useState, useMemo } from "react";
import { Appointment, useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AppointmentFormData } from "./types";
import { servicePrices } from "./utils";
import { useToast } from "@/hooks/use-toast";

// Helper to get local date in YYYY-MM-DD format
const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface UseAppointmentFormProps {
  appointment?: Appointment | undefined;
  onClose: () => void;
}

export const useAppointmentForm = ({ appointment, onClose }: UseAppointmentFormProps) => {
  const { clients, pets, packages, addAppointment, updateAppointment } = useStore();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const isEditing = !!appointment;
  const isAdminUser = useMemo(() => isAdmin(), [isAdmin]);

  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: "",
    petName: "",
    date: getLocalDate(),
    time: "08:00",
    serviceType: "bath",
    groomerId: null,
    status: "waiting",
    packageId: null,
    transportType: "none",
    price: 0,
    points: 1
  });

  const selectedClient = useMemo(() => {
    return clients.find(client => client.id === formData.clientId);
  }, [formData.clientId, clients]);

  // Effect to populate form when editing an appointment
  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        petName: appointment.petName,
        date: appointment.date, // Assuming date is already in YYYY-MM-DD
        time: appointment.time,
        serviceType: appointment.serviceType,
        groomerId: appointment.groomerId,
        status: appointment.status,
        packageId: appointment.packageId || null,
        transportType: appointment.transportType || "none",
        price: appointment.price,
        points: appointment.points || 1
      });
    }
  }, [appointment]);

  // Effect to update petName when client changes
  useEffect(() => {
    if (selectedClient) {
      const clientPets = pets.filter(pet => pet.clientId === selectedClient.id);
      // Set petName to the first pet's name or empty string
      setFormData(prev => ({ ...prev, petName: clientPets[0]?.name || "" }));
    } else {
      // Clear petName if no client is selected
      setFormData(prev => ({ ...prev, petName: "" }));
    }
  }, [selectedClient, pets]);

  // Effect to update price based on service, package, and transport
  useEffect(() => {
    let newPrice = 0;
    if (formData.packageId) {
      const selectedPackage = packages.find((pkg) => pkg.id === formData.packageId);
      if (selectedPackage) {
        newPrice = formData.transportType === "none" ? selectedPackage.basePrice : selectedPackage.pickupPrice;
      }
    } else {
      // We should only use servicePrices if the serviceType is a valid key.
      if (formData.serviceType in servicePrices) {
        const serviceKey = formData.serviceType as keyof typeof servicePrices;
        newPrice = servicePrices[serviceKey] || 0;
      }
    }
    setFormData((prev) => ({ ...prev, price: newPrice }));
  }, [formData.serviceType, formData.packageId, formData.transportType, packages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const isPackage = name === "packageId";
    const isGroomer = name === "groomerId";
    let newValue: string | null = value;

    if ((isPackage || isGroomer) && value === "none") {
      newValue = null;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      // If a package is selected, set serviceType to 'package'. If deselected, reset to 'bath'.
      serviceType: isPackage && newValue ? "package" : (isPackage && !newValue ? "bath" : prev.serviceType),
    }));
  };

  const handleSubmit = () => {
    if (!formData.clientId || !formData.date || !formData.time || !formData.petName) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha Cliente, Pet, Data e Hora.",
        variant: "destructive",
      });
      return;
    }

    if (formData.packageId && formData.transportType === "none") {
      toast({
        title: "Transporte necessário",
        description: "Por favor, selecione o tipo de transporte para o pacote.",
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      ...formData,
      points: typeof formData.points === 'string' ? parseInt(formData.points, 10) || 1 : formData.points,
    };

    if (isEditing && appointment) {
      updateAppointment({
        ...appointment,
        ...appointmentData
      });
      toast({ title: "Sucesso", description: "Agendamento atualizado com sucesso!" });
    } else {
      addAppointment(appointmentData);
      toast({ title: "Sucesso", description: "Agendamento criado com sucesso!" });
    }

    onClose();
  };

  return {
    formData,
    isEditing,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    isAdmin: isAdminUser,
    selectedClient,
  };
};