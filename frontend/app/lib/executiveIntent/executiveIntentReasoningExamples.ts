/**
 * APP-3:11 — Executive Intent reasoning canonical examples.
 */

export type ExecutiveIntentReasoningCanonicalExample = Readonly<{
  exampleId: string;
  label: string;
  text: string;
  conflictExampleId: string | null;
  dependencyExampleId: string | null;
  evolutionExampleId: string | null;
  expectedReadiness: string;
  readOnly: true;
}>;

export const EXECUTIVE_INTENT_REASONING_CANONICAL_EXAMPLES: readonly ExecutiveIntentReasoningCanonicalExample[] =
  Object.freeze([
    Object.freeze({
      exampleId: "simple-executive-objective",
      label: "Simple executive objective",
      text: "Increase company profit by 20% next year.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "financial-growth-initiative",
      label: "Financial growth initiative",
      text: "Increase company profit by 20% next year.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "operational-optimization",
      label: "Operational optimization",
      text: "Improve operational efficiency across the organization.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "needs_clarification",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "technology-modernization",
      label: "Technology modernization",
      text: "Modernize cloud platform technology across the enterprise.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "high-confidence-objective",
      label: "High-confidence objective",
      text: "Reduce operating cost by 8% next year.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "conflict-heavy-objective",
      label: "Conflict-heavy objective",
      text: "Increase company profit by 20% next year.",
      conflictExampleId: "increase-vs-decrease-metric",
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "needs_clarification",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "dependency-heavy-objective",
      label: "Dependency-heavy objective",
      text: "Launch the new product in Q3.",
      conflictExampleId: null,
      dependencyExampleId: "launch-depends-prototype",
      evolutionExampleId: null,
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "rapidly-evolving-objective",
      label: "Rapidly evolving objective",
      text: "Increase company profit by 20% next year.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: "parallel-branches",
      expectedReadiness: "ready",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "low-confidence-objective",
      label: "Low-confidence objective",
      text: "Do better soon.",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "incomplete",
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "multiple-unknowns",
      label: "Multiple unknowns",
      text: "Increase by 20%",
      conflictExampleId: null,
      dependencyExampleId: null,
      evolutionExampleId: null,
      expectedReadiness: "incomplete",
      readOnly: true as const,
    }),
  ]);

export function getExecutiveIntentReasoningCanonicalExample(
  exampleId: string
): ExecutiveIntentReasoningCanonicalExample | null {
  return (
    EXECUTIVE_INTENT_REASONING_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ??
    null
  );
}
