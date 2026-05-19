# PRD — Client Project System

Documento de requisitos do sistema de gestão de clientes, projetos, atividades e status.

---

## Requisitos funcionais

**Autenticação (login):** O usuário deve informar nome de usuário e senha para acessar o sistema. O sistema valida as credenciais contra usuários cadastrados no banco de dados (senha armazenada de forma segura) e, em caso de sucesso, emite um token de acesso (JWT) com validade limitada. Todas as operações de gestão de clientes, projetos, atividades e status exigem esse token em cada requisição. A rota de login é a única acessível sem token. Credenciais inválidas ou token ausente, inválido ou expirado devem impedir o acesso aos demais recursos.

**Usuário inicial:** Na primeira execução, se não existir usuário cadastrado com o nome definido para o administrador padrão, o sistema deve criar automaticamente um usuário administrador para permitir o primeiro acesso (credenciais documentadas no README).

**Papéis de usuário (base):** Cada usuário possui um papel (por exemplo, administrador). A estrutura permite, em evoluções futuras, restringir operações por papel; nesta versão, qualquer usuário autenticado pode usar todos os endpoints protegidos.

**Cadastro de clientes:** Usuários devem ser capazes de cadastrar, consultar, alterar o nome e excluir clientes. O sistema deve permitir listar todos os clientes cadastrados.

**Cadastro de status:** Usuários devem ser capazes de cadastrar, consultar, alterar e excluir status. Cada status possui um tipo (identificado por um código numérico) e uma descrição. O mesmo catálogo de status pode ser usado para classificar projetos e atividades.

**Gestão de projetos:** Usuários devem ser capazes de cadastrar, consultar, alterar e excluir projetos. Todo projeto deve estar vinculado a um cliente existente e a um status. Ao cadastrar ou alterar um projeto, o usuário pode informar uma ou mais atividades que fazem parte desse trabalho.

**Consulta de projetos com atividades:** Ao listar ou consultar projetos, o sistema deve apresentar também as atividades associadas a cada um, para que o acompanhamento do trabalho seja feito em um único lugar.

**Atividades vinculadas ao projeto:** Cada atividade pertence a um único projeto e possui descrição e status próprios. Atividades são criadas, alteradas e removidas no contexto do projeto — não há gestão independente de atividades fora do fluxo de projeto. O usuário pode consultar uma atividade individualmente quando souber seu identificador.

**Alteração de projeto:** Ao atualizar um projeto, a lista de atividades enviada substitui por completo as atividades anteriores daquele projeto.

**Exclusão de projeto:** Ao excluir um projeto, todas as suas atividades devem ser removidas junto com o projeto.

**Integridade dos vínculos:** Não é permitido associar projeto ou atividade a cliente ou status que não existam. O sistema deve informar quando um registro buscado não for encontrado.

**Modelo de negócio:** Um cliente pode ter vários projetos. Um projeto pertence a um cliente e tem um status. Um projeto pode ter várias atividades; cada atividade tem seu próprio status.

---

## Requisitos não funcionais

**Disponibilidade da API:** O sistema deve estar acessível por integração com outros sistemas ou frontends, expondo operações de leitura e escrita de forma consistente.

**Desempenho:** As operações de cadastro e consulta devem atender uso com volume moderado de clientes, projetos e atividades, sem exigência formal de tempo de resposta nesta versão.

**Persistência:** Os dados cadastrados devem ser mantidos de forma durável entre reinicializações do sistema.

**Configuração:** Parâmetros de conexão com o banco de dados e da aplicação devem poder ser ajustados conforme o ambiente (desenvolvimento, homologação, produção).

**Qualidade:** O sistema deve contar com testes automatizados que validem o comportamento principal do cadastro de clientes e a gestão de atividades por projeto.

**Segurança:** O sistema exige autenticação JWT para todas as rotas exceto login. Senhas devem ser armazenadas com hash (BCrypt). A chave de assinatura do token deve ser configurável por ambiente. CORS deve permitir o frontend autorizado e o envio do cabeçalho de autorização.

**Segurança (evolução desejada):** API para cadastro e gestão de usuários; autorização granular por papel (ex.: apenas administrador pode excluir registros); rotação de segredos JWT; políticas de senha e bloqueio de conta.

**Tratamento de erros (evolução desejada):** Falhas e registros inexistentes devem ser comunicados de forma clara e padronizada para quem consome a API.

**Observabilidade:** Deve ser possível registrar e consultar logs das operações para diagnóstico de problemas.

---

## Fora do escopo desta versão

Interface gráfica ou aplicativo mobile (a API já suporta consumo autenticado por frontend); cadastro self-service de novos usuários; múltiplas empresas isoladas no mesmo sistema; histórico de alterações; relatórios, dashboards ou notificações automáticas.

---

Mais detalhes técnicos e de API: [README.md](../README.md) · [DIAGRAMAS.md](./DIAGRAMAS.md)
