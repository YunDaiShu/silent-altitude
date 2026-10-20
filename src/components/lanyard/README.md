# Vendored Lanyard (react-bits, official)

## Source

| | |
| --- | --- |
| Repository | `DavidHDev/react-bits` |
| Branch | `main` |
| Files | `src/content/Components/Lanyard/Lanyard.jsx`, `src/content/Components/Lanyard/Lanyard.css` |
| Fetched via | `https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Components/Lanyard/Lanyard.jsx` (same URL pattern for the CSS) |

`Lanyard.jsx` is byte-identical to the upstream file apart from a three-line
provenance header at the top; the `import './Lanyard.css'` path is unchanged
because both files live in this directory. `Lanyard.css` is byte-identical.

## What the current official component is

Pure `three` (no `@react-three/fiber`, `drei`, `rapier` or `meshline`): the
card body is an `ExtrudeGeometry`, the strap is a procedural band, and both card
faces are painted into a `CanvasTexture` at run time. Nothing new needs to be
installed — `three` is already a dependency of the site.

## Props the site passes (`src/sections/LanyardSection.jsx`)

- `frontImage` / `backImage` / `strapImage` — `site.assets.lanyard*`
- `cardColor="#0b0b0d"` — fills the card faces before the image and tints the
  extruded edge, so the badge's bevel stays ink-black
- `strapColor="#0b0b0d"` — fill under the strap texture
- `metal="gold"` — the lanyard ring, clamp and eyelet (`#e4b965` matches the site gold)
- `finish="glossy"` — the default PVC sheen
- `interactive` (default true) — drag to swing, click to flip
- `breeze` / `intro` — set to `0` / `false` under `prefers-reduced-motion: reduce`
  (the component also forces `breeze = 0` and skips the intro itself)
- `className` / `style` — see "Layout contract" below

## Layout contract

The component's host div always carries its own `lanyard` class, which collides
with the section's `.lanyard` rule in `styles/sections.css` (padding, top
border, gradient). Inside the mount the host is therefore pinned with an inline
style (`position: absolute; inset: 0; padding: 0; border-top: none;
background: none`) plus the `.lanyard-canvas-host` rule in `sections.css`.
`.lanyard-mount` is `position: relative` and `.lanyard-frame` gives it a definite
height, so the canvas always has a box to fill.

## Swapping in real artwork

Drop replacements into `public/lanyard/` (or change the three paths in
`site.config.js -> assets`). Recommended sizes:

| File | Size | Notes |
| --- | --- | --- |
| `card-front.png` | 900 × 1260 (0.714) | The face is painted at 1024 × 1440 (0.711) with `imageFit="cover"`, so keep the same ~5:7 aspect and any crop stays under 1%. Pass `imageFit="contain"` instead of the default `cover` if you prefer letterboxing. Keep the top ~10% clear: that is where the lanyard slot, ring and clamp sit. |
| `card-back.png` | 900 × 1260 | Same. Falls back to the front image if omitted. |
| `strap.png` | 128 × 768 | **Read this before redesigning the ribbon.** The component's `paintStrap()` rotates the image 90°: the image **width** runs along the strap length (and repeats, `wrapT = Repeat`) while the image **height** runs across the band. So edge stitching belongs on the **top and bottom** edges of a portrait file, not on the left and right. The supplied placeholder is authored that way. |

The shipped placeholders are designed black/gold swatches (ink `#0b0b0d`, gold
hairlines `#c9a13f`, paper `#f4f1ea`) generated with Pillow — vertical gradient,
45° hair weave, double gold frame, ghost monogram watermark. Deliberately no
per-pixel grain: it triples the PNG weight and is invisible at on-screen badge
size, so the two faces land at ~44 KB and ~33 KB. The
generator is kept out of the site bundle at
`_vendor/lanyard/make_placeholders.py` (not part of `blog/`), so no build or
runtime dependency was added.

## Interaction and cost

- The component registers **no** `wheel` listener and never calls
  `preventDefault` on scroll gestures, so the wheel over the canvas still scrolls
  the page. `touchAction` is set to `pan-y` while `interactive` is on, which keeps
  vertical page panning on touch.
- A `ResizeObserver` on the host drives `renderer.setSize(..., false)`; the
  canvas keeps its CSS size, so resizing the column never stretches the badge.
- An `IntersectionObserver` (plus `visibilitychange`) stops the `requestAnimationFrame`
  loop when the block leaves the viewport or the tab is hidden, and the loop also
  parks itself once the simulation is calm and `breeze` is 0.
- Cleanup removes the canvas, disconnects both observers, removes every pointer
  and touch listener, cancels the frame, and disposes geometries, materials,
  textures, the environment and the renderer — safe under React StrictMode's
  double mount.
