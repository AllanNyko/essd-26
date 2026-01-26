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
- Listar matérias: `GET /api/subjects`
- Cadastrar matéria: `POST /api/subjects`
- Excluir matéria: `DELETE /api/subjects/{id}`
- Listar editais: `GET /api/notices`
- Cadastrar edital: `POST /api/notices`
- Excluir edital: `DELETE /api/notices/{id}`
- Listar planos: `GET /api/plans`
- Cadastrar plano: `POST /api/plans`
- Excluir plano: `DELETE /api/plans/{id}`

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

### Cadastrar edital
```json
{
	"name": "Edital 2026"
}
```

### Cadastrar plano
```json
{
	"name": "Plano avançado"
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
	"action": "validate" // ou "invalidate"
}
```

## Colunas de desempenho
- `hits`: número de acertos acumulados.
- `errors`: número de erros acumulados.
- `invalidate_count`: número de invalidações acumuladas.

## Notas
- Banco: MariaDB (serviço `mariadb` no docker-compose), credenciais já ajustadas no `.env`.
- URL pública: http://localhost:8080
