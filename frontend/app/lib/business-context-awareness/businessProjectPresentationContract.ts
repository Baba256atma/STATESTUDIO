/**
 * BCA:7 — context-aware presentation handoff.
 * Advisor/NCA, Director/Stage, and DTH remain the presentation authorities.
 */
import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { ContextClarificationNeed } from "./businessProjectContextClarificationContract.ts";
import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectContextKind,
  BusinessProjectSourceRef,
} from "./businessProjectContextContract.ts";
import type { BusinessProjectProcessPlacement } from "./businessProjectProcessContextContract.ts";
import type { ManagerDecisionContext, ManagerRoleFamily } from "./managerDecisionContextContract.ts";
import type { BusinessProjectConceptRelationship } from "./businessProjectRelationshipContract.ts";

export const businessProjectPresentationIdentity = "BCA:7/ContextAwarePresentation" as const;

export const BUSINESS_PROJECT_PRESENTATION_BOUNDARY = Object.freeze({
  consumesBca1To6: true as const,
  presentationOnly: true as const,
  ownsAdvisor: false as const,
  ownsNca: false as const,
  ownsDirector: false as const,
  ownsStage: false as const,
  ownsTheatre: false as const,
  writesConfirmation: false as const,
  recommendsActions: false as const,
  ranksImportance: false as const,
  mutatesStageMembership: false as const,
  mutatesStageFocus: false as const,
  mutatesCollections: false as const,
  mutatesObjectSize: false as const,
  mutatesObjectColor: false as const,
  encodesCausalVisuals: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  observesOutcome: false as const,
  createsLearning: false as const,
  createsObjects: false as const,
  usesLlm: false as const,
});

export type PresentationRequestKind =
  | "SITUATION"
  | "WHY"
  | "WHY_SHOWING"
  | "EXPLAIN_OBJECT"
  | "LOOK_AT"
  | "OUTCOME"
  | "CLARIFICATION";

export type AdvisorPresentationHandoff = Readonly<{
  roleFamily: ManagerRoleFamily;
  emphasisMeanings: readonly string[];
  decisionContextAreas: readonly string[];
  processAreas: readonly string[];
  relationshipQualifiers: readonly string[];
  managerFacingExplanation: string;
  clarificationQuestionIntent: string | null;
  ncaOwnsWording: true;
  jargonLeakageRejected: true;
}>;

export type DirectorPresentationHandoff = Readonly<{
  relevantConceptIds: readonly string[];
  currentDecisionContextConceptIds: readonly string[];
  relevantProcessContextIds: readonly string[];
  clarificationSubjectId: string | null;
  mutatesStageMembership: false;
  mutatesStageFocus: false;
  mutatesCollections: false;
}>;

export type TheatrePresentationHandoff = Readonly<{
  contextuallyRelevantConceptIds: readonly string[];
  managerRoleRelevant: true | false;
  processContextRelevant: true | false;
  clarificationRelated: boolean;
  sizeUnchanged: true;
  colorUnchanged: true;
  causalVisualRejected: true;
  processMapCreated: false;
  scoresScenarios: false;
  commitsDecision: false;
  startsExecution: false;
}>;

export type StagePresentationSafety = Readonly<{
  objectsAdded: readonly string[];
  focusMutatedTo: null;
  collectionsMutated: false;
}>;

export type BusinessProjectPresentationContext = Readonly<{
  authority: typeof businessProjectPresentationIdentity;
  presentationContextId: string;
  contextKind: BusinessProjectContextKind;
  managerRoleContext: ManagerDecisionContext | null;
  currentDecisionContext: readonly string[];
  relevantConceptIds: readonly string[];
  relevantRelationshipIds: readonly string[];
  relevantProcessContextIds: readonly string[];
  clarificationNeed: ContextClarificationNeed | null;
  advisorContext: AdvisorPresentationHandoff;
  stageContext: StagePresentationSafety;
  directorContext: DirectorPresentationHandoff;
  theatreContext: TheatrePresentationHandoff;
  underlyingEvidenceFingerprint: string;
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  sourceRefs: readonly BusinessProjectSourceRef[];
  presentationOnly: true;
  temporalStatus: "GENERAL" | "CURRENT" | "FORECAST" | "HISTORICAL" | null;
  rejectedInferences: readonly string[];
}>;

export type ResolveBusinessProjectPresentationInput = Readonly<{
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  relationships?: readonly BusinessProjectConceptRelationship[];
  processPlacements?: readonly BusinessProjectProcessPlacement[];
  managerDecisionContext?: ManagerDecisionContext | null;
  clarificationNeed?: ContextClarificationNeed | null;
  currentRequest: string;
  selectedConceptMeaning?: string | null;
  focusedStageObjectLabel?: string | null;
  authoritativeStageObjectLabels?: readonly string[];
  temporalStatus?: "GENERAL" | "CURRENT" | "FORECAST" | "HISTORICAL" | null;
  observedOutcomeLabel?: string | null;
}>;

export type BusinessProjectPresentationDiagnostics = Readonly<{
  presentationContextId: string;
  emphasisTrace: readonly string[];
  clarificationHandoff: string | null;
  evidenceFingerprint: string;
  advisorOwned: false;
  stageMutated: false;
  theatreMutated: false;
  mutatesAuthorities: false;
}>;
