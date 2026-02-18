/* ============================================================
   KodNest — Company Intel + Round Mapping Engine
   Heuristic-based. No external APIs. Demo mode.
   ============================================================ */

// ── Known companies → metadata ─────────────────────────────

const KNOWN_COMPANIES = {
  // Big Tech
  amazon:      { industry: 'E-Commerce / Cloud', size: 'Enterprise' },
  google:      { industry: 'Big Tech',            size: 'Enterprise' },
  microsoft:   { industry: 'Big Tech',            size: 'Enterprise' },
  apple:       { industry: 'Big Tech / Consumer', size: 'Enterprise' },
  meta:        { industry: 'Social Media / AI',   size: 'Enterprise' },
  facebook:    { industry: 'Social Media / AI',   size: 'Enterprise' },
  netflix:     { industry: 'Streaming Tech',      size: 'Enterprise' },
  uber:        { industry: 'Ride-Tech',           size: 'Enterprise' },
  airbnb:      { industry: 'Travel Tech',         size: 'Enterprise' },
  linkedin:    { industry: 'Professional Network',size: 'Enterprise' },
  twitter:     { industry: 'Social Media',        size: 'Enterprise' },
  adobe:       { industry: 'Creative Software',   size: 'Enterprise' },
  salesforce:  { industry: 'CRM / SaaS',          size: 'Enterprise' },
  oracle:      { industry: 'Enterprise Software', size: 'Enterprise' },
  ibm:         { industry: 'IT Services / AI',    size: 'Enterprise' },
  intel:       { industry: 'Semiconductors',      size: 'Enterprise' },
  qualcomm:    { industry: 'Semiconductors',      size: 'Enterprise' },
  cisco:       { industry: 'Networking',          size: 'Enterprise' },
  samsung:     { industry: 'Consumer Electronics',size: 'Enterprise' },

  // Indian IT / Service
  tcs:         { industry: 'IT Services',         size: 'Enterprise' },
  infosys:     { industry: 'IT Services',         size: 'Enterprise' },
  wipro:       { industry: 'IT Services',         size: 'Enterprise' },
  hcl:         { industry: 'IT Services',         size: 'Enterprise' },
  cognizant:   { industry: 'IT Services',         size: 'Enterprise' },
  accenture:   { industry: 'Consulting / IT',     size: 'Enterprise' },
  capgemini:   { industry: 'IT Services',         size: 'Enterprise' },
  deloitte:    { industry: 'Consulting',          size: 'Enterprise' },
  mphasis:     { industry: 'IT Services',         size: 'Mid-size'   },
  hexaware:    { industry: 'IT Services',         size: 'Mid-size'   },
  persistent:  { industry: 'Software Services',   size: 'Mid-size'   },
  zensar:      { industry: 'IT Services',         size: 'Mid-size'   },
  mindtree:    { industry: 'IT Services',         size: 'Mid-size'   },

  // Indian Consumer / Fintech
  flipkart:    { industry: 'E-Commerce',          size: 'Enterprise' },
  swiggy:      { industry: 'Food-Tech',           size: 'Enterprise' },
  zomato:      { industry: 'Food-Tech',           size: 'Enterprise' },
  ola:         { industry: 'Ride-Tech',           size: 'Enterprise' },
  paytm:       { industry: 'Fintech',             size: 'Enterprise' },
  phonepe:     { industry: 'Fintech',             size: 'Enterprise' },
  razorpay:    { industry: 'Fintech',             size: 'Enterprise' },
  cred:        { industry: 'Fintech',             size: 'Enterprise' },
  meesho:      { industry: 'Social Commerce',     size: 'Enterprise' },
  nykaa:       { industry: 'E-Commerce',          size: 'Enterprise' },
  dream11:     { industry: 'Gaming / Sports',     size: 'Enterprise' },
  zepto:       { industry: 'Quick Commerce',      size: 'Mid-size'   },

  // EdTech
  "byju's":    { industry: 'EdTech',              size: 'Enterprise' },
  byjus:       { industry: 'EdTech',              size: 'Enterprise' },
  unacademy:   { industry: 'EdTech',              size: 'Enterprise' },
  upgrad:      { industry: 'EdTech',              size: 'Mid-size'   },

  // Finance
  'goldman sachs': { industry: 'Investment Banking', size: 'Enterprise' },
  'jp morgan':     { industry: 'Investment Banking', size: 'Enterprise' },
  jpmorgan:        { industry: 'Investment Banking', size: 'Enterprise' },
  'morgan stanley':{ industry: 'Investment Banking', size: 'Enterprise' },
  hdfc:            { industry: 'Banking',             size: 'Enterprise' },
  icici:           { industry: 'Banking',             size: 'Enterprise' },
  'bank of america':{ industry: 'Banking',            size: 'Enterprise' },

  // SaaS / Product (Mid-size)
  zoho:        { industry: 'SaaS / Productivity',  size: 'Mid-size' },
  freshworks:  { industry: 'CRM SaaS',             size: 'Mid-size' },
  postman:     { industry: 'API Dev Tools',         size: 'Mid-size' },
  browserstack:{ industry: 'Dev Tools',             size: 'Mid-size' },
  chargebee:   { industry: 'Billing SaaS',          size: 'Mid-size' },
  druva:       { industry: 'Cloud Data Protection', size: 'Mid-size' },
}

