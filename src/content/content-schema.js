import { z } from 'zod'

const text = z.string().trim().min(1).max(1500)
const short = text.max(180)
const optional = (/** @type {z.ZodType<string>} */ schema) => schema.optional().or(z.literal(''))
const isLocalPath = (/** @type {string} */ value) =>
  /^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)
const isHttps = (/** @type {string} */ value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}
export const endpointSchema = z
  .string()
  .max(2048)
  .refine(
    (value) => isLocalPath(value) || isHttps(value),
    'Oczekiwano ścieżki /… lub adresu HTTPS bez danych logowania',
  )
const href = z
  .string()
  .max(2048)
  .refine(
    (value) =>
      /^#[a-z][a-z0-9-]*$/.test(value) ||
      isLocalPath(value) ||
      isHttps(value) ||
      /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      /^tel:\+?[0-9 -]{6,24}$/.test(value),
    'Nieprawidłowy lub niedozwolony link',
  )
const link = z.object({ label: short, href })
const heading = z.object({ eyebrow: short, title: short, description: text })

export const siteContentSchema = z
  .object({
    brand: z.object({ name: short, domain: short, tagline: short }),
    seo: z.object({ title: short, description: text.max(350), ogImage: optional(endpointSchema) }),
    company: z.object({
      name: short,
      address: short,
      postalCode: z.string().regex(/^\d{2}-\d{3}$/),
      city: short,
      nip: z.string().regex(/^\d{10}$/),
      regon: z.string().regex(/^(\d{9}|\d{14})$/),
    }),
    navigation: z.array(link).min(1).max(8),
    hero: z.object({
      eyebrow: short,
      title: short,
      titleAccent: short,
      description: text.max(500),
      primaryCta: link,
      secondaryCta: link,
      statusLabel: short,
      note: short,
      scrollLabel: short,
    }),
    marquee: z.array(short).min(1).max(12),
    introduction: heading,
    headings: z.object({
      services: heading,
      process: heading,
      technology: heading,
      audience: heading,
      projects: heading,
      faq: heading,
    }),
    services: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z][a-z0-9-]*$/),
          number: z.string().regex(/^\d{2}$/),
          eyebrow: short,
          title: short.max(70),
          description: text.max(550),
          features: z.array(short.max(150)).min(1).max(6),
          accent: z.enum(['violet', 'gold', 'coral', 'mint']),
          visual: z.enum(['browser', 'application', 'infrastructure']),
        }),
      )
      .min(1)
      .max(8),
    process: z
      .array(z.object({ number: short, title: short, description: text }))
      .min(1)
      .max(8),
    flow: z
      .array(z.object({ name: short, description: short }))
      .min(2)
      .max(8),
    stack: z
      .array(z.object({ name: short, category: short, description: text.optional() }))
      .max(20),
    audience: z
      .array(z.object({ title: short, description: text }))
      .min(1)
      .max(8),
    projects: z
      .array(
        z
          .object({
            title: short,
            category: short,
            description: text,
            image: optional(endpointSchema),
            imageAlt: short.optional(),
            href: optional(href),
            tags: z.array(short).max(8).optional(),
          })
          .refine((project) => !project.image || Boolean(project.imageAlt), {
            path: ['imageAlt'],
            message: 'Obraz wymaga tekstu alternatywnego',
          }),
      )
      .max(20),
    projectsEmpty: short,
    faq: z
      .array(z.object({ question: short, answer: text }))
      .min(1)
      .max(20),
    contact: z.object({
      eyebrow: short,
      title: short,
      description: text,
      email: optional(z.email()),
      phone: optional(z.string().regex(/^\+?[0-9 ()-]{6,24}$/)),
      directCta: short,
    }),
    footer: z.object({
      description: text,
      links: z.array(link).max(10),
      legalLinks: z.array(link).max(10),
    }),
    ui: z.object({
      skip: short,
      menu: short,
      close: short,
      navigation: short,
      contact: short,
      companyLabel: short,
      signalAlt: short,
      pause: short,
      resume: short,
      servicesIndex: short,
      illustrative: short,
      visualCaption: short,
      visualStamp: z.array(short.max(20)).length(3),
      heroCoordinate: short,
      workInProgress: short,
      contactWordmark: short.max(24),
      visualTitle: short,
      visualSubtitle: short,
      visualModules: z.array(short).length(3),
      visualLog: z.array(short).length(3),
      projectLink: short,
    }),
  })
  .superRefine((content, context) => {
    const ids = new Set([
      'top',
      'main-content',
      'about',
      'services',
      'process',
      'technology',
      'audience',
      'projects',
      'faq',
      'contact',
    ])
    content.services.forEach((service, index) => {
      if (ids.has(service.id))
        context.addIssue({
          code: 'custom',
          path: ['services', index, 'id'],
          message: 'Id musi być unikalne i nie może nadpisywać sekcji',
        })
      ids.add(service.id)
    })
    const links = [
      ...content.navigation.map((item, i) => ({ item, path: ['navigation', i, 'href'] })),
      ...content.footer.links.map((item, i) => ({ item, path: ['footer', 'links', i, 'href'] })),
      ...content.footer.legalLinks.map((item, i) => ({
        item,
        path: ['footer', 'legalLinks', i, 'href'],
      })),
      { item: content.hero.primaryCta, path: ['hero', 'primaryCta', 'href'] },
      { item: content.hero.secondaryCta, path: ['hero', 'secondaryCta', 'href'] },
    ]
    links.forEach(({ item, path }) => {
      if (item.href.startsWith('#') && !ids.has(item.href.slice(1)))
        context.addIssue({
          code: 'custom',
          path,
          message: 'Kotwica nie wskazuje istniejącej sekcji',
        })
    })
  })
