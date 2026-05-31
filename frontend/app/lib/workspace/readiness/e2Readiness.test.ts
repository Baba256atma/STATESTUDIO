import { describe, expect, it, beforeEach } from "vitest";

import {
  buildWorkspaceConsistencyReport,
  buildWorkspaceScalabilityReport,
  isExecutiveWorkspaceUsableToday,
  resetE2ReadinessInstrumentationForTests,
  runE2CompletionAudit,
  runE2WorkspaceAudit,
  runE3ReadinessGate,
  validateExecutiveFirst30Seconds,
  validateExecutiveWorkflow,
} from "./index";

const BASE_CONTEXT = {
  themeMode: "night" as const,
  objectCount: 12,
  relationshipCount: 8,
  sceneJsonPresent: true,
  commandBarVisible: true,
  statusHudVisible: true,
  sceneInfoVisible: true,
  objectInfoVisible: true,
  timelineVisible: true,
  assistantVisible: true,
  quickActionsVisible: true,
  navigationToolbarVisible: true,
  orientationEnabled: true,
  orientationExperience: {
    orientation: { tier: "returningUser" as const, visitCount: 2, welcomeDismissed: true, isFirstVisit: false },
    firstImpression: {
      operationalHealth: "Stable",
      activeObjectCount: 12,
      elevatedRiskCount: 1,
      activeScenarioCount: 1,
      recommendedFocus: "Supply Chain",
      summaryLines: ["Operational Health: Stable"],
    },
    situationalAwareness: {
      systemOverview: "Supply Chain executive workspace",
      operationalStatus: "Workspace operational",
      riskStatus: "1 elevated risk signal",
      recommendedNextStep: "Analyze current risks",
      entryHeadline: "12 system nodes under active monitoring",
    },
    quickStart: [{ id: "analyze_risks", label: "Analyze Current Risks", rationale: "Review elevated signals." }],
    workspaceMeaning: {} as Record<string, string>,
    progressiveDisclosure: { visibleLayers: ["situation", "risk"], phaseLabel: "Situation" },
    welcome: {
      showWelcome: false,
      currentSystemState: "Stable",
      mostImportantInsight: "Supplier delays elevating risk",
      suggestedFirstAction: "Analyze Current Risks",
    },
    confidence: { signals: [{ id: "monitoring", label: "Monitoring Online", ready: true }], summaryLine: "Ready" },
  },
  harmonizationScore: 88,
  usesLegacyShellWithoutSurface: [],
  layoutPreset: "executive",
  viewportWidth: 1440,
  viewportHeight: 900,
  selectedObjectId: "supplier-1",
  hasScenarioWorkspace: true,
  hasAnalysis: false,
  workspaceReadiness: {
    sceneReady: true,
    hudReady: true,
    assistantReady: true,
    scenarioReady: true,
    persistenceReady: true,
    themeReady: true,
    ready: true,
    score: 100,
    checkedAt: new Date(0).toISOString(),
  },
  selectionStable: true,
  cameraStable: true,
  panelJumpDetected: false,
  layoutShiftDetected: false,
  anchorFailureDetected: false,
  unexpectedRerenderCount: 2,
};

describe("E2 workspace readiness gate", () => {
  beforeEach(() => {
    resetE2ReadinessInstrumentationForTests();
  });

  it("runs workspace audit with passed checks and grouped findings", () => {
    const report = runE2WorkspaceAudit(BASE_CONTEXT);
    expect(report.passedChecks.length).toBeGreaterThan(0);
    expect(report.domains).toContain("scene");
    expect(report.score).toBeGreaterThan(70);
  });

  it("validates executive first 30 seconds experience", () => {
    const report = validateExecutiveFirst30Seconds(BASE_CONTEXT);
    expect(report.discoverability).toBeGreaterThan(70);
    expect(report.passed).toBe(true);
  });

  it("builds consistency report levels", () => {
    const report = buildWorkspaceConsistencyReport(BASE_CONTEXT);
    expect(["consistent", "partiallyConsistent", "inconsistent"]).toContain(report.level);
    expect(report.score).toBeGreaterThan(50);
  });

  it("validates executive workflow steps", () => {
    const report = validateExecutiveWorkflow(BASE_CONTEXT);
    expect(report.steps.length).toBe(8);
    expect(report.passed).toBe(true);
  });

  it("audits scalability tiers at 10/25/50/100 objects", () => {
    const report = buildWorkspaceScalabilityReport(BASE_CONTEXT);
    expect(report.tiers.map((t) => t.objectCount)).toEqual([10, 25, 50, 100]);
  });

  it("runs E3 readiness gate statuses", () => {
    const gate = runE3ReadinessGate({
      workspaceAuditScore: 92,
      first30SecondsPassed: true,
      consistencyScore: 90,
      consistencyLevel: "consistent",
      hudQualityPassed: true,
      workflowPassed: true,
      scalabilityPassed: true,
      dayNightPassed: true,
      stabilityPassed: true,
      referenceAlignmentScore: 82,
      criticalIssueCount: 0,
    });
    expect(["READY", "READY_WITH_NOTES", "NOT_READY"]).toContain(gate.status);
  });

  it("orchestrates full E2 completion audit", () => {
    const assessment = runE2CompletionAudit(BASE_CONTEXT);
    expect(assessment.e3Gate.status).toBeTruthy();
    expect(assessment.summary).toContain("E2 completion audit");
    expect(isExecutiveWorkspaceUsableToday(assessment)).toBe(true);
  });

  it("marks workspace not usable when critical issues exist", () => {
    const assessment = runE2CompletionAudit({
      ...BASE_CONTEXT,
      commandBarVisible: false,
      assistantVisible: false,
      sceneJsonPresent: false,
    });
    expect(assessment.workspaceAudit.criticalIssues.length).toBeGreaterThan(0);
    expect(isExecutiveWorkspaceUsableToday(assessment)).toBe(false);
  });
});
