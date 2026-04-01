(function () {
/**
 * English text -> Phyrexian converter.
 *
 * Pipeline:
 * 1. Dictionary lookup (local) — known words get Phyrexian romanization
 * 2. Transliteration fallback — unknown words get letter-by-letter mapping
 *
 * The romanized output, when displayed in PhyrexianHorizontal font,
 * renders as Phyrexian glyphs.
 */

var DICTIONARY = window.DICTIONARY;

/**
 * Basic English letter -> Phyrexian romanization for unknown words.
 * Based on the Clackeys Phyrexian keycap set and wiki transliteration data.
 * Maps lowercase English letters to their Phyrexian font equivalents.
 */
var TRANSLITERATION = {
  'a': 'e',
  'b': 'b',
  'c': 'h',   // no native 'c' in Phyrexian; mapped to [k] sound
  'd': 'd',
  'e': 'u',
  'f': 'i',
  'g': 'k',
  'h': 'Q',
  'i': 'E',
  'j': 'a',
  'k': 'h',
  'l': 'c',
  'm': 'm',
  'n': 'n',
  'o': 'o',
  'p': 'p',
  'q': 'C',
  'r': 'r',
  's': 'L',
  't': 't',
  'u': 'Y',
  'v': 'l',
  'w': 'v',
  'x': 's',
  'y': 'w',
  'z': '&',
};

/**
 * Transliterate a single unknown word letter-by-letter.
 */
function transliterate(word) {
  var lower = word.toLowerCase();
  var result = '';
  for (var i = 0; i < lower.length; i++) {
    var ch = lower[i];
    result += TRANSLITERATION[ch] || ch;
  }
  return result;
}

/**
 * Convert a single English word to Phyrexian romanization.
 * Tries dictionary first, then falls back to transliteration.
 */
function wordToPhyrexian(word) {
  var lower = word.toLowerCase();

  // Exact dictionary match
  if (DICTIONARY[lower]) {
    return DICTIONARY[lower];
  }

  // Try without trailing 's' for simple plurals
  if (lower.endsWith('s') && lower.length > 2) {
    var singular = lower.slice(0, -1);
    if (DICTIONARY[singular]) {
      // Phyrexian plurals double the first vowel
      var phyr = DICTIONARY[singular];
      return pluralize(phyr);
    }
  }

  // Try without 'ed' for simple past tense
  if (lower.endsWith('ed') && lower.length > 3) {
    var stem = lower.slice(0, -2);
    if (DICTIONARY[stem]) {
      return 'DY' + DICTIONARY[stem];
    }
    // doubled consonant: "stopped" -> "stop"
    if (stem.length > 1 && stem[stem.length - 1] === stem[stem.length - 2]) {
      var stem2 = stem.slice(0, -1);
      if (DICTIONARY[stem2]) {
        return 'DY' + DICTIONARY[stem2];
      }
    }
  }

  // Try without 'ing' for present participle
  if (lower.endsWith('ing') && lower.length > 4) {
    var stem3 = lower.slice(0, -3);
    if (DICTIONARY[stem3]) {
      return 'su' + DICTIONARY[stem3];
    }
    // "making" -> "make" (remove 'ing', add 'e')
    if (DICTIONARY[stem3 + 'e']) {
      return 'su' + DICTIONARY[stem3 + 'e'];
    }
  }

  // Fallback: transliterate
  return transliterate(lower);
}

/**
 * Phyrexian pluralization: double the first vowel in the romanized word.
 */
function pluralize(phyrWord) {
  var vowels = 'aeEFiIoOuUyY';
  for (var i = 0; i < phyrWord.length; i++) {
    if (vowels.indexOf(phyrWord[i]) !== -1) {
      return phyrWord.slice(0, i + 1) + phyrWord[i] + phyrWord.slice(i + 1);
    }
  }
  return phyrWord; // no vowel found, return as-is
}

/**
 * Full pipeline: English text -> Phyrexian romanization.
 * Preserves punctuation and whitespace.
 * Returns object with:
 *   phyrexian: the romanized string (for PhyrexianHorizontal font)
 *   plain: same string (readable as romanization)
 */
function textToPhyrexian(text) {
  // Tokenize: words vs non-words
  var tokens = text.match(/[a-zA-Z']+|[^a-zA-Z']+/g) || [];
  var phyrResult = '';

  for (var t = 0; t < tokens.length; t++) {
    var token = tokens[t];
    if (/^[a-zA-Z']+$/.test(token)) {
      // Strip apostrophes for lookup, but handle contractions
      var clean = token.replace(/'/g, '');
      phyrResult += wordToPhyrexian(clean);
    } else {
      // Punctuation / whitespace — pass through
      // Map period to Phyrexian sentence-end marker
      phyrResult += token;
    }
  }

  return { phyrexian: phyrResult };
}

window.textToPhyrexian = textToPhyrexian;
window.wordToPhyrexian = wordToPhyrexian;
window.transliterate = transliterate;
})();
