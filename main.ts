import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Validate inputs before touching the output.
const appIndexPath = join(repoRoot, "app", "index.html");
if (!existsSync(appIndexPath)) {
  throw new Error(`Missing app/index.html at ${appIndexPath}`);
}
if (statSync(appIndexPath).size > 1048576) {
  throw new Error("app/index.html exceeds 1 MiB (1048576 bytes)");
}

const vendorPath = join(repoRoot, "vendor", "makefun-frontend.ts");
if (!existsSync(vendorPath)) {
  throw new Error(`Missing vendor/makefun-frontend.ts at ${vendorPath}`);
}

const screenshotsDir = join(repoRoot, "screenshots");
if (!existsSync(screenshotsDir)) {
  throw new Error(`Missing screenshots/ directory at ${screenshotsDir}`);
}
const screenshotFiles = readdirSync(screenshotsDir)
  .filter((name) => /\.(png|jpe?g)$/i.test(name))
  .sort();
if (screenshotFiles.length < 3 || screenshotFiles.length > 4) {
  throw new Error(`screenshots/ must hold 3 or 4 image files, found ${screenshotFiles.length}`);
}
for (const name of screenshotFiles) {
  const size = statSync(join(screenshotsDir, name)).size;
  if (size > 262144) {
    throw new Error(`Screenshot ${name} exceeds 262144 bytes`);
  }
}

// Prepare the output. Never remove outDir itself — in the grader it is
// a mounted directory, so removing it fails. Remove only its known children.
mkdirSync(outDir, { recursive: true });
rmSync(join(outDir, "app"), { recursive: true, force: true });
rmSync(join(outDir, "screenshots"), { recursive: true, force: true });
rmSync(join(outDir, "dossier.json"), { recursive: true, force: true });

// Copy app/ and then screenshots/ from the repo into outDir.
const appSrc = join(repoRoot, "app");
if (!existsSync(appSrc)) {
  throw new Error(`Missing app/ directory at ${appSrc}`);
}
cpSync(appSrc, join(outDir, "app"), { recursive: true });

const screenshotsSrc = join(repoRoot, "screenshots");
if (!existsSync(screenshotsSrc)) {
  throw new Error(`Missing screenshots/ directory at ${screenshotsSrc}`);
}
cpSync(screenshotsSrc, join(outDir, "screenshots"), { recursive: true });

// Build the dossier and write it. buildDossier returns the dossier bytes
// (a Uint8Array of UTF-8 JSON), so write those bytes directly.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

// Verify the output.
const parsed = JSON.parse(readFileSync(join(outDir, "dossier.json"), "utf-8"));
if (parsed === null || typeof parsed !== "object") {
  throw new Error("dossier.json did not parse as a non-null object");
}
if (!existsSync(join(outDir, "app", "index.html"))) {
  throw new Error("Output verification failed: app/index.html missing in outDir");
}

console.log(`NusaData: wrote ${join(outDir, "dossier.json")} (${dossier.length} bytes)`);
