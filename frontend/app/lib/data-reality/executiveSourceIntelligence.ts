/**
 * RDI:3 — deterministic executive intelligence for committed real-data sources.
 *
 * This module projects existing RDI:1/RDI:2 + Data Reality truth. It never
 * reads raw CSV text, recomputes KPI meaning, mutates Runtime, or calls an LLM.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type { NexoraExecutiveState } from "./dataRealityContracts.ts";
import { NEXORA_EXECUTIVE_STATE_SEVERITY } from "./executiveStateResolution.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";
import type { CsvCommittedImport } from "./csvRealDataImportStore.ts";
import type { NexoraDataRealityHandoff, NexoraDataSourceSnapshot } from "./realDataIntegrationFoundation.ts";
import type { NexoraDatasetExecutiveRealityResult } from "./dataRealityFoundation.ts";

export const executiveSourceIntelligenceIdentity =
  "RDI:3/NexoraExecutiveSourceIntelligence" as const;
export const executiveSourceIntelligenceVersion = "1.0.0" as const;
export const executiveSourceIntelligenceNamespace =
  "nexora.real-data-integration.executive-source-intelligence" as const;

export const EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY = Object.freeze({
  derivesFromCanonicalSnapshot: true as const,
  derivesFromDataReality: true as const,
  ownsExecutiveTruth: false as const,
  ownsRuntime: false as const,
  ownsAdvisor: false as const,
  readsRawCsv: false as const,
  currentFactsOverrideHistory: true as const,
});

export type ExecutiveSourceOverallState = NexoraExecutiveState;
export type ExecutiveSourceChangeDirection =
  | "improved"
  | "deteriorated"
  | "unchanged";
export type ExecutiveSourceComparisonReadiness =
  | "compatible"
  | "partial"
  | "incompatible";

export type ExecutiveSourceProvenance = Readonly<{
  sourceId: string;
  snapshotId: string;
  datasetId: string;
  mappingId: string;
  importedAt: string;
  transformationRefs: readonly string[];
}>;

export type ExecutiveSourceAffectedObject = Readonly<{
  objectKey: string;
  objectLabel: string;
  nexoraObjectId: string;
  stageObjectId: string | null;
  state: NexoraExecutiveState;
  signals: readonly Readonly<{
    kpiId: string;
    label: string;
    value: number;
    unit: string;
    sourceField: string | null;
  }>[];
}>;

export type ExecutiveSourceIntelligence = Readonly<{
  identity: typeof executiveSourceIntelligenceIdentity;
  sourceId: string;
  workspaceId: WorkspaceId;
  sourceLabel: string;
  importedAt: string;
  recordCount: number;
  mappedObjectCount: number;
  overallState: ExecutiveSourceOverallState;
  attentionCount: number;
  criticalCount: number;
  affectedObjects: readonly ExecutiveSourceAffectedObject[];
  executiveChanges: readonly string[];
  topSignals: readonly string[];
  interpretation: string;
  provenance: ExecutiveSourceProvenance;
}>;

export type ExecutiveSourceStateTransition = Readonly<{
  objectKey: string;
  objectLabel: string;
  stageObjectId: string | null;
  from: NexoraExecutiveState;
  to: NexoraExecutiveState;
  direction: ExecutiveSourceChangeDirection;
}>;

export type ExecutiveSourceMetricDelta = Readonly<{
  kpiId: string;
  objectKey: string;
  objectLabel: string;
  label: string;
  baseValue: number;
  comparisonValue: number;
  delta: number;
  unit: string;
  direction: ExecutiveSourceChangeDirection;
  baseSourceId: string;
  comparisonSourceId: string;
  baseSourceField: string | null;
  comparisonSourceField: string | null;
}>;

export type ExecutiveSourceComparison = Readonly<{
  identity: typeof executiveSourceIntelligenceIdentity;
  baseSourceId: string;
  comparisonSourceId: string;
  workspaceId: WorkspaceId;
  readiness: ExecutiveSourceComparisonReadiness;
  readinessReason: string;
  changedObjects: readonly string[];
  improvedObjects: readonly string[];
  deterioratedObjects: readonly string[];
  unchangedObjects: readonly string[];
  metricDeltas: readonly ExecutiveSourceMetricDelta[];
  stateTransitions: readonly ExecutiveSourceStateTransition[];
  topChanges: readonly string[];
  summary: string;
  provenance: readonly ExecutiveSourceProvenance[];
}>;

export type ExecutiveSourceAdvisorContext = Readonly<{
  contextKind: "selected-source" | "source-comparison";
  workspaceId: WorkspaceId;
  title: string;
  summary: string;
  sourceIds: readonly string[];
  affectedStageObjectIds: readonly string[];
  stateTransitions: readonly ExecutiveSourceStateTransition[];
  metricDeltas: readonly ExecutiveSourceMetricDelta[];
  provenance: readonly ExecutiveSourceProvenance[];
  memoryPolicy: "current-facts-override-history";
}>;

/** Provider-neutral RDI:3 input. CSV and live observations adapt to this view. */
export type ExecutiveSourceProjectionInput = Readonly<{
  workspaceId: WorkspaceId;
  sourceContextId: string;
  sourceLabel: string;
  committedAt: string;
  recordCount: number;
  mappingId: string;
  snapshot: NexoraDataSourceSnapshot;
  handoff: NexoraDataRealityHandoff;
  dataReality: NexoraDatasetExecutiveRealityResult;
}>;

