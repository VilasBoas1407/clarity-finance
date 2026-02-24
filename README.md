# Clarity Finance

Aplicacao web para controle financeiro pessoal, com autenticacao Google e persistencia no Firebase.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase Auth (Google)
- Cloud Firestore
- React Router
- Recharts

## Funcionalidades

- Login com Google
- Dashboard com indicadores financeiros
- Cadastro e listagem de transações por mes
- Cadastro e listagem de gastos recorrentes
- Edicao/exclusao de transações
- Rotas protegidas por autenticacao

## Estrutura de dados (Firestore)

Colecoes por usuario:

- `users/{uid}`
- `users/{uid}/transactions/{transactionId}`
- `users/{uid}/recurringExpenses/{expenseId}`

Campos importantes em `transactions`:

- `description`, `category`, `amount`, `type`, `paymentMethod`, `date`
- `yearMonth` (formato `YYYY-MM`, usado para filtro mensal)
- `createdAt`, `updatedAt`, `userId`

## Requisitos

- Node.js 18+
- npm 9+
- Projeto Firebase com Auth e Firestore habilitados

## Configuracao

1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis de ambiente:

- Copie `.env.example` para `.env`
- Preencha com as credenciais do seu projeto Firebase

Variaveis usadas:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

3. Inicie o projeto:

```bash
npm run dev
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de producao
- `npm run preview`: preview do build
- `npm run lint`: lint
- `npm run test`: testes (Vitest)
- `npm run test:watch`: testes em modo watch

## Regras de seguranca (Firestore)

Exemplo minimo para acesso por usuario autenticado ao proprio documento e subcolecoes:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update, delete: if request.auth != null
                                         && request.auth.uid == userId;

      match /transactions/{transactionId} {
        allow read, create, update, delete: if request.auth != null
                                           && request.auth.uid == userId;
      }

      match /recurringExpenses/{expenseId} {
        allow read, create, update, delete: if request.auth != null
                                           && request.auth.uid == userId;
      }
    }
  }
}
```

## Rotas principais

- `/` Landing
- `/login` Login
- `/dashboard` Dashboard
- `/transactions` transações
- `/recurring` Gastos recorrentes
- `/cards`, `/reports`, `/settings`

## Observacoes

- A tela de transações filtra por `yearMonth`; se esse campo nao existir no documento, ele nao aparece no filtro mensal.
- Se ocorrer `Missing or insufficient permissions`, revise as regras do Firestore.
