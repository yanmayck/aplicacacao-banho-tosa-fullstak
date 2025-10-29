import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../ui/use-toast';
import { FileText, Plus, Edit, Trash2, Eye, Send, Copy, Settings } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const templateTypes = [
  { value: 'email', label: 'E-mail', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '📱' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'push', label: 'Push Notification', icon: '🔔' },
];

const availableVariables = [
  '{cliente_nome}',
  '{cliente_telefone}',
  '{pet_nome}',
  '{servico_nome}',
  '{data_agendamento}',
  '{hora_agendamento}',
  '{tosador_nome}',
  '{valor_servico}',
  '{empresa_nome}',
  '{empresa_telefone}',
  '{empresa_endereco}',
];

export function NotificationTemplates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as NotificationTemplate['type'],
    subject: '',
    content: '',
    variables: [] as string[],
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // TODO: Implement API call
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Confirmação de Agendamento',
          type: 'email',
          subject: 'Confirmação de Agendamento - {empresa_nome}',
          content: 'Olá {cliente_nome},\n\nSeu agendamento foi confirmado!\n\nDetalhes:\nPet: {pet_nome}\nServiço: {servico_nome}\nData: {data_agendamento}\nHorário: {hora_agendamento}\nTosador: {tosador_nome}\n\nValor: R$ {valor_servico}\n\nAtenciosamente,\n{empresa_nome}',
          variables: ['cliente_nome', 'pet_nome', 'servico_nome', 'data_agendamento', 'hora_agendamento', 'tosador_nome', 'valor_servico', 'empresa_nome'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Lembrete de Agendamento',
          type: 'whatsapp',
          content: 'Olá {cliente_nome}! 😊\n\nLembrando que você tem um agendamento amanhã:\n\n🐾 Pet: {pet_nome}\n✂️ Serviço: {servico_nome}\n📅 Data: {data_agendamento}\n🕐 Horário: {hora_agendamento}\n💇‍♀️ Tosador: {tosador_nome}\n\nEstamos ansiosos para receber vocês!\n\n{empresa_nome}',
          variables: ['cliente_nome', 'pet_nome', 'servico_nome', 'data_agendamento', 'hora_agendamento', 'tosador_nome', 'empresa_nome'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setTemplates(mockTemplates);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      variables: [],
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject || '',
      content: template.content,
      variables: template.variables,
      isActive: template.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (!formData.name || !formData.content) {
        toast({
          title: "Erro",
          description: "Nome e conteúdo são obrigatórios",
          variant: "destructive"
        });
        return;
      }

      // TODO: Implement API call
      const newTemplate: NotificationTemplate = {
        id: selectedTemplate?.id || Date.now().toString(),
        name: formData.name,
        type: formData.type,
        subject: formData.subject,
        content: formData.content,
        variables: formData.variables,
        isActive: formData.isActive,
        createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedTemplate) {
        setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? newTemplate : t));
        toast({
          title: "Sucesso",
          description: "Template atualizado com sucesso",
        });
      } else {
        setTemplates(prev => [...prev, newTemplate]);
        toast({
          title: "Sucesso",
          description: "Template criado com sucesso",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      // TODO: Implement API call
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Sucesso",
        description: "Template excluído com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o template",
        variant: "destructive"
      });
    }
  };

  const handlePreviewTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
    toast({
      title: "Sucesso",
      description: "Template duplicado com sucesso",
    });
  };

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + variable
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
          <h1 className="text-3xl font-bold">Templates de Notificação</h1>
          <p className="text-muted-foreground">
            Gerencie templates para e-mails, SMS, WhatsApp e notificações push
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const typeInfo = templateTypes.find(t => t.value === template.type);
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeInfo?.icon}</span>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <CardDescription>{typeInfo?.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {template.subject && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assunto:</p>
                      <p className="text-sm truncate">{template.subject}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conteúdo:</p>
                    <p className="text-sm line-clamp-3">{template.content}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
            <DialogDescription>
              Configure o template de notificação com variáveis dinâmicas
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Confirmação de Agendamento"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Notificação</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, type: value as NotificationTemplate['type'] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'email' && (
                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Assunto do e-mail"
                  />
                </div>
              )}

              <div>
                <Label>Variáveis Disponíveis</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      size="sm"
                      variant="outline"
                      onClick={() => insertVariable(variable)}
                      className="text-xs"
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite o conteúdo da notificação..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <Label htmlFor="isActive">Template ativo</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>
              {selectedTemplate ? 'Atualizar' : 'Criar'} Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Template</DialogTitle>
            <DialogDescription>
              Visualização do template com dados de exemplo
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Nome:</Label>
                <p className="font-medium">{selectedTemplate.name}</p>
              </div>

              {selectedTemplate.subject && (
                <div>
                  <Label>Assunto:</Label>
                  <p className="font-medium">{selectedTemplate.subject}</p>
                </div>
              )}

              <div>
                <Label>Conteúdo:</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap font-mono text-sm">
                  {selectedTemplate.content}
                </div>
              </div>

              <div>
                <Label>Variáveis utilizadas:</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}