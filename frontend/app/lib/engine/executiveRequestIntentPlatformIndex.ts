export { ExecutiveRequestIntentPlatformRegistry } from "./executiveRequestIntentPlatformRegistry.ts";
export { ExecutiveRequestIntentPlatformMetadata } from "./executiveRequestIntentPlatformMetadata.ts";
export { ExecutiveRequestIntentPlatform, getExecutiveRequestIntentPlatform, getExecutiveRequestIntentPlatformSummary } from "./executiveRequestIntentPlatform.ts";

import { ExecutiveRequestIntentPlatformMetadata } from "./executiveRequestIntentPlatformMetadata.ts";
import { ExecutiveRequestIntentPlatformRegistry } from "./executiveRequestIntentPlatformRegistry.ts";

export const getExecutiveRequestIntentPlatformRegistry = () => ExecutiveRequestIntentPlatformRegistry;
export const getExecutiveRequestIntentPlatformMetadata = () => ExecutiveRequestIntentPlatformMetadata;
