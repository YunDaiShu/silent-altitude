import site from '../site.config';

export default function Quote() {
  const { quote } = site;

  return (
    <section className="quote" aria-labelledby="quote-title">
      <div className="container">
        <figure className="quote__frame" data-reveal>
          <span className="corner corner--tl" aria-hidden="true" />
          <span className="corner corner--tr" aria-hidden="true" />
          <span className="corner corner--bl" aria-hidden="true" />
          <span className="corner corner--br" aria-hidden="true" />

          <p className="eyebrow" id="quote-title">
            Aphorism · 引言
          </p>
          <blockquote className="quote__cn">{quote.cn}</blockquote>
          <span className="quote__divider" aria-hidden="true" />
          <p className="quote__en">{quote.en}</p>
          <figcaption className="quote__source">{quote.source}</figcaption>
        </figure>
      </div>
    </section>
  );
}
