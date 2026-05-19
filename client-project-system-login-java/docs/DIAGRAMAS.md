# Diagramas — Client Project System

Documentação visual da **regra de negócio** da API REST de gestão de clientes, projetos, atividades e status, incluindo **autenticação por login e JWT**.

---

### Regras de acesso

| Rota | Autenticação | Observação |
|------|--------------|------------|
| `POST /login` | Não | Retorna token JWT |
| Demais rotas (`/clients`, `/projects`, `/activities`, `/status`, etc.) | Sim (Bearer JWT) | Sessão stateless; token válido por 10 horas |

---

## Diagrama de classes (`com.system.model`)

Diagrama UML das quatro entidades JPA do pacote `com.system.model`, com atributos, associações e anotações de mapeamento presentes no código.

```mermaid
classDiagram
    direction TB

    class Client {
        <<Entity>>
        -Integer id
        -String name
    }

    class Project {
        <<Entity>>
        -Integer id
        -String description
        -Client client
        -List~Activity~ activities
        -Status status
    }

    class Activity {
        <<Entity>>
        -Integer id
        -Project project
        -String description
        -Status status
    }

    class Status {
        <<Entity>>
        -Integer id
        -Integer kind
        -String description
    }

    class Login {
        <<Entity>>
        -Long id
        -String username
        -String password
        -String role
    }

    note for Login "Implementa UserDetails;\nsenha em BCrypt no banco"

    Client "1" --> "0..*" Project : client
    Project "0..*" --> "1" Status : status
    Project "1" --> "0..*" Activity : activities
    Activity "0..*" --> "1" Status : status
```

### Mapeamento JPA (pacote `model`)

| Classe | Atributo | Anotação | Coluna / observação |
|--------|----------|----------|---------------------|
| `Client` | `id` | `@Id`, `@GeneratedValue(IDENTITY)` | PK |
| `Client` | `name` | `@Column(length=150, nullable=false)` | |
| `Project` | `id` | `@Id`, `@GeneratedValue(IDENTITY)` | PK |
| `Project` | `description` | `@Column(length=150, nullable=false)` | |
| `Project` | `client` | `@ManyToOne`, `@JoinColumn(client_id)` | FK → `Client` |
| `Project` | `status` | `@ManyToOne`, `@JoinColumn(status_id)` | FK → `Status` |
| `Project` | `activities` | `@Transient`, `@OneToMany(mappedBy=project)` | Não persistido como coleção |
| `Activity` | `id` | `@Id`, `@GeneratedValue(IDENTITY)` | PK |
| `Activity` | `project` | `@ManyToOne(cascade=ALL)`, `@JoinColumn(project_id)` | FK → `Project` |
| `Activity` | `description` | `@Column(length=100, nullable=false)` | |
| `Activity` | `status` | `@ManyToOne(cascade=ALL)`, `@JoinColumn(status_id)` | FK → `Status` |
| `Status` | `id` | `@Id`, `@GeneratedValue(IDENTITY)` | PK |
| `Status` | `kind` | `@Column(nullable=false)` | |
| `Status` | `description` | `@Column(length=100, nullable=false)` | |
| `Login` | `id` | `@Id`, `@GeneratedValue(IDENTITY)` | PK |
| `Login` | `username` | `@Column(unique=true, nullable=false)` | Usado no login |
| `Login` | `password` | `@Column(nullable=false)` | Hash BCrypt |
| `Login` | `role` | — | Ex.: `ADMIN` → `ROLE_ADMIN` |

`Activity.project` é omitido na serialização JSON (`@JsonIgnore` no getter).

`Login` não se relaciona com Client/Project; representa o **usuário do sistema** que acessa a API.

### Componentes de segurança (fora do pacote `model`)

```mermaid
flowchart LR
    subgraph config [com.system.config]
        SC[SecurityConfig]
        DI[DataBaseInitializer]
    end
    subgraph jwt [com.system.jwt]
        JS[JwtService]
        JF[JwtAuthFilter]
    end
    subgraph web [com.system.controller]
        LC[LoginController]
    end
    subgraph svc [com.system.service]
        LS[LoginService]
    end

    LC --> JS
    LC --> AM[AuthenticationManager]
    JF --> JS
    JF --> LS
    SC --> JF
    DI --> LR[(LoginRepository)]
    LS --> LR
```

---

## Fluxos de negócio principais

### Ciclo de vida do projeto

```mermaid
flowchart TD
    A[POST /projects] --> B[Validar Client e Status por id]
    B --> C[Persistir Project]
    C --> D[Para cada Activity: vincular Project e Status]
    D --> E[ActivityService.saveAll]

    F[PUT /projects] --> G[Carregar Project existente]
    G --> H[Atualizar description, client, status]
    H --> I[deleteByProjectId]
    I --> J[Reinserir atividades]
    J --> K[saveOrUpdate Project]

    L[DELETE /projects/id] --> M[deleteByProjectId]
    M --> N[deleteById Project]

    O[GET /projects/all] --> P[findAll Projects]
    P --> Q[Para cada Project: getByProjectId]
```

### Escopo dos recursos

| Recurso   | CRUD completo via API | Autenticação | Observação |
|-----------|----------------------|--------------|------------|
| Login     | Não (apenas `POST /login`) | Público no login | Emite JWT; sem CRUD de usuários na API |
| Client    | Sim (`/clients`)     | JWT obrigatório | Atualização de nome via query param |
| Status    | Sim (`/status`)      | JWT obrigatório | Catálogo compartilhado por projetos e atividades |
| Project   | Sim (`/projects`)    | JWT obrigatório | Criação/atualização inclui lista de atividades |
| Activity  | Parcial (`GET` apenas) | JWT obrigatório | Criação, substituição e exclusão somente pelo fluxo de **Project** |

---

## Legenda

| Símbolo / termo | Significado |
|-----------------|-------------|
| `<<Entity>>` | Classe anotada com `@Entity` em `com.system.model` |
| `@Transient` | Atributo presente no modelo, sem coluna própria no banco |
| Multiplicidades | Derivadas de `@ManyToOne` / `@OneToMany` no lado proprietário da associação |

---

## Referência

Detalhes de endpoints, exemplos HTTP e configuração: [README.md](../README.md).
