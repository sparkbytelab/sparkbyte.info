// Interactive integration check: keep a browser open across an actual JSON replacement.
// Start the preview, run this script, replace the served JSON, then press Enter.
// Restore the JSON and press Enter again. No build is performed by this script.
import assert from 'node:assert/strict'
import console from 'node:console'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { chromium } from '@playwright/test'

const input = createInterface({ input: process.stdin, output: process.stdout })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto('http://127.0.0.1:4173/')
  await page.locator('h1').waitFor()
  const original = await page.locator('h1').innerText()
  const bundle = await page.locator('script[type="module"]').getAttribute('src')
  await input.question('READY: replace dist/content/site.json and press Enter.\n')
  await page.reload()
  await page.locator('h1').waitFor()
  const changed = await page.locator('h1').innerText()
  assert.notEqual(changed, original)
  assert.equal(await page.locator('script[type="module"]').getAttribute('src'), bundle)
  console.log('PASS: refreshed browser renders changed JSON with the SAME JavaScript bundle.')
  await input.question('Restore the JSON and press Enter.\n')
  await page.reload()
  await page.locator('h1').waitFor()
  assert.equal(await page.locator('h1').innerText(), original)
  assert.equal(await page.locator('script[type="module"]').getAttribute('src'), bundle)
  console.log('PASS: original content restored; no rebuild was used.')
} finally {
  input.close()
  await browser.close()
}
