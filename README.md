# 📦 Delivery Tracker API (Atividades 05 e 06)

Uma API REST desenvolvida em Node.js e Express para o gerenciamento e rastreamento de entregas logísticas, incluindo o controle e atribuição de motoristas. 

Este projeto aplica conceitos avançados de engenharia de software, garantindo um código testável, escalável e desacoplado através do **Repository Pattern** e da **Inversão de Dependência**.

---

## 🏗️ Arquitetura e Inversão de Dependência

O sistema segue uma rigorosa separação em camadas (`Controller` → `Service` → `Repository`). Para respeitar o princípio da Inversão de Dependência, as camadas de domínio (`Service`) não instanciam classes de banco de dados, dependendo apenas de **contratos (interfaces documentadas via JSDoc)**. 

Toda a injeção de dependências ocorre em um ponto único de composição (`bootstrap`), centralizado no arquivo de rotas.

### Diagrama de Composição de Dependências (Bootstrap)

```text
[ ARQUIVO DE ROTAS: index.routes.js ]
       │
       ├── Instancia: Database (Memória)
       │
       ├── Instancia: EntregasRepository(Database)
       ├── Instancia: MotoristasRepository(Database)
       │
       ├── Instancia: EntregasService(IEntregasRepository, IMotoristasRepository)
       ├── Instancia: MotoristasService(IMotoristasRepository, IEntregasRepository)
       │
       ├── Instancia: EntregasController(EntregasService)
       └── Instancia: MotoristasController(MotoristasService)
🚀 Como Executar o Projeto
Pré-requisitos
Node.js (v14 ou superior) instalado no sistema.

Passo a passo
Abra o terminal na pasta raiz do projeto.

Instale as dependências:

Bash
npm install
Inicie o servidor:

Bash
node src/app.js
A API estará disponível no endereço: http://localhost:3000

📌 Regras de Negócio Aplicadas
Entregas
Fluxo de Estados: Uma entrega nasce CRIADA, avança para EM_TRANSITO e finaliza como ENTREGUE.

Cancelamento: Só é possível cancelar entregas que não foram finalizadas.

Validação: Origem não pode ser igual ao destino.

Anti-Duplicidade: Não é permitido criar entregas idênticas (mesma descrição, origem e destino) enquanto estiverem ativas.

Histórico Audível: Toda ação de mudança de estado gera um evento automático no histórico.

Motoristas e Atribuições
Unicidade: Não é possível cadastrar dois motoristas com o mesmo CPF.

Status: Motoristas nascem com o status ATIVO.

Regras de Atribuição: * O motorista deve estar ATIVO.

A entrega precisa estar obrigatoriamente no status CRIADA.

Toda atribuição gera um evento de auditoria no histórico da entrega.

🛣️ Endpoints da API
Motoristas
POST /api/motoristas - Cadastra um novo motorista.

GET /api/motoristas - Lista todos os motoristas.

GET /api/motoristas/:id - Busca um motorista pelo ID.

GET /api/motoristas/:id/entregas - Lista as entregas atribuídas a um motorista específico (aceita query ?status=CRIADA).

Entregas
POST /api/entregas - Cadastra uma nova entrega.

GET /api/entregas - Lista as entregas (aceita query ?status=EM_TRANSITO).

GET /api/entregas/:id - Busca uma entrega pelo ID.

PATCH /api/entregas/:id/avancar - Avança o status da entrega.

PATCH /api/entregas/:id/cancelar - Cancela a entrega.

GET /api/entregas/:id/historico - Retorna o array de eventos da entrega.

PATCH /api/entregas/:id/atribuir - Atribui um motorista à entrega.

🛠️ Exemplos de Requisição (PowerShell)
1. Criar um Motorista

PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/motoristas -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"nome": "Carlos", "cpf": "12345678900", "placaVeiculo": "ABC-1234"}'
2. Criar uma Entrega

PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/entregas -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"descricao": "Monitor 24 polegadas", "origem": "Maceió", "destino": "Arapiraca"}'
3. Atribuir o Motorista à Entrega

PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/entregas/1/atribuir -Method Patch -Headers @{"Content-Type"="application/