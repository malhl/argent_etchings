(function () {
/**
 * Main application — wires up UI to the converter pipeline.
 */

var textToPhyrexian = window.textToPhyrexian;

var inputEl = document.getElementById('input-text');
var phyrexianEl = document.getElementById('phyrexian-output');
var romanEl = document.getElementById('roman-output');

function convert() {
  var text = inputEl.value;

  if (!text.trim()) {
    phyrexianEl.textContent = '';
    if (romanEl) romanEl.textContent = '';
    return;
  }

  var result = textToPhyrexian(text);
  phyrexianEl.textContent = result.phyrexian;
  if (romanEl) romanEl.textContent = result.phyrexian;
}

// Live conversion on every keystroke
inputEl.addEventListener('input', function () {
  convert();
});

// --- Resize handle: drag upward to grow the input area ---
var inputArea = document.getElementById('input-area');
var resizeHandle = document.getElementById('resize-handle');
var dragging = false;
var startY = 0;
var startHeight = 0;

resizeHandle.addEventListener('mousedown', function (e) {
  dragging = true;
  startY = e.clientY;
  startHeight = inputArea.offsetHeight;
  document.body.style.cursor = 'ns-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', function (e) {
  if (!dragging) return;
  var delta = startY - e.clientY;
  var newHeight = Math.max(80, Math.min(window.innerHeight * 0.7, startHeight + delta));
  inputArea.style.height = newHeight + 'px';
});

document.addEventListener('mouseup', function () {
  if (!dragging) return;
  dragging = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// Touch support for mobile
resizeHandle.addEventListener('touchstart', function (e) {
  dragging = true;
  startY = e.touches[0].clientY;
  startHeight = inputArea.offsetHeight;
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function (e) {
  if (!dragging) return;
  var delta = startY - e.touches[0].clientY;
  var newHeight = Math.max(80, Math.min(window.innerHeight * 0.7, startHeight + delta));
  inputArea.style.height = newHeight + 'px';
}, { passive: false });

document.addEventListener('touchend', function () {
  if (!dragging) return;
  dragging = false;
});

// Focus input on load
inputEl.focus();
})();
