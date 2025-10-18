import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Calendar,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Bell,
  TrendingUp
} from 'lucide-react';

// Criar instância separada para APIs públicas (sem token)
import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const clientApi = axios.create({
  baseURL: getApiBaseUrl(),
});

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
}

interface Appointment {
  id: string;
  dateTime: string;
  status: string;
  totalPrice: number;
  pet: Pet;
}

const ClientDashboard: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Obter dados do cliente do localStorage (após login)
        const clientData = localStorage.getItem('client-data');
        if (clientData) {
          const parsedClient = JSON.parse(clientData);
          setClient(parsedClient);

          // Buscar agendamentos do cliente
          const appointmentsResponse = await clientApi.get(`/client/appointments`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('client-token')}`
            }
          });
          setAppointments(appointmentsResponse.data);

          // Buscar pets do cliente
          const petsResponse = await clientApi.get(`/client/pets`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('client-token')}`
            }
          });
          setPets(petsResponse.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.dateTime) > new Date() && apt.status !== 'CANCELLED')
    .slice(0, 3);

  const recentAppointments = appointments
    .filter(apt => apt.status === 'COMPLETED')
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Meu Painel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {client?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Gerencie seus pets, agendamentos e acompanhe a saúde dos seus animais
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pets</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                Pets cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Agendamentos futuros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços Realizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacinas em Dia</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                Controle de saúde
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximos Agendamentos
              </CardTitle>
              <CardDescription>
                Seus próximos compromissos agendados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{appointment.pet.name}</h4>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.dateTime).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(appointment.dateTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          R$ {appointment.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Ver todos os agendamentos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum agendamento próximo</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Serviço
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Meus Pets
              </CardTitle>
              <CardDescription>
                Gerencie os dados e saúde dos seus animais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pets.length > 0 ? (
                <div className="space-y-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{pet.name}</h4>
                        <p className="text-sm text-gray-600">
                          {pet.species} • {pet.breed || 'Raça não especificada'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Saúde
                        </Button>
                        <Button size="sm">
                          Agendar
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum pet cadastrado</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Pet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Serviços Recentes */}
        {recentAppointments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Serviços Recentes
              </CardTitle>
              <CardDescription>
                Histórico dos últimos serviços realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{appointment.pet.name}</h4>
                        <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.dateTime).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {appointment.totalPrice.toFixed(2)}</p>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Agendar Serviço
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Adicionar Pet
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Heart className="h-6 w-6 mb-2" />
                Controle de Saúde
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;