import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
export { gsap, ScrollTrigger, useGSAP }

/** @param {import('react').RefObject<HTMLDivElement | null>} scope @param {boolean} enabled @param {boolean} [contactPage] */
export function useScrollScenes(scope, enabled, contactPage = false) {
  useGSAP(
    () => {
      gsap.to('.page-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
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
        if (!contactPage)
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
        if (contactPage) return
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
      return () => media.revert()
    },
    { scope, dependencies: [enabled, contactPage], revertOnUpdate: true },
  )
}
