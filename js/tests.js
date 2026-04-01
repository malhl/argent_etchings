(function () {
/**
 * Test suite for Argent Etchings converter.
 * Verifies output against known translations from MTG Wiki samples.
 *
 * Each test group contains entries from a specific source (card, trailer, etc.)
 * with the expected Phyrexian romanization.
 */

var textToPhyrexian = window.textToPhyrexian;
var wordToPhyrexian = window.wordToPhyrexian;
var DICTIONARY = window.DICTIONARY;

var passed = 0;
var failed = 0;
var results = [];

// =========================================================
// Test definitions
// =========================================================

var testGroups = [

  // ---------------------------------------------------------
  // 1. Dictionary — Single word lookups (confirmed wiki words)
  // ---------------------------------------------------------
  {
    name: "Dictionary: Proper Nouns",
    source: "MTG Wiki — Phyrexian Dictionary (Confirmed)",
    tests: [
      { input: "Ajani",      expected: "DFaUnEED" },
      { input: "Elesh",      expected: "Ducg" },
      { input: "Norn",       expected: "norn" },
      { input: "Sheoldred",  expected: "gOcdrd" },
      { input: "Vorinclex",  expected: "lornScs" },
      { input: "Urabrask",   expected: "DYrbreLh" },
      { input: "Yawgmoth",   expected: "wUDkmoDZ" },
      { input: "Phyrexia",   expected: "fyrshuZFGK" },
      { input: "Jace",       expected: "auL" },
      { input: "Vraska",     expected: "lreLhFD" },
      { input: "Tamiyo",     expected: "temDwooD" },
      { input: "Mirrodin",   expected: "mrodn" },
      { input: "Dominaria",  expected: "dmFnr" },
      { input: "Jin",        expected: "aEDn" },
      { input: "Gitaxias",   expected: "Gyts" },
      { input: "Nissa",      expected: "nELFD" },
      { input: "Nahiri",     expected: "nQErEED" },
      { input: "Lukka",      expected: "cyhYD" },
    ]
  },

  {
    name: "Dictionary: Card Types",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "artifact",     expected: "CsYneDh" },
      { input: "creature",     expected: "fuDs" },
      { input: "enchantment",  expected: "myZJ" },
      { input: "instant",      expected: "&EhcMYmL" },
      { input: "sorcery",      expected: "hegpcMYmL" },
      { input: "land",         expected: "ZFGK" },
      { input: "planeswalker", expected: "nmQYpmunt" },
    ]
  },

  {
    name: "Dictionary: Lands",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "plains",   expected: "DEACc" },
      { input: "island",   expected: "hWZFGK" },
      { input: "swamp",    expected: "Ceghm" },
      { input: "mountain", expected: "htehs" },
      { input: "forest",   expected: "DoGZFLK" },
    ]
  },

  {
    name: "Dictionary: Keywords",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "compleated",  expected: "pcEnusL" },
      { input: "deathtouch",  expected: "zvEZYCsDFhg" },
      { input: "flash",       expected: "zvE&EhcMYmL" },
      { input: "flying",      expected: "zvEtOgC" },
      { input: "haste",       expected: "zvE&EhclYvh" },
      { input: "infect",      expected: "zvERFzK" },
      { input: "lifelink",    expected: "kvEnLeDCrefow" },
      { input: "proliferate", expected: "wuhtcusOC" },
      { input: "trample",     expected: "zvEhiUIpenDk" },
      { input: "toxic",       expected: "VeMC" },
      { input: "vigilance",   expected: "zvEpnrYhm" },
    ]
  },

  {
    name: "Dictionary: Game Zones",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "battlefield", expected: "tvOBsZFst" },
      { input: "graveyard",   expected: "ZYCsEvvZFst" },
      { input: "hand",        expected: "neCc" },
      { input: "library",     expected: "tuhtZFst" },
      { input: "exile",       expected: "AsFtDZFst" },
      { input: "zone",        expected: "ZFst" },
    ]
  },

  {
    name: "Dictionary: Game Terms",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "attack",    expected: "kMEAts" },
      { input: "block",     expected: "hiUDID" },
      { input: "card",      expected: "GvEng" },
      { input: "cast",      expected: "MYmL" },
      { input: "control",   expected: "CsYPc" },
      { input: "counter",   expected: "gYCn" },
      { input: "create",    expected: "neBm" },
      { input: "damage",    expected: "KpeAh" },
      { input: "destroy",   expected: "CebD" },
      { input: "discard",   expected: "gtuIM" },
      { input: "draw",      expected: "mpreLv" },
      { input: "mana",      expected: "meDn" },
      { input: "opponent",  expected: "FsnUCA" },
      { input: "sacrifice", expected: "noDbDYkm" },
      { input: "spell",     expected: "MYmL" },
      { input: "tap",       expected: "zypm" },
      { input: "target",    expected: "Jyst" },
      { input: "token",     expected: "ieDEpZ" },
      { input: "trigger",   expected: "BeJK" },
    ]
  },

  {
    name: "Dictionary: Creature Subtypes",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "beast",      expected: "pnpuDh" },
      { input: "elf",        expected: "weci" },
      { input: "equipment",  expected: "CEpmt" },
      { input: "horror",     expected: "gSMUAs" },
      { input: "human",      expected: "DOnF%" },
      { input: "phyrexian",  expected: "fyrs" },
      { input: "praetor",    expected: "psewtr" },
      { input: "warrior",    expected: "ne%mtayft" },
    ]
  },

  {
    name: "Dictionary: Numbers",
    source: "MTG Wiki — Phyrexian Dictionary",
    tests: [
      { input: "one",   expected: "DEE" },
      { input: "two",   expected: "%Y" },
      { input: "three", expected: "%E" },
      { input: "twice", expected: "%YLDFr" },
      { input: "half",  expected: "Fs%YLDFr" },
    ]
  },

  {
    name: "Dictionary: Core Vocabulary",
    source: "MTG Wiki — Phyrexian Dictionary (Other Words)",
    tests: [
      { input: "perfection",  expected: "wne%m" },
      { input: "death",       expected: "ZYCs" },
      { input: "evolution",   expected: "GELL" },
      { input: "flesh",       expected: "DFpyrs" },
      { input: "great",       expected: "gSeDZ" },
      { input: "machine",     expected: "wUDk" },
      { input: "father",      expected: "moDZ" },
      { input: "mother",      expected: "&UKJ" },
      { input: "oil",         expected: "dceb&" },
      { input: "world",       expected: "huZFGK" },
      { input: "fear",        expected: "svEsA" },
      { input: "welcome",     expected: "gduSd" },
      { input: "whisper",     expected: "DEauDt" },
      { input: "cleanse",     expected: "DecEZt" },
      { input: "furnace",     expected: "SEGV" },
      { input: "ichor",       expected: "fOrv" },
      { input: "new",         expected: "goprept" },
      { input: "make",        expected: "ne%m" },
      { input: "life",        expected: "nLeDC" },
      { input: "mind",        expected: "tFRErt" },
      { input: "voice",       expected: "sYgl" },
      { input: "language",    expected: "RUDz" },
      { input: "break",       expected: "pFnDk" },
      { input: "flay",        expected: "zU&G" },
      { input: "surrender",   expected: "pnLAeDZ" },
      { input: "embrace",     expected: "GHrULd" },
      { input: "immortality", expected: "zvEFsTuZYCs" },
      { input: "corrupt",     expected: "RFzK" },
      { input: "progress",    expected: "IytPt" },
    ]
  },

  {
    name: "Dictionary: Mood Markers & Grammar Words",
    source: "MTG Wiki — Phyrexian Dictionary (Affixes)",
    tests: [
      { input: "all",     expected: "gDEEmeLQeB" },
      { input: "not",     expected: "Fs" },
      { input: "if",      expected: "beCEcs" },
      { input: "instead", expected: "coCEt" },
      { input: "or",      expected: "KF" },
      { input: "and",     expected: "sF" },
      { input: "from",    expected: "zW" },
      { input: "with",    expected: "CFr" },
      { input: "until",   expected: "JhE" },
    ]
  },

  // ---------------------------------------------------------
  // 2. Card Name Translations (from wiki Samples page)
  // ---------------------------------------------------------
  {
    name: "Card Names: Elesh Norn, Grand Cenobite",
    source: "MTG Wiki Samples — Elesh Norn Judge Gift Promo",
    tests: [
      { input: "Elesh",    expected: "Ducg" },
      { input: "cenobite", expected: "aOnobt" },
    ]
  },

  {
    name: "Card Names: Type Lines",
    source: "MTG Wiki Samples — Various Cards",
    tests: [
      // "Legendary Creature" = MewkfuDs
      { input: "legendary", expected: "Mewk" },
      { input: "creature",  expected: "fuDs" },
      // "Basic Land" = zOPEDtZFGK
      { input: "basic",     expected: "zOPEDt" },
    ]
  },

  {
    name: "Card Names: Praetors",
    source: "MTG Wiki Samples — Arena Blackboard / Secret Lair",
    tests: [
      // Jin-Gitaxias, Progress Tyrant
      { input: "progress", expected: "IytPt" },
      { input: "tyrant",   expected: "krwFTrh" },
      // Sheoldred, the Apocalypse
      { input: "apocalypse", expected: "nETemk" },
      // Urabrask, Heretic Praetor
      { input: "heretic", expected: "$hDyhk" },
      // Vorinclex, Voice of Hunger
      { input: "hunger", expected: "kukk" },
      // Lukka, Bound to Ruin
      { input: "bound", expected: "hu$yt" },
      { input: "ruin",  expected: "QivuJf" },
      // Tamiyo, Compleated Sage
      { input: "sage", expected: "iOlz" },
      // Nahiri, the Unforgiving
      { input: "unforgiving", expected: "NyCS" },
      // Vraska, Betrayal's Sting
      { input: "betrayal", expected: "Pnohs" },
      { input: "sting",    expected: "DeiD" },
    ]
  },

  // ---------------------------------------------------------
  // 3. Multi-word Phrases (from trailers & card text)
  // ---------------------------------------------------------
  {
    name: "Phrases: Key Phyrexian Concepts",
    source: "MTG Wiki Samples — Trailers & Card Art",
    type: "phrase",
    tests: [
      // "Phyrexian language" = fyrsRUDz (on Elesh Norn card)
      {
        input: "Phyrexian language",
        expected: "|fyrs RUDz.",
        note: "Elesh Norn card — language selector"
      },
      // Card type lines are compound words in Phyrexian, but our converter
      // translates word-by-word with spaces — that's acceptable
      {
        input: "swamp",
        expected: "|Ceghm.",
        note: "Phyrexian Swamp card name"
      },
      {
        input: "Psychosis Crawler",
        expected: "|wE_kzvEDl bvudn.",
        note: "Psychosis Crawler WPN promo"
      },
      {
        input: "Blighted Agent",
        expected: "|R&FtzK kenvr.",
        note: "Secret Lair: Phyrexian Faves"
      },
    ]
  },

  {
    name: "Phrases: Flavor & Slogans",
    source: "MTG Wiki Samples — Trailers, Card Art, Merch",
    type: "phrase",
    tests: [
      {
        input: "perfection",
        expected: "|wne%m.",
        note: "Common inscription on ONE card art"
      },
      {
        input: "compleat",
        expected: "|pcEnusL.",
        note: "Arena animation — Phyrexian Scriptures"
      },
    ]
  },

  // ---------------------------------------------------------
  // 4. Converter Features
  // ---------------------------------------------------------
  {
    name: "Converter: Case Insensitivity",
    source: "Converter behavior",
    tests: [
      { input: "PHYREXIA",   expected: "fyrshuZFGK" },
      { input: "phyrexia",   expected: "fyrshuZFGK" },
      { input: "Phyrexia",   expected: "fyrshuZFGK" },
      { input: "DEATH",      expected: "ZYCs" },
      { input: "Death",      expected: "ZYCs" },
      { input: "death",      expected: "ZYCs" },
    ]
  },

  {
    name: "Converter: Punctuation Preservation",
    source: "Converter behavior",
    type: "phrase",
    tests: [
      {
        input: "death, perfection.",
        expected: "|ZYCs, wne%m.",
        note: "Commas and periods preserved"
      },
      {
        input: "fear! destroy!",
        expected: "|svEsA! CebD!.",
        note: "Exclamation marks preserved"
      },
    ]
  },

  {
    name: "Converter: Line Markers",
    source: "Phyrexian writing convention — | starts, . ends",
    type: "phrase",
    tests: [
      {
        input: "death",
        expected: "|ZYCs.",
        note: "Single word gets | prefix and . suffix"
      },
      {
        input: "death\nperfection",
        expected: "|ZYCs.\n|wne%m.",
        note: "Each line gets its own | and ."
      },
      {
        input: "death.",
        expected: "|ZYCs.",
        note: "Existing trailing period is not doubled"
      },
    ]
  },

  {
    name: "Converter: Unknown Word Transliteration",
    source: "Converter behavior — fallback",
    type: "word",
    tests: [
      // "zzz" has no dictionary entry, should transliterate letter by letter
      // z -> &, z -> &, z -> & = "&&&"
      {
        input: "zzz",
        expected: "|&&&.",
        note: "Unknown word falls back to transliteration"
      },
    ]
  },

];

