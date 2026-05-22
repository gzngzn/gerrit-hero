import { initFeatures } from "../features/registry";
import { waitForGerrit } from "../shared/gerrit-detect";
import { logInit } from "../shared/log-init";
import { getSettings } from "../shared/storage";

async function main(): Promise<void> {
  const onGerrit = await waitForGerrit();
  if (!onGerrit) return;

  const settings = await getSettings();

  if (settings.debug) {
    logInit("content", {
      host: window.location.hostname,
      active: true,
      reason: "features enabled",
    });
  }

  let cleanup = initFeatures(settings);

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SETTINGS") {
      cleanup();
      cleanup = initFeatures(message.settings);
    }
  });
}

void main();
