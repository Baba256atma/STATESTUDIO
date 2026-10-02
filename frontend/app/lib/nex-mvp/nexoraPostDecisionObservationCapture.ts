/**
 * MVP-OUT:1-R2 — post-decision Data Reality observation capture seam.
 *
 * Trigger is canonical Data Reality journal commit or CSV Data Reality commit,
 * not React render. CORE-OUT:1A remains the capture/linkage writer.
 * OUT-BASE:1 forwards already-published pre-Execution Data Reality into the
 * existing CORE-OUT:1A window.baselineObservationId. No second baseline store.
 */

import type { NexoraKPIResult } from "../data-reality/dataRealityContracts.ts";
import {
  listAllCsvRealDataImports,
  subscribeCsvRealDataImports,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import { EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP } from "../data-reality/demo/executiveOperationsObjectBindings.ts";
import type { NexoraLiveCommittedObservation } from "../data-reality/liveDataConnectorFoundation.ts";
import {
  listAllNexoraLiveCommittedObservations,
  subscribeLiveDataConnections,
} from "../data-reality/liveDataConnectionStore.ts";
import type { ExecutiveOutcomeExpectation } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  bindOutcomeObservation,
  captureOutcomeObservation,
  dimensionsCompatible,
  listCapturedObservations,
  openOutcomeObservationWindow,
  outcomeComparisonDimension,
  type OutcomeLinkBasis,
  type OutcomeObservationInput,
  type OutcomeObservationWindowRecord,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  resolveDecisionExpectedOutcomeBinding,
  resolveLiveSubjectExpectedOutcome,
  type DecisionExpectedOutcomeBinding,
  type LiveScenarioImpactHint,
} from "./nexoraDecisionExpectedOutcomeBinding.ts";
import { isPostBoundaryObservation } from "./nexoraDecisionOutcomeCommitment.ts";

export const nexoraPostDecisionObservationCaptureIdentity =
  "MVP-OUT:1-R2/PostDecisionObservationCapture" as const;

export type PostDecisionCaptureContext = Readonly<{
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly subjectId: string | null;
  readonly expected: ExecutiveOutcomeExpectation | null;
  readonly window: OutcomeObservationWindowRecord | null;
  readonly binding: DecisionExpectedOutcomeBinding | null;
  readonly linkBasis: OutcomeLinkBasis | null;
}>;

let captureContext: PostDecisionCaptureContext | null = null;
const contextsByExecution = new Map<string, PostDecisionCaptureContext>();
let ingestCount = 0;
const ingestedLiveIds = new Set<string>();
const ingestedCsvKeys = new Set<string>();

function contextKey(context: PostDecisionCaptureContext): string {
  return context.executionId ?? context.decisionId ?? context.subjectId ?? "unscoped";
}

function allContexts(): readonly PostDecisionCaptureContext[] {
  const listed = [...contextsByExecution.values()];
  if (captureContext && !listed.some((item) => item === captureContext || contextKey(item) === contextKey(captureContext!))) {
    return Object.freeze([captureContext, ...listed]);
  }
  return listed.length > 0 ? Object.freeze(listed) : captureContext ? Object.freeze([captureContext]) : Object.freeze([]);
}

function stageIdForDataObject(id: string | null | undefined): string | null {
  if (!id) return null;
  const mapped = EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find(
    (item) => item.nexoraObjectId === id || item.mvpStageObjectId === id || item.objectKey === id,
  );
  return mapped?.mvpStageObjectId ?? mapped?.nexoraObjectId ?? null;
}

function subjectsCompatible(contextSubject: string | null, kpiObjectId: string | null, objectKey?: string | null): boolean {
  if (!contextSubject) return false;
  const kpiIds = [kpiObjectId, objectKey, stageIdForDataObject(kpiObjectId), stageIdForDataObject(objectKey)].filter(
    (item): item is string => Boolean(item),
  );
  if (kpiIds.includes(contextSubject)) return true;
  const contextStage = stageIdForDataObject(contextSubject);
  return Boolean(contextStage && kpiIds.includes(contextStage));
}

