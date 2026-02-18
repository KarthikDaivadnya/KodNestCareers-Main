import { createContext, useContext, useState } from 'react'

export const EMPTY_RESUME = {
  name: '', email: '', phone: '', location: '',
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skillGroups: { technical: [], soft: [], tools: [] },
  github: '', linkedin: '',
}

const ResumeContext = createContext(null)
const STORAGE_KEY = 'resumeBuilderData'

function migrateAndLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_RESUME
    const parsed = JSON.parse(raw)
    /* migrate old comma-separated skills → skillGroups.technical */
    if (parsed.skills && !parsed.skillGroups) {
      const arr = parsed.skills.split(',').map(s => s.trim()).filter(Boolean)
      parsed.skillGroups = { technical: arr, soft: [], tools: [] }
      delete parsed.skills
    }
    /* ensure all projects have techStack + liveUrl */
    if (Array.isArray(parsed.projects)) {
      parsed.projects = parsed.projects.map(p => ({
        techStack: [], liveUrl: '', ...p,
      }))
    }
    return { ...EMPTY_RESUME, ...parsed }
  } catch {
    return EMPTY_RESUME
  }
}

export function ResumeProvider({ children }) {
  const [resume, setResumeState] = useState(migrateAndLoad)

  const setResume = (updater) => {
    setResumeState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const setField = (field, value) => setResume(prev => ({ ...prev, [field]: value }))
  const resetResume = () => setResume(EMPTY_RESUME)

  return (
    <ResumeContext.Provider value={{ resume, setResume, setField, resetResume }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be inside <ResumeProvider>')
  return ctx
}
