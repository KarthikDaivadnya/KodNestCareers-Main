import { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { SAMPLE_RESUME } from '../lib/sampleData'
import { computeATS, scoreColor } from '../lib/atsScore'
import { TEMPLATES, loadTemplate, saveTemplate, loadColor, saveColor, COLORS, bulletVerb, bulletHasNumber } from '../lib/templates'
import ResumeDocument from '../components/ResumeDocument'
import { Link } from 'react-router-dom'
import {
  Plus, Trash2, Eye, RefreshCw, AlertCircle, TrendingUp,
  ChevronDown, ChevronRight, Sparkles, Github, Globe,
} from 'lucide-react'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`

const SKILL_GROUPS = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft',      label: 'Soft Skills'       },
  { key: 'tools',     label: 'Tools & Technologies' },
]

const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft:      ['Team Leadership', 'Problem Solving'],
  tools:     ['Git', 'Docker', 'AWS'],
}

/* ── Primitives ── */
function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{children}</label>
}
function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all" />
  )
}
function Textarea({ value, onChange, placeholder, rows = 4, maxLength }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      rows={rows} maxLength={maxLength}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all resize-none" />
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
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900
        border border-dashed border-gray-200 hover:border-gray-400 px-3 py-2 rounded-lg w-full justify-center mt-3 transition-colors">
      <Plus className="w-3.5 h-3.5" />{label}
    </button>
  )
}

/* ── Tag / chip input ── */
function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState('')
  const commit = () => {
    const t = val.trim()
    if (t && !tags.includes(t)) { onAdd(t); setVal('') }
    else if (t) setVal('')
  }
  return (
    <div className="border border-gray-200 rounded-lg p-2 bg-white focus-within:ring-2 focus-within:ring-gray-200 min-h-[40px] flex flex-wrap gap-1.5 items-center">
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {tag}
          <button type="button" onClick={() => onRemove(tag)} className="text-gray-400 hover:text-red-400 leading-none ml-0.5">×</button>
        </span>
      ))}
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit() } }}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] text-xs outline-none bg-transparent text-gray-900 placeholder-gray-300"
      />
    </div>
  )
}

/* ── Bullet hints ── */
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
  const improvements = breakdown.filter(b => !b.passed).slice(0, 3)

  return (
    <div className="shrink-0 bg-white border-b border-gray-200 px-5 py-4 space-y-3">
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
                <span className="leading-snug flex-1">{item.label}</span>
                <span className="text-gray-300 text-[10px]">+{item.points}</span>
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
  const [colorId,  setColorId]  = useState(loadColor)
  const [openProjects, setOpenProjects] = useState(new Set())
  const [suggesting, setSuggesting]     = useState(false)

  const handleTemplate = id => { setTemplate(id); saveTemplate(id) }
  const handleColor    = id => { setColorId(id);  saveColor(id)    }

  const toggleProject = id => setOpenProjects(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

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
  const addProj = () => {
    const id = uid()
    setField('projects', [...(resume.projects??[]), { id, name:'', description:'', techStack:[], link:'', liveUrl:'' }])
    setOpenProjects(prev => new Set([...prev, id]))
  }
  const removeProj = id => {
    setField('projects', resume.projects.filter(p => p.id !== id))
    setOpenProjects(prev => { const n = new Set(prev); n.delete(id); return n })
  }
  const updateProj = (id, f, v) => setField('projects', resume.projects.map(p => p.id===id ? {...p,[f]:v} : p))
  const addTech    = (id, t) => setField('projects', resume.projects.map(p => p.id===id ? {...p, techStack:[...(p.techStack??[]),t]} : p))
  const removeTech = (id, t) => setField('projects', resume.projects.map(p => p.id===id ? {...p, techStack:(p.techStack??[]).filter(s=>s!==t)} : p))

  /* Skills */
  const addSkill    = (group, skill) => setField('skillGroups', { ...resume.skillGroups, [group]: [...(resume.skillGroups?.[group]??[]), skill] })
  const removeSkill = (group, skill) => setField('skillGroups', { ...resume.skillGroups, [group]: (resume.skillGroups?.[group]??[]).filter(s=>s!==skill) })
  const suggestSkills = () => {
    setSuggesting(true)
    setTimeout(() => {
      const merged = { ...(resume.skillGroups ?? { technical:[], soft:[], tools:[] }) }
      Object.entries(SUGGESTED_SKILLS).forEach(([g, arr]) => {
        merged[g] = [...new Set([...(merged[g]??[]), ...arr])]
      })
      setField('skillGroups', merged)
      setSuggesting(false)
    }, 1000)
  }

  const wc = resume.summary?.trim() ? resume.summary.trim().split(/\s+/).length : 0

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
              placeholder="Brief professional summary — aim for 40–120 words." rows={4} />
            <p className="text-xs text-gray-400 mt-1">{wc} words{wc<40?' — target 40–120':wc>120?' — try shortening':' ✓'}</p>
          </FormSection>

          {/* Education */}
          <FormSection title="Education">
            {(resume.education??[]).map(edu => (
              <div key={edu.id} className="relative border border-gray-100 rounded-xl bg-gray-50/50 p-4 mb-3">
                <button type="button" onClick={()=>removeEdu(edu.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="pr-8 grid grid-cols-2 gap-2">
                  <div className="col-span-2"><Label>Institution</Label><Input value={edu.institution} onChange={v=>updateEdu(edu.id,'institution',v)} placeholder="PES University" /></div>
                  <div><Label>Degree</Label><Input value={edu.degree} onChange={v=>updateEdu(edu.id,'degree',v)} placeholder="B.Tech" /></div>
                  <div><Label>Field</Label><Input value={edu.field} onChange={v=>updateEdu(edu.id,'field',v)} placeholder="Computer Science" /></div>
                  <div><Label>From</Label><Input value={edu.from} onChange={v=>updateEdu(edu.id,'from',v)} placeholder="2018" /></div>
                  <div><Label>To</Label><Input value={edu.to} onChange={v=>updateEdu(edu.id,'to',v)} placeholder="2022" /></div>
                </div>
              </div>
            ))}
            <AddBtn onClick={addEdu} label="Add Education" />
          </FormSection>

          {/* Experience */}
          <FormSection title="Experience">
            {(resume.experience??[]).map(exp => (
              <div key={exp.id} className="relative border border-gray-100 rounded-xl bg-gray-50/50 p-4 mb-3">
                <button type="button" onClick={()=>removeExp(exp.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="pr-8">
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
                </div>
              </div>
            ))}
            <AddBtn onClick={addExp} label="Add Experience" />
          </FormSection>

          {/* Projects — collapsible accordion */}
          <FormSection title="Projects">
            {(resume.projects??[]).map(proj => {
              const isOpen = openProjects.has(proj.id)
              const descLen = proj.description?.length ?? 0
              return (
                <div key={proj.id} className="border border-gray-200 rounded-xl mb-3 overflow-hidden">
                  {/* Accordion header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleProject(proj.id)}>
                    <div className="flex items-center gap-2 min-w-0">
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {proj.name?.trim() || <span className="text-gray-400 italic">Untitled Project</span>}
                      </span>
                    </div>
                    <button type="button" onClick={e=>{e.stopPropagation();removeProj(proj.id)}}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0 ml-2">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Accordion body */}
                  {isOpen && (
                    <div className="px-4 py-4 flex flex-col gap-3 border-t border-gray-100">
                      <div>
                        <Label>Project Title</Label>
                        <Input value={proj.name} onChange={v=>updateProj(proj.id,'name',v)} placeholder="My Awesome Project" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={proj.description} onChange={v=>updateProj(proj.id,'description',v)}
                          placeholder="What does it do, what tech, what impact? Use numbers." rows={2} maxLength={200} />
                        <p className={`text-xs mt-0.5 ${descLen>190?'text-red-400':descLen>160?'text-amber-500':'text-gray-400'}`}>
                          {descLen}/200
                          {proj.description?.trim() && !bulletHasNumber(proj.description) && (
                            <span className="text-amber-500 ml-2">↳ Add measurable impact (numbers).</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <Label>Tech Stack</Label>
                        <TagInput
                          tags={proj.techStack??[]}
                          onAdd={t=>addTech(proj.id,t)}
                          onRemove={t=>removeTech(proj.id,t)}
                          placeholder="Type and press Enter"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label><Globe className="w-3 h-3 inline mr-1" />Live URL</Label>
                          <Input value={proj.liveUrl} onChange={v=>updateProj(proj.id,'liveUrl',v)} placeholder="https://myproject.vercel.app" type="url" />
                        </div>
                        <div>
                          <Label><Github className="w-3 h-3 inline mr-1" />GitHub URL</Label>
                          <Input value={proj.link} onChange={v=>updateProj(proj.id,'link',v)} placeholder="https://github.com/you/repo" type="url" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <AddBtn onClick={addProj} label="Add Project" />
          </FormSection>

          {/* Skills — 3 tag groups */}
          <FormSection title="Skills">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400">
                {Object.values(resume.skillGroups??{}).flat().length} skills total
              </span>
              <button type="button" onClick={suggestSkills} disabled={suggesting}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60">
                <Sparkles className="w-3 h-3" />
                {suggesting ? 'Adding…' : '✨ Suggest Skills'}
              </button>
            </div>
            {SKILL_GROUPS.map(({ key, label }) => {
              const skills = resume.skillGroups?.[key] ?? []
              return (
                <div key={key} className="mb-4 last:mb-0">
                  <Label>{label} ({skills.length})</Label>
                  <TagInput
                    tags={skills}
                    onAdd={t=>addSkill(key,t)}
                    onRemove={t=>removeSkill(key,t)}
                    placeholder="Type a skill and press Enter"
                  />
                </div>
              )
            })}
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

      {/* ── Right: ATS Score + Preview ── */}
      <div className="w-[45%] flex flex-col overflow-hidden bg-gray-100">
        <ScoringPanel resume={resume} />
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
          <TemplateTabs active={template} onChange={handleTemplate} />
          <Link to="/preview" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <Eye className="w-3.5 h-3.5" />Full
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white shadow-lg ring-1 ring-gray-200"
            style={{ transform:'scale(0.7)', transformOrigin:'top center', marginBottom:'-30%' }}>
            <ResumeDocument resume={resume} template={template} colorId={colorId} />
          </div>
        </div>
      </div>

    </div>
  )
}
