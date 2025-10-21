# Documento Mestre de Funcionalidades (Versão Detalhada e Atualizada)

## Sistema de Gestão Inteligente para Pet Shop

**Última Atualização:** 09/09/2025

Este documento detalha todas as funcionalidades, lógicas de negócio e requisitos para a criação de uma plataforma completa, moderna e inteligente para a gestão de pet shops, alinhado com o `ROADMAP.md` e o código-fonte atual.

---

### **Análise e Recomendações Chave**

- **PONTO CRÍTICO (MVP):** O **Módulo Financeiro Básico** é a prioridade máxima para o MVP. A implementação atual não contempla o fechamento de contas, registro de pagamentos ou emissão de NFS-e. As adições abaixo são essenciais.
- **DADOS FALTANTES PARA NFS-e:** O `CPF/CNPJ` do cliente e os dados fiscais da empresa são bloqueadores para a funcionalidade de nota fiscal e precisam ser adicionados ao banco de dados.
- **LÓGICA DE NEGÓCIO:** Funcionalidades como "atribuição automática de tosadores" precisam ter sua lógica implementada no backend para substituir os placeholders atuais.

---

## Módulo 1: Cadastros (Base de Dados Central)

_Objetivo: Armazenar de forma organizada, segura e interligada todas as informações essenciais do negócio._

### 1.1. Gestão de Clientes (Proprietários)

- **Como Funciona:** CRUD Completo (Criar, Ler, Atualizar, Deletar) para clientes.
- **Campos Essenciais:**
  - Nome Completo
  - **CPF/CNPJ (NOVO/CRÍTICO):** Campo obrigatório para emissão de NFS-e. Deve ter validação de formato.
  - Múltiplos Telefones (identificando o principal/WhatsApp)
  - Email
  - Endereço Completo (obrigatório para NFS-e)
  - "Como nos conheceu?"
- **Interface:** A tela de perfil do cliente deve exibir um resumo rápido (próximo agendamento, último serviço) e abas para "Pets", "Histórico de Agendamentos" e "Pacotes Ativos".
- **Lógica:** O sistema deve impedir cadastros duplicados por CPF/CNPJ ou telefone principal. A busca deve ser universal.

### 1.2. Gestão de Pets

- **Como Funciona:** CRUD Associativo a um cliente.
- **Campos Críticos e sua Exibição:**
  - `Alergias/Condições Médicas`: Exibido com alerta visual forte (ex: banner vermelho) na agenda.
  - `Observações de Comportamento`: (Ex: "Morde ao cortar unhas"). Deve aparecer em um pop-up ou área de destaque para o tosador.
- **Outros Campos:** Nome, Foto (galeria), Raça, Espécie, Sexo, Porte, Data de Nascimento (calcula idade), Cor, Peso.

### 1.3. Gestão de Serviços e Produtos

- **Como Funciona:**
  - **Serviços:** CRUD com Nome, Descrição, Duração Média e Preço flexível (preço base + variações por porte, pelo, etc.).
  - **Produtos:** CRUD com Nome, Código de Barras, Fornecedor, Preço de Custo, Preço de Venda, Estoque Atual e Estoque Mínimo (com alertas visuais).

### 1.4. Gestão de Funcionários e Permissões

- **Como Funciona:** CRUD de Funcionários (Nome, Cargo, Contato) com Controle de Acesso por Nível (ACL).
  - `Gerente`: Acesso total.
  - `Atendente`: Acesso a Cadastros, Agenda e Caixa. Sem acesso a relatórios de lucratividade.
  - `Tosador`: Visão simplificada da própria agenda, sem preços, mas com destaque para os campos críticos do pet.

### **1.5. Gestão da Empresa (NOVO)**

- **Objetivo:** Centralizar os dados da empresa para uso em relatórios e emissão de documentos fiscais.
- **Como Funciona:** Uma tela única em "Configurações" para o Gerente editar os dados.
- **Campos (Modelo `CompanyProfile` no DB):**
  - Razão Social
  - Nome Fantasia
  - **CNPJ (CRÍTICO)**
  - **Inscrição Municipal (CRÍTICO)**
  - Endereço Completo
  - Telefone / Email de Contato
  - Logo da Empresa (para recibos/relatórios)
  - **Chave de API da NFS-e (NOVO):** Campo para armazenar a chave da API de notas fiscais (eNotas, NFE.io, etc.).

## Módulo 2: Agenda e Operações

_Objetivo: Gerenciar o fluxo de atendimentos de forma visual, intuitiva e à prova de erros._

### 2.1. Agenda Inteligente

