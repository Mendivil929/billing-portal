@AGENTS.md

# UI rules

- Every screen must match the TECMA design on mobile as well as desktop, down to each visual detail: spacing, margins, radii, colors, typography, and interactive states. Treat mobile as a first-class design, not a squeezed desktop.
- Verify every UI change at phone width (~360–400px) and at desktop width before calling it done.
- Single-purpose screens (login, change password, the module hub) must fit the viewport without scrolling, on mobile and desktop, including browsers zoomed to 125%. Use the `short:` variant (max-height 820px) in `globals.css` to compact them on short viewports.
- Use the brand palette tokens (`brand-*`, `accent-*`) from `globals.css`, never generic Tailwind hues like `teal-*` or `blue-*`.
