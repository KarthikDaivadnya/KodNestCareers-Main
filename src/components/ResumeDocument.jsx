import { getColorValue } from '../lib/templates'

/* ── Shared helpers ── */
const SKILL_LABELS = { technical: 'Technical', soft: 'Soft Skills', tools: 'Tools' }

function SkillPills({ skillGroups, textStyle }) {
  if (!skillGroups) return null
  return (
    <div className="flex flex-col gap-1.5">
      {Object.entries(skillGroups).map(([key, arr]) => {
        if (!arr?.length) return null
        return (
          <div key={key}>
            <span style={textStyle} className="text-[8px] font-bold uppercase tracking-wide mr-1">
              {SKILL_LABELS[key] || key}:
            </span>
            <span className="text-[8px]">{arr.join(' · ')}</span>
          </div>
        )
      })}
    </div>
  )
}

function TechPills({ stack, accentColor }) {
  if (!stack?.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {stack.map(t => (
        <span key={t} style={{ borderColor: accentColor, color: accentColor }}
          className="text-[7.5px] border px-1.5 py-0.5 rounded-full leading-none">{t}</span>
      ))}
    </div>
  )
}

/* ── EMPTY STATE ── */
function EmptyState({ className }) {
  return (
    <div className={`bg-white p-10 flex flex-col items-center justify-center text-center min-h-[400px] ${className}`}>
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-lg">📄</span>
      </div>
      <p className="text-sm font-medium text-gray-400">Your resume will appear here.</p>
      <p className="text-xs text-gray-300 mt-1">Start filling in the form on the left.</p>
    </div>
  )
}

