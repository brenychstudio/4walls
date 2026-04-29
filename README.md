# 4WALLS

Interactive cinematic web narrative with branching routes, video-based progression, and an optional XR threshold layer.

## Overview

4WALLS is an authored browser-based story project built as a dark, atmospheric terminal-cinematic experience.

The project combines:

- branching narrative structure
- fullscreen video route playback
- consequence scenes for each branch
- an optional XR threshold scene for the door route
- a restrained interface language inspired by terminal systems, signal logic, and immersive storytelling

The current implementation is focused on preserving the core story flow first, while gradually layering in bilingual UI, XR continuity, and visual polish.

## Current status

Project state: active development

Currently working:

- Act 03 branch playback flow
- Act 04 continuation structure
- door branch continuation scene
- optional XR route for the door branch
- bilingual UI foundation (`uk` / `en`)
- deployed browser version

Still evolving:

- full bilingual story text
- media optimization for first-load playback
- OG / social meta polish
- further XR refinement
- final premium finish across all branches

## Core experience structure

Current project logic:

- user enters the project through a terminal-like preloader
- story progresses into branch selection
- each branch plays as a fullscreen video fragment
- after playback, progression continues into the related next scene
- for the **door** route, XR is available as an **optional threshold layer**, not a forced continuation

## Main routes / modes

### Web narrative

The main browser experience contains the primary story flow and branch structure.

### XR threshold

The door route can optionally open an XR threshold scene:

`/xr/door`

This XR scene is treated as a supplementary authored spatial layer, not a replacement for the main 2D story flow.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- browser video playback via `public/`
- custom XR layer integrated into the same project
- local i18n foundation (`uk` / `en`)

## Project goals

This repository serves several purposes at once:

- build a strong interactive narrative project
- explore the overlap between cinematic web storytelling and immersive spatial interaction
- stress-test reusable XR ideas that can later be extracted into a more universal engine baseline
- preserve a premium authored feel rather than turning the project into a generic app-like interface

## Repository structure

```text
src/
  app/
    acts/
    transitions/
    ...
  components/
  i18n/
  pages/
  xr/
  xr-core/
  xr-experiences/

public/
  fourwalls/
    act03/
    act04/
    audio/
```

## Local development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Notes

- Media-heavy scenes may behave differently on first cold load in production than in local playback.
- The XR path is intentionally optional and currently attached only to the door branch.
- The project is still under active iteration, so some text, media, and polish passes are not final yet.

## Positioning

4WALLS is best understood as:

- interactive narrative prototype
- immersive concept site
- cinematic story experiment
- XR-augmented web experience

rather than a conventional website or utility product.

## License

Private / internal development repository unless explicitly released otherwise.
