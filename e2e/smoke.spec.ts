import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Apatheia Labs/i)
  })

  test('renders hero section', async ({ page }) => {
    await page.goto('/')
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('header navigation is present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()
  })
})
