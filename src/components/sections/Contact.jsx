import { useContent } from '../../content/ContentProvider.jsx'
import { Arrow, Spark } from '../ui/Primitives.jsx'

export default function Contact() {
  const { contact, ui } = useContent()
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.description}</p>
          <div className="contact-links">
            {contact.email && (
              <a className="contact-email" href={`mailto:${contact.email}`}>
                {contact.email}
                <Arrow />
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a>
            )}
          </div>
        </div>
        <div className="contact-direct" data-reveal>
          <Spark />
          {contact.email && (
            <a className="button button--dark" href={`mailto:${contact.email}`}>
              {contact.directCta}
              <Arrow />
            </a>
          )}
        </div>
      </div>
      <div className="contact-wordmark" aria-hidden="true">
        {ui.contactWordmark}
        <span>↗</span>
      </div>
    </section>
  )
}
