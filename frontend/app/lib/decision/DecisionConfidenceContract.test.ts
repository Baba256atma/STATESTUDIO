import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionConfidenceExplanation,
  buildDecisionConfidenceProfile,
  buildDecisionEvidenceItem,
  buildDecisionEvidenceProfile,
  buildDecisionUncertaintyFactor,
  buildDecisionUncertaintyProfile,
  D2_CONTRACT_COMPLETE_TAG,
  DECISION_CONFIDENCE_CONTRACT,
  DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC,
  DECISION_CONFIDENCE_LEVEL_LABELS,
  DECISION_CONFIDENCE_READY_DIAGNOSTIC,
  EMPTY_DECISION_CONFIDENCE_PROFILE,
  resolveDecisionConfidenceLabel,
  resolveDecisionConfidenceLevel,
} from "./DecisionConfidenceContract.ts";

test("exports D2 decision confidence contract tag and diagnostics", () => {
  assert.equal(D2_CONTRACT_COMPLETE_TAG, "[D2_CONTRACT_COMPLETE]");
  assert.equal(DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC, "[DECISION_CONFIDENCE_CONTRACT]");
  assert.equal(DECISION_CONFIDENCE_READY_DIAGNOSTIC, "[DECISION_CONFIDENCE_READY]");
  assert.equal(DECISION_CONFIDENCE_CONTRACT.supportsHighConfidence, true);
  assert.equal(DECISION_CONFIDENCE_CONTRACT.supportsMediumConfidence, true);
  assert.equal(DECISION_CONFIDENCE_CONTRACT.supportsLowConfidence, true);
  assert.equal(DECISION_CONFIDENCE_CONTRACT.supportsInsufficientEvidence, true);
  assert.equal(DECISION_CONFIDENCE_CONTRACT.readOnly, true);
  assert.equal(DECISION_CONFIDENCE_CONTRACT.mutation, false);
});

test("resolves confidence level labels for all supported bands", () => {
  assert.equal(DECISION_CONFIDENCE_LEVEL_LABELS.high, "High Confidence");
  assert.equal(DECISION_CONFIDENCE_LEVEL_LABELS.medium, "Medium Confidence");
  assert.equal(DECISION_CONFIDENCE_LEVEL_LABELS.low, "Low Confidence");
  assert.equal(
    DECISION_CONFIDENCE_LEVEL_LABELS.insufficient_evidence,
    "Insufficient Evidence"
  );
  assert.equal(resolveDecisionConfidenceLabel("high"), "High Confidence");
  assert.equal(resolveDecisionConfidenceLabel("insufficient_evidence"), "Insufficient Evidence");
});

test("resolves confidence levels from score and evidence sufficiency", () => {
  assert.equal(
    resolveDecisionConfidenceLevel({
      confidenceScore: 88,
      evidenceCount: 3,
      sufficientEvidence: true,
    }),
    "high"
  );
  assert.equal(
    resolveDecisionConfidenceLevel({
      confidenceScore: 58,
      evidenceCount: 2,
      sufficientEvidence: true,
    }),
    "medium"
  );
  assert.equal(
    resolveDecisionConfidenceLevel({
      confidenceScore: 30,
      evidenceCount: 2,
      sufficientEvidence: true,
    }),
    "low"
  );
  assert.equal(
    resolveDecisionConfidenceLevel({
      confidenceScore: 90,
      evidenceCount: 0,
      sufficientEvidence: false,
    }),
    "insufficient_evidence"
  );
  assert.equal(
    resolveDecisionConfidenceLevel({
      confidenceScore: 90,
      evidenceCount: 1,
      sufficientEvidence: false,
    }),
    "insufficient_evidence"
  );
});

test("builds immutable evidence uncertainty explanation and profile contracts", () => {
  const evidenceItem = buildDecisionEvidenceItem({
    evidenceId: "evidence-1",
    label: "Scenario simulation alignment",
    sourceId: "simulation-summary",
    strength: 120,
  });
  const evidence = buildDecisionEvidenceProfile({
    profileId: "evidence-profile-1",
    evidenceItems: [evidenceItem],
    sufficientEvidence: true,
  });
  const uncertaintyFactor = buildDecisionUncertaintyFactor({
    factorId: "uncertainty-1",
    label: "Limited compare coverage",
    severity: 150,
    category: "compare",
  });
  const uncertainty = buildDecisionUncertaintyProfile({
    profileId: "uncertainty-profile-1",
    factors: [uncertaintyFactor],
    evidenceGapCount: 1,
  });
  const explanation = buildDecisionConfidenceExplanation({
    explanationId: "explanation-1",
    confidenceLevel: "medium",
    summary: "Moderate confidence with partial evidence coverage.",
    evidenceSummary: "One strong simulation signal available.",
    uncertaintySummary: "Compare coverage remains incomplete.",
    evidenceIds: [evidenceItem.evidenceId],
    uncertaintyFactorIds: [uncertaintyFactor.factorId],
  });
  const profile = buildDecisionConfidenceProfile({
    profileId: "confidence-profile-1",
    generatedAt: "2026-06-18T00:00:00.000Z",
    confidenceScore: 58,
    evidence,
    uncertainty,
    explanation: {
      explanationId: explanation.explanationId,
      summary: explanation.summary,
      evidenceSummary: explanation.evidenceSummary,
      uncertaintySummary: explanation.uncertaintySummary,
      evidenceIds: [...explanation.evidenceIds],
      uncertaintyFactorIds: [...explanation.uncertaintyFactorIds],
    },
  });

  assert.equal(evidenceItem.strength, 100);
  assert.equal(uncertaintyFactor.severity, 100);
  assert.equal(profile.confidenceLevel, "medium");
  assert.equal(profile.confidenceLabel, "Medium Confidence");
  assert.equal(profile.confidenceScore, 58);
  assert.equal(profile.evidence.evidenceCount, 1);
  assert.equal(profile.uncertainty.factorCount, 1);
  assert.equal(profile.explanation.confidenceLevel, "medium");
  assert.equal(Object.isFrozen(evidenceItem), true);
  assert.equal(Object.isFrozen(evidence), true);
  assert.equal(Object.isFrozen(evidence.evidenceItems), true);
  assert.equal(Object.isFrozen(uncertainty), true);
  assert.equal(Object.isFrozen(uncertainty.factors), true);
  assert.equal(Object.isFrozen(explanation), true);
  assert.equal(Object.isFrozen(explanation.evidenceIds), true);
  assert.equal(Object.isFrozen(profile), true);
  assert.throws(() => {
    (explanation.evidenceIds as unknown as string[]).push("mutated");
  }, TypeError);
});

test("empty decision confidence profile resolves insufficient evidence", () => {
  assert.equal(EMPTY_DECISION_CONFIDENCE_PROFILE.confidenceLevel, "insufficient_evidence");
  assert.equal(
    EMPTY_DECISION_CONFIDENCE_PROFILE.confidenceLabel,
    "Insufficient Evidence"
  );
  assert.equal(EMPTY_DECISION_CONFIDENCE_PROFILE.confidenceScore, 0);
  assert.equal(EMPTY_DECISION_CONFIDENCE_PROFILE.mutation, false);
  assert.equal(EMPTY_DECISION_CONFIDENCE_PROFILE.dsMutation, false);
  assert.equal(Object.isFrozen(EMPTY_DECISION_CONFIDENCE_PROFILE), true);
});
