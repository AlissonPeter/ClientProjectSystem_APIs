# Architectural Decision Record (ADR)

## Contexto
O projeto é um marketplace simplificado para compra e venda de eletrônicos usados, similar ao OLX ou Mercado Livre enxuto. Requer cadastro de usuários, listagem de produtos, carrinho de compras e fluxo de checkout.

## Decisão
Adotaremos uma arquitetura de Monólito Modular em Java, utilizando Spring Boot para facilitar o desenvolvimento e a manutenção.

## Stack Tecnológica
- **Linguagem**: Java 17
- **Framework**: Spring Boot 3.x para backend (MVC, Security, Data JPA)
- **Banco de Dados**: H2 (para desenvolvimento) e PostgreSQL (para produção)
- **Frontend**: Thymeleaf para templates HTML, com Tailwind CSS para estilização
- **Build Tool**: Maven
- **Versionamento**: Git
- **Deploy**: JAR executável ou containerizado com Docker

## Justificativa
- Monólito Modular permite desenvolvimento rápido e simples para um projeto enxuto, evitando complexidade desnecessária de microserviços.
- Spring Boot é maduro, tem boa comunidade e facilita integração com banco de dados e segurança.
- H2 para prototipagem rápida, PostgreSQL para produção.
- Thymeleaf integra bem com Spring, Tailwind para UI moderna e responsiva.
- Maven para gerenciamento de dependências.

## Consequências
- Fácil de escalar verticalmente inicialmente.
- Para crescimento futuro, pode ser decomposto em microserviços se necessário.
