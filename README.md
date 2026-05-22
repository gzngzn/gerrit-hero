# Gerrit Hero

Chrome extension that improves [Gerrit Code Review](https://www.gerritcodereview.com/) UX. Works on any Gerrit instance — no server changes.

**Landing:** [gzngzn.github.io/gerrit-hero](https://gzngzn.github.io/gerrit-hero/)

## What's in this repo

| Path | Purpose |
| ---- | ------- |
| `src/` | Extension source |
| `site/` | GitHub Pages landing + privacy policy |
| `README.md` | This file |

No internal docs, notes, or instance configs — development docs stay local only.

## Development

```bash
npm install
npm run build
```

Load `dist/` in `chrome://extensions` (Developer mode).

```bash
npm test              # tests
npm run dev           # watch build
npm run pack          # gerrit-hero.zip for Chrome Web Store
npm run build:site    # preview landing locally
```

## License

[MIT](./LICENSE)
