CleanApp Web (MVP)

Frontend do CleanApp em React + Vite + Tailwind, com tema claro/escuro, autenticação (contexto), home com hero + grid de ofertas, dashboard básico do cliente e tela de conversas (v1). Totalmente integrado à nossa API.

⚙️ Stack

React 18 + Vite

TypeScript

TailwindCSS (dark mode)

React Router

Axios

✅ Pré-requisitos

Node.js 18+ (recomendado 20+)

API rodando em http://localhost:3000 (ou ajuste no .env abaixo)

🔧 Configuração

Crie um arquivo .env na raiz do projeto com:

VITE_API_BASE_URL=http://localhost:3000/api


Se a API estiver em outra URL, basta alterar VITE_API_BASE_URL.

📦 Instalação & Scripts
npm i
npm run dev      # inicia em http://localhost:5173
npm run build    # gera build de produção
npm run preview  # sobe um server local para testar o build

👤 Logins de teste (seed da API)

Cliente: cliente1@cleanapp.local / cliente123

Prestador: prestador1@cleanapp.local / prestador123

🧭 Rotas (MVP)

/ – Home (hero + categorias + ofertas)

/offers – Listagem de ofertas

/login – Autenticação (salva tokens no storage)

/dashboard/customer – Meus jobs (cliente)

/dashboard/provider – Área do prestador (esqueleto inicial)

/conversations – Conversas (v1)

Rotas protegidas usam o componente Protected + contexto de auth.

🧩 Estrutura
src/
  components/
    Layout.tsx
    Protected.tsx
  lib/
    api.ts           # axios com baseURL do .env
    format.ts        # toNumberSafe + formatBRL (evitar .toFixed em Decimal)
  pages/
    Home.tsx
    Offers.tsx
    Login.tsx
    CustomerDashboard.tsx
    ProviderDashboard.tsx
    Conversations.tsx
  store/
    auth.ts
    auth.storage.ts
  App.tsx
  main.tsx

🎨 UI & Tema

Tailwind configurado (dark mode com classe dark no html/body).

Layout responsivo (mobile-first).

Botão de tema pode ser adicionado no Layout (alternando classe dark).

🔌 Integração com a API

Endpoints utilizados atualmente:

GET /categories → Home (Tipos de serviço)

GET /offers?active=true&pageSize=6&order=desc → Home (Destaques)

GET /offers → Página de ofertas

POST /auth/login → Login

GET /jobs?role=customer → Dashboard do cliente

GET /conversations, GET /conversations/:id/messages, POST /conversations/:id/messages → Conversas (v1)

Tokens são gerenciados em store/auth* e adicionados via Axios interceptor.

💰 Formatação monetária

Não use .toFixed() nos valores vindos da API (Prisma Decimal costuma virar string).
Utilize formatBRL() de src/lib/format.ts:

import { formatBRL } from "../lib/format";

<span>{formatBRL(offer.priceBase)}</span>


Isso evita tela branca por erro de toFixed is not a function.

🧪 Como testar fluxo básico

Faça login com o cliente.

Veja Home/Offers e o Dashboard do cliente.

Faça login com o prestador em outra aba (para testar conversas depois).

(Opcional) Crie jobs via API/Insomnia/Postman e verifique no dashboard/Conversas.

🛠️ Troubleshooting

Tela branca / erro de Decimal → troque qualquer .toFixed(...) por formatBRL(...).

CORS → garanta que a API permite http://localhost:5173 (no DEV, já liberado).

Sem dados → rode a seed da API (npm run db:seed no projeto cleanapp-api).

🗺️ Roadmap curto (frontend)

 Tela pública de oferta/prestador (detalhe)

 Fluxo de criação de job (cliente)

 Chat em tempo real (Socket.IO) na página de conversas

 Upload de avatar do usuário

 Skeletons/Loaders e toasts de feedback