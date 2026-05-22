import { getSettings, saveSettings } from "../shared/storage";
import type { Settings } from "../shared/types";

function render(settings: Settings): void {
  const debugEl = document.getElementById("debug") as HTMLInputElement;
  debugEl.checked = settings.debug;
}

async function load(): Promise<void> {
  render(await getSettings());
}

async function save(): Promise<void> {
  const debugEl = document.getElementById("debug") as HTMLInputElement;
  const current = await getSettings();

  const settings: Settings = {
    features: current.features,
    debug: debugEl.checked,
  };

  await saveSettings(settings);

  const status = document.getElementById("status")!;
  status.textContent = "Saved.";
  setTimeout(() => {
    status.textContent = "";
  }, 2000);
}

document.getElementById("save")!.addEventListener("click", () => void save());
void load();
