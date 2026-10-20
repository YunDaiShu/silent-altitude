import site from '../site.config';

export default function Works() {
  const { works } = site;

  return (
    <section className="works" aria-labelledby="works-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <h2 className="section-title" id="works-title">
            作品选集
          </h2>
          <p className="eyebrow">Selected Works</p>
        </header>

        <ul className="works__list">
          {works.map((work, i) => (
            <li
              className="works__row"
              key={work.index}
              data-reveal
              style={{ '--stagger': i * 70 + 'ms' }}
            >
              <span className="works__index">{work.index}</span>
              <span className="works__title">{work.title}</span>
              <span className="works__category">{work.category}</span>
              <span className="works__year">{work.year}</span>
              <span className="works__rule" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
