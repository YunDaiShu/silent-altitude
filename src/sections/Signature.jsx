import site from '../site.config';

export default function Signature() {
  const { name, nameCn, signature, contact, year } = site;

  return (
    <section className="signature" id="contact" aria-labelledby="signature-cn">
      <div className="container signature__inner" data-reveal>
        <p className="signature__script">{name}</p>
        <span className="signature__rule" aria-hidden="true" />
        <p className="signature__cn" id="signature-cn">
          {signature}
        </p>

        <div className="signature__links">
          <a href={'mailto:' + contact.email}>{contact.email}</a>
          <span className="signature__sep" aria-hidden="true" />
          <a href={contact.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <span className="signature__sep" aria-hidden="true" />
          <a href={contact.x} target="_blank" rel="noreferrer noopener">
            X
          </a>
        </div>

        <footer className="site-footer">
          <p className="site-footer__copy">
            © {year} {name} — {nameCn}
          </p>
          <p className="site-footer__note">All rights reserved · Shenzhen</p>
        </footer>
      </div>
    </section>
  );
}
