
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pet } from "../models/types";
import { petApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface PetContextType {
  pets: Pet[];
  isLoading: boolean;
  error: Error | null;
  addPet: (pet: Omit<Pet, "id">) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePets must be used within a PetProvider");
  }
  return context;
};

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading, error } = useQuery<Pet[], Error>({
    queryKey: ["pets"],
    queryFn: petApi.getPets,
  });

  const addMutation = useMutation({
    mutationFn: petApi.createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast({ title: "Pet adicionado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar pet", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (pet: Pet) => petApi.updatePet(pet.id, pet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast({ title: "Pet atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar pet", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: petApi.deletePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast({ title: "Pet excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir pet", description: error.message, variant: "destructive" });
    },
  });

  const getPetById = (id: string) => pets.find((pet) => pet.id === id);
  const getPetsByClientId = (clientId: string) => pets.filter((pet) => pet.clientId === clientId);

  return (
    <PetContext.Provider
      value={{
        pets,
        isLoading,
        error,
        addPet: async (pet) => await addMutation.mutateAsync(pet),
        updatePet: async (pet) => await updateMutation.mutateAsync(pet),
        deletePet: async (id) => await deleteMutation.mutateAsync(id),
        getPetById,
        getPetsByClientId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
