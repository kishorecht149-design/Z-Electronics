# Z Electronics

Production-ready starter architecture for a futuristic electronics e-commerce platform with:

- Next.js 15 App Router storefront
- Express + MongoDB backend
- JWT auth and admin role separation
- Inventory, offers, order tracking, analytics dashboards
- Zustand state and TanStack Query data layer
- Tailwind + Framer Motion premium UI system

## Structure

- `app/`: customer storefront, dashboard, tracking, legal pages, admin routes
- `components/`: reusable UI, storefront, dashboard and admin building blocks
- `lib/`: utilities and realistic mock data for immediate UI rendering
- `hooks/`, `services/`, `store/`: data hooks, API client, local state
- `models/`: shared TypeScript domain models
- `server/src/`: Express app, MongoDB models, auth, routes, seed script

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
cp .env.example .env
```

3. Start the frontend:

```bash
npm run dev
```

4. Start the backend in another terminal:

```bash
npm run dev:server
```

5. Seed the database after MongoDB is running:

```bash
npm run seed
```

## Deploy

### Frontend on Vercel

- Import this GitHub repository into Vercel
- Framework preset: `Next.js`
- Root directory: repository root
- Build command: `npm run build`
- Output setting: leave default for Next.js
- Production branch: `main`

Set these Vercel environment variables:

- `NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app`
- `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=...`
- `NEXT_PUBLIC_WHATSAPP_NUMBER=...`

### Backend on Render

- Create a new Render Web Service from this same repository
- Render can use [render.yaml](/Users/kishore/Documents/Z electronics/render.yaml), or configure manually
- Build command: `npm install`
- Start command: `npm run start:server`
- Health check path: `/api/health`

Set these Render environment variables:

- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=https://your-frontend-domain.vercel.app`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`
- `RAZORPAY_KEY_ID=...`
- `RAZORPAY_KEY_SECRET=...`
- `ADMIN_BOOTSTRAP_EMAIL=...`
- `ADMIN_BOOTSTRAP_PASSWORD=...`

## Production Notes

- Frontend deploy target: Vercel
- Backend deploy target: Render or Railway
- Replace mock data rendering with live API hydration progressively
- Wire Razorpay and Stripe checkout intents from secure backend endpoints
- Add object storage for product image uploads and datasheet assets
- Add refresh token rotation, email verification and webhook processing for live commerce
