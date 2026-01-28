import { test, expect } from '../fixtures/test-base'

/**
 * Smoke tests for Apatheia Labs static website.
 * Verifies landing page, research hub, and research articles load correctly.
 */

test.describe('Landing Page', () => {
  test('loads with correct title', async ({ page, basePage }) => {
    await basePage.goto('/')
    await expect(page).toHaveTitle(/Phronesis.*Apatheia/i)
  })

  test('header is visible with navigation', async ({ page, basePage }) => {
    await basePage.goto('/')
    await expect(basePage.header).toBeVisible()
    await expect(basePage.nav).toBeVisible()

    // Check key nav links exist
    const navText = await basePage.getNavLinks()
    expect(navText.join(' ')).toContain('About')
    expect(navText.join(' ')).toContain('Methodology')
    expect(navText.join(' ')).toContain('Research')
    expect(navText.join(' ')).toContain('Download')
  })

  test('hero section renders', async ({ page, basePage }) => {
    await basePage.goto('/')
    const hero = page.locator('#main-content')
    await expect(hero).toBeVisible()

    // H1 is present
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
    await expect(h1.first()).toContainText('contradictions')
  })

  test('all major sections are present', async ({ page, basePage }) => {
    await basePage.goto('/')
    const sectionIds = ['main-content', 'about', 'methodology', 'engines', 'use-cases', 'roadmap', 'research', 'documentation', 'download', 'waitlist']
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`)
      await expect(section, `Section #${id} should exist`).toBeAttached()
    }
  })

  test('footer is visible', async ({ page, basePage }) => {
    await basePage.goto('/')
    await expect(basePage.footer).toBeAttached()
    // Footer should have brand info
    await expect(basePage.footer.locator('.logo-brand')).toContainText('APATHEIA LABS')
  })

  test('skip-to-content link exists', async ({ page, basePage }) => {
    await basePage.goto('/')
    await expect(basePage.skipToContent).toBeAttached()
    // The target should match #main-content
    const href = await basePage.skipToContent.getAttribute('href')
    expect(href).toBe('#main-content')
    // Verify that target exists
    await expect(page.locator('#main-content')).toBeAttached()
  })

  test('meta tags are present', async ({ page, basePage }) => {
    await basePage.goto('/')
    // theme-color
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toBeAttached()
    // og:locale
    const ogLocale = page.locator('meta[property="og:locale"]')
    await expect(ogLocale).toBeAttached()
    // og:title
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toBeAttached()
  })
})

test.describe('Research Hub', () => {
  test('loads with correct title', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    await expect(page).toHaveTitle(/Research Hub.*Phronesis/i)
  })

  test('hero section renders', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
    await expect(h1.first()).toContainText('methodology')
  })

  test('has navigation links back to landing page', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    // Logo links home
    const logoLink = page.locator('header a.logo')
    await expect(logoLink).toHaveAttribute('href', '/')
  })
})

test.describe('Research Article', () => {
  test('article page loads with TOC and breadcrumbs', async ({ page, basePage }) => {
    await basePage.goto('/research/foundations/epistemology/')
    await expect(page).toHaveTitle(/Epistemology/i)

    // Breadcrumbs
    const breadcrumbs = page.locator('.breadcrumbs')
    await expect(breadcrumbs).toBeVisible()
    await expect(breadcrumbs).toContainText('Foundations')

    // Table of contents
    const toc = page.locator('#TOC')
    await expect(toc).toBeAttached()
    // TOC should have at least one link
    const tocLinks = toc.locator('a')
    expect(await tocLinks.count()).toBeGreaterThan(0)
  })

  test('article has meta tags (category, status)', async ({ page, basePage }) => {
    await basePage.goto('/research/foundations/epistemology/')
    const meta = page.locator('.doc-meta')
    await expect(meta).toBeVisible()
    await expect(meta).toContainText('Foundations')
    await expect(meta).toContainText('Complete')
  })
})
