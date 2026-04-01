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
 * IPA -> Phyrexian font ASCII mapping.
 * Complete mapping from IPA phonetic symbols to the ASCII characters
 * that produce Phyrexian glyphs in the PhyrexianHorizontal font.
 * Source: MTG Wiki Phyrexian (language) — Phonology tables.
 *
 * Sorted longest-first so multi-character IPA sequences match before singles.
 */
var IPA_TO_PHYREXIAN = [
  // Multi-character IPA sequences (must match before singles)
  // Sliced consonants (aspirated)
  ['pʰ', 'f'],
  ['tʰ', 'H'],
  ['kʰ', '%'],
  ['qʰ', '_'],
  // Clanked consonants (ejective)
  ['pʼ', 'P'],
  ['tʼ', 'T'],
  ['kxʼ', 'B'],
  ['qʼ', 'I'],
  // Sibilant affricates
  ['tʃ', 'A'],    // "ch" as in "beach"
  ['dʒ', 'a'],    // "j" as in "gene"
  // Long vowels (doubled)
  ['iː', 'EE'],
  ['oʊ', 'oo'],
  // Diphthongs / common combos
  ['ŋ', 'N'],     // "ng" as in "sing"

  // Single consonants — Nasals
  ['m', 'm'],
  ['n', 'n'],
  ['ɴ', '$'],      // uvular nasal

  // Single consonants — Plosives
  ['p', 'p'],
  ['b', 'b'],
  ['t', 't'],
  ['d', 'd'],
  ['k', 'h'],      // [k] maps to font 'h'
  ['g', 'k'],      // [g] maps to font 'k'
  ['ɡ', 'k'],      // IPA ɡ variant
  ['ɢ', 'G'],      // voiced uvular plosive
  ['q', 'C'],       // voiceless uvular plosive
  ['ʔ', 'D'],       // glottal stop

  // Single consonants — Non-sibilant fricatives
  ['f', 'i'],       // [f] maps to font 'i'
  ['v', 'l'],       // [v] maps to font 'l'
  ['θ', 'Z'],       // "th" as in "thin"
  ['ð', 'K'],       // "th" as in "this"
  ['ɣ', 'z'],       // voiced velar fricative
  ['x', 's'],       // voiceless velar fricative
  ['χ', 'S'],       // voiceless uvular fricative
  ['ʁ', 'M'],       // voiced uvular fricative
  ['h', 'Q'],       // glottal fricative

  // Single consonants — Sibilant fricatives
  ['s', 'L'],
  ['z', '&'],
  ['ʃ', 'g'],       // "sh" — metallic blade sound
  ['ʒ', 'J'],       // "vision"

  // Single consonants — Approximants
  ['ʋ', 'v'],       // between [v] and [w]
  ['j', 'w'],        // "y" as in "you"
  ['ɰ', 'W'],       // velar approximant

  // Single consonants — Trill
  ['r', 'r'],        // rolled r

  // Single consonants — Lateral
  ['ɬ', 'V'],       // voiceless lateral fricative
  ['ɮ', 'R'],       // voiced lateral fricative
  ['l', 'c'],        // lateral approximant

  // Vowels — Close
  ['ɪ', 'E'],       // "kit"
  ['i', 'EE'],      // "free" (long)
  ['y', 'y'],        // rounded close front
  ['u', 'Y'],        // "boot"
  ['ʌ', 'Y'],       // "uh" (shares glyph with u)

  // Vowels — Close-mid
  ['e', 'u'],        // "hey" before the y
  ['ø', 'O'],       // rounded, like "Sheoldred"
  ['o', 'o'],        // RP "yawn"

  // Vowels — Mid
  ['ə', 'F'],       // "above" (schwa)

  // Vowels — Open
  ['a', 'e'],        // first part of "ow" in "cow"
  ['ɒ', 'U'],       // American "thought"
];

/**
 * English letter -> Phyrexian font ASCII mapping for unknown words.
 * Used as a simple fallback when a word isn't in the dictionary
 * and we don't have IPA for it.
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
 * Convert an IPA string to Phyrexian font ASCII.
 * Matches longest IPA sequences first to avoid partial matches.
 */
function ipaToPhyrexian(ipa) {
  var result = '';
  var i = 0;

  while (i < ipa.length) {
    var remaining = ipa.slice(i);
    var matched = false;

    // Try each IPA mapping, longest first (already sorted)
    for (var m = 0; m < IPA_TO_PHYREXIAN.length; m++) {
      var key = IPA_TO_PHYREXIAN[m][0];
      var val = IPA_TO_PHYREXIAN[m][1];
      if (remaining.substring(0, key.length) === key) {
        result += val;
        i += key.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Skip stress marks, length marks, etc.
      var ch = remaining.charAt(0);
      if ('ˈˌːˑ̃'.indexOf(ch) !== -1) {
        i++;
      } else {
        // Unknown character — pass through
        result += ch;
        i++;
      }
    }
  }

  return result;
}

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
  // Split into lines, process each independently
  var lines = text.split('\n');
  var outputLines = [];

  for (var l = 0; l < lines.length; l++) {
    var line = lines[l];
    if (!line.trim()) {
      outputLines.push('');
      continue;
    }

    // Tokenize: words vs non-words
    var tokens = line.match(/[a-zA-Z']+|[^a-zA-Z']+/g) || [];
    var phyrResult = '';

    for (var t = 0; t < tokens.length; t++) {
      var token = tokens[t];
      if (/^[a-zA-Z']+$/.test(token)) {
        var clean = token.replace(/'/g, '');
        phyrResult += wordToPhyrexian(clean);
      } else {
        phyrResult += token;
      }
    }

    // Strip any trailing period — we add our own closing hook
    var trimmed = phyrResult.replace(/\.\s*$/, '');

    // Phyrexian convention: | starts a line, . ends it
    outputLines.push('|' + trimmed + '.');
  }

  return { phyrexian: outputLines.join('\n') };
}

window.textToPhyrexian = textToPhyrexian;
window.wordToPhyrexian = wordToPhyrexian;
window.transliterate = transliterate;
window.ipaToPhyrexian = ipaToPhyrexian;
window.IPA_TO_PHYREXIAN = IPA_TO_PHYREXIAN;
})();
