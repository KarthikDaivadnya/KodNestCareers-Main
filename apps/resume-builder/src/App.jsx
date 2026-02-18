import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'

/* ── Layouts ── */
import AppLayout from './layouts/AppLayout'
import RBShell   from './layouts/RBShell'

/* ── Product pages (/  /builder  /preview  /proof) ── */
import Home       from './pages/Home'
import Builder    from './pages/Builder'
import Preview    from './pages/Preview'
import ProofPage  from './pages/ProofPage'

/* ── Build track pages (/rb/*) ── */
import BuildStep from './pages/rb/BuildStep'
import RBProof   from './pages/rb/RBProof'

/**
 * AI Resume Builder — KodNest Premium Build · Project 3
 *
 * Product routes (AppLayout — top nav):
 *   /              Home landing
 *   /builder       Resume form + live preview
 *   /preview       Full clean resume view
 *   /proof         Proof of work + milestones
 *
 * Build track routes (RBShell — premium build layout):
 *   /rb/01-problem … /rb/08-ship   8 gated build steps
 *   /rb/proof                       Final submission
 */

const router = createBrowserRouter([

  /* ─── Product app ─────────────────────────────────────────── */
  {
    element: <AppLayout />,
    children: [
      { path: '/',        element: <Home /> },
      { path: '/builder', element: <Builder /> },
      { path: '/preview', element: <Preview /> },
      { path: '/proof',   element: <ProofPage /> },
    ],
  },

  /* ─── Build track (/rb/*) ─────────────────────────────────── */
  {
    path: '/rb',
    element: <RBShell />,
    children: [
      { index: true,           element: <Navigate to="/rb/01-problem" replace /> },
      { path: '01-problem',    element: <BuildStep stepNum={1} /> },
      { path: '02-market',     element: <BuildStep stepNum={2} /> },
      { path: '03-architecture', element: <BuildStep stepNum={3} /> },
      { path: '04-hld',        element: <BuildStep stepNum={4} /> },
      { path: '05-lld',        element: <BuildStep stepNum={5} /> },
      { path: '06-build',      element: <BuildStep stepNum={6} /> },
      { path: '07-test',       element: <BuildStep stepNum={7} /> },
      { path: '08-ship',       element: <BuildStep stepNum={8} /> },
      { path: 'proof',         element: <RBProof /> },
    ],
  },

  /* ─── Catch-all ────────────────────────────────────────────── */
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return (
    <ResumeProvider>
      <RouterProvider router={router} />
    </ResumeProvider>
  )
}
