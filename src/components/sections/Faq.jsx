import { useState } from 'react'
import { useContent } from '../../content/ContentProvider.jsx'
import { SectionHeading } from '../ui/Primitives.jsx'

export default function Faq() {
  const { headings, faq } = useContent()
  const [open, setOpen] = useState(/** @type {number | null} */ (0))
  return (
    <section className="faq section-pad container" id="faq" aria-labelledby="faq-title">
      <SectionHeading heading={headings.faq} id="faq-title" />
      <div className="faq-list">
        {faq.map((item, index) => (
          <article className={`faq-item ${open === index ? 'is-open' : ''}`} key={item.question}>
            <h3>
              <button
                id={`faq-button-${index}`}
                aria-expanded={open === index}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className="mono">0{index + 1}</span>
                {item.question}
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              id={`faq-answer-${index}`}
              className="faq-answer"
              role="region"
              aria-labelledby={`faq-button-${index}`}
              aria-hidden={open !== index}
              inert={open !== index ? true : undefined}
            >
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
