# KL Rent a Car - Landing Page

Landing page para a KL Rent a Car, locadora de veículos em Manaus/AM.

## Tecnologias Utilizadas

Este projeto foi construído com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como executar o projeto

### Pré-requisitos

- Node.js instalado - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

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

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run build:dev` - Cria a build em modo desenvolvimento
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── landing/      # Componentes da landing page
│   └── ui/           # Componentes UI (shadcn)
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── lib/              # Utilitários
└── assets/           # Imagens e recursos estáticos
```

## Deploy

Para fazer o deploy do projeto, você pode usar serviços como:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

Basta fazer o build do projeto (`npm run build`) e fazer o upload da pasta `dist` gerada.
