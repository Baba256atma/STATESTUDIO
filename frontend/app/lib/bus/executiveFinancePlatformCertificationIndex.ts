export type * from "./executiveFinancePlatformCertificationTypes.ts";
export {
  buildExecutiveFinancePlatformCertificationRegistry,
  buildExecutiveFinancePlatformCertificationSummary,
} from "./executiveFinancePlatformCertificationRegistry.ts";
export { buildExecutiveFinancePlatformCertificationManifest } from "./executiveFinancePlatformCertificationManifest.ts";
export {
  buildExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertification,
  runExecutiveFinancePlatformCertification,
} from "./executiveFinancePlatformCertificationRunner.ts";
export { ExecutiveFinancePlatformCertification } from "./executiveFinancePlatformCertification.ts";

import {
  buildExecutiveFinancePlatformCertificationRegistry,
  buildExecutiveFinancePlatformCertificationSummary,
} from "./executiveFinancePlatformCertificationRegistry.ts";
import { buildExecutiveFinancePlatformCertificationManifest } from "./executiveFinancePlatformCertificationManifest.ts";
import {
  buildExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertification,
  runExecutiveFinancePlatformCertification,
} from "./executiveFinancePlatformCertificationRunner.ts";
import { ExecutiveFinancePlatformCertification } from "./executiveFinancePlatformCertification.ts";

export const ExecutiveFinancePlatformCertificationFoundation = Object.freeze({
  registry: Object.freeze({
    buildExecutiveFinancePlatformCertificationRegistry,
    buildExecutiveFinancePlatformCertificationSummary,
  }),
  manifest: Object.freeze({
    buildExecutiveFinancePlatformCertificationManifest,
  }),
  runner: Object.freeze({
    runExecutiveFinancePlatformCertification,
    getExecutiveFinancePlatformCertification,
    buildExecutiveFinancePlatformCertification,
  }),
  certification: ExecutiveFinancePlatformCertification,
  summary: Object.freeze({
    version: "1.0.0" as const,
    phase: "BUS-28:7" as const,
  }),
  metadataOnly: true,
  immutable: true,
});
