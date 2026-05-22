import type { Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const STORAGE_KEY = "settings";

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<Settings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}

export function detectGerritPage(pathname: string, hash = ""): import("./types").GerritPage | null {
  const route = (hash.startsWith("#") ? hash.slice(1) : hash) || pathname;

  if (route.startsWith("/c/") || route.startsWith("c/")) {
    return "change-view";
  }
  if (route.startsWith("/q/") || route.startsWith("q/")) {
    return "search";
  }
  if (route.startsWith("/dashboard") || route.startsWith("dashboard")) {
    return "dashboard";
  }
  if (pathname === "/" && (!hash || hash === "#/" || hash.startsWith("#/dashboard"))) {
    return "dashboard";
  }
  return "global";
}
