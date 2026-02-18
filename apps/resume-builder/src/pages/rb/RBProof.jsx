import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2, Circle, Copy, Check,
  Link2, Github, Globe, Rocket, ChevronLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card'
import { RB_STEPS, hasArtifact, loadArtifact } from '../../lib/rbSteps'

/* ── Constants ───────────────────────────────────────────────── */
const PROOF_LINKS_KEY = 'rb_proof_links'

/* ── Helpers ─────────────────────────────────────────────────── */
function loadLinks() {
  try {
    const raw = localStorage.getItem(PROOF_LINKS_KEY)
    return raw ? JSON.parse(raw) : { lovable: '', github: '', deployed: '' }
  } catch {
    return { lovable: '', github: '', deployed: '' }
  }
}

function isValidUrl(str) {
  if (!str || str.trim() === '') return null
  try {
    const u = new URL(str.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

function loadTestResults() {
  try {
    const raw = localStorage.getItem('rb_test_checklist')
    if (!raw) return false
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.length >= 10 && parsed.every(Boolean)
    if (typeof parsed === 'object') {
      const vals = Object.values(parsed)
      return vals.length >= 10 && vals.every(Boolean)
    }
    return false
  } catch { return false }
}

function buildSubmissionText(links) {
  return [
    '------------------------------------------',
    'AI Resume Builder — Final Submission',
    '',
    `Lovable Project: ${links.lovable  || '(not provided)'}`,
    `GitHub Repository: ${links.github   || '(not provided)'}`,
    `Live Deployment: ${links.deployed || '(not provided)'}`,
    '',
    'Core Capabilities:',
    '- Structured resume builder',
    '- Deterministic ATS scoring',
    '- Template switching',
    '- PDF export with clean formatting',
    '- Persistence + validation checklist',
    '------------------------------------------',
  ].join('\n')
}

/* ── URL Input ───────────────────────────────────────────────── */
function UrlInput({ label, icon: Icon, placeholder, value, onChange }) {
  const validity = isValidUrl(value)
  const showError = validity === false

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 transition-all
          ${showError
            ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
            : validity === true
              ? 'border-green-300 focus:ring-green-100 bg-green-50/20'
              : 'border-gray-200 focus:ring-primary-200'
          }`}
      />
      {showError && (
        <p className="text-xs text-red-500">Enter a valid URL starting with https://</p>
      )}
    </div>
  )
}

/* ── Copy Button ─────────────────────────────────────────────── */
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

/* ── Main RBProof ────────────────────────────────────────────── */
export default function RBProof() {
  const navigate = useNavigate()
  const [links,  setLinks]  = useState(loadLinks)
  const [tick,   setTick]   = useState(0)

  // Poll every 3s to pick up external localStorage changes
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(id)
  }, [])

  const setLink = (field) => (value) => {
    const next = { ...links, [field]: value }
    localStorage.setItem(PROOF_LINKS_KEY, JSON.stringify(next))
    setLinks(next)
  }

  // Evaluate statuses on every render (tick + links force re-eval)
  void tick
  const statuses = RB_STEPS.map(s => hasArtifact(s.id))
  const completedCount = statuses.filter(Boolean).length
  const allComplete = completedCount === 8

  const allLinksValid =
    isValidUrl(links.lovable) === true &&
    isValidUrl(links.github) === true &&
    isValidUrl(links.deployed) === true

  const allTestsPassed = loadTestResults()

  /* NON-NEGOTIABLE: ALL THREE conditions required */
  const isShipped = allComplete && allTestsPassed && allLinksValid

  const submissionText = buildSubmissionText(links)

  return (
    <div className="max-w-3xl">

      {/* Back nav */}
      <div className="mb-5">
        <button
          onClick={() => navigate('/rb/08-ship')}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Step 8
        </button>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">PROJECT 3</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Proof of Work</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete all 8 steps, then submit your Lovable, GitHub, and Deploy links.
        </p>
      </div>

      {/* Overall status banner */}
      <div className={`mb-6 px-5 py-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
        isShipped ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            isShipped ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'
          }`}>
            {isShipped ? '🚀 Shipped' : 'In Progress'}
          </span>
          <p className="text-xs text-gray-500 mt-1.5">
            {isShipped
              ? 'All 8 steps complete · All 10 tests passed · All links provided.'
              : `${completedCount}/8 steps · ${allTestsPassed ? '10/10 tests' : 'Tests pending'} · ${allLinksValid ? 'Links ✓' : 'Links pending'}`}
          </p>
        </div>
        {!isShipped && (
          <div className="text-xs text-amber-700 flex flex-col gap-0.5">
            {!allComplete   && <span>✗ {8 - completedCount} step{8 - completedCount !== 1 ? 's' : ''} not yet complete</span>}
            {!allTestsPassed && <span>✗ Step 7 test checklist not fully complete (needs 10/10)</span>}
            {!allLinksValid  && <span>✗ Proof links incomplete or invalid</span>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">

        {/* ── A: Step Status ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                8-Step Completion Status
              </CardTitle>
              <span className="text-xs font-semibold text-gray-400">
                {completedCount} / 8 complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {RB_STEPS.map((s, i) => {
              const done     = statuses[i]
              const artifact = loadArtifact(s.id)
              return (
                <div key={s.id} className="flex items-start gap-3 px-6 py-3 border-b border-gray-50 last:border-0">
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    : <Circle      className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-300 w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {artifact?.note && (
                      <p className="text-xs text-gray-400 ml-7 mt-0.5 truncate">Note: {artifact.note}</p>
                    )}
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* ── B: Proof Links ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary-500" />
              Proof Links
              <span className="text-xs font-normal text-gray-400 ml-1">Required for Ship status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <UrlInput
              label="Lovable Project Link"
              icon={Globe}
              placeholder="https://lovable.dev/projects/..."
              value={links.lovable}
              onChange={setLink('lovable')}
            />
            <UrlInput
              label="GitHub Repository"
              icon={Github}
              placeholder="https://github.com/username/repo"
              value={links.github}
              onChange={setLink('github')}
            />
            <UrlInput
              label="Deployed URL"
              icon={Rocket}
              placeholder="https://your-app.vercel.app"
              value={links.deployed}
              onChange={setLink('deployed')}
            />
            {allLinksValid && (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                All 3 proof links are valid.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── C: Final Submission Export ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-primary-500" />
              Final Submission Export
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <pre className="text-xs font-mono text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-4 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {submissionText}
            </pre>
            <CopyButton text={submissionText} label="Copy Final Submission" />
          </CardContent>
        </Card>

        {/* ── Shipped state — calm, premium ── */}
        {isShipped && (
          <div className="border border-green-200 bg-green-50 rounded-xl px-6 py-6">
            <p className="text-sm font-semibold text-green-800">Project 3 Shipped Successfully.</p>
            <p className="text-xs text-green-600 mt-1.5 leading-relaxed">
              All 8 build steps complete · All 10 quality tests passed · All proof links verified.
            </p>
            <div className="mt-4 flex flex-col gap-1 text-xs text-green-700">
              <span>Lovable: {links.lovable}</span>
              <span>GitHub: {links.github}</span>
              <span>Live: {links.deployed}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
