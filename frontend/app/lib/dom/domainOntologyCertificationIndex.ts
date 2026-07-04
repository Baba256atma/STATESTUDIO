export type {
  DomainOntologyCapabilityMetadata,
  DomainOntologyCertificationGate,
  DomainOntologyCertificationResult,
  DomainOntologyCertificationStatus,
  DomainOntologyCompatibilityResult,
  DomainOntologyExportBundle,
  DomainOntologyExportComparison,
  DomainOntologyExportMetadata,
  DomainOntologyExportSection,
  DomainOntologyExportValidationResult,
  DomainOntologyRegressionEntry,
  DomainOntologyRegressionResult,
} from "./domainOntologyExportTypes.ts";
export { DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION } from "./domainOntologyExportTypes.ts";
export {
  buildDomainOntologyExportBundle,
  compareDomainOntologyExportBundles,
  validateDomainOntologyExportBundle,
} from "./domainOntologyExport.ts";
export { runDomainOntologyCertification } from "./domainOntologyCertification.ts";
export {
  DOMAIN_ONTOLOGY_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_ONTOLOGY_QUERY_PUBLIC_APIS,
  DOMAIN_ONTOLOGY_REGRESSION_COMMAND,
  listDomainOntologyRegressionApiCoverage,
  runDomainOntologyRegression,
} from "./domainOntologyRegression.ts";

import {
  buildDomainOntologyExportBundle,
  compareDomainOntologyExportBundles,
  validateDomainOntologyExportBundle,
} from "./domainOntologyExport.ts";
import { runDomainOntologyCertification } from "./domainOntologyCertification.ts";
import {
  listDomainOntologyRegressionApiCoverage,
  runDomainOntologyRegression,
} from "./domainOntologyRegression.ts";

export const DomainOntologyCertificationLayer = Object.freeze({
  buildDomainOntologyExportBundle,
  validateDomainOntologyExportBundle,
  compareDomainOntologyExportBundles,
  runDomainOntologyCertification,
  runDomainOntologyRegression,
  listDomainOntologyRegressionApiCoverage,
});
