/**
 * DTH:2 — Canonical Iconic Object semantic registry.
 * Roles are presentation attributes, not Executive Object types.
 * Only roles that existing architecture or fixtures can honestly support.
 */

import type { NexoraDecisionTheatreCanonicalObjectType } from "./nexoraDecisionTheatreVisualFamily.ts";

export const nexoraDecisionTheatreIconicRegistryIdentity =
  "DTH:2/IconicObjectSemanticRegistry" as const;

export const NEXORA_DECISION_THEATRE_ICONIC_ROLES = Object.freeze([
  "cost",
  "time",
  "evidence",
  "confidence",
  "uncertainty",
  "reversibility",
  "capacity",
  "goal-impact",
] as const);

export type NexoraDecisionTheatreIconicRole =
  (typeof NEXORA_DECISION_THEATRE_ICONIC_ROLES)[number];

export type NexoraDecisionTheatreIconicValueKind =
  | "money"
  | "duration"
  | "deadline"
  | "delay"
  | "time-to-impact"
  | "observation-window"
  | "evidence-strength"
  | "confidence-level"
  | "uncertainty-state"
  | "reversibility-state"
  | "capacity-demand"
  | "expected-goal-impact"
  | "unknown"
  | "missing";

export type NexoraDecisionTheatreIconicProvenanceKind =
  | "manager-reported-observation"
  | "validated-business-observation"
  | "computed-metric"
  | "scenario-expectation"
  | "prediction"
  | "assumption"
  | "unknown"
  | "missing-data";

export type NexoraDecisionTheatreIconicEpistemicStatus =
  | "fact"
  | "expectation"
  | "prediction"
  | "unknown"
  | "missing";

export type NexoraDecisionTheatreIconicInteractionCapability =
  | "unsupported"
  | "reserved"
  | "identity-only";

export type NexoraDecisionTheatreIconicRoleDefinition = Readonly<{
  role: NexoraDecisionTheatreIconicRole;
  managerReadableName: string;
  managerialMeaning: string;
  permittedValueKinds: readonly NexoraDecisionTheatreIconicValueKind[];
  permittedUnits: readonly string[];
  allowedAuthoritativeSources: readonly string[];
  applicableExecutiveObjectTypes: readonly NexoraDecisionTheatreCanonicalObjectType[];
  unknownStateDisplayable: boolean;
  confidenceRequired: boolean;
  rendererIconToken: string;
  accessibilityLabelTemplate: string;
  interactionCapability: NexoraDecisionTheatreIconicInteractionCapability;
  prohibitedInterpretations: readonly string[];
}>;

const SCENARIO_AND_DECISION: readonly NexoraDecisionTheatreCanonicalObjectType[] =
  Object.freeze(["scenario", "decision", "execution", "problem"]);

