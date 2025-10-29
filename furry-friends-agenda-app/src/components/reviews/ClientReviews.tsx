import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';
import {
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Eye,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Flag,
  BarChart3,
  Users,
  Calendar,
  Heart,
  AlertCircle
} from 'lucide-react';

interface ClientReview {
  id: string;
  clientId: string;
  clientName: string;
  appointmentId: string;
  rating: number;
  title: string;
  comment: string;
  serviceType: string;
  groomerName?: string;
  isPublic: boolean;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  response?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  responseRate: number;
  pendingReviews: number;
  recentReviews: ClientReview[];
}

export function ClientReviews() {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ClientReview | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [responseText, setResponseText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // TODO: Implement API call
      const mockReviews: ClientReview[] = [
        {
          id: '1',
          clientId: 'client-1',
          clientName: 'João Silva',
          appointmentId: 'appt-1',
          rating: 5,
          title: 'Excelente atendimento!',
          comment: 'O Rex adorou o banho! Os profissionais foram muito cuidadosos e atenciosos. Recomendo demais!',
          serviceType: 'Banho e Tosa',
          groomerName: 'Maria Santos',
          isPublic: true,
          isVerified: true,
          status: 'approved' as const,
          response: 'Obrigada pelo feedback, João! Ficamos felizes que tenham gostado. Esperamos vê-los novamente em breve!',
          responseDate: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          helpful: 12,
          notHelpful: 1,
          tags: ['atendimento', 'qualidade', 'recomendado']
        },
        {
          id: '2',
          clientId: 'client-2',
          clientName: 'Ana Costa',
          appointmentId: 'appt-2',
          rating: 4,
          title: 'Bom serviço',
          comment: 'Serviço bom, mas demorou um pouco mais que o esperado. No geral, satisfeito.',
          serviceType: 'Banho',
          groomerName: 'Pedro Oliveira',
          isPublic: true,
          isVerified: true,
          status: 'approved' as const,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString(),
          helpful: 5,
          notHelpful: 0,
          tags: ['pontualidade']
        },
        {
          id: '3',
          clientId: 'client-3',
          clientName: 'Carlos Mendes',
          appointmentId: 'appt-3',
          rating: 2,
          title: 'Precisa melhorar',
          comment: 'O atendimento foi razoável, mas o local estava um pouco sujo e desorganizado.',
          serviceType: 'Tosa',
          groomerName: 'Ana Costa',
          isPublic: false,
          isVerified: true,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          helpful: 0,
          notHelpful: 2,
          tags: ['limpeza', 'organização']
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // TODO: Implement API call
      const mockStats: ReviewStats = {
        totalReviews: 156,
        averageRating: 4.2,
        ratingDistribution: { 1: 8, 2: 12, 3: 25, 4: 45, 5: 66 },
        responseRate: 78,
        pendingReviews: 3,
        recentReviews: []
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'hide' | 'show') => {
    try {
      // TODO: Implement API call
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          switch (action) {
            case 'approve':
              return { ...review, status: 'approved' as const };
            case 'reject':
              return { ...review, status: 'rejected' as const };
            case 'hide':
              return { ...review, isPublic: false };
            case 'show':
              return { ...review, isPublic: true };
            default:
              return review;
          }
        }
        return review;
      }));

      toast({
        title: "Sucesso",
        description: `Avaliação ${action === 'approve' ? 'aprovada' : action === 'reject' ? 'rejeitada' : action === 'hide' ? 'ocultada' : 'exibida'} com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação",
        variant: "destructive"
      });
    }
  };

  const handleRespondReview = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      // TODO: Implement API call
      setReviews(prev => prev.map(review =>
        review.id === selectedReview.id
          ? {
              ...review,
              response: responseText,
              responseDate: new Date().toISOString()
            }
          : review
      ));

      toast({
        title: "Sucesso",
        description: "Resposta enviada com sucesso",
      });

      setIsResponseDialogOpen(false);
      setResponseText('');
      setSelectedReview(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const getStatusBadge = (status: ClientReview['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeitada</Badge>;
      case 'hidden':
        return <Badge className="bg-gray-100 text-gray-800">Oculta</Badge>;
      default:
        return null;
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'pending' && review.status === 'pending') ||
                      (activeTab === 'approved' && review.status === 'approved') ||
                      (activeTab === 'rejected' && review.status === 'rejected');

    return matchesSearch && matchesRating && matchesStatus && matchesTab;
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
          <h1 className="text-3xl font-bold">Avaliações de Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie e responda às avaliações dos seus clientes
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  <p className="text-sm text-muted-foreground">Total de Avaliações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Reply className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.responseRate}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                  <p className="text-sm text-muted-foreground">Avaliações Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distribuição de Avaliações */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribuição de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar avaliações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estrelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as avaliações</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrelas</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 estrelas</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 estrelas</SelectItem>
                <SelectItem value="2">⭐⭐ 2 estrelas</SelectItem>
                <SelectItem value="1">⭐ 1 estrela</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
                <SelectItem value="hidden">Ocultas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e Tabela */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({reviews.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas ({reviews.filter(r => r.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitadas ({reviews.filter(r => r.status === 'rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.clientName}</p>
                          <p className="text-sm text-muted-foreground">{review.serviceType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {renderStars(review.rating)}
                          <p className="text-sm font-medium">{review.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{review.serviceType}</p>
                          {review.groomerName && (
                            <p className="text-xs text-muted-foreground">Tosador: {review.groomerName}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(review.status)}
                          {review.isPublic && (
                            <Badge variant="outline" className="text-xs">Pública</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedReview(review);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {review.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReviewAction(review.id, 'approve')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReviewAction(review.id, 'reject')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {!review.response && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedReview(review);
                                setIsResponseDialogOpen(true);
                              }}
                            >
                              <Reply className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReviewAction(review.id, review.isPublic ? 'hide' : 'show')}
                          >
                            <Flag className="w-4 h-4" />
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

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder Avaliação</DialogTitle>
            <DialogDescription>
              Responda à avaliação do cliente {selectedReview?.clientName}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedReview.rating)}
                </div>
                <h4 className="font-medium">{selectedReview.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedReview.comment}</p>
              </div>

              <div>
                <Label htmlFor="response">Sua Resposta</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Digite sua resposta para o cliente..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRespondReview} disabled={!responseText.trim()}>
              Enviar Resposta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="font-medium">{selectedReview.clientName}</p>
                </div>
                <div>
                  <Label>Data</Label>
                  <p className="font-medium">
                    {new Date(selectedReview.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label>Serviço</Label>
                  <p className="font-medium">{selectedReview.serviceType}</p>
                </div>
                <div>
                  <Label>Tosador</Label>
                  <p className="font-medium">{selectedReview.groomerName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label>Avaliação</Label>
                <div className="mt-1">
                  {renderStars(selectedReview.rating, 'md')}
                </div>
              </div>

              <div>
                <Label>Título</Label>
                <p className="font-medium">{selectedReview.title}</p>
              </div>

              <div>
                <Label>Comentário</Label>
                <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.response && (
                <div>
                  <Label>Sua Resposta</Label>
                  <p className="text-sm bg-blue-50 p-3 rounded mt-1">{selectedReview.response}</p>
                  {selectedReview.responseDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Respondido em {new Date(selectedReview.responseDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedReview.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Útil</Label>
                  <p className="font-medium text-green-600">{selectedReview.helpful}</p>
                </div>
                <div>
                  <Label>Não útil</Label>
                  <p className="font-medium text-red-600">{selectedReview.notHelpful}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}