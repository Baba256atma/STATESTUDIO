export * from "./executiveResourceCertification.ts";
export type * from "./executiveResourceCertificationTypes.ts";

import * as certification from "./executiveResourceCertification.ts";

export const ExecutiveResourceCertificationPublicFoundation = Object.freeze({
  certification: Object.freeze({ ...certification }),
  metadataOnly: true,
  immutable: true,
});