export const NEXORA_DECISION_THEATRE_ICONIC_REGISTRY = Object.freeze({
  cost: Object.freeze({
    role: "cost",
    managerReadableName: "Cost",
    managerialMeaning:
      "Supported financial cost associated with an Executive Object or Scenario.",
    permittedValueKinds: Object.freeze(["money", "unknown", "missing"]),
    permittedUnits: Object.freeze(["USD", "currency", "none"]),
    allowedAuthoritativeSources: Object.freeze([
      "scenario-expectation",
      "manager-reported-observation",
      "computed-metric",
    ]),
    applicableExecutiveObjectTypes: SCENARIO_AND_DECISION,
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-cost",
    accessibilityLabelTemplate: "Cost indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "profit",
      "ROI",
      "financial benefit",
      "approved budget",
      "actual expenditure",
    ]),
  }),
  time: Object.freeze({
    role: "time",
    managerReadableName: "Time",
    managerialMeaning:
      "Supported duration, horizon, delay, deadline, or time-to-impact. Meanings stay distinct.",
    permittedValueKinds: Object.freeze([
      "duration",
      "deadline",
      "delay",
      "time-to-impact",
      "observation-window",
      "unknown",
      "missing",
    ]),
    permittedUnits: Object.freeze(["days", "weeks", "months", "iso-date", "none"]),
    allowedAuthoritativeSources: Object.freeze([
      "scenario-expectation",
      "manager-reported-observation",
      "prediction",
    ]),
    applicableExecutiveObjectTypes: SCENARIO_AND_DECISION,
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-time",
    accessibilityLabelTemplate: "Time indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "generic time value",
      "actual elapsed time unless sourced as fact",
    ]),
  }),
  evidence: Object.freeze({
    role: "evidence",
    managerReadableName: "Evidence",
    managerialMeaning: "Supported evidence exists and may summarize its strength. Does not create evidence.",
    permittedValueKinds: Object.freeze(["evidence-strength", "unknown", "missing"]),
    permittedUnits: Object.freeze(["none"]),
    allowedAuthoritativeSources: Object.freeze([
      "validated-business-observation",
      "manager-reported-observation",
      "assumption",
    ]),
    applicableExecutiveObjectTypes: Object.freeze([
      "scenario",
      "decision",
      "problem",
      "risk",
      "execution",
    ]),
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-evidence",
    accessibilityLabelTemplate: "Evidence indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "validated proof that does not exist",
      "a separate Evidence Executive Object",
      "low confidence inferred from missing evidence",
    ]),
  }),
  confidence: Object.freeze({
    role: "confidence",
    managerReadableName: "Confidence",
    managerialMeaning: "Authoritative confidence assessment. The presentation layer does not calculate it.",
    permittedValueKinds: Object.freeze(["confidence-level", "unknown", "missing"]),
    permittedUnits: Object.freeze(["none"]),
    allowedAuthoritativeSources: Object.freeze([
      "validated-business-observation",
      "manager-reported-observation",
    ]),
    applicableExecutiveObjectTypes: Object.freeze(["scenario", "decision", "execution", "problem"]),
    unknownStateDisplayable: true,
    confidenceRequired: true,
    rendererIconToken: "iconic-confidence",
    accessibilityLabelTemplate: "Confidence indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "probability of success unless explicitly defined",
      "presentation-calculated confidence",
    ]),
  }),
  uncertainty: Object.freeze({
    role: "uncertainty",
    managerReadableName: "Uncertainty",
    managerialMeaning:
      "A known unresolved condition, missing knowledge, or prediction uncertainty. Unknown is not zero. Missing is not false.",
    permittedValueKinds: Object.freeze(["uncertainty-state", "unknown", "missing"]),
    permittedUnits: Object.freeze(["none"]),
    allowedAuthoritativeSources: Object.freeze([
      "assumption",
      "prediction",
      "manager-reported-observation",
      "unknown",
      "missing-data",
    ]),
    applicableExecutiveObjectTypes: Object.freeze(["scenario", "decision", "problem", "risk"]),
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-uncertainty",
    accessibilityLabelTemplate: "Uncertainty indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "zero",
      "false",
      "resolved risk",
    ]),
  }),
  reversibility: Object.freeze({
    role: "reversibility",
    managerReadableName: "Reversibility",
    managerialMeaning:
      "Whether a Scenario or Decision can be reversed, partially reversed, or is difficult to reverse.",
    permittedValueKinds: Object.freeze(["reversibility-state", "unknown", "missing"]),
    permittedUnits: Object.freeze(["none"]),
    allowedAuthoritativeSources: Object.freeze([
      "scenario-expectation",
      "validated-business-observation",
      "assumption",
    ]),
    applicableExecutiveObjectTypes: Object.freeze(["scenario", "decision"]),
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-reversibility",
    accessibilityLabelTemplate: "Reversibility indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "inferred from Object type alone",
      "approved Decision",
    ]),
  }),
  capacity: Object.freeze({
    role: "capacity",
    managerReadableName: "Capacity",
    managerialMeaning:
      "Supported resource demand, availability, or capacity pressure attached to an owner. Does not replace a Capacity KPI or Problem.",
    permittedValueKinds: Object.freeze(["capacity-demand", "unknown", "missing"]),
    permittedUnits: Object.freeze(["percent", "units", "none"]),
    allowedAuthoritativeSources: Object.freeze([
      "computed-metric",
      "scenario-expectation",
      "manager-reported-observation",
    ]),
    applicableExecutiveObjectTypes: Object.freeze(["scenario", "decision", "problem", "execution"]),
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-capacity",
    accessibilityLabelTemplate: "Capacity indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "replacement for a canonical Capacity KPI",
      "replacement for a Resource or Problem Object",
    ]),
  }),
  "goal-impact": Object.freeze({
    role: "goal-impact",
    managerReadableName: "Goal impact",
    managerialMeaning:
      "Supported expected or observed relationship to an active Goal. Expected impact is not an actual Outcome.",
    permittedValueKinds: Object.freeze(["expected-goal-impact", "unknown", "missing"]),
    permittedUnits: Object.freeze(["none"]),
    allowedAuthoritativeSources: Object.freeze([
      "scenario-expectation",
      "validated-business-observation",
      "prediction",
    ]),
    applicableExecutiveObjectTypes: Object.freeze(["scenario", "decision", "execution", "problem"]),
    unknownStateDisplayable: true,
    confidenceRequired: false,
    rendererIconToken: "iconic-goal-impact",
    accessibilityLabelTemplate: "Goal impact indicator for {owner}: {status}",
    interactionCapability: "reserved",
    prohibitedInterpretations: Object.freeze([
      "actual Outcome",
      "Goal achievement",
    ]),
  }),
}) as Readonly<Record<NexoraDecisionTheatreIconicRole, NexoraDecisionTheatreIconicRoleDefinition>>;

export function getNexoraDecisionTheatreIconicRoleDefinition(
  role: string,
): NexoraDecisionTheatreIconicRoleDefinition | null {
  if (!NEXORA_DECISION_THEATRE_ICONIC_ROLES.includes(role as NexoraDecisionTheatreIconicRole)) {
    return null;
  }
  return NEXORA_DECISION_THEATRE_ICONIC_REGISTRY[role as NexoraDecisionTheatreIconicRole];
}

export function formatNexoraDecisionTheatreIconicAccessibilityLabel(input: {
  readonly role: NexoraDecisionTheatreIconicRole;
  readonly ownerLabel: string;
  readonly status: string;
}): string {
  const definition = NEXORA_DECISION_THEATRE_ICONIC_REGISTRY[input.role];
  return definition.accessibilityLabelTemplate
    .replace("{owner}", input.ownerLabel)
    .replace("{status}", input.status);
}
