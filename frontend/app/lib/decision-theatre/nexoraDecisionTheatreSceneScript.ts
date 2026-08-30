/**
 * DTH:5 — Scene Script contract.
 * Immutable, renderer-neutral Director instruction.
 * No CSS, WebGL coordinates, or fabricated business data.
 */

import type { NexoraDecisionTheatreSceneIntentKind } from "./nexoraDecisionTheatreSceneIntent.ts";
import type { NexoraDecisionTheatreSceneActorRole } from "./nexoraDecisionTheatreSceneActorRoles.ts";

export const nexoraDecisionTheatreSceneScriptIdentity =
  "DTH:5/SceneScript" as const;
export const nexoraDecisionTheatreSceneScriptVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_SCENE_TRANSITION_POLICIES = Object.freeze([
  "PRESERVE",
  "RECOMPOSE",
  "FOCUS_EXISTING",
  "RESTORE_SNAPSHOT",
  "NO_VISUAL_TRANSITION",
] as const);

export type NexoraDecisionTheatreSceneTransitionPolicy =
  (typeof NEXORA_DECISION_THEATRE_SCENE_TRANSITION_POLICIES)[number];

export type NexoraDecisionTheatreSceneActor = Readonly<{
  canonicalId: string;
  role: NexoraDecisionTheatreSceneActorRole;
  executive: boolean;
  ownerExecutiveObjectId: string | null;
  presenceReason: string;
  iconicRole: string | null;
}>;

export type NexoraDecisionTheatreSceneRelationship = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  semanticRelation: string | null;
  causalStatus: "unsupported" | "candidate" | "confirmed";
  provenance: string;
}>;

export type NexoraDecisionTheatreAdvisorSceneSummary = Readonly<{
  question: string;
  anchor: string | null;
  visibleActors: readonly string[];
  roles: readonly string[];
  whyPresent: readonly string[];
  relationshipsThatMatter: readonly string[];
  uncertainRelationships: readonly string[];
  iconicObjects: readonly string[];
  evidence: readonly string[];
  unavailable: readonly string[];
  mustNotInfer: readonly string[];
  stagePreserved: boolean;
}>;

export type NexoraDecisionTheatreSceneScript = Readonly<{
  identity: typeof nexoraDecisionTheatreSceneScriptIdentity;
  version: typeof nexoraDecisionTheatreSceneScriptVersion;
  scriptId: string;
  sceneIntentId: string;
  intentKind: NexoraDecisionTheatreSceneIntentKind;
  activeQuestion: string;
  anchorActorId: string | null;
  actors: readonly NexoraDecisionTheatreSceneActor[];
  iconicParticipantIds: readonly string[];
  relationships: readonly NexoraDecisionTheatreSceneRelationship[];
  visualGrammarRef: string;
  requestedGrammarDirectives: readonly string[];
  atmosphereRef: string;
  presentationLevel: string;
  contextEvidenceRefs: readonly string[];
  unsupportedOrDeferred: readonly string[];
  preservationRules: readonly string[];
  transitionPolicy: NexoraDecisionTheatreSceneTransitionPolicy;
  advisorReadable: NexoraDecisionTheatreAdvisorSceneSummary;
  provenance: readonly string[];
  limitations: readonly string[];
  safeFallback: "preserve-last-valid-script";
  derivationMetadata: Readonly<{
    composer: "DTH:5/SceneScriptComposer";
    timestampUsed: false;
    randomUsed: false;
    rawCssPresent: false;
    coordinatesPresent: false;
    nexoSelectIntroduced: false;
    nexoCompareIntroduced: false;
    nexoTimeIntroduced: false;
    cardOrChartIntroduced: false;
    mutatedDecision: false;
    startedExecution: false;
    createdOutcomeOrLearning: false;
    atmosphereSelectedIndependently: false;
  }>;
}>;
