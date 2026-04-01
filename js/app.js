(function () {
/**
 * Main application — wires up UI to the converter pipeline.
 */

var textToPhyrexian = window.textToPhyrexian;
var prefetchUnknowns = window.prefetchUnknowns;
var DICTIONARY = window.DICTIONARY;
var apiCache = window.apiCache;

var inputEl = document.getElementById('input-text');
var phyrexianEl = document.getElementById('phyrexian-output');
var romanEl = document.getElementById('roman-output');

// Track current word length for the 4-char fetch trigger
var currentWordLen = 0;
// Avoid duplicate fetches
var fetchedWords = {};

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

/**
 * Fetch IPA for unknown words, then re-convert with cached results.
 */
async function fetchNewUnknowns(text) {
  var words = text.match(/[a-zA-Z]+/g) || [];
  var toFetch = [];
  for (var i = 0; i < words.length; i++) {
    var w = words[i].toLowerCase();
    if (!DICTIONARY[w] && apiCache[w] === undefined && !fetchedWords[w]) {
      toFetch.push(w);
    }
  }

  // Deduplicate
  var unique = [];
  var seen = {};
  for (var j = 0; j < toFetch.length; j++) {
    if (!seen[toFetch[j]]) {
      seen[toFetch[j]] = true;
      unique.push(toFetch[j]);
    }
  }

  if (!unique.length) return;

  for (var k = 0; k < unique.length; k++) {
    fetchedWords[unique[k]] = true;
  }

  await prefetchUnknowns(text);
  convert();
}

// Live conversion on every keystroke
inputEl.addEventListener('input', function () {
  convert();

  var text = inputEl.value;
  var lastChar = text.slice(-1);

  // On space/punctuation: word just finished — fetch unknowns
  if (/[\s.,!?;:]/.test(lastChar)) {
    currentWordLen = 0;
    fetchNewUnknowns(text);
    return;
  }

  // Track letters in current word
  if (/[a-zA-Z]/.test(lastChar)) {
    currentWordLen++;
  } else {
    currentWordLen = 0;
  }

  // After 4+ characters, fetch on every keystroke
  if (currentWordLen >= 4) {
    fetchNewUnknowns(text);
  }
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
