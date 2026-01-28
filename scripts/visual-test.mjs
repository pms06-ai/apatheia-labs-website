#!/usr/bin/env node
/**
 * Agentic Visual Testing Script for Phronesis App
 * Run with: node scripts/visual-test.mjs
 *
 * This opens a visible browser window so you can watch the tests run.
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotDir = join(__dirname, '../test-screenshots');

// Test configuration
const BASE_URL = 'http://localhost:5180';
const ANALYSIS_URL = `${BASE_URL}/#/analysis`;

// Helper to pause for visual observation
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test result tracking
const results = {
  passed: [],
  failed: [],
  screenshots: []
};

async function takeScreenshot(page, name, description) {
  const filename = `${Date.now()}-${name}.png`;
  const filepath = join(screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  results.screenshots.push({ name, description, filepath });
  console.log(`  📸 Screenshot: ${name} → ${filename}`);
  return filepath;
}

async function test(name, fn) {
  console.log(`\n▶ ${name}`);
  try {
    await fn();
    results.passed.push(name);
    console.log(`  ✅ PASSED`);
  } catch (error) {
    results.failed.push({ name, error: error.message });
    console.log(`  ❌ FAILED: ${error.message}`);
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔬 PHRONESIS VISUAL TESTING');
  console.log('═'.repeat(60));
  console.log('\n👀 Watch the browser window for live test execution\n');

  // Create screenshot directory
  await mkdir(screenshotDir, { recursive: true });

  // Launch visible browser
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300, // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  try {
    // ═══════════════════════════════════════════════════════════
    // TEST 1: Navigate to Analysis Page
    // ═══════════════════════════════════════════════════════════
    await test('Navigate to Analysis Page', async () => {
      await page.goto(ANALYSIS_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await pause(2000);

      // Check for Analysis Engines heading
      const heading = page.locator('text=Analysis Engines').first();
      await heading.waitFor({ state: 'visible', timeout: 10000 });

      const text = await heading.textContent();
      console.log(`  → Found heading: ${text}`);

      await takeScreenshot(page, '01-analysis-page', 'Analysis page loaded');
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 2: Document Corpus Section
    // ═══════════════════════════════════════════════════════════
    await test('Document Corpus Section Visible', async () => {
      const corpusSection = page.locator('text=Document Corpus').first();
      await corpusSection.waitFor({ state: 'visible', timeout: 5000 });

      const selectAllBtn = page.locator('text=Select All').first();
      const isSelectAllVisible = await selectAllBtn.isVisible();
      console.log(`  → Select All button visible: ${isSelectAllVisible}`);

      await takeScreenshot(page, '02-document-corpus', 'Document Corpus section');
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 3: Select Documents
    // ═══════════════════════════════════════════════════════════
    await test('Select Documents', async () => {
      const selectAllBtn = page.locator('text=Select All').first();

      if (await selectAllBtn.isVisible()) {
        await selectAllBtn.click();
        await pause(500);
        console.log('  → Clicked Select All');

        // Check for selection count
        const selectedBadge = page.locator('text=/\\d+ SELECTED/i').first();
        if (await selectedBadge.isVisible()) {
          const count = await selectedBadge.textContent();
          console.log(`  → Selection: ${count}`);
        }
      }

      await takeScreenshot(page, '03-documents-selected', 'Documents selected');
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 4: Select Analysis Engine
    // ═══════════════════════════════════════════════════════════
    await test('Select Analysis Engine', async () => {
      // Engine cards visible in left panel
      const engines = [
        'Omission Detection',
        'Expert Witness',
        'Documentary Analysis',
        'Narrative Evolution',
        'Cross-Institutional'
      ];

      for (const engine of engines) {
        const engineCard = page.locator(`text=${engine}`).first();
        if (await engineCard.isVisible()) {
          console.log(`  → Found engine: ${engine}`);
          await engineCard.click();
          await pause(300);
          break;
        }
      }

      await takeScreenshot(page, '04-engine-selected', 'Engine selected');
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 5: Execute Analysis Button
    // ═══════════════════════════════════════════════════════════
    await test('Execute Analysis Button', async () => {
      const executeBtn = page.locator('button:has-text("Execute Analysis")').first();
      await executeBtn.waitFor({ state: 'visible', timeout: 5000 });

      const isEnabled = !(await executeBtn.isDisabled());
      console.log(`  → Execute button enabled: ${isEnabled}`);

      await takeScreenshot(page, '05-execute-button', 'Execute Analysis button');

      if (isEnabled) {
        await executeBtn.click();
        console.log('  → Clicked Execute Analysis');
        await pause(2000);
        await takeScreenshot(page, '06-analysis-started', 'Analysis started');
      }
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 6: Monitor Analysis Progress
    // ═══════════════════════════════════════════════════════════
    await test('Monitor Analysis Progress', async () => {
      // Look for loading/progress states
      const progressIndicators = [
        page.locator('[role="progressbar"]'),
        page.locator('.animate-spin'),
        page.locator('text=/Running|Processing|Analyzing/i'),
      ];

      for (const indicator of progressIndicators) {
        if (await indicator.first().isVisible()) {
          console.log('  → Progress indicator visible');
          break;
        }
      }

      // Wait and capture progress
      for (let i = 0; i < 5; i++) {
        await pause(2000);
        await takeScreenshot(page, `07-progress-${i}`, `Progress checkpoint ${i+1}`);

        // Check for completion
        const completeIndicators = [
          page.locator('text=/Complete|Finished|Results/i').first(),
          page.locator('text=/Total Findings/i').first(),
        ];

        for (const complete of completeIndicators) {
          if (await complete.isVisible()) {
            const text = await complete.textContent();
            console.log(`  → Analysis status: ${text}`);
            return;
          }
        }
      }
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 7: Results Tabs (List, Engine, Timeline, Network, Entities)
    // ═══════════════════════════════════════════════════════════
    await test('Results Dashboard Tabs', async () => {
      await pause(1000);

      // Available tabs: List, Engine, Timeline, Network, Entities
      const tabNames = ['List', 'Engine', 'Timeline', 'Network', 'Entities'];
      let clickedTabs = 0;

      for (const tabName of tabNames) {
        const tab = page.locator(`[role="tab"]:has-text("${tabName}")`).first();

        if (await tab.isVisible()) {
          const isDisabled = await tab.getAttribute('data-disabled');
          const isButtonDisabled = await tab.getAttribute('disabled');

          if (!isDisabled && !isButtonDisabled) {
            try {
              await tab.click({ timeout: 2000 });
              await pause(500);
              console.log(`  → Clicked tab: ${tabName}`);
              await takeScreenshot(page, `08-tab-${tabName.toLowerCase()}`, `Tab: ${tabName}`);
              clickedTabs++;
            } catch {
              console.log(`  → Tab not clickable: ${tabName} (disabled or no data)`);
            }
          } else {
            console.log(`  → Tab disabled: ${tabName} (expected - no data)`);
          }
        }
      }

      console.log(`  → Clicked ${clickedTabs} of ${tabNames.length} tabs`);
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 8: Run Statistics Panel
    // ═══════════════════════════════════════════════════════════
    await test('Run Statistics Panel', async () => {
      const statsPanel = page.locator('text=Run Statistics').first();

      if (await statsPanel.isVisible()) {
        console.log('  → Run Statistics panel visible');

        // Check for findings count
        const findings = page.locator('text=/Total Findings/i').first();
        if (await findings.isVisible()) {
          const parent = findings.locator('..');
          const count = await parent.textContent();
          console.log(`  → ${count}`);
        }
      }

      await takeScreenshot(page, '09-statistics', 'Run Statistics panel');
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 9: Export Evidence Dropdown
    // ═══════════════════════════════════════════════════════════
    await test('Export Evidence Dropdown', async () => {
      const exportBtn = page.locator('button:has-text("Export Evidence")').first();

      if (await exportBtn.isVisible()) {
        const isDisabled = await exportBtn.isDisabled();

        if (!isDisabled) {
          await exportBtn.click({ timeout: 2000 });
          await pause(500);
          console.log('  → Clicked Export Evidence');
          await takeScreenshot(page, '10-export-dropdown', 'Export dropdown');

          // Close dropdown by clicking elsewhere
          await page.keyboard.press('Escape');
        } else {
          console.log('  → Export Evidence button disabled (expected - no findings)');
          await takeScreenshot(page, '10-export-disabled', 'Export button disabled state');
        }
      } else {
        console.log('  → Export Evidence button not found');
      }
    });

    // ═══════════════════════════════════════════════════════════
    // TEST 10: Navigation to Other Pages
    // ═══════════════════════════════════════════════════════════
    await test('Navigate to Documents Page', async () => {
      const docsLink = page.locator('a:has-text("Documents"), [href="#/documents"]').first();

      if (await docsLink.isVisible()) {
        await docsLink.click();
        await pause(1000);
        console.log('  → Navigated to Documents');
        await takeScreenshot(page, '11-documents-page', 'Documents page');
      }
    });

    // Final state
    await page.goto(ANALYSIS_URL, { waitUntil: 'domcontentloaded' });
    await pause(1000);
    await takeScreenshot(page, '99-final-state', 'Final page state');

  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message);
    await takeScreenshot(page, 'error-state', 'Error state');
  }

  // ═══════════════════════════════════════════════════════════
  // RESULTS SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📸 Screenshots: ${results.screenshots.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed tests:');
    results.failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }

  console.log(`\nScreenshots saved to: ${screenshotDir}`);
  console.log('\n⏳ Keeping browser open for 10 seconds for inspection...');
  await pause(10000);

  // Cleanup
  await browser.close();
  console.log('\n🔒 Browser closed. Testing complete.');

  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch(console.error);
