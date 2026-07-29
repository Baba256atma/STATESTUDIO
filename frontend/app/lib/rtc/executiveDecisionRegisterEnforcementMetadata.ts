/**
 * RTC-3:6 — Executive Decision Register Enforcement Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

import { ExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import { ExecutiveDecisionRegisterEnforcementContracts } from "./executiveDecisionRegisterEnforcementContracts.ts";
import {
  ExecutiveDecisionRegisterEnforcementId,
  ExecutiveDecisionRegisterEnforcementName,
  ExecutiveDecisionRegisterEnforcementNamespace,
  ExecutiveDecisionRegisterEnforcementNextPhase,
  ExecutiveDecisionRegisterEnforcementReadiness,
  ExecutiveDecisionRegisterEnforcementStatus,
  ExecutiveDecisionRegisterEnforcementVersion,
} from "./executiveDecisionRegisterEnforcementIdentity.ts";
import {
  ExecutiveDecisionRegisterEnforcementLifecycle,
  ExecutiveDecisionRegisterEnforcementStepKinds,
} from "./executiveDecisionRegisterEnforcementLifecycle.ts";
import {
  ExecutiveDecisionRegisterEnforcementRules,
  ExecutiveDecisionRegisterObligationStepMapping,
} from "./executiveDecisionRegisterEnforcementRules.ts";
import type { ExecutiveDecisionRegisterArchitectureDecision } from "./executiveDecisionRegisterEnforcementTypes.ts";

/** Upstream AI prohibitions preserved by exact policy reference. */
export const ExecutiveDecisionRegisterEnforcementAiMustNot =
  ExecutiveDecisionRegisterPolicy.aiMustNot;

/** D-01…D-06 preserved through the upstream chain. */
export const ExecutiveDecisionRegisterEnforcementUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterPolicy.upstreamFoundationDecisions;

/** D-07…D-12 preserved through the upstream chain. */
export const ExecutiveDecisionRegisterEnforcementUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterPolicy.upstreamRegistryDecisions;

/** D-13…D-18 preserved through the upstream chain. */
export const ExecutiveDecisionRegisterEnforcementUpstreamModelDecisions =
  ExecutiveDecisionRegisterPolicy.upstreamModelDecisions;

/** D-19…D-24 preserved through the upstream chain. */
export const ExecutiveDecisionRegisterEnforcementUpstreamValidationDecisions =
  ExecutiveDecisionRegisterPolicy.upstreamValidationDecisions;

/** D-25…D-30 preserved by exact upstream policy reference. */
export const ExecutiveDecisionRegisterEnforcementUpstreamPolicyDecisions =
  ExecutiveDecisionRegisterPolicy.decisions;

/**
 * Open issues carried forward unresolved from RTC-3:1 through RTC-3:5.
 * RTC-3:6 MUST NOT resolve these through defaults.
 */
export const ExecutiveDecisionRegisterEnforcementOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterPolicy.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByEnforcement: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:6" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterEnforcementPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:6/Principle/01",
    name: "Plan only",
    description:
      "Enforcement converts policy decisions into immutable plans and never executes them.",
  }),
  Object.freeze({
    principleId: "RTC-3:6/Principle/02",
    name: "Blocked precedence",
    description:
      "Blocked overrides AwaitingConfirmation and Enforceable; confirmation overrides Enforceable.",
  }),
  Object.freeze({
    principleId: "RTC-3:6/Principle/03",
    name: "Exact confirmation binding",
    description:
      "Confirmation evidence must bind human actor, request, decision, target, operation, effect, authority, evidence set, policy version, expiry, and single-use identity.",
  }),
  Object.freeze({
    principleId: "RTC-3:6/Principle/04",
    name: "Append-only planning",
    description:
      "State-changing plans prepare append-only effects; never in-place mutation or silent deletion.",
  }),
  Object.freeze({
    principleId: "RTC-3:6/Principle/05",
    name: "Complete obligation mapping",
    description:
      "Every policy obligation maps to known enforcement steps; unknown obligations block.",
  }),
  Object.freeze({
    principleId: "RTC-3:6/Principle/06",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; enforcement blocks plans that require those defaults.",
  }),
] as const);

export const ExecutiveDecisionRegisterEnforcementDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-31",
    statement:
      "Enforcement translates policy decisions into immutable plans and never executes them.",
  }),
  Object.freeze({
    decisionId: "D-32",
    statement:
      "Deny always produces Blocked; Blocked overrides AwaitingConfirmation and Enforceable.",
  }),
  Object.freeze({
    decisionId: "D-33",
    statement:
      "RequireConfirmation produces AwaitingConfirmation until exact confirmation evidence binds.",
  }),
  Object.freeze({
    decisionId: "D-34",
    statement:
      "Enforceable plans require complete obligation-to-step mapping and lifecycle preconditions.",
  }),
  Object.freeze({
    decisionId: "D-35",
    statement:
      "AI cannot receive enforceable plans for authoritative decision operations.",
  }),
  Object.freeze({
    decisionId: "D-36",
    statement:
      "RTC-3:6 consumes the canonical policy layer only through RTC-3:5.",
  }),
] as const);

/**
 * Canonical architecture decision AD-RTC3-06.
 * Introduces explicit ReadyForExecutionContract readiness for RTC-3:6.
 * Does not renumber or rewrite D-31 through D-36.
 */
