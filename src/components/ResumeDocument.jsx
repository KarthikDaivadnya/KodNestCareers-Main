/**
 * ResumeDocument — shared resume renderer
 * Used in Builder (right panel, scaled) and Preview (full size).
 * Sections only render when they contain real data.
 */

/* ── Section heading ──────────────────────────────────────────── */
function SectionHeading({ children }) {
  return (
    <div className="mb-3 mt-1">
      <h2
        style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
        className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-500 border-b border-gray-300 pb-1.5"
      >
        {children}
      </h2>
    </div>
  )
}

/* ── Main document ───────────────────────────────────────────── */
export default function ResumeDocument({ resume, className = '' }) {
  const r = resume || {}

  const hasSummary  = !!(r.summary?.trim())
  const hasEdu      = Array.isArray(r.education)  && r.education.some(e => e.institution?.trim())
  const hasExp      = Array.isArray(r.experience) && r.experience.some(e => e.company?.trim() || e.role?.trim())
  const hasProjects = Array.isArray(r.projects)   && r.projects.some(p => p.name?.trim())
  const hasSkills   = !!(r.skills?.trim())
  const hasGitHub   = !!(r.github?.trim())
  const hasLinkedIn = !!(r.linkedin?.trim())
  const hasLinks    = hasGitHub || hasLinkedIn

  const contactParts = [r.email, r.phone, r.location].filter(s => s?.trim())
  const isEmpty = !r.name?.trim() && contactParts.length === 0 && !hasSummary && !hasExp && !hasEdu

  if (isEmpty) {
    return (
      <div
        className={`bg-white p-10 flex flex-col items-center justify-center text-center min-h-[400px] ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-lg">📄</span>
        </div>
        <p className="text-sm font-medium text-gray-400">Your resume will appear here.</p>
        <p className="text-xs text-gray-300 mt-1">Start filling in the form on the left.</p>
      </div>
    )
  }

  return (
    <div
      className={`bg-white text-gray-900 p-8 leading-normal ${className}`}
      style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
    >

      {/* ── Header / Name ── */}
      <div className="text-center mb-5 pb-4 border-b border-gray-300">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-950 leading-tight">
          {r.name?.trim() || <span className="text-gray-300 italic text-base">Your Name</span>}
        </h1>

        {contactParts.length > 0 && (
          <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
            {contactParts.join('  ·  ')}
          </p>
        )}

        {hasLinks && (
          <p className="text-[10px] text-gray-400 mt-1 space-x-4">
            {hasGitHub   && <span>{r.github}</span>}
            {hasLinkedIn && <span>{r.linkedin}</span>}
          </p>
        )}
      </div>

      {/* ── Summary ── */}
      {hasSummary && (
        <div className="mb-4">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-[10.5px] text-gray-700 leading-[1.65]">{r.summary}</p>
        </div>
      )}

      {/* ── Experience ── */}
      {hasExp && (
        <div className="mb-4">
          <SectionHeading>Experience</SectionHeading>
          <div className="flex flex-col gap-3.5">
            {r.experience.filter(e => e.company?.trim() || e.role?.trim()).map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold text-gray-900 leading-snug">
                    {exp.role?.trim() || <em className="text-gray-300">Role</em>}
                  </span>
                  <span className="text-[9.5px] text-gray-400 shrink-0 whitespace-nowrap">
                    {[exp.from, exp.to].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 italic mb-1">{exp.company}</p>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 flex flex-col gap-0.5 mt-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[10px] text-gray-700 leading-snug">{b}</li>
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
        <div className="mb-4">
          <SectionHeading>Education</SectionHeading>
          <div className="flex flex-col gap-2">
            {r.education.filter(e => e.institution?.trim()).map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold text-gray-900">{edu.institution}</span>
                  <span className="text-[9.5px] text-gray-400 shrink-0 whitespace-nowrap">
                    {[edu.from, edu.to].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(edu.degree || edu.field) && (
                  <p className="text-[10px] text-gray-500 italic">
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Projects ── */}
      {hasProjects && (
        <div className="mb-4">
          <SectionHeading>Projects</SectionHeading>
          <div className="flex flex-col gap-2.5">
            {r.projects.filter(p => p.name?.trim()).map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold text-gray-900">{proj.name}</span>
                  {proj.link?.trim() && (
                    <span className="text-[9px] text-gray-400 shrink-0 truncate max-w-[160px]">{proj.link}</span>
                  )}
                </div>
                {proj.description?.trim() && (
                  <p className="text-[10px] text-gray-700 leading-snug mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {hasSkills && (
        <div className="mb-4">
          <SectionHeading>Skills</SectionHeading>
          <p className="text-[10px] text-gray-700 leading-relaxed">{r.skills}</p>
        </div>
      )}

    </div>
  )
}
