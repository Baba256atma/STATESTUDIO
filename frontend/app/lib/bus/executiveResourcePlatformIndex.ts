export * from "./executiveResourcePlatform.ts";
export type * from "./executiveResourcePlatformTypes.ts";

import * as platform from "./executiveResourcePlatform.ts";

export const ExecutiveResourcePlatformPublicFoundation = Object.freeze({
  platform: Object.freeze({ ...platform }),
  metadataOnly: true,
  immutable: true,
});
