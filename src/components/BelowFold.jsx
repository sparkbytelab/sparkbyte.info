import { useEffect } from 'react'
import Services from './sections/Services.jsx'
import { Process, Technology, Audience, Projects } from './sections/Workshop.jsx'
import Faq from './sections/Faq.jsx'

export default function BelowFold() {
  useEffect(() => {
    // Restore the anchor position after the lazy sections establish their height.
    const frame = requestAnimationFrame(() => {
      const anchor = window.location.hash.slice(1)
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <>
      <Services />
      <Process />
      <Technology />
      <Audience />
      <Projects />
      <Faq />
    </>
  )
}
