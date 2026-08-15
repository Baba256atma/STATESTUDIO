/**
 * P2:8.2 — Data Reality Object State Visual Validation.
 *
 * Translates canonical executive/MVP Stage state into restrained presentation
 * instructions for NEX-MVP Stage objects.
 *
 * Does NOT:
 *   - recompute KPI / executive severity / attention / relationships
 *   - override P2:6 position / camera choreography
 *   - invent connections or expand P2:7 context
 *   - introduce dashboard cards, badges, charts, or traffic-light UI
 *
 * Chain consumed:
 *   Canonical Stage status/attention (+ interaction role)
 *   → Object State Visual Validation (this module)
 *   → Existing Stage mesh presentation
 */

import {
  dataRealityVisualStageAuditIdentity,
  dataRealityVisualStageAuditNamespace,
  dataRealityVisualStageAuditVersion,
} from "./dataRealityVisualStageAudit.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityObjectStateVisualValidationIdentity =
  "P2:8.2/DataRealityObjectStateVisualValidation" as const;

export const dataRealityObjectStateVisualValidationVersion = "2.8.2" as const;

export const dataRealityObjectStateVisualValidationNamespace =
  "nexora.data-reality.object-state-visual-validation" as const;

export const dataRealityObjectStateVisualValidationPhase =
  "ObjectStateVisualValidation" as const;

export const dataRealityObjectStateVisualValidationArchitecturalRole =
  "DataRealityObjectStateVisualValidationBoundary" as const;

export const dataRealityObjectStateVisualValidationReadiness =
  "ReadyForFocusChoreographyValidation" as const;

export interface DataRealityObjectStateVisualValidationIdentity {
  readonly identity: "P2:8.2/DataRealityObjectStateVisualValidation";
  readonly version: "2.8.2";
  readonly namespace: "nexora.data-reality.object-state-visual-validation";
  readonly phase: "ObjectStateVisualValidation";
  readonly architecturalRole: "DataRealityObjectStateVisualValidationBoundary";
  readonly readiness: "ReadyForFocusChoreographyValidation";
}

const IDENTITY: DataRealityObjectStateVisualValidationIdentity = Object.freeze({
  identity: dataRealityObjectStateVisualValidationIdentity,
  version: dataRealityObjectStateVisualValidationVersion,
  namespace: dataRealityObjectStateVisualValidationNamespace,
  phase: dataRealityObjectStateVisualValidationPhase,
  architecturalRole: dataRealityObjectStateVisualValidationArchitecturalRole,
  readiness: dataRealityObjectStateVisualValidationReadiness,
});

export function getDataRealityObjectStateVisualValidationIdentity(): DataRealityObjectStateVisualValidationIdentity {
  return IDENTITY;
}

export const DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      dataRealityObjectStateVisualValidationArchitecturalRole,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    ownsAdvisorReasoning: false as const,
    inventsRelationships: false as const,
    inventsSeverityScores: false as const,
    recomputesFocusAttention: false as const,
    overridesChoreographyPositions: false as const,
    redesignsObjectGeometry: false as const,
    introducesDashboardUi: false as const,
    encodesStateByColorAlone: false as const,
    consumesP281AuditEvidence: true as const,
    immediateAuditSource: dataRealityVisualStageAuditIdentity,
    visualCertified: false as const,
  });

export const DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:2 MVP Runtime Reality State",
    "P2:3 Stage Experience Binding",
    "P2:5 Focus & Attention Experience",
    "P2:6 Interaction & Scene Choreography",
    "P2:7 Connections & Context Reveal",
    "P2:8.1 Visual Stage Audit",
    "P2:8.2 Object State Visual Validation",
  ] as const);

// ─── Canonical visual vocabulary (presentation only) ────────────────────────

export const DATA_REALITY_OBJECT_EXECUTIVE_VISUAL_STATES = Object.freeze([
  "normal",
  "attention",
  "critical",
  "unresolved",
] as const);

export type DataRealityObjectExecutiveVisualState =
  (typeof DATA_REALITY_OBJECT_EXECUTIVE_VISUAL_STATES)[number];

export const DATA_REALITY_OBJECT_VISUAL_EMPHASIS = Object.freeze([
  "background",
  "normal",
  "important",
  "critical",
] as const);

export type DataRealityObjectVisualEmphasis =
  (typeof DATA_REALITY_OBJECT_VISUAL_EMPHASIS)[number];

export const DATA_REALITY_OBJECT_VISUAL_VISIBILITY = Object.freeze([
  "visible",
  "deemphasized",
] as const);

export type DataRealityObjectVisualVisibility =
  (typeof DATA_REALITY_OBJECT_VISUAL_VISIBILITY)[number];

