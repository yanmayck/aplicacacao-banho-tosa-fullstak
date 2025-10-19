
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "../models/types";
import { clientApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface ClientContextType {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  addClient: (client: Omit<Client, "id">) => Promise<Client>;
  updateClient: (client: Client) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: clientApi.getClients,
  });

  const addMutation = useMutation({
    mutationFn: clientApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente adicionado",
        description: "O novo cliente foi cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (client: Client) => clientApi.updateClient(client.id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clientApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        isLoading,
        error,
        addClient: async (client) => await addMutation.mutateAsync(client),
        updateClient: async (client) => await updateMutation.mutateAsync(client),
        deleteClient: async (id) => await deleteMutation.mutateAsync(id),
        getClientById,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
