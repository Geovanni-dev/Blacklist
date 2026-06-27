<p align="right">
  <a href="README.pt.md">🇧🇷 Português</a>
</p>

# 🛡️ IDQuery Blacklist

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
</p>

> 💼 **Freelance Project** — This API was originally built for a client as a lookup service for the Mobile Legends community, allowing players to verify account IDs with a history of theft or fraud before making any trade. To respect the client's confidentiality and their private interface, I separated this back-end and created a dedicated front-end exclusively for my portfolio. See it live at: [idquery.grdev.app.br](https://idquery.grdev.app.br)

---

## 🛠️ Tech Stack

**Back-end & Infrastructure:**

- **Node.js + TypeScript** — Solid, typed, and scalable foundation
- **Express** — API routing and middlewares
- **Prisma ORM** — Type-safe data modeling and queries
- **Supabase (PostgreSQL)** — Cloud-hosted relational database
- **Docker** — Full containerization for standardized deployment
- **GitHub Actions** — CI/CD pipeline for automated build and deploy
- **ESLint + Prettier** — Static analysis and consistent code style enforcement

---

## 📁 Project Structure

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── prisma/
│   ├── migrations/             # Database migrations history
│   └── schema.prisma           # Data models definition
├── public/                     # Static front-end files (served by Express)
├── src/
│   ├── IDs/
│   │   ├── controller/
│   │   │   └── idController.ts # Request handlers
│   │   └── routes/
│   │       └── idRoutes.ts     # Route definitions
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton
│   ├── middlewares/            # Custom middlewares (rate limit, etc.)
│   ├── app.ts                  # Express app setup
│   └── server.ts               # HTTP server entry point
├── .dockerignore
├── .editorconfig
├── .env.example
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── yarn.lock
```

---

## ⚙️ Features & Security

- **Full CRUD** — Routes for querying, adding (individual and bulk), and deleting IDs
- **Rate Limit Protection** — Custom middleware to prevent brute-force attacks. Limit of 15 requests per minute; IPs that exceed this threshold are automatically placed in a 5-minute cooldown with a `429 Too Many Requests` response
- **CORS Configured** — Set up to accept requests only from specific origins in production
- **ESLint + Prettier** — Ensures consistent code style and catches common errors at development time, with rules tailored for TypeScript and Node.js

---

## 📍 API Endpoints

| Method   | Route       | Description                                                   |
| :------- | :---------- | :------------------------------------------------------------ |
| `GET`    | `/ids/:id`  | Checks if a specific ID exists in the database (Rate Limited) |
| `POST`   | `/ids/add`  | Registers a new ID in the system                              |
| `POST`   | `/ids/bulk` | Registers multiple IDs at once (bulk load)                    |
| `DELETE` | `/ids/:id`  | Removes an ID from the database                               |

> 🔒 **Admin Note:** The admin front-end for this application is strictly private. To test `POST` or `DELETE` routes locally, use an HTTP client such as **Postman**, **Insomnia**, or **Bruno**.

---

## ⚙️ CI/CD with GitHub Actions

The project uses **GitHub Actions** to automate the build and deploy process on every push to the `main` branch.

**Pipeline flow:**

1. **Build & Push** — The Docker image is built and pushed automatically to Docker Hub
2. **Deploy** — Via SSH, the server pulls the new image and recreates the container on the VPS

**Required repository secrets:**

| Secret               | Description              |
| -------------------- | ------------------------ |
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN`    | Docker Hub access token  |
| `SSH_HOST`           | VPS public IP address    |
| `SSH_USER`           | SSH username             |
| `SSH_KEY`            | Full private SSH key     |

---

## 🚀 Running Locally

**1. Clone the repository:**

```bash
git clone https://github.com/Geovanni-dev/IDQuery.git
cd IDQuery
```

**2. Configure environment variables:**

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@host.supabase.co:5432/postgres"
PORT=3333
```

**3. Start the container with Docker:**

```bash
docker compose up -d --build
```

---

## 🌐 Deployment

The project is hosted on a **VPS** with continuous deployment via **GitHub Actions**. On every push to the `main` branch, the image is rebuilt, pushed to Docker Hub, and the container is automatically updated on the server.

---

## 📄 License

**MIT © Geovani Rodrigues**
