# Basic Electricity (Next.js)

## Local development

```bash
npm install
npm run dev
```

## Deploy to Netlify

This project is compatible with Netlify's Next.js runtime (OpenNext adapter).

### Build settings

- Build command: `npm run build`
- Publish directory: leave empty (Netlify handles Next.js outputs)
- Node version: `20` (also defined in `.nvmrc` and `netlify.toml`)

### Required environment variables

Set these in Netlify UI (Site configuration → Environment variables):

- `DATABASE_URL` (PostgreSQL connection string for Prisma)
- `NEXTAUTH_SECRET` (random secret for NextAuth JWT/signing)
- `NEXTAUTH_URL` (your production site URL, e.g. `https://your-site.netlify.app`)
- `OPENROUTER_API_KEY` (for `/api/chat` and `/api/evaluators` using `openai/gpt-oss-120b:free`)

### Notes

- The build runs `prisma generate` automatically as part of `npm run build`.
- `netlify.toml` enables skew protection and disables Next telemetry.