export const DATA_REALITY_OBJECT_VISUAL_MARKERS = Object.freeze([
  "none",
  "attention",
  "critical",
  "unresolved",
] as const);

export type DataRealityObjectVisualMarker =
  (typeof DATA_REALITY_OBJECT_VISUAL_MARKERS)[number];

export const DATA_REALITY_OBJECT_VISUAL_LABEL_PRIORITIES = Object.freeze([
  "normal",
  "elevated",
  "persistent",
] as const);

export type DataRealityObjectVisualLabelPriority =
  (typeof DATA_REALITY_OBJECT_VISUAL_LABEL_PRIORITIES)[number];

export type DataRealityObjectInteractionRole =
  | "normal"
  | "focused"
  | "related"
  | "unrelated"
  | string;

export type ResolveDataRealityObjectVisualStateInput = {
  readonly objectId: string;
  /** Existing Stage MVP status vocabulary (stable|watch|risk|unresolved). */
  readonly mvpStatus: string;
  /** Existing Stage MVP attention vocabulary. */
  readonly mvpAttention: string;
  readonly interactionRole?: DataRealityObjectInteractionRole;
  readonly focused?: boolean;
  readonly selected?: boolean;
  /** Optional choreography retention hint — never invents severity. */
  readonly retainAttention?: boolean;
};

export type DataRealityObjectVisualState = {
  readonly objectId: string;
  readonly executiveState: DataRealityObjectExecutiveVisualState;
  readonly emphasis: DataRealityObjectVisualEmphasis;
  readonly visibility: DataRealityObjectVisualVisibility;
  readonly intensity: number;
  readonly opacity: number;
  readonly scale: number;
  readonly emissiveIntensity: number;
  readonly rimIntensity: number;
  readonly marker: DataRealityObjectVisualMarker;
  readonly labelPriority: DataRealityObjectVisualLabelPriority;
  readonly labelProminence: "full" | "reduced" | "minimal";
  /** Interaction selection cue — never conflated with critical marker. */
  readonly selectionCue: "none" | "selected";
  /** Interaction focus cue — independent from executive severity. */
  readonly focusCue: "none" | "focused";
  readonly reason: readonly string[];
};

export type DataRealityObjectVisualStateStrength = {
  readonly executiveState: DataRealityObjectExecutiveVisualState;
  readonly scale: number;
  readonly opacity: number;
  readonly emissiveIntensity: number;
  readonly rimIntensity: number;
  readonly markerRank: number;
  readonly labelRank: number;
};

// ─── Mapping (no severity invention) ────────────────────────────────────────

/**
 * Map existing Stage MVP vocabulary onto the four validated visual states.
 * Does not rename upstream executive-state semantics.
 */
export function mapMvpVocabularyToObjectExecutiveVisualState(
  mvpStatus: string,
  mvpAttention: string,
): DataRealityObjectExecutiveVisualState {
  if (mvpStatus === "unresolved") return "unresolved";
  if (mvpAttention === "critical") return "critical";
  if (
    mvpAttention === "important" ||
    mvpAttention === "elevated" ||
    mvpStatus === "watch" ||
    mvpStatus === "risk"
  ) {
    return "attention";
  }
  return "normal";
}

function markerRank(marker: DataRealityObjectVisualMarker): number {
  switch (marker) {
    case "critical":
      return 3;
    case "attention":
      return 2;
    case "unresolved":
      return 1;
    default:
      return 0;
  }
}

function labelRank(priority: DataRealityObjectVisualLabelPriority): number {
  switch (priority) {
    case "persistent":
      return 3;
    case "elevated":
      return 2;
    default:
      return 1;
  }
}

function baseTreatment(
  executiveState: DataRealityObjectExecutiveVisualState,
): Omit<
  DataRealityObjectVisualState,
  | "objectId"
  | "emphasis"
  | "visibility"
  | "selectionCue"
  | "focusCue"
  | "reason"
> {
  switch (executiveState) {
    case "critical":
      return Object.freeze({
        executiveState: "critical",
        intensity: 0.9,
        opacity: 1,
        scale: 1.12,
        emissiveIntensity: 0.34,
        rimIntensity: 0.55,
        marker: "critical",
        labelPriority: "persistent",
        labelProminence: "full",
      });
    case "attention":
      return Object.freeze({
        executiveState: "attention",
        intensity: 0.62,
        opacity: 1,
        scale: 1.07,
        emissiveIntensity: 0.24,
        rimIntensity: 0.28,
        marker: "attention",
        labelPriority: "elevated",
        labelProminence: "full",
      });
    case "unresolved":
      return Object.freeze({
        executiveState: "unresolved",
        intensity: 0.28,
        opacity: 0.9,
        scale: 1,
        emissiveIntensity: 0.1,
        rimIntensity: 0.22,
        marker: "unresolved",
        labelPriority: "elevated",
        labelProminence: "full",
      });
    default:
      return Object.freeze({
        executiveState: "normal",
        intensity: 0.18,
        opacity: 1,
        scale: 1,
        emissiveIntensity: 0.07,
        rimIntensity: 0,
        marker: "none",
        labelPriority: "normal",
        labelProminence: "full",
      });
  }
}

