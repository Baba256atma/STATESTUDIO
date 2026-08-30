/**
 * DTH:2 — Deterministic Iconic Object proof fixtures.
 * Synthetic Theatre input only. Not live runtime values and not a second object registry.
 */

import type { NexoraDecisionTheatreIconicAuthoritativeSource } from "./nexoraDecisionTheatreIconicProjection.ts";

export const NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER = "ctx-scenario-capacity" as const;

function source(
  partial: NexoraDecisionTheatreIconicAuthoritativeSource,
): NexoraDecisionTheatreIconicAuthoritativeSource {
  return Object.freeze(partial);
}

export const NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES: readonly NexoraDecisionTheatreIconicAuthoritativeSource[] =
  Object.freeze([
    source({
      ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
      role: "cost",
      sourceAuthority: "scenario-expectation",
      sourceRef: "fixture-capacity-cost-expectation",
      provenance: "scenario-expectation",
      value: "1.2M",
      valueKind: "money",
      unit: "USD",
      epistemicStatus: "expectation",
      confidenceRef: null,
      unknown: false,
      missing: false,
      managerReadableLabel: "Expected cost",
      explanation: "Expected cost for Capacity Expansion Plan. This is a scenario expectation, not actual spend.",
      whyVisible: "The focused Scenario has a supported expected-cost source.",
      mustNotInterpretAs: Object.freeze(["profit", "approved budget", "actual expenditure"]),
      derivationVersion: "dth2-1.0.0",
    }),
    source({
      ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
      role: "time",
      sourceAuthority: "scenario-expectation",
      sourceRef: "fixture-capacity-time-to-impact",
      provenance: "scenario-expectation",
      value: "90",
      valueKind: "time-to-impact",
      unit: "days",
      epistemicStatus: "expectation",
      confidenceRef: null,
      unknown: false,
      missing: false,
      managerReadableLabel: "Time to impact",
      explanation: "Expected time-to-impact for Capacity Expansion Plan, not elapsed duration.",
      whyVisible: "The focused Scenario has a supported time-to-impact source.",
      mustNotInterpretAs: Object.freeze(["actual elapsed time", "deadline"]),
      derivationVersion: "dth2-1.0.0",
    }),
    source({
      ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
      role: "evidence",
      sourceAuthority: "validated-business-observation",
      sourceRef: "fixture-capacity-evidence-moderate",
      provenance: "validated-business-observation",
      value: "MODERATE",
      valueKind: "evidence-strength",
      unit: "none",
      epistemicStatus: "fact",
      confidenceRef: null,
      unknown: false,
      missing: false,
      managerReadableLabel: "Evidence strength",
      explanation: "Supported evidence for this Scenario is moderate. This indicator does not create evidence.",
      whyVisible: "An evidence-strength source is attached to the focused Scenario.",
      mustNotInterpretAs: Object.freeze(["a separate Evidence object", "validated proof beyond the source"]),
      derivationVersion: "dth2-1.0.0",
    }),
    source({
      ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
      role: "uncertainty",
      sourceAuthority: "unknown",
      sourceRef: "fixture-capacity-uncertainty-unknown",
      provenance: "unknown",
      value: null,
      valueKind: "unknown",
      unit: null,
      epistemicStatus: "unknown",
      confidenceRef: null,
      unknown: true,
      missing: false,
      managerReadableLabel: "Uncertainty",
      explanation: "Demand response after expansion is unknown. Unknown is not zero.",
      whyVisible: "The focused Scenario has a supported unknown-state source.",
      mustNotInterpretAs: Object.freeze(["zero", "false", "low confidence"]),
      derivationVersion: "dth2-1.0.0",
    }),
    source({
      ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
      role: "reversibility",
      sourceAuthority: "scenario-expectation",
      sourceRef: "fixture-capacity-reversibility-partial",
      provenance: "scenario-expectation",
      value: "PARTIAL",
      valueKind: "reversibility-state",
      unit: "none",
      epistemicStatus: "expectation",
      confidenceRef: null,
      unknown: false,
      missing: false,
      managerReadableLabel: "Reversibility",
      explanation: "Capacity Expansion Plan is recorded as partially reversible by its source.",
      whyVisible: "The focused Scenario has a reversibility source.",
      mustNotInterpretAs: Object.freeze(["inferred from Scenario type", "approved Decision"]),
      derivationVersion: "dth2-1.0.0",
    }),
  ]);

