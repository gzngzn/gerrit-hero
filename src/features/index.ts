import type { Feature, FeatureContext, GerritPage, Settings } from "../shared/types";
import { createGerritAdapter } from "../adapters/gerrit-adapter";

const features: Feature[] = [];

export function registerFeature(feature: Feature): void {
  features.push(feature);
}

export function initFeatures(settings: Settings): () => void {
  const adapter = createGerritAdapter();
  const page = adapter.detectPage();
  const cleanups: (() => void)[] = [];

  const ctx: FeatureContext = {
    adapter,
    settings,
    debug: settings.debug,
  };

  for (const feature of features) {
    const enabled = settings.features[feature.id] ?? true;
    if (!enabled) continue;
    if (page && !feature.pages.includes(page) && !feature.pages.includes("global")) {
      continue;
    }

    try {
      const cleanup = feature.init(ctx);
      if (typeof cleanup === "function") {
        cleanups.push(cleanup);
      }
    } catch (err) {
      if (settings.debug) {
        console.error(`[Gerrit Hero] Feature "${feature.id}" failed:`, err);
      }
      void chrome.runtime.sendMessage({
        type: "REPORT_ERROR",
        featureId: feature.id,
        error: String(err),
        url: window.location.href,
      });
    }
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
    for (const feature of features) feature.destroy?.();
  };
}

export function getRegisteredFeatures(): readonly Feature[] {
  return features;
}

export type { GerritPage };
