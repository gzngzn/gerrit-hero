import { getSettings } from "../shared/storage";
import type { Message } from "../shared/types";
import { logInit } from "../shared/log-init";

void getSettings().then((settings) => {
  if (settings.debug) {
    logInit("background", { active: true, reason: "service worker ready" });
  }
});

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === "GET_SETTINGS") {
    void getSettings().then((settings) => {
      sendResponse({ type: "SETTINGS", settings });
    });
    return true;
  }

  if (message.type === "REPORT_ERROR") {
    console.warn(`[Gerrit Hero] Feature error (${message.featureId}):`, message.error, message.url);
  }
});
