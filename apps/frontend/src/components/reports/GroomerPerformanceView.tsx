import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Star, TrendingUp } from 'lucide-react';
import { GroomerPerformance } from '../../context/reports/ReportsContext';

interface GroomerPerformanceViewProps {
  data: GroomerPerformance[];
}

export function GroomerPerformanceView({ data }: GroomerPerformanceViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((groomer) => (
          <Card key={groomer.groomerId}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {groomer.groomerName}
              </CardTitle>
              <CardDescription>
                Performance individual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {groomer.totalAppointments}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Agendamentos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(groomer.totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receita
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eficiência</span>
                  <Badge variant={groomer.efficiency >= 80 ? "default" : "secondary"}>
                    {groomer.efficiency.toFixed(1)}%
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Avaliação Média</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {groomer.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Comissões</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(groomer.totalCommissions)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Serviços Mais Realizados</h4>
                <div className="space-y-1">
                  {groomer.topServices.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{service.label}</span>
                      <span className="font-medium">{service.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}