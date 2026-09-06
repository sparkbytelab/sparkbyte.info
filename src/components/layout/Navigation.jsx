import { useEffect, useRef, useState } from 'react'
import { useContent } from '../../content/ContentProvider.jsx'
import { useMotion } from '../../animations/motion.jsx'
import { Arrow, Spark } from '../ui/Primitives.jsx'

export default function Navigation() {
  const { brand, navigation, ui } = useContent()
  const { enabled, toggle } = useMotion()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const dialog = useRef(/** @type {HTMLDialogElement | null} */ (null))
  const trigger = useRef(/** @type {HTMLButtonElement | null} */ (null))
  useEffect(() => {
    const sentinel = document.getElementById('top')
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting)
      if (entry.isIntersecting) setActive('')
    })
    if (sentinel) observer.observe(sentinel)
    const sections = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-12% 0px -65% 0px' },
    )
    document.querySelectorAll('main > section[id]').forEach((section) => sections.observe(section))
    const media = window.matchMedia('(min-width: 1100px)')
    const closeOnDesktop = () => {
      if (media.matches) dialog.current?.close()
    }
    media.addEventListener('change', closeOnDesktop)
    return () => {
      observer.disconnect()
      sections.disconnect()
      media.removeEventListener('change', closeOnDesktop)
    }
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])
  const close = () => dialog.current?.close()
  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner container">
          <a className="brand" href={'#top'} aria-label={`${brand.name} - ${ui.skip}`}>
            <Spark />
            <span>
              {brand.domain}
              <small>
                <i className="status-dot" />
                {brand.tagline}
              </small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label={ui.navigation}>
            {navigation.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? 'location' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="motion-toggle"
              aria-label={enabled ? ui.pause : ui.resume}
              aria-pressed={!enabled}
              onClick={toggle}
            >
              <span aria-hidden="true">{enabled ? 'Ⅱ' : '▷'}</span>
            </button>
            <a className="header-cta" href="#contact">
              {ui.contact}
              <Arrow />
            </a>
            <button
              className="menu-toggle"
              ref={trigger}
              aria-label={ui.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => {
                dialog.current?.showModal()
                dialog.current?.querySelector('button')?.focus()
                setOpen(true)
              }}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="page-progress" aria-hidden="true" />
      </header>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className="mobile-menu"
        aria-label={ui.navigation}
        onClose={() => {
          setOpen(false)
          trigger.current?.focus()
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close()
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const items = event.currentTarget.querySelectorAll('button:not([disabled]), a[href]')
          const current = Array.from(items).findIndex((item) => item === document.activeElement)
          const next = items[(current + (event.shiftKey ? -1 : 1) + items.length) % items.length]
          if (next instanceof HTMLElement) {
            event.preventDefault()
            next.focus()
          }
        }}
      >
        <div className="mobile-menu__inner">
          <div className="mobile-menu__top">
            <span className="mono">{brand.domain}</span>
            <button onClick={close} aria-label={ui.close}>
              ×
            </button>
          </div>
          <nav aria-label={ui.navigation}>
            {navigation.map((link, index) => (
              <a key={link.href} href={link.href} onClick={close}>
                <span className="mono">0{index + 1}</span>
                {link.label}
                <Arrow />
              </a>
            ))}
            <a href="#contact" onClick={close}>
              {ui.contact}
              <Arrow />
            </a>
          </nav>
        </div>
      </dialog>
    </>
  )
}
