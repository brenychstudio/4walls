# Story system starter pack

This pack merges the uploaded Act 01 and Act 02 modules into a clean shell foundation.

Included:
- Act 01 preloader component
- Act 02 chapter + branching component
- Story shell
- Story state helpers
- Story config with reserved WebXR metadata
- Act 03 placeholder
- Vite + React + Tailwind v4 starter files

Recommended order:
1. Bootstrap a new Vite React TypeScript project.
2. Install `tailwindcss` and `@tailwindcss/vite`.
3. Replace/create files from this pack.
4. Run `npm run build`.
5. Run `npm run dev -- --force`.

Current architecture:
- Web-first
- state-driven story shell
- branch scene descriptors separate from layout
- presentation mode already reserved for future `webxr`

Next build step after this foundation:
- wire real type-speed / skip controls into Act 02
- add state-based audio layer
- replace Act 03 placeholder with branch video scene loader
