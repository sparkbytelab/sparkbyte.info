import { endpointSchema, siteContentSchema } from './content-schema.js'

export class ContentValidationError extends Error {
  /** @param {import('zod').ZodError} error */
  constructor(error) {
    super(
      error.issues.map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`).join('\n'),
    )
    this.name = 'ContentValidationError'
  }
}

/** @typedef {import('./content-types').ContentSource} ContentSource */
/** @implements {ContentSource} */
export class JsonContentSource {
  /** @param {string} [url] */
  constructor(url = '/content/site.json') {
    this.url = url
  }

  /** @param {AbortSignal} [signal] */
  async load(signal) {
    const url = endpointSchema.parse(this.url)
    const controller = new AbortController()
    const abort = () => controller.abort()
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
    const timeout = setTimeout(abort, 10000)
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
        credentials: 'omit',
      })
      if (!response.ok) throw new Error(`Content HTTP ${response.status}`)
      const data = siteContentSchema.safeParse(await response.json())
      if (!data.success) throw new ContentValidationError(data.error)
      return data.data
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', abort)
    }
  }
}
