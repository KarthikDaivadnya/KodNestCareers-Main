import { createContext, useContext, useState, useEffect } from 'react'

/* ── Default empty resume ────────────────────────────────────── */
export const EMPTY_RESUME = {
  name: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: '',
  github: '',
  linkedin: '',
}

/* ── Context ─────────────────────────────────────────────────── */
const ResumeContext = createContext(null)

const STORAGE_KEY = 'resumeBuilderData'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY_RESUME, ...JSON.parse(raw) } : EMPTY_RESUME
  } catch {
    return EMPTY_RESUME
  }
}

export function ResumeProvider({ children }) {
  const [resume, setResumeState] = useState(load)

  const setResume = (updater) => {
    setResumeState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const setField = (field, value) =>
    setResume(prev => ({ ...prev, [field]: value }))

  const resetResume = () => setResume(EMPTY_RESUME)

  return (
    <ResumeContext.Provider value={{ resume, setResume, setField, resetResume }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used inside <ResumeProvider>')
  return ctx
}
