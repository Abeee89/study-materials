# Fix User Registration, Sign-up, and Database Integration

The objective of this task is to fix user registration and sign-up features. Currently, the local Next.js platform runs but fails to register new users because the PostgreSQL database does not have the database tables/schema created.

To resolve this, we will correct the `DIRECT_URL` connection string in the environment configurations, deploy the Prisma schema using database push commands, and populate the database with curriculum and user seeds.

---

## User Review Required

No breaking architectural changes are proposed. However, the connection to Neon PostgreSQL is critical. We will configure:
- **`DIRECT_URL`**: Calculated from `DATABASE_URL` by removing the `-pooler` suffix from the host (essential for Prisma migrations).

---

## Proposed Changes

### Configuration Component

#### [MODIFY] [.env](file:///c:/Semester/Metopen/v1-DasarListrik/.env)
- Update `DIRECT_URL` to point to the direct (non-pooled) Neon database connection string corresponding to the `DATABASE_URL` currently defined.

---

## Step-by-Step Tutorial: Schema Modification & Deployment
Here is the step-by-step workflow for modifying or fixing the database in the future:

### Step 1: Modifying the Schema (`schema.prisma`)
Whenever you need to add, delete, or change database tables/fields, edit:
`prisma/schema.prisma`

### Step 2: Regenerating the Prisma Client locally
To sync your local TypeScript types with the modified schema, run:
```bash
npx prisma generate
```

### Step 3: Deploying Schema to Neon PostgreSQL
Depending on your environment, run one of the following:

#### Option A: Quick Development Push (For testing/dev environments)
Directly updates the schema in the cloud database without tracking migration history files:
```bash
npx prisma db push
```

#### Option B: Database Migrations (Recommended for production)
Creates a SQL file inside `prisma/migrations/` and updates the database:
```bash
npx prisma migrate dev --name <your_migration_name>
```
*Note: Both options require a valid `DIRECT_URL` in `.env` because Neon's connection pooler blocks some DDl commands.*

### Step 4: Re-seeding the Database
If you need to re-seed curriculum tables, run:
```bash
npx prisma db seed
```

---

## Verification Plan

### Automated Verification
We will run:
1. `npx prisma db push` to verify schema deployment.
2. `npx prisma db seed` to seed initial users and curriculum.
3. `npx tsx scripts/validate-platform.ts` to ensure database connectivity is fully active and tables are queried successfully.

### Manual Verification
1. Open the signup form page `/register`.
2. Register a new user with email `test-student@example.com` and password `password123`.
3. Verify redirection to the login page `/login`.
4. Log in using the new credentials to confirm successful authentication and user record persistency.
