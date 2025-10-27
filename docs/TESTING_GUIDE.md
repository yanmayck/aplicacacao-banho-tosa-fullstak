# Guia de Testes Automatizados - Furry Friends Agenda

Este documento descreve a estratégia e a organização dos testes automatizados para o projeto, cobrindo tanto o backend (NestJS) quanto o frontend (React).

## Filosofia de Testes

Adotamos a abordagem da Pirâmide de Testes, focando em uma base sólida de testes unitários rápidos, complementados por testes de integração e um número menor de testes ponta-a-ponta (E2E) para garantir o fluxo completo da aplicação.

---

## 1. Backend (`furry-friends-agenda-backend`)

O backend NestJS já utiliza **Jest** como framework de testes, o que é um padrão para a tecnologia. A estrutura de testes é dividida em duas categorias principais:

### 1.1. Testes Unitários e de Integração

- **O que testam?** Componentes individuais (controllers, services, providers) de forma isolada (unitário) ou em conjunto dentro de um módulo (integração).
- **Ferramentas:** Jest.
- **Localização:** Arquivos com sufixo `.spec.ts` dentro do diretório `src/`, ao lado dos arquivos que estão testando. Ex: `users.service.spec.ts`.
- **Como executar:**
  ```bash
  npm run test
  ```
- **Como funciona:**
  - **Serviços (`*.service.spec.ts`):** Testam a lógica de negócio. Dependências como o `PrismaService` são "mocadas" (simuladas) para que o teste não dependa de um banco de dados real.
  - **Controladores (`*.controller.spec.ts`):** Testam se as rotas chamam os serviços corretos e retornam as respostas esperadas. O serviço correspondente é mocado.

### 1.2. Testes Ponta-a-Ponta (End-to-End - E2E)

- **O que testam?** O fluxo completo de uma requisição HTTP, desde a rota até a resposta, interagindo com a aplicação como um cliente de API faria. Estes testes **não** mocam serviços ou o banco de dados, necessitando de um ambiente de teste funcional.
- **Ferramentas:** Jest e Supertest.
- **Localização:** Arquivos com sufixo `.e2e-spec.ts` dentro do diretório `test/`.
- **Como executar:**
  ```bash
  # Certifique-se de ter um banco de dados de teste configurado no .env
  npm run test:e2e
  ```
- **Como funciona:** Uma instância da aplicação é iniciada em um ambiente de teste. O Supertest faz requisições HTTP reais para os endpoints (ex: `POST /auth/login`) e verifica se o status da resposta e os dados retornados estão corretos.

---

## 2. Frontend (`furry-friends-agenda-app`)

O frontend em React com Vite ainda não possui uma estrutura de testes configurada. A proposta é utilizar ferramentas modernas e eficientes que se integram bem com o ambiente Vite.

### 2.1. Configuração Inicial (A ser feita)

Para começar, precisaremos instalar as seguintes dependências de desenvolvimento:

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

E configurar o Vite (`vite.config.ts`) e criar um arquivo de setup para os testes.

**Status Atual:** Há 26 problemas de linting identificados (7 erros, 19 warnings) relacionados principalmente ao uso de `any` em testes e componentes que exportam funções junto com componentes. Estes precisam ser resolvidos antes da configuração completa dos testes.

### 2.2. Testes de Componente e Unitários

- **O que testam?** Componentes de UI de forma isolada e funções utilitárias. O objetivo é garantir que os componentes renderizem corretamente e respondam às interações do usuário.
- **Ferramentas:** **Vitest** (test runner) e **React Testing Library** (para renderizar e interagir com componentes).
- **Localização:** Arquivos com sufixo `.test.tsx` dentro do diretório `src/`, geralmente em uma pasta `__tests__` ou ao lado do componente. Ex: `src/components/ui/__tests__/button.test.tsx`.
- **Como executar:**
  ```bash
  # Adicionar o script ao package.json: "test": "vitest"
  npm run test
  ```
- **Como funciona:** O React Testing Library renderiza o componente em um ambiente simulado (JSDOM). Os testes então encontram elementos na tela (como um usuário faria, por texto, label, etc.) e simulam interações (cliques, digitação). As asserções verificam se o estado do componente mudou como esperado.

### 2.3. Testes Ponta-a-Ponta (End-to-End - E2E) - (Opcional, mas recomendado)

- **O que testam?** Fluxos completos do usuário na aplicação rodando em um navegador real. Ex: Fazer login, navegar para a página de clientes, adicionar um novo cliente e verificar se ele aparece na lista.
- **Ferramentas:** **Cypress** ou **Playwright**.
- **Como funciona:** Essas ferramentas abrem uma instância real do navegador, navegam para a URL da aplicação (ex: `localhost:8080`) e executam uma série de comandos que simulam as ações de um usuário. Elas são ideais para garantir que a integração entre o frontend e o backend está funcionando corretamente.
- **Setup:** Requer a instalação do Cypress/Playwright e a criação de uma pasta separada (ex: `cypress/`) com os arquivos de teste.

## Próximos Passos

1.  **Backend:** Criar mais testes `.spec.ts` para os serviços e controladores existentes para aumentar a cobertura de testes.
2.  **Frontend:**
    - Instalar as dependências de teste (Vitest, React Testing Library).
    - Configurar o ambiente de teste no `vite.config.ts`.
    - Criar um primeiro teste de exemplo para um componente simples (ex: `Button`).
    - Progressivamente, adicionar testes para os componentes mais complexos e páginas.
