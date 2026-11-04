# VESTA TEM

Cyberpunk glassmorphism Canva-template store.

- **Frontend:** Vite + React + Tailwind
- **Backend:** Vercel serverless function in `api/[...route].ts`
- **Database:** Neon Postgres (tables are created automatically on first request)
- **Auth:** email + password; 6-digit verification codes are emailed by VESTA TEM through Gmail SMTP

## Environment variables (Vercel → Settings → Environment Variables)
| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Added automatically by the Neon integration |
| `SMTP_USER` | Gmail address that sends the codes |
| `SMTP_PASS` | Google App Password for that Gmail |
| `SMTP_FROM` (optional) | From address, defaults to `SMTP_USER` |

## Develop
    npm install
    npm run dev        # frontend only
    npm run typecheck
