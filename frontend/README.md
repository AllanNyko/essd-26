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
- Central de Estatísticas (`/stats`)
- Ranking (`/ranking`)
- Modo Individual (`/games/individual`)
- Jogo individual (`/games/individual/play`)
- Modo Survivor (`/games/survivor`)
- Jogo survivor (`/games/survivor/play`)

### E-Shop (Loja de Equipamentos)
- Loja (`/shop`) — catálogo de produtos com filtros
- Detalhes do produto (`/shop/products/:id`)
- Carrinho (`/cart`)
- Checkout (`/checkout`)
- Cadastro de vendedor (`/vendor/registration`)
- Gerenciar produtos (vendedor) (`/manage-products`)
- Pedidos do vendedor (`/vendor/orders`)
- Gerenciar categorias (admin) (`/admin/categories`)
- Gerenciar vendedores (admin) (`/admin/vendors`)

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
- Listar matérias: `GET /subjects` (use `only_with_quizzes=1` para jogos)
- Cadastrar matéria: `POST /subjects`
- Detalhar matéria: `GET /subjects/{id}`
- Atualizar matéria: `PATCH /subjects/{id}`
- Excluir matéria: `DELETE /subjects/{id}`
- Listar editais: `GET /notices` (retorna `name` e `observation`)
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
- Próximo quizz (validação): `GET /quizzes/next?user_id={id}`
- Validar quizz: `POST /quizzes/{id}/validate`
- Listar notas: `GET /notes?user_id={id}`
- Cadastrar nota: `POST /notes`
- Consultar pontuação: `GET /scores?user_id={id}`
- Atualizar pontuação: `PATCH /scores`
- Próximo quizz (jogo): `GET /quizzes/play/next?subject_ids=1,2&exclude_ids=10,11`
- Responder quizz (jogo): `POST /quizzes/{id}/answer`
- Iniciar sessão de jogo: `POST /game-sessions`
- Encerrar sessão de jogo: `POST /game-sessions/close`

### Endpoints E-Shop
- Listar produtos: `GET /products?category_id={id}&search={query}&sort_by={field}&sort_order={asc|desc}`
- Criar produto: `POST /products` (multipart/form-data)
- Detalhar produto: `GET /products/{id}`
- Listar categorias: `GET /categories?active_only=1`
- Ver carrinho: `GET /cart`
- Adicionar ao carrinho: `POST /cart`
- Atualizar carrinho: `PATCH /cart/{id}`
- Remover do carrinho: `DELETE /cart/{id}`
- Criar pedido: `POST /orders`
- Listar pedidos: `GET /orders`
- Pedidos do vendedor: `GET /orders/vendor`
- Cadastro de vendedor: `POST /vendors`

### Padrão de resposta da API
- Sucesso: `message`, `data` e `meta` (quando paginado).
- Erro: `error.code`, `error.message` e `error.details`.
- Referência completa em [backend/README.md](../backend/README.md).

Exemplo de sucesso:
```json
{
	"message": "Operação realizada com sucesso.",
	"data": {
		"id": 1
	},
	"meta": {
		"page": 1,
		"per_page": 10,
		"total": 100,
		"last_page": 10
	}
}
```

Exemplo de erro:
```json
{
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Os dados informados são inválidos.",
		"details": {
			"email": ["O e-mail é obrigatório."]
		}
	}
}
```

### Regras do jogo
- Apenas quizzes validados (>= 3 validações) e sem revisão são usados no jogo.
- Modo Survivor: o jogo termina ao errar uma única questão.
- O quizz só aparece após clicar em "Começar" no modal de orientação.
- Refresh/fechar com o modal aberto não gera penalidade.
- Quando houver apenas um quizz disponível, ele continua sendo exibido (sem bloqueio por exclusão).

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

### Quizz (jogo)
- `GET /quizzes/play/next` usa `subject_ids` e `exclude_ids` para filtrar e evitar repetição.
- O jogo usa apenas quizzes validados (>= 3 validações) e sem revisão.

