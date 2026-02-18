import { useOutletContext, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  Lock, CheckCircle2, ChevronRight, Layers,
  FileText, BarChart2, Network, Code2,
  Hammer, FlaskConical, Rocket, AlertCircle,
} from 'lucide-react'
import { RB_STEPS, hasArtifact } from '../../lib/rbSteps'

/* ── Step-specific icon map ──────────────────────────────────── */
const STEP_ICONS = {
  1: AlertCircle,
  2: BarChart2,
  3: Network,
  4: Layers,
  5: Code2,
  6: Hammer,
  7: FlaskConical,
  8: Rocket,
}

/* ── Locked screen ───────────────────────────────────────────── */
function LockedScreen({ step, prevStep }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-gray-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Step Locked</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        You must complete{' '}
        <span className="font-semibold text-gray-700">
          Step {prevStep.id}: {prevStep.label}
        </span>{' '}
        before accessing this step.
      </p>
      <button
        onClick={() => navigate(prevStep.path)}
        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        Go to Step {prevStep.id}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ── Step workspace ──────────────────────────────────────────── */
function StepWorkspace({ step, isComplete }) {
  const Icon = STEP_ICONS[step.id] ?? FileText

  return (
    <div className="max-w-2xl">

      {/* Step header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isComplete ? 'bg-green-100' : 'bg-primary-100'
        }`}>
          <Icon className={`w-6 h-6 ${isComplete ? 'text-green-600' : 'text-primary-600'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">
              {step.tag}
            </span>
            {isComplete && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{step.label}</h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.contextDesc}</p>
        </div>
      </div>

      {/* Instructions card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">How to complete this step</h3>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Steps */}
          <ol className="flex flex-col gap-3">
            {[
              { num: 1, label: 'Read the prompt in the Build Panel →', sub: 'The right panel has a ready-to-use Lovable prompt for this step.' },
              { num: 2, label: 'Copy it and open Lovable', sub: 'Click "Copy" then "Build in Lovable" to open lovable.dev and paste the prompt.' },
              { num: 3, label: 'Build the screen in Lovable', sub: 'Follow the prompt instructions and iterate until the output looks right.' },
              { num: 4, label: 'Log your result', sub: 'Click "It Worked" in the Build Panel (optionally add a screenshot URL). This unlocks the next step.' },
            ].map(({ num, label, sub }) => (
              <li key={num} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {num}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </li>
            ))}
          </ol>

        </div>
      </div>

      {/* Deliverable */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4">
        <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Deliverable</p>
        <p className="text-sm text-primary-800 font-medium">{step.contextTitle} screen built and logged in Build Panel.</p>
        <p className="text-xs text-primary-600 mt-1">
          Stored as: <code className="font-mono bg-primary-100 px-1.5 py-0.5 rounded text-primary-700">rb_step_{step.id}_artifact</code>
        </p>
      </div>

      {/* Completed state */}
      {isComplete && (
        <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Step complete — artifact saved.</p>
            <p className="text-xs text-green-600 mt-0.5">Use the navigation above to move to the next step.</p>
          </div>
        </div>
      )}

    </div>
  )
}

/* ── BuildStep Page ──────────────────────────────────────────── */
export default function BuildStep({ stepNum }) {
  const { step, refresh } = useOutletContext() ?? {}
  const navigate = useNavigate()

  // Resolve step from stepNum prop (passed by route) or from outlet context
  const resolvedStep = step ?? RB_STEPS.find(s => s.id === stepNum)

  useEffect(() => {
    // If no step resolved, redirect to step 1
    if (!resolvedStep) {
      navigate('/rb/01-problem', { replace: true })
    }
  }, [resolvedStep, navigate])

  if (!resolvedStep) return null

  const prevStep = RB_STEPS.find(s => s.id === resolvedStep.id - 1)
  const isLocked = prevStep && !hasArtifact(prevStep.id)
  const isComplete = hasArtifact(resolvedStep.id)

  if (isLocked) {
    return <LockedScreen step={resolvedStep} prevStep={prevStep} />
  }

  return <StepWorkspace step={resolvedStep} isComplete={isComplete} />
}
