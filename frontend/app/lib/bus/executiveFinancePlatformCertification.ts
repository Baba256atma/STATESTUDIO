import {
  buildExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertification,
  runExecutiveFinancePlatformCertification,
} from "./executiveFinancePlatformCertificationRunner.ts";
import { buildExecutiveFinancePlatformCertificationManifest } from "./executiveFinancePlatformCertificationManifest.ts";

export const ExecutiveFinancePlatformCertification = Object.freeze({
  buildExecutiveFinancePlatformCertification,
  runExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertificationManifest: buildExecutiveFinancePlatformCertificationManifest,
});
