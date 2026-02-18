import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import {
  Copy, Check, ExternalLink, CheckCircle2, XCircle,
  Camera, ChevronRight, ChevronLeft, Lock,
} from 'lucide-react'
import { RB_STEPS, hasArtifact, saveArtifact, loadArtifact } from '../lib/rbSteps'

/* ── Helpers ─────────────────────────────────────────────────── */
function getStepFromPath(pathname) {
  for (const s of RB_STEPS) {
    if (pathname === s.path || pathname.startsWith(s.path)) return s
  }
  return null
}

function getStepStatus() {
  return RB_STEPS.map(s => hasArtifact(s.id))
}

/* ── Top Bar ─────────────────────────────────────────────────── */
function TopBar({ step, completedCount }) {
  const isProof = !step

  return (
    <header className="h-14 px-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">RB</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">AI Resume Builder</span>
        </div>
        <span className="text-gray-300 text-sm">·</span>
        <span className="text-xs text-gray-400 font-medium">Project 3</span>
      </div>

      {/* Center */}
      <div className="text-sm font-semibold text-gray-700">
        {isProof
          ? 'Proof of Work'
          : `Step ${step.id} of 8 — ${step.label}`}
      </div>

      {/* Right — status badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{completedCount}/8 steps</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          completedCount === 8
            ? 'bg-green-100 text-green-700'
            : completedCount > 0
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-500'
        }`}>
          {completedCount === 8 ? '✓ Complete' : completedCount > 0 ? 'In Progress' : 'Not Started'}
        </span>
      </div>
    </header>
  )
}

/* ── Context Header ──────────────────────────────────────────── */
function ContextHeader({ step }) {
  if (!step) return null
  return (
    <div className="px-6 py-3 bg-primary-50 border-b border-primary-100 shrink-0">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-primary-400 uppercase tracking-widest mt-0.5 shrink-0 w-16">
          {step.tag}
        </span>
        <div>
          <p className="text-sm font-semibold text-primary-800 leading-snug">{step.contextTitle}</p>
          <p className="text-xs text-primary-600 mt-0.5 leading-relaxed max-w-3xl">{step.contextDesc}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Copy Button ─────────────────────────────────────────────── */
function CopyBtn({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

/* ── Build Panel (right 30%) ─────────────────────────────────── */
function BuildPanel({ step, onArtifactSaved }) {
  const [note, setNote]       = useState('')
  const [status, setStatus]   = useState(null)   // 'success' | 'error' | null
  const [saved, setSaved]     = useState(false)

  const artifact = step ? loadArtifact(step.id) : null

  const handleSave = useCallback((s) => {
    if (!step) return
    saveArtifact(step.id, s, note)
    setStatus(s)
    setSaved(true)
    onArtifactSaved?.()
  }, [step, note, onArtifactSaved])

  if (!step) return null

  return (
    <aside className="w-[30%] shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Build Panel</p>
        <p className="text-xs text-gray-400 mt-0.5">Copy prompt → Build in Lovable → Log result</p>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1">

        {/* Lovable prompt */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Copy This Into Lovable
            </label>
            <CopyBtn
              text={step.lovablePrompt}
              label="Copy"
              className="bg-primary-600 text-white hover:bg-primary-700"
            />
          </div>
          <textarea
            readOnly
            value={step.lovablePrompt}
            className="w-full h-52 text-xs font-mono text-gray-600 bg-white border border-gray-200 rounded-lg p-3 resize-none leading-relaxed focus:outline-none"
          />
        </div>

        {/* Build in Lovable CTA */}
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Build in Lovable
        </a>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Result logging */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Log Result</p>

          {artifact && !saved ? (
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${
              artifact.status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {artifact.status === 'success'
                ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                : <XCircle className="w-3.5 h-3.5 shrink-0" />}
              {artifact.status === 'success' ? 'Artifact saved — step complete' : 'Error logged'}
              {artifact.note && <span className="text-gray-400 ml-1 truncate">· {artifact.note}</span>}
            </div>
          ) : saved ? (
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status === 'success'
                ? <CheckCircle2 className="w-3.5 h-3.5" />
                : <XCircle className="w-3.5 h-3.5" />}
              {status === 'success' ? 'Step marked complete!' : 'Error recorded.'}
            </div>
          ) : (
            <>
              {/* Screenshot / note input */}
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Screenshot URL or note (optional)"
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-300 bg-white"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('success')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  It Worked
                </button>
                <button
                  onClick={() => handleSave('error')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-400 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Error
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                "It Worked" unlocks the next step
              </p>
            </>
          )}
        </div>

      </div>
    </aside>
  )
}

/* ── Proof Footer ────────────────────────────────────────────── */
function ProofFooter({ statuses, currentStepId }) {
  return (
    <footer className="h-12 px-6 border-t border-gray-200 bg-white flex items-center gap-3 shrink-0">
      <span className="text-xs text-gray-400 font-medium shrink-0">Progress:</span>
      <div className="flex items-center gap-1.5 flex-1">
        {RB_STEPS.map((s, i) => (
          <Link
            key={s.id}
            to={s.path}
            title={`Step ${s.id}: ${s.label}`}
            className={`h-2 flex-1 rounded-full transition-colors ${
              statuses[i]
                ? 'bg-green-400'
                : s.id === currentStepId
                  ? 'bg-primary-400'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <Link
        to="/rb/proof"
        className="text-xs font-semibold text-primary-600 hover:text-primary-700 shrink-0 flex items-center gap-1"
      >
        Proof <ChevronRight className="w-3 h-3" />
      </Link>
    </footer>
  )
}

/* ── Main RBShell ────────────────────────────────────────────── */
export default function RBShell() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  const step     = getStepFromPath(location.pathname)
  const statuses = getStepStatus()          // boolean[] length 8
  const completedCount = statuses.filter(Boolean).length

  // Navigation helpers
  const prevStep = step ? RB_STEPS.find(s => s.id === step.id - 1) : null
  const nextStep = step ? RB_STEPS.find(s => s.id === step.id + 1) : null
  const currentArtifactDone = step ? hasArtifact(step.id) : false
  const nextIsProof = step?.id === 8

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* Top Bar */}
      <TopBar step={step} completedCount={completedCount} />

      {/* Context Header */}
      <ContextHeader step={step} />

      {/* Middle: workspace (70%) + build panel (30%) */}
      <div className="flex flex-1 overflow-hidden">

        {/* Main workspace — 70% */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Step nav bar (only for step pages) */}
          {step && (
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100 bg-white shrink-0">
              <button
                onClick={() => prevStep && navigate(prevStep.path)}
                disabled={!prevStep}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {prevStep ? prevStep.label : 'Start'}
              </button>
              <div className="flex items-center gap-1.5">
                {RB_STEPS.map(s => (
                  <div
                    key={s.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      statuses[s.id - 1]
                        ? 'bg-green-400'
                        : s.id === step.id
                          ? 'bg-primary-500'
                          : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (currentArtifactDone) {
                    if (nextIsProof) navigate('/rb/proof')
                    else if (nextStep) navigate(nextStep.path)
                  }
                }}
                disabled={!currentArtifactDone}
                className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {nextIsProof ? 'Proof' : nextStep ? nextStep.label : 'Done'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet context={{ step, refresh }} />
          </div>

          {/* Next locked hint */}
          {step && !currentArtifactDone && (
            <div className="px-6 py-2 border-t border-amber-100 bg-amber-50 shrink-0 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">
                Complete this step in the Build Panel to unlock the next step.
              </p>
            </div>
          )}
        </main>

        {/* Build Panel — 30% (only for step pages, not proof) */}
        {step && (
          <BuildPanel step={step} onArtifactSaved={refresh} />
        )}
      </div>

      {/* Proof Footer */}
      <ProofFooter statuses={statuses} currentStepId={step?.id} />
    </div>
  )
}
