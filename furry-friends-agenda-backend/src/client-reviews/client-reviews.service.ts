import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

export interface CreateReviewDto {
  rating: number;
  comment?: string;
  isAnonymous?: boolean;
  appointmentId?: string;
  groomerId?: string;
}

@Injectable()
export class ClientReviewsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async createReview(clientId: string, reviewData: CreateReviewDto, user: JwtPayload) {
    // Validar rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new BadRequestException('Rating deve estar entre 1 e 5');
    }

    // Verificar se o cliente existe e pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: this.applyCompanyFilter({ id: clientId }, user, 'Client'),
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Se for avaliação de agendamento, verificar se pertence ao cliente
    if (reviewData.appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: this.applyCompanyFilter({
          id: reviewData.appointmentId,
          clientId,
        }, user, 'Appointment'),
      });

      if (!appointment) {
        throw new NotFoundException(
          'Agendamento não encontrado ou não pertence ao cliente',
        );
      }

      // Verificar se já existe avaliação para este agendamento
      const existingReview = await this.prisma.review.findFirst({
        where: this.applyCompanyFilter({ appointmentId: reviewData.appointmentId }, user, 'Review'),
      });

      if (existingReview) {
        throw new BadRequestException(
          'Já existe avaliação para este agendamento',
        );
      }
    }

    // Se for avaliação de tosador, verificar se existe
    if (reviewData.groomerId) {
      const groomer = await this.prisma.groomer.findUnique({
        where: this.applyCompanyFilter({ id: reviewData.groomerId }, user, 'Groomer'),
      });

      if (!groomer) {
        throw new NotFoundException('Tosador não encontrado');
      }
    }

    // Criar avaliação
    const review = await this.prisma.review.create({
      data: this.applyCompanyFilterToCreate({
        rating: reviewData.rating,
        comment: reviewData.comment,
        isAnonymous: reviewData.isAnonymous || false,
        clientId,
        appointmentId: reviewData.appointmentId,
        groomerId: reviewData.groomerId,
        isApproved: false, // Requer aprovação do admin
        isVisible: true,
      }, user, 'Review'),
      include: {
        client: {
          select: {
            name: true,
          },
        },
        appointment: {
          select: {
            pet: {
              select: {
                name: true,
              },
            },
          },
        },
        groomer: {
          select: {
            name: true,
          },
        },
      },
    });

    return review;
  }

  async getClientReviews(clientId: string, user: JwtPayload) {
    return this.prisma.review.findMany({
      where: this.applyCompanyFilter({ clientId }, user, 'Review'),
      include: {
        appointment: {
          select: {
            pet: {
              select: {
                name: true,
              },
            },
            dateTime: true,
          },
        },
        groomer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReviewById(reviewId: string, clientId: string, user: JwtPayload) {
    const review = await this.prisma.review.findFirst({
      where: this.applyCompanyFilter({
        id: reviewId,
        clientId,
      }, user, 'Review'),
      include: {
        appointment: {
          select: {
            pet: {
              select: {
                name: true,
              },
            },
          },
        },
        groomer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(
        'Avaliação não encontrada ou não pertence ao cliente',
      );
    }

    return review;
  }

  async updateReview(
    reviewId: string,
    clientId: string,
    updateData: Partial<CreateReviewDto>,
    user: JwtPayload,
  ) {
    // Verificar se a avaliação pertence ao cliente
    const existingReview = await this.prisma.review.findFirst({
      where: this.applyCompanyFilter({
        id: reviewId,
        clientId,
      }, user, 'Review'),
    });

    if (!existingReview) {
      throw new NotFoundException(
        'Avaliação não encontrada ou não pertence ao cliente',
      );
    }

    // Não permitir atualização se já foi aprovada
    if (existingReview.isApproved) {
      throw new BadRequestException(
        'Não é possível alterar avaliação já aprovada',
      );
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        client: {
          select: {
            name: true,
          },
        },
        appointment: {
          select: {
            pet: {
              select: {
                name: true,
              },
            },
          },
        },
        groomer: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async deleteReview(reviewId: string, clientId: string, user: JwtPayload) {
    // Verificar se a avaliação pertence ao cliente
    const existingReview = await this.prisma.review.findFirst({
      where: this.applyCompanyFilter({
        id: reviewId,
        clientId,
      }, user, 'Review'),
    });

    if (!existingReview) {
      throw new NotFoundException(
        'Avaliação não encontrada ou não pertence ao cliente',
      );
    }

    // Não permitir exclusão se já foi aprovada
    if (existingReview.isApproved) {
      throw new BadRequestException(
        'Não é possível excluir avaliação já aprovada',
      );
    }

    return this.prisma.review.delete({
      where: { id: reviewId },
    });
  }

  async getPublicReviews(groomerId?: string, user?: JwtPayload) {
    const whereClause: any = {
      isApproved: true,
      isVisible: true,
    };

    if (groomerId) {
      whereClause.groomerId = groomerId;
    }

    // Aplicar filtro de empresa se usuário estiver logado
    const whereWithCompany = user ? this.applyCompanyFilter(whereClause, user, 'Review') : whereClause;

    return this.prisma.review.findMany({
      where: whereWithCompany,
      include: {
        client: {
          select: {
            name: true,
          },
        },
        appointment: {
          select: {
            pet: {
              select: {
                name: true,
                species: true,
              },
            },
          },
        },
        groomer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAverageRating(groomerId?: string, user?: JwtPayload) {
    const whereClause: any = {
      isApproved: true,
      isVisible: true,
    };

    if (groomerId) {
      whereClause.groomerId = groomerId;
    }

    // Aplicar filtro de empresa se usuário estiver logado
    const whereWithCompany = user ? this.applyCompanyFilter(whereClause, user, 'Review') : whereClause;

    const result = await this.prisma.review.aggregate({
      where: whereWithCompany,
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }
}
