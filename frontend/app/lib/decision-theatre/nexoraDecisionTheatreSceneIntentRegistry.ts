/**
 * DTH:5 — Canonical Scene Intent registry.
 * Only intentions grounded in existing Nexora capabilities.
 */

import type {
  NexoraDecisionTheatreSceneIntentKind,
  NexoraDecisionTheatreStageMutationPermission,
} from "./nexoraDecisionTheatreSceneIntent.ts";

export const nexoraDecisionTheatreSceneIntentRegistryIdentity =
  "DTH:5/SceneIntentRegistry" as const;

export type NexoraDecisionTheatreSceneIntentDefinition = Readonly<{
  kind: NexoraDecisionTheatreSceneIntentKind;
  managerQuestionPurpose: string;
  mutationPermission: NexoraDecisionTheatreStageMutationPermission;
  preservationRequirement: string;
  mayCreateObject: false;
  mayApproveDecision: false;
  mayStartExecution: false;
  maySelectAtmosphere: false;
}>;

function define(
  kind: NexoraDecisionTheatreSceneIntentKind,
  managerQuestionPurpose: string,
  mutationPermission: NexoraDecisionTheatreStageMutationPermission,
  preservationRequirement: string,
): NexoraDecisionTheatreSceneIntentDefinition {
  return Object.freeze({
    kind,
    managerQuestionPurpose,
    mutationPermission,
    preservationRequirement,
    mayCreateObject: false,
    mayApproveDecision: false,
    mayStartExecution: false,
    maySelectAtmosphere: false,
  });
}

export const NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY = Object.freeze({
  PRESERVE_SCENE: define(
    "PRESERVE_SCENE",
    "Keep the current Stage unchanged while answering a knowledge or unsupported request.",
    "NO_CHANGE",
    "Preserve current Scene Script, focus, collection, and atmosphere.",
  ),
  ORIENT_TO_STAGE: define(
    "ORIENT_TO_STAGE",
    "What is currently on Stage?",
    "PRESERVE_AND_EXPLAIN",
    "Preserve current authoritative participants; do not invent objects.",
  ),
  REVIEW_FOCAL_OBJECT: define(
    "REVIEW_FOCAL_OBJECT",
    "What is happening with this Object?",
    "RECOMPOSE_EXISTING",
    "Use the resolved Executive Object; preserve related actors and causality safety.",
  ),
  REVIEW_COLLECTION: define(
    "REVIEW_COLLECTION",
    "Which items are in the requested collection?",
    "RECOMPOSE_EXISTING",
    "Preserve every supported collection member; never collapse membership.",
  ),
  INVESTIGATE_CONDITION: define(
    "INVESTIGATE_CONDITION",
    "What may be preventing this Goal or condition?",
    "RECOMPOSE_EXISTING",
    "Treat causes as candidates unless confirmed; preserve evidence and uncertainty.",
  ),
  COMPARE_CANDIDATES: define(
    "COMPARE_CANDIDATES",
    "How should these resolved candidates be compared?",
    "RECOMPOSE_EXISTING",
    "Require at least two members; preserve the explicit criterion; do not approve a Decision.",
  ),
  REVIEW_CONSEQUENCE: define(
    "REVIEW_CONSEQUENCE",
    "What happens if we do nothing or ignore this?",
    "RECOMPOSE_EXISTING",
    "Preserve prediction as prediction; do not present future projection as Outcome.",
  ),
  REVIEW_COMMITMENT: define(
    "REVIEW_COMMITMENT",
    "What Decision is being reviewed, and what would we be committing to?",
    "RECOMPOSE_EXISTING",
    "Preserve preference ≠ approval; do not approve or mutate the Decision.",
  ),
  REVIEW_EXECUTION: define(
    "REVIEW_EXECUTION",
    "What is currently being executed, and what happens next?",
    "RECOMPOSE_EXISTING",
    "Preserve Decision approved ≠ Execution started; do not start Execution.",
  ),
  REVIEW_OUTCOME: define(
    "REVIEW_OUTCOME",
    "What changed after execution, and did we reach the Goal?",
    "RECOMPOSE_EXISTING",
    "Preserve observation ≠ causality and Outcome ≠ Learning.",
  ),
  CLARIFY_SCENE: define(
    "CLARIFY_SCENE",
    "Which of the remaining visual scenes does the manager mean?",
    "CLARIFY_WITHOUT_CHANGE",
    "Preserve current Stage; ask at most one necessary clarification.",
  ),
} as const satisfies Record<
  NexoraDecisionTheatreSceneIntentKind,
  NexoraDecisionTheatreSceneIntentDefinition
>);
