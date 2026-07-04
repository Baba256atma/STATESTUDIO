export {
  DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION,
} from "./domainRegistryExportTypes.ts";
export type {
  DomainRegistryCertificationGate,
  DomainRegistryCertificationResult,
  DomainRegistryCertificationStatus,
  DomainRegistryExportBundle,
  DomainRegistryExportComparison,
  DomainRegistryExportMetadata,
  DomainRegistryExportSection,
  DomainRegistryExportValidationResult,
  DomainRegistryRegressionEntry,
  DomainRegistryRegressionResult,
} from "./domainRegistryExportTypes.ts";
export {
  buildDomainRegistryExportBundle,
  compareDomainRegistryExportBundles,
  isExportBundleReproducible,
  validateDomainRegistryExportBundle,
} from "./domainRegistryExport.ts";
export { runDomainRegistryCertification } from "./domainRegistryCertification.ts";
export {
  DOMAIN_REGISTRY_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_REGISTRY_REGRESSION_COMMAND,
  listDomainRegistryRegressionApiCoverage,
  runDomainRegistryRegression,
} from "./domainRegistryRegression.ts";

import {
  buildDomainRegistryExportBundle,
  compareDomainRegistryExportBundles,
  validateDomainRegistryExportBundle,
} from "./domainRegistryExport.ts";
import { runDomainRegistryCertification } from "./domainRegistryCertification.ts";
import {
  listDomainRegistryRegressionApiCoverage,
  runDomainRegistryRegression,
} from "./domainRegistryRegression.ts";

export const DomainRegistryCertificationLayer = Object.freeze({
  buildDomainRegistryExportBundle,
  validateDomainRegistryExportBundle,
  compareDomainRegistryExportBundles,
  runDomainRegistryCertification,
  runDomainRegistryRegression,
  listDomainRegistryRegressionApiCoverage,
});
