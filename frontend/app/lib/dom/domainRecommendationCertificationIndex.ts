export type {
  DomainRecommendationCapabilityMetadata,
  DomainRecommendationCertificationDiagnostic,
  DomainRecommendationCertificationGate,
  DomainRecommendationCertificationResult,
  DomainRecommendationCertificationStatus,
  DomainRecommendationCompatibilityResult,
  DomainRecommendationDiffMetadata,
  DomainRecommendationExportBundle,
  DomainRecommendationExportComparison,
  DomainRecommendationExportMetadata,
  DomainRecommendationExportSection,
  DomainRecommendationExportValidationResult,
  DomainRecommendationRegressionEntry,
  DomainRecommendationRegressionResult,
  DomainRecommendationSnapshotMetadata,
} from "./domainRecommendationExportTypes.ts";
export { DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION } from "./domainRecommendationExportTypes.ts";
export {
  buildDomainRecommendationExportBundle,
  compareDomainRecommendationExportBundles,
  validateDomainRecommendationExportBundle,
} from "./domainRecommendationExport.ts";
export { runDomainRecommendationCertification } from "./domainRecommendationCertification.ts";
export {
  DOMAIN_RECOMMENDATION_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_RECOMMENDATION_QUERY_PUBLIC_APIS,
  DOMAIN_RECOMMENDATION_REGRESSION_COMMAND,
  listDomainRecommendationRegressionApiCoverage,
  runDomainRecommendationRegression,
} from "./domainRecommendationRegression.ts";

import {
  buildDomainRecommendationExportBundle,
  compareDomainRecommendationExportBundles,
  validateDomainRecommendationExportBundle,
} from "./domainRecommendationExport.ts";
import { runDomainRecommendationCertification } from "./domainRecommendationCertification.ts";
import {
  listDomainRecommendationRegressionApiCoverage,
  runDomainRecommendationRegression,
} from "./domainRecommendationRegression.ts";

export const DomainRecommendationCertificationLayer = Object.freeze({
  buildDomainRecommendationExportBundle,
  validateDomainRecommendationExportBundle,
  compareDomainRecommendationExportBundles,
  runDomainRecommendationCertification,
  runDomainRecommendationRegression,
  listDomainRecommendationRegressionApiCoverage,
});
