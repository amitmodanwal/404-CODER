# Synapse AI

An AI-interview practice app built with Next.js, Prisma, and SQLite. Users can create an account, upload a resume, complete a tailored interview, and review a scored report and transcript.

## Run locally

1. Install dependencies: `npm install`
2. Copy the environment template: `Copy-Item .env.example .env` (PowerShell) or `cp .env.example .env` (macOS/Linux).
3. Set a unique `JWT_SECRET` in `.env` before production use.
4. Initialize the local database: `npm run db:push`
5. Load demo candidates (optional): `npm run db:seed`
6. Start the app: `npm run dev`

Open [http://localhost:3000](http://localhost:3000). Demo candidate accounts use the password `demo-password` after seeding.

## Production check

Run `npm run build` to create and verify the production build.

## Team

404 CODER — Amit Modanwal, Jatin, and Aditya Shah.



