import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Users,
  Settings,
  Save,
  Upload,
  Camera,
  Globe,
  Shield,
  Bell,
  Palette
} from 'lucide-react';

interface CompanySettings {
  // Informações básicas
  name: string;
  description: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;

  // Endereço
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Horário de funcionamento
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  // Configurações financeiras
  currency: string;
  timezone: string;
  taxRate: number;
  defaultPaymentTerms: number;

  // Configurações de negócio
  maxAppointmentsPerDay: number;
  appointmentDuration: number;
  allowOnlineBooking: boolean;
  requireApproval: boolean;
  cancellationPolicy: string;

  // Notificações
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  reminderHours: number;

  // Aparência
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;

  // Redes sociais
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };

  // Configurações avançadas
  maintenanceMode: boolean;
  debugMode: boolean;
  apiRateLimit: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const timezones = [
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
];

const currencies = [
  { value: 'BRL', label: 'Real Brasileiro (R$)' },
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function CompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    description: '',
    cnpj: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    },
    businessHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '12:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    },
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    taxRate: 0,
    defaultPaymentTerms: 30,
    maxAppointmentsPerDay: 20,
    appointmentDuration: 60,
    allowOnlineBooking: true,
    requireApproval: false,
    cancellationPolicy: '',
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    reminderHours: 24,
    primaryColor: '#9b87f5',
    secondaryColor: '#f59e0b',
    logoUrl: '',
    faviconUrl: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    backupFrequency: 'daily'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Implement API call
      const mockSettings: Partial<CompanySettings> = {
        name: 'Furry Friends Pet Shop',
        description: 'O melhor cuidado para seu pet',
        cnpj: '12.345.678/0001-90',
        email: 'contato@furryfriends.com.br',
        phone: '(11) 99999-9999',
        website: 'https://furryfriends.com.br',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Sala 101',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        }
      };

      setSettings(prev => ({ ...prev, ...mockSettings }));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement API call
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (field: 'logoUrl' | 'faviconUrl') => {
    // TODO: Implement file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Mock URL for demonstration
        const mockUrl = URL.createObjectURL(file);
        setSettings(prev => ({ ...prev, [field]: mockUrl }));
      }
    };
    input.click();
  };

  const updateBusinessHour = (day: keyof CompanySettings['businessHours'], field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const updateAddress = (field: keyof CompanySettings['address'], value: string) => {
    setSettings(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const updateSocialMedia = (platform: keyof CompanySettings['socialMedia'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

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
          <h1 className="text-3xl font-bold">Configurações da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie todas as configurações do seu negócio
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="business">Negócio</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Informações Básicas */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Dados principais da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={settings.cnpj}
                    onChange={(e) => setSettings(prev => ({ ...prev, cnpj: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="https://facebook.com/suaempresa"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="https://instagram.com/suaempresa"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="https://twitter.com/suaempresa"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={settings.socialMedia.youtube}
                    onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                    placeholder="https://youtube.com/channel/suaempresa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endereço */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={settings.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={settings.address.number}
                    onChange={(e) => updateAddress('number', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={settings.address.complement}
                    onChange={(e) => updateAddress('complement', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={settings.address.neighborhood}
                    onChange={(e) => updateAddress('neighborhood', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={settings.address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={settings.address.state}
                    onValueChange={(value) => updateAddress('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={settings.address.zipCode}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Horários de Funcionamento */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!hours.closed}
                        onCheckedChange={(checked) => updateBusinessHour(day as keyof CompanySettings['businessHours'], 'closed', !checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {hours.closed ? 'Fechado' : 'Aberto'}
                      </span>
                    </div>
                    {!hours.closed && (
                      <>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateBusinessHour(day as keyof CompanySettings['businessHours'], 'open', e.target.value)}
                          className="w-32"
                        />
                        <span>às</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateBusinessHour(day as keyof CompanySettings['businessHours'], 'close', e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Negócio */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxAppointments">Máximo de Agendamentos por Dia</Label>
                  <Input
                    id="maxAppointments"
                    type="number"
                    value={settings.maxAppointmentsPerDay}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxAppointmentsPerDay: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="appointmentDuration">Duração Padrão (minutos)</Label>
                  <Input
                    id="appointmentDuration"
                    type="number"
                    value={settings.appointmentDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, appointmentDuration: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Prazo de Pagamento Padrão (dias)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    value={settings.defaultPaymentTerms}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultPaymentTerms: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Agendamento Online</Label>
                    <p className="text-sm text-muted-foreground">Permitir que clientes façam agendamentos online</p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineBooking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowOnlineBooking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Aprovação Necessária</Label>
                    <p className="text-sm text-muted-foreground">Requer aprovação manual para novos agendamentos</p>
                  </div>
                  <Switch
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireApproval: checked }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cancellationPolicy">Política de Cancelamento</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={settings.cancellationPolicy}
                  onChange={(e) => setSettings(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                  rows={3}
                  placeholder="Descreva a política de cancelamento..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>E-mail</Label>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS</Label>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>WhatsApp</Label>
                  <Switch
                    checked={settings.whatsappNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, whatsappNotifications: checked }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reminderHours">Horas para Lembrete</Label>
                <Input
                  id="reminderHours"
                  type="number"
                  value={settings.reminderHours}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderHours: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Logo</Label>
                  <div className="flex items-center gap-2">
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                    )}
                    <Button variant="outline" onClick={() => handleFileUpload('logoUrl')}>
                      <Camera className="w-4 h-4 mr-2" />
                      {settings.logoUrl ? 'Alterar' : 'Upload'}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-2">
                    {settings.faviconUrl && (
                      <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain border rounded" />
                    )}
                    <Button variant="outline" onClick={() => handleFileUpload('faviconUrl')}>
                      <Camera className="w-4 h-4 mr-2" />
                      {settings.faviconUrl ? 'Alterar' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Avançadas */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="apiRateLimit">Limite de API (requisições/minuto)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value as 'daily' | 'weekly' | 'monthly' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Ativar modo de manutenção do sistema</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Debug</Label>
                    <p className="text-sm text-muted-foreground">Habilitar logs detalhados para desenvolvimento</p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, debugMode: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}