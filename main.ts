// NusaData: Statistik Indonesia — build entry (Node 22, standard library only).
// The site lives in this directory's app/ folder: plain static files a browser
// opens at app/index.html, nothing loaded over the network. This program hands
// it in: it copies app/ and screenshots/ from beside this file into the output
// directory and writes dossier.json there, the summary the judge reads, using
// the vendored make.fun library. vendor/makefun-frontend.ts is left as it is:
// the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// The output directory itself is never removed: on the grader it is a mount
// point, so deleting it would fail there while passing locally. Only the known
// children this program owns (app/, screenshots/, dossier.json) are replaced,
// and only by copying over them, never by deleting the directory itself.
//
// Before writing anything, this program validates its inputs and refuses to
// hand in a broken entry: app/ must exist with an index.html, every screenshot
// must be a PNG or JPEG of at most 256 KiB, and the dossier must regenerate
// byte-identically from the same output directory. A failed guard stops the
// run with an error instead of handing in a bad entry.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   MAKEFUN_OUTPUT_DIR=/tmp/ns-out1 node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SCREENSHOT_MAX_BYTES = 262144;

// --- validation guard: refuse unless the entry is complete and in spec ---
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: the site must be built before this program runs');
}
const shotDir = join(here, 'screenshots');
if (!existsSync(shotDir)) {
  throw new Error('screenshots/ is missing: 3-4 screenshots are required');
}
for (const name of readdirSync(shotDir).sort()) {
  const path = join(shotDir, name);
  if (!statSync(path).isFile()) continue;
  const bytes = readFileSync(path);
  const isPng = bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPng && !isJpeg) throw new Error(`screenshots/${name}: not a PNG or JPEG image`);
  if (bytes.length > SCREENSHOT_MAX_BYTES) {
    throw new Error(`screenshots/${name}: ${bytes.length} bytes, over the 256 KiB allowed`);
  }
}

// --- hand in: replace only this program's known children in the output dir ---
// The output directory itself is created when absent and never deleted.
mkdirSync(out, { recursive: true });
for (const child of ['app', 'screenshots', 'dossier.json']) {
  const target = join(out, child);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files and directories in app/ or 16 MiB of app files).
const caps = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 };
const dossier = buildDossier(out, caps);
const dossierAgain = buildDossier(out, caps);
// buildDossier returns bytes (a Uint8Array), so compare byte for byte,
// never by reference: two identical byte strings are still different objects.
if (!Buffer.from(dossier).equals(Buffer.from(dossierAgain))) {
  throw new Error('dossier.json did not regenerate identically: the entry is not deterministic');
}
writeFileSync(join(out, 'dossier.json'), dossier);

console.log(`NusaData handed in to ${out}`);
