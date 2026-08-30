/**
 * DTH:5 — Scene Intent contract.
 * Visual purpose of the current Decision Theatre scene.
 * Not conversation intent, not journey state, not a second NLU.
 */

export const nexoraDecisionTheatreSceneIntentIdentity =
  "DTH:5/SceneIntent" as const;
export const nexoraDecisionTheatreSceneIntentVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_SCENE_INTENT_KINDS = Object.freeze([
  "PRESERVE_SCENE",
  "ORIENT_TO_STAGE",
  "REVIEW_FOCAL_OBJECT",
  "REVIEW_COLLECTION",
  "INVESTIGATE_CONDITION",
  "COMPARE_CANDIDATES",
  "REVIEW_CONSEQUENCE",
  "REVIEW_COMMITMENT",
  "REVIEW_EXECUTION",
  "REVIEW_OUTCOME",
  "CLARIFY_SCENE",
] as const);

export type NexoraDecisionTheatreSceneIntentKind =
  (typeof NEXORA_DECISION_THEATRE_SCENE_INTENT_KINDS)[number];

export const NEXORA_DECISION_THEATRE_STAGE_MUTATION_PERMISSIONS = Object.freeze([
  "NO_CHANGE",
  "PRESERVE_AND_EXPLAIN",
  "RECOMPOSE_EXISTING",
  "CLARIFY_WITHOUT_CHANGE",
] as const);

export type NexoraDecisionTheatreStageMutationPermission =
  (typeof NEXORA_DECISION_THEATRE_STAGE_MUTATION_PERMISSIONS)[number];

export const NEXORA_DECISION_THEATRE_CONTEXT_SUFFICIENCY = Object.freeze([
  "SUFFICIENT",
  "PARTIAL",
  "INSUFFICIENT",
] as const);

export type NexoraDecisionTheatreContextSufficiency =
  (typeof NEXORA_DECISION_THEATRE_CONTEXT_SUFFICIENCY)[number];

export type NexoraDecisionTheatreSceneIntentClarification = Readonly<{
  required: boolean;
  reason: string | null;
  question: string | null;
  missing: string | null;
}>;

export type NexoraDecisionTheatreSceneIntent = Readonly<{
  identity: typeof nexoraDecisionTheatreSceneIntentIdentity;
  version: typeof nexoraDecisionTheatreSceneIntentVersion;
  sceneIntentId: string;
  intentKind: NexoraDecisionTheatreSceneIntentKind;
  managerQuestionRef: string | null;
  canonicalSemanticResultRef: string;
  activeExecutiveContextRef: string | null;
  journeyStateRef: string | null;
  activeCollectionRef: Readonly<{
    kind: string;
    memberIds: readonly string[];
  }> | null;
  focalExecutiveObjectRef: string | null;
  comparisonMembers: readonly string[];
  comparisonCriterion: string | null;
  contextSufficiency: NexoraDecisionTheatreContextSufficiency;
  clarification: NexoraDecisionTheatreSceneIntentClarification;
  stageMutationPermission: NexoraDecisionTheatreStageMutationPermission;
  preservationRequirement: string;
  managerQuestionPurpose: string;
  provenance: readonly string[];
  limitations: readonly string[];
  safeFallback: "PRESERVE_SCENE";
  derivationMetadata: Readonly<{
    resolver: "DTH:5/SceneIntentResolver";
    parsedRawManagerText: false;
    duplicateNlu: false;
    atmosphereSelected: false;
    createdExecutiveObject: false;
    createdIconicValue: false;
    approvedDecision: false;
    startedExecution: false;
    wroteOutcome: false;
    createdLearning: false;
  }>;
}>;
