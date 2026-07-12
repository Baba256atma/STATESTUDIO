export * from "./executiveOrganizationRegistry.ts";
export type * from "./executiveOrganizationRegistryTypes.ts";

import * as registry from "./executiveOrganizationRegistry.ts";

export const ExecutiveOrganizationRegistryPublicFoundation = Object.freeze({
  registry: Object.freeze({ ...registry }),
  metadataOnly: true,
  immutable: true,
});
