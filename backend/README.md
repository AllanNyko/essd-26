# Backend (Laravel 11)

## Endpoints
- Healthcheck: `GET /api/health` → `{ "status": "ok", "service": "backend" }`
- Laravel up endpoint (framework): `GET /up`
- Cadastro: `POST /api/auth/register` (retorna token)
- Login: `POST /api/auth/login` (retorna token)
- Logout: `POST /api/auth/logout` (requer token - revoga todos os tokens do usuário)
- Recuperar senha: `POST /api/auth/forgot-password`
- Atualizar usuário: `PATCH /api/users/{id}` — aceita `avatar_url` (data URL)
- Upload de materiais: `POST /api/materials/upload`
- Criar quizz: `POST /api/quizzes`
- Próximo quizz (validação): `GET /api/quizzes/next?user_id=1`
- Próximo quizz (jogo): `GET /api/quizzes/play/next?subject_ids=1,2&exclude_ids=10,11`
- Responder quizz (jogo): `POST /api/quizzes/{id}/answer`
- Estatísticas de quizz: `GET /api/quiz-stats?user_id={id}&subject_id={id?}&period_days={7|30|90}`
- Iniciar sessão de jogo: `POST /api/game-sessions`
- Encerrar sessão de jogo: `POST /api/game-sessions/close`
- Expirar sessões de jogo: `POST /api/game-sessions/expire`
- Listar matérias: `GET /api/subjects` (use `only_with_quizzes=1` para jogos)
- Cadastrar matéria: `POST /api/subjects`
- Detalhar matéria: `GET /api/subjects/{id}`
- Atualizar matéria: `PATCH /api/subjects/{id}`
- Excluir matéria: `DELETE /api/subjects/{id}`
- Listar editais: `GET /api/notices`
- Cadastrar edital: `POST /api/notices`
- Detalhar edital: `GET /api/notices/{id}`
- Atualizar edital: `PATCH /api/notices/{id}`
- Excluir edital: `DELETE /api/notices/{id}`
- Listar planos: `GET /api/plans`
- Cadastrar plano: `POST /api/plans`
- Detalhar plano: `GET /api/plans/{id}`
- Atualizar plano: `PATCH /api/plans/{id}`
- Excluir plano: `DELETE /api/plans/{id}`
- Listar notas: `GET /api/notes?user_id={id}`
- Cadastrar nota: `POST /api/notes`
- Consultar pontuação: `GET /api/scores?user_id={id}`
- Atualizar pontuação: `PATCH /api/scores`
- Ranking por média de notas: `GET /api/ranking` (opcional: `notice_id`, `page`, `per_page`)

### Rotas administrativas (requerem autenticação)
- Listar todos os quizzes: `GET /api/admin/quizzes?page={n}&per_page={n}&needs_review={bool}&subject_id={id}`
- Histórico de sessões: `GET /api/admin/game-sessions?page={n}&per_page={n}&user_id={id}&mode={mode}&status={status}`

## Módulo E-Shop (Loja de Equipamentos)

### Vendedores (Vendors)
- Cadastro de vendedor: `POST /api/vendors` (requer autenticação)
- Listar vendedores: `GET /api/vendors` (admin)
- Aprovar vendedor: `PATCH /api/vendors/{id}/approve` (admin)
- Rejeitar vendedor: `PATCH /api/vendors/{id}/reject` (admin)

### Categorias
- Listar categorias: `GET /api/categories?active_only={bool}`
- Criar categoria: `POST /api/categories` (admin)
- Detalhar categoria: `GET /api/categories/{id}`
- Atualizar categoria: `PATCH /api/categories/{id}` (admin)
- Excluir categoria: `DELETE /api/categories/{id}` (admin)

### Produtos
- Listar produtos: `GET /api/products?vendor_id={id}&category_id={id}&status={status}&search={query}&sort_by={field}&sort_order={asc|desc}`
- Criar produto: `POST /api/products` (multipart/form-data, vendedor/admin)
- Detalhar produto: `GET /api/products/{id}`
- Atualizar produto: `PATCH /api/products/{id}` (vendedor/admin)
- Excluir produto: `DELETE /api/products/{id}` (vendedor/admin)
- Adicionar imagens: `POST /api/products/{id}/images` (vendedor/admin)
- Remover imagem: `DELETE /api/products/{id}/images/{imageId}` (vendedor/admin)

### Carrinho
- Ver carrinho: `GET /api/cart` (requer autenticação)
- Adicionar ao carrinho: `POST /api/cart` (body: `product_id`, `quantity`)
- Atualizar quantidade: `PATCH /api/cart/{cartItemId}`
- Remover do carrinho: `DELETE /api/cart/{cartItemId}`
- Limpar carrinho: `DELETE /api/cart`

### Pedidos (Orders)
- Criar pedido: `POST /api/orders` (requer autenticação)
- Listar pedidos do usuário: `GET /api/orders` (requer autenticação)
- Listar pedidos do vendedor: `GET /api/orders/vendor` (vendedor/admin)
- Atualizar status do pedido: `PATCH /api/orders/{id}/status` (vendedor/admin)

