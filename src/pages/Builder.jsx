import { useResume } from '../context/ResumeContext'
import { SAMPLE_RESUME } from '../lib/sampleData'
import ResumeDocument from '../components/ResumeDocument'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Eye, RefreshCw } from 'lucide-react'

/* ── Helpers ─────────────────────────────────────────────────── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/* ── Input primitives ────────────────────────────────────────── */
function Label({ children }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
      {children}
    </label>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all ${className}`}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white transition-all resize-none"
    />
  )
}

/* ── Section wrapper ─────────────────────────────────────────── */
function FormSection({ title, children }) {
  return (
    <div className="border-b border-gray-100 pb-7 mb-7 last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.12em] mb-4">{title}</h3>
      {children}
    </div>
  )
}

/* ── Add button ──────────────────────────────────────────────── */
function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900
        border border-dashed border-gray-200 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors w-full justify-center mt-3"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

/* ── Remove button ───────────────────────────────────────────── */
function RemoveBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}

/* ── Entry card wrapper ──────────────────────────────────────── */
function EntryCard({ children, onRemove }) {
  return (
    <div className="relative border border-gray-100 rounded-xl bg-gray-50/50 p-4 mb-3">
      <div className="absolute top-3 right-3">
        <RemoveBtn onClick={onRemove} />
      </div>
      <div className="pr-8">{children}</div>
    </div>
  )
}

/* ── Builder Page ────────────────────────────────────────────── */
export default function Builder() {
  const { resume, setField, setResume, resetResume } = useResume()

  /* ── Personal Info ── */
  const setPersonal = (field) => (val) => setField(field, val)

  /* ── Summary ── */
  const setSummary = (val) => setField('summary', val)

  /* ── Education ── */
  const updateEdu = (id, field, val) =>
    setField('education', resume.education.map(e => e.id === id ? { ...e, [field]: val } : e))
  const addEdu = () =>
    setField('education', [...(resume.education ?? []), { id: uid(), institution: '', degree: '', field: '', from: '', to: '' }])
  const removeEdu = (id) =>
    setField('education', resume.education.filter(e => e.id !== id))

  /* ── Experience ── */
  const updateExp = (id, field, val) =>
    setField('experience', resume.experience.map(e => e.id === id ? { ...e, [field]: val } : e))
  const updateBullet = (expId, bIdx, val) =>
    setField('experience', resume.experience.map(e =>
      e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => i === bIdx ? val : b) } : e
    ))
  const addBullet = (expId) =>
    setField('experience', resume.experience.map(e =>
      e.id === expId ? { ...e, bullets: [...(e.bullets ?? []), ''] } : e
    ))
  const removeBullet = (expId, bIdx) =>
    setField('experience', resume.experience.map(e =>
      e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bIdx) } : e
    ))
  const addExp = () =>
    setField('experience', [...(resume.experience ?? []), { id: uid(), company: '', role: '', from: '', to: '', bullets: [''] }])
  const removeExp = (id) =>
    setField('experience', resume.experience.filter(e => e.id !== id))

  /* ── Projects ── */
  const updateProj = (id, field, val) =>
    setField('projects', resume.projects.map(p => p.id === id ? { ...p, [field]: val } : p))
  const addProj = () =>
    setField('projects', [...(resume.projects ?? []), { id: uid(), name: '', description: '', link: '' }])
  const removeProj = (id) =>
    setField('projects', resume.projects.filter(p => p.id !== id))

  /* ── Load sample ── */
  const loadSample = () => setResume(SAMPLE_RESUME)

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── Left: Form (55%) ── */}
      <div className="w-[55%] overflow-y-auto border-r border-gray-200 bg-white">

        {/* Form toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-7 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Resume Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={resetResume}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-3 h-3" />
              Clear
            </button>
            <button
              onClick={loadSample}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Load Sample Data
            </button>
            <Link
              to="/preview"
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Eye className="w-3 h-3" />
              Preview
            </Link>
          </div>
        </div>

        {/* Form body */}
        <div className="px-7 py-7">

          {/* ── Personal Info ── */}
          <FormSection title="Personal Info">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label>Full Name</Label>
                <Input value={resume.name} onChange={setPersonal('name')} placeholder="Jane Doe" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={resume.email} onChange={setPersonal('email')} placeholder="jane@example.com" type="email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={resume.phone} onChange={setPersonal('phone')} placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={resume.location} onChange={setPersonal('location')} placeholder="Bengaluru, India" />
              </div>
            </div>
          </FormSection>

          {/* ── Summary ── */}
          <FormSection title="Summary">
            <Textarea
              value={resume.summary}
              onChange={setSummary}
              placeholder="Brief professional summary — 2 to 4 sentences about your background, strengths, and what you bring to the role."
              rows={4}
            />
          </FormSection>

          {/* ── Education ── */}
          <FormSection title="Education">
            {(resume.education ?? []).map((edu) => (
              <EntryCard key={edu.id} onRemove={() => removeEdu(edu.id)}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="col-span-2">
                    <Label>Institution</Label>
                    <Input value={edu.institution} onChange={v => updateEdu(edu.id, 'institution', v)} placeholder="PES University" />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input value={edu.degree} onChange={v => updateEdu(edu.id, 'degree', v)} placeholder="B.Tech" />
                  </div>
                  <div>
                    <Label>Field</Label>
                    <Input value={edu.field} onChange={v => updateEdu(edu.id, 'field', v)} placeholder="Computer Science" />
                  </div>
                  <div>
                    <Label>From</Label>
                    <Input value={edu.from} onChange={v => updateEdu(edu.id, 'from', v)} placeholder="2018" />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input value={edu.to} onChange={v => updateEdu(edu.id, 'to', v)} placeholder="2022" />
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addEdu} label="Add Education" />
          </FormSection>

          {/* ── Experience ── */}
          <FormSection title="Experience">
            {(resume.experience ?? []).map((exp) => (
              <EntryCard key={exp.id} onRemove={() => removeExp(exp.id)}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <Label>Company</Label>
                    <Input value={exp.company} onChange={v => updateExp(exp.id, 'company', v)} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={exp.role} onChange={v => updateExp(exp.id, 'role', v)} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <Label>From</Label>
                    <Input value={exp.from} onChange={v => updateExp(exp.id, 'from', v)} placeholder="Jul 2022" />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input value={exp.to} onChange={v => updateExp(exp.id, 'to', v)} placeholder="Present" />
                  </div>
                </div>

                {/* Bullets */}
                <Label>Bullet Points</Label>
                <div className="flex flex-col gap-1.5 mt-1">
                  {(exp.bullets ?? []).map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5">
                      <span className="text-gray-300 mt-2 text-xs shrink-0">•</span>
                      <input
                        type="text"
                        value={b}
                        onChange={e => updateBullet(exp.id, bIdx, e.target.value)}
                        placeholder="Achieved X by doing Y, resulting in Z."
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-300
                          focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(exp.id, bIdx)}
                        className="text-gray-300 hover:text-red-400 transition-colors mt-1.5 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBullet(exp.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-0.5 ml-4"
                  >
                    <Plus className="w-3 h-3" />
                    Add bullet
                  </button>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addExp} label="Add Experience" />
          </FormSection>

          {/* ── Projects ── */}
          <FormSection title="Projects">
            {(resume.projects ?? []).map((proj) => (
              <EntryCard key={proj.id} onRemove={() => removeProj(proj.id)}>
                <div className="flex flex-col gap-2">
                  <div>
                    <Label>Project Name</Label>
                    <Input value={proj.name} onChange={v => updateProj(proj.id, 'name', v)} placeholder="My Awesome Project" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={proj.description}
                      onChange={v => updateProj(proj.id, 'description', v)}
                      placeholder="What does it do, what tech was used, what was the impact?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Link (optional)</Label>
                    <Input value={proj.link} onChange={v => updateProj(proj.id, 'link', v)} placeholder="https://github.com/you/project" />
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addProj} label="Add Project" />
          </FormSection>

          {/* ── Skills ── */}
          <FormSection title="Skills">
            <Label>Skills (comma-separated)</Label>
            <Textarea
              value={resume.skills}
              onChange={v => setField('skills', v)}
              placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Git..."
              rows={2}
            />
          </FormSection>

          {/* ── Links ── */}
          <FormSection title="Links">
            <div className="flex flex-col gap-3">
              <div>
                <Label>GitHub</Label>
                <Input
                  value={resume.github}
                  onChange={v => setField('github', v)}
                  placeholder="https://github.com/username"
                  type="url"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={resume.linkedin}
                  onChange={v => setField('linkedin', v)}
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                />
              </div>
            </div>
          </FormSection>

        </div>
      </div>

      {/* ── Right: Live Preview (45%) ── */}
      <div className="w-[45%] overflow-y-auto bg-gray-100 flex flex-col">

        {/* Preview header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
          <Link
            to="/preview"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            Full Preview
          </Link>
        </div>

        {/* Scaled resume preview */}
        <div className="flex-1 overflow-y-auto p-5">
          <div
            className="bg-white shadow-lg ring-1 ring-gray-200 origin-top"
            style={{ transform: 'scale(0.72)', transformOrigin: 'top center', marginBottom: '-28%' }}
          >
            <ResumeDocument resume={resume} />
          </div>
        </div>

      </div>
    </div>
  )
}
