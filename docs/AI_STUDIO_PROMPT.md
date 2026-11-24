# Paste into Google AI Studio after importing the repo

```text
This repository is a working website about Visakhapatnam Port. All writing, numbers and financial analysis are finished. Your job is design and motion only.

Before coding, read docs/DESIGN.md and src/content/site-data.json, then open every image in docs/storyboard (start with 00-flow-desktop.jpg and 00-flow-phone.jpg), docs/moodboard and public/media. Match the storyboard's order and content. Make it feel far more cinematic.

RULES
1. Do not write, calculate, shorten or add any text or number. Read it from site-data.json. Never edit that file or scripts/.
2. Never show sources, citations, methodology, tags, explanations, FAQs or calls to action. The page ends with the ship leaving.
3. No header, hamburger, menu, login, AI feature, API key or backend. Static Vite React. Use only packages in package.json.
4. Phone first at 390x844, then desktop. It must stay smooth on an 8 GB college laptop: one video element, no WebGL, no canvas frame sequence, no smooth-scroll library, no blur.
5. Forbidden: cards, pills, rounded corners, shadows, glass, glow, gradient text, purple, icon tiles, eyebrow labels, badges, fade-up on every section, centred paragraphs, two neighbouring sections with the same layout.
6. Use the -phone media under 768px. Keep components/Voyage.tsx working: scrolling forward and back scrubs the ship film.
7. Keep the financial tables behind "Full table". Keep the emblem once, in Welcome.

BUILD ORDER
A. Split src/Sections.tsx into src/sections/, one file each, with no visual change. Run npm test and npm run build.
B. Welcome and Port at a glance, including the handover between them.
C. Financial intelligence: pinned heading, charts that change as I scroll, bars growing year by year. On phones each chart is its own screen, not pinned.
D. SWOT, Cargo and connections (replace the still bars with a real map from world-atlas and d3-geo; arcs are country totals, so keep them schematic), Rivals.
E. People, Projects and future, Research, Fixes, Depart.
F. Connect every section to the next exactly as the "Hands over by" column says.
G. Look at every screen on phone and desktop. Remove anything that could sit on an unrelated website.

CHECK: npm test and npm run build pass; no console errors; no sideways scroll at 320, 390, 768, 1440; reduced motion shows finished screens; film scrubs both ways; no text clipped.

Work straight through. If you stop early, tell me the letter you reached. Finish by listing only what you could not do.
```

If it stops: `Continue from the last letter. Re-read docs/DESIGN.md.`

If it looks generic: `Compare each screen with docs/storyboard and docs/moodboard. Name the three weakest screens and redesign those only. Keep the words and numbers.`
