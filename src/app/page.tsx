import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Dashboard } from '@/components/dashboard'

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
