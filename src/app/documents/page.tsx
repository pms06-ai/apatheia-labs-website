import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { DocumentUploader } from '@/components/documents/uploader'
import { DocumentsList } from '@/components/documents/list'

export default function DocumentsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl text-charcoal-100">Documents</h1>
              <p className="mt-1 text-sm text-charcoal-400">
                Upload and manage case documents
              </p>
            </div>

            <DocumentUploader />
            
            <DocumentsList />
          </div>
        </main>
      </div>
    </div>
  )
}
