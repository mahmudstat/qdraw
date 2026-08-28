# Qdraw Extension For Quarto

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17087728.svg)](https://doi.org/10.5281/zenodo.17087728)


Allows drawing and erasing in a revealjs presentation rendered via quarto.

## Demo

[Get a demo here](https://www.thinkermahmud.com/qdraw) and its source code [here](https://github.com/mahmudstat/qdraw/blob/main/example.qmd)

This tool is practically used in my statistics and probability lecture slides on Stat Mania. [See them in action](https://www.statmania.info/lectures.html)

## Video Demonstration

[Watch a video demo here](https://www.thinkermahmud.com/qdraw/index.html#/video-demo)

## Installing

```bash
quarto add mahmudstat/qdraw
```

This will install the extension under the `_extensions` subdirectory.
If you're using version control, you will want to check in this directory.

## Updating

```bash
quarto update mahmudstat/qdraw
```

This pulls the latest version of the extension from this repo and overwrites your local `_extensions/qdraw` folder. See the [News slide](https://www.thinkermahmud.com/qdraw/index.html#/news) in the demo for what's changed in each version.

## Using

- Add your contents to `qmd` file and render.
- Click on the draw icon <i class="fas fa-pen-nib"></i> to activate the drawing tools. Click the icon again to hide the tools.
- Use the self-explanatory tools as per your requirements.
- See the video linked above and the slide itself to experiment with.

### Toolbar

| Icon | Tool | What it does |
|---|---|---|
| `fa-pen-nib` | Toggle Drawing | Show or hide the whole toolbar |
| `fa-marker` | Pen | Switch to freehand pen drawing |
| `fa-palette` | Pen & Shape Color | Choose the color used by the pen and by shapes |
| *(slider)* | Pen Size | Adjust pen stroke thickness |
| `fa-undo` | Undo | Undo the last stroke, shape, or erase on the current page |
| `fa-eraser` | Eraser | Open eraser options: freehand erase, select-area erase, delete all |
| *(slider)* | Eraser Size | Adjust the eraser's diameter |
| `fa-shapes` | Shapes | Open shape options: line, rectangle, triangle, ellipse, circle, solid fill |
| `fa-fill-drip` | Background | Open background options: choose color, reset |
| `fa-clone` | Pages | Open page navigation: previous, next, add page |
| `fa-download` | Download | Save the current page as a PNG |
| `fa-circle-info` | About | Show a popover linking to the qdraw site |
| `fa-right-left` | Move Controls | Move the toolbar to the opposite screen edge (only shown while drawing tools are active) |

### Eraser options

| Icon | Option | What it does |
|---|---|---|
| `fa-eraser` | Eraser | Erase by dragging over strokes |
| `fa-vector-square` | Select & Erase | Drag a rectangle to erase everything inside it |
| `fa-trash` | Delete All | Clear the entire current page |

### Shape options

| Icon | Option | What it does |
|---|---|---|
| `fa-minus` | Line | Draw a straight line |
| `fa-square` | Rectangle | Drag corner to corner |
| `fa-play` (rotated) | Triangle | Drag corner to corner |
| `fa-circle` (scaled) | Ellipse | Drag corner to corner |
| `fa-circle` | Circle | Drag from the center outward |
| `fa-fill` | Solid Fill | Toggle filled vs. outline shapes |

### Background & page options

| Icon | Option | What it does |
|---|---|---|
| `fa-fill-drip` | Choose Color | Pick a background color for the canvas |
| `fa-rotate-left` | Reset | Reset the background to default (transparent) |
| `fa-chevron-left` | Previous Page | Go to the previous drawing page |
| `1/2` | Page indicator | Shows current page / total pages |
| `fa-chevron-right` | Next Page | Go to the next drawing page |
| `fa-plus` | Add Page | Create a new blank page and switch to it |

## Current Version

v1.5.2 - see the [News slide](https://www.thinkermahmud.com/qdraw/index.html#/news) in the demo, which always shows the two most recent versions.

## Older versions

### Version 1.5.0

- Added a solid-fill toggle to the shape tool for filled rectangles, triangles, ellipses, and circles
- Merged the background color and reset-background buttons into one background tool with a popover
- The move-controls button is now only shown while the drawing tools are toggled on

### Version 1.4.0

- Merged the eraser and delete-all buttons into one eraser tool with a popover: freehand eraser, select-area erase, and delete all
- Changed the pen color icon to a palette, since it now sets both pen and shape color

### Version 1.3.0

- Added a shape tool with line, rectangle, triangle, ellipse, and circle options

### Version 1.2.0

- Added a button to move the toolbar between the left and right edges of the screen
- Added support for multiple drawing pages, with buttons to add a page and move between pages

### Version 1.1.0

- Fixed drawing on mobile landing away from where the pen touches the screen
- Added an about icon (bottom of the toolbar) linking to the qdraw site
- Default pen color changed to black
