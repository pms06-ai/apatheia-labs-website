import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Cloud,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  checkGoogleConnection,
  startGoogleAuth,
  checkGoogleAuthCallback,
  disconnectGoogle,
  setGoogleClientId,
} from '@/lib/tauri/commands'
import type { GoogleConnectionStatus } from '@/CONTRACT'

interface CloudConnectionsProps {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export function CloudConnections({ onSuccess, onError }: CloudConnectionsProps) {
  const [googleStatus, setGoogleStatus] = useState<GoogleConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [clientIdInput, setClientIdInput] = useState('')
  const [showClientId, setShowClientId] = useState(false)
  const [savingClientId, setSavingClientId] = useState(false)

  // Use ref for interval to avoid closure issues in callbacks
  const authPollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load connection status on mount
  useEffect(() => {
    loadGoogleStatus()
  }, [])

  // Cleanup poll interval on unmount
  useEffect(() => {
    return () => {
      if (authPollIntervalRef.current) {
        clearInterval(authPollIntervalRef.current)
      }
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current)
      }
    }
  }, [])

  async function loadGoogleStatus() {
    try {
      const status = await checkGoogleConnection()
      setGoogleStatus(status)
    } catch (e) {
      console.error('Failed to load Google status:', e)
      setGoogleStatus({
        connected: false,
        email: null,
        expires_at: null,
        has_client_id: false,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveClientId() {
    if (!clientIdInput.trim()) return

    setSavingClientId(true)
    try {
      await setGoogleClientId(clientIdInput.trim())
      setClientIdInput('')
      await loadGoogleStatus()
      onSuccess?.('Client ID saved successfully')
    } catch (e) {
      onError?.(e instanceof Error ? e.message : 'Failed to save Client ID')
    } finally {
      setSavingClientId(false)
    }
  }

  const stopPolling = useCallback(() => {
    if (authPollIntervalRef.current) {
      clearInterval(authPollIntervalRef.current)
      authPollIntervalRef.current = null
    }
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current)
      authTimeoutRef.current = null
    }
  }, [])

  const pollForCallback = useCallback(async () => {
    try {
      const success = await checkGoogleAuthCallback()
      if (success) {
        stopPolling()
        setConnecting(false)
        await loadGoogleStatus()
        onSuccess?.('Google Drive connected successfully')
      }
    } catch (e) {
      console.error('Auth callback check failed:', e)
    }
  }, [onSuccess, stopPolling])

  async function handleConnect() {
    if (!googleStatus?.has_client_id) {
      onError?.('Please configure a Client ID first')
      return
    }

    setConnecting(true)
    try {
      const result = await startGoogleAuth()

      // Open auth URL in system browser
      const { openUrl } = await import('@tauri-apps/plugin-opener')
      await openUrl(result.auth_url)

      // Start polling for callback
      authPollIntervalRef.current = setInterval(pollForCallback, 1000)

      // Stop polling after 5 minutes
      authTimeoutRef.current = setTimeout(
        () => {
          stopPolling()
          setConnecting(false)
        },
        5 * 60 * 1000
      )
    } catch (e) {
      setConnecting(false)
      onError?.(e instanceof Error ? e.message : 'Failed to start Google auth')
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      await disconnectGoogle()
      await loadGoogleStatus()
      onSuccess?.('Google Drive disconnected')
    } catch (e) {
      onError?.(e instanceof Error ? e.message : 'Failed to disconnect')
    } finally {
      setDisconnecting(false)
    }
  }

  function cancelAuth() {
    stopPolling()
    setConnecting(false)
  }

  if (loading) {
    return (
      <Card className="border-charcoal-700 bg-charcoal-800/50 p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-charcoal-400" />
          <span className="text-charcoal-400">Loading cloud connections...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-charcoal-700 bg-charcoal-800/50 p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-lg bg-bronze-500/10 p-3">
          <Cloud className="h-6 w-6 text-bronze-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-charcoal-100">Cloud Storage</h2>
            <button
              onClick={loadGoogleStatus}
              className="rounded-lg bg-charcoal-700 p-2 text-charcoal-400 transition-colors hover:bg-charcoal-600 hover:text-charcoal-200"
              title="Refresh status"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-charcoal-400">
            Import documents from cloud storage providers.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Google Drive Section */}
        <div className="rounded-lg border border-charcoal-700 bg-charcoal-900/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-800">
                <svg className="h-5 w-5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                    fill="#0066da"
                  />
                  <path
                    d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
                    fill="#00ac47"
                  />
                  <path
                    d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                    fill="#ea4335"
                  />
                  <path
                    d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                    fill="#00832d"
                  />
                  <path
                    d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                    fill="#2684fc"
                  />
                  <path
                    d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                    fill="#ffba00"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium text-charcoal-200">Google Drive</span>
                <div className="flex items-center gap-2 text-xs">
                  {googleStatus?.connected ? (
                    <>
                      <div className="h-1.5 w-1.5 rounded-full bg-status-success" />
                      <span className="text-status-success">Connected</span>
                    </>
                  ) : (
                    <>
                      <div className="h-1.5 w-1.5 rounded-full bg-charcoal-500" />
                      <span className="text-charcoal-500">Not connected</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {googleStatus?.connected ? (
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="rounded-lg border border-status-critical/30 bg-status-critical/10 px-3 py-1.5 text-sm text-status-critical transition-colors hover:bg-status-critical/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disconnecting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Disconnecting...
                  </span>
                ) : (
                  'Disconnect'
                )}
              </button>
            ) : connecting ? (
              <button
                onClick={cancelAuth}
                className="rounded-lg border border-charcoal-600 bg-charcoal-800 px-3 py-1.5 text-sm text-charcoal-300 transition-colors hover:bg-charcoal-700"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={!googleStatus?.has_client_id}
                className="rounded-lg bg-bronze-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-bronze-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Connect
              </button>
            )}
          </div>

          {/* Connection Status Details */}
          {googleStatus?.connected && googleStatus.email && (
            <div className="mb-4 rounded-lg border border-status-success/20 bg-status-success/10 p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-status-success" />
                <span className="text-sm text-status-success">
                  Connected as {googleStatus.email}
                </span>
              </div>
              {googleStatus.expires_at && (
                <p className="mt-1 text-xs text-charcoal-400">
                  Token expires: {new Date(googleStatus.expires_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Connecting Animation */}
          {connecting && (
            <div className="mb-4 rounded-lg border border-bronze-500/20 bg-bronze-500/10 p-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-bronze-500" />
                <div>
                  <span className="text-sm text-bronze-400">Waiting for authorization...</span>
                  <p className="text-xs text-charcoal-400">
                    Complete the sign-in in your browser, then return here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Client ID Configuration */}
          <div className="border-t border-charcoal-700 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-charcoal-300">
                Google OAuth Client ID
              </label>
              {googleStatus?.has_client_id && (
                <Badge
                  variant="outline"
                  className="border-status-success/50 text-xs text-status-success"
                >
                  Configured
                </Badge>
              )}
            </div>

            {!googleStatus?.has_client_id && (
              <div className="mb-3 rounded-lg border border-bronze-500/20 bg-bronze-500/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400" />
                  <div>
                    <p className="text-xs text-bronze-400">
                      Create a Desktop app credential in the{' '}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 underline hover:text-bronze-300"
                      >
                        Google Cloud Console
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-charcoal-500">
                      Enable the Google Drive API and add{' '}
                      <code className="rounded bg-charcoal-800 px-1">http://127.0.0.1</code> as an
                      authorized redirect URI.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showClientId ? 'text' : 'password'}
                  value={clientIdInput}
                  onChange={e => setClientIdInput(e.target.value)}
                  placeholder={googleStatus?.has_client_id ? '••••••••••••' : 'Enter Client ID'}
                  className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-2.5 pr-10 font-mono text-sm text-charcoal-100 placeholder:text-charcoal-600 focus:border-bronze-500/50 focus:outline-none focus:ring-1 focus:ring-bronze-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowClientId(!showClientId)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-300"
                >
                  {showClientId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={handleSaveClientId}
                disabled={!clientIdInput.trim() || savingClientId}
                className="rounded-lg bg-bronze-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-bronze-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingClientId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
            <p className="mt-2 text-xs text-charcoal-500">
              Your Client ID is stored securely in your OS keychain.
            </p>
          </div>
        </div>

        {/* OneDrive Section (Coming Soon) */}
        <div className="rounded-lg border border-charcoal-700 bg-charcoal-900/30 p-4 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-800">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 18.5c0-2.5 1.6-4.6 3.8-5.4-.5-.9-1.4-1.6-2.5-1.8.3-.5.4-1 .4-1.6 0-1.9-1.5-3.4-3.4-3.4-1.5 0-2.8 1-3.3 2.4-.3-.1-.6-.1-.9-.1-2.1 0-3.8 1.7-3.8 3.8 0 .6.2 1.2.4 1.7C.5 14.8 0 15.8 0 16.9c0 2.1 1.7 3.8 3.8 3.8h6.7c0-.7 0-1.4 0-2.2zm13.5-2.6c0-2.1-1.7-3.8-3.8-3.8-.4 0-.8.1-1.1.2-.7-1.5-2.2-2.6-4-2.6-2.4 0-4.4 2-4.4 4.4 0 .3 0 .6.1.9-.6.5-1 1.3-1 2.2 0 1.6 1.3 2.8 2.8 2.8h10.5c.5 0 .9-.4.9-.9v-3.2z"
                    className="text-[#0078D4]"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium text-charcoal-200">OneDrive</span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-charcoal-500" />
                  <span className="text-charcoal-500">Coming soon</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="border-charcoal-600 text-xs text-charcoal-500">
              Planned
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
