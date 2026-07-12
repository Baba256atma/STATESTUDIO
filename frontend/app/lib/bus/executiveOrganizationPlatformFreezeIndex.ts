export * from "./executiveOrganizationPlatformFreeze.ts";
export type * from "./executiveOrganizationPlatformFreezeTypes.ts";

import * as freeze from "./executiveOrganizationPlatformFreeze.ts";

export const ExecutiveOrganizationPlatformFreezePublicFoundation = Object.freeze({
  freeze: Object.freeze({ ...freeze }),
  metadataOnly: true,
  immutable: true,
});
