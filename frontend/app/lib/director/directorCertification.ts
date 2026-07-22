import { DirectorCertificationCompatibility } from "./directorCertificationCompatibility.ts";
import { DirectorCertificationCriteria } from "./directorCertificationCriteria.ts";
import { DirectorCertificationPublicExportNames } from "./directorCertificationExports.ts";
import { DirectorCertificationGates } from "./directorCertificationGates.ts";
import { DirectorCertificationMetadata } from "./directorCertificationMetadata.ts";

export {
  DirectorCertificationCompatibility,
  DirectorCertificationCriteria,
  DirectorCertificationGates,
  DirectorCertificationMetadata,
};

export const DirectorCertification = Object.freeze({
  metadata: DirectorCertificationMetadata,
  criteria: DirectorCertificationCriteria,
  gates: DirectorCertificationGates,
  compatibility: DirectorCertificationCompatibility,
  publicExports: DirectorCertificationPublicExportNames,
  producesFor: Object.freeze(["Director Freeze", "Director Public Index"] as const),
  services: false,
  factories: false,
  certificationEngine: false,
  execution: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const DirectorCertificationSummary = Object.freeze({
  id: DirectorCertificationMetadata.certificationId,
  version: DirectorCertificationMetadata.certificationVersion,
  namespace: DirectorCertificationMetadata.certificationNamespace,
  status: DirectorCertificationMetadata.certificationStatus,
  readiness: DirectorCertificationMetadata.readiness,
  criteriaCount: DirectorCertificationMetadata.criteriaCount,
  gateCount: DirectorCertificationMetadata.gateCount,
  compatibilityCount: DirectorCertificationMetadata.compatibilityCount,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDirectorCertificationSummary = () =>
  DirectorCertificationSummary;
export const getDirectorCertificationStatus = () =>
  DirectorCertificationMetadata.certificationStatus;
export const getDirectorCertificationReadiness = () =>
  DirectorCertificationMetadata.readiness;

