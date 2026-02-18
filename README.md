# KodNestCareers — Production Monorepo

> Production B2C Career Ecosystem · npm Workspaces + Turborepo  
> Node ≥ 18.17 · npm ≥ 9

---

## Repository Structure

```
KodNestCareers-Main/
│
├── apps/
│   ├── job-tracker/          ← kodnestcareers-job_notif_tracker
│   ├── placement-platform/   ← KodNestCareers-Placement_Readiness_Platform
│   └── resume-builder/       ← KodNestCareers-AI_Resume_Builder
│
├── packages/
│   ├── ui/                   ← @kodnest/ui     (shared components)
│   ├── config/               ← @kodnest/config (eslint, tailwind, vite base)
│   └── utils/                ← @kodnest/utils  (shared helpers)
│
├── .env.example
├── .gitignore
├── package.json              ← workspace root
├── turbo.json                ← Turborepo pipeline
└── README.md
```

---

## PART 1 — Initial Monorepo Setup (Run Once)

### Step 1 — Create GitHub repository

Go to https://github.com/new and create:  
**Repository name:** `KodNestCareers-Main`  
**Visibility:** Private  
**Initialize with README:** ❌ (leave unchecked)

---

### Step 2 — Initialize locally and push scaffold

```bash
cd "d:/BECAME_DEVELOPER/KodNestCareers-Main"

git init
git add .
git commit -m "chore: initialize KodNestCareers monorepo scaffold

- npm workspaces: apps/*, packages/*
- Turborepo pipeline (build / dev / lint / clean)
- packages/ui     → @kodnest/ui (Button, Card, Badge, Input, etc.)
- packages/config → @kodnest/config (eslint, tailwind, vite base)
- packages/utils  → @kodnest/utils (date, string, storage, debounce)
- .env.example with VITE_ prefixed keys
- .gitignore (node_modules, dist, .env, .turbo)"

git remote add origin https://github.com/KarthikDaivadnya/KodNestCareers-Main.git
git push -u origin main
```

---

## PART 2 — Merge Existing Repos (Preserves Full Git History)

> Uses `git subtree add` — each repo's full commit history is preserved
> inside the `apps/<name>/` subdirectory. No `--squash` = full history.

```bash
cd "d:/BECAME_DEVELOPER/KodNestCareers-Main"

# ── Add remotes ────────────────────────────────────────────────────────
git remote add job-tracker-remote         https://github.com/KarthikDaivadnya/kodnestcareers-job_notif_tracker.git
git remote add placement-platform-remote  https://github.com/KarthikDaivadnya/KodNestCareers-Placement_Readiness_Platform.git
git remote add resume-builder-remote      https://github.com/KarthikDaivadnya/KodNestCareers-AI_Resume_Builder.git

# ── Fetch all three repos ──────────────────────────────────────────────
git fetch job-tracker-remote
git fetch placement-platform-remote
git fetch resume-builder-remote

# ── Merge as subtrees (full history, no squash) ────────────────────────
git subtree add --prefix=apps/job-tracker        job-tracker-remote/main
git subtree add --prefix=apps/placement-platform  placement-platform-remote/main
git subtree add --prefix=apps/resume-builder      resume-builder-remote/main

# ── Push merged monorepo to GitHub ────────────────────────────────────
git push origin main
```

> ⚠️ Each `git subtree add` creates a merge commit that rewrites paths
> into the subdirectory. Original commits remain intact and visible in
> `git log --all -- apps/<name>/`.

---

## PART 3 — Install Dependencies

```bash
cd "d:/BECAME_DEVELOPER/KodNestCareers-Main"

# Install all workspace dependencies (hoisted to root node_modules)
npm install

# Verify workspace linkage
npm ls --workspaces 2>&1 | head -40
```

---

## PART 4 — Development

```bash
# Run all 3 apps simultaneously (different ports)
npm run dev

# Run individual apps
npm run dev:job-tracker          # → localhost:5173
npm run dev:placement-platform   # → localhost:5174
npm run dev:resume-builder       # → localhost:5175
```

---

## PART 5 — Build

```bash
# Build all apps (Turborepo caches unchanged apps)
npm run build

# Build individual apps
npm run build:job-tracker
npm run build:placement-platform
npm run build:resume-builder
```

---

## PART 6 — Vercel Deployment (Option A — Recommended)

Deploy each app as a **separate Vercel project** pointing to its subdirectory.

### Per-app Vercel setup:

| App                 | Root Directory             | Build Command      | Output Directory |
|---------------------|----------------------------|--------------------|------------------|
| Job Tracker         | `apps/job-tracker`         | `npm run build`    | `dist`           |
| Placement Platform  | `apps/placement-platform`  | `npm run build`    | `dist`           |
| Resume Builder      | `apps/resume-builder`      | `npm run build`    | `dist`           |

### Step-by-step for each app:

1. Go to https://vercel.com/new
2. Import `KodNestCareers-Main` repository
3. **Root Directory** → set to `apps/job-tracker` (or relevant app)
4. **Build Command** → `npm run build` (Vercel auto-detects Vite)
5. **Output Directory** → `dist`
6. **Environment Variables** → Add from `.env.example` (VITE_ prefix required)
7. Deploy

### vercel.json per app (already present in each app):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## PART 7 — Future: Pull Latest from Sub-repos

If you continue developing individual repos separately:

```bash
# Pull latest from job-tracker into monorepo
git subtree pull --prefix=apps/job-tracker job-tracker-remote main

# Pull latest from placement-platform
git subtree pull --prefix=apps/placement-platform placement-platform-remote main

# Pull latest from resume-builder
git subtree pull --prefix=apps/resume-builder resume-builder-remote main
```

---

## PART 8 — Using Shared Packages

To use `@kodnest/ui` in any app:

```bash
# In apps/resume-builder/package.json, add:
"dependencies": {
  "@kodnest/ui": "*"
}
```

```jsx
// In any component:
import { Button, Card, Badge } from '@kodnest/ui'
```

---

## PART 9 — Migration Safety Checklist

- [ ] All 3 `git subtree add` commands completed without errors
- [ ] `git log --oneline apps/job-tracker` shows original commits
- [ ] `git log --oneline apps/placement-platform` shows original commits
- [ ] `git log --oneline apps/resume-builder` shows original commits
- [ ] `npm install` completes without dependency conflicts
- [ ] `npm run build:job-tracker` exits with code 0
- [ ] `npm run build:placement-platform` exits with code 0
- [ ] `npm run build:resume-builder` exits with code 0
- [ ] No imports break (each app is fully self-contained)
- [ ] `.env` files NOT committed (check `git status`)
- [ ] Vercel projects created with correct Root Directory per app
- [ ] Environment variables set in Vercel (not hardcoded in code)

---

## PART 10 — Future Scaling Slots

Pre-planned workspace slots for future modules:

```
apps/
  admin-panel/       ← Internal ops dashboard
  recruiter-portal/  ← B2B recruiter access
  analytics/         ← PostHog + custom dashboards

packages/
  auth/              ← Shared auth (Supabase / Clerk)
  api/               ← Shared API client (fetch wrappers)
  analytics/         ← Shared event tracking
```

---

## Git Commit Convention

```
feat:     new feature
fix:      bug fix
chore:    tooling, deps, config
refactor: code change (no bug fix / feature)
docs:     documentation only
ci:       CI/CD changes
```

---

*KodNestCareers · Production B2C Career Ecosystem · Built with KodNest Premium Build System*
