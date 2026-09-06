import { useEffect } from 'react'
import { useContent } from '../../content/ContentProvider.jsx'

export default function Seo() {
  const { seo, brand, contact, company } = useContent()
  useEffect(() => {
    const title = seo.title
    const description = seo.description
    const url = 'https://sparkbyte.info/'
    document.title = title
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    /** @param {string} key @param {string} value @param {'name'|'property'} [attribute] */
    function meta(key, value, attribute = 'name') {
      let node = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (!node) {
        node = document.createElement('meta')
        node.setAttribute(attribute, key)
        document.head.append(node)
      }
      node.setAttribute('content', value)
    }
    meta('description', description)
    meta('og:title', title, 'property')
    meta('og:description', description, 'property')
    meta('og:url', url, 'property')
    meta('og:site_name', brand.name, 'property')
    meta('twitter:title', title)
    meta('twitter:description', description)
    meta('twitter:card', seo.ogImage ? 'summary_large_image' : 'summary')
    if (seo.ogImage) {
      const url = new URL(seo.ogImage, 'https://sparkbyte.info/').href
      meta('og:image', url, 'property')
      meta('twitter:image', url)
    } else
      document
        .querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
        .forEach((element) => element.remove())
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://sparkbyte.info/#organization',
      name: brand.name,
      legalName: company.name,
      taxID: company.nip,
      identifier: { '@type': 'PropertyValue', propertyID: 'REGON', value: company.regon },
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address,
        postalCode: company.postalCode,
        addressLocality: company.city,
        addressCountry: 'PL',
      },
      url: 'https://sparkbyte.info/',
      description: seo.description,
      ...(contact.email ? { email: contact.email } : {}),
      ...(contact.phone ? { telephone: contact.phone } : {}),
    })
    document.head.append(script)
    return () => script.remove()
  }, [seo, brand, contact, company])
  return null
}
