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
- Validar Quizz (`/materials/validate/quiz`)
- Gerenciar Matérias (`/manage/subjects`)
- Gerenciar Editais (`/manage/notices`)
- Gerenciar Planos (`/manage/plans`)
- Editar Matéria (`/manage/subjects/:id/edit`)
- Editar Edital (`/manage/notices/:id/edit`)
- Editar Plano (`/manage/plans/:id/edit`)
- Planos disponíveis (`/plans`)
- Central de Notas (`/notes`)
- Central Games (`/games`)
- Modo Individual (`/games/individual`)
- Jogo individual (`/games/individual/play`)

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
- Cadastrar matéria: `POST /subjects`
- Detalhar matéria: `GET /subjects/{id}`
- Atualizar matéria: `PATCH /subjects/{id}`
- Excluir matéria: `DELETE /subjects/{id}`
- Listar editais: `GET /notices`
- Cadastrar edital: `POST /notices`
- Detalhar edital: `GET /notices/{id}`
- Atualizar edital: `PATCH /notices/{id}`
- Excluir edital: `DELETE /notices/{id}`
- Listar planos: `GET /plans`
- Cadastrar plano: `POST /plans`
- Detalhar plano: `GET /plans/{id}`
- Atualizar plano: `PATCH /plans/{id}`
- Excluir plano: `DELETE /plans/{id}`
- Criar quizz: `POST /quizzes`
- Próximo quizz: `GET /quizzes/next`
- Validar quizz: `POST /quizzes/{id}/validate`
- Listar notas: `GET /notes?user_id={id}`
- Cadastrar nota: `POST /notes`
- Próximo quizz (jogo): `GET /quizzes/play/next?subject_ids=1,2&exclude_ids=10,11`
- Responder quizz (jogo): `POST /quizzes/{id}/answer`

### Regras do jogo
- Apenas quizzes validados (>= 3 validações) e sem revisão são usados no jogo.

## Fluxo de autenticação
- A primeira tela é sempre `/login` para usuários não autenticados.
- Após cadastro/login, o usuário é redirecionado para `/home`.
- Rotas protegidas: `/home` e `/profile` exigem login.
- Rotas públicas (`/login`, `/signup`, `/forgot-password`) não ficam acessíveis quando já autenticado.
- Logout disponível na gaveta lateral da Home, redireciona para `/login`.
- Sessão simples via `localStorage` (chave `essd_user`).

### Cadastro em 2 etapas
- Etapa 1: dados pessoais (nome, e-mail, telefone, senha).
- Etapa 2: escolha do plano (carregado via `GET /plans`).

### Planos disponíveis
- `/plans` lista os planos para o usuário.
- Planos mais baratos que o atual não exibem ação de mudança.
- Valores são exibidos no formato monetário pt-BR.

## Fluxo Central de Materiais
- `/materials` apresenta os cards principais (Enviar materiais, Enviar quizz, Validar materiais).
- `/materials/send` mostra os tipos (Apostila, Resumo, Mapa Mental).
- `/materials/send/:type` exibe o formulário de upload com select de matéria, drag & drop e barra de progresso.
- `/materials/validate` exibe a área de validação (UI inicial).
- `/materials/validate/quiz` exibe o card de validação de quizz.

### Validação de quizz
- A UI busca o próximo quizz em `GET /quizzes/next?user_id=...`.
- Ao clicar em 👍/👎 envia `POST /quizzes/{id}/validate` com `{ action: "validate" | "invalidate", user_id }`.
- Quizz com 3 validações não aparece mais; com 5 invalidações entra em revisão.

## Gestão de cadastros
- `/manage/subjects`, `/manage/notices`, `/manage/plans` permitem cadastrar e listar.
- O botão Excluir abre um modal de confirmação e envia `DELETE` para o respectivo endpoint.

### Upload de materiais
- Campos: `user_id`, `subject_id`, `type`, `file`
- `type`: `apostila` | `resumo` | `mapa-mental`

### Criar quizz
- Campos: `user_id`, `subject_id`, `question`, `option_one`, `option_two`, `option_three`, `option_four`

### Cadastro
- Campos: `name`, `email`, `phone`, `plan_id`, `password`, `password_confirmation` (opcional: `notice_id`)

### Atualização de perfil
- Campos: `name`, `email`, `phone`, `notice_id`, `password`, `password_confirmation`

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
