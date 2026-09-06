import { createContext, useContext, useEffect, useState } from 'react'
import { ContentValidationError } from './content-loader.js'

const ContentContext = createContext(
  /** @type {import('./content-types').SiteContent | null} */ (null),
)

export function useContent() {
  const content = useContext(ContentContext)
  if (!content) throw new Error('ContentProvider is missing')
  return content
}

/** @param {{source: import('./content-types').ContentSource, children: import('react').ReactNode}} props */
export default function ContentProvider({ source, children }) {
  const [content, setContent] = useState(
    /** @type {import('./content-types').SiteContent | null} */ (null),
  )
  const [error, setError] = useState(/** @type {Error | null} */ (null))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    source
      .load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setContent(data)
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause : new Error('Content unavailable'))
      })
    return () => controller.abort()
  }, [source, attempt])

  if (!content)
    return (
      <main className="content-state" aria-busy={!error}>
        <span className="mono">SPARKBYTE.INFO / SYSTEM</span>
        <div role={error ? 'alert' : 'status'}>
          <h1>{error ? 'Nie udało się wczytać strony.' : 'Uruchamiamy cyfrowy warsztat.'}</h1>
          <p>{error ? 'Sprawdź połączenie i spróbuj ponownie za chwilę.' : 'Ładowanie treści…'}</p>
        </div>
        {error && (
          <button
            className="button button--coral"
            onClick={() => {
              setError(null)
              setAttempt((value) => value + 1)
            }}
          >
            Spróbuj ponownie ↗
          </button>
        )}
        {import.meta.env.DEV && error instanceof ContentValidationError && (
          <pre>{error.message}</pre>
        )}
      </main>
    )
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
