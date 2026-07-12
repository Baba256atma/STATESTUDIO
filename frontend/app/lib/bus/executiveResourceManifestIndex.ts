export * from "./executiveResourceManifest.ts";
export type * from "./executiveResourceManifestTypes.ts";

import * as manifest from "./executiveResourceManifest.ts";

export const ExecutiveResourceManifestPublicFoundation = Object.freeze({
  manifest: Object.freeze({ ...manifest }),
  metadataOnly: true,
  immutable: true,
});
