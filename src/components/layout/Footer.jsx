import { useContent } from '../../content/ContentProvider.jsx'
import { Spark } from '../ui/Primitives.jsx'

export default function Footer() {
  const { brand, footer, company, contact, ui } = useContent()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-identity">
            <a className="footer-brand" href={'#top'}>
              <Spark />
              {brand.name}
            </a>
            <p>{footer.description}</p>
          </div>
          <section className="footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">Kontakt</h2>
            <address>
              {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a>
              )}
            </address>
            <a className="footer-contact-link" href="#contact">
              {ui.contact}
              <span aria-hidden="true">↗</span>
            </a>
          </section>
          <nav aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">Na skróty</h2>
            <ul>
              {footer.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <section className="footer-company" aria-labelledby="company-title">
            <h2 id="company-title">{ui.companyLabel}</h2>
            <p>{company.name}</p>
            <address>
              {company.address}
              <br />
              {company.postalCode} {company.city}
            </address>
            <dl>
              <div>
                <dt>NIP</dt>
                <dd>{company.nip}</dd>
              </div>
              <div>
                <dt>REGON</dt>
                <dd>{company.regon}</dd>
              </div>
            </dl>
          </section>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {brand.name}. Wszelkie prawa zastrzeżone.
          </span>
          {footer.legalLinks.length > 0 && (
            <nav aria-label="Informacje prawne">
              {footer.legalLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
