import { test, expect } from '../fixtures/test-base'

/**
 * Modal, mobile menu, and interactive feature tests.
 */

test.describe('Modals', () => {
  test('clicking a modal trigger opens the modal overlay', async ({ page, basePage }) => {
    await basePage.goto('/')
    // Wait for JS initialization
    await page.waitForLoadState('networkidle')

    // Click the first modal trigger (a methodology card)
    const trigger = page.locator('[data-modal]').first()
    await expect(trigger).toBeAttached()
    await trigger.click()

    // Modal overlay should become active
    const overlay = page.locator('#modal-overlay')
    await expect(overlay).toHaveClass(/active/)
    await expect(overlay).toHaveAttribute('aria-hidden', 'false')
  })

  test('modal can be closed via close button', async ({ page, basePage }) => {
    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    const trigger = page.locator('[data-modal]').first()
    await trigger.click()

    const overlay = page.locator('#modal-overlay')
    await expect(overlay).toHaveClass(/active/)

    // Click the close button
    const closeBtn = page.locator('.modal-close')
    await closeBtn.click()

    await expect(overlay).not.toHaveClass(/active/)
  })

  test('modal can be closed via Escape key', async ({ page, basePage }) => {
    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    const trigger = page.locator('[data-modal]').first()
    await trigger.click()

    const overlay = page.locator('#modal-overlay')
    await expect(overlay).toHaveClass(/active/)

    await page.keyboard.press('Escape')
    await expect(overlay).not.toHaveClass(/active/)
  })

  test('modal can be closed via backdrop click', async ({ page, basePage }) => {
    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    const trigger = page.locator('[data-modal]').first()
    await trigger.click()

    const overlay = page.locator('#modal-overlay')
    await expect(overlay).toHaveClass(/active/)

    // Click the overlay background (not the container)
    await overlay.click({ position: { x: 5, y: 5 } })
    await expect(overlay).not.toHaveClass(/active/)
  })
})

test.describe('Mobile Menu', () => {
  test('mobile menu button toggles nav visibility', async ({ page, basePage }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    const nav = page.locator('header nav')
    const menuBtn = basePage.mobileMenuBtn

    await expect(menuBtn).toBeVisible()

    // Open menu
    await menuBtn.click()
    // Nav should have active or mobile-open class
    const navClasses = await nav.getAttribute('class') || ''
    expect(navClasses).toMatch(/active|mobile-open/)

    // Close menu
    await menuBtn.click()
  })
})

test.describe('Waitlist Form', () => {
  test('unconfigured form shows coming soon message on submit', async ({ page, basePage }) => {
    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    const form = page.locator('.waitlist-form')
    if (await form.isVisible()) {
      const emailInput = form.locator('input[type="email"]')
      await emailInput.fill('test@example.com')

      const submitBtn = form.locator('button[type="submit"]')
      await submitBtn.click()

      // Should show a feedback message (not an alert)
      const feedback = form.locator('.form-feedback')
      await expect(feedback).toBeVisible({ timeout: 3000 })
      await expect(feedback).toContainText('coming soon')
    }
  })
})

test.describe('No Console Errors', () => {
  test('landing page loads without JS errors', async ({ page, basePage }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await basePage.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toEqual([])
  })

  test('research hub loads without JS errors', async ({ page, basePage }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await basePage.goto('/research/')
    await page.waitForLoadState('networkidle')

    expect(errors).toEqual([])
  })

  test('research article loads without JS errors', async ({ page, basePage }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await basePage.goto('/research/foundations/epistemology/')
    await page.waitForLoadState('networkidle')

    expect(errors).toEqual([])
  })
})
