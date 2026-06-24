# Antigravity Platform Complete Redesign Plan

This plan transforms the existing Basic Electricity EdTech platform into the comprehensive Antigravity AI-powered learning platform specified in planning.txt, including full schema migration, UI/UX redesign with modern components, teacher/student role separation, and Vercel deployment with Neon PostgreSQL.

## Phase 1: Database Schema Migration (Week 1)

### 1.1 Set Up Neon PostgreSQL
- Create Neon account and project
- Generate pooled connection string (DATABASE_URL)
- Generate direct connection string (DIRECT_URL)
- Update .env.example with both connection strings
- Add NEXTAUTH_SECRET generation

### 1.2 Schema Restructuring
Replace current schema with planning.txt architecture:
- **User model**: Keep existing, add role enum (STUDENT/TEACHER)
- **Classes model**: New - for teacher class management
- **Enrollment model**: New - student-class relationships
- **Chapter model**: New - replaces Module, 7 chapters total
- **SubChapter model**: New - contains learning content (TEXT/VIDEO/PDF)
- **Quiz model**: Replace Assessment, linked to SubChapter
- **Assessment model**: New - student quiz attempts
- **AiEvaluation model**: Replace AIAnalysis, with recommendedSubChapters array

### 1.3 Data Migration Script
Create migration script to:
- Map existing 7 chapters to new Chapter/SubChapter structure
- Convert hardcoded materials/page.tsx content to SubChapter records
- Preserve existing user accounts and assessment attempts
- Migrate quiz questions to new Quiz format

### 1.4 Prisma Configuration
- Update schema.prisma with new structure
- Run prisma migrate dev
- Update seed.ts with new data structure
- Test connection pooling configuration

## Phase 2: UI/UX Complete Redesign (Week 2)

### 2.1 Install shadcn/ui Components
```bash
npx shadcn@latest init
npx shadcn@latest add button card input label select dialog dropdown-menu avatar badge progress tabs sheet command
```

### 2.2 Design System Implementation
- Create glassmorphism utility classes
- Implement modern color palette (cyan/blue/purple gradients)
- Add animation variants (framer-motion)
- Create reusable component library

### 2.3 Layout Redesign
- **Navbar**: Modern glass-effect with role-aware navigation
- **Sidebar**: Collapsible chapter navigation for students
- **Dashboard**: Separate teacher/student dashboards
- **Mobile**: Fully responsive design

### 2.4 Page-by-Page Redesign
- **Home**: Hero section with animated circuit background, feature cards
- **Materials**: Grid layout with chapter cards, modal expansion
- **SubChapter View**: Rich content display with media support
- **Assessment**: Modern quiz interface with progress tracking
- **Outcomes**: AI evaluation display with visual analytics
- **Simulation Hub**: Enhanced interactive components

## Phase 3: Teacher/Student Role Separation (Week 3)

