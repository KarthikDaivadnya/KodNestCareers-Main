import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Edit3, Printer, Copy, Check, AlertTriangle } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import ResumeDocument from '../components/ResumeDocument'
import { TEMPLATES, loadTemplate, saveTemplate } from '../lib/templates'
import { toPlainText } from '../lib/resumeText'

/* ── Template tabs ── */
function TemplateTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {TEMPLATES.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            active === t.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ── Validation check ── */
function getWarning(resume) {
  const r = resume || {}
  const hasName = !!(r.name?.trim())
  const hasWork = (r.experience ?? []).some(e => e.company?.trim() || e.role?.trim())
  const hasProj = (r.projects   ?? []).some(p => p.name?.trim())
  if (!hasName || (!hasWork && !hasProj)) {
    return 'Your resume may look incomplete — missing name or experience/projects.'
  }
  return null
}

export default function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState(loadTemplate)
  const [copied, setCopied]     = useState(false)

  const handleTemplate = id => { setTemplate(id); saveTemplate(id) }

  const handlePrint = () => window.print()

  const handleCopy = async () => {
    const text = toPlainText(resume)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* fallback for non-https */
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const warning = getWarning(resume)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Toolbar (hidden in print) ── */}
      <div className="no-print sticky top-14 z-40 bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between gap-4">

        {/* Left: back link */}
        <Link to="/builder" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Builder
        </Link>

        {/* Center: template tabs */}
        <TemplateTabs active={template} onChange={handleTemplate} />

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy as text */}
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy as Text'}
          </button>

          {/* Print / PDF */}
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>

          {/* Edit shortcut */}
          <Link to="/builder"
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors">
            <Edit3 className="w-3 h-3" />
            Edit
          </Link>
        </div>
      </div>

      {/* ── Validation warning (hidden in print) ── */}
      {warning && (
        <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{warning}</p>
          <span className="text-xs text-amber-500 ml-1">— you can still export.</span>
        </div>
      )}

      {/* ── Resume document ── */}
      <div className="print-resume-wrap max-w-[794px] mx-auto my-10 shadow-2xl ring-1 ring-gray-200">
        <ResumeDocument resume={resume} template={template} />
      </div>

    </div>
  )
}
