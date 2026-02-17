# VE Portfolio + Admin Backend

## Stack
- Frontend: Vite + React + TypeScript
- Backend: Express + JWT auth + Multer
- Database: PostgreSQL via Prisma

## What is persisted in PostgreSQL
- Users (`User` table)
- Videos (`Video` table)

Uploaded files are stored in Cloudinary and URL/public id are saved in DB.

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Update `.env` values (`DATABASE_URL`, `JWT_SECRET`) and Cloudinary keys:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
Also configure mail:
- `MAIL_PROVIDER=resend`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

4. Initialize database schema:
```bash
npm run db:setup
```

5. Create your admin user manually in PostgreSQL (`User` table) with:
- `username`
- `passwordHash` (bcrypt hash)
- `role = 'admin'`

6. Start app:
```bash
npm run dev:all
```

Frontend: `http://localhost:5173`
Admin: `http://localhost:5173/admin`
Backend: `http://localhost:4000`

## API routes
- `POST /api/auth/login` (public)
- `GET /api/auth/me` (auth required)
- `GET /api/videos` (public)
- `POST /api/videos` (auth required)
- `PUT /api/videos/:id` (auth required)
- `DELETE /api/videos/:id` (auth required)
- `POST /api/contact` (public, saves + sends email)
- `GET /api/users` (admin only)
- `POST /api/users` (admin only)

## Prisma
- Schema: `prisma/schema.prisma`
