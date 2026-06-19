# Antigravity v2 — Full Platform Rebuild

Complete rebuild of the "Basic Electricity" learning platform into a production-grade, Neon PostgreSQL-backed educational ecosystem with premium UI/UX and AI integration.

## Current State Analysis

The existing codebase is a Next.js 16 app with:
- **Database**: Prisma v5 with PostgreSQL schema (currently pointing to placeholder Neon URLs)
- **Auth**: NextAuth v4 with Credentials provider + JWT sessions
- **Content**: 7 chapters of hardcoded learning materials (in `materials/page.tsx`)
- **Assessments**: 7 chapter quizzes seeded via `prisma/seed.ts` (4 questions each)
- **Simulations**: 5 interactive components (Ohm's Law, Circuit Safety, Passive Gallery, Active Components, Circuit Sandbox)
- **AI**: OpenRouter integration for evaluation + Chatbot
- **Styling**: Tailwind CSS v4 + Framer Motion + GSAP with neon/glassmorphism theme

### Key Issues to Fix
1. **Database not connected** — `.env` has placeholder URLs
2. **Schema mismatch with planning.txt** — Current schema uses `Module` model but planning spec calls for `Chapter/SubChapter/Quiz` hierarchy
3. **Materials are hardcoded** — Not from database
4. **Dark-mode only text colors** — Many pages use `text-white` without light-mode variants
5. **Missing Chapter 7 module page** — Only modules 1–6 exist
6. **No Teacher dashboard** — Planning spec requires role-based dashboards
7. **Performance section on homepage is static mock data**

---

## User Review Required

> [!IMPORTANT]
> **Neon Database Setup**: The `.env` has placeholder DATABASE_URL values. You need to provide real Neon PostgreSQL connection strings, or I can guide you through creating a Neon project. Do you already have a Neon project set up?

> [!IMPORTANT]
> **OpenRouter API Key**: The existing key in `.env` will be used — is it still valid?

> [!WARNING]
> **Schema Migration**: The current Prisma schema will be significantly updated to match the planning.txt spec (Chapter → SubChapter → Quiz hierarchy). This is a **destructive migration** — any existing data in the database will need to be re-seeded.

> [!IMPORTANT]
> **Deployment**: The plan includes Vercel deployment via the `deploy-to-vercel` skill. Do you have a Vercel account ready?

---

## Open Questions

1. **Language**: The materials page mixes English content with Indonesian UI labels ("Pelajari", "Gratis", "ulasan"). Should the UI be fully English or fully Indonesian?
2. **Auth scope**: The planning spec mentions Teacher/Student roles with separate dashboards. Should I implement both dashboards for this version, or focus on the Student experience first?
3. **Content additions**: Planning spec mentions PDF and VIDEO content types. Should I generate placeholder PDFs, or just keep the TEXT content from the current materials?

---

## Proposed Changes

### Phase 1: Database Schema & Neon Connection

#### [MODIFY] [schema.prisma](file:///c:/Semester/Metopen/v1-DasarListrik/prisma/schema.prisma)
- Update the Prisma schema to align with planning.txt ERD
- Add `Chapter`, `SubChapter`, `Quiz` models as specified
- Keep existing `User`, `Account`, `Session`, `Assessment`, `AssessmentAttempt`, `AIAnalysis` models
- Add `Classes`, `Enrollment`, `AiEvaluation` models for teacher features
- Configure for Neon PostgreSQL with pooled + direct URLs

#### [MODIFY] [seed.ts](file:///c:/Semester/Metopen/v1-DasarListrik/prisma/seed.ts)
- Seed all 7 chapters with sub-chapters using the exact content from the current `materials/page.tsx`
- Seed all 7 chapter assessments (already exists) 
- Seed a demo Student and Teacher user with hashed passwords

#### [MODIFY] [.env](file:///c:/Semester/Metopen/v1-DasarListrik/.env)
- Update with actual Neon connection strings (user must provide)

---

### Phase 2: UI/UX Premium Redesign

Following the **ui-ux-pro-max** skill guidelines — applying glassmorphism, proper light/dark contrast, accessibility standards, and premium micro-interactions.

#### [MODIFY] [globals.css](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/globals.css)
- Fix light-mode support (currently only dark-mode neon text utilities work well)
- Add proper light-mode glass-card variants with adequate contrast
- Add skeleton loading animation utilities
- Ensure 4.5:1 contrast ratio for all text in both modes

#### [MODIFY] [layout.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/layout.tsx)
- Update metadata to "Antigravity — AI-Powered Electrical Engineering Platform"
- Keep existing providers, Navbar, Chatbot structure

#### [MODIFY] [Navbar.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/components/layout/Navbar.tsx)
- Fix dark/light mode contrast issues
- Add proper aria-labels per accessibility standards
- Add active link indicator per ui-ux-pro-max nav rules

#### [MODIFY] [page.tsx (Home)](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/page.tsx)
- Fix text colors that are dark-mode only (e.g., `text-white` → `text-slate-900 dark:text-white`)
- Update "5 chapters" references to "7 chapters" 
- Make the Performance section dynamic (fetch from API) instead of static mock

#### [MODIFY] [materials/page.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/materials/page.tsx)
- Convert from hardcoded data to database-driven (fetch chapters + sub-chapters from Prisma)
- Keep the same premium card design but fix dark/light mode contrast
- Make the modal content fetch full sub-chapter text from DB

#### [MODIFY] [simulation/page.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/simulation/page.tsx)
- Fix `text-white` → proper light/dark variants
- Fix `text-slate-400` → proper light/dark variants

#### [MODIFY] [assessment/page.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/assessment/page.tsx)
- Fix dark-mode only text colors
- Already database-driven — just needs light-mode fixes

#### [MODIFY] [outcomes/page.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/outcomes/page.tsx)
- Fix dark-mode only text colors throughout
- Already database-driven

---

### Phase 3: Database-Driven Features

#### [NEW] [src/app/api/materials/route.ts](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/api/materials/route.ts)
- API route to fetch all chapters with sub-chapters from database

#### [NEW] [src/app/api/materials/[id]/route.ts](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/api/materials/%5Bid%5D/route.ts)
- API route to fetch single chapter with full sub-chapter content

#### [MODIFY] API routes under `src/app/api/`
- Ensure all existing API routes (assessment, outcomes, chat, evaluators) work with the updated schema
- Fix any TypeScript type issues

---

### Phase 4: Missing Features & Polish

#### [NEW] [src/app/modules/7/page.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/app/modules/7/page.tsx)
- Add the missing Chapter 7 module page (Basic Electronics & Optoelectronics)

#### [MODIFY] [Chatbot.tsx](file:///c:/Semester/Metopen/v1-DasarListrik/src/components/layout/Chatbot.tsx)
- Fix dark/light mode contrast
- Ensure proper touch targets (≥44px) per ui-ux-pro-max

---

### Phase 5: Build Verification & Deployment

#### Build & Test
- Run `prisma generate` and `prisma db push` against Neon
- Run `prisma db seed` to populate data
- Run `npm run build` to verify zero TypeScript errors
- Run `npm run dev` and visually verify all pages

#### Deploy to Vercel
- Follow `deploy-to-vercel` skill workflow
- Set environment variables on Vercel
- Verify production deployment

---

## Verification Plan

### Automated Tests
```bash
# 1. Prisma schema validation
npx prisma validate

# 2. TypeScript compilation
npm run build

# 3. Dev server smoke test
npm run dev
```

### Browser Testing
- Navigate to all pages: `/`, `/materials`, `/simulation`, `/assessment`, `/outcomes`
- Verify light and dark mode on each page
- Test the assessment flow end-to-end
- Test the AI chatbot
- Verify responsive behavior at 375px and 1440px

### Manual Verification
- Confirm database is seeded with all 7 chapters
- Confirm assessments load from database
- Confirm AI evaluation flow works after quiz completion
