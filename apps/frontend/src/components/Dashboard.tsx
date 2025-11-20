
import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Users, PawPrint, Scissors, DollarSign, AlertCircle, BarChart } from 'lucide-react';

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>

    <Card className="p-4">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </Card>
  </div>
);

const Dashboard: React.FC = () => {
  const { appointments, groomers, clients, pets, commissions } = useStore();
  const { user, isAdmin } = useAuth();

  const isLoading = !appointments || !groomers || !clients || !pets || !commissions;

  const stats = useMemo(() => ({
    clients: clients.length,
    pets: pets.length,
    groomers: groomers.length,
    appointmentsToday: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length,
  }), [clients, pets, groomers, appointments]);

  const formatCurrency = useCallback((value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, []);

  const totalCurrentMonthCommissions = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return commissions
      .filter(commission => {
        const commissionDate = new Date(commission.date);
        return commissionDate.getMonth() === currentMonth && commissionDate.getFullYear() === currentYear;
      })
      .reduce((sum, commission) => sum + commission.value, 0);
  }, [commissions]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name || user?.email}!</h1>
        <p className="text-muted-foreground">
          Aqui está um resumo do seu pet shop hoje.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <p className="text-xs text-muted-foreground">clientes ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pets}</div>
            <p className="text-xs text-muted-foreground">pets cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">serviços para hoje</p>
          </CardContent>
        </Card>
        {isAdmin() && (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comissões (Mês)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCurrentMonthCommissions)}</div>
                <p className="text-xs text-muted-foreground">total de comissões</p>
            </CardContent>
            </Card>
        )}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle /> Dica Rápida</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Use a barra de navegação à esquerda para acessar todas as funcionalidades do sistema. Comece cadastrando seus clientes e pets!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(Dashboard);
