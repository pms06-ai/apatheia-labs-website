import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/header'
import { Sidebar } from './components/layout/sidebar'
import { MobileNav } from './components/layout/mobile-nav'
import { PageHeader } from './components/layout/page-header'
import { Dashboard } from './components/dashboard'
import { ErrorBoundary } from './components/error-boundary'
import { SkipLink } from './components/ui/skip-link'
import { SearchCommand, SearchProvider, useSearchContext } from './components/search'

// Lazy load page components for better code splitting
import { lazy, Suspense, useState, useCallback } from 'react'
import { Spinner } from './components/ui/spinner'

const DocumentsPage = lazy(() => import('./pages/documents'))
const AnalysisPage = lazy(() => import('./pages/analysis'))
const SAMPage = lazy(() => import('./pages/sam'))
const ComplaintsPage = lazy(() => import('./pages/complaints'))
const SettingsPage = lazy(() => import('./pages/settings'))

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

// Inner layout component that uses search context
function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { isOpen: isSearchOpen, close: closeSearch } = useSearchContext()

  const handleOpenMobileNav = useCallback(() => {
    setIsMobileNavOpen(true)
  }, [])

  const handleCloseMobileNav = useCallback(() => {
    setIsMobileNavOpen(false)
  }, [])

  return (
    <div className="flex h-screen flex-col font-sans">
      <SkipLink />
      <Header onMenuClick={handleOpenMobileNav} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main id="main-content" role="main" className="flex-1 overflow-y-auto p-4 lg:p-6" tabIndex={-1}>
          <PageHeader />
          {children}
        </main>
      </div>
      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={handleCloseMobileNav} />
      {/* Global Search Command Palette */}
      <SearchCommand open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()} />
    </div>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SearchProvider>
  )
}

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="font-display text-4xl text-charcoal-100">404</h1>
      <p className="mt-2 text-charcoal-400">Page not found</p>
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg-primary text-charcoal-100 antialiased">
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/sam" element={<SAMPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </div>
    </ErrorBoundary>
  )
}
