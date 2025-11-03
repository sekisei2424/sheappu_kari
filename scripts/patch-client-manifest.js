/*
 * Workaround for Vercel CLI lstat error on Next.js 15 where it expects
 * .next/server/app/(group)/page_client-reference-manifest.js to exist.
 * Next.js emits the file at .next/server/app/page_client-reference-manifest.js.
 * We copy it into any subdirectory that contains a page.js but lacks the manifest.
 */

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function main() {
  const appDir = path.join(process.cwd(), '.next', 'server', 'app');
  const rootManifest = path.join(appDir, 'page_client-reference-manifest.js');

  if (!exists(appDir)) return; // nothing to do locally before build
  if (!exists(rootManifest)) return; // Next may change layout; only patch when present

  const entries = fs.readdirSync(appDir, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const dirPath = path.join(appDir, ent.name);
    const pageJs = path.join(dirPath, 'page.js');
    const manifestInDir = path.join(dirPath, 'page_client-reference-manifest.js');

    if (exists(pageJs) && !exists(manifestInDir)) {
      try {
        fs.copyFileSync(rootManifest, manifestInDir);
        // eslint-disable-next-line no-console
        console.log(`[patch] Copied client-reference-manifest into ${path.relative(process.cwd(), dirPath)}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[patch] Failed to copy manifest into ${dirPath}:`, err?.message || err);
      }
    }
  }
}

main();
