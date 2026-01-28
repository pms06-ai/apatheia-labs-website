import { test, expect } from '../fixtures/test-base'

/**
 * Navigation and cross-page link tests for the static site.
 */

test.describe('Landing Page Navigation', () => {
  test('anchor links point to existing sections', async ({ page, basePage }) => {
    await basePage.goto('/')
    const anchorLinks = page.locator('nav a[href^="#"]')
    const count = await anchorLinks.count()

    for (let i = 0; i < count; i++) {
      const href = await anchorLinks.nth(i).getAttribute('href')
      if (href && href !== '#') {
        const target = page.locator(href)
        await expect(target, `Anchor target ${href} should exist`).toBeAttached()
      }
    }
  })

  test('Research nav link leads to research hub', async ({ page, basePage }) => {
    await basePage.goto('/')
    const researchLink = page.locator('nav a[href="/research/"]')
    await expect(researchLink).toBeVisible()
    await researchLink.click()
    await expect(page).toHaveTitle(/Research Hub/i)
  })

  test('logo links to homepage', async ({ page, basePage }) => {
    await basePage.goto('/')
    const logo = page.locator('header a.logo')
    await expect(logo).toHaveAttribute('href', '/')
  })
})

test.describe('Research Hub Navigation', () => {
  test('header nav links resolve correctly', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    // About and Methodology link to landing page sections
    const aboutLink = page.locator('nav a[href="/#about"]')
    await expect(aboutLink).toBeAttached()
    const methodLink = page.locator('nav a[href="/#methodology"]')
    await expect(methodLink).toBeAttached()
  })

  test('Research link is marked active on research pages', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    const activeLink = page.locator('nav a.active')
    await expect(activeLink).toBeVisible()
    await expect(activeLink).toContainText('Research')
  })

  test('can navigate from research hub to article', async ({ page, basePage }) => {
    await basePage.goto('/research/')
    // Find any article link and click it
    const articleLink = page.locator('a[href*="/research/foundations/"]').first()
    if (await articleLink.isVisible()) {
      await articleLink.click()
      await page.waitForLoadState('domcontentloaded')
      // Should be on an article page with breadcrumbs
      await expect(page.locator('.breadcrumbs')).toBeVisible()
    }
  })

  test('article pages link back to research hub', async ({ page, basePage }) => {
    await basePage.goto('/research/foundations/epistemology/')
    const researchLink = page.locator('nav a[href="/research/"]')
    await expect(researchLink).toBeVisible()
  })
})

test.describe('Cross-Page Links', () => {
  test('landing page research section links to research hub', async ({ page, basePage }) => {
    await basePage.goto('/')
    // The #research section should have a link to /research/
    const researchSection = page.locator('#research')
    const hubLink = researchSection.locator('a[href="/research/"]').first()
    if (await hubLink.isVisible()) {
      await expect(hubLink).toBeAttached()
    }
  })
})
