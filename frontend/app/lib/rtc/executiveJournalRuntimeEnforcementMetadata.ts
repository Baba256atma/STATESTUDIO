/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Metadata.
 *
 * Principles, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

import { ExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import { ExecutiveJournalRuntimeEnforcementContracts } from "./executiveJournalRuntimeEnforcementContracts.ts";
import {
  ExecutiveJournalRuntimeEnforcementId,
  ExecutiveJournalRuntimeEnforcementName,
  ExecutiveJournalRuntimeEnforcementNamespace,
  ExecutiveJournalRuntimeEnforcementNextPhase,
  ExecutiveJournalRuntimeEnforcementReadiness,
  ExecutiveJournalRuntimeEnforcementStatus,
  ExecutiveJournalRuntimeEnforcementVersion,
} from "./executiveJournalRuntimeEnforcementIdentity.ts";
import {
  ExecutiveJournalRuntimeEnforcementLifecycle,
  ExecutiveJournalRuntimeEnforcementStepKinds,
} from "./executiveJournalRuntimeEnforcementLifecycle.ts";
import {
  ExecutiveJournalRuntimeEnforcementRules,
  ExecutiveJournalRuntimeObligationStepMapping,
} from "./executiveJournalRuntimeEnforcementRules.ts";

/** Upstream AI prohibitions preserved by reference through policy → validation → model. */
export const ExecutiveJournalEnforcementAiMustNot =
  ExecutiveJournalRuntimePolicy.aiMustNot;

export const ExecutiveJournalRuntimeEnforcementOpenIssues = Object.freeze(
  ExecutiveJournalRuntimePolicy.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByEnforcement: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:6" as const,
    })
  ),
);

export const ExecutiveJournalRuntimeEnforcementPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:6/Principle/01",
    name: "Plan only",
    description:
      "Enforcement converts policy decisions into immutable plans and never executes them.",
  }),
  Object.freeze({
    principleId: "RTC-2:6/Principle/02",
    name: "Blocked precedence",
    description:
      "Blocked overrides AwaitingConfirmation and Enforceable; confirmation overrides Enforceable.",
  }),
  Object.freeze({
    principleId: "RTC-2:6/Principle/03",
    name: "Exact confirmation binding",
    description:
      "Confirmation evidence must bind actor, request, decision, target, operation, effect, authority, policy version, expiry, and single-use identity.",
  }),
  Object.freeze({
    principleId: "RTC-2:6/Principle/04",
    name: "Append-only planning",
    description:
      "State-changing plans prepare append-only effects; never in-place mutation or silent deletion.",
  }),
  Object.freeze({
    principleId: "RTC-2:6/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; enforcement blocks plans that require those defaults.",
  }),
] as const);

export const ExecutiveJournalRuntimeEnforcementProhibitedSurfaces = Object.freeze([
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
  "plan execution",
  "resolve open issues OI-01 through OI-06",
  "system clock",
  "random identifiers",
  "journal payload inspection for authority",
] as const);

export const ExecutiveJournalRuntimeEnforcementOwnership = Object.freeze({
  ownershipId: "RTC-2:6/ExecutiveJournalRuntimeEnforcementOwnership",
  sourcePhase: "RTC-2:6" as const,
  owns: Object.freeze([
    "Enforcement result vocabulary",
    "Enforcement-step vocabulary",
    "Obligation-to-step mapping",
    "Confirmation binding checks",
    "Immutable enforcement plans",
  ]),
  doesNotOwn: Object.freeze([
    "Policy rule content",
    "Validation evaluation",
    "Model entities",
    "Registry resolution",
    "Foundation controls",
    "Plan execution",
    "OI-01 through OI-06 resolutions",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeEnforcementBoundaries = Object.freeze({
  boundaryId: "RTC-2:6/ExecutiveJournalRuntimeEnforcementBoundaries",
  sourcePhase: "RTC-2:6" as const,
  acceptsOnlyValidatedPolicyDecisions: true as const,
  neverExecutesPlans: true as const,
  failClosed: true as const,
  denyProducesBlocked: true as const,
  confirmationProducesAwaiting: true as const,
  allowMayProduceEnforceable: true as const,
  preservesUpstreamReferences: true as const,
  resolvesOpenIssues: false as const,
  createsAuthority: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeEnforcementMetadata = Object.freeze({
  metadataId: "RTC-2:6/ExecutiveJournalRuntimeEnforcementMetadata",
  enforcementId: ExecutiveJournalRuntimeEnforcementId,
  version: ExecutiveJournalRuntimeEnforcementVersion,
  name: ExecutiveJournalRuntimeEnforcementName,
  namespace: ExecutiveJournalRuntimeEnforcementNamespace,
  status: ExecutiveJournalRuntimeEnforcementStatus,
  readiness: ExecutiveJournalRuntimeEnforcementReadiness,
  nextPhase: ExecutiveJournalRuntimeEnforcementNextPhase,
  sourcePolicy: ExecutiveJournalRuntimePolicy.identity.id,
  lifecycleState: ExecutiveJournalRuntimeEnforcementLifecycle.currentState,
  ruleCount: ExecutiveJournalRuntimeEnforcementRules.length,
  contractCount: ExecutiveJournalRuntimeEnforcementContracts.length,
  stepKindCount: ExecutiveJournalRuntimeEnforcementStepKinds.length,
  obligationMappingCount: Object.keys(ExecutiveJournalRuntimeObligationStepMapping)
    .length,
  openIssueCount: ExecutiveJournalRuntimeEnforcementOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeEnforcementPrinciples.length,
  principles: ExecutiveJournalRuntimeEnforcementPrinciples,
  openIssues: ExecutiveJournalRuntimeEnforcementOpenIssues,
  ownership: ExecutiveJournalRuntimeEnforcementOwnership,
  boundaries: ExecutiveJournalRuntimeEnforcementBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeEnforcementProhibitedSurfaces,
  aiMustNot: ExecutiveJournalEnforcementAiMustNot,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
