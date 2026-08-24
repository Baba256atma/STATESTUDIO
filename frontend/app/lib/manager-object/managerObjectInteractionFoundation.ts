/**
 * MO:1 — Manager–Object Interaction Foundation.
 *
 * Canonical manager ↔ executive-object interaction contract.
 * Does not own Stage, Advisor, EI, Decision, Execution, or APP-4 truth.
 *
 * Precedence: Canonical Runtime Truth > Interaction Context > Presentation
 */

export const managerObjectInteractionFoundationIdentity =
  "MO:1/ManagerObjectInteractionFoundation" as const;
export const managerObjectInteractionFoundationVersion = "1.0.0" as const;
export const managerObjectInteractionFoundationNamespace =
  "nexora.manager-object.interaction.foundation" as const;
export const managerObjectInteractionFoundationPhase =
  "ManagerObjectInteractionFoundation" as const;
export const managerObjectInteractionFoundationArchitecturalRole =
  "ManagerObjectInteractionContractAuthority" as const;

export type ManagerObjectInteractionFoundationIdentity = {
  readonly id: typeof managerObjectInteractionFoundationIdentity;
  readonly version: typeof managerObjectInteractionFoundationVersion;
  readonly namespace: typeof managerObjectInteractionFoundationNamespace;
  readonly phase: typeof managerObjectInteractionFoundationPhase;
  readonly architecturalRole: typeof managerObjectInteractionFoundationArchitecturalRole;
};

const IDENTITY: ManagerObjectInteractionFoundationIdentity = Object.freeze({
  id: managerObjectInteractionFoundationIdentity,
  version: managerObjectInteractionFoundationVersion,
  namespace: managerObjectInteractionFoundationNamespace,
  phase: managerObjectInteractionFoundationPhase,
  architecturalRole: managerObjectInteractionFoundationArchitecturalRole,
});

export function getManagerObjectInteractionFoundationIdentity(): ManagerObjectInteractionFoundationIdentity {
  return IDENTITY;
}

export const MANAGER_OBJECT_INTERACTION_BOUNDARY = Object.freeze({
  architecturalRole: managerObjectInteractionFoundationArchitecturalRole,
  redesignsStage: false as const,
  redesignsAdvisor: false as const,
  redesignsEiRuntime: false as const,
  inventsObjectArchitecture: false as const,
  createsParallelTruth: false as const,
  fabricatesMissingEvidence: false as const,
  fabricatesRelationships: false as const,
  hardCodesPerObjectConversation: false as const,
  usesLlm: false as const,
  writesApp4: false as const,
  startsMo2: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > Interaction Context > Presentation" as const,
});

export const MANAGER_OBJECT_KINDS = Object.freeze([
  "object",
  "goal",
  "problem",
  "risk",
  "opportunity",
  "scenario",
  "decision",
  "execution",
  "outcome",
  "unknown",
] as const);

export type ManagerObjectKind = (typeof MANAGER_OBJECT_KINDS)[number];

export const MANAGER_OBJECT_INTENTS = Object.freeze([
  "EXPLAIN",
  "STATUS",
  "WHY",
  "RELATIONSHIPS",
  "IMPACT",
  "RISK",
  "OPTIONS",
  "SCENARIO",
  "RECOMMEND",
  "DECIDE",
  "NEXT_ACTION",
  "EXECUTION",
  "OUTCOME",
] as const);

export type ManagerObjectIntent = (typeof MANAGER_OBJECT_INTENTS)[number];

export const MANAGER_OBJECT_SUPPORT_STATUSES = Object.freeze([
  "KNOWN",
  "INFERRED",
  "UNKNOWN",
] as const);

export type ManagerObjectSupportStatus =
  (typeof MANAGER_OBJECT_SUPPORT_STATUSES)[number];

export const MANAGER_OBJECT_ACTIVATION_SOURCES = Object.freeze([
  "click",
  "conversation-named",
  "conversation-deictic",
  "preserved",
  "none",
] as const);

export type ManagerObjectActivationSource =
  (typeof MANAGER_OBJECT_ACTIVATION_SOURCES)[number];

export const MANAGER_OBJECT_AUTHORITY = Object.freeze({
  evidence: "RDI / Data Reality",
  intelligence: "EI / CORE-INT live projections",
  conversation: "CC:1–CC:7",
  decision: "Decision Runtime",
  execution: "Execution Runtime",
  memory: "APP-4",
  stage: "NEX-MVP:4 / STAGE-2D",
  advisor: "UX:3 Advisor presentation",
} as const);
