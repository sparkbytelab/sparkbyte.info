import { useContent } from '../../content/ContentProvider.jsx'
import { Arrow, Spark } from '../ui/Primitives.jsx'
import SignalVisual from '../visuals/SignalVisual.jsx'

export default function Hero() {
  const { hero, introduction, ui } = useContent()
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-enter">
            <i className="status-dot" />
            {hero.eyebrow}
          </p>
          <h1 className="hero-enter" id="hero-title">
            {hero.title}
            <span>{hero.titleAccent}</span>
          </h1>
          <p className="hero-description hero-enter">{hero.description}</p>
          <div className="hero-actions hero-enter">
            <a className="button button--coral" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <Arrow />
            </a>
            <a className="text-link" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-note hero-enter">
            <span aria-hidden="true">↳</span>
            {hero.note}
          </p>
        </div>
        <div className="hero-art hero-enter">
          <SignalVisual />
        </div>
        <div className="hero-bottom">
          <a href="#services" className="scroll-label">
            <span aria-hidden="true">↓</span>
            {hero.scrollLabel}
          </a>
          <span className="mono">
            <i className="status-dot" />
            {hero.statusLabel}
          </span>
          <span className="mono hero-coordinate" aria-hidden="true">
            {ui.heroCoordinate}
          </span>
        </div>
      </section>

      <section className="introduction container" id="about" aria-labelledby="intro-title">
        <p className="eyebrow" data-reveal>
          {introduction.eyebrow}
        </p>
        <div data-reveal>
          <h2 id="intro-title">{introduction.title}</h2>
          <p>{introduction.description}</p>
        </div>
        <Spark className="intro-spark" />
      </section>
    </>
  )
}