type ExecutiveSourceInput = CsvCommittedImport | ExecutiveSourceProjectionInput;

function normalizeSource(source: ExecutiveSourceInput): ExecutiveSourceProjectionInput {
  if ("prepared" in source) {
    const prepared = source.prepared;
    if (!prepared.snapshot || !prepared.handoff || !prepared.dataReality) throw new Error("RDI:3 requires a committed canonical RDI/Data Reality result.");
    return Object.freeze({ workspaceId: source.workspaceId, sourceContextId: source.sourceContextId, sourceLabel: prepared.fileName, committedAt: source.committedAt, recordCount: prepared.parse.records.length, mappingId: prepared.mapping.mappingId, snapshot: prepared.snapshot, handoff: prepared.handoff, dataReality: prepared.dataReality });
  }
  return source;
}

const OBJECT_PRESENTATION = Object.freeze({
  production: Object.freeze({ label: "Capacity", stageObjectId: "obj-capacity", order: 1 }),
  customer: Object.freeze({ label: "Customer", stageObjectId: "obj-customer", order: 2 }),
  shipping: Object.freeze({ label: "Delivery", stageObjectId: "obj-delivery", order: 3 }),
  warehouse: Object.freeze({ label: "Inventory", stageObjectId: "obj-inventory", order: 4 }),
  revenue: Object.freeze({ label: "Revenue", stageObjectId: "obj-revenue", order: 5 }),
} as const);

function presentationFor(objectKey: string): Readonly<{ label: string; stageObjectId: string | null; order: number }> {
  const known = OBJECT_PRESENTATION[objectKey as keyof typeof OBJECT_PRESENTATION];
  return known ?? Object.freeze({
    label: objectKey ? `${objectKey[0]!.toUpperCase()}${objectKey.slice(1)}` : "Unknown",
    stageObjectId: null,
    order: Number.MAX_SAFE_INTEGER,
  });
}

function sourceProvenance(source: ExecutiveSourceProjectionInput): ExecutiveSourceProvenance {
  const refs = source.handoff.factProvenance
    .map((entry) => entry.provenance.transformationRef)
    .filter((entry): entry is string => Boolean(entry)) ?? [];
  return Object.freeze({
    sourceId: source.sourceContextId,
    snapshotId: source.snapshot.snapshotId,
    datasetId: source.handoff.dataset.id,
    mappingId: source.mappingId,
    importedAt: source.committedAt,
    transformationRefs: Object.freeze([...new Set(refs)].sort()),
  });
}

function highestState(states: readonly NexoraExecutiveState[]): NexoraExecutiveState {
  return states.reduce<NexoraExecutiveState>(
    (current, candidate) =>
      NEXORA_EXECUTIVE_STATE_SEVERITY[candidate] >
      NEXORA_EXECUTIVE_STATE_SEVERITY[current]
        ? candidate
        : current,
    "normal",
  );
}

function sourceFieldForKpi(source: ExecutiveSourceProjectionInput, objectKey: string, kpiId: string): string | null {
  const requiredMetrics = getExecutiveOperationsExecutiveStateRules()
    .find((rule) => rule.kpiId === kpiId)?.objectKey === objectKey
    ? source.handoff.dataset.records
      .filter((record) => record.objectKey === objectKey)
      .map((record) => record.metricKey) ?? []
    : [];
  for (const metricKey of requiredMetrics) {
    const trace = source.handoff.factProvenance.find(
      (entry) => entry.objectKey === objectKey && entry.metricKey === metricKey,
    );
    if (trace?.provenance.sourceFieldKey) return trace.provenance.sourceFieldKey;
  }
  return null;
}

