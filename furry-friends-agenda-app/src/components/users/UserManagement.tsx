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
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'employee' | 'client';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
  department?: string;
  hireDate?: string;
  salary?: number;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: User['role'];
  department: string;
  hireDate: string;
  salary: number;
  permissions: string[];
}

const roles = [
  { value: 'admin', label: 'Administrador', color: 'bg-red-100 text-red-800' },
  { value: 'manager', label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
  { value: 'employee', label: 'Funcionário', color: 'bg-green-100 text-green-800' },
  { value: 'client', label: 'Cliente', color: 'bg-gray-100 text-gray-800' },
];

const departments = [
  'Administração',
  'Atendimento',
  'Financeiro',
  'Marketing',
  'Operações',
  'Recursos Humanos',
  'TI',
  'Vendas'
];

const availablePermissions = [
  'users.read',
  'users.write',
  'users.delete',
  'appointments.read',
  'appointments.write',
  'appointments.delete',
  'financial.read',
  'financial.write',
  'reports.read',
  'reports.write',
  'settings.read',
  'settings.write',
  'plugins.read',
  'plugins.write',
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<User['role']>('employee');
  const { toast } = useToast();

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: '',
    hireDate: '',
    salary: 0,
    permissions: [],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Implement API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@furryfriends.com.br',
          phone: '(11) 99999-9999',
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ['users.read', 'users.write', 'financial.read', 'reports.read'],
          department: 'Administração',
          hireDate: '2023-01-15',
          salary: 5000,
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@furryfriends.com.br',
          phone: '(11) 88888-8888',
          role: 'manager',
          status: 'active',
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ['appointments.read', 'appointments.write', 'users.read'],
          department: 'Operações',
          hireDate: '2023-03-01',
          salary: 3500,
        },
        {
          id: '3',
          name: 'Pedro Oliveira',
          email: 'pedro@furryfriends.com.br',
          role: 'employee',
          status: 'active',
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ['appointments.read', 'appointments.write'],
          department: 'Atendimento',
          hireDate: '2023-06-01',
          salary: 2500,
        },
        {
          id: '4',
          name: 'Ana Costa',
          email: 'ana@furryfriends.com.br',
          role: 'employee',
          status: 'pending',
          createdAt: new Date().toISOString(),
          permissions: [],
          department: 'Atendimento',
          hireDate: '2024-01-01',
          salary: 2200,
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'employee',
      department: '',
      hireDate: '',
      salary: 0,
      permissions: [],
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department || '',
      hireDate: user.hireDate || '',
      salary: user.salary || 0,
      permissions: user.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!formData.name || !formData.email) {
        toast({
          title: "Erro",
          description: "Nome e e-mail são obrigatórios",
          variant: "destructive"
        });
        return;
      }

      // TODO: Implement API call
      const newUser: User = {
        id: selectedUser?.id || Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: selectedUser?.status || 'pending',
        createdAt: selectedUser?.createdAt || new Date().toISOString(),
        permissions: formData.permissions,
        department: formData.department,
        hireDate: formData.hireDate,
        salary: formData.salary,
      };

      if (selectedUser) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? newUser : u));
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      } else {
        setUsers(prev => [...prev, newUser]);
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o usuário",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Implement API call
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      // TODO: Implement API call
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      ));

      toast({
        title: "Sucesso",
        description: `Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário",
        variant: "destructive"
      });
    }
  };

  const handleInviteUser = async () => {
    try {
      if (!inviteEmail) {
        toast({
          title: "Erro",
          description: "E-mail é obrigatório",
          variant: "destructive"
        });
        return;
      }

      // TODO: Implement API call
      const newUser: User = {
        id: Date.now().toString(),
        name: '',
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        createdAt: new Date().toISOString(),
        permissions: [],
      };

      setUsers(prev => [...prev, newUser]);
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('employee');

      toast({
        title: "Sucesso",
        description: "Convite enviado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'active' && user.status === 'active') ||
                      (activeTab === 'pending' && user.status === 'pending') ||
                      (activeTab === 'inactive' && user.status === 'inactive');

    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    inactive: users.filter(u => u.status === 'inactive').length,
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
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e acessos do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Convidar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Envie um convite por e-mail para um novo usuário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteEmail">E-mail</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="inviteRole">Função</Label>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as User['role'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleInviteUser}>
                    Enviar Convite
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleCreateUser}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.active}</p>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.pending}</p>
                <p className="text-sm text-muted-foreground">Convites Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.inactive}</p>
                <p className="text-sm text-muted-foreground">Usuários Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e Tabela */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({userStats.total})</TabsTrigger>
          <TabsTrigger value="active">Ativos ({userStats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({userStats.pending})</TabsTrigger>
          <TabsTrigger value="inactive">Inativos ({userStats.inactive})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roles.find(r => r.value === user.role)?.color}>
                          {roles.find(r => r.value === user.role)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span>{getStatusText(user.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <span className="text-sm">
                            {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {user.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(user.id, 'inactive')}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : user.status === 'inactive' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          ) : null}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              Configure as informações do usuário e suas permissões
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="hireDate">Data de Contratação</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="salary">Salário (R$)</Label>
                <Input
                  id="salary"
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <Label>Permissões</Label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission]
                            : formData.permissions.filter(p => p !== permission);
                          setFormData(prev => ({ ...prev, permissions: newPermissions }));
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {selectedUser ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}