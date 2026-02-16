
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "../models/types";
import { appointmentApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  autoAssignGroomer: (appointmentId: string) => void; // This will be a mutation
  updateAppointmentPoints: (appointmentId: string, points: number) => void; // This will be a mutation
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, error } = useQuery<Appointment[], Error>({
    queryKey: ["appointments"],
    queryFn: appointmentApi.getAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addMutation = useMutation({
    mutationFn: appointmentApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Agendamento criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar agendamento", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (appointment: Appointment) => appointmentApi.updateAppointment(appointment.id, appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Agendamento atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar agendamento", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentApi.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Agendamento excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir agendamento", description: error.message, variant: "destructive" });
    },
  });

  // Placeholder mutations for auto-assign and points update
  const autoAssignGroomer = (appointmentId: string) => {
    // This would be a mutation that calls a specific API endpoint
    console.log("Auto-assigning groomer for", appointmentId);
  };

  const updateAppointmentPoints = (appointmentId: string, points: number) => {
    // This would be a mutation that calls a specific API endpoint
    console.log("Updating points for", appointmentId, "to", points);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        error,
        addAppointment: async (appointment) => await addMutation.mutateAsync(appointment),
        updateAppointment: async (appointment) => await updateMutation.mutateAsync(appointment),
        deleteAppointment: async (id) => await deleteMutation.mutateAsync(id),
        autoAssignGroomer,
        updateAppointmentPoints,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
