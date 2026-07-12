export * from "./executiveResourcePlatformFreeze.ts";
export type * from "./executiveResourcePlatformFreezeTypes.ts";

import * as freeze from "./executiveResourcePlatformFreeze.ts";

export const ExecutiveResourcePlatformFreezePublicFoundation = Object.freeze({
  freeze: Object.freeze({ ...freeze }),
  metadataOnly: true,
  immutable: true,
});