/**
 * Pure deterministic resolver: canonical Stage vocabulary → presentation.
 * Focus/selection compose with severity; they never rewrite severity.
 */
export function resolveDataRealityObjectVisualState(
  input: ResolveDataRealityObjectVisualStateInput,
): DataRealityObjectVisualState {
  const executiveState = mapMvpVocabularyToObjectExecutiveVisualState(
    input.mvpStatus,
    input.mvpAttention,
  );
  const base = baseTreatment(executiveState);
  const role = input.interactionRole ?? "normal";
  const focused = input.focused === true;
  const selected = input.selected === true && !focused;
  const backgrounded = role === "unrelated" && !focused;
  const reasons: string[] = [
    `mvpStatus=${input.mvpStatus}`,
    `mvpAttention=${input.mvpAttention}`,
    `executiveVisualState=${executiveState}`,
    `interactionRole=${role}`,
  ];

  let emphasis: DataRealityObjectVisualEmphasis = "normal";
  let visibility: DataRealityObjectVisualVisibility = "visible";
  let scale = base.scale;
  let opacity = base.opacity;
  let emissiveIntensity = base.emissiveIntensity;
  let rimIntensity = base.rimIntensity;
  let labelProminence = base.labelProminence;
  let labelPriority = base.labelPriority;
  let marker = base.marker;

  if (focused) {
    emphasis =
      executiveState === "critical"
        ? "critical"
        : executiveState === "attention"
          ? "important"
          : "normal";
    // Focus elevates spatial presence without inventing critical severity.
    scale = Math.max(scale, 1.3);
    opacity = 1;
    emissiveIntensity = Math.max(
      emissiveIntensity,
      executiveState === "critical" ? 0.45 : 0.4,
    );
    labelProminence = "full";
    labelPriority =
      executiveState === "normal" ? "elevated" : base.labelPriority;
    reasons.push("focusCue=focused; severity unchanged by selection/focus");
  } else if (role === "related") {
    emphasis =
      executiveState === "critical"
        ? "critical"
        : executiveState === "attention"
          ? "important"
          : "normal";
    scale = Math.max(scale, executiveState === "normal" ? 1.02 : scale);
    opacity = Math.max(opacity, 0.92);
    reasons.push("related supporting context; severity preserved");
  } else if (backgrounded) {
    visibility = "deemphasized";
    if (executiveState === "critical") {
      // Background critical must remain discoverable (P2:8.1/P2:8.2).
      emphasis = "critical";
      scale = Math.max(scale, 1.1);
      opacity = Math.max(0.74, Math.min(opacity, 0.86));
      emissiveIntensity = Math.max(emissiveIntensity, 0.32);
      rimIntensity = Math.max(rimIntensity, 0.5);
      labelProminence = "full";
      labelPriority = "persistent";
      marker = "critical";
      reasons.push(
        "background critical retained discoverability without becoming focus",
      );
    } else if (executiveState === "attention") {
      emphasis = "important";
      scale = Math.max(scale, 1.05);
      opacity = Math.max(0.64, Math.min(opacity, 0.8));
      emissiveIntensity = Math.max(emissiveIntensity, 0.2);
      rimIntensity = Math.max(rimIntensity, 0.26);
      labelProminence = "reduced";
      labelPriority = "elevated";
      marker = "attention";
      reasons.push("background attention retained without alarm aesthetics");
    } else if (executiveState === "unresolved") {
      // Marker/rim carry uncertainty; keep spatially secondary for focus hierarchy.
      emphasis = "background";
      scale = Math.min(Math.max(scale, 0.94), 0.98);
      opacity = Math.min(opacity, 0.34);
      emissiveIntensity = Math.max(Math.min(emissiveIntensity, 0.12), 0.1);
      rimIntensity = Math.max(rimIntensity, 0.2);
      labelProminence = "reduced";
      labelPriority = "elevated";
      marker = "unresolved";
      reasons.push(
        "background unresolved remains uncertain via marker, not healthy/normal",
      );
    } else if (input.retainAttention) {
      // Choreography-retained non-critical subjects stay discoverable.
      emphasis = "important";
      scale = Math.max(scale, 1.05);
      opacity = Math.max(0.64, Math.min(opacity, 0.8));
      emissiveIntensity = Math.max(emissiveIntensity, 0.2);
      rimIntensity = Math.max(rimIntensity, 0.26);
      labelProminence = "reduced";
      labelPriority = "elevated";
      reasons.push("choreography retainAttention without severity invention");
    } else {
      emphasis = "background";
      scale = Math.min(scale, 0.82);
      opacity = Math.min(opacity, 0.32);
      emissiveIntensity = Math.min(emissiveIntensity, 0.04);
      rimIntensity = 0;
      labelProminence = "minimal";
      labelPriority = "normal";
      marker = "none";
      reasons.push("background normal deemphasized; not disabled semantics");
    }
  } else {
    emphasis =
      executiveState === "critical"
        ? "critical"
        : executiveState === "attention"
          ? "important"
          : "normal";
  }

  // Selected normal must never inherit critical marker/treatment.
  if (selected && executiveState === "normal") {
    reasons.push("selectionCue=selected; not semantically critical");
  } else if (selected) {
    reasons.push("selectionCue=selected; severity marker unchanged");
  }

  // Guard invariant: unresolved never collapses to normal presentation.
  if (executiveState === "unresolved" && marker === "none") {
    marker = "unresolved";
    reasons.push("unresolved marker restored — never silent-normal");
  }

  return Object.freeze({
    objectId: input.objectId,
    executiveState,
    emphasis,
    visibility,
    intensity: base.intensity,
    opacity,
    scale,
    emissiveIntensity,
    rimIntensity,
    marker,
    labelPriority,
    labelProminence,
    selectionCue: selected ? ("selected" as const) : ("none" as const),
    focusCue: focused ? ("focused" as const) : ("none" as const),
    reason: Object.freeze(reasons),
  });
}

