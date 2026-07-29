/**
 * RTC-3:4 — Executive Decision Register Validation Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues carried
 * forward from RTC-3:3 without selecting defaults.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

import { ExecutiveDecisionRegisterModel } from "./executiveDecisionRegisterModel.ts";
import {
  ExecutiveDecisionRegisterValidationContracts,
  ExecutiveDecisionRegisterValidationRuleFamilies,
} from "./executiveDecisionRegisterValidationContracts.ts";
import {
  ExecutiveDecisionRegisterValidationId,
  ExecutiveDecisionRegisterValidationName,
  ExecutiveDecisionRegisterValidationNamespace,
  ExecutiveDecisionRegisterValidationNextPhase,
  ExecutiveDecisionRegisterValidationReadiness,
  ExecutiveDecisionRegisterValidationStatus,
  ExecutiveDecisionRegisterValidationVersion,
} from "./executiveDecisionRegisterValidationIdentity.ts";
import { ExecutiveDecisionRegisterValidationLifecycle } from "./executiveDecisionRegisterValidationLifecycle.ts";
import { ExecutiveDecisionRegisterValidationRules } from "./executiveDecisionRegisterValidationRules.ts";

/** AI prohibitions preserved by exact model → registry → foundation reference. */
export const ExecutiveDecisionRegisterValidationAiMustNot =
  ExecutiveDecisionRegisterModel.aiMustNot;

/** D-01…D-06 by exact upstream foundation reference via model. */
export const ExecutiveDecisionRegisterValidationUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterModel.upstreamFoundationDecisions;

/** D-07…D-12 by exact registry decisions via model. */
export const ExecutiveDecisionRegisterValidationUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterModel.upstreamRegistryDecisions;

/** D-13…D-18 by exact model decisions reference. */
export const ExecutiveDecisionRegisterValidationUpstreamModelDecisions =
  ExecutiveDecisionRegisterModel.decisions;

/**
 * Open issues carried forward unresolved from RTC-3:1 via RTC-3:3.
 * RTC-3:4 MUST NOT resolve these through defaults.
 */
export const ExecutiveDecisionRegisterValidationOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterModel.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByValidation: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:4" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterValidationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:4/Principle/01",
    name: "Pure evaluation",
    description:
      "Validation evaluates only; it never mutates, normalizes, repairs, or enriches input.",
  }),
  Object.freeze({
    principleId: "RTC-3:4/Principle/02",
    name: "Fail closed",
    description:
      "Unknown identities, states, entities, relationships, and subjects fail closed.",
  }),
  Object.freeze({
    principleId: "RTC-3:4/Principle/03",
    name: "Authority before automation",
    description:
      "Authoritative decision state requires authority_ref and human confirmation.",
  }),
  Object.freeze({
    principleId: "RTC-3:4/Principle/04",
    name: "Append-only lineage",
    description:
      "Corrections, disputes, supersessions, reopenings, and disposition preserve historical references.",
  }),
  Object.freeze({
    principleId: "RTC-3:4/Principle/05",
    name: "AI remains non-authoritative",
    description:
      "AI-originated metadata cannot validate as authoritative or satisfy confirmation.",
  }),
  Object.freeze({
    principleId: "RTC-3:4/Principle/06",
    name: "No open-issue resolution",
    description:
      "OI-01 through OI-06 remain unresolved; validation invents no policy defaults.",
  }),
] as const);

export const ExecutiveDecisionRegisterValidationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-19",
    statement: "Validation is pure and never repairs input.",
  }),
  Object.freeze({
    decisionId: "D-20",
    statement:
      "Unknown identities, states, entities, and relationships fail closed.",
  }),
  Object.freeze({
    decisionId: "D-21",
    statement:
      "Authority and confirmation are mandatory for authoritative decision state.",
  }),
  Object.freeze({
    decisionId: "D-22",
    statement:
      "Append-only lineage is validated across corrections, disputes, supersessions, and disposition.",
  }),
  Object.freeze({
    decisionId: "D-23",
    statement: "AI-originated metadata cannot validate as authoritative.",
  }),
  Object.freeze({
    decisionId: "D-24",
    statement: "RTC-3:4 consumes the canonical model only through RTC-3:3.",
  }),
] as const);

export const ExecutiveDecisionRegisterValidationProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next.js",
    "rendering",
    "RTC-2 modules",
    "RTC-1 Public Index",
    "Decision Journal APP-8 implementation",
    "direct RTC-3:2 runtime import",
    "direct RTC-3:1 runtime import",
    "resolve open issues OI-01 through OI-06",
    "repair or normalize invalid input",
    "live authority registry selection",
    "network clients",
    "database clients",
    "clock or randomness providers",
  ] as const);

export const ExecutiveDecisionRegisterValidationOwnership = Object.freeze({
  ownershipId: "RTC-3:4/ExecutiveDecisionRegisterValidationOwnership",
  sourcePhase: "RTC-3:4" as const,
  owns: Object.freeze([
    "Pure validation rule catalogue",
    "Deterministic issue ordering",
    "Valid/Invalid result discrimination",
    "Candidate metadata evaluation",
    "Canonical model contract verification",
  ] as const),
  doesNotOwn: ExecutiveDecisionRegisterValidationProhibitedSurfaces,
  importsModelByReference: true as const,
  importsRegistryDirectly: false as const,
  importsFoundationDirectly: false as const,
  ownsUi: false as const,
  ownsPolicy: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  selectsLiveAuthorityRegistry: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterValidationBoundaries = Object.freeze({
  boundariesId: "RTC-3:4/ExecutiveDecisionRegisterValidationBoundaries",
  sourcePhase: "RTC-3:4" as const,
  sourceModelId: ExecutiveDecisionRegisterModel.identity.id,
  sourceModelReadiness: ExecutiveDecisionRegisterModel.readiness,
  registryViaModel: ExecutiveDecisionRegisterModel.registry.identity.id,
  foundationViaModel:
    ExecutiveDecisionRegisterModel.foundation.identity.foundationId,
  foundationReadiness: ExecutiveDecisionRegisterModel.foundation.readiness,
  aiMustNot: ExecutiveDecisionRegisterValidationAiMustNot,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterValidationProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc33ModelOnly",
    "NoDirectRegistryImport",
    "NoDirectFoundationImport",
    "NoRtc2Imports",
    "NoRtc1PublicIndexImports",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoNetworkOrPersistenceImports",
    "NoClockOrRandomness",
    "NoOpenIssueDefaults",
    "NoInputRepair",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterValidationConstants = Object.freeze({
  phaseIdentifier: "RTC-3:4",
  canonicalIdentifier: ExecutiveDecisionRegisterValidationId,
  version: ExecutiveDecisionRegisterValidationVersion,
  name: ExecutiveDecisionRegisterValidationName,
  namespace: ExecutiveDecisionRegisterValidationNamespace,
  status: ExecutiveDecisionRegisterValidationStatus,
  readiness: ExecutiveDecisionRegisterValidationReadiness,
  nextPhase: ExecutiveDecisionRegisterValidationNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Decision Register",
  ruleCount: ExecutiveDecisionRegisterValidationRules.length,
  familyCount: ExecutiveDecisionRegisterValidationRuleFamilies.length,
  contractCount: ExecutiveDecisionRegisterValidationContracts.length,
  lifecycleStateCount: ExecutiveDecisionRegisterValidationLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterValidationOpenIssues.length,
  principleCount: ExecutiveDecisionRegisterValidationPrinciples.length,
  decisionCount: ExecutiveDecisionRegisterValidationDecisions.length,
} as const);

export const ExecutiveDecisionRegisterValidationMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterValidationConstants,
  principles: ExecutiveDecisionRegisterValidationPrinciples,
  decisions: ExecutiveDecisionRegisterValidationDecisions,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterValidationUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterValidationUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterValidationUpstreamModelDecisions,
  openIssues: ExecutiveDecisionRegisterValidationOpenIssues,
  ownership: ExecutiveDecisionRegisterValidationOwnership,
  boundaries: ExecutiveDecisionRegisterValidationBoundaries,
  readiness: ExecutiveDecisionRegisterValidationReadiness,
  nextPhase: ExecutiveDecisionRegisterValidationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