function interpretationFor(
  state: NexoraExecutiveState,
  affected: readonly ExecutiveSourceAffectedObject[],
): string {
  const critical = affected.filter((entry) => entry.state === "critical").map((entry) => entry.objectLabel);
  const attention = affected.filter((entry) => entry.state === "attention").map((entry) => entry.objectLabel);
  if (state === "critical") {
    return `Operational pressure is materially elevated. ${critical.join(", ")} require immediate attention${attention.length ? ` while ${attention.join(", ")} ${attention.length === 1 ? "remains" : "remain"} in watch` : ""}.`;
  }
  if (state === "attention") {
    return `${attention.join(", ")} ${attention.length === 1 ? "requires" : "require"} managerial attention; no affected object is currently critical.`;
  }
  return "The affected executive objects remain within acceptable operating conditions.";
}

export function projectExecutiveSourceIntelligence(
  sourceInput: ExecutiveSourceInput,
): ExecutiveSourceIntelligence {
  const source = normalizeSource(sourceInput);
  const reality = source.dataReality;
  const affected = Object.freeze(
    [...reality.objectStates]
      .sort((a, b) => presentationFor(a.objectKey).order - presentationFor(b.objectKey).order)
      .map((objectState): ExecutiveSourceAffectedObject => {
        const presentation = presentationFor(objectState.objectKey);
        return Object.freeze({
          objectKey: objectState.objectKey,
          objectLabel: presentation.label,
          nexoraObjectId: objectState.nexoraObjectId,
          stageObjectId: presentation.stageObjectId,
          state: objectState.state,
          signals: Object.freeze(objectState.reasons.map((reason) => Object.freeze({
            kpiId: reason.kpiId,
            label: reason.kpiName,
            value: reason.value,
            unit: reason.unit,
            sourceField: sourceFieldForKpi(source, objectState.objectKey, reason.kpiId),
          }))),
        });
      }),
  );
  const overallState = highestState(affected.map((entry) => entry.state));
  const topSignals = Object.freeze(
    affected
      .flatMap((entry) => entry.signals.map((signal) => `${entry.objectLabel}: ${signal.label} ${signal.value.toFixed(1)}${signal.unit}`))
      .slice(0, 5),
  );
  return Object.freeze({
    identity: executiveSourceIntelligenceIdentity,
    sourceId: source.sourceContextId,
    workspaceId: source.workspaceId,
    sourceLabel: source.sourceLabel,
    importedAt: source.committedAt,
    recordCount: source.recordCount,
    mappedObjectCount: affected.length,
    overallState,
    attentionCount: affected.filter((entry) => entry.state === "attention").length,
    criticalCount: affected.filter((entry) => entry.state === "critical").length,
    affectedObjects: affected,
    executiveChanges: Object.freeze(affected.map((entry) => `${entry.objectLabel} is ${entry.state}.`)),
    topSignals,
    interpretation: interpretationFor(overallState, affected),
    provenance: sourceProvenance(source),
  });
}

export function classifyExecutiveSourceComparison(
  baseInput: ExecutiveSourceInput,
  comparisonInput: ExecutiveSourceInput,
): Readonly<{ readiness: ExecutiveSourceComparisonReadiness; reason: string }> {
  const base = normalizeSource(baseInput); const comparison = normalizeSource(comparisonInput);
  if (base.workspaceId !== comparison.workspaceId) {
    return Object.freeze({ readiness: "incompatible", reason: "Sources belong to different workspaces." });
  }
  const baseDataset = base.handoff.dataset;
  const comparisonDataset = comparison.handoff.dataset;
  if (!baseDataset || !comparisonDataset || baseDataset.familyId !== comparisonDataset.familyId) {
    return Object.freeze({ readiness: "incompatible", reason: "Sources do not share a canonical dataset family." });
  }
  const baseMetrics = new Set(base.dataReality.kpis.map((entry) => entry.kpiId));
  const comparisonMetrics = new Set(comparison.dataReality.kpis.map((entry) => entry.kpiId));
  const overlap = [...baseMetrics].filter((entry) => comparisonMetrics.has(entry));
  if (overlap.length === 0) {
    return Object.freeze({ readiness: "incompatible", reason: "No canonical objects or metrics are comparable." });
  }
  if (overlap.length !== baseMetrics.size || overlap.length !== comparisonMetrics.size) {
    return Object.freeze({ readiness: "partial", reason: "Only a subset of canonical metrics is comparable." });
  }
  return Object.freeze({ readiness: "compatible", reason: "Workspace, source family, objects, and canonical metrics align." });
}

