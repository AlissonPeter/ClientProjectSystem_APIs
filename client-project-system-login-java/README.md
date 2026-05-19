# Client Project System

API REST em **Spring Boot** para cadastro e gestão de **clientes**, **projetos**, **atividades** e **status**. O sistema permite associar projetos a clientes, vincular atividades a cada projeto e classificar projetos e atividades por status.

---

## Índice

- [Visão geral](#visão-geral)
- [Autenticação (login)](#autenticação-login)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Modelo de dados](#modelo-de-dados)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como executar](#como-executar)
- [API REST](#api-rest)
- [Exemplos de requisições](#exemplos-de-requisições)
- [Testes](#testes)
- [Empacotamento](#empacotamento)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Observações e melhorias futuras](#observações-e-melhorias-futuras)

---

## Visão geral

O **Client Project System** expõe endpoints HTTP para operações CRUD (com variações por recurso) sobre quatro entidades principais:

| Entidade   | Descrição |
|-----------|-----------|
| **Client** | Cliente que contrata ou possui projetos |
| **Project** | Projeto vinculado a um cliente e a um status |
| **Activity** | Atividade pertencente a um projeto, com status próprio |
| **Status** | Estado genérico (tipo `kind` + descrição), usado por projetos e atividades |

A aplicação sobe na porta **8081** por padrão e persiste dados em **PostgreSQL**. O Hibernate cria/atualiza o schema automaticamente (`ddl-auto=update`).

**Acesso protegido:** todas as rotas da API, exceto `POST /login`, exigem um token **JWT** obtido após login com usuário e senha válidos.

---

## Autenticação (login)

O sistema usa **Spring Security** com autenticação **stateless** via **JWT** (biblioteca JJWT). O fluxo é:

1. Enviar credenciais para `POST /login`.
2. Receber o token JWT no corpo da resposta (texto plano).
3. Incluir o token em todas as demais requisições no cabeçalho `Authorization: Bearer <token>`.

### Endpoint de login — `/login`

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/login` | Não necessária | Valida usuário/senha e retorna token JWT |

**Corpo da requisição (JSON):**

```json
{
  "username": "alisson",
  "password": "alisson123"
}
```

**Resposta de sucesso:** `200 OK` com o token JWT no corpo (string).

**Resposta de falha:** `401 Unauthorized` com mensagem `"Credenciais inválidas"` (ou exceção padrão do Spring Security em credenciais incorretas).

### Uso do token nas demais rotas

```http
GET /clients/all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- O token expira em **10 horas** após a emissão.
- Requisições sem token ou com token inválido/expirado retornam **401 Unauthorized**.
- Apenas `/login` é público; demais endpoints exigem autenticação.

### Usuário padrão (primeira execução)

Na subida da aplicação, `DataBaseInitializer` cria um usuário administrador se ainda não existir:

| Campo | Valor |
|-------|-------|
| `username` | `alisson` |
| `password` | `alisson123` |
| `role` | `ADMIN` |

A senha é armazenada com **BCrypt**. Em produção, altere ou remova esse usuário padrão e use credenciais seguras.

### Configuração JWT

| Propriedade | Descrição |
|-------------|-----------|
| `jwt.secret` | Chave secreta em Base64 para assinatura HS256 do token (definida em `application.properties`) |

Exemplo com variável de ambiente:

```properties
jwt.secret=${JWT_SECRET:sua-chave-base64-aqui}
```

### CORS e frontend

O `SecurityConfig` restringe CORS à origem `http://localhost:4200` (Angular ou outro frontend local) e permite o cabeçalho `Authorization`. Os controllers ainda declaram `@CrossOrigin(origins = "*")`; em produção, alinhe CORS apenas na configuração de segurança.

### Papéis (roles)

A entidade `Login` possui campo `role` (ex.: `ADMIN`). O Spring Security expõe como `ROLE_<role>`. Restrições por papel (ex.: apenas `ADMIN` em `DELETE`) estão preparadas em comentários no `SecurityConfig`, mas **não estão ativas** nesta versão — qualquer usuário autenticado acessa todos os endpoints protegidos.

---

## Tecnologias

| Tecnologia | Versão / uso |
|------------|----------------|
| Java | 17 |
| Spring Boot | 3.3.2 |
| Spring Web | API REST |
| Spring Security | Autenticação e autorização |
| Spring Data JPA | Persistência |
| Hibernate | ORM |
| PostgreSQL | Banco em execução normal |
| H2 | Escopo de teste (`pom.xml`) |
| JUnit 5 | Testes unitários e de integração |
| Mockito | Mocks em testes de controller/service |
| Maven | Build e dependências |
| JJWT (jjwt) | Geração e validação de tokens JWT |

Dependências comentadas no `pom.xml` indicam planejamento anterior para **AWS Lambda** (`aws-lambda-java-core`, `spring-cloud-function-adapter-aws`), não ativas nesta versão.

---

## Arquitetura

O projeto segue uma arquitetura em camadas típica de Spring Boot:

```
┌─────────────────────────────────────────┐
│  JwtAuthFilter + SecurityFilterChain    │
├─────────────────────────────────────────┤
│  Controllers  (REST, @RestController)   │
├─────────────────────────────────────────┤
│  Services     (regras e orquestração)   │
├─────────────────────────────────────────┤
│  Repositories (Spring Data JPA)         │
├─────────────────────────────────────────┤
│  PostgreSQL                             │
└─────────────────────────────────────────┘
```

| Camada | Pacote | Responsabilidade |
|--------|--------|------------------|
| Segurança | `com.system.config`, `com.system.jwt` | Spring Security, filtro JWT, CORS, BCrypt |
| Entrada | `com.system.controller` | Mapeamento HTTP (incl. `LoginController`), delegação aos services |
| Negócio | `com.system.service` | CRUD, `LoginService` (`UserDetailsService`), atividades por projeto |
| Persistência | `com.system.repository` | Interfaces `JpaRepository` e queries customizadas |
| Domínio | `com.system.model` | Entidades JPA (incl. `Login`) |

O **CORS** global é definido em `SecurityConfig` (origem `http://localhost:4200` e cabeçalho `Authorization`). Os controllers de negócio ainda usam `@CrossOrigin(origins = "*")` — em produção, prefira uma única configuração centralizada.

---

## Modelo de dados

Relacionamento entre entidades:

```
Client (1) ──────< (N) Project (1) ──────< (N) Activity
                      │                        │
                      └──── Status (N:1) ──────┘
```

### Client

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | Integer | Gerado automaticamente |
| `name` | String | Obrigatório, até 150 caracteres |

### Project

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | Integer | Gerado automaticamente |
| `description` | String | Obrigatório, até 150 caracteres |
| `client` | Client | FK `client_id` |
| `status` | Status | FK `status_id` |
| `activities` | List&lt;Activity&gt; | Campo `@Transient` no modelo; preenchido na listagem e no create/update |

### Activity

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | Integer | Gerado automaticamente |
| `description` | String | Obrigatório, até 100 caracteres |
| `project` | Project | FK `project_id` (omitido no JSON com `@JsonIgnore`) |
| `status` | Status | FK `status_id` |

### Status

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | Integer | Gerado automaticamente |
| `kind` | Integer | Classificação numérica do tipo de status |
| `description` | String | Obrigatório, até 100 caracteres |

### Login (usuário do sistema)

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | Long | Gerado automaticamente |
| `username` | String | Único, obrigatório |
| `password` | String | Hash BCrypt, obrigatório |
| `role` | String | Papel (ex.: `ADMIN`); usado como `ROLE_<role>` no Spring Security |

Não há endpoints públicos para cadastro de usuários; o usuário inicial é criado por `DataBaseInitializer` na primeira execução.

---

## Pré-requisitos

- **JDK 17** ou superior
- **Maven 3.6+** (ou use o wrapper `./mvnw` / `mvnw.cmd`)
- **PostgreSQL** em execução com um banco criado, por exemplo:

```sql
CREATE DATABASE db_clientprojectsystem;
```

---

## Configuração

As propriedades ficam em `src/main/resources/application.properties`:

| Propriedade | Valor padrão (local) | Descrição |
|-------------|----------------------|-----------|
| `server.port` | `8081` | Porta HTTP da API |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/db_clientprojectsystem` | URL JDBC |
| `spring.datasource.username` | `postgres` | Usuário do banco |
| `spring.datasource.password` | `postgres` | Senha do banco |
| `spring.jpa.hibernate.ddl-auto` | `update` | Atualiza schema automaticamente |
| `spring.jpa.show-sql` | `true` | Log SQL no console |
| `jwt.secret` | *(ver `application.properties`)* | Chave Base64 para assinatura do JWT |

Para ambientes diferentes (dev, homologação, produção), prefira variáveis de ambiente ou profiles Spring em vez de commitar credenciais. Exemplo com variáveis:

```properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/db_clientprojectsystem}
spring.datasource.username=${DATABASE_USER:postgres}
spring.datasource.password=${DATABASE_PASSWORD:postgres}
```

---

## Como executar

### Desenvolvimento

```bash
# Na raiz do projeto
./mvnw spring-boot:run
```

No Windows:

```cmd
mvnw.cmd spring-boot:run
```

A API ficará disponível em: `http://localhost:8081`

### Compilar e gerar JAR

```bash
./mvnw clean package
java -jar target/client-project-system-0.0.1-SNAPSHOT.jar
```

A classe principal é `com.system.ClientProjectSystemApplication`.

---

## API REST

Base URL: `http://localhost:8081`

**Importante:** exceto `POST /login`, todos os endpoints abaixo exigem o cabeçalho `Authorization: Bearer <token>`.

### Autenticação — `/login`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/login` | Autentica com `username` e `password` no body JSON; retorna token JWT |

### Clientes — `/clients`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clients/{id}` | Busca cliente por ID |
| `GET` | `/clients/all` | Lista todos os clientes |
| `POST` | `/clients` | Cria cliente (body JSON) |
| `PUT` | `/clients/{id}?name={nome}` | Atualiza nome do cliente |
| `DELETE` | `/clients/{id}` | Remove cliente |

### Projetos — `/projects`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/projects/{id}` | Busca projeto por ID |
| `GET` | `/projects/all` | Lista projetos (com atividades carregadas) |
| `POST` | `/projects` | Cria projeto e atividades associadas |
| `PUT` | `/projects` | Atualiza projeto (substitui atividades) |
| `DELETE` | `/projects/{id}` | Remove atividades do projeto e depois o projeto |

Na criação/atualização, o body deve referenciar `client` e `status` por `id`, e pode incluir lista `activities` com `description` e `status.id`.

### Atividades — `/activities`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/activities/{id}` | Busca atividade por ID |

Não há endpoints públicos para criar, listar ou excluir atividades isoladamente; o fluxo principal é via **Project** (`POST`/`PUT` em `/projects`).

### Status — `/status`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/status/{id}` | Busca status por ID |
| `GET` | `/status/all` | Lista todos os status |
| `POST` | `/status` | Cria status (body JSON) |
| `PUT` | `/status/{id}?description={texto}&kind={numero}` | Atualiza status |
| `DELETE` | `/status/{id}` | Remove status |

### Códigos de resposta e erros

- Operações bem-sucedidas costumam retornar **200 OK** com corpo JSON quando aplicável.
- **401 Unauthorized:** credenciais inválidas no login, token ausente, inválido ou expirado.
- Recursos não encontrados disparam `RuntimeException` com mensagens como `"Client not found"`, `"Project not found"`, etc. (sem tratamento global padronizado de exceções).
- Falhas na criação de projeto retornam erro encapsulado: `"Erro ao criar o projeto: ..."`.

---

## Exemplos de requisições

### Login (obter token)

```http
POST /login
Content-Type: application/json

{
  "username": "alisson",
  "password": "alisson123"
}
```

Resposta (exemplo): corpo com a string do token JWT. Use-a nas requisições seguintes:

```http
Authorization: Bearer <token-retornado>
```

### Criar cliente

```http
POST /clients
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>

{
  "name": "Empresa ABC"
}
```

### Criar status

```http
POST /status
Content-Type: application/json

{
  "kind": 1,
  "description": "Em andamento"
}
```

### Criar projeto com atividades

```http
POST /projects
Content-Type: application/json

{
  "description": "Sistema de faturamento",
  "client": { "id": 1 },
  "status": { "id": 1 },
  "activities": [
    {
      "description": "Levantamento de requisitos",
      "status": { "id": 1 }
    },
    {
      "description": "Desenvolvimento da API",
      "status": { "id": 1 }
    }
  ]
}
```

### Atualizar cliente

```http
PUT /clients/1?name=Nova%20Empresa%20ABC
```

### Listar todos os projetos

```http
GET /projects/all
```

---

## Testes

Execute a suíte com:

```bash
./mvnw test
```

| Classe de teste | Tipo | O que cobre |
|-----------------|------|-------------|
| `ClientControllerTest` | `@WebMvcTest` | Endpoints HTTP de clientes (MockMvc + mock do service) |
| `ClientServiceTest` | Unitário (Mockito) | `findById`, `saveOrUpdate`, `deleteById`, `findAll` |
| `ActivityRepositoryTest` | `@DataJpaTest` | Queries `loadByProjectId` e `deleteByProjectId` |

O teste de repositório de atividades usa `@AutoConfigureTestDatabase(replace = NONE)`, ou seja, espera o banco configurado (PostgreSQL) em vez do H2 em memória padrão do Spring Boot Test.

---

## Empacotamento

- **spring-boot-maven-plugin**: gera JAR executável com dependências (`repackage`).
- **maven-jar-plugin**: define `Main-Class` como `com.system.ClientProjectSystemApplication`.
- Recurso `application.properties` é copiado explicitamente para o output do build.

---

## Estrutura do projeto

```
client-project-system/
├── pom.xml
├── mvnw / mvnw.cmd
├── src/
│   ├── main/
│   │   ├── java/com/system/
│   │   │   ├── ClientProjectSystemApplication.java
│   │   │   ├── config/         # SecurityConfig, DataBaseInitializer
│   │   │   ├── controller/     # Client, Project, Activity, Status, Login
│   │   │   ├── jwt/            # JwtService, JwtAuthFilter
│   │   │   ├── service/        # Lógica de negócio + LoginService
│   │   │   ├── repository/     # JPA + queries customizadas
│   │   │   └── model/          # Entidades JPA (incl. Login)
│   │   └── resources/
│   │       └── application.properties
│   └── test/java/com/system/   # Testes unitários e de integração
├── README.md
└── docs/
    ├── PRD.md                  # Requisitos do produto
    └── DIAGRAMAS.md            # Diagramas UML (Mermaid)
```

---

## Observações e melhorias futuras

- **Cadastro de usuários**: não há API para criar ou alterar usuários; apenas o usuário padrão via `DataBaseInitializer`.
- **Autorização por papel**: `role` existe na entidade `Login`, mas regras `hasRole("ADMIN")` permanecem comentadas no `SecurityConfig`.
- **Validação**: `spring-boot-starter-validation` está presente; as entidades não usam anotações `@NotNull` / `@Size` nos controllers — validação é principalmente via constraints JPA.
- **Tratamento de erros**: não há `@ControllerAdvice` para respostas HTTP padronizadas (404, 400, 500).
- **Segurança**: revisar `jwt.secret`, usuário padrão, CORS duplicado (`SecurityConfig` vs `@CrossOrigin`) e credenciais de banco antes de produção.
- **Campo `activities` em `Project`**: marcado como `@Transient`, então não é persistido como coleção JPA direta; atividades são gerenciadas via `ActivityService` e `ActivityRepository`.
- **AWS Lambda**: dependências comentadas sugerem deploy serverless futuro, não configurado neste repositório.

---

## Licença

Não há arquivo de licença no repositório. Defina a licença adequada antes de distribuir o projeto.

---

## Contato e contribuição

Para contribuir: faça fork, crie uma branch, implemente as alterações, execute `./mvnw test` e abra um pull request descrevendo o escopo da mudança.