### Avaliações
- Criar avaliação: `POST /api/products/{id}/reviews` (requer compra verificada)
- Excluir avaliação: `DELETE /api/reviews/{id}` (autor ou admin)

### Exclusão
- Os endpoints `DELETE` removem o registro definitivamente.
- Próximo quizz (validação): `GET /api/quizzes/next`
- Validar quizz: `POST /api/quizzes/{id}/validate`

## Autenticação com Sanctum

Todas as rotas protegidas exigem um token Bearer no header:
```
Authorization: Bearer {token}
```

### Login/Registro
Ao fazer login ou cadastro, a API retorna:
```json
{
  "message": "Login efetuado com sucesso.",
  "user": { ...dados do usuário... },
  "token": "1|abc123..."
}
```

### Token
- **Expiração**: 24 horas após criação
- **Revogação**: Ao fazer logout, todos os tokens do usuário são revogados
- **Erro 401**: Token inválido ou expirado retorna `{"message": "Unauthenticated."}`

### Rotas Públicas (não exigem token)
- `GET /api/health`
- `GET /api/ranking`
- `GET /api/subjects`
- `GET /api/notices`
- `GET /api/plans`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

### Rotas Protegidas (exigem token)
Todas as outras rotas (criar, editar, deletar, upload, jogo, e-shop, etc.)

## Roles e Permissões

### Sistema de Roles
- **student**: usuário padrão, acesso a jogos, materiais e loja
- **vendor**: vendedor aprovado, pode gerenciar produtos e pedidos
- **admin**: acesso total ao sistema

### Controle de Acesso E-Shop
- Qualquer usuário autenticado pode se cadastrar como vendedor
- Admin aprova/rejeita cadastros de vendedores
- Apenas vendedores aprovados podem criar produtos
- Vendedores só gerenciam seus próprios produtos
- Admin pode gerenciar todos os produtos

## Validação em Português

Todas as mensagens de validação foram traduzidas para pt_BR:
- Configuração: `config/app.php` → `locale => 'pt_BR'`
- Traduções: `lang/pt_BR/validation.php`
- Exemplos: "O campo descrição deve ter pelo menos 10 caracteres", "O preço é obrigatório"

## Padrão de resposta da API
### Sucesso
```json
{
	"message": "Operação realizada com sucesso.",
	"data": {},
	"meta": {
		"page": 1,
		"per_page": 10,
		"total": 100,
		"last_page": 10
	}
}
```

### Erro
```json
{
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Os dados informados são inválidos.",
		"details": {
			"field": ["Mensagem de validação"]
		}
	}
}
```

## Catálogo de erros
- `400`: requisição inválida (payload malformado).
- `401`: não autenticado (token ausente/expirado).
- `403`: proibido (sem permissão).
- `404`: recurso não encontrado.
- `409`: conflito (ex.: validação duplicada).
- `422`: erro de validação.
- `500`: erro inesperado.

### Exemplos de erro
**Login inválido** (`POST /api/auth/login`)
```json
{
	"error": {
		"code": "AUTH_INVALID_CREDENTIALS",
		"message": "E-mail ou senha inválidos."
	}
}
```

**Resposta de quizz inválida** (`POST /api/quizzes/{id}/answer`)
```json
{
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Os dados informados são inválidos.",
		"details": {
			"game_mode": ["O modo de jogo é obrigatório."],
			"time_left": ["O tempo deve estar entre 0 e 20."]
		}
	}
}
```

## Como testar
1) Suba os containers: `docker compose up -d`
2) Health via Nginx: `curl http://localhost:8080/api/health`
3) Health direto no backend: `docker compose exec backend curl http://localhost:9000/api/health` (se necessário expor)
4) Rodar migrations: `docker compose exec backend php artisan migrate`
5) Seed inicial de matérias: já criado via migration `create_subjects_table`

## Payloads esperados (frontend)
### Cadastro
```json
{
	"name": "Joana Silva",
	"email": "joana@email.com",
	"phone": "11999999999",
	"plan_id": 1,
	"notice_id": 2,
	"password": "sua-senha",
	"password_confirmation": "sua-senha"
}
```

### Login
```json
{
	"email": "joana@email.com",
	"password": "sua-senha"
}
```

### Recuperar senha
```json
{
	"email": "joana@email.com"
}
```

### Atualizar dados
```json
{
	"name": "Novo Nome",
	"email": "novo@email.com",
	"phone": "11999999999",
	"avatar_url": "data:image/png;base64,...",
	"notice_id": 2,
	"password": "nova-senha",
	"password_confirmation": "nova-senha"
}
```

Notas:
- `avatar_url` deve ser enviado como data URL (base64). A coluna no banco é `LONGTEXT` para comportar imagens maiores.

### Upload de materiais (multipart/form-data)
- Campos: `user_id`, `subject_id`, `type`, `file`
- `type`: `apostila` | `resumo` | `mapa-mental`

### Listar matérias
Retorna array de matérias com `id` e `name`.

