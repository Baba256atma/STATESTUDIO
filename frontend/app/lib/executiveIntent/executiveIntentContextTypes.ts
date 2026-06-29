/**
 * APP-3.3.1 — Executive Intent context types.
 * Deterministic context model vocabulary — no reasoning or recommendations.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { IntentContextDiagnostic } from "./executiveIntentContextDiagnostics.ts";
import type { ExecutiveIntent } from "./executiveIntentTypes.ts";
import type { ExecutiveIntentSemanticModel } from "./executiveIntentSemanticTypes.ts";
import type { IntentResolutionResult } from "./executiveIntentStateTypes.ts";

export const EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION = "APP-3.3.1" as const;

export type IntentContextScope =
  | "enterprise"
  | "workspace"
  | "business_unit"
  | "department"
  | "project"
  | "object"
  | "cross_department"
  | "unknown";

export type IntentWorkspaceContext = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId | null;
  workspaceLabel: string;
  scope: IntentContextScope;
  scopeLabel: string;
  owner: string | null;
  source: string | null;
  readiness: string | null;
  stateCategory: string | null;
  readOnly: true;
}>;

export type IntentBusinessContext = Readonly<{
  businessDomain: string;
  category: string | null;
  primaryGoalLabel: string | null;
  actionType: string | null;
  timeHorizonLabel: string | null;
  desiredFutureState: string | null;
  readOnly: true;
}>;

export type IntentObjectContext = Readonly<{
  objectId: string;
  label: string;
  objectType: string;
  source: "semantic_object" | "semantic_target" | "intent_reference" | "intent_target";
  readOnly: true;
}>;

export type IntentRelationshipContext = Readonly<{
  relationshipId: string;
  relationType: string;
  sourceIntentId: IntentIdentifier;
  targetIntentId: IntentIdentifier;
  label: string;
  readOnly: true;
}>;

export type IntentEvidenceContext = Readonly<{
  evidenceId: string;
  label: string;
  source: string;
  summary: string;
  origin: "intent" | "semantic";
  readOnly: true;
}>;

export type IntentConstraintContext = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  origin: "intent" | "semantic";
  readOnly: true;
}>;

export type IntentStakeholderContext = Readonly<{
  stakeholderId: string;
  name: string;
  role: string | null;
  stakeholderType: "owner" | "actor" | "reference";
  readOnly: true;
}>;

export type IntentContextFlags = Readonly<{
  workspaceReady: boolean;
  businessReady: boolean;
  objectsReady: boolean;
  relationshipsReady: boolean;
  stakeholdersReady: boolean;
  constraintsReady: boolean;
  evidenceReady: boolean;
  complete: boolean;
  incomplete: boolean;
  unknown: boolean;
  futureCompatible: true;
  readOnly: true;
}>;

export type IntentContextSummary = Readonly<{
  headline: string;
  scopeLabel: string;
  businessDomain: string;
  objectCount: number;
  relationshipCount: number;
  stakeholderCount: number;
  constraintCount: number;
  evidenceCount: number;
  knownCount: number;
  unknownCount: number;
  readOnly: true;
}>;

export type IntentContextMetadata = Readonly<{
  contextEngineVersion: typeof EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION;
  contractVersion: string | null;
  semanticModelVersion: string | null;
  stateEngineVersion: string | null;
  owner: string;
  readOnly: true;
}>;

export type ExecutiveIntentContext = Readonly<{
  contextId: string;
  intentId: IntentIdentifier | null;
  workspaceId: ExecutiveIntentWorkspaceId | null;
  scope: IntentContextScope;
  workspace: IntentWorkspaceContext;
  business: IntentBusinessContext;
  objects: readonly IntentObjectContext[];
  relationships: readonly IntentRelationshipContext[];
  stakeholders: readonly IntentStakeholderContext[];
  constraints: readonly IntentConstraintContext[];
  evidence: readonly IntentEvidenceContext[];
  knownContext: readonly string[];
  unknownContext: readonly string[];
  summary: IntentContextSummary;
  flags: IntentContextFlags;
  diagnostics: readonly IntentContextDiagnostic[];
  metadata: IntentContextMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveIntentContextAnalysisInput = Readonly<{
  intent: ExecutiveIntent | null;
  state: IntentResolutionResult | null;
  semanticModel: ExecutiveIntentSemanticModel | null;
  timestamp: string;
  readOnly: true;
}>;

export type IntentContextValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3.15.1 reasoning integration refresh. */
export type IntentContextFutureExtension = Readonly<{
  reasoningBindings: null;
  platformRunnerBindings: null;
}>;

export const INTENT_CONTEXT_FUTURE_EXTENSION: IntentContextFutureExtension = Object.freeze({
  reasoningBindings: null,
  platformRunnerBindings: null,
});

export function createExecutiveIntentContextAnalysisInput(
  input: Omit<ExecutiveIntentContextAnalysisInput, "readOnly">
): ExecutiveIntentContextAnalysisInput {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveIntentContext(
  input: Omit<ExecutiveIntentContext, "readOnly">
): ExecutiveIntentContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentContextSummary(
  input: Omit<IntentContextSummary, "readOnly">
): IntentContextSummary {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentContextFlags(
  input: Omit<IntentContextFlags, "readOnly" | "futureCompatible">
): IntentContextFlags {
  return Object.freeze({ ...input, futureCompatible: true as const, readOnly: true as const });
}

export function createIntentContextMetadata(
  input: Omit<IntentContextMetadata, "readOnly">
): IntentContextMetadata {
  return Object.freeze({ ...input, readOnly: true as const });
}

export type ExecutiveIntentContextBuildInput = ExecutiveIntentContextAnalysisInput;
