/**
 * APP-3:9 — Executive Intent evolution canonical examples.
 * Explicit lineage scenarios for certification — deterministic only.
 */

export type IntentEvolutionCanonicalExample = Readonly<{
  exampleId: string;
  label: string;
  focusIntentId: string;
  expectedRootIntentId: string | null;
  expectedActiveIntentId: string | null;
  expectedHasHistory: boolean;
  expectedMerged: boolean;
  expectedSplit: boolean;
  expectedBroken: boolean;
  readOnly: true;
}>;

export const INTENT_EVOLUTION_CANONICAL_EXAMPLES: readonly IntentEvolutionCanonicalExample[] =
  Object.freeze([
    Object.freeze({
      exampleId: "simple-revision",
      label: "Simple revision",
      focusIntentId: "intent-v2",
      expectedRootIntentId: "intent-v1",
      expectedActiveIntentId: "intent-v2",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "version-chain",
      label: "Version chain",
      focusIntentId: "intent-v3",
      expectedRootIntentId: "intent-v1",
      expectedActiveIntentId: "intent-v3",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "split-strategy",
      label: "Split strategy",
      focusIntentId: "intent-split-a",
      expectedRootIntentId: "intent-parent",
      expectedActiveIntentId: "intent-split-a",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: true,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "merge-strategy",
      label: "Merge strategy",
      focusIntentId: "intent-merged",
      expectedRootIntentId: null,
      expectedActiveIntentId: "intent-merged",
      expectedHasHistory: true,
      expectedMerged: true,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "replacement",
      label: "Replacement",
      focusIntentId: "intent-replacement",
      expectedRootIntentId: "intent-original",
      expectedActiveIntentId: "intent-replacement",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "archived-branch",
      label: "Archived branch",
      focusIntentId: "intent-archived",
      expectedRootIntentId: "intent-root",
      expectedActiveIntentId: "intent-active-branch",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "parallel-branches",
      label: "Parallel branches",
      focusIntentId: "intent-branch-a",
      expectedRootIntentId: "intent-root",
      expectedActiveIntentId: "intent-branch-a",
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "root-intent",
      label: "Root intent",
      focusIntentId: "intent-root-only",
      expectedRootIntentId: "intent-root-only",
      expectedActiveIntentId: "intent-root-only",
      expectedHasHistory: false,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "broken-lineage",
      label: "Broken lineage",
      focusIntentId: "intent-broken-child",
      expectedRootIntentId: null,
      expectedActiveIntentId: null,
      expectedHasHistory: true,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: true,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "unknown-history",
      label: "Unknown history",
      focusIntentId: "intent-unknown",
      expectedRootIntentId: "intent-unknown",
      expectedActiveIntentId: "intent-unknown",
      expectedHasHistory: false,
      expectedMerged: false,
      expectedSplit: false,
      expectedBroken: false,
      readOnly: true as const,
    }),
  ]);

export function getIntentEvolutionCanonicalExample(
  exampleId: string
): IntentEvolutionCanonicalExample | null {
  return INTENT_EVOLUTION_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ?? null;
}

export const ExecutiveIntentEvolutionExamples = Object.freeze({
  canonical: INTENT_EVOLUTION_CANONICAL_EXAMPLES,
  getIntentEvolutionCanonicalExample,
});
