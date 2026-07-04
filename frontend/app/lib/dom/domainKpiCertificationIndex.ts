export type {
  DomainKpiCapabilityMetadata,
  DomainKpiCertificationGate,
  DomainKpiCertificationResult,
  DomainKpiCertificationStatus,
  DomainKpiCompatibilityResult,
  DomainKpiExportBundle,
  DomainKpiExportComparison,
  DomainKpiExportMetadata,
  DomainKpiExportSection,
  DomainKpiExportValidationResult,
  DomainKpiRegressionEntry,
  DomainKpiRegressionResult,
} from "./domainKpiExportTypes.ts";
export { DOMAIN_KPI_EXPORT_CONTRACT_VERSION } from "./domainKpiExportTypes.ts";
export {
  buildDomainKpiExportBundle,
  compareDomainKpiExportBundles,
  validateDomainKpiExportBundle,
} from "./domainKpiExport.ts";
export { runDomainKpiCertification } from "./domainKpiCertification.ts";
export {
  DOMAIN_KPI_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_KPI_QUERY_PUBLIC_APIS,
  DOMAIN_KPI_REGRESSION_COMMAND,
  listDomainKpiRegressionApiCoverage,
  runDomainKpiRegression,
} from "./domainKpiRegression.ts";

import {
  buildDomainKpiExportBundle,
  compareDomainKpiExportBundles,
  validateDomainKpiExportBundle,
} from "./domainKpiExport.ts";
import { runDomainKpiCertification } from "./domainKpiCertification.ts";
import {
  listDomainKpiRegressionApiCoverage,
  runDomainKpiRegression,
} from "./domainKpiRegression.ts";

export const DomainKpiCertificationLayer = Object.freeze({
  buildDomainKpiExportBundle,
  validateDomainKpiExportBundle,
  compareDomainKpiExportBundles,
  runDomainKpiCertification,
  runDomainKpiRegression,
  listDomainKpiRegressionApiCoverage,
});
