// main.ts — NusaData hand-in program.
// Copies app/ and screenshots/ from this repository into the output
// directory, then writes dossier.json there with buildDossier from
// vendor/makefun-frontend.ts. Node 22, standard library only.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Fail fast, before copying anything, when an input breaks the gate
// limits — a missing page, an oversize index, or bad screenshots would
// otherwise only surface inside buildDossier after the output was built.
function assertInputs(): void {
  const index = join(repoRoot, "app", "index.html");
  if (!existsSync(index)) throw new Error("missing app/index.html");
  const indexBytes = statSync(index).size;
  if (indexBytes > 1024 * 1024) throw new Error(`app/index.html is ${indexBytes} bytes, over the 1 MiB cap`);
  if (!existsSync(join(repoRoot, "vendor", "makefun-frontend.ts"))) {
    throw new Error("missing vendor/makefun-frontend.ts (kit copy, unchanged)");
  }
  const shots = readdirSync(join(repoRoot, "screenshots"))
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort();
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`screenshots/ holds ${shots.length} images, need 3 or 4`);
  }
  for (const shot of shots) {
    const bytes = statSync(join(repoRoot, "screenshots", shot)).size;
    if (bytes > 262144) throw new Error(`screenshots/${shot} is ${bytes} bytes, over the 256 KiB cap`);
  }
}

function copyTree(name: string): void {
  const from = join(repoRoot, name);
  if (!existsSync(from)) {
    throw new Error(`missing ${name}/ in ${repoRoot}`);
  }
  cpSync(from, join(outDir, name), { recursive: true });
}

assertInputs();
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
const dossierPath = join(outDir, "dossier.json");
writeFileSync(dossierPath, dossier);
// Guard the output too: the dossier must be valid JSON and the copied
// page must be present, otherwise the hand-in is silently incomplete.
const parsed = JSON.parse(readFileSync(dossierPath, "utf8"));
if (typeof parsed !== "object" || parsed === null) throw new Error("dossier.json did not parse as an object");
if (!existsSync(join(outDir, "app", "index.html"))) throw new Error("output is missing app/index.html");
console.log(`NusaData: wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