function kpisFromCsvImport(committed: CsvCommittedImport): readonly NexoraKPIResult[] {
  const prepared = committed.prepared.dataReality?.kpis ?? [];
  if (prepared.length > 0) return prepared;
  const dataset = committed.prepared.handoff?.dataset ?? null;
  if (!dataset) return Object.freeze([]);
  return Object.freeze(
    dataset.records.map((record) => {
      const identity = EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find((item) => item.objectKey === record.objectKey);
      return Object.freeze({
        kpiId: record.metricKey,
        objectKey: record.objectKey,
        nexoraObjectId: identity?.mvpStageObjectId ?? identity?.nexoraObjectId ?? record.objectKey,
        value: record.value,
        unit: record.unit ?? "",
        calculatedAt: record.observedAt ?? committed.prepared.handoff?.dataset.capturedAt ?? committed.committedAt,
      });
    }),
  );
}

function captureUnlinkedPublishedKpi(input: {
  readonly kpi: NexoraKPIResult;
  readonly subjectId: string;
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly observedAt: string | null;
  readonly capturedAt: string | null;
  readonly provenanceRefs: readonly string[];
  readonly validationState: OutcomeObservationInput["validationState"];
}) {
  const observedAt = input.observedAt ?? input.kpi.calculatedAt;
  return captureOutcomeObservation({
    observation: Object.freeze({
      subjectId: input.subjectId,
      metricId: input.kpi.kpiId,
      dimension: outcomeComparisonDimension(input.kpi.kpiId),
      unit: input.kpi.unit,
      value: input.kpi.value,
      qualitativeState: null,
      observedAt,
      capturedAt: input.capturedAt ?? input.kpi.calculatedAt,
      sourceId: input.sourceId,
      datasetId: input.datasetId,
      evidenceRefs: Object.freeze([
        Object.freeze({
          sourceKind: "data-reality" as const,
          sourceId: input.sourceId ?? input.kpi.kpiId,
          subjectId: input.kpi.nexoraObjectId,
          factKey: input.kpi.kpiId,
        }),
      ]),
      provenanceRefs: Object.freeze([...input.provenanceRefs]),
      validationState: input.validationState,
      freshnessState: "current" as const,
      decisionId: null,
      executionId: null,
    }),
  });
}

/**
 * Latest already-published Data Reality KPI for the Execution subject's Outcome metric.
 * Uses CORE-OUT:1A capture (no second baseline store). Store membership at window open
 * is the pre-Execution publication set. Latest matching observedAt wins (CSV source replace).
 */
function resolvePreExecutionBaseline(input: {
  readonly subjectId: string;
  readonly expectedDimension: string | null;
  readonly notAfter?: string | null;
}): { readonly observationId: string | null; readonly measuredAt: string | null } {
  if (!input.expectedDimension) {
    return { observationId: null, measuredAt: null };
  }
  let best: { observationId: string; measuredAt: string } | null = null;
  const consider = (kpi: NexoraKPIResult, meta: {
    readonly sourceId: string | null;
    readonly datasetId: string | null;
    readonly observedAt: string | null;
    readonly capturedAt: string | null;
    readonly provenanceRefs: readonly string[];
    readonly validationState: OutcomeObservationInput["validationState"];
  }) => {
    if (!subjectsCompatible(input.subjectId, kpi.nexoraObjectId ?? null, kpi.objectKey ?? null)) return;
    if (!dimensionsCompatible(outcomeComparisonDimension(kpi.kpiId), input.expectedDimension!)) return;
    const measuredAt = kpi.calculatedAt || meta.observedAt;
    if (!measuredAt) return;
    if (input.notAfter && measuredAt >= input.notAfter) return;
    if (meta.provenanceRefs.length === 0) return;
    const captured = captureUnlinkedPublishedKpi({
      kpi,
      subjectId: input.subjectId,
      sourceId: meta.sourceId,
      datasetId: meta.datasetId,
      observedAt: measuredAt,
      capturedAt: meta.capturedAt,
      provenanceRefs: meta.provenanceRefs,
      validationState: meta.validationState,
    });
    if (!best || measuredAt >= best.measuredAt) {
      best = { observationId: captured.observationId, measuredAt };
    }
  };
  for (const committed of listAllCsvRealDataImports()) {
    const observedAt = committed.prepared.handoff?.dataset.capturedAt ?? committed.committedAt;
    const datasetId = committed.prepared.handoff?.dataset.id ?? committed.importId;
    const provenance = Object.freeze([committed.sourceContextId, committed.importId, committed.committedAt]);
    const validationState = committed.prepared.dataReality?.status === "complete" ? "valid" : "partial";
    for (const kpi of kpisFromCsvImport(committed)) {
      consider(kpi, {
        sourceId: committed.sourceContextId,
        datasetId,
        observedAt,
        capturedAt: committed.committedAt,
        provenanceRefs: provenance,
        validationState,
      });
    }
  }
  for (const observation of listAllNexoraLiveCommittedObservations()) {
    const provenance = Object.freeze([
      observation.observationId,
      observation.handoff.dataset.id,
      observation.snapshot.source.identity.connectionId,
    ]);
    for (const kpi of observation.dataReality.kpis) {
      consider(kpi, {
        sourceId: observation.sourceContextId,
        datasetId: observation.handoff.dataset.id,
        observedAt: observation.observedAt,
        capturedAt: observation.committedAt,
        provenanceRefs: provenance,
        validationState: validationFromSnapshot(observation),
      });
    }
  }
  return best ?? { observationId: null, measuredAt: null };
}

