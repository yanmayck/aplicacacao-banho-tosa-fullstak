# Análise Arquitetural de Baixo Nível e Padrões de Código

## 1. Estrutura de Código e Modularidade

### 1.1. Backend (NestJS)
*   **Padrão:** Module-Controller-Service (padrão NestJS).
*   **Injeção de Dependência:** Fortemente utilizada, promovendo testabilidade.
*   **DTOs:** Usados para validação de entrada (`class-validator`).
    *   *Recomendação:* Garantir que todos os DTOs removam estritamente propriedades desconhecidas (`whitelist: true, forbidNonWhitelisted: true`).
*   **Entidades:** O schema do Prisma define o modelo de dados.
    *   *Recomendação:* Usar padrão Repository ou um wrapper de Camada de Acesso a Dados (DAL) em torno do Prisma para desacoplar a lógica de negócios do ORM.

### 1.2. Frontend (React)
*   **Gerenciamento de Estado:** Context API utilizada (ex: `StoreContext`).
    *   *Recomendação:* Avaliar Zustand ou Redux Toolkit para estado global se a complexidade aumentar.
*   **Busca de Dados:** TanStack Query (React Query) é o padrão.
    *   *Recomendação:* Centralizar chaves de query em uma factory para evitar duplicação e problemas de invalidação de cache.
*   **Componentes:** Shadcn/UI fornece uma base sólida e acessível.
    *   *Recomendação:* Aplicar o padrão "Container/Presentational" ou estrutura de pastas "Baseada em Features" (ex: `features/auth`, `features/appointments`).

### 1.3. Pacotes Compartilhados
*   **`@furry-friends/types`:**
    *   **Atual:** Contém Interfaces e Enums.
    *   **Futuro:** Deve incluir schemas Zod (para validação no frontend correspondendo aos DTOs do backend) e funções utilitárias compartilhadas.

## 2. Padrões de Design e Melhores Práticas

### 2.1. Tratamento de Erros
*   **Backend:** Filtro de Exceção Global é necessário para padronizar respostas de erro da API (ex: `{ statusCode, message, timestamp, path }`).
*   **Frontend:** Error Boundaries devem ser implementados para capturar falhas de UI graciosamente.

### 2.2. Operações Assíncronas
*   **Notificações:** Atualmente tratadas dentro do serviço.
    *   *Refatoração:* Mover para uma arquitetura orientada a eventos usando `@nestjs/event-emitter` ou uma fila de mensagens (BullMQ) para desacoplar o gatilho da execução (envio de email/SMS).

### 2.3. Segurança de Tipo
*   **Modo Estrito:** Ativado.
*   **Uso de `any`:** Sendo ativamente eliminado.
*   **Generics:** Devem ser usados para métodos de serviço reutilizáveis (ex: resultados paginados).

## 3. Melhorias de Código Específicas (Identificadas)

### 3.1. Módulo de Auditoria
*   **Problema:** `AuditParams` estava tipado de forma fraca.
*   **Correção:** Atualizado para usar Enums estritos do Prisma.
*   **Melhoria:** Criar um decorator customizado `@Audit()` para simplificar o uso em controladores e reduzir boilerplate em interceptors.

### 3.2. Módulo de Notificação
*   **Problema:** Dependência direta de Enums do Prisma causou conflitos de tipo com tipos compartilhados.
*   **Correção:** DTOs desacoplados de tipos do Prisma usando interfaces compartilhadas.
*   **Melhoria:** Implementar uma interface `NotificationProvider` (Padrão Strategy) para alternar facilmente entre provedores de email/SMS (ex: SendGrid vs. AWS SES).

## 4. Schema do Banco de Dados (Prisma)
*   **Índices:** Verificar índices em campos consultados frequentemente (`email`, `status`, `scheduledFor`).
*   **Relações:** Garantir que exclusões em cascata sejam tratadas cuidadosamente para evitar registros órfãos ou perda acidental de dados.
*   **Soft Deletes:** Implementar middleware para exclusão lógica (`deletedAt`) em vez de exclusão física para dados críticos (Clientes, Pets).

## 5. Plano de Ação para Qualidade de Código
1.  **Linting:** Impor regras estritas do ESLint em todo o Monorepo.
2.  **Testes:**
    *   **Unitários:** Jest para Serviços/Utilitários.
    *   **Integração:** Supertest para endpoints de API.
    *   **E2E:** Cypress ou Playwright para fluxos de usuário críticos.
3.  **Documentação:** Gerar documentação de API usando Swagger (`@nestjs/swagger`) e mantê-la sincronizada com DTOs.
