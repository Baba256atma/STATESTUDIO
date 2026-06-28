/**
 * PHASE-1 / STAGE-ARCH-2 — Stage architecture contract.
 * Lifecycle rules, global forbidden boundaries, and scoring thresholds.
 */

import type {
  StageDependencyBoundary,
  StageLifecyclePhase,
  StageScoreDimensions,
} from "./stageArchitectureTypes.ts";

export const STAGE_ARCHITECTURE_VERSION = "PHASE-1/STAGE-ARCH-2" as const;

export type StageArchitectureVersion = typeof STAGE_ARCHITECTURE_VERSION;

export const STAGE_ARCHITECTURE_SOURCE = "phase-1-stage-architecture" as const;

export const NEXORA_STAGE_ARCHITECTURE_LOG_PREFIX = "[NexoraStageArchitecture]" as const;

export const STAGE_ARCHITECTURE_TAGS = Object.freeze([
  "[STAGE_ARCH_FOUNDATION]",
  "[STAGE_LIFECYCLE_DEFINED]",
  "[STAGE_GUARDS_ACTIVE]",
  "[STAGE_CERT_READY]",
  "[STAGE_ARCH_COMPLETE]",
] as const);

export const STAGE_ARCHITECTURE_FREEZE_TAGS = Object.freeze([
  "[STAGE_ARCHITECTURE_CERTIFIED]",
  "[STAGE_ARCHITECTURE_FROZEN]",
  "[PHASE_1_COMPLETE]",
] as const);

export const STAGE_LIFECYCLE_PHASES = Object.freeze([
  "understand",
  "build",
  "analyze",
  "certified",
] as const satisfies readonly StageLifecyclePhase[]);

/** Paths and modules stage work must never modify without an explicit architecture phase. */
export const STAGE_GLOBAL_FORBIDDEN_PATTERNS = Object.freeze([
  "dashboardIntelligenceRuntime",
  "singleIntelligenceSourceGateway",
  "intelligenceContextGateway",
  "assistantRuntimeAdapter",
  "executiveSummaryRuntimeAdapter",
  "objectPanelRuntimeAdapter",
  "workspaceKpiCalculationEngine",
  "workspaceRiskDetectionEngine",
  "workspaceScenarioSimulationEngine",
  "workspaceRelationshipSceneSyncContract",
  "RelationshipRenderer",
  "RelationshipLine",
  "topology",
  "RightPanelHost",
  "HomeScreen",
] as const);

export const STAGE_MINIMUM_OVERALL_SCORE = 95 as const;

export const STAGE_MAX_RECOMMENDED_FILE_LINES = 150 as const;

export const STAGE_SCORE_WEIGHTS = Object.freeze({
  architecture: 0.25,
  maintainability: 0.2,
  regressionSafety: 0.25,
  scalability: 0.1,
  certificationReadiness: 0.2,
} as const satisfies Readonly<Record<keyof StageScoreDimensions, number>>);

export const STAGE_ARCHITECTURE_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-1/STAGE-ARCH-2",
  title: "Stage Architecture Build Layer",
  goal: "Build reusable stage contracts, guards, diagnostics, and certification structure.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/stage/stageArchitectureContract.ts",
    "frontend/app/lib/stage/stageArchitectureTypes.ts",
    "frontend/app/lib/stage/stageArchitectureGuards.ts",
    "frontend/app/lib/stage/stageArchitectureDiagnostics.ts",
    "frontend/app/lib/stage/stageArchitectureCertification.ts",
    "frontend/app/lib/stage/stageArchitectureCertification.test.ts",
    "docs/stage-architecture-build-report.md",
  ]),
  forbiddenPatterns: STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["INT-5", "STAGE-ARCH-1"]),
  runtimePath: "library-only" as const,
  tags: STAGE_ARCHITECTURE_TAGS,
});

export const STAGE_DEPENDENCY_BOUNDARIES: readonly StageDependencyBoundary[] = Object.freeze([
  Object.freeze({
    name: "stage-types",
    dependencyClass: "internal",
    description: "Shared lifecycle and manifest types.",
  }),
  Object.freeze({
    name: "stage-contract",
    dependencyClass: "internal",
    description: "Version, tags, forbidden patterns, scoring weights.",
  }),
  Object.freeze({
    name: "stage-diagnostics",
    dependencyClass: "internal",
    description: "Lifecycle and boundary diagnostic events.",
  }),
  Object.freeze({
    name: "stage-guards",
    dependencyClass: "internal",
    description: "Manifest and path boundary validation.",
  }),
  Object.freeze({
    name: "frozen-int-platform",
    dependencyClass: "external",
    description: "Referenced by rules only — never imported or mutated by stage layer.",
  }),
  Object.freeze({
    name: "certified-ds-engines",
    dependencyClass: "external",
    description: "Referenced by forbidden patterns — never imported or mutated.",
  }),
  Object.freeze({
    name: "phase-manifest-registry",
    dependencyClass: "future",
    description: "Future DS/INT/UI/MRP stages register manifests with stage certification.",
  }),
]);

export function computeStageOverallScore(dimensions: StageScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsStageMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export const STAGE_MODULE_FILE_PATHS = Object.freeze([
  "frontend/app/lib/stage/stageArchitectureContract.ts",
  "frontend/app/lib/stage/stageArchitectureTypes.ts",
  "frontend/app/lib/stage/stageArchitectureGuards.ts",
  "frontend/app/lib/stage/stageArchitectureDiagnostics.ts",
  "frontend/app/lib/stage/stageArchitectureCertification.ts",
  "frontend/app/lib/stage/stageArchitectureCertification.test.ts",
] as const);
