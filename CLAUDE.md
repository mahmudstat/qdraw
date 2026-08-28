# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Qdraw is a Quarto revealjs plugin that adds a freehand drawing/annotation layer on top of presentation slides (pen, eraser, undo, background color, PNG export). It is a small, self-contained Quarto extension — not an app with a build system, package manager, or test suite.

## Repository layout

- `_extensions/qdraw/` — the actual extension, and the only part consumed by other Quarto projects when they `quarto add mahmudstat/qdraw`.
  - `_extension.yml` — Quarto extension manifest. Declares the `RevealQdraw` revealjs plugin and lists which JS/CSS files it contributes.
  - `qdraw.js` — the entire plugin. A single `window.RevealQdraw()` factory returning a reveal.js plugin object (`{ id, init(deck) }`). `init` injects the controls toolbar, cursor, and `<canvas>` into `document.body` via template strings, then wires up pointer events for drawing/erasing directly on that canvas (no framework, no build step, no external JS deps).
  - `qdraw.css` — styling for the injected toolbar/canvas/cursor elements.
  - `fa.all.min.css` — bundled Font Awesome, used for the toolbar icons.
- `example.qmd` — the demo/source-of-truth usage example, rendered to `index.html` (the published demo page/site). When editing `example.qmd`, `index.html` is the corresponding build artifact — don't hand-edit `index.html` for content that originates in the `.qmd`.
- `icons.png`, `qdraw-in-use.mp4` — assets referenced by the README and the demo slides.

## Working on the plugin

- Everything lives in the four files under `_extensions/qdraw/`. There's no bundler/transpiler — edits to `qdraw.js`/`qdraw.css` take effect directly on next Quarto render.
- The plugin operates on global DOM state (single `<canvas>` covering the viewport, resized on `window.resize`); there's no per-slide canvas isolation — drawings persist as one overlay across the whole deck.
- Drawing state (`drawing`, `erasing`, `controlsEnabled`, `history` array of `ImageData` snapshots for undo) lives in closures inside `init`, not on any external state object.
- Version/author/website metadata for the extension itself is declared in `_extension.yml` — bump `version` there when making a release-worthy change.

## Rendering/testing changes

There's no automated test suite. To verify changes, render the example with Quarto (requires Quarto CLI installed, `quarto-required: ">=1.5.0"`):

```bash
quarto render example.qmd
```

This regenerates `index.html` per the `output-file: index.html` setting in `example.qmd`'s frontmatter. Open the rendered file in a browser and manually exercise the toolbar (pen, eraser, undo, background color, download) to confirm behavior, since there is no headless/unit test coverage of the canvas interactions.

## Must do

Whenever a new significant feature is added, it should be reflected in example.qmd News and the extension version be updated accordingly and so is Readme.md. In News, only show the last two versions, archiving the others in readme (# Older versions)