function changeDirection(from: NexoraExecutiveState, to: NexoraExecutiveState): ExecutiveSourceChangeDirection {
  const delta = NEXORA_EXECUTIVE_STATE_SEVERITY[to] - NEXORA_EXECUTIVE_STATE_SEVERITY[from];
  return delta > 0 ? "deteriorated" : delta < 0 ? "improved" : "unchanged";
}

function metricDirection(kpiId: string, baseValue: number, comparisonValue: number, stateDirection: ExecutiveSourceChangeDirection): ExecutiveSourceChangeDirection {
  if (stateDirection !== "unchanged") return stateDirection;
  const rule = getExecutiveOperationsExecutiveStateRules().find((entry) => entry.kpiId === kpiId);
  if (!rule || baseValue === comparisonValue) return "unchanged";
  const worsened = rule.worseWhen === "higher"
    ? comparisonValue > baseValue
    : comparisonValue < baseValue;
  return worsened ? "deteriorated" : "improved";
}

export function compareExecutiveSources(
  baseInput: ExecutiveSourceInput,
  comparisonInput: ExecutiveSourceInput,
): ExecutiveSourceComparison {
  const base = normalizeSource(baseInput); const comparison = normalizeSource(comparisonInput);
  const compatibility = classifyExecutiveSourceComparison(base, comparison);
  const baseIntelligence = projectExecutiveSourceIntelligence(base);
  const comparisonIntelligence = projectExecutiveSourceIntelligence(comparison);
  if (compatibility.readiness === "incompatible") {
    return Object.freeze({
      identity: executiveSourceIntelligenceIdentity,
      baseSourceId: base.sourceContextId,
      comparisonSourceId: comparison.sourceContextId,
      workspaceId: base.workspaceId,
      readiness: compatibility.readiness,
      readinessReason: compatibility.reason,
      changedObjects: Object.freeze([]), improvedObjects: Object.freeze([]),
      deterioratedObjects: Object.freeze([]), unchangedObjects: Object.freeze([]),
      metricDeltas: Object.freeze([]), stateTransitions: Object.freeze([]),
      topChanges: Object.freeze([]), summary: compatibility.reason,
      provenance: Object.freeze([baseIntelligence.provenance, comparisonIntelligence.provenance]),
    });
  }

  const comparisonByObject = new Map(comparisonIntelligence.affectedObjects.map((entry) => [entry.objectKey, entry]));
  const transitions = Object.freeze(baseIntelligence.affectedObjects.flatMap((baseObject) => {
    const next = comparisonByObject.get(baseObject.objectKey);
    if (!next) return [];
    return [Object.freeze({
      objectKey: baseObject.objectKey,
      objectLabel: baseObject.objectLabel,
      stageObjectId: baseObject.stageObjectId,
      from: baseObject.state,
      to: next.state,
      direction: changeDirection(baseObject.state, next.state),
    })];
  }));
  const transitionByObject = new Map(transitions.map((entry) => [entry.objectKey, entry]));
  const comparisonKpis = new Map(comparison.dataReality.kpis.map((entry) => [entry.kpiId, entry]));
  const metricDeltas = Object.freeze(base.dataReality.kpis.flatMap((baseKpi) => {
    const next = comparisonKpis.get(baseKpi.kpiId);
    if (!next || next.unit !== baseKpi.unit) return [];
    const presentation = presentationFor(baseKpi.objectKey);
    const transition = transitionByObject.get(baseKpi.objectKey);
    return [Object.freeze({
      kpiId: baseKpi.kpiId,
      objectKey: baseKpi.objectKey,
      objectLabel: presentation.label,
      label: base.dataReality.objectStates.find((entry) => entry.objectKey === baseKpi.objectKey)?.reasons.find((entry) => entry.kpiId === baseKpi.kpiId)?.kpiName ?? baseKpi.kpiId,
      baseValue: baseKpi.value,
      comparisonValue: next.value,
      delta: Number((next.value - baseKpi.value).toFixed(4)),
      unit: baseKpi.unit,
      direction: metricDirection(baseKpi.kpiId, baseKpi.value, next.value, transition?.direction ?? "unchanged"),
      baseSourceId: base.sourceContextId,
      comparisonSourceId: comparison.sourceContextId,
      baseSourceField: sourceFieldForKpi(base, baseKpi.objectKey, baseKpi.kpiId),
      comparisonSourceField: sourceFieldForKpi(comparison, next.objectKey, next.kpiId),
    })];
  }).sort((a, b) => a.objectKey.localeCompare(b.objectKey)));
  const changed = transitions.filter((entry) => entry.from !== entry.to);
  const deteriorated = transitions.filter((entry) => entry.direction === "deteriorated");
  const improved = transitions.filter((entry) => entry.direction === "improved");
  const unchanged = transitions.filter((entry) => entry.direction === "unchanged");
  const largest = [...metricDeltas].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  const summary = deteriorated.length > improved.length
    ? `Operational condition materially deteriorated: ${changed.length} objects changed and ${deteriorated.length} deteriorated.`
    : improved.length > deteriorated.length
      ? `Operational condition improved: ${changed.length} objects changed and ${improved.length} improved.`
      : `${changed.length} objects changed with a balanced executive impact.`;
  return Object.freeze({
    identity: executiveSourceIntelligenceIdentity,
    baseSourceId: base.sourceContextId,
    comparisonSourceId: comparison.sourceContextId,
    workspaceId: base.workspaceId,
    readiness: compatibility.readiness,
    readinessReason: compatibility.reason,
    changedObjects: Object.freeze(changed.map((entry) => entry.objectLabel)),
    improvedObjects: Object.freeze(improved.map((entry) => entry.objectLabel)),
    deterioratedObjects: Object.freeze(deteriorated.map((entry) => entry.objectLabel)),
    unchangedObjects: Object.freeze(unchanged.map((entry) => entry.objectLabel)),
    metricDeltas,
    stateTransitions: transitions,
    topChanges: Object.freeze([
      ...deteriorated.map((entry) => `${entry.objectLabel}: ${entry.from} → ${entry.to}`),
      ...(largest ? [`Largest metric movement: ${largest.label} ${largest.delta > 0 ? "+" : ""}${largest.delta.toFixed(1)}${largest.unit}`] : []),
    ].slice(0, 5)),
    summary,
    provenance: Object.freeze([baseIntelligence.provenance, comparisonIntelligence.provenance]),
  });
}

