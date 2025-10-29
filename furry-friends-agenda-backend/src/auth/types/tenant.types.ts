// Tipos para multi-tenancy público
export interface PublicTenantInfo {
  id: string;
  name: string;
  slug: string;
  publicPortal: {
    id: string;
    isEnabled: boolean;
    theme?: any;
    customCss?: string;
    customJs?: string;
    features?: any;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    contactInfo?: any;
  };
}

// Extensão do tipo Request do Express para incluir tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: PublicTenantInfo | null;
    }
  }
}