function comparisonWindowOpenedAt(input: {
  readonly committedAt: string | null;
  readonly baselineMeasuredAt: string | null;
  readonly latestPublished: string | null;
}): string | null {
  if (input.committedAt && input.baselineMeasuredAt) {
    return input.baselineMeasuredAt > input.committedAt ? input.baselineMeasuredAt : input.committedAt;
  }
  return input.committedAt ?? input.baselineMeasuredAt ?? input.latestPublished;
}

function contextsForKpi(kpi: { readonly nexoraObjectId?: string; readonly objectKey?: string }): readonly PostDecisionCaptureContext[] {
  const contexts = allContexts();
  if (contexts.length === 0) return Object.freeze([]);
  const matched = contexts.filter((context) =>
    subjectsCompatible(context.subjectId, kpi.nexoraObjectId ?? null, kpi.objectKey ?? null),
  );
  if (matched.length === 1) return Object.freeze(matched);
  if (matched.length > 1) return Object.freeze([]);
  if (contexts.length === 1 && !(kpi.nexoraObjectId || kpi.objectKey)) return contexts;
  return Object.freeze([]);
}

function onLiveJournalPublish(): void {
  if (allContexts().length === 0) return;
  for (const observation of listAllNexoraLiveCommittedObservations()) {
    if (ingestedLiveIds.has(observation.observationId)) continue;
    ingestedLiveIds.add(observation.observationId);
    ingestCommittedLiveObservation(observation);
  }
}

function ingestCsvCommitted(committed: CsvCommittedImport): void {
  const kpis = committed.prepared.dataReality?.kpis ?? [];
  const dataset = committed.prepared.handoff?.dataset ?? null;
  const observedAt = committed.prepared.handoff?.dataset.capturedAt ?? committed.committedAt;
  const sourceId = committed.sourceContextId;
  const datasetId = dataset?.id ?? committed.importId;
  const key = `${sourceId}:${committed.committedAt}:${datasetId}`;
  if (ingestedCsvKeys.has(key)) return;
  ingestedCsvKeys.add(key);
  const provenance = Object.freeze([committed.sourceContextId, committed.importId, committed.committedAt]);
  if (kpis.length > 0) {
    ingestDataRealityKpisForOutcomeCapture({
      kpis,
      sourceId,
      datasetId,
      observedAt,
      capturedAt: committed.committedAt,
      provenanceRefs: provenance,
      validationState: committed.prepared.dataReality?.status === "complete" ? "valid" : "partial",
    });
    return;
  }
  if (!dataset) return;
  const synthetic: NexoraKPIResult[] = dataset.records.map((record) => {
    const identity = EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find((item) => item.objectKey === record.objectKey);
    return Object.freeze({
      kpiId: record.metricKey,
      objectKey: record.objectKey,
      nexoraObjectId: identity?.mvpStageObjectId ?? identity?.nexoraObjectId ?? record.objectKey,
      value: record.value,
      unit: record.unit ?? "",
      calculatedAt: record.observedAt ?? observedAt,
    });
  });
  if (synthetic.length === 0) return;
  ingestDataRealityKpisForOutcomeCapture({
    kpis: synthetic,
    sourceId,
    datasetId,
    observedAt,
    capturedAt: committed.committedAt,
    provenanceRefs: provenance,
    validationState: "partial",
  });
}

