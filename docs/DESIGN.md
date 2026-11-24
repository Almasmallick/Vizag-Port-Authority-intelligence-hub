# Design

The skeleton already works. `docs/storyboard/` shows every screen of it on desktop and phone. Keep the content and order. Raise the art direction and motion.

## Idea
One ship comes in at sunrise, the port opens up, the ship leaves. Photographs carry the mood. Numbers carry the proof. Few words.

## Order and connections
See `storyboard/00-flow-desktop.jpg` and `00-flow-phone.jpg`.

| # | Section | Screen | Motion on scroll | Hands over by |
|---|---|---|---|---|
| 1 | Welcome | Ship film, emblem, title | Scrub `voyage.mp4`; title slides off behind the ship | Film's last frame zooms into the harbour photo |
| 2 | Port at a glance | Harbour photo, six numbers | Numbers count once, one after another | Photo pushes down to the berth |
| 3 | Understand | Berth photo, timeline, infrastructure, operations | Timeline line draws with scroll | Dark wipes up to paper |
| 4 | Financial intelligence | Nine panels | Heading pins left; charts swap on the right, bars growing year by year | The last red bar grows until it fills the screen |
| 5 | SWOT | Red | Four full screens, one letter each | Red shrinks to a point on the night globe |
| 6 | Cargo and connections | Globe photo, ranked cargo, From / To | Globe scales 1.15 to 1; ranked bars extend | Globe slides up behind the table |
| 7 | Rivals | Paper | Rows extend; Visakhapatnam stays red | Page dims to night |
| 8 | People and hidden indicators | Night photo | Three sentences pass, then six numbers | Night cross-dissolves to hydrogen dawn |
| 9 | Projects and future | Hydrogen photo, status lists, forecast, sliders | Photo holds; lists scroll over it; forecast lines draw | Paper rises |
| 10 | Research | Years | Years step | none |
| 11 | Fixes and jobs | Paper | none | Ship returns |
| 12 | Depart | Last frame, one line | Slow scale 1.08 to 1 | End |

## Content rules
- All copy and numbers come from `src/content/site-data.json`. `copy` has each title and line. `readings` has the one sentence beside each finance chart. `analysis` has every calculation, already done. Do not calculate, round, rewrite or add.
- Maximum 12 words per heading, 22 per sentence beside a chart. No paragraph longer than two lines on desktop.
- No source list, citation, methodology, disclaimer block, evidence tag, FAQ, call to action or "about this project". The only notices are the ones already in Welcome, What if and the footer.
- `sources` in the data is private bookkeeping. Never render it.

## Look
- Grounds: ink `#081A24`, paper `#F3F1EC`, primer red `#A2371F`. Accent amber `#F59A3C` from the sunrise. Nothing else except tints in `styles.css`.
- Archivo variable only. Titles 118% wide, tight, up to 132px. Numbers are the biggest thing after titles.
- Full-bleed photographs, square corners, hairlines. No cards, pills, shadows, glass, glow, icons, gradients on text, grids of boxes, eyebrow labels or badges.
- No header, hamburger, menu or buttons that jump. The thin amber line shows progress.
- The emblem appears once, in Welcome, unmodified.

## Media
`public/media/`. `-phone` files are portrait crops for screens under 768px; always use them there.

| File | Use |
|---|---|
| `voyage.mp4`, `voyage-phone.mp4` | Welcome scrub. 6.6s, every 4th frame a keyframe, silent |
| `voyage` | Poster |
| `harbour` glance, `berth` understand, `world` explorer, `night` pulse, `hydrogen` pipeline, `depart` end | Section photos |
| `hero` | Spare |

Photos are illustrations. Never caption one as a real place or event. Anything the owner adds to `public/reference-assets/` may be used if it has no text, watermark or brand on it.

## Phone first, 8 GB laptop second
- Build at 390x844, then widen. Thumb-size controls. No hover-only information. Pin at most one screen at a time on phones.
- One video element on the page. No canvas frame sequences, no WebGL, no Three.js, no smooth-scroll library, no blur filters, no `will-change` left on.
- Animate transform, opacity and clip-path only. Pause work offscreen. At most one running timeline.
- First load under 1 MB on phone before the film; film loads after the poster paints. JS under 130 KB gzip. Target 50+ fps on a 4-core laptop with 4x CPU slowdown off and 8 GB RAM; heap under 120 MB.
- Reduced motion or data saver: poster instead of film, no pins, finished states.

## Motion tools
GSAP ScrollTrigger only (installed). `scrub: 0.4`, `ease: 'none'` on scrubbed work. Register once, use `gsap.matchMedia()` with separate phone and desktop timelines, revert on unmount. Text is readable without JavaScript motion; never start at opacity 0.

## Mood board
`docs/moodboard/`: screenshots for feel only. Do not copy layouts, type, words or images.

| File | Take this |
|---|---|
| `waabi` | Full photo, two-line title at the bottom, then calm |
| `relats` | Photo tiles sliding around one held image |
| `turno` | Dark vehicle hero, hard colour block after it |
| `lando` | Huge type crossing imagery; confident empty space |
| `hebbia` | Finance feels quiet and dark; numbers under pictures |
| `shopify-editions` | Title sitting between background and subject |

The owner also likes: one sticky scene, a film scrubbed by scroll, and giant letters passing behind the vehicle. Use that in Welcome: "PORT" in paper colour, very large, sliding behind the ship only if the ship can truly mask it; otherwise leave it out.
