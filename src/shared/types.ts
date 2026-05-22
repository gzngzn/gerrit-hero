export type GerritPage = "change-view" | "dashboard" | "diff" | "search" | "global";

export interface Settings {
  features: Record<string, boolean>;
  debug: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  features: {},
  debug: false,
};

export type MessageType = "GET_SETTINGS" | "SETTINGS" | "FEATURE_TOGGLES" | "REPORT_ERROR";

export interface GetSettingsMessage {
  type: "GET_SETTINGS";
}

export interface SettingsMessage {
  type: "SETTINGS";
  settings: Settings;
}

export interface FeatureTogglesMessage {
  type: "FEATURE_TOGGLES";
  featureId: string;
  enabled: boolean;
}

export interface ReportErrorMessage {
  type: "REPORT_ERROR";
  featureId: string;
  error: string;
  url: string;
}

export type Message =
  | GetSettingsMessage
  | SettingsMessage
  | FeatureTogglesMessage
  | ReportErrorMessage;

export interface Feature {
  id: string;
  name: string;
  pages: GerritPage[];
  init(ctx: FeatureContext): void | (() => void);
  destroy?(): void;
}

export interface FeatureContext {
  adapter: GerritAdapter;
  settings: Settings;
  debug: boolean;
}

export interface GerritAdapter {
  version: string | null;
  detectPage(): GerritPage | null;
  getChangeMetadata(): Element | null;
  getDiffContainer(): Element | null;
  getCommentThreads(): Element[];
  observeDOM(callback: MutationCallback): () => void;
}
