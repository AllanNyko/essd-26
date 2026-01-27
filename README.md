# Projeto ESSD - Guia Geral

## Propósito
Este documento centraliza as regras e orientações gerais para o projeto. **Antes de implementar qualquer alteração**, sempre leia este arquivo e siga as regras aqui descritas.

## Regras Gerais (atualize conforme necessário)
- Sempre leia este README antes de alterar qualquer código.
- Mantenha as documentações de frontend e backend atualizadas.
- Preserve boas práticas de segurança e validação de dados.
- Nunca modifique os elementos do frontend que não sejam solicitados para que haja a integridade dos elementos já implementados
- Sempre que houver a criação de um novo endpoint atualize a documentação do backend

## Estrutura do Projeto
- Frontend: [frontend](frontend)
- Backend: [backend](backend)
- Docker: [docker-compose.yml](docker-compose.yml)

## Convenções de Trabalho
- Frontend: separar telas em diretórios próprios com CSS específico.
- Frontend: respeitar sempre o mobile first.
- Frontend: respeitar a responsividade sempre.
- Backend: usar validação via Form Requests e Eloquent para evitar SQL injection.

## Registro de Atualizações
> Adicione aqui novas regras e decisões ao longo do tempo.

- 2026-01-26: Documento criado para governança do projeto.
- 2026-01-26: Telas de gestão incluem exclusão com confirmação e endpoints DELETE.
- 2026-01-26: Cadastro em 2 etapas com telefone e plano; usuários com vínculo opcional a edital.
- 2026-01-26: Telas de gestão com edição e endpoints GET/PATCH por ID.
- 2026-01-26: Perfil com telefone, edital e indicação do plano atual.
- 2026-01-26: Tela de planos com regra de não downgrade e moeda pt-BR.
- 2026-01-26: Quizz com 3 validações sai da fila; 5 invalidações vai para revisão.
- 2026-01-26: Central de Notas com seleção de matéria e nota.
- 2026-01-26: Notas vinculadas a usuário, edital e matéria.
- 2026-01-26: Central Games com cards de acesso.
- 2026-01-26: Modo Individual com seleção de matérias.
- 2026-01-26: Cards do modo individual e fluxo para tela de jogo.
- 2026-01-26: Modo individual com timer e registro de acertos/erros.
- 2026-01-26: Jogo usa apenas quizzes validados e sem revisão.
- 2026-01-26: Próximo quizz do jogo ignora IDs já respondidos.
- 2026-01-26: Tabela de pontuação por usuário com pontos de quizzes e contribuições.
- 2026-01-27: Quizzes agora armazenam porcentagem de acertos e dificuldade calculada.
- 2026-01-27: Pontuação por modo (individual/survivor) e bônus por tempo em quizzes.
- 2026-01-27: Sessões de jogo registradas para penalizar abandonos/refresh.
