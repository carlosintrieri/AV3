# ✈️ AEROCODE - Sistema de Gestão de Produção Aeronáutica

<div align="center">
  
![AeroCode](https://img.shields.io/badge/AeroCode-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)

**Sistema completo de gerenciamento de produção de aeronaves com rastreamento em tempo real, controle de recursos e análise de métricas.**

[Sobre](#-sobre) • [Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-como-usar) • [API](#-api-endpoints)

</div>

---

## 📋 Sobre

**AeroCode** é um sistema de gestão de produção aeronáutica desenvolvido para otimizar o processo de fabricação de aeronaves. O sistema oferece controle completo sobre projetos, recursos, atividades e métricas de produção, permitindo que equipes de engenharia e gerenciamento monitorem o progresso em tempo real através de uma interface moderna e intuitiva.

### 🎯 Principais Diferenciais

- ✅ **Controle de Fila Automatizado**: Sistema inteligente que libera automaticamente a próxima aeronave quando a anterior é concluída
- 📊 **Dashboards Interativos**: Visualização de métricas com gráficos de tendência usando Recharts
- 💾 **Histórico Completo**: Todos os dados do dashboard são salvos automaticamente no banco de dados
- 🔄 **5 Etapas de Produção**: Fuselagem → Asas → Motores → Sistemas → Testes
- 📈 **Análise de Tendências**: Gráficos de linha mostrando evolução da produção
- 🛠️ **Gestão de Recursos**: Controle completo de materiais, fornecedores, equipe e equipamentos

---

## 🚀 Funcionalidades

### 📊 **Dashboard**
- Cards de métricas em tempo real:
  - Total de aeronaves em produção
  - Taxa média de conclusão
  - Eficiência operacional
  - Alertas ativos
- Gráfico de tendência de produção por aeronave
- Lista de atividades recentes
- Salvamento automático de métricas no banco de dados
- Atualização automática a cada 5 minutos

### ✈️ **Gestão de Projetos (Aeronaves)**
- Visualização de todas as aeronaves em produção
- Sistema de fila automático
- 5 etapas de produção com indicadores visuais (bolinhas coloridas):
  - 🔵 **Azul**: Em andamento
  - 🟢 **Verde**: Concluída
  - ⚪ **Cinza**: Pendente
- Botão "Avançar atividade" para progressão de etapas
- Liberação automática da próxima aeronave ao concluir
- Detalhes completos de cada projeto:
  - Modelo da aeronave
  - Status e progresso
  - Responsável
  - Prazo
  - Timeline de atividades
  - Alertas

### 🛠️ **Recursos**
Sistema CRUD completo com 4 categorias:

#### 📦 **Materiais**
- Nome do material
- Quantidade (kg)
- Status (OK, Baixo, Crítico)
- Fornecedor

#### 🏢 **Fornecedores**
- Nome da empresa
- Categoria (Metais, Compósitos, Ferragens, Elétricos)
- 📧 Email de contato (clicável)
- ⭐ Avaliação (1-5 estrelas) com slider interativo

#### 👥 **Equipe**
- Nome completo
- 👔 Função (5 opções)
- Status (Ativo, Férias)
- 📊 Número de projetos alocados (0-20)

#### 🔧 **Equipamentos**
- Nome do equipamento
- Status (Operacional, Em Manutenção)
- 📅 Próxima manutenção (calendário)
- ⚡ Porcentagem de uso (0-100%) com barra de progresso visual

### 📝 **Atividades**
- Log automático de todas as ações do sistema
- Histórico completo com timestamp
- Filtros por tipo (criação, progresso, conclusão, alerta)

---

## 🛠️ Tecnologias

### **Frontend**
- **React** 18.3.1 - Biblioteca JavaScript para interfaces
- **React Router DOM** 6.x - Roteamento SPA
- **Tailwind CSS** 3.x - Framework CSS utility-first
- **Recharts** 2.x - Biblioteca de gráficos para React
- **Vite** 5.x - Build tool e dev server

### **Backend**
- **Node.js** 20.x - Runtime JavaScript
- **Express** 4.x - Framework web
- **TypeScript** 5.x - Superset tipado de JavaScript
- **Prisma ORM** 5.22.0 - ORM moderno para Node.js
- **MySQL** 8.0 - Banco de dados relacional
- **ts-node-dev** - Desenvolvimento TypeScript com hot reload
- **CORS** - Cross-Origin Resource Sharing

### **Ferramentas**
- **Prisma Studio** - Interface visual para banco de dados
- **Insomnia/Postman** - Testes de API

---

## 📁 Estrutura do Projeto
```
aerocode/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Schema do banco de dados
│   │   └── migrations/            # Histórico de migrações
│   ├── src/
│   │   ├── server.ts              # Servidor Express
│   │   ├── controllers.ts         # Controladores da API
│   │   └── database.ts            # Configuração Prisma Client
│   ├── .env                       # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Header.jsx         # Header global
    │   ├── context/
    │   │   └── ProjectContext.jsx # Context API para projetos
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Página Dashboard
    │   │   ├── Projects.jsx       # Lista de projetos
    │   │   ├── ProductionDetails.jsx # Detalhes da aeronave
    │   │   └── Resources.jsx      # Gestão de recursos
    │   ├── App.jsx                # Componente principal
    │   ├── main.jsx               # Entry point
    │   └── index.css              # Estilos Tailwind
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabelas Principais**

#### 1️⃣ **User**
```sql
- id: INT (PK)
- email: VARCHAR (UNIQUE)
- password: VARCHAR
- name: VARCHAR
- createdAt: DATETIME
```

#### 2️⃣ **Project** (Aeronaves)
```sql
- id: INT (PK)
- name: VARCHAR
- model: VARCHAR
- deadline: DATETIME
- progress: INT (0-100)
- efficiency: INT
- alerts: INT
- image: TEXT
- queuePosition: INT
- canEdit: BOOLEAN
- currentStage: INT (0-5)
- createdAt: DATETIME
- updatedAt: DATETIME
```

#### 3️⃣ **Stage** (Etapas de Produção)
```sql
- id: INT (PK)
- projectId: INT (FK)
- name: VARCHAR
- order: INT (0-4)
- completed: BOOLEAN
- completedAt: DATETIME
- createdAt: DATETIME
```

#### 4️⃣ **Activity** (Log de Atividades)
```sql
- id: INT (PK)
- projectId: INT (FK)
- description: TEXT
- type: VARCHAR
- createdAt: DATETIME
```

#### 5️⃣ **Resource** (Recursos)
```sql
- id: INT (PK)
- name: VARCHAR
- type: VARCHAR (Material, Fornecedor, Equipe, Equipamento)
- quantity: INT
- unit: VARCHAR
- status: VARCHAR
- location: VARCHAR
- description: TEXT
- contact: VARCHAR (email do fornecedor)
- rating: INT (1-5 estrelas)
- role: VARCHAR (função da equipe)
- projects: INT (projetos alocados)
- maintenance: DATETIME (próxima manutenção)
- usage: INT (0-100%)
- createdAt: DATETIME
- updatedAt: DATETIME
```

#### 6️⃣ **DashboardSnapshot** (Histórico de Métricas)
```sql
- id: INT (PK)
- totalProjects: INT
- avgCompletion: INT
- avgEfficiency: INT
- totalAlerts: INT
- date: DATETIME
- createdAt: DATETIME
```

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 20.x ou superior
- **MySQL** 8.0 ou superior
- **npm** ou **yarn**
- **Git**

---

## 🚀 Instalação

### 1️⃣ **Clone o repositório**
```bash
git clone https://github.com/carlosintrieri/AV3.git
cd aerocode
```

### 2️⃣ **Configurar o Backend**
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie o arquivo .env na pasta backend:
```

**Conteúdo do `.env`:**
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"
PORT=3001
```

**Exemplo:**
```env
DATABASE_URL="mysql://root:root@localhost:3306/aerocode"
PORT=3001
```

### 3️⃣ **Criar o Banco de Dados**
```bash
# Gerar Prisma Client
npx prisma generate

# Criar as tabelas no banco
npx prisma db push

# (Opcional) Visualizar o banco com Prisma Studio
npx prisma studio
```

### 4️⃣ **Iniciar o Backend**
```bash
npm run dev
```

O backend estará rodando em: `http://localhost:3001`

### 5️⃣ **Configurar o Frontend**

Abra um **novo terminal**:
```bash
cd ../frontend

# Instalar dependências
npm install

# Instalar Recharts (gráficos)
npm install recharts
```

### 6️⃣ **Iniciar o Frontend**
```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:3002`

### 7️⃣ **Popular o Banco com Dados Iniciais**

Use o **Insomnia** ou **Postman** para chamar:
```
POST http://localhost:3001/api/projects/seed-initial
```

Isso criará **6 aeronaves iniciais** no sistema!

---

## 📖 Como Usar

### 1️⃣ **Acessar o Sistema**

Abra o navegador em: `http://localhost:3002`

### 2️⃣ **Dashboard**
- Visualize as métricas em tempo real
- O sistema salva automaticamente os dados no banco
- Clique em "🔄 Atualizar" para forçar atualização

### 3️⃣ **Projetos**
- Clique em uma aeronave para ver detalhes
- Use "▶ Avançar atividade" para progredir nas etapas
- Quando concluir todas as etapas, a próxima aeronave é liberada automaticamente

### 4️⃣ **Recursos**
- Navegue pelas abas: Materiais, Fornecedores, Equipe, Equipamentos
- Clique em "+ Adicionar" para criar novos recursos
- Clique em "✏️ Editar" para modificar recursos existentes

---

## 🔌 API Endpoints

### **Projects (Aeronaves)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Lista todas as aeronaves |
| GET | `/api/projects/:id` | Detalhes de uma aeronave |
| POST | `/api/projects` | Criar nova aeronave |
| PUT | `/api/projects/:id` | Atualizar aeronave |
| PUT | `/api/projects/:id/advance` | Avançar para próxima etapa |
| PUT | `/api/projects/:id/complete` | Concluir projeto |
| DELETE | `/api/projects/:id` | Deletar aeronave |
| POST | `/api/projects/seed-initial` | Popular com 6 aeronaves iniciais |

### **Dashboard**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dashboard/metrics` | Métricas atuais (salva automaticamente) |
| GET | `/api/dashboard/chart` | Dados para gráfico de produção |
| POST | `/api/dashboard/snapshot` | Salvar snapshot manualmente |
| GET | `/api/dashboard/history?days=30` | Histórico de snapshots |
| GET | `/api/dashboard/latest` | Último snapshot salvo |
| DELETE | `/api/dashboard/clean-old` | Limpar snapshots >90 dias |

### **Resources (Recursos)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/resources` | Lista todos os recursos |
| GET | `/api/resources/:id` | Detalhes de um recurso |
| POST | `/api/resources` | Criar novo recurso |
| PUT | `/api/resources/:id` | Atualizar recurso |
| DELETE | `/api/resources/:id` | Deletar recurso |
| POST | `/api/resources/seed` | Popular recursos iniciais |

### **Activities (Atividades)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/activities?limit=10` | Atividades recentes |
| GET | `/api/activities/project/:id` | Atividades de um projeto |

---

## 🧪 Testes

### **Testar Backend**
```bash
# Verificar se o backend está rodando
curl http://localhost:3001/api/health

# Buscar todas as aeronaves
curl http://localhost:3001/api/projects

# Buscar métricas do dashboard
curl http://localhost:3001/api/dashboard/metrics
```

### **Prisma Studio** (Interface Visual)
```bash
cd backend
npx prisma studio
```

Acesse: `http://localhost:5555`

---

## 📝 Variáveis de Ambiente

### **Backend (.env)**
```env
# Database
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"

# Server
PORT=3001
NODE_ENV=development
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📜 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@carlosintrieri](https://github.com/carlosintrieri)
- LinkedIn: [Carlos Intrieri](https://linkedin.com/in/carlosintrieri)
- Email: carlos.intrieri@fatec.sp.gov.br
---

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Emojipedia](https://emojipedia.org/) - Atualizado para encontrar Emojis usados na aplicação.

---

