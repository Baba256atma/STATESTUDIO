/**
 * RTC-3:9 — Executive Decision Register Certification & Release Readiness.
 *
 * Metadata-only Certification & Release Readiness gate. Consumes RTC-3:8
 * Assurance public surface only. Evaluates supplied verification evidence
 * and produces a deterministic certification result. Never authorizes
 * consumption, integration, deployment, publication, UI/APP-8 use,
 * persistence, network behavior, or production activation.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import { ExecutiveDecisionRegisterAssurance } from "./executiveDecisionRegisterAssurance.ts";
import {
  ExecutiveDecisionRegisterCertificationContractNames,
  ExecutiveDecisionRegisterCertificationContracts,
} from "./executiveDecisionRegisterCertificationContracts.ts";
import {
  ExecutiveDecisionRegisterCertificationApprovedAliases,
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationIdentityDescriptorValue,
  ExecutiveDecisionRegisterCertificationName,
  ExecutiveDecisionRegisterCertificationNamespace,
  ExecutiveDecisionRegisterCertificationPhaseId,
  ExecutiveDecisionRegisterCertificationPreviousPhase,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationSourceAssurance,
  ExecutiveDecisionRegisterCertificationStatus,
  ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
  ExecutiveDecisionRegisterCertificationVersion,
  assertExecutiveDecisionRegisterCertificationAlias,
  assertExecutiveDecisionRegisterCertificationIdentity,
  isExecutiveDecisionRegisterCertificationApprovedAlias,
  isExecutiveDecisionRegisterCertificationIdentity,
} from "./executiveDecisionRegisterCertificationIdentity.ts";
import {
  ExecutiveDecisionRegisterCertificationAuthorizationBoundary,
  ExecutiveDecisionRegisterCertificationGateCriticalities,
  ExecutiveDecisionRegisterCertificationInboundTransition,
  ExecutiveDecisionRegisterCertificationOutboundRelation,
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  assertExecutiveDecisionRegisterCertificationGateCriticality,
  isExecutiveDecisionRegisterCertificationGateCriticality,
  isLegalExecutiveDecisionRegisterCertificationInbound,
} from "./executiveDecisionRegisterCertificationLifecycle.ts";
import {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  ExecutiveDecisionRegisterCertificationAiMustNot,
  ExecutiveDecisionRegisterCertificationArchitectureDecisions,
  ExecutiveDecisionRegisterCertificationBoundaries,
  ExecutiveDecisionRegisterCertificationDecisions,
  ExecutiveDecisionRegisterCertificationMetadata,
  ExecutiveDecisionRegisterCertificationOpenIssues,
  ExecutiveDecisionRegisterCertificationOwnership,
  ExecutiveDecisionRegisterCertificationPrinciples,
  ExecutiveDecisionRegisterCertificationProhibitedSurfaces,
  ExecutiveDecisionRegisterCertificationUpstreamAdrtc306,
  ExecutiveDecisionRegisterCertificationUpstreamAdrtc307,
  ExecutiveDecisionRegisterCertificationUpstreamAdrtc308,
  ExecutiveDecisionRegisterCertificationUpstreamAssuranceDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamEnforcementDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamExecutionDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamModelDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamPolicyDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamRegistryDecisions,
  ExecutiveDecisionRegisterCertificationUpstreamValidationDecisions,
} from "./executiveDecisionRegisterCertificationMetadata.ts";
import {
  ARCHITECTURE_DECISION_COVERAGE,
  AUTHORIZATION_BOUNDARY_COVERAGE,
  BLOCKING_GATE_BEHAVIOR_COVERAGE,
  CERTIFICATION_GATE_COVERAGE,
  CERTIFICATION_RESULT_COVERAGE,
  DISCLOSURE_GATE_BEHAVIOR_COVERAGE,
  EVIDENCE_KIND_COVERAGE,
  ExecutiveDecisionRegisterCertificationEvidenceKinds,
  ExecutiveDecisionRegisterCertificationGateIds,
  ExecutiveDecisionRegisterCertificationGateResultKinds,
  ExecutiveDecisionRegisterCertificationGates,
  ExecutiveDecisionRegisterCertificationResultKinds,
  GATE_CRITICALITY_COVERAGE,
  GATE_RESULT_COVERAGE,
  MANIFEST_CLASSIFICATION_FIELD_COVERAGE,
  MANIFEST_FIELD_COVERAGE,
  certifyExecutiveDecisionRegister,
  evaluateExecutiveDecisionRegisterCertificationGates,
  validateExecutiveDecisionRegisterCertificationCoverage,
} from "./executiveDecisionRegisterCertificationRules.ts";
import type { ExecutiveDecisionRegisterCertificationSummary } from "./executiveDecisionRegisterCertificationTypes.ts";

export {
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationIdentityDescriptorValue as ExecutiveDecisionRegisterCertificationIdentity,
  ExecutiveDecisionRegisterCertificationName,
  ExecutiveDecisionRegisterCertificationNamespace,
  ExecutiveDecisionRegisterCertificationPhaseId,
  ExecutiveDecisionRegisterCertificationPreviousPhase,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationSourceAssurance,
  ExecutiveDecisionRegisterCertificationStatus,
  ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
  ExecutiveDecisionRegisterCertificationVersion,
  ExecutiveDecisionRegisterCertificationApprovedAliases,
  assertExecutiveDecisionRegisterCertificationAlias,
  assertExecutiveDecisionRegisterCertificationIdentity,
  isExecutiveDecisionRegisterCertificationApprovedAlias,
  isExecutiveDecisionRegisterCertificationIdentity,
};

export {
  ExecutiveDecisionRegisterCertificationAuthorizationBoundary,
  ExecutiveDecisionRegisterCertificationGateCriticalities,
  ExecutiveDecisionRegisterCertificationInboundTransition,
  ExecutiveDecisionRegisterCertificationOutboundRelation,
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  assertExecutiveDecisionRegisterCertificationGateCriticality,
  isExecutiveDecisionRegisterCertificationGateCriticality,
  isLegalExecutiveDecisionRegisterCertificationInbound,
};
export {
  ARCHITECTURE_DECISION_COVERAGE,
  AUTHORIZATION_BOUNDARY_COVERAGE,
  BLOCKING_GATE_BEHAVIOR_COVERAGE,
  CERTIFICATION_GATE_COVERAGE,
  CERTIFICATION_RESULT_COVERAGE,
  DISCLOSURE_GATE_BEHAVIOR_COVERAGE,
  EVIDENCE_KIND_COVERAGE,
  ExecutiveDecisionRegisterCertificationEvidenceKinds,
  ExecutiveDecisionRegisterCertificationGateIds,
  ExecutiveDecisionRegisterCertificationGateResultKinds,
  ExecutiveDecisionRegisterCertificationGates,
  ExecutiveDecisionRegisterCertificationResultKinds,
  GATE_CRITICALITY_COVERAGE,
  GATE_RESULT_COVERAGE,
  MANIFEST_CLASSIFICATION_FIELD_COVERAGE,
  MANIFEST_FIELD_COVERAGE,
  certifyExecutiveDecisionRegister,
  evaluateExecutiveDecisionRegisterCertificationGates,
  validateExecutiveDecisionRegisterCertificationCoverage,
};

export {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
};

if (
  ExecutiveDecisionRegisterAssurance.identity.id
    !== ExecutiveDecisionRegisterCertificationSourceAssurance
) {
  throw new Error(
    "RTC-3:9 Certification requires the canonical RTC-3:8 Assurance aggregate.",
  );
}

if (ExecutiveDecisionRegisterAssurance.readiness !== "ReadyForCertification") {
  throw new Error(
    "RTC-3:9 Certification requires RTC-3:8 readiness ReadyForCertification.",
  );
}

if (!validateExecutiveDecisionRegisterCertificationCoverage()) {
  throw new Error(
    "RTC-3:9 Certification requires complete unique coverage tables.",
  );
}

/**
 * Canonical immutable Executive Decision Register Certification aggregate.
 */
