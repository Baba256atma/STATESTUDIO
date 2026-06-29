/**
 * APP-3:13 — Executive Intent dashboard canonical examples.
 * Each example references an APP-3:11 reasoning example or scenario.
 */

export type ExecutiveIntentDashboardCanonicalExample = Readonly<{
  exampleId: string;
  label: string;
  reasoningExampleId: string | null;
  syntheticStatus: string | null;
  expectedStatus: string;
  readOnly: true;
}>;

export const EXECUTIVE_INTENT_DASHBOARD_CANONICAL_EXAMPLES: readonly ExecutiveIntentDashboardCanonicalExample[] =
  Object.freeze([
    Object.freeze({
      exampleId: "ready-objective",
      label: "Ready objective",
      reasoningExampleId: "high-confidence-objective",
      syntheticStatus: "ready",
      expectedStatus: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "blocked-objective",
      label: "Blocked objective",
      reasoningExampleId: "conflict-heavy-objective",
      syntheticStatus: "blocked",
      expectedStatus: "blocked",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "conflict-heavy-objective",
      label: "Conflict-heavy objective",
      reasoningExampleId: "conflict-heavy-objective",
      syntheticStatus: null,
      expectedStatus: "needs_clarification",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "dependency-heavy-objective",
      label: "Dependency-heavy objective",
      reasoningExampleId: "dependency-heavy-objective",
      syntheticStatus: null,
      expectedStatus: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "evolution-history",
      label: "Evolution history",
      reasoningExampleId: "rapidly-evolving-objective",
      syntheticStatus: null,
      expectedStatus: "needs_clarification",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "low-confidence",
      label: "Low confidence",
      reasoningExampleId: "low-confidence-objective",
      syntheticStatus: null,
      expectedStatus: "incomplete",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "archived-objective",
      label: "Archived objective",
      reasoningExampleId: "simple-executive-objective",
      syntheticStatus: "archived",
      expectedStatus: "archived",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "multiple-unknowns",
      label: "Multiple unknowns",
      reasoningExampleId: "multiple-unknowns",
      syntheticStatus: null,
      expectedStatus: "incomplete",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "incomplete-objective",
      label: "Incomplete objective",
      reasoningExampleId: "low-confidence-objective",
      syntheticStatus: null,
      expectedStatus: "incomplete",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "executive-overview",
      label: "Executive overview",
      reasoningExampleId: "simple-executive-objective",
      syntheticStatus: null,
      expectedStatus: "needs_clarification",
      readOnly: true as const,
    }),
  ]);

export function getExecutiveIntentDashboardCanonicalExample(
  exampleId: string
): ExecutiveIntentDashboardCanonicalExample | null {
  return (
    EXECUTIVE_INTENT_DASHBOARD_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ??
    null
  );
}
