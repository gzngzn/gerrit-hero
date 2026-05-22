import { BUILD_LABEL, BUILD_TIME } from "./version";

const STYLE = "color:#1a73e8;font-weight:bold";
const RESET = "color:inherit;font-weight:normal";

export type InitContext = "content" | "background";

export interface InitLogDetails {
  host?: string;
  active?: boolean;
  reason?: string;
}

export function logInit(context: InitContext, details: InitLogDetails = {}): void {
  if (context === "content" && details.active) {
    console.info(`%c[Gerrit Hero ${BUILD_LABEL}]%c Plugin is running on this page`, STYLE, RESET);
  } else if (context === "content" && details.active === false) {
    console.warn(
      `%c[Gerrit Hero ${BUILD_LABEL}]%c Plugin loaded but inactive — add "%s" in extension options`,
      STYLE,
      RESET,
      details.host ?? "this host",
    );
  } else {
    console.info(`%c[Gerrit Hero ${BUILD_LABEL}]%c ${context} ready`, STYLE, RESET);
  }

  const meta = [
    context,
    `built ${BUILD_TIME}`,
    details.host ? `host: ${details.host}` : "",
    details.active !== undefined ? (details.active ? "status: active" : "status: inactive") : "",
    details.reason ?? "",
  ]
    .filter(Boolean)
    .join(" | ");

  console.log(`%c[Gerrit Hero ${BUILD_LABEL}]%c ${meta}`, STYLE, RESET);
}
