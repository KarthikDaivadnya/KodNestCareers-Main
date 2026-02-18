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

function buildSubmissionText(links, statuses) {
  const stepLines = RB_STEPS.map((s, i) =>
    `Step ${String(s.id).padStart(2, '0')} — ${s.label}: ${statuses[i] ? '✓ Complete' : '✗ Pending'}`
  )
  return [
    '══════════════════════════════════════════════',
    'AI RESUME BUILDER — Final Submission',
    'KodNest Premium Build · Project 3',
    '══════════════════════════════════════════════',
    '',
    'Step Completion:',
    ...stepLines,
    '',
    'Proof Links:',
    `  Lovable Project:    ${links.lovable  || '(not provided)'}`,
    `  GitHub Repository:  ${links.github   || '(not provided)'}`,
    `  Deployed URL:       ${links.deployed || '(not provided)'}`,
    '',
    '══════════════════════════════════════════════',
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

  const isShipped = allComplete && allLinksValid

  const submissionText = buildSubmissionText(links, statuses)

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
              ? 'All 8 steps complete + all links provided. Project verified!'
              : `${completedCount}/8 steps · ${allLinksValid ? 'All links provided' : 'Links pending'}`}
          </p>
        </div>
        {!isShipped && (
          <div className="text-xs text-amber-700 flex flex-col gap-0.5">
            {!allComplete    && <span>✗ {8 - completedCount} step{8 - completedCount !== 1 ? 's' : ''} not yet complete</span>}
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

        {/* ── Shipped state ── */}
        {isShipped && (
          <div className="px-6 py-8 bg-gray-900 rounded-2xl text-center flex flex-col gap-4">
            <div className="inline-flex items-center justify-center mx-auto w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30">
              <Rocket className="w-7 h-7 text-green-400" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white text-xl font-bold">You built a real product.</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                Not a tutorial. Not a clone.<br />
                A structured AI tool that solves a real hiring problem.
              </p>
              <p className="text-gray-300 text-sm font-semibold mt-1">
                This is your proof of work. — KodNest Premium Build ✦
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
