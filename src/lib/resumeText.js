export function toPlainText(resume) {
  const r = resume || {}
  const lines = []
  const push  = s  => lines.push(s)
  const sep   = () => lines.push('─'.repeat(48))
  const blank = () => lines.push('')

  push(r.name?.trim() || '(No name)')
  const contact = [r.email, r.phone, r.location].filter(s => s?.trim())
  if (contact.length) push(contact.join(' · '))
  const links = [r.github, r.linkedin].filter(s => s?.trim())
  if (links.length) push(links.join('  '))
  blank()

  if (r.summary?.trim()) {
    sep(); push('SUMMARY'); sep()
    push(r.summary.trim()); blank()
  }

  const exps = (r.experience ?? []).filter(e => e.company?.trim() || e.role?.trim())
  if (exps.length) {
    sep(); push('EXPERIENCE'); sep()
    exps.forEach(exp => {
      const dates = [exp.from, exp.to].filter(Boolean).join(' – ')
      push(`${exp.role || ''} — ${exp.company || ''}${dates ? `  (${dates})` : ''}`)
      ;(exp.bullets ?? []).filter(Boolean).forEach(b => push(`  • ${b}`))
      blank()
    })
  }

  const edus = (r.education ?? []).filter(e => e.institution?.trim())
  if (edus.length) {
    sep(); push('EDUCATION'); sep()
    edus.forEach(edu => {
      const dates = [edu.from, edu.to].filter(Boolean).join(' – ')
      push(`${edu.institution}${dates ? `  (${dates})` : ''}`)
      const deg = [edu.degree, edu.field].filter(Boolean).join(', ')
      if (deg) push(`  ${deg}`)
    })
    blank()
  }

  const projs = (r.projects ?? []).filter(p => p.name?.trim())
  if (projs.length) {
    sep(); push('PROJECTS'); sep()
    projs.forEach(proj => {
      push(proj.name)
      if (proj.description?.trim())              push(`  ${proj.description.trim()}`)
      if (proj.techStack?.length)                push(`  Tech: ${proj.techStack.join(', ')}`)
      if (proj.liveUrl?.trim())                  push(`  Live: ${proj.liveUrl}`)
      if (proj.link?.trim())                     push(`  GitHub: ${proj.link}`)
      blank()
    })
  }

  /* skills: new skillGroups or legacy */
  const sg = r.skillGroups
  if (sg && Object.values(sg).flat().length > 0) {
    sep(); push('SKILLS'); sep()
    const map = { technical: 'Technical', soft: 'Soft Skills', tools: 'Tools & Technologies' }
    Object.entries(sg).forEach(([key, arr]) => {
      if (arr?.length) push(`${map[key] || key}: ${arr.join(', ')}`)
    })
    blank()
  } else if (r.skills?.trim()) {
    sep(); push('SKILLS'); sep()
    push(r.skills.trim()); blank()
  }

  return lines.join('\n')
}
