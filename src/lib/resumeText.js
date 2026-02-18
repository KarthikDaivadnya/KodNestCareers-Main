/**
 * resumeText — generates a clean plain-text version of the resume
 * for clipboard copy.
 */
export function toPlainText(resume) {
  const r = resume || {}
  const lines = []

  const push = (s) => lines.push(s)
  const sep  = () => lines.push('─'.repeat(48))
  const blank = () => lines.push('')

  /* ── Name ── */
  push(r.name?.trim() || '(No name)')
  const contact = [r.email, r.phone, r.location].filter(s => s?.trim())
  if (contact.length) push(contact.join(' · '))
  const links = [r.github, r.linkedin].filter(s => s?.trim())
  if (links.length) push(links.join('  '))
  blank()

  /* ── Summary ── */
  if (r.summary?.trim()) {
    sep()
    push('SUMMARY')
    sep()
    push(r.summary.trim())
    blank()
  }

  /* ── Experience ── */
  const exps = (r.experience ?? []).filter(e => e.company?.trim() || e.role?.trim())
  if (exps.length) {
    sep()
    push('EXPERIENCE')
    sep()
    exps.forEach(exp => {
      const dates = [exp.from, exp.to].filter(Boolean).join(' – ')
      push(`${exp.role || ''} — ${exp.company || ''}${dates ? `  (${dates})` : ''}`)
      const bullets = (exp.bullets ?? []).filter(Boolean)
      bullets.forEach(b => push(`  • ${b}`))
      blank()
    })
  }

  /* ── Education ── */
  const edus = (r.education ?? []).filter(e => e.institution?.trim())
  if (edus.length) {
    sep()
    push('EDUCATION')
    sep()
    edus.forEach(edu => {
      const dates = [edu.from, edu.to].filter(Boolean).join(' – ')
      const deg   = [edu.degree, edu.field].filter(Boolean).join(', ')
      push(`${edu.institution}${dates ? `  (${dates})` : ''}`)
      if (deg) push(`  ${deg}`)
    })
    blank()
  }

  /* ── Projects ── */
  const projs = (r.projects ?? []).filter(p => p.name?.trim())
  if (projs.length) {
    sep()
    push('PROJECTS')
    sep()
    projs.forEach(proj => {
      push(proj.name)
      if (proj.description?.trim()) push(`  ${proj.description.trim()}`)
      if (proj.link?.trim())        push(`  ${proj.link}`)
      blank()
    })
  }

  /* ── Skills ── */
  if (r.skills?.trim()) {
    sep()
    push('SKILLS')
    sep()
    push(r.skills.trim())
    blank()
  }

  return lines.join('\n')
}
