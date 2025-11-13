
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Groomer } from "../models/types";
import { groomerApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface GroomerContextType {
  groomers: Groomer[];
  isLoading: boolean;
  error: Error | null;
  addGroomer: (groomer: Omit<Groomer, "id">) => Promise<Groomer>;
  updateGroomer: (groomer: Groomer) => Promise<Groomer>;
  deleteGroomer: (id: string) => Promise<void>;
  getGroomerById: (id: string) => Groomer | undefined;
  getGroomerWorkload: (groomerId: string, onlyCompletedAppointments?: boolean) => number;
}

const GroomerContext = createContext<GroomerContextType | undefined>(undefined);

export const useGroomers = () => {
  const context = useContext(GroomerContext);
  if (!context) {
    throw new Error("useGroomers must be used within a GroomerProvider");
  }
  return context;
};

export const GroomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: groomers = [], isLoading, error } = useQuery<Groomer[], Error>({
    queryKey: ["groomers"],
    queryFn: groomerApi.getGroomers,
  });

  const addMutation = useMutation({
    mutationFn: groomerApi.createGroomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomers'] });
      toast({ title: "Tosador adicionado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar tosador", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (groomer: Groomer) => groomerApi.updateGroomer(groomer.id, groomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomers'] });
      toast({ title: "Tosador atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar tosador", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: groomerApi.deleteGroomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomers'] });
      toast({ title: "Tosador excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir tosador", description: error.message, variant: "destructive" });
    },
  });

  const getGroomerById = (id: string) => groomers.find((groomer) => groomer.id === id);

  // This is a placeholder. The actual logic is in StoreContext.
  const getGroomerWorkload = (groomerId: string, onlyCompletedAppointments?: boolean) => {
    console.log('getGroomerWorkload called in GroomerContext', groomerId, onlyCompletedAppointments);
    return 0;
  };

  return (
    <GroomerContext.Provider
      value={{
        groomers,
        isLoading,
        error,
        addGroomer: async (groomer) => await addMutation.mutateAsync(groomer),
        updateGroomer: async (groomer) => await updateMutation.mutateAsync(groomer),
        deleteGroomer: async (id) => await deleteMutation.mutateAsync(id),
        getGroomerById,
        getGroomerWorkload,
      }}
    >
      {children}
    </GroomerContext.Provider>
  );
};
