import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Tailoring',
    desc: 'Paste any job description. The AI maps your experience to the exact keywords that matter.',
  },
  {
    icon: FileText,
    title: 'ATS-Ready Format',
    desc: 'Clean, parse-friendly structure that gets past Applicant Tracking Systems every time.',
  },
  {
    icon: Zap,
    title: 'Done in 60 Seconds',
    desc: 'From blank to tailored resume faster than manually editing a template.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide">
          <Sparkles className="w-3 h-3" />
          KodNest Premium Build · Project 3
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-gray-950 tracking-tight leading-[1.1] max-w-2xl mb-5">
          Build a Resume<br />
          <span className="text-gray-400">That Gets Read.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-500 max-w-lg leading-relaxed mb-10">
          AI-powered. JD-aware. Built for the modern job market.
          Stop guessing what recruiters want — let the AI show you.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
          >
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/preview"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-medium px-5 py-3 rounded-xl transition-colors bg-white"
          >
            See Preview
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-gray-100 mx-8" />

      {/* ── Features ── */}
      <section className="px-8 py-16 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl px-6 py-6 hover:border-gray-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-gray-700" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section className="border-t border-gray-100 bg-white px-8 py-10 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Ready to build? Your resume auto-saves as you type.
        </p>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Open Builder
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  )
}