export function getDataRealityObjectVisualStateStrength(
  state: DataRealityObjectVisualState,
): DataRealityObjectVisualStateStrength {
  return Object.freeze({
    executiveState: state.executiveState,
    scale: state.scale,
    opacity: state.opacity,
    emissiveIntensity: state.emissiveIntensity,
    rimIntensity: state.rimIntensity,
    markerRank: markerRank(state.marker),
    labelRank: labelRank(state.labelPriority),
  });
}

/**
 * True when `candidate` is perceptually stronger than `baseline` on at least
 * one non-color channel (scale, emissive, rim, marker, or label persistence).
 */
export function isDataRealityObjectVisualStateStrongerThan(
  candidate: DataRealityObjectVisualState,
  baseline: DataRealityObjectVisualState,
): boolean {
  const a = getDataRealityObjectVisualStateStrength(candidate);
  const b = getDataRealityObjectVisualStateStrength(baseline);
  return (
    a.scale > b.scale + 0.02 ||
    a.emissiveIntensity > b.emissiveIntensity + 0.04 ||
    a.rimIntensity > b.rimIntensity + 0.08 ||
    a.markerRank > b.markerRank ||
    a.labelRank > b.labelRank
  );
}

export function resolveDataRealityObjectVisualStates(
  inputs: readonly ResolveDataRealityObjectVisualStateInput[],
): readonly DataRealityObjectVisualState[] {
  return Object.freeze(
    inputs.map((input) => resolveDataRealityObjectVisualState(input)),
  );
}

export type DataRealityObjectVisualValidationProvenance = {
  readonly validationIdentity: "P2:8.2/DataRealityObjectStateVisualValidation";
  readonly validationVersion: "2.8.2";
  readonly validationNamespace: "nexora.data-reality.object-state-visual-validation";
  readonly validationPhase: "ObjectStateVisualValidation";
  readonly visualCertified: false;
  readonly chain: typeof DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_PROVENANCE_CHAIN;
  readonly immediateAuditSource: typeof dataRealityVisualStageAuditIdentity;
  readonly immediateAuditVersion: typeof dataRealityVisualStageAuditVersion;
  readonly immediateAuditNamespace: typeof dataRealityVisualStageAuditNamespace;
};

export function getDataRealityObjectVisualValidationProvenance(): DataRealityObjectVisualValidationProvenance {
  return Object.freeze({
    validationIdentity: dataRealityObjectStateVisualValidationIdentity,
    validationVersion: dataRealityObjectStateVisualValidationVersion,
    validationNamespace: dataRealityObjectStateVisualValidationNamespace,
    validationPhase: dataRealityObjectStateVisualValidationPhase,
    visualCertified: false as const,
    chain: DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_PROVENANCE_CHAIN,
    immediateAuditSource: dataRealityVisualStageAuditIdentity,
    immediateAuditVersion: dataRealityVisualStageAuditVersion,
    immediateAuditNamespace: dataRealityVisualStageAuditNamespace,
  });
}
