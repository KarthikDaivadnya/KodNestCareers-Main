import { TEMPLATE_STYLES } from '../lib/templates'

export default function ResumeDocument({ resume, template = 'classic', className = '' }) {
  const r = resume || {}
  const s = TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.classic

  const hasSummary  = !!(r.summary?.trim())
  const hasEdu      = Array.isArray(r.education)  && r.education.some(e => e.institution?.trim())
  const hasExp      = Array.isArray(r.experience) && r.experience.some(e => e.company?.trim() || e.role?.trim())
  const hasProjects = Array.isArray(r.projects)   && r.projects.some(p => p.name?.trim())
  const hasSkills   = !!(r.skills?.trim())
  const hasGitHub   = !!(r.github?.trim())
  const hasLinkedIn = !!(r.linkedin?.trim())
  const hasLinks    = hasGitHub || hasLinkedIn
  const contactParts = [r.email, r.phone, r.location].filter(v => v?.trim())
  const isEmpty = !r.name?.trim() && !contactParts.length && !hasSummary && !hasExp && !hasEdu

  if (isEmpty) {
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

  return (
    <div className={`bg-white text-gray-900 p-8 ${className}`} style={{ fontFamily: s.fontFamily }}>

      {/* ── Header ── */}
      <div className={`resume-entry ${s.headerAlign} ${s.headerBorder}`}>
        <h1 className={`${s.nameClass} break-words`}>
          {r.name?.trim() || <span className="text-gray-300 italic text-base">Your Name</span>}
        </h1>
        {contactParts.length > 0 && (
          <p className={`${s.contactClass} break-words`}>{contactParts.join('  ·  ')}</p>
        )}
        {hasLinks && (
          <p className={`${s.linkClass} break-all`}>
            {hasGitHub   && <span className="mr-3">{r.github}</span>}
            {hasLinkedIn && <span>{r.linkedin}</span>}
          </p>
        )}
      </div>

      {/* ── Summary ── */}
      {hasSummary && (
        <div className={`resume-section ${s.sectionWrap}`}>
          <div className={s.sectionLabel}>Summary</div>
          <p className={`${s.bodyText} break-words`}>{r.summary}</p>
        </div>
      )}

      {/* ── Experience ── */}
      {hasExp && (
        <div className={`resume-section ${s.sectionWrap}`}>
          <div className={s.sectionLabel}>Experience</div>
          <div className="flex flex-col gap-3">
            {r.experience.filter(e => e.company?.trim() || e.role?.trim()).map(exp => (
              <div key={exp.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`${s.entryRole} break-words`}>{exp.role}</span>
                  <span className={`${s.entryDate} shrink-0 whitespace-nowrap`}>
                    {[exp.from, exp.to].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <p className={`${s.entryCompany} break-words`}>{exp.company}</p>
                {exp.bullets?.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 flex flex-col gap-0.5 mt-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className={`${s.bulletText} break-words`}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Education ── */}
      {hasEdu && (
        <div className={`resume-section ${s.sectionWrap}`}>
          <div className={s.sectionLabel}>Education</div>
          <div className="flex flex-col gap-2">
            {r.education.filter(e => e.institution?.trim()).map(edu => (
              <div key={edu.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`${s.entryRole} break-words`}>{edu.institution}</span>
                  <span className={`${s.entryDate} shrink-0 whitespace-nowrap`}>
                    {[edu.from, edu.to].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(edu.degree || edu.field) && (
                  <p className={`${s.entryCompany} break-words`}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Projects ── */}
      {hasProjects && (
        <div className={`resume-section ${s.sectionWrap}`}>
          <div className={s.sectionLabel}>Projects</div>
          <div className="flex flex-col gap-2.5">
            {r.projects.filter(p => p.name?.trim()).map(proj => (
              <div key={proj.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`${s.entryRole} break-words`}>{proj.name}</span>
                  {proj.link?.trim() && (
                    <span className={`${s.entryDate} break-all max-w-[200px] text-right`}>{proj.link}</span>
                  )}
                </div>
                {proj.description?.trim() && (
                  <p className={`${s.bulletText} mt-0.5 break-words`}>{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {hasSkills && (
        <div className={`resume-section ${s.sectionWrap}`}>
          <div className={s.sectionLabel}>Skills</div>
          <p className={`${s.skillsText} break-words`}>{r.skills}</p>
        </div>
      )}

    </div>
  )
}
