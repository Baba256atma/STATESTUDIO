/**
 * BCA:5 — manager role and decision-context relevance.
 * Advisory context only. Not RBAC, CC:10R, CC:11, or Advisor personalization.
 */
import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectProcessPlacement } from "./businessProjectProcessContextContract.ts";
import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectSourceRef,
  ContextConfirmationState,
} from "./businessProjectContextContract.ts";
import type { BusinessProjectConceptRelationship } from "./businessProjectRelationshipContract.ts";

export const managerDecisionContextIdentity = "BCA:5/ManagerRoleAndDecisionContext" as const;

export const MANAGER_DECISION_CONTEXT_BOUNDARY = Object.freeze({
  consumesBca1Context: true as const,
  consumesBca2Concepts: true as const,
  consumesBca3Relationships: true as const,
  consumesBca4ProcessContext: true as const,
  ownsManagerIdentity: false as const,
  ownsPermissions: false as const,
  ownsDecisionAuthority: false as const,
  ownsAdvisor: false as const,
  ownsNca: false as const,
  infersAuthorityFromRole: false as const,
  recommendsActions: false as const,
  ranksImportance: false as const,
  mutatesStage: false as const,
  mutatesDecisionTheatre: false as const,
  mutatesDurableProfile: false as const,
  writesManagerConfirmation: false as const,
  persistsState: false as const,
  usesLlm: false as const,
});

export const MANAGER_ROLE_FAMILIES = Object.freeze([
  "EXECUTIVE", "FINANCE", "OPERATIONS", "PROJECT", "SALES", "MARKETING", "SUPPLY_CHAIN",
  "PROCUREMENT", "QUALITY", "CUSTOMER_SERVICE", "PEOPLE_HR", "TECHNOLOGY", "GENERAL_MANAGEMENT", "UNKNOWN",
] as const);
export type ManagerRoleFamily = (typeof MANAGER_ROLE_FAMILIES)[number];

export type ManagerRoleState = "KNOWN" | "MANAGER_CONFIRMED" | "AMBIGUOUS" | "UNKNOWN";
export type ManagerExpertise = "EXPERT" | "EXPERIENCED" | "GENERAL" | "UNKNOWN";
export type ManagerContextScope = "GENERAL_ROLE" | "ORGANIZATION" | "BUSINESS" | "PROJECT" | "GOAL" | "CURRENT_CONVERSATION" | "CURRENT_DECISION_CONTEXT";

export type ManagerRoleRecord = Readonly<{
  rawTitle: string | null;
  canonicalRoleFamily: ManagerRoleFamily;
  state: ManagerRoleState;
  confirmationState: ContextConfirmationState;
  sourceRef: BusinessProjectSourceRef | null;
}>;

export type ManagerDecisionContext = Readonly<{
  authority: typeof managerDecisionContextIdentity;
  managerContextId: string;
  managerId: string | null;
  managerName: string | null;
  roles: readonly ManagerRoleRecord[];
  roleFamily: ManagerRoleFamily;
  rawTitle: string | null;
  businessProjectContextId: string;
  responsibilityAreas: readonly string[];
  decisionContextAreas: readonly string[];
  relevantConceptIds: readonly string[];
  relevantRelationshipIds: readonly string[];
  relevantProcessContextIds: readonly string[];
  relevantGoalLabels: readonly string[];
  attentionPriorities: readonly string[];
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ContextConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  scope: ManagerContextScope;
  ambiguity: Readonly<{ preserved: boolean; note: string | null; candidates: readonly string[] }>;
  permissionsKnown: false | true;
  decisionAuthorityKnown: false | true;
  permissions: null;
  decisionAuthorities: null;
  expertise: ManagerExpertise;
  durableRoleUnchangedBySession: true;
  roleBasedAuthorityInferenceRejected: true;
  recommendationGenerated: false;
  mostImportantClaimed: false;
  rejectedInferences: readonly string[];
}>;

export type ResolveManagerDecisionContextInput = Readonly<{
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  relationships?: readonly BusinessProjectConceptRelationship[];
  processPlacements?: readonly BusinessProjectProcessPlacement[];
  managerId?: string | null;
  managerName?: string | null;
  rawTitles?: readonly string[];
  managerConfirmedRoles?: readonly Readonly<{ family: ManagerRoleFamily; rawTitle: string; sourceRef: BusinessProjectSourceRef }>[];
  goalLabels?: readonly string[];
  currentConversationConcern?: string | null;
  conversationInterest?: string | null;
  suppliedPermissions?: never;
  suppliedDecisionAuthorities?: null;
}>;

export type ManagerDecisionContextDiagnostics = Readonly<{
  managerContextId: string;
  roleTrace: readonly string[];
  relevanceTrace: readonly string[];
  roleBasedAuthorityInferenceRejected: true;
  durableRoleUnchangedBySession: true;
  recommendationGenerated: false;
  mutatesAuthorities: false;
}>;
