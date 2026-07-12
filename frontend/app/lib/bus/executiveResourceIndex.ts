export * from "./executiveResourceContracts.ts";
export type * from "./executiveResourceTypes.ts";

import * as contracts from "./executiveResourceContracts.ts";

export const ExecutiveResourcePublicFoundation = Object.freeze({
  contracts: Object.freeze({ ...contracts }),
  metadataOnly: true,
  immutable: true,
});
