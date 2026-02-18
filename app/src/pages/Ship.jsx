import { useNavigate } from 'react-router-dom'
import { Lock, Rocket, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

const STORAGE_KEY = 'kn_test_checklist'
const TOTAL = 10

const CHECKLIST_ITEMS = [
  'JD required validation works',
  'Short JD warning shows for <200 chars',
  'Skills extraction groups correctly',
  'Round mapping changes based on company + skills',
  'Score calculation is deterministic',
  'Skill toggles update score live',
  'Changes persist after refresh',
  'History saves and loads correctly',
  'Export buttons copy the correct content',
  'No console errors on core pages',
]

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export default function Ship() {
  const navigate = useNavigate()
  const checked  = loadChecked()
  const passed   = checked.size
  const allPassed = passed === TOTAL
  const missing  = TOTAL - passed

  return (
    <div className="max-w-2xl">

      {/* Page header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/test')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Test Checklist
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">Ship</h1>
        <p className="text-sm text-gray-500">
          Ready to deploy. This page unlocks only after all 10 tests pass.
        </p>
      </div>

      {/* ── LOCKED STATE ── */}
      {!allPassed && (
        <Card className="border-red-100">
          <CardContent className="flex flex-col items-center text-center gap-5 py-12">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <Lock className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-1">
                Ship is locked
              </p>
              <p className="text-sm text-gray-500 max-w-sm">
                {missing} test{missing > 1 ? 's have' : ' has'} not been verified.
                Complete the Pre-Ship Test Checklist before deploying.
              </p>
            </div>

            {/* Mini checklist of remaining tests */}
            <div className="w-full max-w-sm text-left border border-gray-100 rounded-xl overflow-hidden">
              {CHECKLIST_ITEMS.map((label, i) => {
                const id = `t${String(i + 1).padStart(2, '0')}`
                const isPassed = checked.has(id)
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-50 last:border-0 ${isPassed ? 'bg-green-50/40' : 'bg-white'}`}
                  >
                    <span className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center ${isPassed ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {isPassed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 5l3 3 5-5" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-xs ${isPassed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-400">
                {passed} / {TOTAL} passed
              </span>
              <button
                onClick={() => navigate('/dashboard/test')}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Go to Test Checklist
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── UNLOCKED STATE ── */}
      {allPassed && (
        <div className="flex flex-col gap-4">

          {/* Success banner */}
          <div className="flex items-center gap-4 px-5 py-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                All {TOTAL} tests passed. You are clear to ship.
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                KodNest Placement Readiness Platform is verified and ready for deployment.
              </p>
            </div>
          </div>

          {/* Deployment card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary-500" />
                Deploy to Production
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                The app is deployed on <strong>Vercel</strong> via GitHub auto-deploy.
                Push to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">main</code> — Vercel picks it up automatically.
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Deployment checklist
                </p>
                {[
                  'All tests verified locally',
                  'No console errors on core pages',
                  'Git status clean — all changes committed',
                  'Pushed to main branch',
                  'Vercel deployment URL is live and working',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2 flex-wrap">
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Vercel Dashboard
                </a>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
