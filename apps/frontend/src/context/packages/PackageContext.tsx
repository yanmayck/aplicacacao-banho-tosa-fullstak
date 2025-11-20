
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package } from "../models/types";
import { packageApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface PackageContextType {
  packages: Package[];
  isLoading: boolean;
  error: Error | null;
  addPackage: (pkg: Omit<Package, "id">) => Promise<void>;
  updatePackage: (pkg: Package) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  getPackageById: (id: string) => Package | undefined;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error("usePackages must be used within a PackageProvider");
  }
  return context;
};

export const PackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading, error } = useQuery<Package[], Error>({
    queryKey: ["packages"],
    queryFn: packageApi.getPackages,
  });

  const addMutation = useMutation({
    mutationFn: packageApi.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast({ title: "Pacote adicionado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar pacote", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (pkg: Package) => packageApi.updatePackage(pkg.id, pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast({ title: "Pacote atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar pacote", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: packageApi.deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast({ title: "Pacote excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir pacote", description: error.message, variant: "destructive" });
    },
  });

  const getPackageById = (id: string) => packages.find((pkg) => pkg.id === id);

  return (
    <PackageContext.Provider
      value={{
        packages,
        isLoading,
        error,
        addPackage: async (pkg) => await addMutation.mutateAsync(pkg),
        updatePackage: async (pkg) => await updateMutation.mutateAsync(pkg),
        deletePackage: async (id) => await deleteMutation.mutateAsync(id),
        getPackageById,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};