### Cadastrar matéria
```json
{
	"name": "Matemática"
}
```

### Atualizar matéria
```json
{
  "name": "Matemática avançada"
}
```

### Cadastrar edital
```json
{
	"name": "Edital 2026",
	"observation": "Observação curta"
}
```

### Atualizar edital
```json
{
	"name": "Edital 2026 - Revisado",
	"observation": "Observação curta"
}
```

### Cadastrar plano
```json
{
	"name": "Plano avançado",
	"price": 99.9,
	"coverage": "Conteúdo completo do curso, simulados e suporte.",
	"audience": "Alunos do curso de formação"
}
```

### Atualizar plano
```json
{
  "name": "Plano avançado",
  "price": 119.9,
  "coverage": "Conteúdo completo do curso, simulados e suporte.",
  "audience": "Alunos do curso de formação"
}
```

### Cadastrar nota
```json
{
	"user_id": 1,
	"notice_id": 2,
	"subject_id": 3,
	"score": 8.5
}
```

**Regra:** o usuário pode registrar uma nota por matéria para cada edital. Para o mesmo `user_id` e `subject_id`, é permitido repetir a nota quando o `notice_id` for diferente.

### Criar quizz
```json
{
	"user_id": 1,
	"subject_id": 1,
	"question": "Pergunta com no mínimo 20 caracteres",
	"option_one": "Alternativa correta",
	"option_two": "Alternativa errada",
	"option_three": "Alternativa errada",
	"option_four": "Alternativa errada"
}
```

### Validar quizz
```json
{
	"action": "validate", // ou "invalidate"
	"user_id": 1
}
```

### Responder quizz (jogo)
```json
{
	"user_id": 1,
	"selected_option": "Alternativa correta",
	"timed_out": false,
	"game_mode": "individual",
	"time_left": 12
}
```

### Estatísticas de quizz
Retorna total de acertos/erros e o detalhamento por matéria.

Exemplo de resposta:
```json
{
	"stats": {
		"total_questions": 40,
		"hits": 28,
		"errors": 12,
		"accuracy_percentage": 70
	},
	"subjects": [
		{
			"subject_id": 1,
			"subject_name": "Matemática",
			"total_questions": 12,
			"hits": 9,
			"errors": 3,
			"accuracy_percentage": 75
		}
	]
}
```

### Ranking
Retorna a média das notas por usuário, ordenada de forma decrescente.

Parâmetros de query:
- `notice_id` (opcional): filtrar por edital específico
- `page` (opcional): página atual (padrão: 1)
- `per_page` (opcional): itens por página (padrão: 15)

Exemplo de resposta:
```json
{
	"ranking": [
		{
			"id": 4,
			"name": "Usuario 01",
			"email": "user01@essd.local",
			"average_score": 7.5,
			"total_score": 22.5,
			"total_notes": 3
		}
	],
	"meta": {
		"current_page": 1,
		"per_page": 15,
		"total": 50,
		"last_page": 4
	}
}
```

## Ranking por média de notas
Retorna a média das notas por usuário, ordenada de forma decrescente.

Exemplo de resposta:
```json
{
	"ranking": [
		{
			"id": 4,
			"name": "Usuario 01",
			"email": "user01@essd.local",
			"average_score": 7.5,
			"total_score": 22.5,
			"total_notes": 3
		}
	]
}
```

## Colunas de desempenho dos quizzes
- `hits`: número de acertos acumulados.
- `errors`: número de erros acumulados.
- `invalidate_count`: número de invalidações acumuladas.
- `needs_review`: indica revisão após 5 invalidações.
- `accuracy_percentage`: porcentagem de acertos calculada com `(hits / (hits + errors)) * 100`.
- `difficulty_label`: classificação baseada na porcentagem (Difícil < 30%, Média >= 30% e < 70%, Fácil >= 70%).

## Pontuação do usuário
- `quiz_points`: soma geral de pontos em quizzes.
- `individual_hits` / `individual_errors`: acertos e erros no modo individual.
- `survivor_hits` / `survivor_errors`: acertos e erros no modo survivor.
- `individual_points` / `survivor_points`: pontos acumulados por modo.

## Regras de jogo
- O modo de jogo usa apenas quizzes validados (>= 3 validações) e sem revisão.
- Sessões em andamento expiradas são marcadas como erro automaticamente.
- Fechamento/expiração de sessão é idempotente (penaliza somente uma vez).
- O endpoint de jogo aceita `subject_ids` e `exclude_ids` para filtrar e evitar repetição.

## Notas técnicas
- Banco: MariaDB (serviço `mariadb` no docker-compose), credenciais já configuradas em `.env`.
- URL pública: http://localhost:8080
- Autenticação: Laravel Sanctum com tokens Bearer (expiração de 24 horas).
- Paginação: implementada para ranking, listagem de quizzes e histórico de sessões.

## Melhorias futuras
- Criar testes automatizados para fluxos críticos (autenticação, validação de quizzes, sessões de jogo).
- Implementar refresh tokens para renovação automática antes da expiração.
- Adicionar rate limiting para proteção contra abuso de API.
