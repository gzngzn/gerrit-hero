export function isGerritPage(): boolean {
  if (document.querySelector("gr-app") !== null) return true;
  if (document.querySelector('meta[name="gerrit-version"]') !== null) return true;

  const { pathname, hash } = window.location;
  if (/^\/(c|q|dashboard)(\/|$)/.test(pathname)) return true;
  if (/#\/(c|q|dashboard)(\/|$)/.test(hash)) return true;
  if (pathname === "/" && hash.startsWith("#/")) return true;

  return false;
}

export function waitForGerrit(timeoutMs = 8000): Promise<boolean> {
  if (isGerritPage()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (isGerritPage()) {
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(isGerritPage());
    }, timeoutMs);
  });
}
