import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import type { WorkspaceReadinessStatus } from "../workspacePolishRuntime";
import type { ExecutiveOrientationExperience } from "../orientation/executiveOrientationTypes";

export type E2AuditCheckResult = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type E2WorkspaceAuditReport = {
  auditedAt: string;
  domains: string[];
  passedChecks: E2AuditCheckResult[];
  warnings: E2AuditCheckResult[];
  recommendations: E2AuditCheckResult[];
  criticalIssues: E2AuditCheckResult[];
  score: number;
};

export type E2WorkspaceReadinessContext = {
  themeMode: "day" | "night";
  objectCount: number;
  relationshipCount: number;
  sceneJsonPresent: boolean;
  commandBarVisible: boolean;
  statusHudVisible: boolean;
  sceneInfoVisible: boolean;
  objectInfoVisible: boolean;
  timelineVisible: boolean;
  assistantVisible: boolean;
  quickActionsVisible: boolean;
  navigationToolbarVisible: boolean;
  orientationEnabled: boolean;
  orientationExperience: ExecutiveOrientationExperience | null;
  harmonizationScore: number;
  usesLegacyShellWithoutSurface: SceneHudThemeSurfaceId[];
  layoutPreset?: string | null;
  viewportWidth?: number;
  viewportHeight?: number;
  selectedObjectId?: string | null;
  hasScenarioWorkspace: boolean;
  hasAnalysis: boolean;
  workspaceReadiness: WorkspaceReadinessStatus;
  selectionStable?: boolean;
  cameraStable?: boolean;
  panelJumpDetected?: boolean;
  layoutShiftDetected?: boolean;
  anchorFailureDetected?: boolean;
  unexpectedRerenderCount?: number;
};

export type ExecutiveFirst30SecondsReport = {
  orientationQuality: number;
  discoverability: number;
  clarity: number;
  guidanceQuality: number;
  passed: boolean;
  findings: string[];
};

export type WorkspaceConsistencyLevel = "consistent" | "partiallyConsistent" | "inconsistent";

export type WorkspaceConsistencyReport = {
  level: WorkspaceConsistencyLevel;
  terminology: boolean;
  visualHierarchy: boolean;
  interactionPatterns: boolean;
  iconLanguage: boolean;
  panelBehavior: boolean;
  findings: string[];
  score: number;
};

export type HudQualityReviewReport = {
  passed: boolean;
  surfaces: Record<
    "sceneInfo" | "objectInfo" | "timeline" | "navigation",
    { passed: boolean; deviations: string[] }
  >;
  findings: string[];
};

export type ExecutiveWorkflowValidationReport = {
  passed: boolean;
  steps: Array<{ id: string; label: string; passed: boolean; friction?: string }>;
  frictionPoints: string[];
};

export type WorkspaceScalabilityReport = {
  passed: boolean;
  tiers: Array<{
    objectCount: 10 | 25 | 50 | 100;
    usable: boolean;
    densityScore: number;
    labelReadable: boolean;
    selectionClear: boolean;
    cameraStable: boolean;
  }>;
  findings: string[];
};

export type DayNightReadinessReport = {
  passed: boolean;
  dayUsable: boolean;
  nightUsable: boolean;
  hierarchyParity: boolean;
  spacingParity: boolean;
  inconsistencies: string[];
};

export type WorkspaceStabilityGateReport = {
  passed: boolean;
  renderStable: boolean;
  panelStable: boolean;
  layoutStable: boolean;
  selectionStable: boolean;
  cameraStable: boolean;
  issues: string[];
};

export type TypeCReferenceAuditReport = {
  alignmentScore: number;
  sceneNativeFeel: number;
  executiveAppearance: number;
  panelIntegration: number;
  workspaceBalance: number;
  decisionFocus: number;
  recommendations: string[];
};

export type E3ReadinessStatus = "READY" | "READY_WITH_NOTES" | "NOT_READY";

export type E3ReadinessGateReport = {
  status: E3ReadinessStatus;
  uxReadiness: number;
  technicalReadiness: number;
  executiveReadiness: number;
  visualReadiness: number;
  architecturalReadiness: number;
  blockers: string[];
  notes: string[];
};

export type E2WorkspaceReadinessAssessment = {
  assessedAt: string;
  workspaceAudit: E2WorkspaceAuditReport;
  first30Seconds: ExecutiveFirst30SecondsReport;
  consistency: WorkspaceConsistencyReport;
  hudQuality: HudQualityReviewReport;
  workflow: ExecutiveWorkflowValidationReport;
  scalability: WorkspaceScalabilityReport;
  dayNight: DayNightReadinessReport;
  stability: WorkspaceStabilityGateReport;
  referenceAudit: TypeCReferenceAuditReport;
  e3Gate: E3ReadinessGateReport;
  executiveUsableToday: boolean;
  summary: string;
};
