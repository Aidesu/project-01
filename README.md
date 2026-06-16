<div align="">

# 📊 StatEko

**Personal finance management, clear and multilingual.**

Monthly budgets, savings goals, analytics and market tracking — all in a modern, responsive web app.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Internationalization](#-internationalization)
- [License](#-license)

---

## 🔎 Overview

**StatEko** is a budgeting web app that helps you take back control of your finances: build your budgets month by month, track your savings goals, visualize your spending trends, and keep an eye on the markets. The interface is fully translated (🇬🇧 / 🇫🇷 / 🇯🇵) and authentication is secure.

> 💡 This README is designed as a **reusable template** — adapt the name, badges, and sections for your other projects.

---

## ✨ Features

| Module                | Description                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| 🔐 **Authentication** | Email + password sign-up / sign-in (`bcrypt` hashing), sessions handled by Auth.js v5              |
| 💰 **Budgets**        | Detailed monthly budgets broken down by category (income, fixed costs, variable expenses, savings) |
| 🎯 **Goals**          | Typed savings goals (travel, car, home, emergency…) with progress tracking and pinning             |
| 📈 **Analytics**      | Monthly overview, expense breakdown, and trends powered by ECharts                                 |
| 🪙 **Markets**        | Asset tracking with real-time prices (polled every 5 s)                                            |
| 🌍 **Multilingual**   | Per-language routing (`/[lang]`) — English, French, Japanese                                       |
| 🎨 **Modern UI**      | Responsive design with Tailwind CSS 4 and FontAwesome icons                                        |

---

## 🛠 Tech Stack

| Area               | Technologies                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, route groups)                                        |
| **UI**             | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [FontAwesome](https://fontawesome.com/) |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/)                                                                     |
| **Database**       | [PostgreSQL 17](https://www.postgresql.org/) via [Prisma 6](https://www.prisma.io/)                                 |
| **Authentication** | [Auth.js v5](https://authjs.dev/) (`next-auth`) + `@auth/prisma-adapter` + `bcryptjs`                               |
| **Visualization**  | [Apache ECharts 6](https://echarts.apache.org/)                                                                     |
| **Validation**     | [Zod 4](https://zod.dev/)                                                                                           |
| **Infra (dev)**    | [Docker Compose](https://docs.docker.com/compose/) (PostgreSQL)                                                     |

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) **20.9+** (required by Next.js 16)
- [Docker](https://www.docker.com/) & Docker Compose (for the local PostgreSQL database)
- npm (or yarn / pnpm / bun)

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-account>/stateko.git
cd stateko

# 2. Install dependencies
npm install

# 3. Configure your environment
cp .env.example .env   # then fill in the variables (see below)

# 4. Start the PostgreSQL database
docker compose up -d

# 5. Apply Prisma migrations
npx prisma migrate dev

# 6. Start the development server
npm run dev
```

The app is then available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Environment Variables

Create a `.env` file at the root using the following keys:

| Variable          | Description                                          | Example                                               |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string                         | `postgresql://user:password@localhost:5432/budget_db` |
| `AUTH_SECRET`     | JWT session signing secret                           | generated via `openssl rand -base64 32`               |
| `AUTH_TRUST_HOST` | Trusts the host in dev (useful behind a proxy / WSL) | `true`                                                |

> ⚠️ The `.env` file should **never** be committed — it is already listed in `.gitignore`.

---

## 📜 Available Scripts

| Command         | Action                        |
| --------------- | ----------------------------- |
| `npm run dev`   | Starts the development server |
| `npm run build` | Builds the app for production |
| `npm run start` | Runs the built app            |
| `npm run lint`  | Lints the code with ESLint    |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/            # Sign-in / sign-up pages
│   ├── (main)/[lang]/     # Authenticated app, routed by language
│   │   ├── analytics/     #   Dashboards & charts
│   │   ├── budgets/       #   Budget management
│   │   ├── goals/         #   Savings goals
│   │   ├── markets/       #   Market tracking
│   │   └── accounts/      #   Account settings
│   ├── (public)/          # Landing, about, terms
│   ├── actions/           # Server Actions (auth, budget, goal…)
│   └── api/               # Route handlers (auth, markets)
├── components/            # UI components (layouts, forms, graphics, ui…)
├── lib/
│   ├── i18n/              # Translation dictionaries (en, fr, ja)
│   └── validation/        # Zod schemas
├── services/             # Business logic (analytics, goal, market)
└── types/                # Shared types
prisma/
├── schema.prisma         # Data model
└── migrations/           # Migration history
```

---

## 🌍 Internationalization

The app is translated into **English**, **French**, and **Japanese**. The language is carried by the `/[lang]` URL segment (e.g. `/fr/budgets`). Translations live in `src/lib/i18n/dictionaries/` — adding a language is as simple as creating a new JSON file and registering it in `dictionaries.ts`.

---

## 📄 License

Released under the **MIT** License. See the `LICENSE` file for details.

---

<div align="">

created by **[Carla Deafiaa](https://github.com/<your-account>)**

</div>
