import { Link } from 'react-router-dom'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import ResumeDocument from '../components/ResumeDocument'

export default function Preview() {
  const { resume } = useResume()

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Toolbar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <Link
          to="/builder"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Builder
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Preview Mode</span>
          <Link
            to="/builder"
            className="inline-flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>
      </div>

      {/* A4-style page */}
      <div className="max-w-[794px] mx-auto my-10 shadow-2xl ring-1 ring-gray-200">
        <ResumeDocument resume={resume} />
      </div>

    </div>
  )
}
