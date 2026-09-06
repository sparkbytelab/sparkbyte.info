import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { siteContentSchema } from '../src/content/content-schema.js'
import { JsonContentSource, ContentValidationError } from '../src/content/content-loader.js'

const fixture = JSON.parse(
  await readFile(new URL('../public/content/site.json', import.meta.url), 'utf8'),
)

test('the published content satisfies the complete contract', () => {
  assert.equal(siteContentSchema.safeParse(fixture).success, true)
})
test('unsafe URLs and broken internal anchors are rejected', () => {
  for (const href of [
    'javascript:alert(1)',
    'data:text/html,bad',
    '//unsafe.test',
    '/\\unsafe.test',
    '#does-not-exist',
  ]) {
    const data = structuredClone(fixture)
    data.hero.primaryCta.href = href
    assert.equal(siteContentSchema.safeParse(data).success, false, href)
  }
})
test('duplicate service ids and missing image descriptions are rejected', () => {
  const duplicate = structuredClone(fixture)
  duplicate.services[1].id = duplicate.services[0].id
  assert.equal(siteContentSchema.safeParse(duplicate).success, false)
  const data = structuredClone(fixture)
  data.projects = [
    {
      title: 'Example',
      category: 'Website',
      description: 'Example project',
      image: '/project.webp',
    },
  ]
  assert.equal(siteContentSchema.safeParse(data).success, false)
})
test('loader fetches at runtime, bypasses cache and validates every response', async (t) => {
  let count = 0
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/content/site.json')
    assert.equal(options.cache, 'no-store')
    const data = structuredClone(fixture)
    data.hero.title = `Runtime title ${++count}`
    return new Response(JSON.stringify(data))
  })
  const source = new JsonContentSource()
  assert.equal((await source.load()).hero.title, 'Runtime title 1')
  assert.equal((await source.load()).hero.title, 'Runtime title 2')
})
test('invalid content returns field paths without rendering partial data', async (t) => {
  const data = structuredClone(fixture)
  data.hero.title = null
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(data)))
  await assert.rejects(
    new JsonContentSource().load(),
    (error) => error instanceof ContentValidationError && error.message.includes('hero.title'),
  )
})
test('HTTP and malformed JSON errors propagate to the retry UI', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }))
  await assert.rejects(new JsonContentSource().load(), /HTTP 503/)
  t.mock.method(globalThis, 'fetch', async () => new Response('not json'))
  await assert.rejects(new JsonContentSource().load(), SyntaxError)
})
