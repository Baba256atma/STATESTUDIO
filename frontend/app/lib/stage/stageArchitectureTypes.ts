/**
 * PHASE-1 / STAGE-ARCH-2 — Stage architecture types.
 * Reusable lifecycle, manifest, scoring, and certification shapes for Nexora stages.
 */

/** Nexora stage workflow: Understand → Build → Analyze → Certified. */
export type StageLifecyclePhase = "understand" | "build" | "analyze" | "certified";

export type StageDependencyClass = "internal" | "external" | "future";

export type StageRuntimePathKind =
  | "library-only"
  | "consumer-adapter"
  | "ui-readonly"
  | "certification-only";

/** Declarative description of a Nexora development stage. */
export type StageManifest = Readonly<{
  stageId: string;
  title: string;
  goal: string;
  lifecycle: StageLifecyclePhase;
  allowedFiles: readonly string[];
  forbiddenPatterns: readonly string[];
  prerequisites: readonly string[];
  runtimePath: StageRuntimePathKind | string;
  tags: readonly string[];
}>;

export type StageDependencyBoundary = Readonly<{
  name: string;
  dependencyClass: StageDependencyClass;
  description: string;
}>;

export type StageScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type StageScoreReport = Readonly<{
  contractVersion: string;
  dimensions: StageScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type StageCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type StageArchitectureCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly StageCertificationCheck[];
  scoreReport: StageScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type StageManifestValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type StageManifestValidationResult = Readonly<{
  valid: boolean;
  issues: readonly StageManifestValidationIssue[];
}>;

export type StageBoundaryDecision = Readonly<{
  allowed: boolean;
  reason: "allowed" | "forbidden_pattern" | "not_in_allowlist" | "empty_path";
  message: string;
}>;

export type StageArchitectureEventType =
  | "StageUnderstandingStarted"
  | "StageBuildStarted"
  | "StageBuildCompleted"
  | "StageAnalysisStarted"
  | "StageAnalysisCompleted"
  | "StageCertificationStarted"
  | "StageCertificationCompleted"
  | "StageCertificationFailed"
  | "StageBoundaryRejected";

export type StageArchitectureEvent = Readonly<{
  type: StageArchitectureEventType;
  stageId: string | null;
  lifecycle: StageLifecyclePhase | null;
  timestamp: string;
}>;

export type StageArchitectureDiagnosticEntry = Readonly<{
  stageId: string | null;
  event: StageArchitectureEventType;
  message: string;
  generatedAt: string;
}>;
