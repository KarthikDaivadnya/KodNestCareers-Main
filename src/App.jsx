import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import RBShell   from './layouts/RBShell'
import BuildStep from './pages/rb/BuildStep'
import RBProof   from './pages/rb/RBProof'

/**
 * AI Resume Builder — Build Track
 * Project 3 inside the KodNest Premium Build System
 *
 * Routes:
 *   /rb/01-problem
 *   /rb/02-market
 *   /rb/03-architecture
 *   /rb/04-hld
 *   /rb/05-lld
 *   /rb/06-build
 *   /rb/07-test
 *   /rb/08-ship
 *   /rb/proof
 */

const router = createBrowserRouter([
  /* Redirect root → first step */
  {
    path: '/',
    element: <Navigate to="/rb/01-problem" replace />,
  },

  /* All /rb/* routes share the RBShell layout */
  {
    path: '/rb',
    element: <RBShell />,
    children: [
      /* Redirect /rb → step 1 */
      { index: true, element: <Navigate to="/rb/01-problem" replace /> },

      /* ── 8 Build Steps ── */
      { path: '01-problem',    element: <BuildStep stepNum={1} /> },
      { path: '02-market',     element: <BuildStep stepNum={2} /> },
      { path: '03-architecture', element: <BuildStep stepNum={3} /> },
      { path: '04-hld',        element: <BuildStep stepNum={4} /> },
      { path: '05-lld',        element: <BuildStep stepNum={5} /> },
      { path: '06-build',      element: <BuildStep stepNum={6} /> },
      { path: '07-test',       element: <BuildStep stepNum={7} /> },
      { path: '08-ship',       element: <BuildStep stepNum={8} /> },

      /* ── Proof page ── */
      { path: 'proof',         element: <RBProof /> },
    ],
  },

  /* Catch-all → step 1 */
  {
    path: '*',
    element: <Navigate to="/rb/01-problem" replace />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
