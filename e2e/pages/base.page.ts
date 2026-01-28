import { Page, Locator } from '@playwright/test'

/**
 * Base page object for the Apatheia Labs static website.
 */
export class BasePage {
  readonly page: Page
  readonly header: Locator
  readonly nav: Locator
  readonly mobileMenuBtn: Locator
  readonly footer: Locator
  readonly skipToContent: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('header').first()
    this.nav = page.locator('header nav')
    this.mobileMenuBtn = page.locator('.mobile-menu-btn')
    this.footer = page.locator('footer')
    this.skipToContent = page.locator('.skip-to-content')
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
  }

  async getNavLinks(): Promise<string[]> {
    return this.nav.locator('a').allTextContents()
  }

  async isNavVisible(): Promise<boolean> {
    return this.nav.isVisible()
  }
}
