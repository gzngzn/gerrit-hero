/// <reference types="chrome" />

/** Chromium Shadow DOM Selection API (gr-textarea lives in shadow roots). */
interface ShadowRoot {
  getSelection(): Selection | null;
}
