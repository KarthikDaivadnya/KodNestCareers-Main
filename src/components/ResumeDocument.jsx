/**
 * ResumeDocument — shared resume renderer
 * Used in Builder (right panel, scaled) and Preview (full size)
 *
 * Props:
 *   resume  — the resume data object
 *   scale   — optional CSS transform scale (default 1)
 */

/* ── Section heading ──────────────────────────────────────────── */
function SectionHeading({ children }) {
  return (
    <div className="mb-2">
      <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 border-b border-gray-300 pb-1">
        {children}
      </h2>
    </div>
  )
}

/* ── Empty state placeholder ─────────────────────────────────── */
function EmptyLine({ width = 'w-40' }) {
  return <div className={`h-2.5 bg-gray-100 rounded ${width} mt-1`} />
}

/* ── Main document ───────────────────────────────────────────── */
export default function ResumeDocument({ resume, className = '' }) {
  const r = resume || {}

  const hasName     = !!(r.name?.trim())
  const hasSummary  = !!(r.summary?.trim())
  const hasEdu      = Array.isArray(r.education)  && r.education.length  > 0
  const hasExp      = Array.isArray(r.experience) && r.experience.length > 0
  const hasProjects = Array.isArray(r.projects)   && r.projects.length   > 0
  const hasSkills   = !!(r.skills?.trim())
  const hasLinks    = !!(r.github?.trim() || r.linkedin?.trim())

  const contactParts = [r.email, r.phone, r.location].filter(Boolean)

  return (
    <div
      className={`bg-white font-serif text-gray-900 p-8 ${className}`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >

      {/* ── Header ── */}
      <div className="text-center mb-6 border-b border-gray-200 pb-5">
        {hasName ? (
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 leading-tight mb-1">
            {r.name}
          </h1>
        ) : (
          <div className="h-6 bg-gray-100 rounded w-48 mx-auto mb-1" />
        )}

        {/* Contact line */}
        {contactParts.length > 0 ? (
          <p className="text-xs text-gray-500 mt-1">
            {contactParts.join(' · ')}
          </p>
        ) : (
          <div className="h-3 bg-gray-100 rounded w-64 mx-auto mt-1" />
        )}

        {/* Links */}
        {hasLinks && (
          <div className="flex items-center justify-center gap-4 mt-1.5 text-xs text-gray-500">
            {r.github    && <span>{r.github}</span>}
            {r.linkedin  && <span>{r.linkedin}</span>}
          </div>
        )}
      </div>

      {/* ── Summary ── */}
      {(hasSummary || true) && (
        <div className="mb-5">
          <SectionHeading>Summary</SectionHeading>
          {hasSummary ? (
            <p className="text-[11px] text-gray-700 leading-relaxed">{r.summary}</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              <EmptyLine width="w-full" />
              <EmptyLine width="w-5/6" />
              <EmptyLine width="w-4/6" />
            </div>
          )}
        </div>
      )}

      {/* ── Experience ── */}
      <div className="mb-5">
        <SectionHeading>Experience</SectionHeading>
        {hasExp ? (
          <div className="flex flex-col gap-3">
            {r.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-bold text-gray-900">{exp.role}</p>
                  <p className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {[exp.from, exp.to].filter(Boolean).join(' – ')}
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 mb-1">{exp.company}</p>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-3 flex flex-col gap-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[10px] text-gray-700 leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <EmptyLine width="w-48" />
            <EmptyLine width="w-32" />
            <EmptyLine width="w-full" />
            <EmptyLine width="w-5/6" />
          </div>
        )}
      </div>

      {/* ── Education ── */}
      <div className="mb-5">
        <SectionHeading>Education</SectionHeading>
        {hasEdu ? (
          <div className="flex flex-col gap-2">
            {r.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-bold text-gray-900">{edu.institution}</p>
                  <p className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {[edu.from, edu.to].filter(Boolean).join(' – ')}
                  </p>
                </div>
                <p className="text-[10px] text-gray-500">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <EmptyLine width="w-48" />
            <EmptyLine width="w-36" />
          </div>
        )}
      </div>

      {/* ── Projects ── */}
      {(hasProjects || true) && (
        <div className="mb-5">
          <SectionHeading>Projects</SectionHeading>
          {hasProjects ? (
            <div className="flex flex-col gap-2">
              {r.projects.map((proj) => (
                <div key={proj.id}>
                  <p className="text-[11px] font-bold text-gray-900">{proj.name}</p>
                  {proj.description && (
                    <p className="text-[10px] text-gray-700 leading-snug mt-0.5">{proj.description}</p>
                  )}
                  {proj.link && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{proj.link}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <EmptyLine width="w-40" />
              <EmptyLine width="w-full" />
            </div>
          )}
        </div>
      )}

      {/* ── Skills ── */}
      <div className="mb-5">
        <SectionHeading>Skills</SectionHeading>
        {hasSkills ? (
          <p className="text-[10px] text-gray-700 leading-relaxed">{r.skills}</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <EmptyLine width="w-5/6" />
          </div>
        )}
      </div>

    </div>
  )
}
