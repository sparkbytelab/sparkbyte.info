import { useRef, useState } from 'react'
import { useContent } from '../../content/ContentProvider.jsx'
import { useMediaQuery, useMotion } from '../../animations/motion.jsx'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/useScrollScenes.js'
import { Arrow, SectionHeading } from '../ui/Primitives.jsx'
import SystemVisual from '../visuals/SystemVisual.jsx'

export default function Services() {
  const { services, headings, ui } = useContent()
  const { enabled } = useMotion()
  const desktop = useMediaQuery('(min-width: 1024px) and (min-height: 800px)')
  const staged = enabled && desktop
  const [active, setActive] = useState(0)
  const scene = useRef(/** @type {HTMLDivElement | null} */ (null))
  const progress = useRef(/** @type {HTMLDivElement | null} */ (null))
  const trigger = useRef(/** @type {ScrollTrigger | null} */ (null))
  useGSAP(
    () => {
      if (!staged || !scene.current) return
      const media = gsap.matchMedia()
      media.add(
        '(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)',
        () => {
          trigger.current = ScrollTrigger.create({
            trigger: scene.current,
            start: 'top 110px',
            end: 'bottom bottom',
            onUpdate: (self) =>
              setActive(Math.min(services.length - 1, Math.floor(self.progress * services.length))),
          })
          gsap.fromTo(
            progress.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: scene.current,
                start: 'top 110px',
                end: 'bottom bottom',
                scrub: true,
              },
            },
          )
        },
      )
      return () => {
        media.revert()
        trigger.current = null
      }
    },
    { scope: scene, dependencies: [staged, services.length], revertOnUpdate: true },
  )

  /** @param {number} index */
  function select(index) {
    if (!trigger.current) return
    const position =
      trigger.current.start +
      ((index + 0.15) / services.length) * (trigger.current.end - trigger.current.start)
    window.scrollTo({ top: position, behavior: 'smooth' })
  }
  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading heading={headings.services} id="services-title" />
      </div>
      <div
        ref={scene}
        className={`service-scene ${staged ? 'is-staged' : ''}`}
        style={staged ? { minHeight: `${Math.max(200, services.length * 90)}vh` } : undefined}
      >
        <div className="service-viewport container">
          {staged && (
            <nav className="service-index" aria-label={ui.servicesIndex}>
              {services.map((service, index) => (
                <button
                  type="button"
                  key={service.id}
                  className={active === index ? 'is-active' : ''}
                  aria-current={active === index ? 'step' : undefined}
                  onClick={() => select(index)}
                >
                  <span>{service.number}</span>
                  <span>{service.eyebrow}</span>
                </button>
              ))}
              <div className="scene-progress">
                <div ref={progress} />
              </div>
            </nav>
          )}
          <div className="service-panels">
            {services.map((service, index) => (
              <article
                id={service.id}
                key={service.id}
                className={`service-panel accent--${service.accent} ${active === index ? 'is-active' : ''}`}
                aria-hidden={staged && active !== index ? true : undefined}
                inert={staged && active !== index ? true : undefined}
              >
                <div className="service-copy">
                  <div className="service-number" aria-hidden="true">
                    {service.number}
                    <span>/{String(services.length).padStart(2, '0')}</span>
                  </div>
                  <p className="eyebrow">{service.eyebrow}</p>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <span aria-hidden="true">↳</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="text-link">
                    {ui.contact}
                    <Arrow />
                  </a>
                </div>
                <SystemVisual kind={service.visual} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
