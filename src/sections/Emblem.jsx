export default function Emblem() {
  return (
    <section className="emblem" aria-labelledby="emblem-title">
      <div className="container emblem__inner" data-reveal>
        <p className="eyebrow">The Mark</p>

        <div className="emblem__wrap">
          <svg
            className="emblem__svg"
            viewBox="0 0 260 260"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="emblem-svg-title"
          >
            <title id="emblem-svg-title">鲲鹏线描圆形会标</title>
            <defs>
              <path
                id="emblem-orbit"
                d="M130,130 m-101,0 a101,101 0 1,1 202,0 a101,101 0 1,1 -202,0"
                fill="none"
              />
            </defs>

            <circle className="emblem__ring" cx="130" cy="130" r="127" />
            <circle className="emblem__ring emblem__ring--dash" cx="130" cy="130" r="115" />
            <circle className="emblem__disc" cx="130" cy="118" r="34" />

            <g className="emblem__orbit">
              <text className="emblem__orbit-text">
                <textPath href="#emblem-orbit" startOffset="0">
                  SILENT ALTITUDE · KUN PENG · STUDIO OF LIN ZHAOYU · THE QUIET ASCENT ·
                </textPath>
              </text>
            </g>

            <g className="emblem__mark">
              <path className="emblem__wing" d="M130 150 C 112 126 86 102 56 84" />
              <path className="emblem__wing" d="M130 160 C 106 140 78 120 46 108" />
              <path className="emblem__wing" d="M130 170 C 108 156 84 142 54 134" />
              <path className="emblem__wing" d="M130 150 C 148 126 174 102 204 84" />
              <path className="emblem__wing" d="M130 160 C 154 140 182 120 214 108" />
              <path className="emblem__wing" d="M130 170 C 152 156 176 142 206 134" />
              <path
                className="emblem__body"
                d="M130 62 C 137 96 137 152 130 186 C 123 152 123 96 130 62 Z"
              />
              <circle className="emblem__node" cx="130" cy="60" r="3.4" />
              <path className="emblem__crest" d="M118 190 C 126 198 134 198 142 190" />
            </g>
          </svg>
        </div>

        <h2 className="emblem__title" id="emblem-title">
          鲲鹏
        </h2>
        <p className="emblem__sub">The Quiet Ascent</p>
      </div>
    </section>
  );
}
