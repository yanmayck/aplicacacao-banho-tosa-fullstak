import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { ServiceRanking } from '../../context/reports/ReportsContext';

interface ServiceRankingViewProps {
  data: ServiceRanking[];
}

export function ServiceRankingView({ data }: ServiceRankingViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 6).map((service, index) => (
          <Card key={service.serviceId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">#{index + 1}</CardTitle>
                <Badge variant={service.trend === 'up' ? 'default' : service.trend === 'down' ? 'destructive' : 'secondary'}>
                  {service.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {service.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                  {service.trend === 'up' ? '+' : service.trend === 'down' ? '' : ''}
                  {service.growthRate.toFixed(1)}%
                </Badge>
              </div>
              <CardTitle className="text-base">{service.serviceName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {service.totalBookings}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Agendamentos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(service.totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receita
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {service.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Popularidade: {service.popularityScore.toFixed(0)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}