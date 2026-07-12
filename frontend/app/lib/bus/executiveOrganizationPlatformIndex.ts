export * from "./executiveOrganizationPlatform.ts";
export type * from "./executiveOrganizationPlatformTypes.ts";

import * as platform from "./executiveOrganizationPlatform.ts";

export const ExecutiveOrganizationPlatformPublicFoundation = Object.freeze({
  platform: Object.freeze({ ...platform }),
  metadataOnly: true,
  immutable: true,
});
