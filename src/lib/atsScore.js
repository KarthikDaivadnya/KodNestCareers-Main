/**
 * ATS Score v1 — Deterministic
 * Returns { score: 0–100, breakdown: [...], suggestions: [...] }
 */

const NUMBER_RE = /(\d+%|\d+k|\d+x|\d+\+|\$\d+|\d{2,})/i

function wordCount(str) {
  if (!str || !str.trim()) return 0
  return str.trim().split(/\s+/).length
}

function skillCount(skillsStr) {
  if (!skillsStr || !skillsStr.trim()) return 0
  return skillsStr.split(',').map(s => s.trim()).filter(Boolean).length
}

function hasBulletNumbers(experience, projects) {
  const expBullets = (experience ?? []).flatMap(e => e.bullets ?? [])
  const projDescs  = (projects ?? []).map(p => p.description ?? '')
  return [...expBullets, ...projDescs].some(t => NUMBER_RE.test(t))
}

function hasCompleteEducation(education) {
  return (education ?? []).some(
    e => e.institution?.trim() && e.degree?.trim() && e.field?.trim()
  )
}

export function computeATS(resume) {
  const r = resume || {}
  const breakdown = []
  let score = 0

  /* +15: summary 40–120 words */
  const words = wordCount(r.summary)
  if (words >= 40 && words <= 120) {
    score += 15
    breakdown.push({ label: 'Strong summary length', points: 15, passed: true })
  } else {
    breakdown.push({ label: 'Summary 40–120 words', points: 15, passed: false })
  }

  /* +10: ≥ 2 projects */
  const projCount = (r.projects ?? []).length
  if (projCount >= 2) {
    score += 10
    breakdown.push({ label: `${projCount} projects listed`, points: 10, passed: true })
  } else {
    breakdown.push({ label: 'At least 2 projects', points: 10, passed: false })
  }

  /* +10: ≥ 1 experience entry */
  const expCount = (r.experience ?? []).length
  if (expCount >= 1) {
    score += 10
    breakdown.push({ label: `${expCount} experience entr${expCount > 1 ? 'ies' : 'y'}`, points: 10, passed: true })
  } else {
    breakdown.push({ label: 'Add work experience', points: 10, passed: false })
  }

  /* +10: skills ≥ 8 */
  const sCount = skillCount(r.skills)
  if (sCount >= 8) {
    score += 10
    breakdown.push({ label: `${sCount} skills listed`, points: 10, passed: true })
  } else {
    breakdown.push({ label: `Skills list (${sCount}/8 min)`, points: 10, passed: false })
  }

  /* +10: GitHub or LinkedIn */
  const hasLink = !!(r.github?.trim() || r.linkedin?.trim())
  if (hasLink) {
    score += 10
    breakdown.push({ label: 'Professional links added', points: 10, passed: true })
  } else {
    breakdown.push({ label: 'GitHub or LinkedIn link', points: 10, passed: false })
  }

  /* +15: measurable numbers in bullets / descriptions */
  const hasMeasured = hasBulletNumbers(r.experience, r.projects)
  if (hasMeasured) {
    score += 15
    breakdown.push({ label: 'Measurable impact in bullets', points: 15, passed: true })
  } else {
    breakdown.push({ label: 'Add numbers to bullets (%, X, k)', points: 15, passed: false })
  }

  /* +10: complete education entry */
  const eduComplete = hasCompleteEducation(r.education)
  if (eduComplete) {
    score += 10
    breakdown.push({ label: 'Education details complete', points: 10, passed: true })
  } else {
    breakdown.push({ label: 'Complete education entry', points: 10, passed: false })
  }

  score = Math.min(100, score)

  /* ── Suggestions (max 3) ── */
  const suggestions = []

  if (words < 40 || words === 0) {
    suggestions.push('Write a stronger summary (40–120 words).')
  } else if (words > 120) {
    suggestions.push('Shorten your summary to under 120 words.')
  }
  if (projCount < 2)      suggestions.push('Add at least 2 projects.')
  if (!hasMeasured)       suggestions.push('Add measurable impact (numbers) in experience bullets.')
  if (sCount < 8)         suggestions.push(`Add more skills — you have ${sCount}, target 8+.`)
  if (!hasLink)           suggestions.push('Add a GitHub or LinkedIn link.')
  if (!eduComplete)       suggestions.push('Complete your education entry (institution, degree, field).')

  return {
    score,
    breakdown,
    suggestions: suggestions.slice(0, 3),
  }
}

/** Returns a color token name based on score */
export function scoreColor(score) {
  if (score >= 75) return 'green'
  if (score >= 45) return 'amber'
  return 'red'
}