function onCsvDataRealityPublish(): void {
  if (allContexts().length === 0) return;
  const latest = listAllCsvRealDataImports().at(-1);
  if (latest) ingestCsvCommitted(latest);
}

subscribeLiveDataConnections(onLiveJournalPublish);
let unsubscribeCsv = subscribeCsvRealDataImports(onCsvDataRealityPublish);

function ensurePublicationSubscriptions(): void {
  unsubscribeCsv?.();
  unsubscribeCsv = subscribeCsvRealDataImports(onCsvDataRealityPublish);
}

export function registerPostDecisionCaptureContext(
  context: PostDecisionCaptureContext | null,
): void {
  captureContext = context;
  if (context?.executionId) contextsByExecution.set(context.executionId, context);
  onLiveJournalPublish();
}

function bindLinkedObservations(context: PostDecisionCaptureContext): void {
  if (context.binding?.status !== "bound" || context.expected == null) return;
  for (const captured of listCapturedObservations()) {
    if (captured.executionId !== context.executionId) continue;
    if (captured.eligibleAsActualOutcome) continue;
    if (!dimensionsCompatible(captured.dimension, context.expected.dimension)) continue;
    bindOutcomeObservation({
      observationId: captured.observationId,
      expected: context.expected,
      basis: context.linkBasis ?? "metric-binding",
      window: context.window,
    });
  }
}

export function syncLiveExecutionCaptureContexts(input: {
  readonly executions: readonly {
    readonly executionId: string;
    readonly decisionId: string;
    readonly title: string;
    readonly status: string;
  }[];
  readonly decisions: readonly {
    readonly decisionId: string;
    readonly subjectIds: readonly string[];
    readonly scenarioId?: string | null;
    readonly committedAt?: string | null;
  }[];
  readonly scenarioSourceById?: Readonly<Record<string, string | null | undefined>>;
  readonly scenarioImpactsById?: Readonly<Record<string, readonly LiveScenarioImpactHint[] | undefined>>;
  readonly focusedSubjectId?: string | null;
}): void {
  const latestPublished = listAllCsvRealDataImports().at(-1)?.committedAt ?? null;
  for (const execution of input.executions) {
    const existing = contextsByExecution.get(execution.executionId) ?? null;
    const decision = input.decisions.find((item) => item.decisionId === execution.decisionId) ?? null;
    const fromDecisionId = execution.decisionId.match(/obj-(?:capacity|delivery|revenue|inventory)/i)?.[0]?.toLowerCase() ?? null;
    const fromScenario = decision?.scenarioId
      ? input.scenarioSourceById?.[decision.scenarioId] ?? null
      : null;
    const fromSubjects = decision?.subjectIds.find((id) => /^obj-(?:capacity|delivery|revenue|inventory)$/i.test(id)) ?? null;
    const fromFocus = input.focusedSubjectId && /^obj-/.test(input.focusedSubjectId) ? input.focusedSubjectId : null;
    const subjectId =
      existing?.subjectId ??
      fromScenario ??
      fromDecisionId ??
      fromSubjects ??
      fromFocus ??
      decision?.subjectIds[0] ??
      null;
    if (!subjectId) continue;
    const expectedCapturedAt =
      (existing?.window?.status !== "timing-incomplete" ? existing?.window?.openedAt : null) ??
      decision?.committedAt ??
      latestPublished ??
      null;
    const expected =
      existing?.binding?.status === "bound"
        ? existing.expected
        : resolveLiveSubjectExpectedOutcome({
            decisionId: execution.decisionId,
            subjectId,
            scenarioId: decision?.scenarioId ?? null,
            impacts: decision?.scenarioId
              ? input.scenarioImpactsById?.[decision.scenarioId] ?? []
              : [],
            capturedAt: expectedCapturedAt,
          });
    const binding = resolveDecisionExpectedOutcomeBinding({
      decisionId: execution.decisionId,
      subjectId,
      explicitExpected: expected,
    });
    const boundExpected = binding.status === "bound" ? binding.expectation : expected;
    const reuseWindow = existing?.window?.status !== "timing-incomplete" ? existing?.window : null;
    const baseline =
      reuseWindow?.baselineObservationId
        ? { observationId: reuseWindow.baselineObservationId, measuredAt: reuseWindow.openedAt }
        : resolvePreExecutionBaseline({
            subjectId,
            expectedDimension: boundExpected?.dimension ?? binding.dimension ?? null,
          });
    const openedAt =
      reuseWindow?.openedAt ??
      comparisonWindowOpenedAt({
        committedAt: decision?.committedAt ?? null,
        baselineMeasuredAt: baseline.measuredAt,
        latestPublished,
      });
    const window =
      reuseWindow ??
      (openedAt
        ? openOutcomeObservationWindow({
            subjectId,
            decisionId: execution.decisionId,
            executionId: execution.executionId,
            openedAt,
            expectedStartAt: openedAt,
            expectedEndAt: null,
            baselineObservationId: baseline.observationId,
            expectedOutcomeIds: boundExpected ? [boundExpected.expectationId] : [],
          })
        : null);
    const context: PostDecisionCaptureContext = Object.freeze({
      decisionId: execution.decisionId,
      executionId: execution.executionId,
      subjectId,
      expected: boundExpected,
      window,
      binding,
      linkBasis: binding.status === "bound" ? "metric-binding" : null,
    });
    contextsByExecution.set(execution.executionId, context);
    if (captureContext == null) captureContext = context;
    bindLinkedObservations(context);
  }
}

