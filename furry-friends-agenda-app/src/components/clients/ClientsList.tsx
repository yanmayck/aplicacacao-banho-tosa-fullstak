
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Client } from "@/context/models/types"; // Reutilizando os tipos
import { clientApi } from "@/lib/api"; // Importando a nova API com Axios
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import ClientForm from "./ClientForm";
import { useAuth } from "@/context/AuthContext";
import PetForm from "../pets/PetForm";
import { toast } from "@/components/ui/use-toast";

const ClientsList: React.FC = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  // 1. Buscar dados com useQuery
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'], // Chave única para esta query
    queryFn: clientApi.getClients, // Função que busca os dados
  });

  // 2. Criar uma mutation para deletar clientes
  const deleteMutation = useMutation({
    mutationFn: clientApi.deleteClient,
    onSuccess: () => {
      toast({ title: "Cliente excluído com sucesso!" });
      // 3. Invalidar a query de clientes para forçar a atualização da lista
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (err) => {
      toast({ 
        title: "Erro ao excluir cliente", 
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // Filtro de busca agora opera sobre os dados do useQuery
  const filteredClients = useMemo(() => 
    clients?.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [], [clients, searchQuery]);

  const handleEditClient = (client: Client) => {
    if (!isAdmin()) {
      toast({ title: "Permissão negada", description: "Apenas administradores podem editar clientes.", variant: "destructive" });
      return;
    }
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = (id: string) => {
    if (!isAdmin()) {
      toast({ title: "Permissão negada", description: "Apenas administradores podem excluir clientes.", variant: "destructive" });
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteMutation.mutate(id); // 4. Usar a mutation para deletar
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(undefined);
  };

  const handleClosePetForm = () => {
    setShowPetForm(false);
    setSelectedClientId("");
  };

  const handleAddPet = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowPetForm(true);
  };

  if (isLoading) {
    return (
      <Layout activePage="clients" setActivePage={() => {}}>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout activePage="clients" setActivePage={() => {}}>
        <div className="text-red-500">Erro ao carregar clientes: {error.message}</div>
      </Layout>
    );
  }

  return (
    <Layout activePage="clients" setActivePage={() => {}}>
      <div className="space-y-4">
        {showForm ? (
          <ClientForm client={editingClient} onClose={handleCloseForm} />
        ) : showPetForm ? (
          <PetForm clientId={selectedClientId} onClose={handleClosePetForm} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              {isAdmin() && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              )}
            </div>
            
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* O cabeçalho da tabela permanece o mesmo */}
                  <thead className="bg-gray-50">{/* ... */}</thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id}>
                          {/* As células da tabela permanecem as mesmas, mas sem getPetsByClientId */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.phone}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-1">{client.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* TODO: Lógica de contagem de pets precisa ser refeita com uma query separada se necessário */}
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="text-xs p-0 h-auto" 
                              onClick={() => handleAddPet(client.id)}
                            >
                              Adicionar Pet
                            </Button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEditClient(client)}
                                disabled={!isAdmin()} // Desabilitar em vez de apenas mostrar title
                                title={!isAdmin() ? "Apenas administradores podem editar" : ""}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteClient(client.id)}
                                disabled={!isAdmin() || deleteMutation.isPending} // Desabilitar durante a exclusão
                                title={!isAdmin() ? "Apenas administradores podem excluir" : ""}
                              >
                                {deleteMutation.isPending && deleteMutation.variables === client.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          {isLoading ? "Carregando..." : (searchQuery ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ClientsList;
