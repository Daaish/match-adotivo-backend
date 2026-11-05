# Match Adotivo — Backend

Backend da disciplina Desenvolvimento de Aplicações WEB II, com modelo relacional do PDF **Sistema Match de Adoção**.

## Requisitos
- Node.js 22.18+ (ou versão compatível indicada no Laboratório III)
- Docker + Docker Compose

## Iniciar
```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma contract emit
npx prisma db init
npm run dev
```
Acesse http://localhost:3000/. O PostgreSQL é exposto na porta **5433** para evitar conflito com bancos locais existentes na 5432.

## Entidades
Instituicao, Animal, Vacina, AnimalVacina (tabela Animal_Vacina), Adotante e Match.

## Próximas etapas
Criar os módulos `routes → controller → service → repository`, validar os campos com Zod e documentar com Swagger. Implementar as regras RN04 e RN06, inclusive proteção concorrente para aprovações, e adicionar usuários/JWT posteriormente.

> Não versionar `.env`. O arquivo `.env.example` contém apenas valores de desenvolvimento.
