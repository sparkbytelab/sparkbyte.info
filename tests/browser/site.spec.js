import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

const fixture = JSON.parse(
  await readFile(new URL('../../public/content/site.json', import.meta.url), 'utf8'),
)
async function load(page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(fixture.hero.title)
  await page.waitForTimeout(900)
}

test('desktop: valid anchors, scroll scene, console and accessibility', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await load(page)
  expect(
    await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute('href'))
          .filter((href) => !document.getElementById(href.slice(1))),
      ),
  ).toEqual([])
  await expect(page.locator('.service-scene')).toHaveClass(/is-staged/)
  const scene = page.locator('.service-scene')
  for (let index = 0; index < fixture.services.length; index++) {
    await scene.evaluate((node, value) => {
      const top = node.getBoundingClientRect().top + window.scrollY - 110
      const distance = node.clientHeight - window.innerHeight + 110
      window.scrollTo(0, top + distance * ((value + 0.3) / 3))
    }, index)
    await expect(page.locator('.service-index [aria-current="step"]')).toContainText(
      fixture.services[index].number,
    )
    await expect(page.locator('.service-panel.is-active h3')).toHaveText(
      fixture.services[index].title,
    )
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({ path: `test-results/${test.info().project.name}-desktop.png` })
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(scan.violations).toEqual([])
  expect(errors).toEqual([])
})

test('320–1920px: no horizontal overflow, every service remains available', async ({ page }) => {
  await load(page)
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(150)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `width ${width}`,
    ).toBe(true)
    if (width < 1024) {
      await expect(page.locator('.service-scene')).not.toHaveClass(/is-staged/)
      for (const service of fixture.services)
        await expect(page.getByRole('heading', { name: service.title })).toBeVisible()
    }
    if (width === 375)
      await page.screenshot({
        path: `test-results/${test.info().project.name}-mobile.png`,
        fullPage: true,
      })
  }
})

test('mobile menu traps focus, closes with Escape and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await load(page)
  const button = page.getByRole('button', { name: fixture.ui.menu })
  await button.click()
  const menu = page.getByRole('dialog')
  await expect(menu).toBeVisible()
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    expect(await menu.evaluate((node) => node.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(button).toBeFocused()
  await button.click()
  await menu.getByRole('link', { name: 'FAQ' }).click()
  await expect(menu).not.toBeVisible()
  await expect(page).toHaveURL(/#faq$/)
})

test('FAQ opens and closes by keyboard', async ({ page }) => {
  await load(page)
  const question = page.getByRole('button', { name: /Ile kosztuje/ })
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('region', { name: /Ile kosztuje/ })).toBeVisible()
  await page.keyboard.press('Space')
  await expect(question).toHaveAttribute('aria-expanded', 'false')
})

test('reduced motion and pause reveal all services and stop animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await load(page)
  await expect(page.locator('.site')).toHaveAttribute('data-motion', 'off')
  await expect(page.locator('.service-scene')).not.toHaveClass(/is-staged/)
  expect(
    await page
      .locator('.orbital-ring')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none')
  for (const service of fixture.services)
    await expect(page.getByRole('heading', { name: service.title })).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.service-scene')).toHaveClass(/is-staged/)
  await page.getByRole('button', { name: fixture.ui.pause }).click()
  await expect(page.locator('.service-scene')).not.toHaveClass(/is-staged/)
  expect(
    await page
      .locator('.orbital-ring')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none')
})

test('home provides direct contact without a form', async ({ page }) => {
  await load(page)
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('.contact-email')).toHaveAttribute(
    'href',
    `mailto:${fixture.contact.email}`,
  )
  await expect(page.locator('.projects-empty')).toContainText(fixture.projectsEmpty)
  await expect(page.locator('#contact .button')).toHaveAttribute(
    'href',
    `mailto:${fixture.contact.email}`,
  )
  await expect(page.locator('.footer-contact address a')).toHaveAttribute(
    'href',
    `mailto:${fixture.contact.email}`,
  )
  await expect(page.locator('a[href="/kontakt"]')).toHaveCount(0)
  await page.locator('.header-cta').click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact-title')).toBeInViewport()
  await expect(page.locator('.footer-company')).toContainText(fixture.company.name)
  await expect(page.locator('.footer-company')).toContainText(fixture.company.nip)
  await expect(page.locator('.footer-company')).toContainText(fixture.company.regon)
  await expect(page.locator('.signal-visual img')).toHaveAttribute('src', /signal-frame.*\.svg/)
})

test('invalid JSON fails safely and retry loads a complete page', async ({ page }) => {
  let broken = true
  await page.route('**/content/site.json', (route) =>
    route.fulfill({ json: broken ? { hero: { title: '<script>bad</script>' } } : fixture }),
  )
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Nie udało się wczytać strony')
  await expect(page.locator('.site')).toHaveCount(0)
  await expect(page.locator('pre')).toHaveCount(0)
  broken = false
  await page.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(fixture.hero.title)
})

test('runtime configuration can select another JSON source', async ({ page }) => {
  const content = structuredClone(fixture)
  content.hero.title = 'Treść z innego źródła.'
  await page.route('**/runtime-config.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.__SPARKBYTE_RUNTIME__ = { contentUrl: "/alternate.json" };',
    }),
  )
  await page.route('**/alternate.json', (route) => route.fulfill({ json: content }))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(content.hero.title)
})

test('legacy contact URLs reach direct contact after delayed sections load', async ({ page }) => {
  await page.route('**/assets/BelowFold-*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    await route.continue()
  })
  for (const path of ['/kontakt', '/kontakt/']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('#faq')).toBeAttached()
    await expect(page.locator('#contact-title')).toBeInViewport()
    await expect(page.locator('form')).toHaveCount(0)
    await expect(page).toHaveTitle(fixture.seo.title)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://sparkbyte.info/',
    )
    await expect(page.locator('.contact-email')).toHaveAttribute(
      'href',
      `mailto:${fixture.contact.email}`,
    )
  }
})

test('mobile navigation opens contact and optional phone stays usable', async ({ page }) => {
  const content = structuredClone(fixture)
  content.contact.email = ''
  content.contact.phone = '+48 123 456 789'
  await page.route('**/content/site.json', (route) => route.fulfill({ json: content }))
  await page.setViewportSize({ width: 375, height: 812 })
  await load(page)
  await page.getByRole('button', { name: fixture.ui.menu }).click()
  await page.getByRole('dialog').getByRole('link', { name: fixture.ui.contact }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('#contact-title')).toBeInViewport()
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0)
  await expect(page.locator('#contact a[href^="tel:"]')).toHaveAttribute('href', 'tel:+48123456789')
  await expect(page.locator('.footer-contact a[href^="tel:"]')).toHaveAttribute(
    'href',
    'tel:+48123456789',
  )
  await expect(page.locator('form')).toHaveCount(0)
})

test('mobile scroll reveals every section and keeps content readable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await load(page)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= height; y += 550) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(100)
  }
  await page.waitForTimeout(800)
  for (const element of await page.locator('[data-reveal]').all()) {
    expect(await element.evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1)
  }
  await page
    .locator('#contact')
    .screenshot({ path: `test-results/${test.info().project.name}-contact-mobile.png` })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page
    .locator('.hero')
    .screenshot({ path: `test-results/${test.info().project.name}-hero-mobile.png` })
  await page.screenshot({
    path: `test-results/${test.info().project.name}-full-mobile.png`,
    fullPage: true,
  })
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(scan.violations).toEqual([])
})
