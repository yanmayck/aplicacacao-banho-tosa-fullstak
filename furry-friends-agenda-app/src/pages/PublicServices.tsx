import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';
// Criar instância separada para APIs públicas (sem token)
import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
});

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMin: number;
}

const PublicServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await publicApi.get('/public/services');
        setServices(response.data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando serviços...</p>
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
              <Star className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Nossos Serviços</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Voltar ao início
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Serviços Disponíveis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça todos os serviços que oferecemos para cuidar do seu pet com qualidade e carinho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <Badge variant="secondary">
                      <Star className="h-4 w-4 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  {service.description && (
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{service.durationMin} min</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Serviço
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhum serviço disponível no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para agendar um serviço?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta e tenha acesso a todos os nossos serviços exclusivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/register'}
            >
              Criar conta
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/login'}
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicServices;