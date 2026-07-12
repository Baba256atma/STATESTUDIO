export * from "./executiveOrganizationManifest.ts";
export type * from "./executiveOrganizationManifestTypes.ts";

import * as manifest from "./executiveOrganizationManifest.ts";

export const ExecutiveOrganizationManifestPublicFoundation = Object.freeze({
  manifest: Object.freeze({ ...manifest }),
  metadataOnly: true,
  immutable: true,
});
