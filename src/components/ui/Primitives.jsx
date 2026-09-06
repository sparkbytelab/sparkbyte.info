/** @param {{className?: string}} props */
export function Arrow({ className = '' }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/** @param {{className?: string}} props */
export function Spark({ className = '' }) {
  return (
    <svg className={`spark ${className}`} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="m50 0 9 32 27-18-18 27 32 9-32 9 18 27-27-18-9 32-9-32-27 18 18-27L0 50l32-9-18-27 27 18Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** @param {{heading: {eyebrow:string,title:string,description:string}, id:string, className?:string}} props */
export function SectionHeading({ heading, id, className = '' }) {
  return (
    <div className={`section-heading ${className}`} data-reveal>
      <p className="eyebrow">{heading.eyebrow}</p>
      <h2 id={id}>{heading.title}</h2>
      <p className="section-description">{heading.description}</p>
    </div>
  )
}
