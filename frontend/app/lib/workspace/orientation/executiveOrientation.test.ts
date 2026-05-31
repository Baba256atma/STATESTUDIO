import { describe, expect, it, beforeEach } from "vitest";

import {
  accumulateExecutiveOrientationSession,
  deriveElevatedRiskCount,
  dismissExecutiveWelcome,
  isProgressiveLayerVisible,
  recordExecutiveOrientationVisit,
  resetExecutiveOrientationForTests,
  resetExecutiveOrientationInstrumentationForTests,
  resolveExecutiveFirstImpression,
  resolveExecutiveOrientationExperience,
  resolveExecutiveOrientationSnapshot,
  resolveExecutiveQuickStartRecommendations,
  resolveExecutiveWelcomeSurface,
  resolveProgressiveWorkspaceDisclosure,
  resolveSituationalAwarenessSurface,
  resolveWorkspaceConfidence,
  resolveWorkspaceMeaning,
  EXECUTIVE_WORKSPACE_LEARNING_CONTRACT,
} from "./index";

const BASE_CONTEXT = {
  objectCount: 12,
  relationshipCount: 8,
  elevatedRiskCount: 3,
  activeScenarioCount: 1,
  activeScenarioTitle: "Baseline Resilience",
  operationalHealth: "Stable",
  fragilityLevel: "medium" as const,
  pipelineStatus: "ready" as const,
  insightLine: "Supplier delays are elevating downstream risk.",
  decisionNextMove: "Review supplier contingency options.",
  selectedObjectLabel: "Supply Chain Network",
  recommendedFocusLabel: "Supply Chain Network",
  domainLabel: "Supply Chain",
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
  elapsedSeconds: 0,
  themeMode: "night" as const,
};

describe("executive orientation runtimes", () => {
  beforeEach(() => {
    resetExecutiveOrientationForTests();
    resetExecutiveOrientationInstrumentationForTests();
  });

  it("classifies first visit, returning, and experienced users", () => {
    expect(resolveExecutiveOrientationSnapshot().tier).toBe("firstVisit");
    recordExecutiveOrientationVisit();
    expect(resolveExecutiveOrientationSnapshot().tier).toBe("firstVisit");
    dismissExecutiveWelcome();
    recordExecutiveOrientationVisit();
    recordExecutiveOrientationVisit();
    recordExecutiveOrientationVisit();
    recordExecutiveOrientationVisit();
    recordExecutiveOrientationVisit();
    recordExecutiveOrientationVisit();
    accumulateExecutiveOrientationSession(900);
    expect(resolveExecutiveOrientationSnapshot().tier).toBe("experiencedUser");
  });

  it("builds a concise first impression summary", () => {
    const snapshot = resolveExecutiveFirstImpression({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(snapshot.summaryLines[0]).toContain("Operational Health");
    expect(snapshot.activeObjectCount).toBe(12);
    expect(snapshot.recommendedFocus).toBe("Supply Chain Network");
  });

  it("replaces generic initialization with situational awareness copy", () => {
    const snapshot = resolveSituationalAwarenessSurface({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(snapshot.systemOverview).toContain("Supply Chain");
    expect(snapshot.entryHeadline).not.toMatch(/loading|initializing|unknown/i);
    expect(snapshot.recommendedNextStep).toContain("Review supplier");
  });

  it("ranks contextual quick-start recommendations", () => {
    const recommendations = resolveExecutiveQuickStartRecommendations({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]?.id).toBe("analyze_risks");
  });

  it("exposes one-sentence workspace meaning", () => {
    const scene = resolveWorkspaceMeaning("scene");
    expect(scene.split(".").length).toBeLessThanOrEqual(2);
    expect(scene.length).toBeGreaterThan(20);
  });

  it("progressively discloses layers during the first 30 seconds", () => {
    const early = resolveProgressiveWorkspaceDisclosure({
      tier: "firstVisit",
      elapsedSeconds: 2,
    });
    const late = resolveProgressiveWorkspaceDisclosure({
      tier: "firstVisit",
      elapsedSeconds: 30,
    });
    expect(early.visibleLayers).toEqual(["situation"]);
    expect(late.visibleLayers).toContain("advanced");
    expect(isProgressiveLayerVisible("risk", early)).toBe(false);
    expect(isProgressiveLayerVisible("action", late)).toBe(true);
  });

  it("builds a minimal welcome surface for first visits", () => {
    const welcome = resolveExecutiveWelcomeSurface({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(welcome.showWelcome).toBe(true);
    expect(welcome.mostImportantInsight).toContain("Supplier delays");
    expect(welcome.suggestedFirstAction).toBeTruthy();
  });

  it("reports workspace confidence signals", () => {
    const confidence = resolveWorkspaceConfidence({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(confidence.signals.some((signal) => signal.id === "monitoring" && signal.ready)).toBe(true);
    expect(confidence.summaryLine.length).toBeGreaterThan(0);
  });

  it("orchestrates the full orientation experience", () => {
    const experience = resolveExecutiveOrientationExperience({
      ...BASE_CONTEXT,
      orientation: resolveExecutiveOrientationSnapshot(),
    });
    expect(experience.firstImpression.activeObjectCount).toBe(12);
    expect(experience.quickStart.length).toBeGreaterThan(0);
    expect(experience.workspaceMeaning.aiAssistant).toContain("Strategic copilot");
  });

  it("derives elevated risk counts from fragility and signals", () => {
    expect(deriveElevatedRiskCount({ fragilityLevel: "critical", signalsCount: 0 })).toBe(3);
    expect(deriveElevatedRiskCount({ fragilityLevel: null, signalsCount: 5 })).toBe(5);
  });

  it("exposes a future learning contract without runtime side effects", () => {
    const plan = EXECUTIVE_WORKSPACE_LEARNING_CONTRACT.planAdaptation({
      profile: EXECUTIVE_WORKSPACE_LEARNING_CONTRACT.readProfile(),
      visitCount: 10,
      sessionSeconds: 2000,
    });
    expect(plan.disclosureAcceleration).toBe("accelerated");
    expect(plan.suppressWelcome).toBe(true);
  });
});