## Gestão de cadastros
- `/manage/subjects`, `/manage/notices`, `/manage/plans` permitem cadastrar e listar.
- O botão Excluir abre um modal de confirmação e envia `DELETE` para o respectivo endpoint.

### Upload de materiais
- Campos: `user_id`, `subject_id`, `type`, `file`
- `type`: `apostila` | `resumo` | `mapa-mental`

## Componentes Reutilizáveis

### Formulários
- `Input.jsx` — campo de texto genérico
- `Select.jsx` — select com opções
- `Textarea.jsx` — área de texto
- `FormCard.jsx` — card com título, descrição e formulário
- `ImageUploader.jsx` — upload de múltiplas imagens com preview (máx. 5)

### UI
- `Modal.jsx` — modal com overlay escuro, título, corpo, botão OK e auto-limpeza
- `ProductCard.jsx` — card de produto com imagem, nome, preço e categoria
- `Status.jsx` — mensagens de erro/sucesso
- `SidebarDrawer.jsx` — menu lateral com navegação por role
- `AppNavbar.jsx` — barra de navegação superior

### Máscaras e Formatação
- Preço em formato brasileiro: `R$ X.XXX,XX` usando `toLocaleString('pt-BR')`
- Conversão de preço no submit: remove pontos, troca vírgula por ponto
- Exemplo: input `19990` → display `199,90` → submit `199.90`

## Funcionalidades E-Shop

### Roles e Navegação
- **Student**: acesso à loja, carrinho e checkout
- **Vendor**: área de gestão de produtos e pedidos + acesso à loja
- **Admin**: gerenciar categorias, vendedores + todas as funcionalidades

### Fluxo de Vendedor
1. Usuário se cadastra como vendedor (`/vendor/registration`)
2. Admin aprova o cadastro (`/admin/vendors`)
3. Vendedor acessa "Meus Produtos" (`/manage-products`)
4. Cadastra produtos com imagens, preço, estoque
5. Acompanha pedidos em "Meus Pedidos" (`/vendor/orders`)

### Fluxo de Compra
1. Cliente navega na loja (`/shop`) com filtros e busca
2. Visualiza detalhes do produto (`/shop/products/:id`)
3. Adiciona ao carrinho (`/cart`)
4. Finaliza compra no checkout (`/checkout`)
5. Pedido é enviado ao vendedor

### Criar quizz
- Campos: `user_id`, `subject_id`, `question`, `option_one`, `option_two`, `option_three`, `option_four`

### Cadastro
- Campos: `name`, `email`, `phone`, `plan_id`, `password`, `password_confirmation` (opcional: `notice_id`)

### Atualização de perfil
- Campos: `name`, `email`, `phone`, `notice_id`, `password`, `password_confirmation`
- Avatar: upload imediato via `PATCH /users/{id}` com `avatar_url` (data URL base64).

## Como rodar
1) Instalar deps (já feito no container, mas localmente): `npm install`
2) Dev server: `npm run dev -- --host 0.0.0.0 --port 3000`
3) Acessar via Nginx: http://localhost:8080 (proxy para o frontend em 3000)

⚠️ **IMPORTANTE**: Sempre use a mesma porta (recomendado: 8080 via Nginx) para evitar problemas com localStorage. O `localStorage` é isolado por origem (porta diferente = localStorage diferente). Se você fizer login na porta 3000 e depois acessar na 8080, os dados do usuário não estarão sincronizados.

## Estrutura
- Rotas: [src/App.jsx](src/App.jsx)
- Telas (cada uma com seu CSS): [src/screens](src/screens)
- Componentes compartilhados: [src/components](src/components)
- Utils/integração: [src/lib](src/lib)
- Estilos globais/base: [src/index.css](src/index.css) e [src/App.css](src/App.css)
