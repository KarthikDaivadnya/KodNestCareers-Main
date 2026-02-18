import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage  from './pages/LandingPage'
import AppShell     from './layouts/AppShell'
import Dashboard    from './pages/Dashboard'
import Practice     from './pages/Practice'
import Assessments  from './pages/Assessments'
import Resources    from './pages/Resources'
import Profile      from './pages/Profile'
import Analyzer     from './pages/Analyzer'
import Results      from './pages/Results'
import History      from './pages/History'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <AppShell />,
    children: [
      { index: true,                element: <Dashboard /> },
      { path: 'practice',           element: <Practice /> },
      { path: 'assessments',        element: <Assessments /> },
      { path: 'resources',          element: <Resources /> },
      { path: 'profile',            element: <Profile /> },
      { path: 'analyzer',           element: <Analyzer /> },
      { path: 'results',            element: <Results /> },
      { path: 'history',            element: <History /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
