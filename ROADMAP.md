# Roadmap de Evolução do Produto: Furry Friends Agenda

Este documento descreve as funcionalidades e melhorias planejadas para transformar o projeto em um produto completo e competitivo no mercado. As tarefas estão organizadas por prioridade, do essencial para o lançamento até as expansões futuras.

## Etapa 1: Finalização do MVP (Produto Mínimo Viável)

*Objetivo: Ter um produto estável e funcional que possa ser utilizado por um primeiro cliente piloto.*

- [ ] **Módulo Financeiro Básico:**
  - [ ] Implementar uma tela de "Fechamento de Conta" para cada agendamento.
  - [ ] Permitir o registro de pagamentos (Dinheiro, Cartão, Pix).
  - [ ] Gerar um recibo simples do serviço prestado.
  - [ ] **Integração para Emissão de Nota Fiscal de Serviço (NFS-e):**
    - [ ] Escolher e contratar uma API de emissão de notas fiscais (ex: eNotas, NFE.io, PlugNotas).
    - [ ] Adicionar campos fiscais no cadastro da empresa (CNPJ, Inscrição Municipal, etc.).
    - [ ] Adicionar campos obrigatórios no cadastro de clientes (CPF/CNPJ, Endereço Completo).
    - [ ] Criar um endpoint no backend que envia os dados do serviço e do cliente para a API parceira.
    - [ ] Adicionar um botão "Emitir NFS-e" na tela de agendamento finalizado.
    - [ ] Armazenar o status e o link da nota fiscal emitida no banco de dados.

- [ ] **Finalização de Débitos Técnicos:**
  - [ ] **Testes de Frontend:** Configurar e implementar os testes unitários e de componentes no frontend, conforme planejado no `TESTING_GUIDE.md`.
  - [ ] **Lógica de Backend:** Substituir lógicas de placeholder (como a atribuição automática de tosadores) por implementações funcionais.
  - [ ] **Tratamento de Erros:** Melhorar o feedback para o usuário em casos de erro de API ou de validação.

- [ ] **Polimento Geral (UI/UX):**
  - [ ] Revisar todos os fluxos de usuário para garantir que sejam intuitivos.
  - [ ] Corrigir pequenas inconsistências visuais e de responsividade.

## Etapa 2: Lançamento e Primeiras Métricas (Versão 1.0)

*Objetivo: Lançar o produto no mercado, conseguir os primeiros clientes pagantes e validar o valor da solução.*

- [ ] **Portal do Cliente (Funcionalidade Essencial):**
  - [ ] Permitir que o cliente final faça login.
  - [ ] Implementar o agendamento online, onde o cliente pode ver horários e serviços disponíveis.
  - [ ] Tela para o cliente visualizar o histórico de serviços de seus pets.

- [ ] **Melhorias na Gestão de Usuários:**
  - [ ] Implementar fluxo de "Esqueci minha senha".
  - [ ] Permitir que o administrador convide outros usuários (funcionários) para a plataforma.

## Etapa 3: Expansão da Plataforma (Versão 2.0)

*Objetivo: Adicionar módulos que aumentem o valor percebido e justifiquem planos de assinatura mais caros.*

- [ ] **Gestão de Estoque:**
  - [ ] Cadastro de produtos (shampoos, perfumes, itens de venda).
  - [ ] Controle de entrada e saída de itens do estoque.
  - [ ] Associação de produtos usados a cada serviço para controle de custos.
  - [ ] Alertas de estoque baixo.

- [ ] **Relatórios Avançados:**
  - [ ] Dashboard financeiro com métricas como faturamento, ticket médio, etc.
  - [ ] Relatório de recorrência de clientes (quantos clientes retornam e com que frequência).
  - [ ] Análise de performance dos tosadores (além das comissões).

- [ ] **Integrações e Automações:**
  - [ ] **Notificações Automáticas:** Envio de lembretes de agendamento e alertas de vacina via WhatsApp ou E-mail.
  - [ ] **Integração com Gateway de Pagamento:** Permitir pagamento online (Stripe, PagSeguro, etc.).

## Etapa 4: Inteligência Artificial e Otimização

*Objetivo: Utilizar IA para automatizar processos, gerar insights profundos e aumentar a eficiência e retenção.*

- [ ] **Módulo de Estoque Inteligente (com IA):**
  - [ ] Implementar a associação de produtos/insumos a cada tipo de serviço.
  - [ ] Coletar dados de uso de produtos ao longo do tempo.
  - [ ] Criar endpoint para enviar dados históricos para uma API de IA e receber previsões de demanda.
  - [ ] Exibir alertas e sugestões de compra com base nas previsões.

- [ ] **Relatórios com Linguagem Natural:**
  - [ ] Desenvolver interface de "chat" ou "busca" na tela de relatórios.
  - [ ] Criar endpoint no backend que envia a pergunta do usuário + schema do banco para a API de IA.
  - [ ] Implementar uma camada de validação de segurança para a query retornada pela IA.
  - [ ] Executar a query validada e exibir os resultados de forma visual.

- [ ] **Análise Preditiva de Churn (Cancelamento):**
  - [ ] Desenvolver lógica para calcular a frequência de visita de cada cliente.
  - [ ] Criar um serviço (via API de IA ou regras internas) para identificar clientes que desviaram do padrão.
  - [ ] Gerar um painel de "Clientes em Risco" com sugestões de ações (ex: enviar voucher).

## Etapa 5: Visão de Longo Prazo

*Objetivo: Consolidar o produto como uma plataforma completa e explorar novos mercados.*

- [ ] **Aplicativo Mobile (React Native / Flutter):**
  - [ ] Desenvolver o aplicativo para funcionários (gestão de agenda, status do pet).
  - [ ] Desenvolver o aplicativo para o cliente final (agendamento, histórico, notificações).

- [ ] **Programa de Fidelidade:**
  - [ ] Sistema de pontos para clientes que pode ser trocado por descontos ou serviços.

- [ ] **Marketplace de Produtos:**
  - [ ] Permitir que o pet shop venda seus produtos de estoque diretamente pelo portal do cliente.