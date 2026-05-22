import type { Feature } from "../../shared/types";

/**
 * Placeholder feature — confirms the extension is active on a Gerrit page.
 * Remove or replace once real features from FEATURES.md are implemented.
 */
export const debugBadge: Feature = {
  id: "debug-badge",
  name: "Debug Badge",
  pages: ["global"],
  init(ctx) {
    if (!ctx.debug) return;

    const badge = document.createElement("div");
    badge.textContent = "Gerrit Hero";
    badge.setAttribute("data-gerrit-hero", "badge");

    const shadowHost = document.createElement("div");
    shadowHost.style.cssText = "position:fixed;bottom:12px;right:12px;z-index:99999;";
    const shadow = shadowHost.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      .badge {
        background: #1a73e8;
        color: #fff;
        padding: 4px 10px;
        border-radius: 4px;
        font: 12px/1.4 system-ui, sans-serif;
        box-shadow: 0 2px 6px rgba(0,0,0,.25);
      }
    `;

    badge.className = "badge";
    shadow.append(style, badge);
    document.body.append(shadowHost);

    return () => shadowHost.remove();
  },
};
