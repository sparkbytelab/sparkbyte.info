import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** @param {HTMLDivElement} scope @param {boolean} enabled */
export function startMotion(scope, enabled) {
  const context = gsap.context(() => {
    gsap.to('.page-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true },
    })
    if (!enabled) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-enter', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.18,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        if (!(element instanceof HTMLElement)) return
        gsap.from(element, {
          opacity: 0,
          y: 26,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        })
      })
      if (scope.querySelector('.process-line span'))
        gsap.fromTo(
          '.process-line span',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 85%',
              end: 'bottom 35%',
              scrub: 0.4,
            },
          },
        )
    })
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.workstation', {
        y: 45,
        rotation: -2,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.hero-grid', {
        y: 80,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
    })
  }, scope)
  return () => context.revert()
}
