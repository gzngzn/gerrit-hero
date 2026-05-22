import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "site");
const outDir = join(siteDir, ".output");

const config = JSON.parse(readFileSync(join(siteDir, "features.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const featureCards = config.features
  .map((f) => {
    const badge =
      f.status === "coming-soon"
        ? `<span class="badge badge-soon">Coming soon</span>`
        : `<span class="badge badge-live">v${f.since}+</span>`;
    return `
    <article class="feature-card">
      <div class="feature-header">
        <h3>${escapeHtml(f.title)}</h3>
        ${badge}
      </div>
      <p>${escapeHtml(f.description)}</p>
    </article>`;
  })
  .join("\n");

const storeButton = config.storeUrl
  ? `<a class="btn btn-primary" href="${escapeHtml(config.storeUrl)}" target="_blank" rel="noopener">Install from Chrome Web Store</a>`
  : `<span class="btn btn-disabled">${escapeHtml(config.storeCta)}</span>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(config.tagline)}" />
  <title>${escapeHtml(config.name)} — Gerrit UX extension</title>
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>
  <header class="hero">
    <div class="container">
      <p class="eyebrow">Chrome Extension</p>
      <h1>${escapeHtml(config.name)}</h1>
      <p class="tagline">${escapeHtml(config.tagline)}</p>
      <div class="hero-actions">
        ${storeButton}
        <a class="btn btn-secondary" href="#features">See features</a>
      </div>
      <p class="version">Extension release v${pkg.version}</p>
    </div>
  </header>

  <main>
    <section id="features" class="container section">
      <h2>Features</h2>
      <p class="section-lead">Works on any Gerrit — corporate or public. No server setup.</p>
      <div class="feature-grid">
        ${featureCards}
      </div>
    </section>

    <section class="container section section-muted">
      <h2>How it works</h2>
      <ol class="steps">
        <li>Install Gerrit Hero from the Chrome Web Store</li>
        <li>Open any Gerrit instance in Chrome</li>
        <li>Enhanced UX activates automatically — no configuration</li>
      </ol>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(config.name)}</p>
      <nav>
        <a href="./privacy.html">Privacy</a>
      </nav>
    </div>
  </footer>
</body>
</html>`;

mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, "css"), { recursive: true });

writeFileSync(join(outDir, "index.html"), html);
writeFileSync(join(outDir, "privacy.html"), readFileSync(join(siteDir, "privacy.html"), "utf8"));
writeFileSync(join(outDir, "css/style.css"), readFileSync(join(siteDir, "css/style.css"), "utf8"));

console.log(`Site built → site/.output/ (${config.features.length} features)`);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
