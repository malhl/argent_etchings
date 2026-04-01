# Argent Etchings

A real-time English-to-Phyrexian translator for the constructed language from Magic: The Gathering. Type English text and watch it transform into Phyrexian script instantly.

## Features

### Live Translation
- Converts English text to Phyrexian as you type, with no delay
- Dual output: Phyrexian glyphs (top) and romanized text (bottom)
- Vertical text rendering (top-to-bottom) matching authentic Phyrexian script direction

### Translation Pipeline
The converter uses a multi-layer approach to handle any input:

1. **Dictionary Lookup** -- 428+ confirmed Phyrexian words sourced from the [MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Dictionary), including:
   - Card types, supertypes, and subtypes
   - Keywords and game mechanics
   - Game zones and turn structure
   - Proper nouns (Praetors, planes, planeswalkers)
   - Core vocabulary (nouns, verbs, adjectives, grammar words)
   - Mood markers and grammatical affixes

2. **Morphological Fallback** -- For words not in the dictionary, the converter attempts to strip common English suffixes and apply Phyrexian grammar rules:
   - **Plurals** (`-s`): Strips the suffix, looks up the singular, and applies Phyrexian pluralization (doubling the first vowel)
   - **Past tense** (`-ed`): Strips the suffix and prepends the Phyrexian past-tense marker `DY`
   - **Present participle** (`-ing`): Strips the suffix and prepends the indicative mood marker `su`

3. **Transliteration** -- Completely unknown words are transliterated letter-by-letter from English to Phyrexian romanization, based on the Clackeys Phyrexian keycap set and wiki transliteration data.

### Phyrexian Font
Uses the **PhyrexianHorizontal** web font (Horizontal Gibberish v1.98 by [@PhieOrDie](https://x.com/PhieOrDie)). ASCII characters typed in this font render as Phyrexian glyphs -- no Unicode mapping needed. The romanized output doubles as the font input.

### UI
- **Resizable input area** -- Drag the handle between input and output to adjust the split (mouse and touch supported)
- **Punctuation preservation** -- Commas, periods, exclamation marks, and other punctuation pass through unchanged
- **Responsive layout** -- Adapts to mobile screens
- **Dark biomechanical aesthetic** -- Inspired by Phyrexia's visual identity: oil-black backgrounds, bone-white text, furnace-red accents, corroded metal borders

## Project Structure

```
argent_etchings/
  index.html              Main application
  test.html               Browser-based test suite
  css/
    style.css             Phyrexian-themed styles and layout
  fonts/
    PhyrexianHorizontal.woff2   Phyrexian glyph font
  js/
    dictionary.js         English -> Phyrexian romanization (428+ entries)
    converter.js          Translation pipeline (dictionary + morphology + transliteration)
    app.js                UI wiring, live conversion, resize handling
    tests.js              Test suite with 148 assertions
```

## Running

Open `index.html` in any modern browser. No build step, no dependencies, no server required.

## Tests

Open `test.html` in a browser to run the test suite. Tests verify the converter against known translations from official sources:

- **Dictionary tests** -- Every confirmed word from the MTG Wiki dictionary
- **Card name tests** -- Praetor names, type lines, and card titles from printed Phyrexian cards
- **Phrase tests** -- Multi-word translations from trailers and card art
- **Converter behavior** -- Case insensitivity, punctuation preservation, transliteration fallback

## Language Reference

Phyrexian is a complete constructed language developed for the Scars of Mirrodin block. Key characteristics:

- **Agglutinative** -- Words compound together rather than being separated
- **No pronouns** -- Generic descriptive nouns replace personal pronouns
- **Mood-based** -- Uses mood markers (indicative, jussive, imperative, etc.) rather than traditional tenses
- **Vertical script** -- Written top-to-bottom with glyphs attached to a central stem line
- **No word for happiness** -- The word for "evolution" and "pain" is the same (`GELL`)

## Sources

- [Phyrexian Language -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language))
- [Phyrexian Dictionary -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Dictionary)
- [Phyrexian Samples -- MTG Wiki](https://mtg.fandom.com/wiki/Phyrexian_(language)/Samples)
- [A Breakthrough in Phyrexian Language and Communications -- Wizards of the Coast](https://magic.wizards.com/en/news/feature/a-breakthrough-in-phyrexian-language-and-communications)
- [Horizontal Gibberish Font -- PhieOrDie](https://x.com/PhieOrDie)
