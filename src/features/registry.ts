import { registerFeature } from "./index";
import { backtickCodeWrap } from "./backtick-code-wrap";
import { debugBadge } from "./debug-badge";

registerFeature(backtickCodeWrap);
registerFeature(debugBadge);

export { initFeatures, getRegisteredFeatures } from "./index";
