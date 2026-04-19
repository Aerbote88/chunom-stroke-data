# chunom-stroke-data

Stroke order data for Vietnamese Chữ Nôm (𡨸喃) characters, in [hanzi-writer](https://github.com/chanind/hanzi-writer) format.

Existing stroke-order datasets (makemeahanzi and friends) cover CJK Unified Ideographs used in Chinese. This dataset fills the Nôm gap — characters coined in Vietnam (mostly CJK Extensions B–H) plus a handful of rarer CJK Unified Ideographs that appear in Nôm writing but not in the makemeahanzi set.

## Contents

```
data/
├── <CODEPOINT>.json    one per character, keyed by uppercase hex codepoint
├── index.json          { count, generated, characters[] }
└── manifest.json       { count, generated, entries[] } with block tags
```

## Format

Each `<CODEPOINT>.json` is hanzi-writer compatible:

```json
{
  "character": "𡨸",
  "strokes": ["M ...", "M ...", ...],
  "medians": [[[x, y], [x, y], ...], ...]
}
```

`strokes[i]` is an SVG path for stroke `i`. `medians[i]` is the animation path along that stroke. The coordinate system is hanzi-writer's standard 0–1024 with Y inverted (origin at top-left; glyph baseline around y≈900).

## Usage

Fetch a character from a CDN like jsDelivr:

```js
const cp = "𡨸".codePointAt(0).toString(16).toUpperCase();
const url = `https://cdn.jsdelivr.net/gh/Aerbote88/chunom-stroke-data/data/${cp}.json`;
const data = await fetch(url).then(r => r.json());

const writer = HanziWriter.create("target", data.character, {
  charDataLoader: () => data,
});
writer.animateCharacter();
```

Or bulk-download the whole set with `git clone` or a GitHub archive.

## Coverage

See `data/manifest.json` for the full list with codepoints and block tags:

- **ext-b-plus** — characters at U+20000 and above (CJK Extensions B–H). These are overwhelmingly Nôm-coined.
- **bmp** — characters in the Basic Multilingual Plane that appear in Nôm writing but aren't in the makemeahanzi BMP set.

## Provenance

Data was authored using [make-me-a-chunom](https://github.com/Aerbote88/make-me-a-chunom), a Chữ Nôm fork of skishore's [makemeahanzi](https://github.com/skishore/makemeahanzi) editor. Initial character outlines were traced from the AR PL UKai / AR PL KaitiM GB fonts ([Arphic Technology](https://www.freedesktop.org/wiki/Arphic_Public_License/)), then the stroke segmentation, ordering, and animation medians were authored by hand in the editor.

Only characters **not** present in makemeahanzi's `graphics.txt` are included here — no upstream Han data is republished.

## License

Stroke path data is released under the [Arphic Public License](LICENSE), matching the license of the font outlines the glyph shapes are ultimately derived from. See [NOTICE.md](NOTICE.md) for the full attribution chain.

## Contributing

New characters are welcome. Open a PR adding `data/<CODEPOINT>.json` with the hanzi-writer shape shown above; the validation workflow will check structure on push.
