import type { z } from 'zod'
import type { siteContentSchema } from './content-schema.js'

export type SiteContent = z.infer<typeof siteContentSchema>
export interface ContentSource {
  load(signal?: AbortSignal): Promise<SiteContent>
}

declare global {
  interface Window {
    __SPARKBYTE_RUNTIME__?: { contentUrl?: string }
  }
}
