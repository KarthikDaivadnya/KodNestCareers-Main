import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckSquare, BookOpen, Calendar, HelpCircle, Tag, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { useHistory } from '../hooks/useHistory'

/* ── category badge colors ───────────────────────────────── */
const CATEGORY_COLORS = {
  'Core CS':      'bg-blue-50 text-blue-700 border border-blue-100',
  'Languages':    'bg-purple-50 text-purple-700 border border-purple-100',
  'Web':          'bg-primary-50 text-primary-700 border border-primary-100',
  'Data':         'bg-amber-50 text-amber-700 border border-amber-100',
  'Cloud/DevOps': 'bg-teal-50 text-teal-700 border border-teal-100',
  'Testing':      'bg-pink-50 text-pink-700 border border-pink-100',
  'General':      'bg-gray-100 text-gray-600 border border-gray-200',
}

/* ── Circular readiness indicator ───────────────────────── */
function ReadinessGauge({ score }) {
  const radius = 44
  const stroke = 7
  const circ   = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  const color  = score >= 70 ? '#16a34a' : score >= 50 ? 'hsl(245,58%,51%)' : '#dc2626'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
        <text x="55" y="51" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="700" fill="#111827" fontFamily="Inter,sans-serif">{score}</text>
        <text x="55" y="67" textAnchor="middle" fontSize="10"
          fill="#9ca3af" fontFamily="Inter,sans-serif">/ 100</text>
      </svg>
      <p className="text-xs font-medium text-gray-500">Readiness Score</p>
    </div>
  )
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { getEntry } = useHistory()
  const [analysis, setAnalysis] = useState(null)
  const [checked, setChecked]   = useState({}) // { "R0-2": true }

  useEffect(() => {
    let result = null
    const id = location.state?.analysisId
    if (id) result = getEntry(id)
    if (!result) {
      try { result = JSON.parse(localStorage.getItem('kn_latest_analysis')) } catch { /* */ }
    }
    setAnalysis(result)
  }, [location.state, getEntry])

  const toggleCheck = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))

  if (!analysis) {
    return (
      <div className="max-w-xl flex flex-col items-center text-center gap-4 py-16">
        <HelpCircle className="w-10 h-10 text-gray-300" />
        <p className="text-base font-semibold text-gray-700">No analysis yet</p>
        <p className="text-sm text-gray-400">Go to the Analyzer, paste a JD, and click Analyze.</p>
        <button
          onClick={() => navigate('/dashboard/analyzer')}
          className="mt-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Go to Analyzer
        </button>
      </div>
    )
  }

  const { company, role, createdAt, extractedSkills, readinessScore, checklist, plan, questions } = analysis

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {company || 'Analysis'}{role ? ` — ${role}` : ''}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Analyzed {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <ReadinessGauge score={readinessScore} />
      </div>

      <div className="flex flex-col gap-5">

        {/* 1. Extracted Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" />
              Key Skills Extracted
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(extractedSkills).map(([cat, skills]) => (
              <div key={cat} className="mb-3 last:mb-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.General}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Round-wise checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-primary-500" />
              Round-wise Preparation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {checklist.map((round, ri) => (
              <div key={ri}>
                <p className="text-sm font-semibold text-gray-800 mb-2">{round.round}</p>
                <ul className="flex flex-col gap-1.5">
                  {round.items.map((item, ii) => {
                    const key = `R${ri}-${ii}`
                    return (
                      <li
                        key={key}
                        className="flex items-start gap-2.5 cursor-pointer group"
                        onClick={() => toggleCheck(key)}
                      >
                        <span className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${checked[key] ? 'bg-primary-500 border-primary-500' : 'border-gray-300 group-hover:border-primary-300'}`}>
                          {checked[key] && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2">
                              <path d="M1 5l3 3 5-5" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm leading-snug transition-colors ${checked[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. 7-day plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              7-Day Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {plan.map((block, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-20 text-right">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md whitespace-nowrap">
                    {block.days}
                  </span>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-4 pb-4 last:pb-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1.5">{block.focus}</p>
                  <ul className="flex flex-col gap-1">
                    {block.tasks.map((task, ti) => (
                      <li key={ti} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 4. Interview questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary-500" />
              10 Likely Interview Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-snug pt-0.5">{q}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 5. Resources panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" />
              Quick Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'LeetCode',        url: 'https://leetcode.com' },
                { label: 'HackerRank',      url: 'https://hackerrank.com' },
                { label: 'NeetCode 150',    url: 'https://neetcode.io/practice' },
                { label: 'System Design',   url: 'https://github.com/donnemartin/system-design-primer' },
                { label: 'InterviewBit',    url: 'https://interviewbit.com' },
                { label: 'CS Cheat Sheets', url: 'https://github.com/jwasham/coding-interview-university' },
              ].map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg text-center transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
