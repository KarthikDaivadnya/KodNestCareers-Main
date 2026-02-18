import { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { SAMPLE_RESUME } from '../lib/sampleData'
import { computeATS, scoreColor } from '../lib/atsScore'
import { TEMPLATES, loadTemplate, saveTemplate, bulletVerb, bulletHasNumber } from '../lib/templates'
import ResumeDocument from '../components/ResumeDocument'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Eye, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`

/* ── Primitives ── */
function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{children}</label>
}
function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all" />
  )
}
function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all resize-none" />
  )
}
function FormSection({ title, children }) {
  return (
    <div className="border-b border-gray-100 pb-7 mb-7 last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.12em] mb-4">{title}</h3>
      {children}
    </div>
  )
}
function AddBtn({ onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-dashed border-gray-200 hover:border-gray-400 px-3 py-2 rounded-lg w-full justify-center mt-3 transition-colors">
      <Plus className="w-3.5 h-3.5" />{label}
    </button>
  )
}
function EntryCard({ children, onRemove }) {
  return (
    <div className="relative border border-gray-100 rounded-xl bg-gray-50/50 p-4 mb-3">
      <button type="button" onClick={onRemove}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <div className="pr-8">{children}</div>
    </div>
  )
}

/* ── Bullet guidance hints ── */
function BulletHints({ text }) {
  if (!text?.trim()) return null
  const noVerb   = !bulletVerb(text)
  const noNumber = !bulletHasNumber(text)
  if (!noVerb && !noNumber) return null
  return (
    <div className="flex flex-col gap-0.5 mt-0.5 ml-4">
      {noVerb   && <span className="text-[10px] text-amber-500">↳ Start with a strong action verb.</span>}
      {noNumber && <span className="text-[10px] text-amber-500">↳ Add measurable impact (numbers).</span>}
    </div>
  )
}

/* ── Template tabs ── */
function TemplateTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {TEMPLATES.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
            active === t.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ── ATS + Improvement panel ── */
function ScoringPanel({ resume }) {
  const { score, suggestions, breakdown } = computeATS(resume)
  const color = scoreColor(score)
  const barColor  = color === 'green' ? 'bg-green-400' : color === 'amber' ? 'bg-amber-400' : 'bg-red-400'
  const scoreText = color === 'green' ? 'text-green-600' : color === 'amber' ? 'text-amber-600' : 'text-red-500'
  const badgeCls  = color === 'green' ? 'bg-green-100 text-green-700' : color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
  const label     = score >= 75 ? 'Strong' : score >= 45 ? 'Needs Work' : 'Weak'

  /* Top 3 improvements from breakdown failures */
  const improvements = breakdown.filter(b => !b.passed).slice(0, 3)

  return (
    <div className="shrink-0 bg-white border-b border-gray-200 px-5 py-4 space-y-3">

      {/* Score */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ATS Readiness Score</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-3xl font-bold leading-none ${scoreText}`}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/ 100</span>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${badgeCls}`}>{label}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top 3 Improvements */}
      {improvements.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top 3 Improvements</span>
          </div>
          <div className="flex flex-col gap-1">
            {improvements.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <span className="leading-snug">{item.label}</span>
                <span className="text-gray-300 ml-auto text-[10px]">+{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && improvements.length === 0 && (
        <p className="text-xs text-green-600 font-medium">✓ All ATS checks passed.</p>
      )}

    </div>
  )
}

/* ── Builder ── */
export default function Builder() {
  const { resume, setField, setResume, resetResume } = useResume()
  const [template, setTemplate] = useState(loadTemplate)
  const handleTemplate = id => { setTemplate(id); saveTemplate(id) }

  /* Education */
  const addEdu    = () => setField('education', [...(resume.education??[]), { id:uid(), institution:'', degree:'', field:'', from:'', to:'' }])
  const removeEdu = id => setField('education', resume.education.filter(e => e.id !== id))
  const updateEdu = (id, f, v) => setField('education', resume.education.map(e => e.id===id ? {...e,[f]:v} : e))

  /* Experience */
  const addExp    = () => setField('experience', [...(resume.experience??[]), { id:uid(), company:'', role:'', from:'', to:'', bullets:[''] }])
  const removeExp = id => setField('experience', resume.experience.filter(e => e.id !== id))
  const updateExp = (id, f, v) => setField('experience', resume.experience.map(e => e.id===id ? {...e,[f]:v} : e))
  const addBullet    = expId => setField('experience', resume.experience.map(e => e.id===expId ? {...e, bullets:[...(e.bullets??[]),'']} : e))
  const removeBullet = (expId, bi) => setField('experience', resume.experience.map(e => e.id===expId ? {...e, bullets:e.bullets.filter((_,i)=>i!==bi)} : e))
  const updateBullet = (expId, bi, v) => setField('experience', resume.experience.map(e => e.id===expId ? {...e, bullets:e.bullets.map((b,i)=>i===bi?v:b)} : e))

  /* Projects */
  const addProj    = () => setField('projects', [...(resume.projects??[]), { id:uid(), name:'', description:'', link:'' }])
  const removeProj = id => setField('projects', resume.projects.filter(p => p.id !== id))
  const updateProj = (id, f, v) => setField('projects', resume.projects.map(p => p.id===id ? {...p,[f]:v} : p))

  const wc = resume.summary?.trim() ? resume.summary.trim().split(/\s+/).length : 0
  const sc = resume.skills?.trim() ? resume.skills.split(',').map(s=>s.trim()).filter(Boolean).length : 0

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── Left: Form ── */}
      <div className="w-[55%] overflow-y-auto border-r border-gray-200 bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-7 py-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Resume Details</h2>
          <div className="flex items-center gap-2">
            <button onClick={resetResume} className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-3 h-3" />Clear
            </button>
            <button onClick={() => setResume(SAMPLE_RESUME)} className="text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
              Load Sample
            </button>
            <Link to="/preview" className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <Eye className="w-3 h-3" />Preview
            </Link>
          </div>
        </div>

        <div className="px-7 py-7">

          {/* Personal Info */}
          <FormSection title="Personal Info">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full Name</Label><Input value={resume.name} onChange={v=>setField('name',v)} placeholder="Jane Doe" /></div>
              <div><Label>Email</Label><Input value={resume.email} onChange={v=>setField('email',v)} placeholder="jane@example.com" type="email" /></div>
              <div><Label>Phone</Label><Input value={resume.phone} onChange={v=>setField('phone',v)} placeholder="+91 98765 43210" /></div>
              <div><Label>Location</Label><Input value={resume.location} onChange={v=>setField('location',v)} placeholder="Bengaluru, India" /></div>
            </div>
          </FormSection>

          {/* Summary */}
          <FormSection title="Summary">
            <Textarea value={resume.summary} onChange={v=>setField('summary',v)}
              placeholder="Brief professional summary — aim for 40–120 words for ATS score boost." rows={4} />
            <p className="text-xs text-gray-400 mt-1">{wc} words{wc < 40 ? ' — target 40–120' : wc > 120 ? ' — try shortening' : ' ✓'}</p>
          </FormSection>

          {/* Education */}
          <FormSection title="Education">
            {(resume.education??[]).map(edu => (
              <EntryCard key={edu.id} onRemove={()=>removeEdu(edu.id)}>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2"><Label>Institution</Label><Input value={edu.institution} onChange={v=>updateEdu(edu.id,'institution',v)} placeholder="PES University" /></div>
                  <div><Label>Degree</Label><Input value={edu.degree} onChange={v=>updateEdu(edu.id,'degree',v)} placeholder="B.Tech" /></div>
                  <div><Label>Field</Label><Input value={edu.field} onChange={v=>updateEdu(edu.id,'field',v)} placeholder="Computer Science" /></div>
                  <div><Label>From</Label><Input value={edu.from} onChange={v=>updateEdu(edu.id,'from',v)} placeholder="2018" /></div>
                  <div><Label>To</Label><Input value={edu.to} onChange={v=>updateEdu(edu.id,'to',v)} placeholder="2022" /></div>
                </div>
              </EntryCard>
            ))}
            <AddBtn onClick={addEdu} label="Add Education" />
          </FormSection>

          {/* Experience */}
          <FormSection title="Experience">
            {(resume.experience??[]).map(exp => (
              <EntryCard key={exp.id} onRemove={()=>removeExp(exp.id)}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div><Label>Company</Label><Input value={exp.company} onChange={v=>updateExp(exp.id,'company',v)} placeholder="Acme Corp" /></div>
                  <div><Label>Role</Label><Input value={exp.role} onChange={v=>updateExp(exp.id,'role',v)} placeholder="Software Engineer" /></div>
                  <div><Label>From</Label><Input value={exp.from} onChange={v=>updateExp(exp.id,'from',v)} placeholder="Jul 2022" /></div>
                  <div><Label>To</Label><Input value={exp.to} onChange={v=>updateExp(exp.id,'to',v)} placeholder="Present" /></div>
                </div>
                <Label>Bullet Points</Label>
                <div className="flex flex-col gap-1 mt-1">
                  {(exp.bullets??[]).map((b, bi) => (
                    <div key={bi}>
                      <div className="flex items-start gap-1.5">
                        <span className="text-gray-300 mt-2 text-xs shrink-0">•</span>
                        <input type="text" value={b} onChange={e=>updateBullet(exp.id,bi,e.target.value)}
                          placeholder="Achieved X by doing Y, resulting in Z (use numbers)."
                          className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white" />
                        <button type="button" onClick={()=>removeBullet(exp.id,bi)} className="text-gray-300 hover:text-red-400 transition-colors mt-1.5 shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <BulletHints text={b} />
                    </div>
                  ))}
                  <button type="button" onClick={()=>addBullet(exp.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-0.5 ml-4">
                    <Plus className="w-3 h-3" />Add bullet
                  </button>
                </div>
              </EntryCard>
            ))}
            <AddBtn onClick={addExp} label="Add Experience" />
          </FormSection>

          {/* Projects */}
          <FormSection title="Projects">
            {(resume.projects??[]).map(proj => (
              <EntryCard key={proj.id} onRemove={()=>removeProj(proj.id)}>
                <div className="flex flex-col gap-2">
                  <div><Label>Project Name</Label><Input value={proj.name} onChange={v=>updateProj(proj.id,'name',v)} placeholder="My Awesome Project" /></div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={proj.description} onChange={v=>updateProj(proj.id,'description',v)} placeholder="What does it do, what tech, what impact? Use numbers." rows={2} />
                    {proj.description?.trim() && !bulletHasNumber(proj.description) && (
                      <span className="text-[10px] text-amber-500">↳ Add measurable impact (numbers).</span>
                    )}
                  </div>
                  <div><Label>Link (optional)</Label><Input value={proj.link} onChange={v=>updateProj(proj.id,'link',v)} placeholder="https://github.com/you/project" /></div>
                </div>
              </EntryCard>
            ))}
            <AddBtn onClick={addProj} label="Add Project" />
          </FormSection>

          {/* Skills */}
          <FormSection title="Skills">
            <Label>Skills (comma-separated, 8+ for ATS)</Label>
            <Textarea value={resume.skills} onChange={v=>setField('skills',v)} placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Git, Python..." rows={2} />
            <p className="text-xs text-gray-400 mt-1">{sc} skills{sc < 8 ? ` — target 8+ (${8-sc} more)` : ' ✓'}</p>
          </FormSection>

          {/* Links */}
          <FormSection title="Links">
            <div className="flex flex-col gap-3">
              <div><Label>GitHub</Label><Input value={resume.github} onChange={v=>setField('github',v)} placeholder="https://github.com/username" type="url" /></div>
              <div><Label>LinkedIn</Label><Input value={resume.linkedin} onChange={v=>setField('linkedin',v)} placeholder="https://linkedin.com/in/username" type="url" /></div>
            </div>
          </FormSection>

        </div>
      </div>

      {/* ── Right: Scoring + Preview ── */}
      <div className="w-[45%] flex flex-col overflow-hidden bg-gray-100">

        {/* Scoring panel */}
        <ScoringPanel resume={resume} />

        {/* Preview header with template tabs */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
          <TemplateTabs active={template} onChange={handleTemplate} />
          <Link to="/preview" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <Eye className="w-3.5 h-3.5" />Full
          </Link>
        </div>

        {/* Live preview */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white shadow-lg ring-1 ring-gray-200" style={{ transform:'scale(0.7)', transformOrigin:'top center', marginBottom:'-30%' }}>
            <ResumeDocument resume={resume} template={template} />
          </div>
        </div>

      </div>
    </div>
  )
}