/** Match company name against known list (case-insensitive, partial match) */
function lookupCompany(company) {
  if (!company || !company.trim()) return null
  const lower = company.trim().toLowerCase()

  // exact match first
  if (KNOWN_COMPANIES[lower]) return KNOWN_COMPANIES[lower]

  // partial match
  for (const [key, data] of Object.entries(KNOWN_COMPANIES)) {
    if (lower.includes(key) || key.includes(lower)) return data
  }
  return null
}

// ── Hiring focus templates ──────────────────────────────────

const HIRING_FOCUS = {
  Enterprise: `Strong emphasis on DSA fundamentals, core CS subjects (OS, DBMS, Networks), and system design. Candidates are expected to demonstrate algorithmic thinking and structured communication. Multiple rounds — patience and consistency matter.`,

  'Mid-size': `Balanced focus between technical depth and real-world problem solving. Expect coding problems, architecture discussions, and questions about past projects. Culture fit and ownership mindset are valued.`,

  Startup: `Practical execution over theoretical depth. Expect take-home tasks, fast prototyping discussions, and questions around your stack experience. Cultural alignment and initiative are weighted heavily in decision-making.`,
}

// ── Round templates ─────────────────────────────────────────

function buildRounds(sizeCategory, allSkills) {
  const has = (s) => allSkills.some(sk => sk.toLowerCase() === s.toLowerCase())
  const hasDSA       = has('DSA')
  const hasWeb       = has('React') || has('Node.js') || has('Express') || has('Next.js')
  const hasCloud     = has('AWS') || has('Docker') || has('Kubernetes') || has('GCP') || has('Azure')
  const hasSQL       = has('SQL') || has('PostgreSQL') || has('MySQL')
  const hasJava      = has('Java')
  const hasPython    = has('Python')
  const hasSystemDes = has('System Design') || allSkills.length >= 6 || sizeCategory === 'Enterprise'

  if (sizeCategory === 'Enterprise') {
    return [
      {
        label:  'Round 1',
        name:   hasDSA ? 'Online Test — DSA + Aptitude' : 'Online Aptitude + Coding',
        topics: hasDSA ? 'Arrays, Strings, Sorting, Basic DP + Quant Aptitude' : 'Quant Aptitude, Verbal, Basic Coding',
        why:    'Filters candidates at scale. Most rejections happen here. A timed environment rewards preparation over brilliance — practice daily.',
      },
      {
        label:  'Round 2',
        name:   hasDSA ? 'Technical — DSA + Core CS' : 'Technical — Core CS + Stack',
        topics: [
          hasDSA ? 'Data Structures, Algorithms, Time Complexity' : null,
          hasSQL ? 'SQL queries, Joins, Indexing' : null,
          has('OOP') ? 'OOP Design, SOLID Principles' : null,
          has('OS') ? 'OS: Processes, Threading, Scheduling' : null,
          `${hasJava ? 'Java' : hasPython ? 'Python' : 'Core CS'} deep-dive`,
        ].filter(Boolean).join(' · '),
        why:    'Tests fundamental knowledge your role depends on. Interviewers probe depth — know your basics cold, not just surface-level.',
      },
      {
        label:  'Round 3',
        name:   'Technical — Projects + ' + (hasSystemDes ? 'System Design' : 'Architecture'),
        topics: [
          'Walk through your best project in 3 minutes',
          hasSystemDes ? 'Design a scalable system (e.g. URL shortener, chat app)' : null,
          hasWeb ? 'Frontend/backend architecture discussion' : null,
          hasCloud ? 'Cloud deployment & scaling approaches' : null,
        ].filter(Boolean).join(' · '),
        why:    'Evaluates real-world thinking and ownership. They want to know if you can build, not just answer questions.',
      },
      {
        label:  'Round 4',
        name:   'HR / Managerial',
        topics: 'Behavioural questions, situational scenarios, compensation discussion',
        why:    'Culture and communication fit check. Know your strengths, be honest about gaps, and have questions prepared for the interviewer.',
      },
    ]
  }

  if (sizeCategory === 'Mid-size') {
    return [
      {
        label:  'Round 1',
        name:   'Technical Screening (Phone / Video)',
        topics: [
          hasDSA ? '2–3 DSA coding problems' : 'Problem-solving discussion',
          hasSQL ? 'SQL scenario question' : null,
          'Quick resume review',
        ].filter(Boolean).join(' · '),
        why:    'Short calibration round to assess communication and technical baseline. First impressions matter — be concise and confident.',
      },
      {
        label:  'Round 2',
        name:   hasWeb ? 'Full-Stack / Practical Problem' : 'Technical Deep-Dive + Projects',
        topics: [
          hasWeb ? 'Live coding: build a small component or API endpoint' : null,
          hasDSA ? 'Medium-level coding problem' : null,
          hasSystemDes ? 'Light system design discussion' : null,
          'Deep-dive into your strongest project',
        ].filter(Boolean).join(' · '),
        why:    'Tests what you can actually build under mild pressure. Real-world execution is valued more than textbook knowledge here.',
      },
      {
        label:  'Round 3',
        name:   'Culture Fit + HR',
        topics: 'Values, team collaboration, growth mindset, offer discussion',
        why:    'Ownership, accountability, and curiosity matter in smaller organisations. Show you can work autonomously and care about outcomes.',
      },
    ]
  }

  // Startup
  return [
    {
      label:  'Round 1',
      name:   hasWeb ? 'Practical Coding Task (Take-home or Live)' : 'Take-home Assignment',
      topics: [
        hasWeb ? 'Build a working mini-project with your stack' : 'Solve a real problem relevant to the business',
        hasDSA ? '1–2 coding questions included' : null,
      ].filter(Boolean).join(' · '),
      why:    'Startups skip theoretical filtering — they want proof you can build. Treat this like a mini product demo.',
    },
    {
      label:  'Round 2',
      name:   'System / Architecture Discussion',
      topics: [
        'Walk through your take-home solution',
        hasWeb ? 'Discuss how you would scale it' : 'Explain design decisions',
        hasCloud ? 'Deployment and infrastructure choices' : null,
      ].filter(Boolean).join(' · '),
      why:    'Shows you can think beyond the immediate task. Founders and leads want to see judgment, not just code.',
    },
    {
      label:  'Round 3',
      name:   'Culture Fit / Founders Round',
      topics: 'Motivation, risk tolerance, autonomy, speed of learning, compensation',
      why:    'In startups, culture is product. They are evaluating whether you will thrive in ambiguity and contribute beyond your job description.',
    },
  ]
}

// ── Master function ─────────────────────────────────────────

export function buildCompanyIntel(company, extractedSkills) {
  const match        = lookupCompany(company)
  const sizeCategory = match?.size ?? 'Startup'
  const industry     = match?.industry ?? 'Technology Services'
  const sizeRange    = { Enterprise: '2,000+', 'Mid-size': '200–2,000', Startup: '< 200' }[sizeCategory]

  const allSkills    = Object.values(extractedSkills).flat()
  const rounds       = buildRounds(sizeCategory, allSkills)
  const hiringFocus  = HIRING_FOCUS[sizeCategory]

  return {
    companyName:   company?.trim() || '',
    industry,
    sizeCategory,
    sizeRange,
    hiringFocus,
    rounds,
    isKnown:       !!match,
  }
}
