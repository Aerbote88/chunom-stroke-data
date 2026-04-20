# NOTICE

## Attribution chain

The stroke data in this repository derives from the following chain of upstream work:

1. **Nôm Na Tống** — the reference Chữ Nôm font maintained by the Vietnamese Nôm Preservation Foundation (nomfoundation). The primary tracing source for character outlines in this dataset.
   - https://github.com/nomfoundation/font
   - License: MIT (© 2019 nomfoundation)

2. **Plangothic P1** — used as a fallback tracing source for codepoints outside Nôm Na Tống's coverage. "Plangothic" and "遍黑" are reserved font names under the SIL OFL.
   - https://github.com/Fitzgerald-Porthmouth-Koenigsegg/Plangothic_Project
   - License: SIL Open Font License 1.1

3. **makemeahanzi** by Shaunak Kishore — the editor framework and stroke-extraction pipeline that produced the tooling used to author this data.
   - https://github.com/skishore/makemeahanzi

4. **make-me-a-hanzi-tool** by MadLadSquad — editor improvements integrated into the fork used here.
   - https://github.com/MadLadSquad/make-me-a-hanzi-tool

5. **make-me-a-chunom** — the Chữ Nôm-focused fork of the above, used to author the specific characters published here.
   - https://github.com/Aerbote88/make-me-a-chunom

## Scope of this dataset

This repository contains **only** stroke data for characters authored for the make-me-a-chunom project. No stroke data from makemeahanzi's upstream `graphics.txt` is republished here; the export tool filters those out.

The stroke paths are hand-authored SVG path data derived from manual tracings of the upstream font outlines; no font program code or font binary is redistributed.

## License

Stroke data is distributed under the MIT License (see `LICENSE`).
