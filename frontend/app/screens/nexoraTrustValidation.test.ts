/**
 * B.12 — trust / validation heuristics (deterministic).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildNexoraTrustValidationSignature, evaluateNexoraTrustValidation } from "./nexoraTrustValidation.ts";

test("two aligned sources + healthy merge → solid score, no partial failure", () => {
  const v = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "medium",
    mergedSignalCount: 8,
    sourceCount: 2,
    successfulSourceCount: 2,
    drivers: [
      { id: "a", label: "Latency", score: 0.7, severity: "high" },
      { id: "b", label: "Cost", score: 0.35, severity: "medium" },
    ],
    hasSummary: true,
    sourceWeights: { web_source: 0.92, csv_upload: 0.88 },
  });
  assert.ok(v.confidenceScore >= 0.55);
  assert.equal(v.hasPartialFailure, false);
  assert.ok(v.trustSummaryLine && v.trustSummaryLine.length > 8);
});

test("partial source failure → warning + partial flag", () => {
  const v = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "medium",
    mergedSignalCount: 5,
    sourceCount: 2,
    successfulSourceCount: 1,
    drivers: [{ id: "a", label: "X", score: 0.5, severity: "medium" }],
    hasSummary: true,
    sourceWeights: null,
  });
  assert.equal(v.hasPartialFailure, true);
  assert.ok(v.validationWarnings.some((w) => w.includes("Partial source")));
});

test("low evidence single source → low tier or low-evidence flags", () => {
  const v = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "low",
    mergedSignalCount: 1,
    sourceCount: 1,
    successfulSourceCount: 1,
    drivers: [{ id: "a", label: "Minor", score: 0.2, severity: "low" }],
    hasSummary: false,
    sourceWeights: { manual_text: 0.55 },
  });
  assert.equal(v.hasLowEvidence, true);
  assert.ok(v.confidenceTier === "low" || v.hasLowEvidence);
});

test("B.13 finance domain applies conservative trust bias on sparse signals", () => {
  const base = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "medium",
    mergedSignalCount: 2,
    sourceCount: 1,
    successfulSourceCount: 1,
    drivers: [{ id: "a", label: "Liquidity", score: 0.55, severity: "medium" }],
    hasSummary: true,
    sourceWeights: null,
  });
  const fin = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "medium",
    mergedSignalCount: 2,
    sourceCount: 1,
    successfulSourceCount: 1,
    drivers: [{ id: "a", label: "Liquidity", score: 0.55, severity: "medium" }],
    hasSummary: true,
    sourceWeights: null,
    domainId: "finance_workspace",
  });
  assert.ok(fin.confidenceScore <= base.confidenceScore);
});

test("buildNexoraTrustValidationSignature is stable for identical snapshots", () => {
  const a = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "high",
    mergedSignalCount: 3,
    sourceCount: 2,
    successfulSourceCount: 2,
    drivers: [],
    hasSummary: true,
    sourceWeights: null,
  });
  const b = evaluateNexoraTrustValidation({
    pipelineStatus: "ready",
    fragilityLevel: "high",
    mergedSignalCount: 3,
    sourceCount: 2,
    successfulSourceCount: 2,
    drivers: [],
    hasSummary: true,
    sourceWeights: null,
  });
  assert.equal(buildNexoraTrustValidationSignature(a), buildNexoraTrustValidationSignature(b));
});

test("B.20 execution outcome feedback nudges confidence score", () => {
  const baseInput = {
    pipelineStatus: "ready" as const,
    fragilityLevel: "medium" as const,
    mergedSignalCount: 8,
    sourceCount: 2,
    successfulSourceCount: 2,
    drivers: [
      { id: "a", label: "Latency", score: 0.5, severity: "medium" as const },
      { id: "b", label: "Cost", score: 0.35, severity: "medium" as const },
    ],
    hasSummary: true,
    sourceWeights: { web_source: 0.9, csv_upload: 0.88 } as Record<string, number>,
  };
  const base = evaluateNexoraTrustValidation(baseInput);
  const worse = evaluateNexoraTrustValidation({ ...baseInput, executionOutcomeFeedback: "worse" });
  const better = evaluateNexoraTrustValidation({ ...baseInput, executionOutcomeFeedback: "better" });
  assert.ok(worse.confidenceScore < base.confidenceScore);
  assert.ok(better.confidenceScore > base.confidenceScore);
});
