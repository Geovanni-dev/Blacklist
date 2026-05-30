# 🛡️ IDQuery Blacklist

Esta API foi originalmente desenvolvida como um **projeto freelance**, atuando como um serviço de consulta rápida para verificar IDs de contas do jogo Mobile Legends e ajudar a comunidade a identificar contas com histórico de roubo/fraudes antes de realizarem negociações. 

Para respeitar a confidencialidade e a interface do cliente original, **separei este back-end e criei um front-end dedicado exclusivamente para compor meu portfólio**, demonstrando toda a estrutura técnica e de segurança que construí para a aplicação.

## 🛠️ Tecnologias Utilizadas

**Back-end & Infraestrutura:**
* **Node.js + TypeScript:** Base sólida, tipada e escalável.
* **Express:** Roteamento e middlewares da API.
* **Prisma ORM:** Modelagem de dados e queries tipadas.
* **Supabase (PostgreSQL):** Banco de dados relacional em nuvem.
* **Docker:** Containerização completa da aplicação para deploy padronizado.

**Front-end:**
* HTML5, Tailwind CSS, JavaScript Vanilla.
* Servido estaticamente direto pelo backend (`express.static`).

## 📁 Estrutura do Projeto

    /
    ├── prisma/                 # Modelagem e migrações do banco de dados
    │   ├── migrations/
    │   └── schema.prisma
    ├── public/                 # Arquivos estáticos do Front-end
    │   ├── index.html
    │   ├── input.css           # Arquivo fonte do Tailwind (@import e animações)
    │   ├── script.js
    │   └── style.css           # CSS compilado pelo Tailwind
    ├── src/                    # Código-fonte do Back-end
    │   ├── IDs/
    │   │   ├── controller/idController.ts
    │   │   └── routes/idRoutes.ts
    │   ├── lib/
    │   │   └── prisma.ts       # Instância do Prisma Client
    │   ├── middlewares/
    │   │   └── rateLimit.ts    # Regras de limite de requisições
    │   ├── app.ts              # Configuração do Express
    │   └── server.ts           # Inicialização do servidor
    ├── .dockerignore
    ├── .env.example                   # Variáveis de ambiente
    ├── docker-compose.yml      # Orquestração do container
    ├── Dockerfile              # Receita de construção da imagem
    ├── package.json
    └── tsconfig.json           # Configurações do compilador TypeScript

## ⚙️ Funcionalidades e Segurança

* **CRUD Completo:** Rotas para busca, adição (individual e em massa) e exclusão de IDs.
* **Proteção por Rate Limit:** Middleware customizado para evitar ataques de força bruta (DDoS/Spam). Limite de 15 requisições por minuto. Caso excedido, o IP sofre um "cooldown" automático de 5 minutos com status `429 Too Many Requests`.
* **CORS Configurado:** Preparado para receber requisições de origens específicas em produção.

## 📍 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/ids/:id` | Consulta se um ID específico está na base (Protegido por Rate Limit) |
| `POST` | `/ids/add` | Registra um novo ID no sistema |
| `POST` | `/ids/bulk` | Registra múltiplos IDs de uma vez (Carga em massa) |
| `DELETE`| `/ids/:id` | Remove um ID do banco de dados |

> 🔒 **Nota sobre Gerenciamento (Admin):** O front-end de administração desta aplicação é estritamente privado. Para testar o cadastro (`POST`) ou a exclusão (`DELETE`) de IDs localmente, você precisará utilizar um client HTTP como **Postman**, **Insomnia** ou **Bruno**.

## 🚀 Como rodar o projeto localmente

**1. Clone o repositório:**
    git clone https://github.com/Geovanni-dev/IDQuery.git
    
    cd IDQuery

**2. Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto e adicione a URL de conexão do seu Supabase e a porta (opcional):

    DATABASE_URL="postgresql://usuario:senha@host.supabase.co:5432/postgres"
    PORT=3333

**3. Suba o container com Docker:**
Com o Docker instalado, rode o comando abaixo para compilar o TypeScript, gerar o cliente do Prisma e iniciar o servidor isolado:

    docker compose up -d --build

**4. Acesse o projeto:**
A API e a interface estarão rodando na porta `3333`. Acesse no seu navegador:
👉 http://localhost:3333

## 📄 Licença

MIT © Geovani Rodrigues