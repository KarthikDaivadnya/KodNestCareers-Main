import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import ResumeDocument from '../components/ResumeDocument'
import { TEMPLATES, loadTemplate, saveTemplate } from '../lib/templates'

function TemplateTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            active === t.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState(loadTemplate)

  const handleTemplate = (id) => { setTemplate(id); saveTemplate(id) }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 px-8 py-2.5 flex items-center justify-between">
        <Link to="/builder" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Builder
        </Link>
        <TemplateTabs active={template} onChange={handleTemplate} />
        <Link to="/builder" className="inline-flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </Link>
      </div>
      <div className="max-w-[794px] mx-auto my-10 shadow-2xl ring-1 ring-gray-200">
        <ResumeDocument resume={resume} template={template} />
      </div>
    </div>
  )
}
