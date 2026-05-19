# 💰 Finanzas App

Aplicación web fullstack de gestión financiera personal con autenticación completa,
dashboard con gráficas interactivas y diseño responsive.

## 🚀 Demo
https://finanzas-app-eight-jade.vercel.app

## ✨ Funcionalidades

- **Autenticación completa** — Registro con verificación de email, login con JWT
  y recuperación de contraseña
- **Gestión de cuentas** — Cuentas de débito, crédito y efectivo con saldo en
  tiempo real
- **Tarjetas de crédito** — Manejo de deuda, límite de crédito y crédito disponible
- **Transacciones** — Registro de ingresos, gastos y transferencias con reversión
  automática de balances
- **Dashboard** — Estadísticas en tiempo real, gráficas de ingresos vs gastos,
  gastos por categoría y evolución del patrimonio
- **Filtros** — Por tipo de transacción, cuenta y período de tiempo
- **Responsive** — Diseño optimizado para móvil con bottom navigation

## 🛠 Stack Tecnológico

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- Zustand (estado global)
- TanStack Query (server state)
- React Hook Form + Zod (formularios y validación)
- Recharts (gráficas)
- React Router DOM

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT (autenticación)
- Bcrypt (encriptación)
- Brevo (envío de emails)
- Helmet + Rate Limiting (seguridad)

### DevOps
- Frontend: Vercel
- Backend: Railway
- Base de datos: Neon (PostgreSQL serverless)
- Control de versiones: GitHub

## 🏗 Arquitectura

\`\`\`
finanzas-app/
├── client/          # React + Vite
│   ├── src/
│   │   ├── api/         # Servicios HTTP
│   │   ├── components/  # Componentes reutilizables
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Pantallas
│   │   ├── store/       # Zustand stores
│   │   └── types/       # Tipos TypeScript
└── server/          # Node.js + Express
    ├── src/
    │   ├── controllers/ # Manejo de requests
    │   ├── services/    # Lógica de negocio
    │   ├── middlewares/ # Auth, validación, seguridad
    │   ├── routes/      # Definición de endpoints
    │   └── types/       # Tipos TypeScript
    └── prisma/          # Schema y migraciones
\`\`\`

## 🔐 Seguridad
- JWT con expiración configurable
- Bcrypt con salt rounds 12
- Helmet para headers HTTP seguros
- Rate limiting (100 req/15min global, 10 req/15min en auth)
- Validación de inputs con express-validator
- Variables de entorno para datos sensibles

## ⚙️ Instalación local

\`\`\`bash
# Clonar repositorio
git clone https://github.com/angelmg777/Finanzas-App.git
cd finanzas-app

# Backend
cd server
npm install
cp .env.example .env
# Configura las variables de entorno
npx prisma migrate dev
npm run dev

# Frontend
cd ../client
npm install
npm run dev
\`\`\`