export function createExecutiveSourceAdvisorContext(
  value: ExecutiveSourceIntelligence | ExecutiveSourceComparison,
): ExecutiveSourceAdvisorContext {
  if ("sourceLabel" in value) {
    return Object.freeze({
      contextKind: "selected-source",
      workspaceId: value.workspaceId,
      title: value.sourceLabel,
      summary: value.interpretation,
      sourceIds: Object.freeze([value.sourceId]),
      affectedStageObjectIds: Object.freeze(value.affectedObjects.flatMap((entry) => entry.stageObjectId ? [entry.stageObjectId] : [])),
      stateTransitions: Object.freeze([]),
      metricDeltas: Object.freeze([]),
      provenance: Object.freeze([value.provenance]),
      memoryPolicy: "current-facts-override-history",
    });
  }
  return Object.freeze({
    contextKind: "source-comparison",
    workspaceId: value.workspaceId,
    title: "Source comparison",
    summary: value.summary,
    sourceIds: Object.freeze([value.baseSourceId, value.comparisonSourceId]),
    affectedStageObjectIds: Object.freeze(value.stateTransitions.flatMap((entry) => entry.stageObjectId ? [entry.stageObjectId] : [])),
    stateTransitions: value.stateTransitions,
    metricDeltas: value.metricDeltas,
    provenance: value.provenance,
    memoryPolicy: "current-facts-override-history",
  });
}

export type ExecutiveSourceIntelligenceCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
  | "I" | "J" | "K" | "L" | "M" | "N" | "O";

export function certifyExecutiveSourceIntelligence(
  evidence: Readonly<Record<ExecutiveSourceIntelligenceCertificationGate, boolean>>,
) {
  const gates = Object.freeze((Object.keys(evidence) as ExecutiveSourceIntelligenceCertificationGate[])
    .sort()
    .map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({
    certified: gates.length === 15 && gates.every((entry) => entry.passed),
    passedGateCount: gates.filter((entry) => entry.passed).length,
    failedGateCount: gates.filter((entry) => !entry.passed).length,
    gates,
  });
}
