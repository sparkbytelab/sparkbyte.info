import { useContent } from '../../content/ContentProvider.jsx'
import { Arrow, SectionHeading, Spark } from '../ui/Primitives.jsx'

export function Process() {
  const { headings, process } = useContent()
  return (
    <section className="process section-pad container" id="process" aria-labelledby="process-title">
      <SectionHeading heading={headings.process} id="process-title" />
      <div className="process-steps">
        <div className="process-line" aria-hidden="true">
          <span />
        </div>
        {process.map((step) => (
          <article className="process-step" key={step.number} data-reveal>
            <span className="process-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <span className="step-cross" aria-hidden="true">
              +
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Technology() {
  const { headings, flow, stack, ui } = useContent()
  return (
    <section className="technology section-pad" id="technology" aria-labelledby="technology-title">
      <div className="container">
        <div className="technology-heading">
          <SectionHeading heading={headings.technology} id="technology-title" />
          <div className="tech-emblem" aria-hidden="true">
            <Spark />
            <span>
              BEHIND
              <br />
              THE SCENES_
            </span>
          </div>
        </div>
        <div className="flow" data-reveal>
          <span className="mono flow-label">{ui.illustrative}</span>
          <ol>
            {flow.map((step, index) => (
              <li key={step.name}>
                <span className="flow-node">
                  <i />
                  <b>{step.name}</b>
                  <span aria-hidden="true">{index < flow.length - 1 ? '→' : '↙'}</span>
                </span>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="stack-list">
          {stack.map((item) => (
            <div key={item.name} data-reveal>
              <span className="mono">{item.category}</span>
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Audience() {
  const { headings, audience } = useContent()
  return (
    <section
      className="audience section-pad container"
      id="audience"
      aria-labelledby="audience-title"
    >
      <SectionHeading heading={headings.audience} id="audience-title" />
      <div className="audience-list">
        {audience.map((item, index) => (
          <article key={item.title} data-reveal>
            <span className="mono">0{index + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Arrow />
          </article>
        ))}
      </div>
    </section>
  )
}

export function Projects() {
  const { headings, projects, projectsEmpty, ui } = useContent()
  return (
    <section
      className="projects section-pad container"
      id="projects"
      aria-labelledby="projects-title"
    >
      <SectionHeading heading={headings.projects} id="projects-title" />
      {projects.length === 0 ? (
        <div className="projects-empty" data-reveal>
          <Spark />
          <div>
            <span className="mono">{ui.workInProgress}</span>
            <p>{projectsEmpty}</p>
          </div>
          <span className="empty-barcode" aria-hidden="true" />
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project" key={project.title} data-reveal>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width="960"
                  height="600"
                />
              ) : (
                <div className="project-placeholder" aria-hidden="true">
                  <Spark />
                </div>
              )}
              <p className="eyebrow">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.tags && (
                <ul className="project-tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              {project.href && (
                <a className="text-link" href={project.href}>
                  {ui.projectLink}
                  <Arrow />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