### 3.1 Authentication Enhancement
- Update NextAuth configuration with role-based callbacks
- Add middleware for route protection (/student/*, /teacher/*)
- Implement role selection during registration

### 3.2 Student Dashboard
- **/dashboard/student**: Personal learning progress
- Chapter completion tracking
- Quiz history and scores
- AI evaluation history
- Recommended sub-chapters based on performance

### 3.3 Teacher Dashboard
- **/dashboard/teacher**: Class management
- Create/edit classes with class codes
- View enrolled students
- Student performance analytics
- AI evaluation summaries per class
- Class-level statistics

### 3.4 Route Protection Middleware
```typescript
// middleware.ts
- Protect /dashboard/student/* to STUDENT role only
- Protect /dashboard/teacher/* to TEACHER role only
- Redirect unauthorized users appropriately
```

## Phase 4: Content Reorganization (Week 3-4)

### 4.1 Chapter Structure Mapping
Map existing 7 chapters to planning.txt structure:
- Chapter 1: Foundations of Matter & Charge (3 sub-chapters)
- Chapter 2: Classifications of Engineering Materials (3 sub-chapters)
- Chapter 3: Core Electrodynamic Quantities (4 sub-chapters)
- Chapter 4: Fundamental System Laws (2 sub-chapters)
- Chapter 5: Network Topology Concepts (3 sub-chapters)
- Chapter 6: Practical Residential & Industrial Installations (2 sub-chapters)
- Chapter 7: Active Electronics & Optoelectronics (4 sub-chapters)

### 4.2 Content Migration
- Extract content from materials/page.tsx
- Create SubChapter records with appropriate media types
- Add PDF/video URLs where applicable
- Preserve all learning objectives and content text

### 4.3 Quiz Migration
- Convert existing assessments to Quiz format
- Link each quiz to appropriate SubChapter
- Preserve all questions and correct answers
- Update question format to JSON structure

## Phase 5: AI Integration Enhancement (Week 4)

### 5.1 Dual AI Implementation
- **OpenRouter Integration**: Keep existing free-tier models
- **AI SDK Integration**: Add Vercel AI Gateway as alternative
- Create AI service abstraction layer for easy switching

### 5.2 Enhanced AI Evaluation
- Implement context-aware evaluation (chapter, sub-chapter context)
- Add recommendedSubChapters array generation
- Improve prompt engineering for better feedback
- Add streaming response support

### 5.3 Floating AI Assistant
- Context-aware chatbot that knows current chapter/sub-chapter
- Integration with simulation sandbox state
- Real-time assistance during learning

## Phase 6: Simulation Engine Enhancement (Week 4)

### 6.1 Component Modernization
- Redesign Ohm's Law visualizer with glassmorphism
- Enhance Circuit Sandbox with better controls
- Add Resistor Color-Code Calculator (4-band and 5-band)
- Improve all interactive components with modern UI

### 6.2 Performance Optimization
- Client-side calculations remain (no server load)
- Smooth animations with framer-motion
- Responsive design for all screen sizes

## Phase 7: Vercel Deployment (Week 5)

### 7.1 Deployment Configuration
- Remove netlify.toml
- Create vercel.json with build configuration
- Configure environment variables in Vercel dashboard
- Set up Vercel AI Gateway if needed

### 7.2 Environment Variables
Required for Vercel:
- DATABASE_URL (Neon pooled)
- DIRECT_URL (Neon direct for migrations)
- NEXTAUTH_SECRET (generated)
- NEXTAUTH_URL (auto-set by Vercel)
- OPENROUTER_API_KEY (existing)
- VERCEL_AI_GATEWAY_KEY (if using AI SDK)

### 7.3 Build & Deploy
- Run prisma generate in build script
- Test build locally: `npm run build`
- Deploy to Vercel (preview deployment first)
- Run migrations on Neon: `npx prisma migrate deploy`
- Seed database: `npx prisma db seed`

### 7.4 Post-Deployment Testing
- Test all user flows (register, login, student/teacher dashboards)
- Verify database connectivity
- Test AI evaluation generation
- Verify simulation components work
- Test mobile responsiveness

## Phase 8: Testing & Troubleshooting (Week 5-6)

### 8.1 Automated Testing
- Build verification
- Database migration testing
- API endpoint testing
- Component rendering tests

### 8.2 E2E Browser Testing
- Full user journey: register → login → complete chapter → quiz → outcomes
- Teacher flow: create class → enroll students → view analytics
- Edge cases: empty submissions, long inputs, rapid submissions
- AI evaluation generation and display

### 8.3 Issue Resolution
Document and fix issues in issues.md:
- Connection stability (Neon cold starts)
- Data integrity (edge cases)
- Auth flow (session management)
- Assessment flow (submission handling)
- API robustness (error handling)
- Latency optimization

## Deliverables

1. **Redesigned Platform**: Complete UI/UX overhaul with shadcn/ui
2. **Database Migration**: Full schema migration to planning.txt structure
3. **Role Separation**: Teacher/student dashboards with proper access control
4. **Content Reorganization**: All 7 chapters migrated to new structure
5. **AI Enhancement**: Dual AI integration with improved evaluation
6. **Neon Setup**: Fully configured PostgreSQL database
7. **Vercel Deployment**: Live production deployment
8. **Documentation**: issues.md with resolved problems and walkthrough

## Estimated Timeline: 5-6 Weeks

**Critical Path**: Database migration must be completed before UI redesign can use new schema. Neon setup is blocking for all database operations.
