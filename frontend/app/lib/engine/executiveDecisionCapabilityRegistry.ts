import type { ExecutiveDecisionCapability } from "./executiveDecisionFoundationTypes.ts";

const capability = (
  key: string,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-7-capability-${key}`,
  name,
  description,
  status: "Defined",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionCapability);

/**
 * Canonical capability registry for ENG-7:1.
 * Descriptive architecture only — no decision behavior.
 */
export const ExecutiveDecisionCapabilityRegistry = Object.freeze([
  capability(
    "final-decision-selection",
    "Final Decision Selection",
    "Architectural capability describing selection of a final executive decision from validated reasoning outcomes without performing selection algorithms.",
  ),
  capability(
    "alternative-ranking",
    "Alternative Ranking",
    "Architectural capability describing ranking of decision alternatives as metadata without scoring or ordering at runtime.",
  ),
  capability(
    "confidence-publication",
    "Confidence Publication",
    "Architectural capability describing publication of decision confidence metadata without calculating confidence.",
  ),
  capability(
    "risk-publication",
    "Risk Publication",
    "Architectural capability describing publication of decision risk metadata without risk assessment execution.",
  ),
  capability(
    "tradeoff-publication",
    "Tradeoff Publication",
    "Architectural capability describing publication of decision tradeoff metadata without tradeoff analysis execution.",
  ),
  capability(
    "decision-trace-publication",
    "Decision Trace Publication",
    "Architectural capability describing publication of decision-trace metadata without generating runtime traces.",
  ),
  capability(
    "recommendation-packaging",
    "Recommendation Packaging",
    "Architectural capability describing packaging of executive recommendations as metadata without recommendation engines.",
  ),
  capability(
    "decision-metadata-publication",
    "Decision Metadata Publication",
    "Architectural capability describing publication of decision metadata envelopes without runtime state mutation.",
  ),
] as const);
