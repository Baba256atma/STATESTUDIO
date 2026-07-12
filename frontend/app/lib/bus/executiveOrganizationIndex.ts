export * from "./executiveOrganizationContracts.ts";
export type * from "./executiveOrganizationTypes.ts";

import * as contracts from "./executiveOrganizationContracts.ts";
import type * as types from "./executiveOrganizationTypes.ts";

export const ExecutiveOrganizationPublicFoundation = Object.freeze({
  contracts: Object.freeze({ ...contracts }),
  metadataOnly: true,
  immutable: true,
});

export type ExecutiveOrganizationPublicTypes = typeof types;
