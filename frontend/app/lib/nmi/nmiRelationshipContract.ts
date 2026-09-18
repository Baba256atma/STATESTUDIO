/**
 * NPA-T NMI:1 — bounded management relationship vocabulary.
 * Does not own causal graphs, Evidence, or VAI roles.
 */

export const NMI_MANAGEMENT_RELATIONS = Object.freeze([
  "supports",
  "measures",
  "affects",
  "depends_on",
  "belongs_to",
  "threatens",
  "addresses",
  "evidenced_by",
  "evaluated_by",
  "selected_as",
  "executed_by",
  "observed_by",
  "reassesses",
] as const);

export type NmiManagementRelation = (typeof NMI_MANAGEMENT_RELATIONS)[number];

export const NMI_RELATION_EPISTEMIC_STATUSES = Object.freeze([
  "UNKNOWN",
  "DECLARED",
  "ASSOCIATION",
  "MANAGER_ASSERTED",
  "EVIDENCE_REFERENCED",
] as const);

export type NmiRelationEpistemicStatus = (typeof NMI_RELATION_EPISTEMIC_STATUSES)[number];

export type NmiManagementRelationship = {
  readonly relationshipId: string;
  readonly fromId: string;
  readonly toId: string;
  readonly kind: NmiManagementRelation;
  readonly epistemicStatus: NmiRelationEpistemicStatus;
  readonly causal: false;
  readonly convertsAssociationToCause: false;
  readonly convertsAssumptionToFact: false;
  readonly sourceAuthority: string;
  readonly sourceRef: string;
};

export const NMI_CAUSAL_EVIDENCE_SAFETY = Object.freeze({
  correlationToCausation: false as const,
  associationToConfirmedDriver: false as const,
  managerAssumptionToFact: false as const,
  simulationToObservation: false as const,
  scenarioToDecision: false as const,
  decisionToExecution: false as const,
  outcomeToLearningTruth: false as const,
  epistemicOwner: "VAI:3 / CC:8 / Data Reality / CORE-INT:3",
});
