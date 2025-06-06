
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore, Groomer } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, Activity, Award } from "lucide-react";
import GroomerForm from "./GroomerForm";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const GroomersList: React.FC = () => {
  const { groomers, deleteGroomer, getGroomerWorkload, getGroomerMonthlyPoints } = useStore();
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showPointsDialog, setShowPointsDialog] = useState(false);
  const [editingGroomer, setEditingGroomer] = useState<Groomer | undefined>(undefined);
  
  const handleEditGroomer = (groomer: Groomer) => {
    setEditingGroomer(groomer);
    setShowForm(true);
  };

  const handleEditStatus = (groomer: Groomer) => {
    setEditingGroomer(groomer);
    setShowStatusForm(true);
  };
  
  const handleDeleteGroomer = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este tosador?")) {
      deleteGroomer(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setShowStatusForm(false);
    setEditingGroomer(undefined);
  };

  const handleShowPoints = () => {
    setShowPointsDialog(true);
  };

  const formatCommission = (percentage: number): string => {
    return `${percentage}%`;
  };
  
  return (
    <Layout activePage="groomers" setActivePage={() => {}}>
      <div className="space-y-4">
        {showForm ? (
          <GroomerForm groomer={editingGroomer} onClose={handleCloseForm} />
        ) : showStatusForm ? (
          <GroomerForm groomer={editingGroomer} onClose={handleCloseForm} showStatusOnly={true} />
        ) : (
          <>
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Tosadores</h1>
              <div className="space-x-2">
                <Button 
                  onClick={handleShowPoints}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Ver Pontuações
                </Button>
                
                {isAdmin() && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Tosador
                  </Button>
                )}
              </div>
            </div>
            
            {groomers.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Activity className="h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-medium">Nenhum tosador cadastrado</h3>
                  <p className="text-sm text-gray-500">
                    {isAdmin()
                      ? "Clique em 'Novo Tosador' para adicionar."
                      : "Não há tosadores cadastrados no sistema."}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groomers.map(groomer => {
                  const workload = getGroomerWorkload(groomer.id, false);
                  const monthlyPoints = getGroomerMonthlyPoints(groomer.id);
                  
                  return (
                    <Card key={groomer.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{groomer.name}</h3>
                          <Badge
                            variant={groomer.status === "available" ? "outline" : "secondary"}
                            className={
                              groomer.status === "available" 
                                ? "bg-green-50 text-green-700 hover:bg-green-50" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {groomer.status === "available" ? "Disponível" : "Ocupado"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {isAdmin() && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Comissão:</span>
                              <span className="font-medium">{formatCommission(groomer.commissionPercentage)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Carga de trabalho:</span>
                            <span className="font-medium">{workload} agendamentos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Pontos (mês atual):</span>
                            <span className="font-medium">{monthlyPoints} pontos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-2 border-t flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditStatus(groomer)}
                        >
                          Alterar Status
                        </Button>
                        
                        {isAdmin() && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEditGroomer(groomer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteGroomer(groomer.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {/* Points Dialog */}
        <Dialog open={showPointsDialog} onOpenChange={setShowPointsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Pontuação dos Tosadores - {format(new Date(), 'MMMM yyyy', { locale: ptBR })}</DialogTitle>
            </DialogHeader>
            
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tosador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos do Mês</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviços Realizados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média de Pontos/Serviço</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groomers.map(groomer => {
                    const points = getGroomerMonthlyPoints(groomer.id);
                    const services = getGroomerWorkload(groomer.id, true);
                    const average = services > 0 ? (points / services).toFixed(1) : "0";
                    
                    return (
                      <tr key={groomer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{groomer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{points}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{services}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{average}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default GroomersList;
