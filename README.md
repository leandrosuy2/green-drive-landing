# KL Rent a Car - Landing Page

Landing page moderna para a KL Rent a Car, locadora de veículos em Manaus/AM com sistema completo de reservas online.

## 🚀 Funcionalidades

### Sistema de Autenticação
- Login e registro de usuários
- Recuperação de senha
- Autenticação JWT com refresh automático
- Rotas protegidas
- Painel administrativo

### Gestão de Frota
- Listagem de veículos com filtros avançados (estado, grupo, preço, busca)
- Página de detalhes completa com informações do veículo
- Sistema de grupos de veículos (A, B, C, D, etc.)
- Imagens e descrições detalhadas

### Sistema de Reservas
- **Modo Convencional**: Cálculo por diárias com seguro
- **Modo Promocional**: Planos especiais com descontos progressivos
- Seleção de seguros (Básico e Premium)
- Escolha de loja de retirada
- Calendário com validação de datas (exclui domingos)
- Cálculo automático de valores com base nas opções selecionadas

### Cálculos Inteligentes
- **Convencional**: Valor da diária × dias + seguro
- **Promocional**: Sistema de ciclos (ex: 30 dias, paga 25) + seguro sobre valor do plano
- Atualização em tempo real do valor total
- Bloco informativo com quantidade de diárias e valor por dia

## Integrações API
- **Frota**: `GET /frota` (público)
- **Detalhes**: `GET /frota/:id?estado=estadoId` (público)
- **Lojas**: `GET /loja?id_grupo_loc=estadoId` (público)
- **Planos**: `GET /planos?grupo_id=X&estado_id=Y` (público)
- **Autenticação**: `POST /auth/login`, `POST /auth/register` (JWT)
- **Locações**: `GET /locacao` (admin) — O frontend garante que todos os objetos recebidos possuem o campo `id_car` (veja detalhes em `docs/locacao-integration.md`).

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes UI
- **Axios** para requisições HTTP
- **React Router v6** para navegação
- **Lucide React** para ícones
- **JWT** para autenticação

## 📦 Como executar o projeto

### Pré-requisitos

- Node.js 18+ instalado - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- API rodando em `http://localhost:3000`

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```env
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
```

### Passos para executar

```sh
# Passo 1: Navegar até o diretório do projeto
cd green-drive-landing

# Passo 2: Instalar as dependências
npm install

# Passo 3: Iniciar o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## 📜 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run build:dev` - Cria a build em modo desenvolvimento
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── landing/      # Componentes da landing page
│   │   ├── TopNav.tsx          # Menu de navegação
│   │   ├── Hero.tsx            # Seção hero
│   │   ├── Fleet.tsx           # Preview da frota (4 veículos)
│   │   ├── LoginModal.tsx      # Modal de login
│   │   ├── RegisterModal.tsx   # Modal de registro
│   │   └── ...
│   └── ui/           # Componentes UI (shadcn)
├── pages/            # Páginas da aplicação
│   ├── Index.tsx               # Homepage
│   ├── Frota.tsx              # Listagem completa com filtros
│   ├── FrotaDetalhes.tsx      # Detalhes e reserva
│   ├── Painel.tsx             # Dashboard admin
│   └── NotFound.tsx
├── services/         # Integração com API
│   ├── authService.ts         # Autenticação JWT
│   ├── frotaService.ts        # Gestão de frota
│   ├── lojaService.ts         # Lojas de retirada
│   └── planoService.ts        # Planos promocionais
├── types/            # Tipos TypeScript
│   ├── auth.ts
│   ├── frota.ts
│   ├── loja.ts
│   └── plano.ts
├── lib/              # Utilitários
│   ├── api.ts                 # Cliente HTTP com JWT
│   ├── publicApi.ts           # Cliente HTTP público
│   ├── config.ts              # Configurações
│   ├── encode.ts              # Encode/decode de IDs
│   └── utils.ts
├── hooks/            # Custom hooks
└── assets/           # Imagens e recursos estáticos
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) com as seguintes características:

- Token armazenado no localStorage
- Refresh automático a cada 3 minutos
- Interceptor Axios para adicionar Bearer token
- Rotas protegidas com componente `ProtectedRoute`
- Logout com limpeza de estado

## 🎨 Temas e Estilos

- Design system baseado em shadcn/ui
- Totalmente responsivo (mobile-first)
- Tema claro/escuro (configurável)
- Componentes reutilizáveis e acessíveis

## 🚀 Deploy

Para fazer o deploy do projeto:

1. Configure as variáveis de ambiente de produção
2. Execute o build: `npm run build`
3. A pasta `dist` será gerada
4. Faça o upload para:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS Amplify
   - Ou qualquer serviço de hosting estático

## 📝 Melhorias Futuras

- [ ] Integração com gateway de pagamento
- [ ] Sistema de notificações em tempo real
- [ ] Chat de suporte
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] App mobile (React Native)

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ para KL Rent a Car

