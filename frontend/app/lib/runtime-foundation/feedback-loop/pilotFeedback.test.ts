import { describe, expect, it, beforeEach } from "vitest";

import { resetRuntimeFoundationTestStacks } from "../enterpriseRuntimeFoundation.test";
import { resetDemoModeStores } from "../demo-mode/demoModeStore";
import { resetDemoModeGuards } from "../demo-mode/demoModeGuards";
import { resetProductionReadinessGateStores } from "../launch-gate/productionReadinessGateStore";
import { resetProductionReadinessGateGuards } from "../launch-gate/productionReadinessGateGuards";
import {
  sanitizePilotFeedbackCapture,
  resetPilotFeedbackGuards,
} from "./pilotFeedbackGuards";
import { getPilotFeedbackStore, resetPilotFeedbackStores } from "./pilotFeedbackStore";
import {
  evaluatePilotFeedbackLearningLoop,
  submitMVPPilotFeedback,
} from "./pilotFeedbackEngine";
import { selectLatestPilotLearningSnapshot } from "./pilotFeedbackSelectors";

function resetFeedbackTestStacks(): void {
  resetRuntimeFoundationTestStacks();
  resetProductionReadinessGateStores();
  resetProductionReadinessGateGuards();
  resetDemoModeStores();
  resetDemoModeGuards();
  resetPilotFeedbackStores();
  resetPilotFeedbackGuards();
}

describe("mvp pilot feedback learning loop D9:10:8", () => {
  beforeEach(() => {
    resetFeedbackTestStacks();
  });

  it("stores sanitized feedback safely", () => {
    const org = "feedback-store-org";
    const result = submitMVPPilotFeedback({
      organizationId: org,
      capture: {
        whatConfusedYou: "Panel labels were unclear",
        whatFeltValuable: "Risk explanation helped",
        whatShouldImprove: "Simpler input steps",
      },
      now: 500_000,
    });

    expect(result.submitted).toBe(true);
    expect(result.feedback?.whatConfusedYou).toContain("Panel labels");
    expect(getPilotFeedbackStore(org).getState().feedbackEntries).toHaveLength(1);
  });

  it("dedupes duplicate feedback signatures", () => {
    const org = "feedback-dedupe-org";
    const capture = {
      whatConfusedYou: "Same confusion note",
      whatShouldImprove: "Same improvement",
    };
    const first = submitMVPPilotFeedback({ organizationId: org, capture, now: 501_000 });
    const second = submitMVPPilotFeedback({ organizationId: org, capture, now: 501_100 });

    expect(first.submitted).toBe(true);
    expect(second.duplicate).toBe(true);
    expect(getPilotFeedbackStore(org).getState().feedbackEntries).toHaveLength(1);
  });

  it("redacts sensitive patterns without requiring PII", () => {
    const sanitized = sanitizePilotFeedbackCapture({
      pilotNotes: "Contact me at user@example.com for follow-up",
    });
    expect(sanitized.containsSensitivePattern).toBe(true);
    expect(sanitized.pilotNotes).toContain("[redacted]");
    expect(sanitized.pilotNotes).not.toContain("user@example.com");
  });

  it("rejects empty feedback submission", () => {
    const result = submitMVPPilotFeedback({
      organizationId: "feedback-empty-org",
      capture: {},
    });
    expect(result.submitted).toBe(false);
    expect(result.reason).toBe("empty_feedback");
  });

  it("falls back safely when feedback is missing", () => {
    const org = "feedback-fallback-org";
    const result = evaluatePilotFeedbackLearningLoop({ organizationId: org, now: 502_000 });
    expect(result.evaluated).toBe(true);
    expect(result.snapshot?.summary).toMatch(/Awaiting pilot feedback/i);
    expect(result.snapshot?.feedbackEntryCount).toBe(0);
  });

  it("summarizes learning signals from pilot feedback", () => {
    const org = "feedback-learn-org";
    submitMVPPilotFeedback({
      organizationId: org,
      capture: {
        whatConfusedYou: "I did not understand the input flow for data entry",
        whatFeltValuable: "Executive risk explanation was valuable",
        whatShouldImprove: "Panel language is too technical",
      },
      now: 503_000,
    });

    const result = evaluatePilotFeedbackLearningLoop({ organizationId: org, now: 503_100 });
    expect(result.snapshot?.topSignals.length).toBeGreaterThan(0);
    expect(result.snapshot?.recommendations.length).toBeGreaterThan(0);
    expect(result.snapshot?.summary).toMatch(/pilot feedback|input|panel/i);
  });

  it("dedupes repeated learning loop evaluations", () => {
    const org = "feedback-loop-dedupe-org";
    submitMVPPilotFeedback({
      organizationId: org,
      capture: { whatShouldImprove: "Clearer demo" },
      now: 504_000,
    });
    const first = evaluatePilotFeedbackLearningLoop({ organizationId: org, now: 504_100 });
    const second = evaluatePilotFeedbackLearningLoop({ organizationId: org, now: 504_150 });
    expect(first.evaluated).toBe(true);
    expect(second.skipped).toBe(true);
    expect(getPilotFeedbackStore(org).getState().learningSnapshots).toHaveLength(1);
  });

  it("does not require sensitive data fields", () => {
    const result = submitMVPPilotFeedback({
      organizationId: "feedback-no-pii-org",
      capture: { whatFeltValuable: "Clear focus recommendation" },
    });
    expect(result.submitted).toBe(true);
    expect(result.feedback?.containsSensitivePattern).toBe(false);
  });

  it("persists learning snapshot in bounded store only", () => {
    const org = "feedback-bounded-org";
    for (let i = 0; i < 25; i += 1) {
      submitMVPPilotFeedback({
        organizationId: org,
        capture: { pilotNotes: `note-${i}` },
        now: 505_000 + i,
      });
    }
    expect(getPilotFeedbackStore(org).getState().feedbackEntries.length).toBeLessThanOrEqual(20);
    evaluatePilotFeedbackLearningLoop({ organizationId: org, now: 506_000 });
    expect(selectLatestPilotLearningSnapshot(org)).not.toBeNull();
  });
});
