export * from "./executiveResourceRegistry.ts";
export type * from "./executiveResourceRegistryTypes.ts";

import * as registry from "./executiveResourceRegistry.ts";

export const ExecutiveResourceRegistryPublicFoundation = Object.freeze({
  registry: Object.freeze({ ...registry }),
  metadataOnly: true,
  immutable: true,
});
