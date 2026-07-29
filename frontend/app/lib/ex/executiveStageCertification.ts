/**
 * EX-1:7 — Executive Stage Certification.
 *
 * Formal read-only certification gate for the Executive Stage.
 * Consumes EX-1:6 Platform public surface only.
 * Verification only — never modifies the platform.
 *
 * Ownership: owned exclusively by EX-1:7.
 *
 * Public exports:
 *   ExecutiveStageCertificationId
 *   ExecutiveStageCertificationVersion
 *   ExecutiveStageCertificationName
 *   ExecutiveStageCertificationNamespace
 *   ExecutiveStageCertificationStatus
 *   ExecutiveStageCertificationReadiness
 *   ExecutiveStageCertification
 *   getExecutiveStageCertificationSummary()
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
  ExecutiveStageCertificationGuarantees,
  ExecutiveStageCertificationIdentity,
  ExecutiveStageCertificationId,
  ExecutiveStageCertificationMetadata,
  ExecutiveStageCertificationName,
  ExecutiveStageCertificationNamespace,
  ExecutiveStageCertificationNextPhase,
  ExecutiveStageCertificationPrinciples,
  ExecutiveStageCertificationProhibitedSurfaces,
  ExecutiveStageCertificationReadiness,
  ExecutiveStageCertificationScope,
  ExecutiveStageCertificationStatus,
  ExecutiveStageCertificationVersion,
  ExecutiveStageReleaseReadinessConditions,
} from "./executiveStageCertificationMetadata.ts";
import { ExecutiveStageCertificationRegistry } from "./executiveStageCertificationRegistry.ts";
import {
  ExecutiveStageCertificationResultModel,
  ExecutiveStageCertificationStatusNames,
  ExecutiveStageCertificationStatuses,
  ExecutiveStageFreezeProgressionStatus,
} from "./executiveStageCertificationResult.ts";
import { ExecutiveStagePlatform } from "./executiveStagePlatform.ts";

export {
  ExecutiveStageCertificationId,
  ExecutiveStageCertificationName,
  ExecutiveStageCertificationNamespace,
  ExecutiveStageCertificationReadiness,
  ExecutiveStageCertificationStatus,
  ExecutiveStageCertificationVersion,
};

/**
 * Canonical immutable Executive Stage Certification aggregate.
 */
export const ExecutiveStageCertification = Object.freeze({
  identity: ExecutiveStageCertificationIdentity,
  platform: ExecutiveStagePlatform,
  metadata: ExecutiveStageCertificationMetadata,
  registry: ExecutiveStageCertificationRegistry,
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
  guarantees: ExecutiveStageCertificationGuarantees,
  principles: ExecutiveStageCertificationPrinciples,
  releaseReadinessConditions: ExecutiveStageReleaseReadinessConditions,
  prohibitedSurfaces: ExecutiveStageCertificationProhibitedSurfaces,
  qualityGates: ExecutiveStageCertificationAudits.qualityGates,
  runtimeCompatibilityChecks:
    ExecutiveStageCertificationAudits.runtimeCompatibilityChecks,
  baselines: ExecutiveStageCertificationRegistry.baselines,
  statistics: Object.freeze({
    domainCount: ExecutiveStageCertificationDomains.length,
    gateCount: ExecutiveStageCertificationGates.length,
    statusCount: ExecutiveStageCertificationStatuses.length,
    scopeCount: ExecutiveStageCertificationScope.length,
    qualityGateCount: ExecutiveStageCertificationAudits.qualityGateCount,
    runtimeCompatibilityCheckCount:
      ExecutiveStageCertificationAudits.runtimeCompatibilityCheckCount,
    guaranteeCount: ExecutiveStageCertificationGuarantees.length,
    principleCount: ExecutiveStageCertificationPrinciples.length,
    resultFieldCount: ExecutiveStageCertificationResultModel.fieldCount,
    architectureAuditCount:
      ExecutiveStageCertificationAudits.architectureAuditCount,
    publicApiAuditCount: ExecutiveStageCertificationAudits.publicApiAuditCount,
  }),
  upstreamDependencies: Object.freeze([
    "EX-1:6 — Executive Stage Platform",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
  ]),
  status: ExecutiveStageCertificationStatus,
  readiness: ExecutiveStageCertificationReadiness,
  nextPhase: ExecutiveStageCertificationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  readOnly: true as const,
  evaluatesOnly: true as const,
  modifiesPlatform: false as const,
  modifiesSourceCode: false as const,
  executesRuntimeLogic: false as const,
  rendersStage: false as const,
  invokesAi: false as const,
  executesWorkspaceBehaviour: false as const,
  accessesExternalServices: false as const,
  introducesNewApis: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  freezePhase: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Certification summary. */
export function getExecutiveStageCertificationSummary() {
  return Object.freeze({
    certificationId: ExecutiveStageCertificationId,
    version: ExecutiveStageCertificationVersion,
    name: ExecutiveStageCertificationName,
    namespace: ExecutiveStageCertificationNamespace,
    status: ExecutiveStageCertificationStatus,
    readiness: ExecutiveStageCertificationReadiness,
    domainCount: ExecutiveStageCertificationDomains.length,
    gateCount: ExecutiveStageCertificationGates.length,
    statusCount: ExecutiveStageCertificationStatuses.length,
    qualityGateCount: ExecutiveStageCertificationAudits.qualityGateCount,
    runtimeCompatibilityCheckCount:
      ExecutiveStageCertificationAudits.runtimeCompatibilityCheckCount,
    resultSectionCount: ExecutiveStageCertificationResultModel.fieldCount,
    freezeProgressionStatus: ExecutiveStageFreezeProgressionStatus,
    baselines: ExecutiveStageCertification.baselines,
    nextPhase: ExecutiveStageCertificationNextPhase,
    sourcePlatform: ExecutiveStageCertificationIdentity.sourcePlatform,
    readOnly: true as const,
    modifiesPlatform: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveStageCertification = () =>
  ExecutiveStageCertification;

export {
  ExecutiveStageCertificationIdentity,
  ExecutiveStageCertificationNextPhase,
};