export const ExecutiveDecisionRegisterCertification = Object.freeze({
  identity: ExecutiveDecisionRegisterCertificationIdentityDescriptorValue,
  assurance: ExecutiveDecisionRegisterAssurance,
  execution: ExecutiveDecisionRegisterAssurance.execution,
  enforcement: ExecutiveDecisionRegisterAssurance.enforcement,
  policy: ExecutiveDecisionRegisterAssurance.policy,
  validation: ExecutiveDecisionRegisterAssurance.validation,
  model: ExecutiveDecisionRegisterAssurance.model,
  registry: ExecutiveDecisionRegisterAssurance.registry,
  foundation: ExecutiveDecisionRegisterAssurance.foundation,
  contracts: ExecutiveDecisionRegisterCertificationContracts,
  contractNames: ExecutiveDecisionRegisterCertificationContractNames,
  gates: ExecutiveDecisionRegisterCertificationGates,
  gateIds: ExecutiveDecisionRegisterCertificationGateIds,
  resultKinds: ExecutiveDecisionRegisterCertificationResultKinds,
  gateResultKinds: ExecutiveDecisionRegisterCertificationGateResultKinds,
  evidenceKinds: ExecutiveDecisionRegisterCertificationEvidenceKinds,
  coverage: Object.freeze({
    gates: CERTIFICATION_GATE_COVERAGE,
    certificationResults: CERTIFICATION_RESULT_COVERAGE,
    gateResults: GATE_RESULT_COVERAGE,
    evidenceKinds: EVIDENCE_KIND_COVERAGE,
    manifestFields: MANIFEST_FIELD_COVERAGE,
    authorizationBoundary: AUTHORIZATION_BOUNDARY_COVERAGE,
    gateCriticality: GATE_CRITICALITY_COVERAGE,
    blockingGateBehavior: BLOCKING_GATE_BEHAVIOR_COVERAGE,
    disclosureGateBehavior: DISCLOSURE_GATE_BEHAVIOR_COVERAGE,
    manifestClassificationFields: MANIFEST_CLASSIFICATION_FIELD_COVERAGE,
    architectureDecisions: ARCHITECTURE_DECISION_COVERAGE,
  }),
  principles: ExecutiveDecisionRegisterCertificationPrinciples,
  decisions: ExecutiveDecisionRegisterCertificationDecisions,
  architectureDecisions:
    ExecutiveDecisionRegisterCertificationArchitectureDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
    "AD-RTC3-09",
  ] as const),
  upstreamArchitectureDecisionAdrtc306:
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc306,
  upstreamArchitectureDecisionAdrtc307:
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc307,
  upstreamArchitectureDecisionAdrtc308:
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc308,
  architectureDecisionAdrtc309:
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamValidationDecisions,
  upstreamPolicyDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamPolicyDecisions,
  upstreamEnforcementDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamEnforcementDecisions,
  upstreamExecutionDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamExecutionDecisions,
  upstreamAssuranceDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamAssuranceDecisions,
  openIssues: ExecutiveDecisionRegisterCertificationOpenIssues,
  ownership: ExecutiveDecisionRegisterCertificationOwnership,
  boundaries: ExecutiveDecisionRegisterCertificationBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterCertificationProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterCertificationAiMustNot,
  authorizationBoundary:
    ExecutiveDecisionRegisterCertificationAuthorizationBoundary,
  inboundTransition: ExecutiveDecisionRegisterCertificationInboundTransition,
  outboundRelation: ExecutiveDecisionRegisterCertificationOutboundRelation,
  metadata: ExecutiveDecisionRegisterCertificationMetadata,
  status: ExecutiveDecisionRegisterCertificationStatus,
  readiness: ExecutiveDecisionRegisterCertificationReadiness,
  previousPhase: ExecutiveDecisionRegisterCertificationPreviousPhase,
  nextPhaseDecisionRequired: true as const,
  nextPhase: null,
  terminalDecisionMarker:
    ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
  certify: certifyExecutiveDecisionRegister,
  evaluateGates: evaluateExecutiveDecisionRegisterCertificationGates,
  validateCoverage: validateExecutiveDecisionRegisterCertificationCoverage,
  scopedTypeScriptSufficientForCertification:
    SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  scopedTypeScriptPolicySource: SCOPED_TYPESCRIPT_POLICY_SOURCE,
  statistics: Object.freeze({
    gateCount: ExecutiveDecisionRegisterCertificationGates.length,
    contractCount: ExecutiveDecisionRegisterCertificationContracts.length,
    evidenceKindCount:
      ExecutiveDecisionRegisterCertificationEvidenceKinds.length,
    openIssueCount: ExecutiveDecisionRegisterCertificationOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterCertificationPrinciples.length,
    decisionCount: ExecutiveDecisionRegisterCertificationDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:8 — Executive Decision Register Reconciliation & Assurance",
  ]),
  upstreamChain: Object.freeze({
    assurance: ExecutiveDecisionRegisterAssurance.identity.id,
    execution: ExecutiveDecisionRegisterAssurance.execution.identity.id,
    enforcement: ExecutiveDecisionRegisterAssurance.enforcement.identity.id,
    policy: ExecutiveDecisionRegisterAssurance.policy.identity.id,
    validation: ExecutiveDecisionRegisterAssurance.validation.identity.id,
    model: ExecutiveDecisionRegisterAssurance.model.identity.id,
    registry: ExecutiveDecisionRegisterAssurance.registry.identity.id,
    foundation:
      ExecutiveDecisionRegisterAssurance.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  repairsInput: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  executes: false as const,
  persists: false as const,
  dispatches: false as const,
  publishes: false as const,
  mutatesDomainState: false as const,
  createsAuthority: false as const,
  confirmsDecisions: false as const,
  authorizesConsumption: false as const,
  authorizesIntegration: false as const,
  authorizesDeployment: false as const,
  publicIndexAuthorized: false as const,
  rtc310CreationAuthorized: false as const,
  humanAuthorizationRequired: true as const,
  authorizationRecorded: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsAssuranceOnly: true as const,
  importsRtc31ThroughRtc37Directly: false as const,
  certificationPhase: true as const,
  assurancePhase: false as const,
  freezePhase: false as const,
  publicIndexPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

export function getExecutiveDecisionRegisterCertificationSummary():
  ExecutiveDecisionRegisterCertificationSummary {
  return Object.freeze({
    certificationId: ExecutiveDecisionRegisterCertificationId,
    version: ExecutiveDecisionRegisterCertificationVersion,
    name: ExecutiveDecisionRegisterCertificationName,
    namespace: ExecutiveDecisionRegisterCertificationNamespace,
    status: ExecutiveDecisionRegisterCertificationStatus,
    readiness: ExecutiveDecisionRegisterCertificationReadiness,
    gateCount: ExecutiveDecisionRegisterCertificationGates.length,
    openIssueCount: ExecutiveDecisionRegisterCertificationOpenIssues.length,
    decisionCount: ExecutiveDecisionRegisterCertificationDecisions.length,
    sourceAssurance: ExecutiveDecisionRegisterCertificationSourceAssurance,
    previousPhase: ExecutiveDecisionRegisterCertificationPreviousPhase,
    nextPhaseDecisionRequired: true as const,
    architectureDecisionIds: Object.freeze([
      "AD-RTC3-06",
      "AD-RTC3-07",
      "AD-RTC3-08",
      "AD-RTC3-09",
    ] as const),
    humanAuthorizationRequired: true as const,
    authorizationRecorded: false as const,
    consumptionAuthorized: false as const,
    integrationAuthorized: false as const,
    deploymentAuthorized: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterCertification = () =>
  ExecutiveDecisionRegisterCertification;
