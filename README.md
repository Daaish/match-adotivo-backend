# Match Adotivo — Backend

API do projeto acadêmico de adoção de animais da disciplina Desenvolvimento de Aplicações Web II. Usa Express, TypeScript, PostgreSQL, Prisma, Zod e autenticação por JWT.

## Requisitos

- Node.js 24.12 ou superior e npm.
- PostgreSQL de demonstração com o schema do projeto já preparado. O Docker Compose é opcional e oferece PostgreSQL 16 na porta local `5433`.

## Instalação e configuração

Na pasta do backend, instale as dependências:

```bash
npm ci
```

Em uma configuração nova, copie `.env.example` para `.env`. Preserve o arquivo existente caso o ambiente já esteja configurado. Preencha:

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão do PostgreSQL de demonstração. O exemplo corresponde ao Compose local. |
| `PORT` | Porta HTTP. Use `3000` para corresponder ao proxy atual do frontend. |
| `JWT_SECRET` | Segredo aleatório com pelo menos 32 caracteres. Gere localmente, por exemplo com `openssl rand -hex 32`, e guarde apenas no ambiente local. |

Mantenha o `.env` fora do Git. Use dados fictícios na apresentação. Prepare de antemão uma conta `ADMIN` no banco de demonstração. Os cadastros públicos criam contas `ADOTANTE` e `INSTITUICAO`.

## Execução

Com o PostgreSQL de demonstração já preparado e acessível:

```bash
npm run start
```

Para desenvolvimento com recarga, use `npm run dev`. O Compose pode iniciar o PostgreSQL local com `docker compose up -d db`, mas um volume novo precisa ser preparado com o schema e os dados fictícios antes do ensaio. Os comandos `db:emit` e `db:init` são de preparação, separados da inicialização normal. Durante a apresentação, use o banco já preparado.

- API em `http://localhost:3000/`.
- Swagger em `http://localhost:3000/docs`.
- Checagem de tipos sem escrita no banco com `npm run typecheck`.
