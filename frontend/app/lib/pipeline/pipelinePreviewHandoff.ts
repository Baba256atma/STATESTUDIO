/**
 * UI-PIPE-1:2 — Pipeline Understanding Handoff.
 *
 * Builds an immutable, metadata-only handoff for a future DKL-3 connection.
 * Deterministic id from session/dataset identity. No clock. No randomness.
 * Not persistence. Not sent to DKL-3 yet.
 *
 * Ownership: owned exclusively by UI-PIPE-1:2.
 */

import type { CanonicalParsedDataset } from "../integrations/csvParserTypes.ts";
import type { PipelineDiagnosticCounts, PipelineIdentity } from "./pipelinePageTypes.ts";
import type { PipelineUnderstandingHandoff } from "./pipelinePreviewTypes.ts";

export interface HandoffBuildInput {
  readonly identity: PipelineIdentity;
  readonly dataset: CanonicalParsedDataset;
  readonly selectedColumnKeys: readonly string[];
  readonly diagnosticCounts: PipelineDiagnosticCounts;
  readonly formulaRiskCount: number;
}

/**
 * Build an immutable understanding handoff from a confirmed preview.
 * Returns null when readiness rules are not satisfied.
 */
export function buildPipelineUnderstandingHandoff(
  input: HandoffBuildInput,
): PipelineUnderstandingHandoff | null {
  const { identity, dataset, selectedColumnKeys, diagnosticCounts, formulaRiskCount } = input;

  if (diagnosticCounts.blocking > 0) {
    return null;
  }
  if (selectedColumnKeys.length === 0) {
    return null;
  }

  const orderedKeys = dataset.columns
    .map((c) => c.key)
    .filter((key) => selectedColumnKeys.includes(key));

  const handoffId = `handoff:${identity.sessionId}:${dataset.datasetId}`;

  return Object.freeze({
    handoffId,
    tenantId: identity.tenantId,
    workspaceId: identity.workspaceId,
    sessionId: identity.sessionId,
    datasetId: dataset.datasetId,
    datasetName: dataset.datasetName,
    sourceMode: dataset.sourceMode,
    sourceRegistryId: dataset.sourceRegistryId,
    selectedColumnKeys: Object.freeze([...orderedKeys]),
    columnCount: dataset.columnCount,
    selectedColumnCount: orderedKeys.length,
    rowCountObserved: dataset.rowCountObserved,
    rowCountPreviewed: dataset.rowCountPreviewed,
    parseStatus: dataset.parseStatus,
    diagnosticCounts: Object.freeze({ ...diagnosticCounts }),
    blockingIssueCount: diagnosticCounts.blocking,
    warningCount: diagnosticCounts.warning,
    formulaRiskCount,
    reviewStatus: "ReadyForUnderstanding",
    readyForUnderstanding: true,
    nextPlatform: "DKL-3",
  });
}
