# Configuração Google OAuth - Clarity Finance

Este guia detalha como configurar a autenticação com Google no seu projeto Clarity Finance.

## Pré-requisitos

- Uma conta Google
- Acesso ao Google Cloud Console

## Passo 1: Criar um Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar um Projeto" (canto superior esquerdo)
3. Clique em "NOVO PROJETO"
4. Digite um nome para o projeto (ex: "Clarity Finance")
5. Clique em "CRIAR"
6. Aguarde a criação do projeto (pode levar alguns minutos)

## Passo 2: Configurar a Tela de Consentimento

1. No painel esquerdo, vá para "APIs e Serviços" > "Tela de consentimento"
2. Selecione "Externo" como tipo de usuário
3. Clique em "CRIAR"
4. Preencha as informações obrigatórias:
   - **Nome do app**: Clarity Finance
   - **Email do usuário de suporte**: seu@email.com
   - **E-mails de contato para notificações**: seu@email.com
5. Clique em "SALVAR E CONTINUAR"
6. Ignore os "Escopos" adicionais por enquanto e clique em "SALVAR E CONTINUAR"
7. Revise as informações e clique em "VOLTAR AO PAINEL"

## Passo 3: Criar Credenciais OAuth 2.0

1. Vá para "APIs e Serviços" > "Credenciais"
2. Clique em "+ CRIAR CREDENCIAIS" > "ID do Cliente OAuth"
3. Selecione "Aplicação da web"
4. Preencha os dados:
   - **Nome**: Clarity Finance Web App
   - **URIs autorizados de JavaScript**: 
     ```
     http://localhost:5173
     http://localhost:3000
     https://seu-dominio.com (quando em produção)
     ```
   - **URIs autorizados de redirecionamento**:
     ```
     http://localhost:5173
     http://localhost:3000
     https://seu-dominio.com (quando em produção)
     ```
5. Clique em "CRIAR"
6. Copie o **Client ID** (não o Client Secret)

## Passo 4: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Cole seu Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=seu_client_id_copiado_aqui
   ```
3. Salve o arquivo

## Passo 5: Testar a Autenticação

1. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse a página de login: `http://localhost:5173/login`
3. Clique no botão "Entrar com Google"
4. Você deve ser redirecionado para a tela de login do Google
5. Após fazer login, voltará ao dashboard

## Estrutura Implementada

### AuthContext (`src/context/AuthContext.tsx`)
- Gerencia o estado do usuário autenticado
- Fornece hooks `useAuth()` para acessar dados do usuário
- Persiste dados no localStorage

### App.tsx
- Envolve a aplicação com `GoogleOAuthProvider`
- Estabelece o `GoogleOAuthProvider` com o Client ID via variáveis de ambiente

### Login.tsx
- Integra o componente `GoogleLogin` do `@react-oauth/google`
- Decodifica o JWT token do Google
- Salva os dados do usuário no contexto

## Dados Capturados do Google

Ao fazer login com Google, os seguintes dados são capturados:
- `email`: Email do usuário
- `name`: Nome completo
- `picture`: URL da foto do perfil

Esses dados são salvos no contexto e podem ser acessados em qualquer componente usando:

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && (
        <div>
          <p>Bem-vindo, {user?.name}</p>
          <img src={user?.picture} alt={user?.name} />
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### "Failed to initialize Google Sign-In"
- Verifique se o `VITE_GOOGLE_CLIENT_ID` está correto
- Certifique-se de que `localhost:5173` está adicionado aos URIs autorizados

### "Popup blocked"
- Certifique-se de que não há ad-blockers bloqueando popups do Google

### Token inválido
- Verifique se a biblioteca `jwt-decode` está instalada
- Confirme que você está usando a versão correta da biblioteca

## Endpoints de Desenvolvimento

Para testes locais, use:
- `http://localhost:5173`
- `http://localhost:3000`

Remembre de adicionar seus domínios de produção no Google Cloud Console antes de fazer deploy.

## Próximos Passos Recomendados

1. Integrar com um backend para persistir dados do usuário
2. Implementar logout automático após expiração
3. Adicionar refresh tokens
4. Implementar autenticação de dois fatores (2FA)
5. Adicionar testes de autenticação
