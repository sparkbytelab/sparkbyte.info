import { createContext, useContext, useState, useSyncExternalStore } from 'react'

/** @param {string} query */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

const MotionContext = createContext({ enabled: true, toggle: () => {} })
export const useMotion = () => useContext(MotionContext)

/** @param {{children: import('react').ReactNode}} props */
export function MotionProvider({ children }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [paused, setPaused] = useState(false)
  return (
    <MotionContext.Provider
      value={{ enabled: !reduced && !paused, toggle: () => setPaused((value) => !value) }}
    >
      {children}
    </MotionContext.Provider>
  )
}
