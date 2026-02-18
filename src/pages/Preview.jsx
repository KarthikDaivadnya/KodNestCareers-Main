import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Edit3, Download, Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import ResumeDocument from '../components/ResumeDocument'
import { TEMPLATES, COLORS, loadTemplate, saveTemplate, loadColor, saveColor } from '../lib/templates'
import { toPlainText } from '../lib/resumeText'

/* ── Template thumbnail sketches ── */
const THUMB_CLASSIC = (
  <svg viewBox="0 0 72 90" className="w-full h-full">
    <rect width="72" height="90" fill="white"/>
    {/* centered header */}
    <rect x="18" y="6" width="36" height="4" rx="1" fill="#aaa"/>
    <rect x="22" y="12" width="28" height="2" rx="1" fill="#ccc"/>
    <line x1="6" y1="18" x2="66" y2="18" stroke="#ccc" strokeWidth="0.7"/>
    {/* sections */}
    {[0,1,2].map(i => (
      <g key={i} transform={`translate(0,${22+i*22})`}>
        <rect x="6" y="0" width="20" height="2" rx="1" fill="currentColor" opacity="0.5"/>
        <line x1="6" y1="4" x2="66" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <rect x="6" y="7"  width="54" height="1.5" rx="0.7" fill="#ddd"/>
        <rect x="6" y="10" width="40" height="1.5" rx="0.7" fill="#ddd"/>
        <rect x="6" y="13" width="48" height="1.5" rx="0.7" fill="#ddd"/>
      </g>
    ))}
  </svg>
)

const THUMB_MODERN = (
  <svg viewBox="0 0 72 90" className="w-full h-full">
    <rect width="72" height="90" fill="white"/>
    {/* sidebar */}
    <rect x="0" y="0" width="22" height="90" fill="currentColor" opacity="0.85"/>
    <rect x="3" y="6"  width="16" height="3" rx="1" fill="white" opacity="0.9"/>
    <rect x="3" y="11" width="12" height="1.5" rx="0.7" fill="white" opacity="0.5"/>
    <rect x="3" y="14" width="14" height="1.5" rx="0.7" fill="white" opacity="0.5"/>
    <rect x="3" y="17" width="10" height="1.5" rx="0.7" fill="white" opacity="0.5"/>
    <rect x="3" y="23" width="8" height="1.5" rx="1" fill="white" opacity="0.4"/>
    {[0,1,2,3,4].map(i=><rect key={i} x="3" y={26+i*4} width={10+i%3*2} height="1.5" rx="0.7" fill="white" opacity="0.6"/>)}
    {/* main */}
    {[0,1,2].map(i=>(
      <g key={i} transform={`translate(26,${6+i*26})`}>
        <rect x="0" y="0" width="20" height="2" rx="1" fill="currentColor" opacity="0.4"/>
        <line x1="0" y1="4" x2="42" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <rect x="0" y="6"  width="38" height="1.5" rx="0.7" fill="#ddd"/>
        <rect x="0" y="9"  width="28" height="1.5" rx="0.7" fill="#ddd"/>
        <rect x="0" y="12" width="34" height="1.5" rx="0.7" fill="#ddd"/>
      </g>
    ))}
  </svg>
)

const THUMB_MINIMAL = (
  <svg viewBox="0 0 72 90" className="w-full h-full">
    <rect width="72" height="90" fill="white"/>
    <rect x="8" y="7"  width="28" height="4" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="8" y="13" width="44" height="1.5" rx="0.7" fill="#e0e0e0"/>
    {[0,1,2,3].map(i=>(
      <g key={i} transform={`translate(0,${20+i*17})`}>
        <rect x="8" y="0" width="14" height="1.5" rx="0.7" fill="currentColor" opacity="0.3"/>
        <rect x="8" y="4"  width="50" height="1.5" rx="0.7" fill="#e8e8e8"/>
        <rect x="8" y="7"  width="42" height="1.5" rx="0.7" fill="#e8e8e8"/>
        <rect x="8" y="10" width="46" height="1.5" rx="0.7" fill="#e8e8e8"/>
      </g>
    ))}
  </svg>
)

const THUMBS = { classic: THUMB_CLASSIC, modern: THUMB_MODERN, minimal: THUMB_MINIMAL }

/* ── Template picker ── */
function TemplatePicker({ active, color, onChange }) {
  return (
    <div className="flex gap-3">
      {TEMPLATES.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex flex-col items-center gap-1.5 group">
          <div
            className={`rounded-lg overflow-hidden border-2 transition-all shadow-sm relative
              ${active === t.id ? 'shadow-md' : 'border-gray-200 group-hover:border-gray-400'}`}
            style={{ width: 80, height: 100, color, borderColor: active === t.id ? color : undefined, borderWidth: 2 }}>
            {THUMBS[t.id]}
            {active === t.id && (
              <div style={{ backgroundColor: color }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <span className={`text-[10px] font-medium ${active === t.id ? 'text-gray-900' : 'text-gray-400'}`}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ── Color picker ── */
function ColorPicker({ active, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 font-medium mr-1">Color</span>
      {COLORS.map(c => (
        <button key={c.id} onClick={() => onChange(c.id)} title={c.label}
          className="w-5 h-5 rounded-full transition-all hover:scale-110 relative"
          style={{ backgroundColor: c.value }}>
          {active === c.id && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ── Validation ── */
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

/* ── Toast ── */
function Toast({ message, onDone }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl
      flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
      {message}
    </div>
  )
}

export default function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState(loadTemplate)
  const [colorId,  setColorId]  = useState(loadColor)
  const [copied,   setCopied]   = useState(false)
  const [toast,    setToast]    = useState(null)

  const handleTemplate = id => { setTemplate(id); saveTemplate(id) }
  const handleColor    = id => { setColorId(id);  saveColor(id)    }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleDownload = () => showToast('PDF export ready! Check your downloads.')

  const handleCopy = async () => {
    const text = toPlainText(resume)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const warning = getWarning(resume)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Toolbar (hidden in print) ── */}
      <div className="no-print sticky top-14 z-40 bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between gap-4">
        <Link to="/builder" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium shrink-0">
          <ArrowLeft className="w-4 h-4" />Builder
        </Link>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy as Text'}
          </button>
          <button onClick={handleDownload}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />Download PDF
          </button>
          <Link to="/builder"
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors">
            <Edit3 className="w-3 h-3" />Edit
          </Link>
        </div>
      </div>

      {/* ── Validation warning ── */}
      {warning && (
        <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{warning}</p>
          <span className="text-xs text-amber-500 ml-1">— you can still export.</span>
        </div>
      )}

      {/* ── Template + Color picker panel ── */}
      <div className="no-print max-w-[794px] mx-auto mt-6 mb-4 bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-start gap-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Template</p>
          <TemplatePicker active={template} color={COLORS.find(c=>c.id===colorId)?.value} onChange={handleTemplate} />
        </div>
        <div className="border-l border-gray-100 pl-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Accent Color</p>
          <ColorPicker active={colorId} onChange={handleColor} />
        </div>
      </div>

      {/* ── Resume document ── */}
      <div className="print-resume-wrap max-w-[794px] mx-auto mb-10 shadow-2xl ring-1 ring-gray-200">
        <ResumeDocument resume={resume} template={template} colorId={colorId} />
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast} />}

    </div>
  )
}
