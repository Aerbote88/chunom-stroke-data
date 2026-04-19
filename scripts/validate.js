#!/usr/bin/env node
// Validates every data/<CODEPOINT>.json file: hanzi-writer shape, matching
// stroke/median counts, codepoint-matching filename. Also checks that
// index.json and manifest.json agree with the files on disk.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

if (!fs.existsSync(DATA)) {
  console.error("data/ directory not found");
  process.exit(1);
}

const files = fs.readdirSync(DATA).filter((f) => f.endsWith(".json"));
const charFiles = files.filter(
  (f) => f !== "index.json" && f !== "manifest.json",
);

const charactersOnDisk = [];

for (const file of charFiles) {
  const full = path.join(DATA, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    err(file, `invalid JSON: ${e.message}`);
    continue;
  }

  const stem = file.replace(/\.json$/, "");
  if (!/^[0-9A-F]+$/.test(stem)) {
    err(file, "filename must be uppercase hex codepoint");
    continue;
  }
  const cp = parseInt(stem, 16);
  const expected = String.fromCodePoint(cp);

  if (data.character !== expected) {
    err(file, `character ${JSON.stringify(data.character)} !== filename codepoint ${expected}`);
  }
  if (!Array.isArray(data.strokes) || data.strokes.length === 0) {
    err(file, "strokes must be a non-empty array");
    continue;
  }
  if (!Array.isArray(data.medians)) {
    err(file, "medians must be an array");
    continue;
  }
  if (data.medians.length !== data.strokes.length) {
    err(file, `medians.length (${data.medians.length}) !== strokes.length (${data.strokes.length})`);
  }
  for (let i = 0; i < data.strokes.length; i++) {
    if (typeof data.strokes[i] !== "string" || !data.strokes[i].startsWith("M")) {
      err(file, `strokes[${i}] must be an SVG path starting with M`);
    }
  }
  for (let i = 0; i < data.medians.length; i++) {
    const m = data.medians[i];
    if (!Array.isArray(m) || m.length === 0) {
      err(file, `medians[${i}] must be a non-empty array`);
      continue;
    }
    for (let j = 0; j < m.length; j++) {
      const pt = m[j];
      if (!Array.isArray(pt) || pt.length !== 2 || !pt.every((n) => Number.isFinite(n))) {
        err(file, `medians[${i}][${j}] must be [number, number]`);
        break;
      }
    }
  }

  charactersOnDisk.push(data.character);
}

const checkIndex = (name, validate) => {
  const full = path.join(DATA, name);
  if (!fs.existsSync(full)) {
    err(name, "missing");
    return;
  }
  let idx;
  try {
    idx = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    err(name, `invalid JSON: ${e.message}`);
    return;
  }
  validate(idx);
};

checkIndex("index.json", (idx) => {
  if (!Array.isArray(idx.characters)) {
    err("index.json", "characters must be an array");
    return;
  }
  if (idx.characters.length !== charactersOnDisk.length) {
    err(
      "index.json",
      `characters.length (${idx.characters.length}) !== character files on disk (${charactersOnDisk.length})`,
    );
  }
  const indexSet = new Set(idx.characters);
  for (const c of charactersOnDisk) {
    if (!indexSet.has(c)) err("index.json", `missing character ${c}`);
  }
});

checkIndex("manifest.json", (man) => {
  if (!Array.isArray(man.entries)) {
    err("manifest.json", "entries must be an array");
    return;
  }
  if (man.entries.length !== charactersOnDisk.length) {
    err(
      "manifest.json",
      `entries.length (${man.entries.length}) !== character files on disk (${charactersOnDisk.length})`,
    );
  }
});

if (errors.length) {
  console.error(`\nValidation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

console.log(`OK — validated ${charFiles.length} character files + index.json + manifest.json`);
