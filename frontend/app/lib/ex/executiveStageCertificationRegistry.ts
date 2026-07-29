/**
 * EX-1:7 — Executive Stage Certification Registry.
 *
 * Deterministic catalogue of certification domains, gates, statuses,
 * audits, and baselines.
 *
 * Ownership: owned exclusively by EX-1:7.
 */

import { ExecutiveStageCertificationAudits } from "./executiveStageCertificationAudits.ts";
import {
  ExecutiveStageCertificationDomainNames,
  ExecutiveStageCertificationDomains,
} from "./executiveStageCertificationDomains.ts";
import {
  ExecutiveStageCertificationGateNames,
  ExecutiveStageCertificationGates,
} from "./executiveStageCertificationGates.ts";
import {
  ExecutiveStageCertificationIdentity,
  ExecutiveStageCertificationMetadata,
  ExecutiveStageCertificationScope,
} from "./executiveStageCertificationMetadata.ts";
import {
  ExecutiveStageCertificationResultModel,
  ExecutiveStageCertificationStatusNames,
  ExecutiveStageCertificationStatuses,
  ExecutiveStageFreezeProgressionStatus,
} from "./executiveStageCertificationResult.ts";

/**
 * Canonical certification registry / baseline catalogue.
 */
export const ExecutiveStageCertificationRegistry = Object.freeze({
  registryId: "EX-1:7/CertificationRegistry",
  sourcePhase: "EX-1:7" as const,
  identity: ExecutiveStageCertificationIdentity,
  domains: ExecutiveStageCertificationDomains,
  domainNames: ExecutiveStageCertificationDomainNames,
  gates: ExecutiveStageCertificationGates,
  gateNames: ExecutiveStageCertificationGateNames,
  statuses: ExecutiveStageCertificationStatuses,
  statusNames: ExecutiveStageCertificationStatusNames,
  freezeProgressionStatus: ExecutiveStageFreezeProgressionStatus,
  resultModel: ExecutiveStageCertificationResultModel,
  audits: ExecutiveStageCertificationAudits,
  scope: ExecutiveStageCertificationScope,
  metadata: ExecutiveStageCertificationMetadata,
  baselines: Object.freeze({
    certificationDomains: ExecutiveStageCertificationDomains.length,
    certificationGates: ExecutiveStageCertificationGates.length,
    qualityGates: ExecutiveStageCertificationAudits.qualityGateCount,
    runtimeCompatibilityChecks:
      ExecutiveStageCertificationAudits.runtimeCompatibilityCheckCount,
    certificationStatuses: ExecutiveStageCertificationStatuses.length,
    certificationResultSections:
      ExecutiveStageCertificationResultModel.fieldCount,
  }),
  introducesNewApis: false as const,
  modifiesPlatform: false as const,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
