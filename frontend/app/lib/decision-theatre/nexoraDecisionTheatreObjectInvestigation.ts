/**
 * DTH:6 — Object Investigation Context contract.
 * Read-oriented Theatre presentation. Not a source of business truth.
 */

export const nexoraDecisionTheatreObjectInvestigationIdentity =
  "DTH:6/ObjectInvestigation" as const;
export const nexoraDecisionTheatreObjectInvestigationVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_INVESTIGATION_LEVELS = Object.freeze([
  "glance",
  "understand",
  "investigate",
] as const);

export type NexoraDecisionTheatreInvestigationLevel =
  (typeof NEXORA_DECISION_THEATRE_INVESTIGATION_LEVELS)[number];

export const NEXORA_DECISION_THEATRE_INVESTIGATION_ACTIONS = Object.freeze([
  "EXPLAIN_OBJECT",
  "SHOW_EVIDENCE",
  "SHOW_RELATIONSHIPS",
  "SHOW_HISTORY",
  "SHOW_DECISION_RELEVANCE",
  "COMPARE_RELATED",
  "RETURN_TO_SCENE",
] as const);

export type NexoraDecisionTheatreInvestigationAction =
  (typeof NEXORA_DECISION_THEATRE_INVESTIGATION_ACTIONS)[number];

export type NexoraDecisionTheatreInvestigationRelatedRef = Readonly<{
  id: string;
  label: string;
  kind: string;
  relation: string;
  causalStatus: "unsupported" | "candidate" | "confirmed";
}>;

export type NexoraDecisionTheatreInvestigationEvidenceItem = Readonly<{
  label: string;
  epistemicStatus: "known" | "inferred" | "unknown" | "predicted" | "unavailable";
  strength: string | null;
  mustNotInfer: string;
}>;

export type NexoraDecisionTheatreInvestigationActionAvailability = Readonly<{
  action: NexoraDecisionTheatreInvestigationAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreAdvisorInvestigationSummary = Readonly<{
  objectName: string;
  objectKind: string;
  whyInvestigating: string;
  currentState: string;
  evidence: string;
  related: string;
  uncertainty: string;
  comparison: string | null;
  suggestedQuestions: readonly string[];
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreObjectInvestigation = Readonly<{
  identity: typeof nexoraDecisionTheatreObjectInvestigationIdentity;
  version: typeof nexoraDecisionTheatreObjectInvestigationVersion;
  investigationId: string;
  open: boolean;
  level: NexoraDecisionTheatreInvestigationLevel;
  objectId: string;
  canonicalObjectType: string;
  visualFamily: "EXECUTIVE_OBJECT" | "ICONIC_OBJECT";
  managerReadableName: string;
  currentState: string;
  sceneRole: string | null;
  presenceReason: string;
  sceneIntentKind: string;
  sceneScriptId: string;
  relatedGoal: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedProblem: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedOpportunity: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedScenario: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedDecision: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedExecution: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedOutcome: NexoraDecisionTheatreInvestigationRelatedRef | null;
  relatedKpi: NexoraDecisionTheatreInvestigationRelatedRef | null;
  evidence: readonly NexoraDecisionTheatreInvestigationEvidenceItem[];
  cost: string | null;
  time: string | null;
  uncertainty: string;
  confidenceOrLimitation: string;
  temporal: string | null;
  relationships: readonly NexoraDecisionTheatreInvestigationRelatedRef[];
  comparisonMemberIds: readonly string[];
  comparisonPreserved: boolean;
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreInvestigationActionAvailability[];
  glance: Readonly<{ identity: string; state: string; whyRelevant: string }>;
  advisorReadable: NexoraDecisionTheatreAdvisorInvestigationSummary;
  provenance: readonly string[];
  limitations: readonly string[];
  safeFallback: "close-without-scene-change";
  derivationMetadata: Readonly<{
    composer: "DTH:6/ObjectInvestigationComposer";
    parsedRawManagerText: false;
    inventedEvidence: false;
    inventedCausality: false;
    manufacturedComparison: false;
    mutatedStage: false;
    mutatedDecision: false;
    startedExecution: false;
    timestampUsed: false;
    randomUsed: false;
    coveredWholeTheatre: false;
  }>;
}>;