export const NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST: NexoraDecisionTheatreIconicAuthoritativeSource =
  source({
    ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
    role: "cost",
    sourceAuthority: "manager-reported-observation",
    sourceRef: "fixture-capacity-cost-manager-reported",
    provenance: "manager-reported-observation",
    value: "800k",
    valueKind: "money",
    unit: "USD",
    epistemicStatus: "expectation",
    confidenceRef: null,
    unknown: false,
    missing: false,
    managerReadableLabel: "Reported cost",
    explanation: "Manager-reported cost estimate. It remains manager-reported, not validated spend.",
    whyVisible: "A manager-reported cost source is attached to the focused Scenario.",
    mustNotInterpretAs: Object.freeze(["validated expenditure", "approved budget"]),
    derivationVersion: "dth2-1.0.0",
  });

export const NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST: NexoraDecisionTheatreIconicAuthoritativeSource =
  source({
    ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
    role: "cost",
    sourceAuthority: "scenario-expectation",
    sourceRef: "fixture-capacity-cost-missing-as-zero",
    provenance: "missing-data",
    value: 0,
    valueKind: "money",
    unit: "USD",
    epistemicStatus: "missing",
    confidenceRef: null,
    unknown: false,
    missing: true,
    managerReadableLabel: "Cost",
    explanation: "Missing cost must not appear as zero.",
    whyVisible: "Invalid missing-as-zero source.",
    mustNotInterpretAs: Object.freeze(["zero cost"]),
    derivationVersion: "dth2-1.0.0",
  });

export const NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_TIME: NexoraDecisionTheatreIconicAuthoritativeSource =
  source({
    ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
    role: "time",
    sourceAuthority: "scenario-expectation",
    sourceRef: "fixture-capacity-time-missing-as-zero",
    provenance: "missing-data",
    value: "0 days",
    valueKind: "duration",
    unit: "days",
    epistemicStatus: "missing",
    confidenceRef: null,
    unknown: false,
    missing: true,
    managerReadableLabel: "Time",
    explanation: "Missing duration must not appear as zero days.",
    whyVisible: "Invalid missing-as-zero source.",
    mustNotInterpretAs: Object.freeze(["zero days"]),
    derivationVersion: "dth2-1.0.0",
  });

export const NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE: NexoraDecisionTheatreIconicAuthoritativeSource =
  source({
    ownerExecutiveObjectId: NEXORA_DECISION_THEATRE_DTH2_PROOF_OWNER,
    role: "evidence",
    sourceAuthority: "missing-data",
    sourceRef: "fixture-capacity-evidence-missing",
    provenance: "missing-data",
    value: null,
    valueKind: "missing",
    unit: null,
    epistemicStatus: "missing",
    confidenceRef: null,
    unknown: false,
    missing: true,
    managerReadableLabel: "Evidence",
    explanation: "Evidence is missing. Missing evidence is not low confidence.",
    whyVisible: "A missing-evidence source is attached without inventing confidence.",
    mustNotInterpretAs: Object.freeze(["low confidence", "zero evidence"]),
    derivationVersion: "dth2-1.0.0",
  });

export const NEXORA_DECISION_THEATRE_DTH2_GOAL_OBJECT_FIXTURE = Object.freeze({
  id: "obj-goal",
  label: "Margin Recovery Goal",
  kind: "object" as const,
  position: [2.8, 0.2, -0.4] as const,
  status: "stable" as const,
  attention: "important" as const,
});