export function resetPostDecisionCaptureForTests(): void {
  captureContext = null;
  contextsByExecution.clear();
  ingestCount = 0;
  ingestedLiveIds.clear();
  ingestedCsvKeys.clear();
  ensurePublicationSubscriptions();
}

export function listLiveExecutionCaptureContextsForTests(): readonly PostDecisionCaptureContext[] {
  return allContexts();
}

export function listLiveExecutionCaptureContextIdsForTests(): readonly string[] {
  return Object.freeze([...contextsByExecution.keys()]);
}

export function getPostDecisionCaptureIngestCount(): number {
  return ingestCount;
}

function validationFromSnapshot(
  observation: NexoraLiveCommittedObservation,
): OutcomeObservationInput["validationState"] {
  return observation.snapshot.validation.state;
}

function ensureCaptureWindow(
  context: PostDecisionCaptureContext,
  observedAt: string | null,
): PostDecisionCaptureContext {
  const incomplete = context.window == null || context.window.status === "timing-incomplete";
  if (!incomplete || !observedAt || !context.subjectId || !context.executionId) {
    return context;
  }
  const baseline = resolvePreExecutionBaseline({
    subjectId: context.subjectId,
    expectedDimension: context.expected?.dimension ?? null,
    notAfter: observedAt,
  });
  const window = openOutcomeObservationWindow({
    subjectId: context.subjectId,
    decisionId: context.decisionId,
    executionId: context.executionId,
    openedAt: observedAt,
    expectedStartAt: observedAt,
    expectedEndAt: null,
    baselineObservationId: baseline.observationId,
    expectedOutcomeIds: context.expected ? [context.expected.expectationId] : [],
  });
  const next: PostDecisionCaptureContext = Object.freeze({ ...context, window });
  contextsByExecution.set(context.executionId, next);
  if (captureContext?.executionId === context.executionId) captureContext = next;
  return next;
}

