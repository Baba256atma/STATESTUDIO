/**
 * APP-3:8 — Executive Intent dependency types.
 * Dependency graph output — no resolution, scheduling, or recommendations.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { IntentDependencyDiagnostic } from "./executiveIntentDependencyDiagnostics.ts";

export const EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION = "APP-3/8" as const;

export type IntentDependencyCategory =
  | "direct"
  | "indirect"
  | "blocking"
  | "enabling"
  | "sequential"
  | "parallel"
  | "shared_prerequisite"
  | "resource"
  | "constraint"
  | "strategic"
  | "operational"
  | "technology"
  | "compliance"
  | "unknown"
  | "custom";

export type IntentDependencyStrength =
  | "none"
  | "weak"
  | "moderate"
  | "strong"
  | "critical"
  | "unknown";

export type IntentDependencyReference = Readonly<{
  referenceId: string;
  intentId: IntentIdentifier | null;
  semanticModelId: string;
  label: string;
  readOnly: true;
}>;

export type IntentDependency = Readonly<{
  dependencyId: string;
  category: IntentDependencyCategory;
  strength: IntentDependencyStrength;
  ruleId: string;
  summary: string;
  explanation: string;
  dependentReference: IntentDependencyReference;
  prerequisiteReference: IntentDependencyReference;
  bidirectional: boolean;
  readOnly: true;
}>;

export type IntentDependencyNode = Readonly<{
  nodeId: string;
  semanticModelId: string;
  intentId: IntentIdentifier | null;
  label: string;
  readOnly: true;
}>;

export type IntentDependencyEdge = Readonly<{
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  dependencyId: string;
  category: IntentDependencyCategory;
  strength: IntentDependencyStrength;
  readOnly: true;
}>;

export type IntentDependencyGraph = Readonly<{
  graphId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  nodes: readonly IntentDependencyNode[];
  edges: readonly IntentDependencyEdge[];
  nodeIndex: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type IntentDependencyMatrix = Readonly<{
  matrixId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  intentCount: number;
  pairs: readonly IntentDependencyPair[];
  pairIndex: Readonly<Record<string, readonly string[]>>;
  readOnly: true;
}>;

export type IntentDependencyPair = Readonly<{
  pairId: string;
  dependentSemanticModelId: string;
  prerequisiteSemanticModelId: string;
  dependencies: readonly IntentDependency[];
  independent: boolean;
  readOnly: true;
}>;

export type IntentDependencyFlags = Readonly<{
  hasDependencies: boolean;
  hasDependents: boolean;
  circularDependency: boolean;
  sharedPrerequisite: boolean;
  independentIntent: boolean;
  requiresPrerequisite: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type IntentDependencySummary = Readonly<{
  headline: string;
  dependencyCount: number;
  edgeCount: number;
  nodeCount: number;
  highestStrength: IntentDependencyStrength;
  independent: boolean;
  readOnly: true;
}>;

export type IntentDependencyMetadata = Readonly<{
  dependencyEngineVersion: typeof EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION;
  semanticModelVersion: string;
  classificationEngineVersion: string | null;
  conflictEngineVersion: string | null;
  stateEngineVersion: string | null;
  rulesApplied: readonly string[];
  intentCount: number;
  readOnly: true;
}>;

export type IntentDependencyResult = Readonly<{
  resultId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  status: "ready" | "partial" | "unknown" | "independent";
  dependencies: readonly IntentDependency[];
  graph: IntentDependencyGraph;
  matrix: IntentDependencyMatrix;
  flags: IntentDependencyFlags;
  diagnostics: readonly IntentDependencyDiagnostic[];
  summary: IntentDependencySummary;
  metadata: IntentDependencyMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type IntentDependencyAnalysisInput = Readonly<{
  semanticModel: import("./executiveIntentSemanticTypes.ts").ExecutiveIntentSemanticModel;
  classification: import("./executiveIntentClassificationTypes.ts").IntentClassificationResult | null;
  conflictResult: import("./executiveIntentConflictTypes.ts").IntentConflictResult | null;
  state: import("./executiveIntentStateTypes.ts").IntentResolutionResult | null;
  readOnly: true;
}>;

export type IntentDependencyDetectionRequest = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId;
  intents: readonly IntentDependencyAnalysisInput[];
  batchConflictResult: import("./executiveIntentConflictTypes.ts").IntentConflictResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type IntentDependencyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:9 extension. */
export type IntentDependencyFutureExtension = Readonly<{
  resolutionBindings: null;
  schedulingBindings: null;
  recommendationBindings: null;
}>;

export const DEPENDENCY_FUTURE_EXTENSION: IntentDependencyFutureExtension = Object.freeze({
  resolutionBindings: null,
  schedulingBindings: null,
  recommendationBindings: null,
});

export function createIntentDependencyResult(
  input: Omit<IntentDependencyResult, "readOnly">
): IntentDependencyResult {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentDependencyAnalysisInput(
  input: Omit<IntentDependencyAnalysisInput, "readOnly">
): IntentDependencyAnalysisInput {
  return Object.freeze({ ...input, readOnly: true as const });
}
