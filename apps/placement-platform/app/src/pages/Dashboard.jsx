import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { CalendarClock, Play } from 'lucide-react'

/* ─── Data ──────────────────────────────────────────────── */

const radarData = [
  { skill: 'DSA',            score: 75 },
  { skill: 'System Design',  score: 60 },
  { skill: 'Communication',  score: 80 },
  { skill: 'Resume',         score: 85 },
  { skill: 'Aptitude',       score: 70 },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const activeDay = [true, true, false, true, true, false, false]

const assessments = [
  { title: 'DSA Mock Test',        when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep',    when: 'Friday, 11:00 AM' },
]

/* ─── 1. Overall Readiness — SVG circular progress ──────── */

function ReadinessCircle({ score = 72, max = 100 }) {
  const radius = 54
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / max) * circumference

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 py-6">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="hsl(245, 58%, 51%)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
          {/* Score text */}
          <text
            x="70" y="66"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="28"
            fontWeight="700"
            fill="#111827"
            fontFamily="Inter, sans-serif"
          >
            {score}
          </text>
          <text
            x="70" y="86"
            textAnchor="middle"
            fontSize="11"
            fill="#9ca3af"
            fontFamily="Inter, sans-serif"
          >
            / {max}
          </text>
        </svg>
        <p className="text-sm text-gray-500 font-medium">Readiness Score</p>
      </CardContent>
    </Card>
  )
}

/* ─── 2. Skill Breakdown — Radar Chart ───────────────────── */

function SkillRadar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(v) => [`${v}`, 'Score']}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(245, 58%, 51%)"
              fill="hsl(245, 58%, 51%)"
              fillOpacity={0.18}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/* ─── 3. Continue Practice ───────────────────────────────── */

function ContinuePractice() {
  const done = 3
  const total = 10
  const pct = (done / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-base font-semibold text-gray-900 mb-0.5">Dynamic Programming</p>
          <p className="text-xs text-gray-400">{done} of {total} problems completed</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <button className="inline-flex items-center gap-2 self-start bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150">
          <Play className="w-3.5 h-3.5" />
          Continue
        </button>
      </CardContent>
    </Card>
  )
}

/* ─── 4. Weekly Goals ────────────────────────────────────── */

function WeeklyGoals() {
  const solved = 12
  const target = 20
  const pct = (solved / target) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Problems stat */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm text-gray-700 font-medium">Problems Solved</p>
            <span className="text-xs text-gray-400">{solved}/{target} this week</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-primary-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Day circles */}
        <div>
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">Activity this week</p>
          <div className="flex gap-2">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    activeDay[i]
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day[0]}
                </div>
                <span className="text-xs text-gray-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── 5. Upcoming Assessments ────────────────────────────── */

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 divide-y divide-gray-100 px-0 py-0">
        {assessments.map(({ title, when }) => (
          <div key={title} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarClock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">{when}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              Scheduled
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/* ─── Dashboard Page ─────────────────────────────────────── */

export default function Dashboard() {
  return (
    <div className="max-w-5xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">Dashboard</h1>
        <p className="text-sm text-gray-500">Your placement readiness at a glance.</p>
      </div>

      {/* 2-column grid on desktop, 1-column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Row 1 */}
        <ReadinessCircle />
        <SkillRadar />

        {/* Row 2 */}
        <ContinuePractice />
        <WeeklyGoals />

        {/* Row 3 — full width */}
        <div className="md:col-span-2">
          <UpcomingAssessments />
        </div>

      </div>
    </div>
  )
}
