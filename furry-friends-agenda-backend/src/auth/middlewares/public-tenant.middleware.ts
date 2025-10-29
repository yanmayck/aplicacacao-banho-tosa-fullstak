import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicTenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;

    if (!host) {
      throw new NotFoundException('Host header não encontrado');
    }

    // Extrair subdomínio do host
    const subdomain = this.extractSubdomain(host);

    if (!subdomain) {
      // Se não há subdomínio, permitir acesso ao portal público genérico
      req.tenant = null;
      return next();
    }

    // Resolver tenant pelo subdomínio
    const company = await this.prisma.company.findUnique({
      where: { slug: subdomain },
      include: {
        publicPortal: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Verificar se o portal público está habilitado
    if (!company.publicPortal?.isEnabled) {
      throw new NotFoundException(
        'Portal público não disponível para esta empresa',
      );
    }

    // Injetar informações do tenant na requisição
    req.tenant = {
      id: company.id,
      name: company.name,
      slug: company.slug,
      publicPortal: {
        id: company.publicPortal.id,
        isEnabled: company.publicPortal.isEnabled,
        theme: company.publicPortal.theme,
        customCss: company.publicPortal.customCss || undefined,
        customJs: company.publicPortal.customJs || undefined,
        features: company.publicPortal.features,
        metaTitle: company.publicPortal.metaTitle || undefined,
        metaDescription: company.publicPortal.metaDescription || undefined,
        metaKeywords: company.publicPortal.metaKeywords || undefined,
        contactInfo: company.publicPortal.contactInfo,
      },
    };

    next();
  }

  private extractSubdomain(host: string): string | null {
    // Remover porta se existir
    const hostname = host.split(':')[0];

    // Para desenvolvimento local, considerar 'localhost' como sem subdomínio
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return null;
    }

    // Dividir por pontos
    const parts = hostname.split('.');

    // Se tem menos de 3 partes, não há subdomínio
    if (parts.length < 3) {
      return null;
    }

    // O primeiro parte é o subdomínio (ex: empresa.furryfriends.com)
    const subdomain = parts[0];

    // Ignorar 'www' como subdomínio
    if (subdomain === 'www') {
      return null;
    }

    return subdomain;
  }
}
