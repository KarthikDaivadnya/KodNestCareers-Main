import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
