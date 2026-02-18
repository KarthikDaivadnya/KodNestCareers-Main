/**
 * ATS Score v2 — Deterministic, max 100
 * Returns { score, breakdown, suggestions }
 */

const ACTION_VERBS = [
  'built','led','designed','improved','developed','created','managed','delivered',
  'architected','launched','shipped','optimized','implemented','scaled','reduced',
  'increased','drove','mentored','refactored','automated','integrated','deployed',
  'wrote','fixed','coordinated','analyzed','researched','trained','established',
]

function totalSkills(r) {
  const fromGroups = Object.values(r.skillGroups ?? {}).flat().length
  if (fromGroups > 0) return fromGroups
  return (r.skills ?? '').split(',').map(s => s.trim()).filter(Boolean).length
}

export function computeATS(resume) {
  const r = resume || {}
  const breakdown = []
  let score = 0

  /* +10 name */
  const hasName = !!(r.name?.trim())
  breakdown.push(hasName
    ? { label: 'Name provided',         points: 10, passed: true  }
    : { label: 'Add your full name',    points: 10, passed: false })
  if (hasName) score += 10

  /* +10 email */
  const hasEmail = !!(r.email?.trim())
  breakdown.push(hasEmail
    ? { label: 'Email provided',            points: 10, passed: true  }
    : { label: 'Add your email address',    points: 10, passed: false })
  if (hasEmail) score += 10

  /* +10 summary > 50 chars */
  const sumLen = (r.summary?.trim() ?? '').length
  breakdown.push(sumLen > 50
    ? { label: `Summary written (${sumLen} chars)`,         points: 10, passed: true  }
    : { label: 'Write a summary (50+ characters)',           points: 10, passed: false })
  if (sumLen > 50) score += 10

  /* +15 at least 1 experience entry with bullets */
  const expWithBullets = (r.experience ?? []).some(e =>
    (e.company?.trim() || e.role?.trim()) && (e.bullets ?? []).some(b => b?.trim())
  )
  breakdown.push(expWithBullets
    ? { label: 'Experience with bullet points',                      points: 15, passed: true  }
    : { label: 'Add an experience entry with bullet points',         points: 15, passed: false })
  if (expWithBullets) score += 15

  /* +10 at least 1 education entry */
  const hasEdu = (r.education ?? []).some(e => e.institution?.trim())
  breakdown.push(hasEdu
    ? { label: 'Education entry added',   points: 10, passed: true  }
    : { label: 'Add an education entry',  points: 10, passed: false })
  if (hasEdu) score += 10

  /* +10 at least 5 skills */
  const skillCount = totalSkills(r)
  breakdown.push(skillCount >= 5
    ? { label: `${skillCount} skills listed`,           points: 10, passed: true  }
    : { label: `Add skills (${skillCount}/5 minimum)`,  points: 10, passed: false })
  if (skillCount >= 5) score += 10

  /* +10 at least 1 project */
  const hasProject = (r.projects ?? []).some(p => p.name?.trim())
  breakdown.push(hasProject
    ? { label: 'Project added',              points: 10, passed: true  }
    : { label: 'Add at least 1 project',     points: 10, passed: false })
  if (hasProject) score += 10

  /* +5 phone */
  const hasPhone = !!(r.phone?.trim())
  breakdown.push(hasPhone
    ? { label: 'Phone number added',   points: 5, passed: true  }
    : { label: 'Add phone number',     points: 5, passed: false })
  if (hasPhone) score += 5

  /* +5 LinkedIn */
  const hasLinkedIn = !!(r.linkedin?.trim())
  breakdown.push(hasLinkedIn
    ? { label: 'LinkedIn profile linked',   points: 5, passed: true  }
    : { label: 'Add LinkedIn profile link', points: 5, passed: false })
  if (hasLinkedIn) score += 5

  /* +5 GitHub */
  const hasGitHub = !!(r.github?.trim())
  breakdown.push(hasGitHub
    ? { label: 'GitHub profile linked',     points: 5, passed: true  }
    : { label: 'Add GitHub profile link',   points: 5, passed: false })
  if (hasGitHub) score += 5

  /* +10 summary uses action verbs */
  const sumLower = (r.summary ?? '').toLowerCase()
  const hasActionVerbs = ACTION_VERBS.some(v => sumLower.includes(v))
  breakdown.push(hasActionVerbs
    ? { label: 'Summary uses action verbs',                       points: 10, passed: true  }
    : { label: 'Add action verbs to summary (built, led, …)',     points: 10, passed: false })
  if (hasActionVerbs) score += 10

  score = Math.min(100, score)

  const suggestions = breakdown
    .filter(b => !b.passed)
    .map(b => ({ text: b.label, points: b.points }))

  return { score, breakdown, suggestions }
}

/** Color tier based on score */
export function scoreColor(score) {
  if (score >= 71) return 'green'
  if (score >= 41) return 'amber'
  return 'red'
}

/** Tier label */
export function scoreLabel(score) {
  if (score >= 71) return 'Strong Resume'
  if (score >= 41) return 'Getting There'
  return 'Needs Work'
}
