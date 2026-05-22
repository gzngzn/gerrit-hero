import type { GerritAdapter, GerritPage } from "../shared/types";
import { detectGerritPage } from "../shared/storage";

function querySelector<T extends Element>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

function querySelectorAll<T extends Element>(selector: string): T[] {
  return [...document.querySelectorAll<T>(selector)];
}

function detectVersion(): string | null {
  const meta = querySelector<HTMLMetaElement>('meta[name="gerrit-version"]');
  if (meta?.content) return meta.content;

  const app = querySelector("gr-app");
  if (app) return "3.x";

  return null;
}

export function createGerritAdapter(): GerritAdapter {
  const version = detectVersion();

  return {
    version,

    detectPage(): GerritPage | null {
      return detectGerritPage(window.location.pathname, window.location.hash);
    },

    getChangeMetadata(): Element | null {
      return querySelector("gr-change-metadata") ?? querySelector("gr-change-view") ?? null;
    },

    getDiffContainer(): Element | null {
      return querySelector("gr-diff-view") ?? querySelector(".diffContainer") ?? null;
    },

    getCommentThreads(): Element[] {
      return querySelectorAll("gr-comment-thread, .comment-thread");
    },

    observeDOM(callback: MutationCallback): () => void {
      const observer = new MutationObserver(callback);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    },
  };
}
