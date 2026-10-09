/**
 * NPA-T STAGE-PROD:4 — existing DIR/DTH evidence → read-only Stage visuals.
 * DIR:VI owns chart semantics; DTH owns scene and evidence meaning.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicProjection.ts";
import {
  resolveNexoraVisualView,
  type NexoraVisualEvidenceBundle,
  type NexoraVisualSemanticConfidence,
  type NexoraVisualView,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";
import type { StageProdDirectorComposition } from "./stageProdDirectorComposition.ts";

export const stageProdVisualSpecificationIdentity =
  "NPA-T STAGE-PROD:4/ContextualVisualSpecification" as const;

type StageProdVisualBase = Readonly<{
  identity: string;
  sceneScriptId: string;
  canonicalObjectIds: readonly string[];
  sourceIds: readonly string[];
  evidenceStates: readonly string[];
  sceneRole: "contextual-support";
  writesCanonicalManagementState: false;
  isBusinessObject: false;
  isDataObject: false;
}>;

export type StageProdChartVisualSpec = StageProdVisualBase &
  Readonly<{
    family: "TREND" | "COMPARISON";
    view: NexoraVisualView;
  }>;

export type StageProdStatusCardVisualSpec = StageProdVisualBase &
  Readonly<{
    family: "STATUS_CARD";
    title: string;
    status: string | null;
    evidenceSummary: string;
    provenance: readonly string[];
  }>;

export type StageProdVisualSpec =
  | StageProdChartVisualSpec
  | StageProdStatusCardVisualSpec;

export type StageProdVisualProjection = Readonly<{
  identity: typeof stageProdVisualSpecificationIdentity;
  status: "renderable" | "omitted";
  specs: readonly StageProdVisualSpec[];
  omissionReason: string | null;
  writesCanonicalManagementState: false;
  parallelChartTruth: false;
  fabricatedValues: false;
}>;

function confidenceOf(
  iconic: NexoraDecisionTheatreIconicObject,
): NexoraVisualSemanticConfidence {
  return iconic.epistemicStatus === "fact" ? "CONFIRMED" : "LIKELY";
}

function parseSupportedNumber(value: string | number): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = value.trim().replace(/[$,\s]/g, "");
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)([kKmM])?$/);
  if (match == null) return null;
  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;
  const suffix = match[2]?.toLowerCase();
  return base * (suffix === "m" ? 1_000_000 : suffix === "k" ? 1_000 : 1);
}

function comparisonCriterion(
  theatre: NexoraDecisionTheatreFoundation,
): "cost" | "time" | null {
  const criterion = theatre.decisionComparison?.criterion?.toLowerCase() ?? "";
  if (criterion.includes("cost")) return "cost";
  if (criterion.includes("time")) return "time";
  return null;
}

function comparisonView(
  theatre: NexoraDecisionTheatreFoundation,
): Readonly<{
  view: NexoraVisualView;
  sourceIds: readonly string[];
  evidenceStates: readonly string[];
}> | null {
  const comparison = theatre.decisionComparison;
  const criterion = comparisonCriterion(theatre);
  if (comparison == null || criterion == null || comparison.candidateIds.length < 2) {
    return null;
  }
  const iconics = comparison.candidateIds.map((candidateId) =>
    theatre.iconicObjects.find(
      (item) =>
        item.ownerExecutiveObjectId === candidateId &&
        item.role === criterion &&
        !item.unknown &&
        !item.missing &&
        item.value != null,
    ),
  );
  if (iconics.some((item) => item == null)) return null;
  const supported = iconics as readonly NexoraDecisionTheatreIconicObject[];
  if (new Set(supported.map((item) => item.unit ?? "")).size !== 1) return null;

  const series = supported.map((item) => {
    const value = parseSupportedNumber(item.value as string | number);
    const candidate = comparison.candidates.find(
      (entry) => entry.id === item.ownerExecutiveObjectId,
    );
    if (value == null || candidate == null) return null;
    return Object.freeze({
      id: candidate.id,
      fieldLabel: candidate.label,
      displayLabel: candidate.label,
      confidence: confidenceOf(item),
      unit: item.unit,
      sourceLabel: item.authoritativeSource,
      example: false,
      points: Object.freeze([
        Object.freeze({ periodLabel: item.managerReadableLabel, value }),
      ]),
    });
  });
  if (series.some((item) => item == null)) return null;
  const evidence: NexoraVisualEvidenceBundle = Object.freeze({
    acceptedIntoDataReality: false,
    series: Object.freeze(series as NonNullable<(typeof series)[number]>[]),
  });
  const resolution = resolveNexoraVisualView({
    purpose: "COMPARE",
    evidence,
    comparableIds: comparison.candidateIds,
  });
  if (resolution.status !== "SUPPORTED") return null;
  return Object.freeze({
    view: resolution.view,
    sourceIds: Object.freeze(supported.map((item) => item.provenanceRef)),
    evidenceStates: Object.freeze(
      supported.map((item) => item.epistemicStatus),
    ),
  });
}

function normalizeSubjectToken(id: string): string {
  return id.replace(/^(obj-|ctx-problem-|ctx-)/, "").toLowerCase();
}

export function stageProdRequestedVisualRemainsValid(input: Readonly<{
  readonly view: NexoraVisualView;
  readonly focalSubjectId?: string | null;
  readonly comparisonIds?: readonly string[];
  readonly pinned?: boolean;
}>): boolean {
  if (input.pinned === true) return true;
  const comparisonIds = input.comparisonIds ?? [];
  if (comparisonIds.length >= 2) {
    const focal = input.focalSubjectId;
    if (focal != null && comparisonIds.includes(focal)) return true;
    if (
      input.view.purpose === "COMPARE" &&
      input.view.series.some((series) => comparisonIds.includes(series.id))
    ) {
      return true;
    }
  }
  const focal = input.focalSubjectId;
  if (focal == null || focal.length === 0) return true;
  const focalToken = normalizeSubjectToken(focal);
  return input.view.series.some((series) => {
    const seriesToken = normalizeSubjectToken(series.id);
    return (
      series.id === focal ||
      seriesToken === focalToken ||
      series.displayLabel.toLowerCase() === focalToken
    );
  });
}

function requestedVisualAssociationIds(view: NexoraVisualView): readonly string[] {
  return Object.freeze([...new Set(view.series.map((series) => series.id))]);
}

function requestedChartSpec(
  theatre: NexoraDecisionTheatreFoundation,
  composition: StageProdDirectorComposition,
  view: NexoraVisualView,
  focalSubjectId?: string | null,
): StageProdChartVisualSpec | null {
  const focal =
    focalSubjectId ??
    composition.presentation.focusedSubjectId ??
    composition.presentation.selectedSubjectId ??
    theatre.objectInvestigation?.objectId ??
    theatre.primaryExecutiveObjectId;
  if (
    !stageProdRequestedVisualRemainsValid({
      view,
      focalSubjectId: focal,
      comparisonIds: theatre.decisionComparison?.candidateIds,
    })
  ) {
    return null;
  }
  const objectIds = requestedVisualAssociationIds(view);
  if (objectIds.length === 0) return null;
  return Object.freeze({
    identity: `${stageProdVisualSpecificationIdentity}:${view.viewId}`,
    family: view.purpose === "TREND" ? "TREND" : "COMPARISON",
    view,
    sceneScriptId: theatre.sceneScript.scriptId,
    canonicalObjectIds: objectIds,
    sourceIds: Object.freeze(
      [...new Set(view.series.map((series) => series.sourceLabel))],
    ),
    evidenceStates: Object.freeze(
      [...new Set(view.series.map((series) => series.confidence))],
    ),
    sceneRole: "contextual-support",
    writesCanonicalManagementState: false,
    isBusinessObject: false,
    isDataObject: false,
  });
}

function comparisonSpec(
  theatre: NexoraDecisionTheatreFoundation,
): StageProdChartVisualSpec | null {
  const resolved = comparisonView(theatre);
  if (resolved == null || theatre.decisionComparison == null) return null;
  return Object.freeze({
    identity: `${stageProdVisualSpecificationIdentity}:${resolved.view.viewId}`,
    family: "COMPARISON",
    view: resolved.view,
    sceneScriptId: theatre.sceneScript.scriptId,
    canonicalObjectIds: Object.freeze([
      ...theatre.decisionComparison.candidateIds,
    ]),
    sourceIds: resolved.sourceIds,
    evidenceStates: resolved.evidenceStates,
    sceneRole: "contextual-support",
    writesCanonicalManagementState: false,
    isBusinessObject: false,
    isDataObject: false,
  });
}

export function projectStageProdContextualVisuals(input: Readonly<{
  theatre?: NexoraDecisionTheatreFoundation | null;
  composition: StageProdDirectorComposition;
  requestedVisual?: NexoraVisualView | null;
  focalSubjectId?: string | null;
}>): StageProdVisualProjection {
  const theatre = input.theatre ?? null;
  if (theatre == null) {
    return Object.freeze({
      identity: stageProdVisualSpecificationIdentity,
      status: "omitted",
      specs: Object.freeze([]),
      omissionReason: "missing-theatre-composition",
      writesCanonicalManagementState: false,
      parallelChartTruth: false,
      fabricatedValues: false,
    });
  }

  const requestedSpec = input.requestedVisual
    ? requestedChartSpec(
        theatre,
        input.composition,
        input.requestedVisual,
        input.focalSubjectId,
      )
    : null;
  // STAGE-COMPOSITION:4 — textual STATUS_CARD is not a Stage visual fallback.
  // DTH:6 investigation semantics remain on Selected Object / Advisor.
  // Charts and DTH:7 comparison remain Stage-owned visual evidence.
  const spec =
    requestedSpec ??
    (input.requestedVisual ? null : comparisonSpec(theatre));
  const omittedRequested =
    input.requestedVisual != null && requestedSpec == null;
  return Object.freeze({
    identity: stageProdVisualSpecificationIdentity,
    status: spec == null ? "omitted" : "renderable",
    specs: Object.freeze(spec == null ? [] : [spec]),
    omissionReason: spec == null
      ? omittedRequested
        ? "requested-visual-not-valid-for-focal-subject"
        : "no-supported-contextual-visual"
      : null,
    writesCanonicalManagementState: false,
    parallelChartTruth: false,
    fabricatedValues: false,
  });
}
