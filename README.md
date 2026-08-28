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
