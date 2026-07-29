/**
 * RTC-2:5 — Executive Journal Runtime Policy Metadata.
 *
 * Principles, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

import { ExecutiveJournalRuntimeValidation } from "./executiveJournalRuntimeValidation.ts";
import { ExecutiveJournalRuntimePolicyRuleFamilies } from "./executiveJournalRuntimePolicyContracts.ts";
import {
  ExecutiveJournalRuntimePolicyId,
  ExecutiveJournalRuntimePolicyName,
  ExecutiveJournalRuntimePolicyNamespace,
  ExecutiveJournalRuntimePolicyNextPhase,
  ExecutiveJournalRuntimePolicyReadiness,
  ExecutiveJournalRuntimePolicyStatus,
  ExecutiveJournalRuntimePolicyVersion,
} from "./executiveJournalRuntimePolicyIdentity.ts";
import {
  ExecutiveJournalRuntimePolicyLifecycle,
  ExecutiveJournalRuntimePolicyObligationKinds,
  ExecutiveJournalRuntimePolicyOperations,
} from "./executiveJournalRuntimePolicyLifecycle.ts";
import { ExecutiveJournalRuntimePolicyRules } from "./executiveJournalRuntimePolicyRules.ts";

/** Upstream AI prohibitions preserved by reference through validation → model. */
export const ExecutiveJournalPolicyAiMustNot =
  ExecutiveJournalRuntimeValidation.aiMustNot;

export const ExecutiveJournalRuntimePolicyOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeValidation.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByPolicy: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:5" as const,
    })
  ),
);

export const ExecutiveJournalRuntimePolicyPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:5/Principle/01",
    name: "Fail closed",
    description:
      "Unknown, malformed, incomplete, or unresolved inputs never produce Allow.",
  }),
  Object.freeze({
    principleId: "RTC-2:5/Principle/02",
    name: "Deny precedence",
    description:
      "Deny overrides RequireConfirmation and Allow; confirmation overrides Allow.",
  }),
  Object.freeze({
    principleId: "RTC-2:5/Principle/03",
    name: "Authority before automation",
    description:
      "Identity, title, silence, attendance, or AI confidence cannot substitute for authority_ref.",
  }),
  Object.freeze({
    principleId: "RTC-2:5/Principle/04",
    name: "Private by construction",
    description:
      "Private reflection is denied for shared discovery, projection, export, and automation by default.",
  }),
  Object.freeze({
    principleId: "RTC-2:5/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; policy requires explicit references without inventing content.",
  }),
] as const);

export const ExecutiveJournalRuntimePolicyProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "authentication infrastructure",
  "live authority registry",
  "database access",
  "network access",
  "export generation",
  "retention scheduling",
  "resolve open issues OI-01 through OI-06",
  "system clock",
  "random identifiers",
  "journal payload inspection for authority",
] as const);

export const ExecutiveJournalRuntimePolicyOwnership = Object.freeze({
  ownershipId: "RTC-2:5/ExecutiveJournalRuntimePolicyOwnership",
  sourcePhase: "RTC-2:5" as const,
  owns: Object.freeze([
    "Policy decision vocabulary",
    "Deterministic policy evaluation",
    "Obligation catalogue",
    "Fail-closed precedence",
  ] as const),
  doesNotOwn: ExecutiveJournalRuntimePolicyProhibitedSurfaces,
  importsValidationByReference: true as const,
  importsFoundationDirectly: false as const,
  ownsUi: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveJournalRuntimePolicyBoundaries = Object.freeze({
  boundariesId: "RTC-2:5/ExecutiveJournalRuntimePolicyBoundaries",
  sourcePhase: "RTC-2:5" as const,
  sourceValidationId: ExecutiveJournalRuntimeValidation.identity.id,
  sourceValidationReadiness: ExecutiveJournalRuntimeValidation.readiness,
  modelViaValidation: ExecutiveJournalRuntimeValidation.model,
  foundationViaValidation:
    ExecutiveJournalRuntimeValidation.model.foundation,
  aiMustNot: ExecutiveJournalPolicyAiMustNot,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveJournalRuntimePolicyProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc24ValidationOnly",
    "NoDirectFoundationImport",
    "NoDirectRegistryImport",
    "NoDirectModelImport",
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

export const ExecutiveJournalRuntimePolicyConstants = Object.freeze({
  phaseIdentifier: "RTC-2:5",
  canonicalIdentifier: ExecutiveJournalRuntimePolicyId,
  version: ExecutiveJournalRuntimePolicyVersion,
  name: ExecutiveJournalRuntimePolicyName,
  namespace: ExecutiveJournalRuntimePolicyNamespace,
  status: ExecutiveJournalRuntimePolicyStatus,
  readiness: ExecutiveJournalRuntimePolicyReadiness,
  nextPhase: ExecutiveJournalRuntimePolicyNextPhase,
  ruleCount: ExecutiveJournalRuntimePolicyRules.length,
  familyCount: ExecutiveJournalRuntimePolicyRuleFamilies.length,
  operationCount: ExecutiveJournalRuntimePolicyOperations.length,
  obligationKindCount: ExecutiveJournalRuntimePolicyObligationKinds.length,
  lifecycleStateCount: ExecutiveJournalRuntimePolicyLifecycle.stateCount,
  openIssueCount: ExecutiveJournalRuntimePolicyOpenIssues.length,
} as const);

export const ExecutiveJournalRuntimePolicyMetadata = Object.freeze({
  constants: ExecutiveJournalRuntimePolicyConstants,
  principles: ExecutiveJournalRuntimePolicyPrinciples,
  openIssues: ExecutiveJournalRuntimePolicyOpenIssues,
  ownership: ExecutiveJournalRuntimePolicyOwnership,
  boundaries: ExecutiveJournalRuntimePolicyBoundaries,
  readiness: ExecutiveJournalRuntimePolicyReadiness,
  nextPhase: ExecutiveJournalRuntimePolicyNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