- **Visualização:** Calendário com visão por Dia, Semana, Mês e colunas por funcionário.
- **Interatividade:** Drag-and-drop para reagendar.
- **Lógica de Atribuição (MELHORIA):** Implementar no backend a lógica de `autoAssignGroomer` para atribuir tosadores disponíveis de forma inteligente, substituindo o placeholder atual.
- **Indicadores Visuais:** Ícones para recorrência, primeira viagem, observações importantes.

### 2.2. Gestão de Status do Atendimento

- **Como Funciona:** O status é alterado por cliques em botões de ação.
- **Fluxo Detalhado:**
  1. `Agendado`
  2. `Confirmado` (via WhatsApp/Manual)
  3. `Pet na Loja` (Check-in)
  4. `Em Atendimento` (Iniciado pelo tosador)
  5. `Pronto para Retirada`
  6. `Finalizado/Pago` (Após fechamento no caixa)
  7. **`Nota Fiscal Emitida` (NOVO):** Status final após a emissão da NFS-e.

### 2.3. Agendamentos Recorrentes

- **Como Funciona:** Opção "Repetir" no agendamento para configurar a recorrência (semanal, quinzenal, etc.), criando agendamentos "filhos" vinculados.

## Módulo 3: Comercial e Financeiro

_Objetivo: Controlar as vendas, pacotes, comissões e a saúde financeira do negócio._

### 3.1. Ponto de Venda (PDV)

- **Como Funciona:** Fluxo integrado ao finalizar um agendamento ou para venda avulsa.
- **Funcionalidades:** Adicionar produtos, aplicar descontos, múltiplos meios de pagamento, integração com impressora de recibos.

### 3.2. Gestão de Pacotes de Serviços

- **Como Funciona:** Criação de modelos de pacotes (ex: 4 banhos) com preço e validade. A venda gera "créditos" para o cliente, que podem ser abatidos no agendamento.

### 3.3. Controle de Caixa e Contas

- **Como Funciona:** Fluxo de Abertura, Sangria e Fechamento de Caixa. Lançamento de contas a pagar/receber.

### 3.4. Cálculo de Comissões

- **Como Funciona:** Configuração flexível de comissões por funcionário e tipo de item (serviço/produto). Geração de relatório detalhado por período.

### **3.5. Gestão de Pagamentos (NOVO)**

- **Objetivo:** Registrar os pagamentos de forma estruturada para controle financeiro e fiscal.
- **Como Funciona:** Ao finalizar um agendamento, o sistema abre uma tela de "Fechamento de Conta".
- **Modelo de Dados (`Payment` no DB):**
  - `id`: ID do Pagamento
  - `appointmentId`: ID do Agendamento associado
  - `amount`: Valor pago
  - `method`: Forma de pagamento (Dinheiro, Cartão de Crédito, Pix, etc.)
  - `paymentDate`: Data e hora do pagamento
  - `status`: (ex: `COMPLETED`, `PENDING`)
- **Lógica:** Um agendamento pode ter múltiplos pagamentos. O status do agendamento só se torna `Finalizado/Pago` quando a soma dos pagamentos atingir o `totalPrice`.

## Módulo 4 e 5: IA Preditiva e Generativa

_(Sem alterações, o plano atual é robusto e visionário)_

- **4.1. Análise Preditiva de "No-Show"**
- **4.2. Otimizador de Agenda Inteligente**
- **4.3. Assistente de Vendas e Upsell com IA**
- **5.1. Assistente de Comunicação e Marketing**
- **5.2. Assistente de Resumos e Relatórios**

## Módulo 6: Relatórios e Dashboards (Business Intelligence)

_Objetivo: Fornecer uma visão clara e acionável sobre o desempenho do negócio._

- **6.1. Dashboard Principal:** KPIs visuais (Faturamento, Atendimentos, Ticket Médio, etc.).
- **6.2. Relatórios Financeiros:** DRE Simplificado, Fluxo de Caixa, Vendas por Período/Forma de Pagamento.
- **6.3. Relatórios Operacionais:** Ranking de Serviços/Produtos, Desempenho por Funcionário, Taxas de No-show.
- **6.4. Relatórios de Clientes:** Curva ABC, Taxa de Retenção, Clientes Novos vs. Recorrentes.

## Módulo 7: Configurações do Sistema

_Objetivo: Permitir que o usuário personalize a plataforma para as necessidades do seu negócio._

- **7.1. Dados da Empresa (Detalhado):** Nome, **CNPJ**, **Inscrição Municipal**, Endereço, Logo, e **Chave API NFS-e**.
- **7.2. Configurações Financeiras:** Gerenciar formas de pagamento aceitas.
- **7.3. Modelos de Mensagens:** Editar textos padrão das comunicações automáticas.
- **7.4. Integrações:** Área para inserir chaves de API para serviços externos (WhatsApp, Gateway de Pagamento).
  na
