export * from "./executiveOrganizationCertification.ts";
export type * from "./executiveOrganizationCertificationTypes.ts";

import * as certification from "./executiveOrganizationCertification.ts";

export const ExecutiveOrganizationCertificationPublicFoundation = Object.freeze({
  certification: Object.freeze({ ...certification }),
  metadataOnly: true,
  immutable: true,
});
