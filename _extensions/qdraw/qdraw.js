window.RevealQdraw = function () {
  return {
    id: "RevealQdraw",
    init: function (deck) {
      // Create and inject HTML elements for the drawing canvas and controls
      const controlsWrapper = document.createElement('div');
      controlsWrapper.id = 'controlsWrapper';
      controlsWrapper.innerHTML = `
        <button id="toggleControls" title="Toggle Drawing Controls" style="font-size: 1.9em; color: red;">
          <i class="fas fa-pen-nib"></i>
        </button>
        <div id="controls">
          <label style="font-weight: bold; color: #8f246b;" id="penTool" title="Pen Tool"><i class="fas fa-marker"></i></label>
          <input type="color" id="penColor" value="#000000" style="display: none;" />
          <label for="penColor" id="penColorLabel" title="Pen Color">
            <i class="fas fa-eye-dropper"></i>
          </label>
          <input type="range" id="penSize" min="1" max="20" value="4" />
          <label style="font-weight: bold; color: #408000;" id="undo" title="Undo drawing"><i class="fas fa-undo"></i></label>
          <label style="font-weight: bold; color: red;" id="eraserTool" title="Eraser Tool"><i class="fas fa-eraser"></i></label>
          <input type="range" id="eraserSize" min="20" max="250" value="60" />
          <label style="font-weight: bold; color: #8f246b;" id="shapeTool" title="Shape Tool"><i class="fas fa-shapes"></i></label>
          <label style="font-weight: bold; color: red;" id="clear" type="button" title="Delete All drawing"><i class="fas fa-trash"></i></label>
          <label style="font-weight: bold; color: green;" for="bgColor" id="bgColorLabel" title="Canvas Background">
            <i class="fas fa-fill-drip"></i>
          </label>
          <input type="color" id="bgColor" style="display: none;" />
          <label style="font-weight: bold; color: red;" id="resetBg" title="Reset background color"><i class="fas fa-fill-drip"></i></label>
          <label style="font-weight: bold; color: #408000;" id="pagesTool" title="Pages"><i class="fas fa-clone"></i></label>
          <label style="font-weight: bold; color: green;" id="downloadCanvas" title="Download Drawing" class="icon-button">
            <i class="fas fa-download"></i>
          </label>
          <label style="font-weight: bold; color: #3366cc;" id="about" title="About this tool">
            <i class="fas fa-circle-info"></i>
          </label>
        </div>
        <div id="aboutPopover">
          Developed by Abdullah Al Mahmud<br>
          <a href="https://www.thinkermahmud.com/qdraw" target="_blank" rel="noopener">Learn more</a>
        </div>
        <div id="shapeOptions">
          <label class="shapeOption active" data-shape="line" title="Line"><i class="fas fa-minus"></i></label>
          <label class="shapeOption" data-shape="rect" title="Rectangle"><i class="fas fa-square"></i></label>
          <label class="shapeOption" data-shape="triangle" title="Triangle"><i class="fas fa-play"></i></label>
          <label class="shapeOption" data-shape="ellipse" title="Ellipse (drag corner to corner)"><i class="fas fa-circle" id="ellipseIcon"></i></label>
          <label class="shapeOption" data-shape="circle" title="Circle (drag from center)"><i class="fas fa-circle"></i></label>
        </div>
        <div id="pageOptions">
          <label id="prevPage" title="Previous page"><i class="fas fa-chevron-left"></i></label>
          <span id="pageLabel" title="Current page">1/1</span>
          <label id="nextPage" title="Next page"><i class="fas fa-chevron-right"></i></label>
          <label id="addPage" title="Add new page"><i class="fas fa-plus"></i></label>
        </div>
      `;
      document.body.appendChild(controlsWrapper);

      // Sits on the opposite edge from the toolbar so it's reachable
      // whichever side the toolbar currently sits on (helpful on wide screens).
      const moveControls = document.createElement('button');
      moveControls.id = 'moveControls';
      moveControls.title = 'Move controls to the other side';
      moveControls.innerHTML = '<i class="fas fa-right-left"></i>';
      document.body.appendChild(moveControls);

      const eraserCursor = document.createElement('div');
      eraserCursor.id = 'eraserCursor';
      document.body.appendChild(eraserCursor);

      const canvas = document.createElement('canvas');
      canvas.id = 'drawingCanvas';
      document.body.appendChild(canvas);

      // Get the injected elements
      const ctx = canvas.getContext('2d');
      const bgColorPicker = document.getElementById('bgColor');
      const resetBgBtn = document.getElementById('resetBg');
      const penColorInput = document.getElementById('penColor');
      const penIcon = document.querySelector('#penColorLabel i');
      const penSize = document.getElementById('penSize');
      const eraserSize = document.getElementById('eraserSize');
      const penTool = document.getElementById('penTool');
      const undo = document.getElementById('undo');
      const eraserTool = document.getElementById('eraserTool');
      const shapeTool = document.getElementById('shapeTool');
      const shapeOptions = document.getElementById('shapeOptions');
      const shapeOptionEls = Array.from(document.querySelectorAll('.shapeOption'));
      const clearBtn = document.getElementById('clear');
      const pagesTool = document.getElementById('pagesTool');
      const pageOptions = document.getElementById('pageOptions');
      const prevPageBtn = document.getElementById('prevPage');
      const nextPageBtn = document.getElementById('nextPage');
      const addPageBtn = document.getElementById('addPage');
      const pageLabel = document.getElementById('pageLabel');
      const toggleControls = document.getElementById('toggleControls');
      const controls = document.getElementById('controls');
      const downloadButton = document.getElementById('downloadCanvas');
      const about = document.getElementById('about');
      const aboutPopover = document.getElementById('aboutPopover');

      // Set initial color
      penIcon.style.color = penColorInput.value;

      // Variables for drawing state
      let drawing = false;
      let mode = 'pen'; // 'pen' | 'eraser' | 'shape'
      let shapeType = 'line'; // 'line' | 'rect' | 'triangle' | 'circle'
      let shapeBase = null;
      let controlsEnabled = false;
      let lastX = 0, lastY = 0;
      const defaultBgColor = "";

      // Each page keeps its own saved snapshot (as a data URL, restored via drawImage
      // so it survives canvas resizes) and its own undo stack. `history` always points
      // at the current page's stack.
      let currentPage = 0;
      const pages = [null];
      const pageHistories = [[]];
      let history = pageHistories[currentPage];

      function updatePageLabel() {
        pageLabel.textContent = (currentPage + 1) + '/' + pages.length;
      }

      function loadPage(index) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const src = pages[index];
        if (src) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = src;
        }
      }

      function goToPage(index) {
        if (index < 0 || index >= pages.length || index === currentPage) return;
        pages[currentPage] = canvas.toDataURL();
        pageHistories[currentPage] = history;
        currentPage = index;
        history = pageHistories[currentPage];
        loadPage(currentPage);
        updatePageLabel();
      }

      // --- Functions ---
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function pos(e) {
        if (e.touches) e = e.touches[0];
        // Map viewport coordinates to canvas pixel coordinates via the canvas's
        // actual rendered rect, rather than assuming clientX/Y == canvas pixels.
        // On mobile, the canvas's CSS box (100vw/100vh) and its backing store
        // (sized from window.innerWidth/innerHeight) can drift apart (e.g. when
        // the browser's address bar shows/hides), which otherwise makes strokes
        // land away from the pointer.
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
      }

      function updateEraser(x, y) {
        const size = Number(eraserSize.value);
        eraserCursor.style.width = size + 'px';
        eraserCursor.style.height = size + 'px';
        eraserCursor.style.left = x - size / 2 + 'px';
        eraserCursor.style.top = y - size / 2 + 'px';
      }

      function start(e) {
        if (!controlsEnabled) return;
        drawing = true;
        // Store a snapshot before starting to draw for undo functionality
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        const p = pos(e);
        lastX = p.x;
        lastY = p.y;
        if (mode === 'shape') {
          // Reuse the undo snapshot as the base to redraw the live preview on
          // top of while dragging, without committing intermediate frames.
          shapeBase = history[history.length - 1];
        } else {
          draw(e);
        }
      }

      function end() {
        drawing = false;
        ctx.globalCompositeOperation = 'source-over';
      }

      function drawShape(x0, y0, x1, y1) {
        ctx.lineWidth = Number(penSize.value);
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColorInput.value;
        ctx.beginPath();
        if (shapeType === 'line') {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
        } else if (shapeType === 'rect') {
          ctx.rect(x0, y0, x1 - x0, y1 - y0);
        } else if (shapeType === 'ellipse') {
          const rx = Math.abs(x1 - x0) / 2;
          const ry = Math.abs(y1 - y0) / 2;
          ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, rx, ry, 0, 0, Math.PI * 2);
        } else if (shapeType === 'circle') {
          // Drag from center outward, unlike the other shapes' corner-to-corner
          // drag, so the radius stays equal in both directions - a true circle.
          const r = Math.hypot(x1 - x0, y1 - y0);
          ctx.arc(x0, y0, r, 0, Math.PI * 2);
        } else if (shapeType === 'triangle') {
          const midX = (x0 + x1) / 2;
          ctx.moveTo(midX, y0);
          ctx.lineTo(x0, y1);
          ctx.lineTo(x1, y1);
          ctx.closePath();
        }
        ctx.stroke();
      }

      function draw(e) {
        if (!drawing) return;
        const p = pos(e);

        if (mode === 'shape') {
          // Redraw from the pre-shape snapshot each move so the preview
          // doesn't smear as the pointer moves.
          ctx.putImageData(shapeBase, 0, 0);
          drawShape(lastX, lastY, p.x, p.y);
          return;
        }

        const erasing = mode === 'eraser';
        const size = erasing ? Number(eraserSize.value) : Number(penSize.value);
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
        ctx.strokeStyle = penColorInput.value;
        if (erasing) updateEraser(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        lastX = p.x;
        lastY = p.y;
      }

      // --- Event Listeners ---
      window.addEventListener('resize', resize);
      resize(); // Initial resize

      canvas.addEventListener('pointerdown', start);
      canvas.addEventListener('pointermove', draw);
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointercancel', end);

      canvas.addEventListener('pointerdown', function(e) {
        this.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener('pointerup', function(e) {
        this.releasePointerCapture(e.pointerId);
      });

      penColorInput.addEventListener('input', () => {
        penIcon.style.color = penColorInput.value;
      });

      penTool.onclick = () => {
        mode = 'pen';
        eraserCursor.style.display = 'none';
        canvas.style.pointerEvents = 'auto';
      };

      eraserTool.onclick = () => {
        mode = 'eraser';
        eraserCursor.style.display = 'block';
        canvas.style.pointerEvents = 'auto';
      };

      function positionPopover(popoverEl, anchorEl) {
        // Popovers live outside #controls (so they don't widen the toolbar
        // column) and are positioned against their anchor icon's actual
        // on-screen spot, since it isn't always the last item in the list.
        const wrapperRect = controlsWrapper.getBoundingClientRect();
        const anchorRect = anchorEl.getBoundingClientRect();
        popoverEl.style.top = (anchorRect.top - wrapperRect.top) + 'px';
        if (controlsWrapper.classList.contains('right')) {
          popoverEl.style.left = 'auto';
          popoverEl.style.right = '50px';
        } else {
          popoverEl.style.left = '50px';
          popoverEl.style.right = 'auto';
        }
      }

      shapeTool.onclick = () => {
        mode = 'shape';
        eraserCursor.style.display = 'none';
        canvas.style.pointerEvents = 'auto';
        pageOptions.classList.remove('show');
        positionPopover(shapeOptions, shapeTool);
        shapeOptions.classList.toggle('show');
      };

      pagesTool.onclick = () => {
        shapeOptions.classList.remove('show');
        positionPopover(pageOptions, pagesTool);
        pageOptions.classList.toggle('show');
      };

      shapeOptionEls.forEach((el) => {
        el.addEventListener('click', () => {
          mode = 'shape';
          shapeType = el.dataset.shape;
          eraserCursor.style.display = 'none';
          canvas.style.pointerEvents = 'auto';
          shapeOptionEls.forEach((opt) => opt.classList.remove('active'));
          el.classList.add('active');
        });
      });

      undo.onclick = () => {
        if (history.length) {
          ctx.putImageData(history.pop(), 0, 0);
        }
      };

      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history.length = 0;
      });

      bgColorPicker.addEventListener('input', () => {
        canvas.style.backgroundColor = bgColorPicker.value;
      });

      resetBgBtn.addEventListener('click', () => {
        canvas.style.backgroundColor = defaultBgColor;
        bgColorPicker.value = "#ffffff";
      });

      prevPageBtn.addEventListener('click', () => {
        goToPage(currentPage - 1);
      });

      nextPageBtn.addEventListener('click', () => {
        goToPage(currentPage + 1);
      });

      addPageBtn.addEventListener('click', () => {
        pages[currentPage] = canvas.toDataURL();
        pageHistories[currentPage] = history;
        pages.push(null);
        pageHistories.push([]);
        currentPage = pages.length - 1;
        history = pageHistories[currentPage];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePageLabel();
      });

      toggleControls.onclick = () => {
        const isVisible = controls.style.display === 'flex';
        controls.style.display = isVisible ? 'none' : 'flex';
        controlsEnabled = !isVisible;
        canvas.style.pointerEvents = controlsEnabled ? 'auto' : 'none';
        if (mode === 'eraser' && controlsEnabled) {
          eraserCursor.style.display = 'block';
        } else {
          eraserCursor.style.display = 'none';
        }
        aboutPopover.classList.remove('show');
        shapeOptions.classList.remove('show');
        pageOptions.classList.remove('show');
      };

      about.onclick = (e) => {
        e.stopPropagation();
        aboutPopover.classList.toggle('show');
      };

      document.addEventListener('click', (e) => {
        if (aboutPopover.classList.contains('show') && !aboutPopover.contains(e.target) && e.target !== about) {
          aboutPopover.classList.remove('show');
        }
        if (shapeOptions.classList.contains('show') && !shapeOptions.contains(e.target) && e.target !== shapeTool && !shapeTool.contains(e.target)) {
          shapeOptions.classList.remove('show');
        }
        if (pageOptions.classList.contains('show') && !pageOptions.contains(e.target) && e.target !== pagesTool && !pagesTool.contains(e.target)) {
          pageOptions.classList.remove('show');
        }
      });

      moveControls.onclick = () => {
        controlsWrapper.classList.toggle('right');
        moveControls.classList.toggle('left');
        aboutPopover.classList.remove('show');
        shapeOptions.classList.remove('show');
        pageOptions.classList.remove('show');
      };

      downloadButton.addEventListener('click', function () {
        if (!canvas) return;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'drawing.png';
        link.click();
      });
    },
  };
};
