import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';
import {
  Upload,
  Download,
  Play,
  Square,
  Settings,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  Zap,
  Shield,
  Activity
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: 'active' | 'inactive' | 'error' | 'loading';
  type: 'notification' | 'payment' | 'integration' | 'automation' | 'analytics' | 'other';
  permissions: string[];
  hooks: string[];
  dependencies: string[];
  installedAt: string;
  lastUpdated: string;
  config?: Record<string, any>;
}

interface PluginMarketplaceItem {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  type: 'notification' | 'payment' | 'integration' | 'automation' | 'analytics' | 'other';
  rating: number;
  downloads: number;
  price: number;
  tags: string[];
  screenshots?: string[];
}

export function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [marketplacePlugins, setMarketplacePlugins] = useState<PluginMarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);
  const [selectedMarketplacePlugin, setSelectedMarketplacePlugin] = useState<PluginMarketplaceItem | null>(null);
  const [activeTab, setActiveTab] = useState('installed');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadPlugins();
    loadMarketplacePlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      // TODO: Implement API call
      const mockPlugins: Plugin[] = [
        {
          id: '1',
          name: 'WhatsApp Notifications',
          version: '1.2.0',
          description: 'Envio automático de notificações via WhatsApp',
          author: 'Furry Friends Team',
          status: 'active',
          type: 'notification',
          permissions: ['notifications.send', 'contacts.read'],
          hooks: ['appointment.created', 'appointment.updated'],
          dependencies: [],
          installedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          config: {
            apiKey: '****',
            phoneNumber: '+5511999999999'
          }
        },
        {
          id: '2',
          name: 'Stripe Payment Gateway',
          version: '2.1.0',
          description: 'Integração com gateway de pagamentos Stripe',
          author: 'Payment Integrations Inc',
          status: 'active',
          type: 'payment',
          permissions: ['payments.process', 'transactions.create'],
          hooks: ['payment.initiated', 'payment.completed'],
          dependencies: ['stripe-sdk'],
          installedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Google Calendar Sync',
          version: '1.0.5',
          description: 'Sincronização automática com Google Calendar',
          author: 'Calendar Integrations',
          status: 'inactive',
          type: 'integration',
          permissions: ['calendar.read', 'calendar.write'],
          hooks: ['appointment.created', 'appointment.updated'],
          dependencies: ['google-calendar-api'],
          installedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }
      ];
      setPlugins(mockPlugins);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os plugins",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarketplacePlugins = async () => {
    try {
      // TODO: Implement API call
      const mockMarketplace: PluginMarketplaceItem[] = [
        {
          id: 'market-1',
          name: 'SMS Notifications Pro',
          version: '1.5.0',
          description: 'Sistema avançado de notificações SMS com templates personalizáveis',
          author: 'SMS Pro Solutions',
          type: 'notification',
          rating: 4.8,
          downloads: 1250,
          price: 29.99,
          tags: ['sms', 'notifications', 'templates']
        },
        {
          id: 'market-2',
          name: 'Mercado Pago Integration',
          version: '1.3.0',
          description: 'Integração completa com Mercado Pago para pagamentos no Brasil',
          author: 'Latin Payments',
          type: 'payment',
          rating: 4.6,
          downloads: 890,
          price: 49.99,
          tags: ['mercado-pago', 'payments', 'brazil']
        },
        {
          id: 'market-3',
          name: 'Pet Health Tracker',
          version: '2.0.0',
          description: 'Sistema de acompanhamento da saúde dos pets com lembretes automáticos',
          author: 'VetTech Solutions',
          type: 'automation',
          rating: 4.9,
          downloads: 2100,
          price: 79.99,
          tags: ['health', 'reminders', 'automation']
        }
      ];
      setMarketplacePlugins(mockMarketplace);
    } catch (error) {
      console.error('Erro ao carregar marketplace:', error);
    }
  };

  const handlePluginAction = async (pluginId: string, action: 'start' | 'stop' | 'restart' | 'uninstall') => {
    try {
      // TODO: Implement API call
      setPlugins(prev => prev.map(plugin =>
        plugin.id === pluginId
          ? { ...plugin, status: action === 'start' ? 'active' : action === 'stop' ? 'inactive' : plugin.status }
          : plugin
      ));

      toast({
        title: "Sucesso",
        description: `Plugin ${action === 'start' ? 'iniciado' : action === 'stop' ? 'parado' : 'reiniciado'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível ${action} o plugin`,
        variant: "destructive"
      });
    }
  };

  const handleInstallPlugin = async (marketplacePlugin: PluginMarketplaceItem) => {
    try {
      // TODO: Implement API call
      const newPlugin: Plugin = {
        id: Date.now().toString(),
        name: marketplacePlugin.name,
        version: marketplacePlugin.version,
        description: marketplacePlugin.description,
        author: marketplacePlugin.author,
        status: 'loading',
        type: marketplacePlugin.type,
        permissions: [],
        hooks: [],
        dependencies: [],
        installedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      setPlugins(prev => [...prev, newPlugin]);
      setIsInstallDialogOpen(false);

      // Simulate installation delay
      setTimeout(() => {
        setPlugins(prev => prev.map(p =>
          p.id === newPlugin.id ? { ...p, status: 'active' } : p
        ));
        toast({
          title: "Sucesso",
          description: "Plugin instalado com sucesso",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível instalar o plugin",
        variant: "destructive"
      });
    }
  };

  const handleUpdateConfig = async (pluginId: string, config: Record<string, any>) => {
    try {
      // TODO: Implement API call
      setPlugins(prev => prev.map(plugin =>
        plugin.id === pluginId ? { ...plugin, config } : plugin
      ));

      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso",
      });
      setIsConfigDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a configuração",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: Plugin['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Plugin['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'error':
        return 'Erro';
      case 'loading':
        return 'Carregando';
      default:
        return status;
    }
  };

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || plugin.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredMarketplace = marketplacePlugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || plugin.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Plugins</h1>
          <p className="text-muted-foreground">
            Gerencie plugins instalados e explore novos recursos no marketplace
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Manual
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar plugins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="notification">Notificações</SelectItem>
                <SelectItem value="payment">Pagamentos</SelectItem>
                <SelectItem value="integration">Integrações</SelectItem>
                <SelectItem value="automation">Automação</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Instalados ({plugins.length})</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace ({marketplacePlugins.length})</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Plugins Instalados */}
        <TabsContent value="installed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map((plugin) => (
              <Card key={plugin.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(plugin.status)}
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    </div>
                    <Badge variant={plugin.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusText(plugin.status)}
                    </Badge>
                  </div>
                  <CardDescription>{plugin.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Versão:</span>
                      <span>{plugin.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Autor:</span>
                      <span>{plugin.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="outline">{plugin.type}</Badge>
                    </div>

                    <div className="flex gap-1 pt-2">
                      {plugin.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePluginAction(plugin.id, 'stop')}
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePluginAction(plugin.id, 'start')}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPlugin(plugin);
                          setIsConfigDialogOpen(true);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePluginAction(plugin.id, 'restart')}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePluginAction(plugin.id, 'uninstall')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Marketplace */}
        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketplace.map((plugin) => (
              <Card key={plugin.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{plugin.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{plugin.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Versão:</span>
                      <span>{plugin.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span>{plugin.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Preço:</span>
                      <span className="font-medium">
                        {plugin.price === 0 ? 'Grátis' : `R$ ${plugin.price.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {plugin.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedMarketplacePlugin(plugin);
                        setIsInstallDialogOpen(true);
                      }}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {plugin.price === 0 ? 'Instalar Grátis' : 'Comprar e Instalar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Plugins Ativos:</span>
                  <Badge>{plugins.filter(p => p.status === 'active').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plugins Inativos:</span>
                  <Badge variant="secondary">{plugins.filter(p => p.status === 'inactive').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plugins com Erro:</span>
                  <Badge variant="destructive">{plugins.filter(p => p.status === 'error').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total de Plugins:</span>
                  <Badge variant="outline">{plugins.length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Todos os plugins são verificados quanto à segurança antes da instalação.
                  Plugins de terceiros são executados em sandbox isolado.
                </div>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Verificar Segurança
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Config Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurar Plugin</DialogTitle>
            <DialogDescription>
              Configure as opções do plugin {selectedPlugin?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedPlugin && (
            <div className="space-y-4">
              <div>
                <Label>Configurações</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(selectedPlugin.config || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Label className="w-32">{key}:</Label>
                      <Input
                        value={String(value)}
                        onChange={(e) => {
                          const newConfig = { ...selectedPlugin.config, [key]: e.target.value };
                          setSelectedPlugin({ ...selectedPlugin, config: newConfig });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Permissões</Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPlugin.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Hooks</Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPlugin.hooks.map((hook) => (
                    <Badge key={hook} variant="secondary">
                      {hook}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => selectedPlugin && handleUpdateConfig(selectedPlugin.id, selectedPlugin.config || {})}>
              Salvar Configuração
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Install Dialog */}
      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar Plugin</DialogTitle>
            <DialogDescription>
              Deseja instalar o plugin {selectedMarketplacePlugin?.name}?
            </DialogDescription>
          </DialogHeader>

          {selectedMarketplacePlugin && (
            <div className="space-y-4">
              <div>
                <Label>Detalhes do Plugin</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div>Versão: {selectedMarketplacePlugin.version}</div>
                  <div>Autor: {selectedMarketplacePlugin.author}</div>
                  <div>Avaliação: {selectedMarketplacePlugin.rating} ⭐</div>
                  <div>Downloads: {selectedMarketplacePlugin.downloads.toLocaleString()}</div>
                  <div>Preço: {selectedMarketplacePlugin.price === 0 ? 'Grátis' : `R$ ${selectedMarketplacePlugin.price.toFixed(2)}`}</div>
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedMarketplacePlugin.description}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInstallDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => selectedMarketplacePlugin && handleInstallPlugin(selectedMarketplacePlugin)}>
              <Download className="w-4 h-4 mr-2" />
              Instalar Plugin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}