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

## Production Notes

- Frontend deploy target: Vercel
- Backend deploy target: Render or Railway
- Replace mock data rendering with live API hydration progressively
- Wire Razorpay and Stripe checkout intents from secure backend endpoints
- Add object storage for product image uploads and datasheet assets
- Add refresh token rotation, email verification and webhook processing for live commerce
