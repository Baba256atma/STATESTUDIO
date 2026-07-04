export type {
  DomainReasoningCapabilityMetadata,
  DomainReasoningCertificationDiagnostic,
  DomainReasoningCertificationGate,
  DomainReasoningCertificationResult,
  DomainReasoningCertificationStatus,
  DomainReasoningCompatibilityResult,
  DomainReasoningDiffMetadata,
  DomainReasoningExportBundle,
  DomainReasoningExportComparison,
  DomainReasoningExportMetadata,
  DomainReasoningExportSection,
  DomainReasoningExportValidationResult,
  DomainReasoningRegressionEntry,
  DomainReasoningRegressionResult,
  DomainReasoningSnapshotMetadata,
} from "./domainReasoningExportTypes.ts";
export { DOMAIN_REASONING_EXPORT_CONTRACT_VERSION } from "./domainReasoningExportTypes.ts";
export {
  buildDomainReasoningExportBundle,
  compareDomainReasoningExportBundles,
  validateDomainReasoningExportBundle,
} from "./domainReasoningExport.ts";
export { runDomainReasoningCertification } from "./domainReasoningCertification.ts";
export {
  DOMAIN_REASONING_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_REASONING_QUERY_PUBLIC_APIS,
  DOMAIN_REASONING_REGRESSION_COMMAND,
  listDomainReasoningRegressionApiCoverage,
  runDomainReasoningRegression,
} from "./domainReasoningRegression.ts";

import {
  buildDomainReasoningExportBundle,
  compareDomainReasoningExportBundles,
  validateDomainReasoningExportBundle,
} from "./domainReasoningExport.ts";
import { runDomainReasoningCertification } from "./domainReasoningCertification.ts";
import {
  listDomainReasoningRegressionApiCoverage,
  runDomainReasoningRegression,
} from "./domainReasoningRegression.ts";

export const DomainReasoningCertificationLayer = Object.freeze({
  buildDomainReasoningExportBundle,
  validateDomainReasoningExportBundle,
  compareDomainReasoningExportBundles,
  runDomainReasoningCertification,
  runDomainReasoningRegression,
  listDomainReasoningRegressionApiCoverage,
});
