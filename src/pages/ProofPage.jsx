import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, ArrowRight, Rocket } from 'lucide-react'
import { RB_STEPS, hasArtifact } from '../lib/rbSteps'

const PRODUCT_MILESTONES = [
  { id: 1, label: 'Route rail + gating system live',     done: true  },
  { id: 2, label: 'Resume form built (all sections)',    done: false },
  { id: 3, label: 'Live preview panel wired',            done: false },
  { id: 4, label: 'ATS scoring engine integrated',       done: false },
  { id: 5, label: 'PDF export implemented',              done: false },
  { id: 6, label: 'Deployed to Vercel',                  done: false },
]

export default function ProofPage() {
  const buildStatuses = RB_STEPS.map(s => hasArtifact(s.id))
  const buildCompleted = buildStatuses.filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project 3</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-2">Proof of Work</h1>
        <p className="text-sm text-gray-500">
          Track every milestone. Ship when everything is green.
        </p>
      </div>

      {/* Build Track Progress */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Build Track Progress</h2>
            <p className="text-xs text-gray-400 mt-0.5">8-step Lovable build system</p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {buildCompleted} / 8
          </span>
        </div>

        {/* Step list */}
        <div className="divide-y divide-gray-50">
          {RB_STEPS.map((s, i) => {
            const done = buildStatuses[i]
            return (
              <div key={s.id} className="flex items-center gap-3 px-6 py-3">
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  : <Circle className="w-4 h-4 text-gray-300 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-300 w-5">
                      {String(s.id).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!done && (
                    <Link
                      to={s.path}
                      className="text-xs text-primary-500 hover:text-primary-700 font-medium"
                    >
                      Go →
                    </Link>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {done ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-1.5">
            {buildStatuses.map((done, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${done ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <Link
            to="/rb/01-problem"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Open Build Track <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Product Milestones */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Product Milestones</h2>
          <p className="text-xs text-gray-400 mt-0.5">Feature completion checklist</p>
        </div>
        <div className="divide-y divide-gray-50">
          {PRODUCT_MILESTONES.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-6 py-3">
              {m.done
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                : <Clock className="w-4 h-4 text-gray-300 shrink-0" />}
              <span className={`text-sm font-medium flex-1 ${m.done ? 'text-gray-900' : 'text-gray-400'}`}>
                {m.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                m.done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {m.done ? 'Done' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final submission card */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Final Submission</h3>
        <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
          Complete the build track + all product milestones, then submit your proof links.
        </p>
        <Link
          to="/rb/proof"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Go to Full Proof Page
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
