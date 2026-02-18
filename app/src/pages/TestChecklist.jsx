import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, RotateCcw, ChevronDown, ChevronRight, Lock, Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

/* ── Test definitions ──────────────────────────────────────── */
const TESTS = [
  {
    id: 't01',
    label: 'JD required validation works',
    hint: 'Go to /dashboard/analyzer. Click "Analyze JD" without entering any text. Expect a red error: "Paste a job description to analyze." The page must NOT navigate away.',
  },
  {
    id: 't02',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Type or paste fewer than 200 characters in the JD field. An amber warning banner should appear immediately: "This JD is too short to analyze deeply…". Clear the field — banner disappears. Pasting 200+ chars — banner disappears.',
  },
  {
    id: 't03',
    label: 'Skills extraction groups correctly',
    hint: 'Paste a JD containing: "React, Node.js, DSA, SQL, Docker, Python". After analysis, the Results page must show skills grouped into correct categories: DSA → Core CS, React/Node.js → Web, SQL → Data, Docker → Cloud/DevOps, Python → Languages.',
  },
  {
    id: 't04',
    label: 'Round mapping changes based on company + skills',
    hint: 'Test 1: Enter "Infosys" as company with a DSA-heavy JD → should show 4-round Enterprise track (Online Test, Technical DSA, Projects, HR). Test 2: Leave company blank with a React JD → should show 3-round Startup track (Practical coding, System, Culture Fit).',
  },
  {
    id: 't05',
    label: 'Score calculation is deterministic',
    hint: 'Analyze the exact same JD text twice (same company, same role). Both runs must produce the same baseScore. Open DevTools → localStorage → kn_analysis_history — confirm both entries share the same baseScore value.',
  },
  {
    id: 't06',
    label: 'Skill toggles update score live',
    hint: 'On /dashboard/results, note the current score in the SVG gauge. Click any skill tag once — score must change by exactly +2 (marked know) or −2 (marked practice). The gauge must animate smoothly without page reload.',
  },
  {
    id: 't07',
    label: 'Changes persist after refresh',
    hint: 'On /results, toggle 3 skills to "know". Note the exact score. Hard refresh (Ctrl + Shift + R). Skill tags must show the same know/practice state. Score must match exactly. Confirm via DevTools → localStorage → kn_latest_analysis → skillConfidenceMap.',
  },
  {
    id: 't08',
    label: 'History saves and loads correctly',
    hint: 'After analyzing a JD, navigate to /dashboard/history. The entry must appear with company name, role, date and score badge. Click the entry — Results page must open with all data intact including any saved skill confidence toggles.',
  },
  {
    id: 't09',
    label: 'Export buttons copy the correct content',
    hint: 'On Results: (1) Click "Copy 7-day plan" → paste in Notepad — must contain Day 1–2 through Day 7 blocks. (2) Click "Copy checklist" → must show 4 rounds. (3) Click "Download .txt" → file must contain all sections: Skills, Confidence, Checklist, Plan, Questions.',
  },
  {
    id: 't10',
    label: 'No console errors on core pages',
    hint: 'Open DevTools → Console tab. Clear existing logs. Navigate through: / → /dashboard → /dashboard/analyzer → /dashboard/results → /dashboard/history. Zero red errors or uncaught exceptions expected. Warnings are acceptable.',
  },
]

const STORAGE_KEY = 'kn_test_checklist'
const TOTAL = TESTS.length

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveChecked(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

/* ── Component ─────────────────────────────────────────────── */
export default function TestChecklist() {
  const navigate   = useNavigate()
  const [checked,  setChecked]  = useState(loadChecked)
  const [expanded, setExpanded] = useState({})

  const passed = checked.size
  const allPassed = passed === TOTAL

  const toggle = useCallback((id) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveChecked(next)
      return next
    })
  }, [])

  const reset = () => {
    const empty = new Set()
    saveChecked(empty)
    setChecked(empty)
  }

  const toggleHint = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-3xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">
          Pre-Ship Test Checklist
        </h1>
        <p className="text-sm text-gray-500">
          Manually verify all 10 behaviours before shipping. Each test must pass.
        </p>
      </div>

      {/* ── Summary banner ── */}
      <div className={`mb-5 px-5 py-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
        allPassed
          ? 'bg-green-50 border-green-200'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <p className={`text-sm font-semibold ${allPassed ? 'text-green-800' : 'text-amber-800'}`}>
            Tests Passed: <span className="text-lg">{passed}</span> / {TOTAL}
          </p>
          {!allPassed && (
            <p className="text-xs text-amber-700 mt-0.5">
              Fix issues before shipping. {TOTAL - passed} test{TOTAL - passed > 1 ? 's' : ''} remaining.
            </p>
          )}
          {allPassed && (
            <p className="text-xs text-green-700 mt-0.5">
              All tests passed. You may proceed to the Ship page.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {allPassed && (
            <button
              onClick={() => navigate('/dashboard/ship')}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Rocket className="w-3.5 h-3.5" />
              Go to Ship
            </button>
          )}
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset checklist
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${allPassed ? 'bg-green-500' : 'bg-amber-400'}`}
          style={{ width: `${(passed / TOTAL) * 100}%` }}
        />
      </div>

      {/* ── Test items ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary-500" />
            Test Items
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0 divide-y divide-gray-50">
          {TESTS.map((test, i) => {
            const isChecked  = checked.has(test.id)
            const isExpanded = expanded[test.id]

            return (
              <div key={test.id} className="py-3">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggle(test.id)}
                    className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400 bg-white'
                    }`}
                    aria-label={isChecked ? 'Uncheck' : 'Check'}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-6 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-medium leading-snug ${
                        isChecked ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}>
                        {test.label}
                      </span>
                    </div>

                    {/* Hint toggle */}
                    <button
                      onClick={() => toggleHint(test.id)}
                      className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      {isExpanded
                        ? <ChevronDown className="w-3 h-3" />
                        : <ChevronRight className="w-3 h-3" />
                      }
                      How to test
                    </button>

                    {isExpanded && (
                      <p className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 leading-relaxed">
                        {test.hint}
                      </p>
                    )}
                  </div>

                  {/* Status pill */}
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isChecked
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isChecked ? 'Pass' : 'Pending'}
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-gray-400">
          Checklist persists in localStorage. Safe to refresh.
        </p>
        {allPassed ? (
          <button
            onClick={() => navigate('/dashboard/ship')}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Proceed to Ship
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard/ship')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg transition-colors cursor-not-allowed"
            title="Complete all tests to unlock the Ship page"
          >
            <Lock className="w-4 h-4" />
            Ship locked — {TOTAL - passed} tests pending
          </button>
        )}
      </div>

    </div>
  )
}