export const ExecutiveDecisionRegisterArchitectureDecisionAdrtc306:
  ExecutiveDecisionRegisterArchitectureDecision = Object.freeze({
    decisionId: "AD-RTC3-06" as const,
    title:
      "Introduce explicit execution-contract readiness for RTC-3" as const,
    status: "Accepted" as const,
    decision:
      "RTC-3:6 remains Enforcement. RTC-3:6 readiness remains ReadyForExecutionContract. RTC-3:7 is the intended ExecutionContract phase. The readiness name intentionally describes the immediate next phase. This is a deliberate RTC-3 lifecycle convention, not an accidental copy of RTC-2.",
    rationale:
      "RTC-2:6 used ReadyForCertification despite RTC-2:7 being an execution contract; that mismatch was later corrected architecturally in RTC-2. RTC-3 should use an explicit, semantically accurate readiness value from the start. No prior RTC-3 file or accepted architecture decision defined ReadyForExecutionContract before RTC-3:6.",
    consequences: Object.freeze([
      "No runtime behavior is added.",
      "RTC-3:6 remains metadata-only and side-effect free.",
      "RTC-1 and RTC-2 remain unchanged.",
      "RTC-3:7 is not created by this decision alone.",
      "Future phases must preserve or formally supersede this decision.",
      "D-31 through D-36 remain unchanged.",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterEnforcementArchitectureDecisions =
  Object.freeze([
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc306,
  ] as const);

export const ExecutiveDecisionRegisterEnforcementProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next.js",
    "rendering",
    "RTC-2 modules",
    "RTC-1 Public Index",
    "Decision Journal APP-8 implementation",
    "direct RTC-3:4 runtime import",
    "direct RTC-3:3 runtime import",
    "direct RTC-3:2 runtime import",
    "direct RTC-3:1 runtime import",
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
    "decision payload inspection for authority",
  ] as const);

export const ExecutiveDecisionRegisterEnforcementOwnership = Object.freeze({
  ownershipId: "RTC-3:6/ExecutiveDecisionRegisterEnforcementOwnership",
  sourcePhase: "RTC-3:6" as const,
  owns: Object.freeze([
    "Enforcement result vocabulary",
    "Enforcement-step vocabulary",
    "Obligation-to-step mapping",
    "Confirmation binding checks",
    "Immutable enforcement plans",
    "Local decisions D-31 through D-36",
    "Architecture decision AD-RTC3-06",
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
  importsPolicyByReference: true as const,
  importsValidationDirectly: false as const,
  importsModelDirectly: false as const,
  importsRegistryDirectly: false as const,
  importsFoundationDirectly: false as const,
  ownsExecution: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveDecisionRegisterEnforcementBoundaries = Object.freeze({
  boundariesId: "RTC-3:6/ExecutiveDecisionRegisterEnforcementBoundaries",
  sourcePhase: "RTC-3:6" as const,
  sourcePolicyId: ExecutiveDecisionRegisterPolicy.identity.id,
  sourcePolicyReadiness: ExecutiveDecisionRegisterPolicy.readiness,
  validationViaPolicy: ExecutiveDecisionRegisterPolicy.validation,
  modelViaPolicy: ExecutiveDecisionRegisterPolicy.model,
  foundationViaPolicy: ExecutiveDecisionRegisterPolicy.foundation,
  aiMustNot: ExecutiveDecisionRegisterEnforcementAiMustNot,
  acceptsOnlyValidatedPolicyDecisions: true as const,
  neverExecutesPlans: true as const,
  failClosed: true as const,
  denyProducesBlocked: true as const,
  confirmationProducesAwaiting: true as const,
  allowMayProduceEnforceable: true as const,
  preservesUpstreamReferences: true as const,
  openIssuesUnresolved: true as const,
  resolvesOpenIssues: false as const,
  createsAuthority: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterEnforcementProhibitedSurfaces,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterEnforcementConstants = Object.freeze({
  phaseIdentifier: "RTC-3:6",
  canonicalIdentifier: ExecutiveDecisionRegisterEnforcementId,
  version: ExecutiveDecisionRegisterEnforcementVersion,
  name: ExecutiveDecisionRegisterEnforcementName,
  namespace: ExecutiveDecisionRegisterEnforcementNamespace,
  status: ExecutiveDecisionRegisterEnforcementStatus,
  readiness: ExecutiveDecisionRegisterEnforcementReadiness,
  nextPhase: ExecutiveDecisionRegisterEnforcementNextPhase,
  ruleCount: ExecutiveDecisionRegisterEnforcementRules.length,
  contractCount: ExecutiveDecisionRegisterEnforcementContracts.length,
  stepKindCount: ExecutiveDecisionRegisterEnforcementStepKinds.length,
  obligationMappingCount: Object.keys(
    ExecutiveDecisionRegisterObligationStepMapping,
  ).length,
  lifecycleStateCount: ExecutiveDecisionRegisterEnforcementLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterEnforcementOpenIssues.length,
  decisionCount: ExecutiveDecisionRegisterEnforcementDecisions.length,
} as const);

export const ExecutiveDecisionRegisterEnforcementMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterEnforcementConstants,
  principles: ExecutiveDecisionRegisterEnforcementPrinciples,
  decisions: ExecutiveDecisionRegisterEnforcementDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc306,
  architectureDecisions:
    ExecutiveDecisionRegisterEnforcementArchitectureDecisions,
  architectureDecisionIds: Object.freeze(["AD-RTC3-06"] as const),
  openIssues: ExecutiveDecisionRegisterEnforcementOpenIssues,
  ownership: ExecutiveDecisionRegisterEnforcementOwnership,
  boundaries: ExecutiveDecisionRegisterEnforcementBoundaries,
  readiness: ExecutiveDecisionRegisterEnforcementReadiness,
  nextPhase: ExecutiveDecisionRegisterEnforcementNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
