/**
 * AI Resume Builder — Build Track
 * 8 step definitions for /rb/* routes
 *
 * artifact key pattern: rb_step_X_artifact  (X = 1..8)
 */

export const RB_STEPS = [
  {
    id: 1,
    slug: '01-problem',
    path: '/rb/01-problem',
    label: 'Problem Definition',
    tag: 'STEP 01',
    contextTitle: 'Define the Problem',
    contextDesc:
      'Before building anything, we define the exact pain point. Who is the user? What job are they trying to do? What breaks today? A crisp problem statement is the foundation of every great product.',
    lovablePrompt: `# Step 1 — Problem Definition

Create a simple single-page React app (Vite + Tailwind) with the following:

## Layout
A clean centered card (max-w-2xl) with:
- Header: "AI Resume Builder — Problem Statement"
- A problem statement block with bold text:
  "Job seekers spend hours manually tailoring resumes for each JD. They miss keywords, under-represent skills, and get filtered by ATS before a human ever reads their resume."
- A "User Pain" section listing 3 bullet points:
  1. Manual tailoring is slow (45–90 min per application)
  2. ATS keyword gaps cause silent rejections
  3. No feedback loop — applicants never know why they failed
- A "We Solve" callout in a highlighted box (indigo bg):
  "AI Resume Builder auto-maps your experience to any JD in < 60 seconds."
- Footer: "KodNest Premium Build · Project 3 · Step 1 of 8"

## Style
Use Tailwind only. No external UI libs. Clean, professional, dark text on white card.`,
  },
  {
    id: 2,
    slug: '02-market',
    path: '/rb/02-market',
    label: 'Market Research',
    tag: 'STEP 02',
    contextTitle: 'Validate the Market',
    contextDesc:
      'Great products solve real problems at real scale. Here we quantify the opportunity — TAM, competitor landscape, and why existing tools fail. Market evidence keeps us honest.',
    lovablePrompt: `# Step 2 — Market Research

Build a market research dashboard page in React + Tailwind:

## Layout (max-w-3xl centered)
- Header: "AI Resume Builder — Market Research"
- Stat row (3 cards):
  - TAM: "$3.8B" — Resume/career services market (2024)
  - SAM: "$620M" — AI-powered job tools segment  
  - SOM: "$12M" — Achievable year-1 with 80k users
- Competitor table with columns: Tool | AI? | ATS-aware? | Price | Weakness
  Rows: Resumake (No, No, Free, No AI), Rezi (Partial, Yes, $29/mo, Generic), Teal (Yes, Partial, $19/mo, Slow), Kickresume (Partial, No, $19/mo, Templates only)
- Opportunity gap box (green highlight):
  "No tool auto-maps experience bullets to JD keywords in real-time AND shows ATS score before export."
- Footer: "KodNest Premium Build · Project 3 · Step 2 of 8"

## Style
Tailwind only. Table with striped rows. Stat cards with large bold numbers.`,
  },
  {
    id: 3,
    slug: '03-architecture',
    path: '/rb/03-architecture',
    label: 'Architecture Overview',
    tag: 'STEP 03',
    contextTitle: 'System Architecture',
    contextDesc:
      'Architecture is the skeleton of the product. We map every component, data flow, and boundary before writing a single feature line. Good architecture prevents expensive rewrites.',
    lovablePrompt: `# Step 3 — Architecture Overview

Create an architecture overview page in React + Tailwind:

## Layout (max-w-3xl centered)
- Header: "AI Resume Builder — Architecture"
- Architecture layers (vertical stack of cards):
  1. **Presentation Layer** — React SPA, Vite, Tailwind CSS
  2. **State Layer** — React Context + localStorage persistence
  3. **AI Layer** — OpenAI GPT-4o (prompt engineering, no fine-tuning)
  4. **Data Layer** — Browser localStorage (MVP), Supabase (v2)
  5. **Export Layer** — html2pdf.js for PDF generation
- Data flow section: A left-to-right arrow diagram (use flex + arrows in Tailwind):
  "JD Input → Skill Extractor → AI Mapper → Resume Draft → ATS Scorer → PDF Export"
- Tech stack badges row: React, Vite, Tailwind, OpenAI, Supabase, Vercel
- Footer: "KodNest Premium Build · Project 3 · Step 3 of 8"

## Style
Tailwind only. Use colored left-border cards for layers. Arrow flow uses → characters.`,
  },
  {
    id: 4,
    slug: '04-hld',
    path: '/rb/04-hld',
    label: 'High-Level Design',
    tag: 'STEP 04',
    contextTitle: 'High-Level Design (HLD)',
    contextDesc:
      'HLD shows how major system components talk to each other — no code-level detail. Think in boxes and arrows: what calls what, where data lives, and what the user actually touches.',
    lovablePrompt: `# Step 4 — High-Level Design (HLD)

Build an HLD page in React + Tailwind:

## Layout (max-w-3xl centered)
- Header: "AI Resume Builder — High-Level Design"
- Component Map (grid of boxes with connecting descriptions):
  - **User Browser** → sends JD + resume text → **AI Service (GPT-4o)**
  - **AI Service** → returns skill map + rewrite suggestions → **State Store**
  - **State Store** → drives → **Resume Editor UI**
  - **Resume Editor UI** → triggers → **ATS Scorer** and **PDF Exporter**
- Render this as a 2-column grid of cards connected by → arrows
- API Contract section (table):
  | Endpoint | Method | Input | Output |
  | /api/analyze | POST | { jd, resume } | { skills, gaps, score } |
  | /api/rewrite | POST | { bullet, jd } | { rewritten } |
  | /api/export | POST | { html } | { pdf_blob } |
- Footer: "KodNest Premium Build · Project 3 · Step 4 of 8"

## Style
Tailwind only. Use bg-gray-50 boxes with borders. Table with proper header styling.`,
  },
  {
    id: 5,
    slug: '05-lld',
    path: '/rb/05-lld',
    label: 'Low-Level Design',
    tag: 'STEP 05',
    contextTitle: 'Low-Level Design (LLD)',
    contextDesc:
      'LLD zooms into the implementation detail — component tree, data schemas, state shape, and key algorithms. This is the blueprint your code will follow exactly.',
    lovablePrompt: `# Step 5 — Low-Level Design (LLD)

Build an LLD page in React + Tailwind:

## Layout (max-w-3xl centered)
- Header: "AI Resume Builder — Low-Level Design"
- Component Tree (indented list with icons):
  - App
    - RBShell (layout)
      - TopBar
      - ContextHeader
      - BuildPanel (right 30%)
      - ProofFooter
    - BuildStep (8 instances, gated)
    - RBProof (final page)
- State Schema section (code block styled div):
  \`\`\`
  {
    rb_step_1_artifact: { status, note, ts },
    rb_step_2_artifact: { status, note, ts },
    ...
    rb_step_8_artifact: { status, note, ts },
    rb_proof_links: { lovable, github, deployed }
  }
  \`\`\`
- Key Algorithms (2 cards):
  1. **Gating**: step N unlocked only if step N-1 artifact exists in localStorage
  2. **ATS Score**: keyword intersection count ÷ total JD keywords × 100
- Footer: "KodNest Premium Build · Project 3 · Step 5 of 8"

## Style
Tailwind only. Code block uses bg-gray-900 text-green-400 monospace font.`,
  },
  {
    id: 6,
    slug: '06-build',
    path: '/rb/06-build',
    label: 'Build Sprint',
    tag: 'STEP 06',
    contextTitle: 'Build Sprint',
    contextDesc:
      'This is the core build step. We wire the actual resume editor, AI integration, and ATS scorer. Each feature is built as a vertical slice — UI + logic + state together — so every commit is shippable.',
    lovablePrompt: `# Step 6 — Build Sprint (Core Features)

Build the main resume builder workspace in React + Tailwind:

## Layout (full screen, two-column)
- Left panel (60%): Resume Editor
  - Section: Contact Info (name, email, phone, location inputs)
  - Section: Summary (textarea, 3-5 sentences)
  - Section: Experience (add/remove entries: company, role, dates, 3 bullet textareas)
  - Section: Skills (tag input — add skill chips)
- Right panel (40%): JD Input + ATS Score
  - Textarea: "Paste Job Description here"
  - Button: "Analyze JD" (no AI yet — just show placeholder score)
  - ATS Score display: large circular badge showing "72 / 100"
  - Matched Keywords list (5 placeholder items)
  - Missing Keywords list (3 placeholder items)
- Top bar: "AI Resume Builder" | "Step 6 of 8 — Build Sprint" | "Draft" badge

## Style
Tailwind only. Left panel white bg, right panel gray-50. Smooth section dividers.`,
  },
  {
    id: 7,
    slug: '07-test',
    path: '/rb/07-test',
    label: 'Test & QA',
    tag: 'STEP 07',
    contextTitle: 'Test & Quality Assurance',
    contextDesc:
      'Shipping without testing is guessing. Here we run through a structured checklist — functionality, edge cases, UX flows, and ATS correctness — and only mark complete when every box is checked.',
    lovablePrompt: `# Step 7 — Test & QA Checklist

Build a QA checklist page in React + Tailwind:

## Layout (max-w-2xl centered)
- Header: "AI Resume Builder — Test Checklist"
- Progress bar: X/10 tests passing (updates as user checks boxes)
- Checklist of 10 items (each a card with checkbox + label + description):
  1. App loads without errors
  2. All 8 routes render without crash
  3. Step gating works (can't skip steps)
  4. Build panel prompt copies to clipboard
  5. Artifact save stores to localStorage correctly
  6. Proof page shows correct step completion status
  7. Resume editor inputs persist across refresh
  8. ATS score displays correctly (even with placeholder)
  9. All links on proof page validate format
  10. App is responsive on mobile (375px)
- Completion message (appears when all 10 checked): "✅ All tests passed. Ready to ship."
- Footer: "KodNest Premium Build · Project 3 · Step 7 of 8"

## Logic
Persist checked state to localStorage key "rb_test_checklist". Checkbox toggle updates array.`,
  },
  {
    id: 8,
    slug: '08-ship',
    path: '/rb/08-ship',
    label: 'Ship',
    tag: 'STEP 08',
    contextTitle: 'Ship It',
    contextDesc:
      'Shipping is the only real milestone. Deploy to Vercel, connect your GitHub repo, verify the live URL. A product that only runs locally doesn\'t exist for users.',
    lovablePrompt: `# Step 8 — Ship

Build the shipping checklist page in React + Tailwind:

## Layout (max-w-2xl centered)
- Header: "AI Resume Builder — Ship"
- Shipping steps (vertical numbered list with status indicators):
  1. Push code to GitHub (green check if GitHub link on proof page is filled)
  2. Connect repo to Vercel
  3. Set environment variables (VITE_OPENAI_KEY)
  4. Trigger production build
  5. Verify live URL loads correctly
  6. Share deployed link on proof page
- Deployment config card (code block):
  \`\`\`
  # vercel.json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  \`\`\`
- Success state (when all steps checked): "🚀 Shipped. Your resume builder is live."
- Button: "Go to Proof Page →" (links to /rb/proof)
- Footer: "KodNest Premium Build · Project 3 · Step 8 of 8"

## Style
Tailwind only. Numbered steps with circle indicators (gray → green on check).`,
  },
]

/** Artifact localStorage key for a given step number */
export function artifactKey(stepNum) {
  return `rb_step_${stepNum}_artifact`
}

/** Returns true if the step has a saved artifact */
export function hasArtifact(stepNum) {
  try {
    const raw = localStorage.getItem(artifactKey(stepNum))
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return !!(parsed && parsed.status)
  } catch {
    return false
  }
}

/** Save an artifact for a step */
export function saveArtifact(stepNum, status, note = '') {
  const artifact = {
    status,       // 'success' | 'error'
    note,
    ts: new Date().toISOString(),
  }
  localStorage.setItem(artifactKey(stepNum), JSON.stringify(artifact))
  return artifact
}

/** Load artifact for a step */
export function loadArtifact(stepNum) {
  try {
    const raw = localStorage.getItem(artifactKey(stepNum))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
