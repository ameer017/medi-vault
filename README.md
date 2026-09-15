# MediVault

Patient-owned healthcare records for Nigeria. Patients hold the chart, grant time-limited access to clinicians, and carry an emergency QR card. Lagos, Abuja and Ibadan facilities are seeded.

## Setup

```bash
cd medi-vault
npm install
cp .env.example .env
docker compose up -d
npm run db:setup
npm run dev
```

Local Postgres is `postgresql://medivault:medivault@localhost:5433/medivault` (port **5433** so RailNG can keep 5432). SQLite will not work on Netlify.

If RailNG is already on port 3000, start this app with `npx next dev -p 3001` and set `AUTH_URL=http://localhost:3001`.

Open [http://localhost:3000](http://localhost:3000).

## Seed logins

| Role | Email | Password |
| --- | --- | --- |
| Operator | `admin@medivault.ng` | `Vault!admin` |
| Clinician | `tunde@medivault.ng` | `clinician123` |
| Patient | `amina@medivault.ng` | `patient123` |

Dr. Tunde Adeyemi (Cardiology, LUTH) already has a 7-day grant to Amina Bello’s chart.

## What is included

- Patient vault: allergies, medications, visit timeline, NHIA / blood group / genotype
- Share a 24-hour walk-in code, or grant a named clinician 1 / 7 / 30 days
- Revoke access at any time
- Clinician chart + add consultation, vitals, prescription, lab, allergy, immunization
- Emergency QR card (blood group, allergies, who to call — not the full notes)
- Operator desk: facilities, clinician accounts, audit log

## Deploy on Netlify

1. Create a free [Neon](https://neon.tech) Postgres database. Copy the connection string (`sslmode=require`).
2. Import the GitHub repo in Netlify. Framework detection should set **Build command** `npm run build` and **Publish directory** `.next` (also in `netlify.toml`).
3. Site settings → Environment variables:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://<your-site>.netlify.app` |

4. Trigger a deploy. The build runs `prisma generate` and `prisma db push` (schema only, no seed wipe).
5. Seed once from your machine:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

Then log in with the seed accounts above.
