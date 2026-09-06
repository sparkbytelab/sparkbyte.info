import { lazy, Suspense, useEffect, useRef } from 'react'
import { useContent } from './content/ContentProvider.jsx'
import { useMotion } from './animations/motion.jsx'
import Navigation from './components/layout/Navigation.jsx'
import Footer from './components/layout/Footer.jsx'
import Seo from './components/layout/Seo.jsx'
import Hero from './components/sections/Hero.jsx'
import Contact from './components/sections/Contact.jsx'

const BelowFold = lazy(() => import('./components/BelowFold.jsx'))

export default function App() {
  const { ui } = useContent()
  const { enabled } = useMotion()
  const scope = useRef(/** @type {HTMLDivElement | null} */ (null))
  useEffect(() => {
    const anchor = window.location.hash.slice(1)
    const jump = setTimeout(
      () => document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' }),
      0,
    )
    return () => {
      clearTimeout(jump)
    }
  }, [])
  useEffect(() => {
    let cancelled = false
    let cancel = () => {}
    const load = () => {
      import('./animations/motion-scenes.js').then(({ startMotion }) => {
        if (!cancelled && scope.current) cancel = startMotion(scope.current, enabled)
      })
    }
    if ('requestIdleCallback' in window) {
      const idle = window.requestIdleCallback(load, { timeout: 1200 })
      cancel = () => window.cancelIdleCallback(idle)
    } else {
      const timer = setTimeout(load, 120)
      cancel = () => clearTimeout(timer)
    }
    return () => {
      cancelled = true
      cancel()
    }
  }, [enabled])
  return (
    <div ref={scope} className="site" data-motion={enabled ? 'on' : 'off'}>
      <Seo />
      <div id="top" className="top-sentinel" />
      <a className="skip-link" href="#main-content">
        {ui.skip}
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Suspense fallback={null}>
          <BelowFold />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
