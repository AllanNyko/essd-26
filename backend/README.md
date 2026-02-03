# Backend (Laravel 11)

## Endpoints
- Healthcheck: `GET /api/health` → `{ "status": "ok", "service": "backend" }`
- Laravel up endpoint (framework): `GET /up`
- Cadastro: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Recuperar senha: `POST /api/auth/forgot-password`
- Atualizar usuário: `PATCH /api/users/{id}` (auth planejada) — aceita `avatar_url` (data URL)
- Upload de materiais: `POST /api/materials/upload`
- Criar quizz: `POST /api/quizzes`
- Próximo quizz (validação): `GET /api/quizzes/next?user_id=1`
- Próximo quizz (jogo): `GET /api/quizzes/play/next?subject_ids=1,2&exclude_ids=10,11`
- Responder quizz (jogo): `POST /api/quizzes/{id}/answer`
- Estatísticas de quizz: `GET /api/quiz-stats?user_id={id}&subject_id={id?}&period_days={7|30|90}`
- Iniciar sessão de jogo: `POST /api/game-sessions`
- Encerrar sessão de jogo: `POST /api/game-sessions/close`
- Expirar sessões de jogo: `POST /api/game-sessions/expire`
- Listar matérias: `GET /api/subjects` (use `only_with_quizzes=1` para jogos) (paginação planejada)
- Cadastrar matéria: `POST /api/subjects`
- Detalhar matéria: `GET /api/subjects/{id}`
- Atualizar matéria: `PATCH /api/subjects/{id}`
- Excluir matéria: `DELETE /api/subjects/{id}`
- Listar editais: `GET /api/notices` (paginação planejada)
- Cadastrar edital: `POST /api/notices`
- Detalhar edital: `GET /api/notices/{id}`
- Atualizar edital: `PATCH /api/notices/{id}`
- Excluir edital: `DELETE /api/notices/{id}`
- Listar planos: `GET /api/plans` (paginação planejada)
- Cadastrar plano: `POST /api/plans`
- Detalhar plano: `GET /api/plans/{id}`
- Atualizar plano: `PATCH /api/plans/{id}`
- Excluir plano: `DELETE /api/plans/{id}`
- Listar notas: `GET /api/notes?user_id={id}` (paginação planejada)
- Cadastrar nota: `POST /api/notes`
- Consultar pontuação: `GET /api/scores?user_id={id}` (auth planejada)
- Atualizar pontuação: `PATCH /api/scores` (auth planejada)
- Ranking por média de notas: `GET /api/ranking` (opcional: `notice_id`)

### Exclusão
- Os endpoints `DELETE` removem o registro definitivamente.
- Próximo quizz (validação): `GET /api/quizzes/next`
- Validar quizz: `POST /api/quizzes/{id}/validate`

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

## Autenticação e paginação (planejamento)
- Autenticação robusta será aplicada via tokens (Sanctum ou JWT).
- Endpoints marcados como `auth planejada` passarão a exigir `Authorization: Bearer <token>`.
- Endpoints marcados como `paginação planejada` retornarão `meta` com `page`, `per_page`, `total` e `last_page`.

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

## Colunas de desempenho
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

## Notas
- Banco: MariaDB (serviço `mariadb` no docker-compose), credenciais já configuradas em `.env`.
- URL pública: http://localhost:8080
- Autenticação atual retorna o usuário em JSON (sem token). Proteções adicionais podem ser adicionadas com Sanctum/JWT.
