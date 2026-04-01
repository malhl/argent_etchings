# The Argent Etchings

A real-time English-to-Phyrexian translator for the constructed language from Magic: The Gathering. Type English text and watch it transform into Phyrexian script instantly.

## Features

### Live Translation
- Converts English text to Phyrexian as you type, with no delay
- Dual output: Phyrexian glyphs (top) and romanized text (bottom)
- Vertical text rendering (top-to-bottom) matching authentic Phyrexian script direction
- Phyrexian line markers: every line starts with `|` (perpendicular bar) and ends with `.` (closing hook)

### Translation Pipeline
The converter uses a four-layer approach to handle any input:

1. **Dictionary Lookup** -- 538 hand-curated Phyrexian words sourced from the [MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Dictionary), including:
   - Card types, supertypes, and subtypes
   - Keywords and game mechanics
   - Game zones and turn structure
   - Proper nouns (Praetors, planes, planeswalkers)
   - Core vocabulary (nouns, verbs, adjectives, grammar words)
   - Mood markers and grammatical affixes

2. **IPA-Derived Dictionary** -- 3,695 phonetically-converted words, built by:
   - Extracting 33,770 unique English words from the [MTG Comprehensive Rules](https://magic.wizards.com/en/rules) and 36,980 [Scryfall](https://scryfall.com/) oracle cards
   - Batch-fetching IPA pronunciations from the [Free Dictionary API](https://dictionaryapi.dev/)
   - Converting IPA to Phyrexian font ASCII via a complete phoneme mapping covering nasals, plosives, sliced/clanked consonants, fricatives, affricates, approximants, laterals, and all vowels

3. **Live API Lookup** -- Words not in either dictionary are fetched from the Free Dictionary API as you type. IPA results are cached per session and converted to Phyrexian on the fly. Fetches trigger after 4+ characters or on word completion.

4. **Morphological Fallback** -- For words not found via any lookup, the converter attempts to strip common English suffixes and apply Phyrexian grammar rules:
   - **Plurals** (`-s`): Strips the suffix, looks up the singular, and applies Phyrexian pluralization (doubling the first vowel)
   - **Past tense** (`-ed`): Strips the suffix and prepends the Phyrexian past-tense marker `DY`
   - **Present participle** (`-ing`): Strips the suffix and prepends the indicative mood marker `su`

5. **Transliteration** -- Completely unknown words are transliterated letter-by-letter from English to Phyrexian romanization, based on the Clackeys Phyrexian keycap set and wiki transliteration data.

**Total dictionary: 4,256 words** (538 hand-curated + 3,695 IPA-derived + 24 manually-coded common words).

### IPA-to-Phyrexian Mapping
A complete mapping of IPA phonetic symbols to PhyrexianHorizontal font ASCII keys, covering:
- Nasals: m, n, ŋ, ɴ
- Plosives: p, b, t, d, k, g, ɢ, q, ʔ
- Sliced consonants (aspirated): pʰ, tʰ, kʰ, qʰ
- Clanked consonants (ejective): pʼ, tʼ, kxʼ, qʼ
- Fricatives: f, v, θ, ð, s, z, ʃ, ʒ, ɣ, x, χ, ʁ, h, ɬ, ɮ
- Affricates: tʃ, dʒ
- Approximants: ʋ, j, ɰ, r, l
- Vowels: ɪ, i, y, u, ʌ, e, ø, o, ə, a, ɒ

### Phyrexian Font
Uses the **PhyrexianHorizontal** web font (Horizontal Gibberish v1.98 by [@PhieOrDie](https://x.com/PhieOrDie)). ASCII characters typed in this font render as Phyrexian glyphs -- no Unicode mapping needed. The romanized output doubles as the font input.

### UI
- **Resizable input area** -- Drag the handle between input and output to adjust the split (mouse and touch supported)
- **Punctuation preservation** -- Commas, exclamation marks, and other punctuation pass through unchanged
- **Responsive layout** -- Adapts to mobile screens
- **Dark biomechanical aesthetic** -- Inspired by Phyrexia's visual identity: oil-black backgrounds, bone-white text, furnace-red accents, corroded metal borders

## Project Structure

```
argent_etchings/
  index.html                Main application
  test.html                 Browser-based test suite
  css/
    style.css               Phyrexian-themed styles and layout
  fonts/
    PhyrexianHorizontal.woff2   Phyrexian glyph font
  js/
    dictionary.js           Hand-curated English -> Phyrexian (538 entries)
    ipa-dictionary.js        IPA-derived English -> Phyrexian (3,695 entries)
    converter.js            Translation pipeline + IPA mapping
    app.js                  UI wiring, live conversion, async API fetching
    tests.js                Test suite with 180+ assertions
  build/
    fetch-ipa.py            Batch IPA fetcher (resumable, async)
    build-ipa-dict.py       IPA cache -> JS dictionary generator
```

## Running

Open `index.html` in any modern browser. No build step, no dependencies, no server required.

## Tests

Open `test.html` in a browser to run the test suite. Tests verify the converter against known translations from official sources:

- **Dictionary tests** -- Every confirmed word from the MTG Wiki dictionary
- **Card name tests** -- Praetor names, type lines, and card titles from printed Phyrexian cards
- **Phrase tests** -- Multi-word translations from trailers and card art
- **IPA mapping tests** -- All consonants, vowels, and multi-character IPA sequences
- **Converter behavior** -- Case insensitivity, punctuation preservation, line markers, transliteration fallback

## Rebuilding the IPA Dictionary

To regenerate `js/ipa-dictionary.js` with updated word lists:

```bash
# 1. Download source data
curl -o build/comprules.txt "https://media.wizards.com/2026/downloads/MagicCompRules%2020260227.txt"
# Download Scryfall oracle cards via their bulk data API

# 2. Extract unique words (Python)
# 3. Fetch IPA (resumable -- saves progress every 500 words)
python build/fetch-ipa.py

# 4. Build the JS dictionary
python build/build-ipa-dict.py
```

Requires Python 3.8+ and `aiohttp` (`pip install aiohttp`).

## Language Reference

Phyrexian is a complete constructed language developed for the Scars of Mirrodin block. Key characteristics:

- **Agglutinative** -- Words compound together rather than being separated
- **No pronouns** -- Generic descriptive nouns replace personal pronouns
- **Mood-based** -- Uses mood markers (indicative, jussive, imperative, etc.) rather than traditional tenses
- **Vertical script** -- Written top-to-bottom with glyphs attached to a central stem line
- **Sentence markers** -- Lines begin with `|` (perpendicular bar) and end with `.` (angular hook)
- **No word for happiness** -- The word for "evolution" and "pain" is the same (`GELL`)
- **Hexadecimal number system** -- Base-16 with zero-based numbering

## Sources

- [Phyrexian Language -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language))
- [Phyrexian Dictionary -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Dictionary)
- [Phyrexian Samples -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Samples)
- [A Breakthrough in Phyrexian Language and Communications -- Wizards of the Coast](https://magic.wizards.com/en/news/feature/a-breakthrough-in-phyrexian-language-and-communications)
- [Horizontal Gibberish Font -- PhieOrDie](https://x.com/PhieOrDie)
- [Scryfall API -- Bulk Data](https://scryfall.com/docs/api/bulk-data)
- [Free Dictionary API](https://dictionaryapi.dev/)