function captureKpiForContext(
  kpi: NexoraKPIResult,
  context: PostDecisionCaptureContext | null,
  input: {
    readonly sourceId: string | null;
    readonly datasetId: string | null;
    readonly observedAt: string | null;
    readonly capturedAt: string | null;
    readonly provenanceRefs: readonly string[];
    readonly validationState: OutcomeObservationInput["validationState"];
    readonly freshnessState?: OutcomeObservationInput["freshnessState"];
  },
): ReturnType<typeof captureOutcomeObservation> | null {
  const observedAt = input.observedAt ?? kpi.calculatedAt;
  const openedNow = Boolean(
    context &&
      observedAt &&
      (context.window == null || context.window.status === "timing-incomplete"),
  );
  const scoped = context ? ensureCaptureWindow(context, observedAt) : null;
  const boundary = scoped?.window?.openedAt ?? scoped?.window?.expectedStartAt ?? null;
  const postBoundary = openedNow
    ? true
    : boundary
      ? isPostBoundaryObservation(observedAt, boundary)
      : true;
  if (scoped && boundary && !postBoundary) {
    return null;
  }
  const comparisonDimension = outcomeComparisonDimension(kpi.kpiId);
  const expected =
    scoped?.expected &&
    dimensionsCompatible(comparisonDimension, scoped.expected.dimension)
      ? scoped.expected
      : null;
  const observation: OutcomeObservationInput = Object.freeze({
    subjectId: scoped?.subjectId || kpi.nexoraObjectId || "",
    metricId: kpi.kpiId,
    dimension: comparisonDimension,
    unit: kpi.unit,
    value: kpi.value,
    qualitativeState: null,
    observedAt,
    capturedAt: input.capturedAt ?? kpi.calculatedAt,
    sourceId: input.sourceId,
    datasetId: input.datasetId,
    evidenceRefs: Object.freeze([
      Object.freeze({
        sourceKind: "data-reality" as const,
        sourceId: input.sourceId ?? kpi.kpiId,
        subjectId: kpi.nexoraObjectId,
        factKey: kpi.kpiId,
      }),
    ]),
    provenanceRefs: Object.freeze([...input.provenanceRefs]),
    validationState: input.validationState,
    freshnessState: input.freshnessState ?? "current",
    decisionId: scoped?.decisionId ?? null,
    executionId: scoped?.executionId ?? null,
    expectedOutcomeId: expected?.expectationId ?? scoped?.binding?.expectedOutcomeId ?? null,
    observationWindowId: scoped?.window?.id ?? null,
  });
  return captureOutcomeObservation({
    observation,
    expected,
    window: scoped?.window ?? null,
    linkBasis:
      expected != null &&
      scoped?.binding?.status === "bound" &&
      postBoundary
        ? (scoped.linkBasis ?? "metric-binding")
        : null,
  });
}

export function ingestDataRealityKpisForOutcomeCapture(input: {
  readonly kpis: readonly NexoraKPIResult[];
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly observedAt: string | null;
  readonly capturedAt: string | null;
  readonly provenanceRefs: readonly string[];
  readonly validationState: OutcomeObservationInput["validationState"];
  readonly freshnessState?: OutcomeObservationInput["freshnessState"];
}): readonly ReturnType<typeof captureOutcomeObservation>[] {
  ingestCount += 1;
  const captured: ReturnType<typeof captureOutcomeObservation>[] = [];
  for (const kpi of input.kpis) {
    const matched = contextsForKpi(kpi);
    const hasIdentity = Boolean(kpi.nexoraObjectId || kpi.objectKey);
    const targets =
      matched.length > 0
        ? matched
        : !hasIdentity && captureContext
          ? [captureContext]
          : [];
    if (targets.length === 0) continue;
    for (const context of targets) {
      const capturedItem = captureKpiForContext(kpi, context, input);
      if (capturedItem) captured.push(capturedItem);
    }
  }
  return Object.freeze(captured);
}

export function ingestCommittedLiveObservation(
  observation: NexoraLiveCommittedObservation,
): void {
  const provenance = Object.freeze([
    observation.observationId,
    observation.handoff.dataset.id,
    observation.snapshot.source.identity.connectionId,
  ]);
  ingestDataRealityKpisForOutcomeCapture({
    kpis: observation.dataReality.kpis,
    sourceId: observation.sourceContextId,
    datasetId: observation.handoff.dataset.id,
    observedAt: observation.observedAt,
    capturedAt: observation.committedAt,
    provenanceRefs: provenance,
    validationState: validationFromSnapshot(observation),
    freshnessState:
      observation.snapshot.validation.state === "stale" ? "stale" : "current",
  });
}
