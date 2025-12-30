/**
 * Next.js Instrumentation
 * 
 * This file runs once when the Next.js server starts.
 * Use it for one-time setup like environment validation.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { checkEnvOnStartup } = await import('@/lib/env')
    
    console.log('\n🏛️  Phronesis FCIP v6.0')
    console.log('   Apatheia Labs - Clarity Through Analysis')
    console.log('   ─────────────────────────────────────────')
    
    checkEnvOnStartup()
    
    console.log('   Server starting...\n')
  }
}
