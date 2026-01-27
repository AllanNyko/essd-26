# Backend (Laravel 11)

## Endpoints
- Healthcheck: `GET /api/health` → `{ "status": "ok", "service": "backend" }`
- Laravel up endpoint: `GET /up`
 - Cadastro: `POST /api/auth/register`
 - Login: `POST /api/auth/login`
- Recuperar senha: `POST /api/auth/forgot-password`
 - Atualizar usuário: `PATCH /api/users/{id}`
- Upload de materiais: `POST /api/materials/upload`
- Criar quizz: `POST /api/quizzes`
- Próximo quizz (jogo): `GET /api/quizzes/play/next?subject_ids=1,2&exclude_ids=10,11`
- Responder quizz (jogo): `POST /api/quizzes/{id}/answer`
- Iniciar sessão de jogo: `POST /api/game-sessions`
- Encerrar sessão de jogo: `POST /api/game-sessions/close`
- Expirar sessões de jogo: `POST /api/game-sessions/expire`
- Listar matérias: `GET /api/subjects`
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

### Exclusão
- Os endpoints `DELETE` removem o registro definitivamente.
- Próximo quizz: `GET /api/quizzes/next`
- Validar quizz: `POST /api/quizzes/{id}/validate`

## Como testar
1) Suba os containers: `docker compose up -d`
2) Health via Nginx: `curl http://localhost:8080/api/health`
3) Health direto no container: `docker compose exec backend curl http://localhost:9000/api/health`
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
	"notice_id": 2,
	"password": "nova-senha",
	"password_confirmation": "nova-senha"
}
```

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

## Notas
- Banco: MariaDB (serviço `mariadb` no docker-compose), credenciais já ajustadas no `.env`.
- URL pública: http://localhost:8080