// =========================================================
// Test runner
// =========================================================

function runTest(test) {
  var result;
  if (test.input.indexOf(' ') === -1 && !test.note) {
    // Single word — test wordToPhyrexian directly
    result = wordToPhyrexian(test.input);
  } else {
    // Phrase — test full pipeline
    result = textToPhyrexian(test.input).phyrexian;
  }

  var pass = result === test.expected;
  if (pass) passed++; else failed++;

  return {
    pass: pass,
    input: test.input,
    expected: test.expected,
    got: result,
    note: test.note || null,
  };
}

function renderResults() {
  var summaryEl = document.getElementById('summary');
  var resultsEl = document.getElementById('results');

  // Run all tests first, collecting results per group
  var allGroupResults = [];
  for (var g = 0; g < testGroups.length; g++) {
    var group = testGroups[g];
    var groupResults = [];
    var groupFailed = 0;

    for (var t = 0; t < group.tests.length; t++) {
      var r = runTest(group.tests[t]);
      groupResults.push(r);
      if (!r.pass) groupFailed++;
    }

    allGroupResults.push({ group: group, results: groupResults, failed: groupFailed });
  }

  // Now render summary with final counts
  var total = passed + failed;
  summaryEl.className = 'summary ' + (failed === 0 ? 'pass' : 'fail');
  summaryEl.innerHTML = (failed === 0 ? 'ALL TESTS PASSED' : failed + ' FAILED') +
    ' &mdash; ' + passed + '/' + total + ' passed';

  // Render individual results
  var html = '';
  for (var g = 0; g < allGroupResults.length; g++) {
    var entry = allGroupResults[g];
    var group = entry.group;
    var groupResults = entry.results;
    var groupFailed = entry.failed;

    html += '<div class="section">';
    html += '<h2>' + group.name +
      ' <span style="opacity:0.5;font-size:0.7rem;">(' + group.source + ')</span>' +
      (groupFailed > 0 ? ' <span style="color:#c44520;">[' + groupFailed + ' failed]</span>' : '') +
      '</h2>';

    for (var i = 0; i < groupResults.length; i++) {
      var r = groupResults[i];
      html += '<div class="test ' + (r.pass ? 'pass' : 'fail') + '">';
      html += '<span class="status">' + (r.pass ? 'PASS' : 'FAIL') + '</span>';
      html += '<span class="detail">';
      html += '"' + r.input + '"';
      if (r.pass) {
        html += ' &rarr; <code>' + r.expected + '</code>';
      } else {
        html += '<br><span class="expected">expected: <code>' + r.expected + '</code></span>';
        html += '<br><span class="got">got: <code>' + r.got + '</code></span>';
      }
      if (r.note) {
        html += ' <span style="opacity:0.4;font-size:0.75rem;">(' + r.note + ')</span>';
      }
      html += '</span></div>';
    }

    html += '</div>';
  }

  resultsEl.innerHTML = html;
}

// Run on load
renderResults();

// Export for console use
window.testResults = { passed: passed, failed: failed };
console.log('Tests: ' + passed + ' passed, ' + failed + ' failed');

})();
