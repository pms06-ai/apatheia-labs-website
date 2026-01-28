import { FullConfig } from '@playwright/test'

/**
 * Global setup for Playwright tests.
 * Verifies the static file server is ready before running tests.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000'

  console.log(`\n[Global Setup] Checking server readiness at ${baseURL}...`)

  const maxRetries = 10
  const retryDelay = 500

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(baseURL, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      })

      if (response.ok || response.status === 304) {
        console.log(`[Global Setup] Server is ready (status: ${response.status})`)
        return
      }
    } catch {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
  }

  throw new Error(
    `[Global Setup] Server at ${baseURL} did not become ready within ${(maxRetries * retryDelay) / 1000} seconds`
  )
}

export default globalSetup
