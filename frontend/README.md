# Frontend (React + Vite)

## Telas implementadas
- Cadastro (`/signup`)
- Login (`/login`)
- Recuperar senha (`/forgot-password`)
- Alterar dados do usuário (`/profile`)
- Home (`/home`) — página simbólica após autenticação
- Central de Materiais (`/materials`)
- Enviar Materiais (`/materials/send`)
- Enviar Material (tipo) (`/materials/send/:type`)
- Enviar Quizz (`/materials/quiz/send`)
- Validar Materiais (`/materials/validate`)

## Stack e dependências
- Vite + React 19
- React Router (`react-router-dom`) para navegação entre telas

## Integração com o backend
Base URL padrão: `http://localhost:8080/api` (configurável via `VITE_API_BASE_URL`).

Endpoints usados:
- Cadastro: `POST /auth/register`
- Login: `POST /auth/login`
- Recuperar senha: `POST /auth/forgot-password`
- Atualizar usuário: `PATCH /users/{id}`
- Upload de materiais: `POST /materials/upload` (multipart/form-data)
- Listar matérias: `GET /subjects`
- Criar quizz: `POST /quizzes`

## Fluxo de autenticação
- A primeira tela é sempre `/login` para usuários não autenticados.
- Após cadastro/login, o usuário é redirecionado para `/home`.
- Rotas protegidas: `/home` e `/profile` exigem login.
- Rotas públicas (`/login`, `/signup`, `/forgot-password`) não ficam acessíveis quando já autenticado.
- Logout disponível na gaveta lateral da Home, redireciona para `/login`.
- Sessão simples via `localStorage` (chave `essd_user`).

## Fluxo Central de Materiais
- `/materials` apresenta os cards principais (Enviar materiais, Enviar quizz, Validar materiais).
- `/materials/send` mostra os tipos (Apostila, Resumo, Mapa Mental).
- `/materials/send/:type` exibe o formulário de upload com select de matéria, drag & drop e barra de progresso.
- `/materials/validate` exibe a área de validação (UI inicial).

### Upload de materiais
- Campos: `user_id`, `subject_id`, `type`, `file`
- `type`: `apostila` | `resumo` | `mapa-mental`

### Criar quizz
- Campos: `user_id`, `subject_id`, `question`, `option_one`, `option_two`, `option_three`, `option_four`

## Como rodar
1) Instalar deps (já feito no container, mas localmente): `npm install`
2) Dev server: `npm run dev -- --host 0.0.0.0 --port 3000`
3) Acessar via Nginx: http://localhost:8080 (proxy para o frontend em 3000)

## Estrutura
- Rotas: [src/App.jsx](src/App.jsx)
- Telas (cada uma com seu CSS): [src/screens](src/screens)
- Componentes compartilhados: [src/components](src/components)
- Utils/integração: [src/lib](src/lib)
- Estilos globais/base: [src/index.css](src/index.css) e [src/App.css](src/App.css)