/* ── CLASSIC LAYOUT ──────────────────────────────────────── */
function ClassicResume({ r, accent }) {
  const hasSummary  = !!(r.summary?.trim())
  const hasExp      = (r.experience ?? []).some(e => e.company?.trim() || e.role?.trim())
  const hasEdu      = (r.education  ?? []).some(e => e.institution?.trim())
  const hasProjects = (r.projects   ?? []).some(p => p.name?.trim())
  const hasSkills   = Object.values(r.skillGroups ?? {}).flat().length > 0 || r.skills?.trim()
  const contact     = [r.email, r.phone, r.location].filter(Boolean)
  const links       = [r.github, r.linkedin].filter(Boolean)

  const SLabel = ({ children }) => (
    <div style={{ borderBottomColor: accent, color: accent }}
      className="text-[8.5px] font-bold tracking-[0.2em] uppercase border-b pb-1 mb-2">{children}</div>
  )

  return (
    <div className="bg-white p-8" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Header — centered */}
      <div className="text-center border-b border-gray-200 pb-4 mb-5 resume-entry">
        <h1 style={{ color: accent }} className="text-[23px] font-bold tracking-tight break-words">
          {r.name || <span className="text-gray-300 italic text-base">Your Name</span>}
        </h1>
        {contact.length > 0 && <p className="text-[9.5px] text-gray-500 mt-1">{contact.join('  ·  ')}</p>}
        {links.length > 0   && <p className="text-[9px] text-gray-400 mt-0.5">{links.join('  ·  ')}</p>}
      </div>

      {hasSummary && (
        <div className="resume-section mb-4">
          <SLabel>Summary</SLabel>
          <p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{r.summary}</p>
        </div>
      )}

      {hasExp && (
        <div className="resume-section mb-4">
          <SLabel>Experience</SLabel>
          {r.experience.filter(e => e.company?.trim() || e.role?.trim()).map(exp => (
            <div key={exp.id} className="resume-entry mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold text-gray-900">{exp.role}</span>
                <span className="text-[9px] text-gray-400 whitespace-nowrap">{[exp.from, exp.to].filter(Boolean).join(' – ')}</span>
              </div>
              <p className="text-[10px] italic text-gray-500 mb-1">{exp.company}</p>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul className="list-disc list-outside ml-4">
                  {exp.bullets.filter(Boolean).map((b,i) => <li key={i} className="text-[10px] text-gray-700 leading-snug break-words">{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {hasEdu && (
        <div className="resume-section mb-4">
          <SLabel>Education</SLabel>
          {r.education.filter(e => e.institution?.trim()).map(edu => (
            <div key={edu.id} className="resume-entry mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold text-gray-900">{edu.institution}</span>
                <span className="text-[9px] text-gray-400 whitespace-nowrap">{[edu.from, edu.to].filter(Boolean).join(' – ')}</span>
              </div>
              {(edu.degree || edu.field) && <p className="text-[10px] italic text-gray-500">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>}
            </div>
          ))}
        </div>
      )}

      {hasProjects && (
        <div className="resume-section mb-4">
          <SLabel>Projects</SLabel>
          {r.projects.filter(p => p.name?.trim()).map(proj => (
            <div key={proj.id} className="resume-entry mb-2.5">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-gray-900">{proj.name}</span>
                <div className="flex gap-2 shrink-0 text-[9px] text-gray-400 mt-0.5">
                  {proj.liveUrl?.trim() && <span>↗ live</span>}
                  {proj.link?.trim()    && <span>GH</span>}
                </div>
              </div>
              {proj.description?.trim() && <p className="text-[10px] text-gray-700 break-words">{proj.description}</p>}
              <TechPills stack={proj.techStack} accentColor={accent} />
            </div>
          ))}
        </div>
      )}

      {hasSkills && (
        <div className="resume-section mb-4">
          <SLabel>Skills</SLabel>
          {r.skillGroups && Object.values(r.skillGroups).flat().length > 0
            ? <SkillPills skillGroups={r.skillGroups} textStyle={{ color: accent }} />
            : <p className="text-[10px] text-gray-700">{r.skills}</p>
          }
        </div>
      )}
    </div>
  )
}

/* ── MODERN LAYOUT — 2-column sidebar ──────────────────────── */
function ModernResume({ r, accent }) {
  const hasExp      = (r.experience ?? []).some(e => e.company?.trim() || e.role?.trim())
  const hasEdu      = (r.education  ?? []).some(e => e.institution?.trim())
  const hasProjects = (r.projects   ?? []).some(p => p.name?.trim())
  const hasSummary  = !!(r.summary?.trim())
  const contact     = [r.email, r.phone, r.location].filter(Boolean)
  const links       = [r.github, r.linkedin].filter(Boolean)

  const SLabel = ({ children }) => (
    <div style={{ color: accent, borderBottomColor: accent }}
      className="text-[9px] font-bold tracking-[0.18em] uppercase border-b pb-1 mb-2">{children}</div>
  )
  const SideLabel = ({ children }) => (
    <div className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/70 mb-1.5 mt-3 first:mt-0">{children}</div>
  )

  return (
    <div className="bg-white flex" style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '297mm' }}>

      {/* Sidebar */}
      <div style={{ backgroundColor: accent, width: '33%' }} className="p-6 flex flex-col shrink-0">
        <h1 className="text-[18px] font-bold text-white leading-tight break-words">{r.name || 'Your Name'}</h1>

        {contact.length > 0 && (
          <>
            <SideLabel>Contact</SideLabel>
            {contact.map((c,i) => <p key={i} className="text-[8.5px] text-white/90 leading-snug break-all">{c}</p>)}
          </>
        )}

        {links.length > 0 && (
          <>
            <SideLabel>Links</SideLabel>
            {links.map((l,i) => <p key={i} className="text-[8px] text-white/80 break-all leading-snug">{l}</p>)}
          </>
        )}

        {r.skillGroups && Object.values(r.skillGroups).flat().length > 0 && (
          <>
            <SideLabel>Skills</SideLabel>
            {Object.entries(r.skillGroups).map(([key, arr]) => {
              if (!arr?.length) return null
              return (
                <div key={key} className="mb-2">
                  <p className="text-[7.5px] text-white/60 uppercase tracking-wide mb-1">{SKILL_LABELS[key]}</p>
                  <div className="flex flex-wrap gap-1">
                    {arr.map(s => (
                      <span key={s} className="text-[7.5px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-7">
        {hasSummary && (
          <div className="resume-section mb-5">
            <SLabel>Summary</SLabel>
            <p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{r.summary}</p>
          </div>
        )}

        {hasExp && (
          <div className="resume-section mb-5">
            <SLabel>Experience</SLabel>
            {r.experience.filter(e => e.company?.trim() || e.role?.trim()).map(exp => (
              <div key={exp.id} className="resume-entry mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-semibold text-gray-900">{exp.role}</span>
                  <span className="text-[9px] text-gray-400 whitespace-nowrap">{[exp.from, exp.to].filter(Boolean).join(' – ')}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-1">{exp.company}</p>
                {exp.bullets?.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4">
                    {exp.bullets.filter(Boolean).map((b,i) => <li key={i} className="text-[10px] text-gray-600 leading-snug break-words">{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {hasEdu && (
          <div className="resume-section mb-5">
            <SLabel>Education</SLabel>
            {r.education.filter(e => e.institution?.trim()).map(edu => (
              <div key={edu.id} className="resume-entry mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-semibold text-gray-900">{edu.institution}</span>
                  <span className="text-[9px] text-gray-400 whitespace-nowrap">{[edu.from, edu.to].filter(Boolean).join(' – ')}</span>
                </div>
                {(edu.degree || edu.field) && <p className="text-[10px] text-gray-500">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>}
              </div>
            ))}
          </div>
        )}

        {hasProjects && (
          <div className="resume-section mb-5">
            <SLabel>Projects</SLabel>
            {r.projects.filter(p => p.name?.trim()).map(proj => (
              <div key={proj.id} className="resume-entry mb-3">
                <div className="flex justify-between items-start">
                  <span style={{ color: accent }} className="text-[11px] font-semibold">{proj.name}</span>
                  <div className="flex gap-2 shrink-0 text-[9px] text-gray-400">
                    {proj.liveUrl?.trim() && <span>↗</span>}
                    {proj.link?.trim()    && <span>GH</span>}
                  </div>
                </div>
                {proj.description?.trim() && <p className="text-[10px] text-gray-600 break-words">{proj.description}</p>}
                <TechPills stack={proj.techStack} accentColor={accent} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── MINIMAL LAYOUT ──────────────────────────────────────── */
function MinimalResume({ r, accent }) {
  const hasSummary  = !!(r.summary?.trim())
  const hasExp      = (r.experience ?? []).some(e => e.company?.trim() || e.role?.trim())
  const hasEdu      = (r.education  ?? []).some(e => e.institution?.trim())
  const hasProjects = (r.projects   ?? []).some(p => p.name?.trim())
  const hasSkills   = Object.values(r.skillGroups ?? {}).flat().length > 0 || r.skills?.trim()
  const contact     = [r.email, r.phone, r.location].filter(Boolean)
  const links       = [r.github, r.linkedin].filter(Boolean)

  const SLabel = ({ children }) => (
    <p style={{ color: accent }}
      className="text-[8px] font-bold tracking-[0.25em] uppercase mb-3">{children}</p>
  )

  return (
    <div className="bg-white px-10 py-9" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="resume-entry mb-8">
        <h1 style={{ color: accent }} className="text-[20px] font-semibold tracking-tight break-words">{r.name || 'Your Name'}</h1>
        {contact.length > 0 && <p className="text-[9px] text-gray-400 mt-1">{contact.join('  ·  ')}</p>}
        {links.length > 0   && <p className="text-[8.5px] text-gray-400 mt-0.5">{links.join('  ·  ')}</p>}
      </div>

      {hasSummary && (
        <div className="resume-section mb-7">
          <SLabel>Summary</SLabel>
          <p className="text-[10.5px] text-gray-600 leading-[1.7] break-words">{r.summary}</p>
        </div>
      )}

      {hasExp && (
        <div className="resume-section mb-7">
          <SLabel>Experience</SLabel>
          <div className="flex flex-col gap-4">
            {r.experience.filter(e => e.company?.trim() || e.role?.trim()).map(exp => (
              <div key={exp.id} className="resume-entry">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10.5px] font-semibold text-gray-900">{exp.role}</span>
                  <span className="text-[8.5px] text-gray-400 whitespace-nowrap">{[exp.from, exp.to].filter(Boolean).join(' – ')}</span>
                </div>
                <p className="text-[9.5px] text-gray-400 mb-1">{exp.company}</p>
                {exp.bullets?.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 flex flex-col gap-0.5">
                    {exp.bullets.filter(Boolean).map((b,i) => <li key={i} className="text-[9.5px] text-gray-600 leading-snug break-words">{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasEdu && (
        <div className="resume-section mb-7">
          <SLabel>Education</SLabel>
          {r.education.filter(e => e.institution?.trim()).map(edu => (
            <div key={edu.id} className="resume-entry mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[10.5px] font-semibold text-gray-900">{edu.institution}</span>
                <span className="text-[8.5px] text-gray-400 whitespace-nowrap">{[edu.from, edu.to].filter(Boolean).join(' – ')}</span>
              </div>
              {(edu.degree || edu.field) && <p className="text-[9px] text-gray-400">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>}
            </div>
          ))}
        </div>
      )}

      {hasProjects && (
        <div className="resume-section mb-7">
          <SLabel>Projects</SLabel>
          <div className="flex flex-col gap-3">
            {r.projects.filter(p => p.name?.trim()).map(proj => (
              <div key={proj.id} className="resume-entry">
                <div className="flex justify-between items-start">
                  <span className="text-[10.5px] font-semibold text-gray-900">{proj.name}</span>
                  <div className="flex gap-2 shrink-0 text-[8.5px] text-gray-400 mt-0.5">
                    {proj.liveUrl?.trim() && <span>↗ live</span>}
                    {proj.link?.trim()    && <span>GH</span>}
                  </div>
                </div>
                {proj.description?.trim() && <p className="text-[9.5px] text-gray-500 break-words">{proj.description}</p>}
                <TechPills stack={proj.techStack} accentColor={accent} />
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSkills && (
        <div className="resume-section">
          <SLabel>Skills</SLabel>
          {r.skillGroups && Object.values(r.skillGroups).flat().length > 0
            ? <SkillPills skillGroups={r.skillGroups} textStyle={{ color: accent }} />
            : <p className="text-[9.5px] text-gray-600">{r.skills}</p>
          }
        </div>
      )}
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────── */
export default function ResumeDocument({ resume, template = 'classic', colorId = 'teal', className = '' }) {
  const r = resume || {}
  const accent = getColorValue(colorId)
  const contact = [r.email, r.phone, r.location].filter(v => v?.trim())
  const isEmpty = !r.name?.trim() && !contact.length && !r.summary?.trim()
    && !(r.experience?.length) && !(r.education?.length)

  if (isEmpty) return <EmptyState className={className} />

  const props = { r, accent }
  return (
    <div className={className}>
      {template === 'modern'  && <ModernResume  {...props} />}
      {template === 'minimal' && <MinimalResume {...props} />}
      {(template === 'classic' || !template) && <ClassicResume {...props} />}
    </div>
  )
}
