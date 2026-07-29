/**
 * RTC-3:5 — Executive Decision Register Policy Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

import { ExecutiveDecisionRegisterValidation } from "./executiveDecisionRegisterValidation.ts";
import { ExecutiveDecisionRegisterPolicyRuleFamilies } from "./executiveDecisionRegisterPolicyContracts.ts";
import {
  ExecutiveDecisionRegisterPolicyId,
  ExecutiveDecisionRegisterPolicyName,
  ExecutiveDecisionRegisterPolicyNamespace,
  ExecutiveDecisionRegisterPolicyNextPhase,
  ExecutiveDecisionRegisterPolicyReadiness,
  ExecutiveDecisionRegisterPolicyStatus,
  ExecutiveDecisionRegisterPolicyVersion,
} from "./executiveDecisionRegisterPolicyIdentity.ts";
import {
  ExecutiveDecisionRegisterPolicyLifecycle,
  ExecutiveDecisionRegisterPolicyObligationKinds,
  ExecutiveDecisionRegisterPolicyOperations,
} from "./executiveDecisionRegisterPolicyLifecycle.ts";
import { ExecutiveDecisionRegisterPolicyRules } from "./executiveDecisionRegisterPolicyRules.ts";

/** Upstream AI prohibitions preserved by exact validation reference. */
export const ExecutiveDecisionRegisterPolicyAiMustNot =
  ExecutiveDecisionRegisterValidation.aiMustNot;

/** D-01…D-06 preserved by exact upstream foundation reference via validation. */
export const ExecutiveDecisionRegisterPolicyUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterValidation.upstreamFoundationDecisions;

/** D-07…D-12 preserved by exact upstream registry reference via validation. */
export const ExecutiveDecisionRegisterPolicyUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterValidation.upstreamRegistryDecisions;

/** D-13…D-18 preserved by exact upstream model reference via validation. */
export const ExecutiveDecisionRegisterPolicyUpstreamModelDecisions =
  ExecutiveDecisionRegisterValidation.upstreamModelDecisions;

/** D-19…D-24 preserved by exact upstream validation reference. */
export const ExecutiveDecisionRegisterPolicyUpstreamValidationDecisions =
  ExecutiveDecisionRegisterValidation.decisions;

/**
 * Open issues carried forward unresolved from RTC-3:1 through RTC-3:4.
 * RTC-3:5 MUST NOT resolve these through defaults.
 */
export const ExecutiveDecisionRegisterPolicyOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterValidation.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByPolicy: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:5" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterPolicyPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:5/Principle/01",
    name: "Fail closed",
    description:
      "Unknown, malformed, incomplete, or invalid validation evidence never produces Allow.",
  }),
  Object.freeze({
    principleId: "RTC-3:5/Principle/02",
    name: "Deny precedence",
    description:
      "Deny overrides RequireConfirmation and Allow; confirmation overrides Allow.",
  }),
  Object.freeze({
    principleId: "RTC-3:5/Principle/03",
    name: "Authority and human confirmation",
    description:
      "Consequential decision effects require explicit authority_ref and human confirmation.",
  }),
  Object.freeze({
    principleId: "RTC-3:5/Principle/04",
    name: "AI may propose only",
    description:
      "AI may propose non-authoritative metadata but cannot exercise authoritative decision powers.",
  }),
  Object.freeze({
    principleId: "RTC-3:5/Principle/05",
    name: "Purpose- and evidence-bound disclosure",
    description:
      "Disclosure, retention, and disposition remain purpose-bound and evidence-bound.",
  }),
  Object.freeze({
    principleId: "RTC-3:5/Principle/06",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; policy invents no enforcement defaults.",
  }),
] as const);

export const ExecutiveDecisionRegisterPolicyDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-25",
    statement:
      "Policy is fail-closed and requires a valid RTC-3:4 validation result.",
  }),
  Object.freeze({
    decisionId: "D-26",
    statement: "Deny overrides confirmation and allow.",
  }),
  Object.freeze({
    decisionId: "D-27",
    statement:
      "Consequential decision effects require authority and human confirmation.",
  }),
  Object.freeze({
    decisionId: "D-28",
    statement:
      "AI may propose but cannot exercise authoritative decision powers.",
  }),
  Object.freeze({
    decisionId: "D-29",
    statement:
      "Disclosure, retention, and disposition remain purpose- and evidence-bound.",
  }),
  Object.freeze({
    decisionId: "D-30",
    statement:
      "RTC-3:5 consumes the canonical validation layer only through RTC-3:4.",
  }),
] as const);

export const ExecutiveDecisionRegisterPolicyProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "RTC-2 modules",
  "RTC-1 Public Index",
  "Decision Journal APP-8 implementation",
  "direct RTC-3:3 runtime import",
  "direct RTC-3:2 runtime import",
  "direct RTC-3:1 runtime import",
  "authentication infrastructure",
  "live authority registry",
  "database access",
  "network access",
  "export generation",
  "retention scheduling",
  "resolve open issues OI-01 through OI-06",
  "system clock",
  "random identifiers",
  "decision payload inspection for authority",
] as const);

export const ExecutiveDecisionRegisterPolicyOwnership = Object.freeze({
  ownershipId: "RTC-3:5/ExecutiveDecisionRegisterPolicyOwnership",
  sourcePhase: "RTC-3:5" as const,
  owns: Object.freeze([
    "Policy decision vocabulary",
    "Deterministic policy evaluation",
    "Obligation catalogue",
    "Fail-closed precedence",
    "Local decisions D-25 through D-30",
  ] as const),
  doesNotOwn: ExecutiveDecisionRegisterPolicyProhibitedSurfaces,
  importsValidationByReference: true as const,
  importsModelDirectly: false as const,
  importsRegistryDirectly: false as const,
  importsFoundationDirectly: false as const,
  ownsUi: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  ownsEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterPolicyBoundaries = Object.freeze({
  boundariesId: "RTC-3:5/ExecutiveDecisionRegisterPolicyBoundaries",
  sourcePhase: "RTC-3:5" as const,
  sourceValidationId: ExecutiveDecisionRegisterValidation.identity.id,
  sourceValidationReadiness: ExecutiveDecisionRegisterValidation.readiness,
  modelViaValidation: ExecutiveDecisionRegisterValidation.model,
  registryViaValidation: ExecutiveDecisionRegisterValidation.registry,
  foundationViaValidation: ExecutiveDecisionRegisterValidation.foundation,
  aiMustNot: ExecutiveDecisionRegisterPolicyAiMustNot,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterPolicyProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc34ValidationOnly",
    "NoDirectModelImport",
    "NoDirectRegistryImport",
    "NoDirectFoundationImport",
    "NoRtc2Imports",
    "NoRtc1PublicIndexImports",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoNetworkOrPersistenceImports",
    "NoClockOrRandomness",
    "NoOpenIssueDefaults",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterPolicyConstants = Object.freeze({
  phaseIdentifier: "RTC-3:5",
  canonicalIdentifier: ExecutiveDecisionRegisterPolicyId,
  version: ExecutiveDecisionRegisterPolicyVersion,
  name: ExecutiveDecisionRegisterPolicyName,
  namespace: ExecutiveDecisionRegisterPolicyNamespace,
  status: ExecutiveDecisionRegisterPolicyStatus,
  readiness: ExecutiveDecisionRegisterPolicyReadiness,
  nextPhase: ExecutiveDecisionRegisterPolicyNextPhase,
  ruleCount: ExecutiveDecisionRegisterPolicyRules.length,
  familyCount: ExecutiveDecisionRegisterPolicyRuleFamilies.length,
  operationCount: ExecutiveDecisionRegisterPolicyOperations.length,
  obligationKindCount: ExecutiveDecisionRegisterPolicyObligationKinds.length,
  lifecycleStateCount: ExecutiveDecisionRegisterPolicyLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterPolicyOpenIssues.length,
  decisionCount: ExecutiveDecisionRegisterPolicyDecisions.length,
} as const);

export const ExecutiveDecisionRegisterPolicyMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterPolicyConstants,
  principles: ExecutiveDecisionRegisterPolicyPrinciples,
  decisions: ExecutiveDecisionRegisterPolicyDecisions,
  openIssues: ExecutiveDecisionRegisterPolicyOpenIssues,
  ownership: ExecutiveDecisionRegisterPolicyOwnership,
  boundaries: ExecutiveDecisionRegisterPolicyBoundaries,
  readiness: ExecutiveDecisionRegisterPolicyReadiness,
  nextPhase: ExecutiveDecisionRegisterPolicyNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
