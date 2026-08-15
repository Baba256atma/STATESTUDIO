/**
 * P2:8.1 — Data Reality Visual Stage Audit.
 *
 * Audits whether certified Data Reality / Runtime truth is structurally
 * present and semantically consistent with Stage presentation evidence.
 *
 * Does NOT:
 *   - recompute KPI / executive state / attention / choreography / relationships
 *   - certify true human visual perception
 *   - redesign Stage geometry, lighting, or interaction
 *   - invent relationships or alter severity
 *
 * Chain observed:
 *   Dataset → Facts → KPI → Executive State → Stage Projection
 *   → Attention → P2:6 Choreography → P2:7 Connections/Context → Rendered Stage
 */

import type { DataRealityAwareStageBindingResult } from "./dataRealityAwareStageExperienceBinding.ts";
import type { DataRealityAwareFocusAttentionExperienceResult } from "./dataRealityAwareFocusAttentionExperience.ts";
import type { DataRealityAwareSceneChoreographyResult } from "./dataRealityAwareSceneChoreography.ts";
import type { DataRealityAwareConnectionsContextResult } from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareSceneChoreographyIdentity,
  dataRealityAwareSceneChoreographyNamespace,
  dataRealityAwareSceneChoreographyVersion,
} from "./dataRealityAwareSceneChoreography.ts";
import {
  dataRealityAwareConnectionsContextIdentity,
  dataRealityAwareConnectionsContextNamespace,
  dataRealityAwareConnectionsContextVersion,
} from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareFocusAttentionExperienceIdentity,
  dataRealityAwareFocusAttentionExperienceNamespace,
  dataRealityAwareFocusAttentionExperienceVersion,
} from "./dataRealityAwareFocusAttentionExperience.ts";
import {
  dataRealityAwareStageExperienceBindingIdentity,
  dataRealityAwareStageExperienceBindingNamespace,
  dataRealityAwareStageExperienceBindingVersion,
} from "./dataRealityAwareStageExperienceBinding.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityVisualStageAuditIdentity =
  "P2:8.1/DataRealityVisualStageAudit" as const;

export const dataRealityVisualStageAuditVersion = "2.8.1" as const;

export const dataRealityVisualStageAuditNamespace =
  "nexora.data-reality.visual-stage-audit" as const;

export const dataRealityVisualStageAuditPhase =
  "VisualRealityAudit" as const;

export const dataRealityVisualStageAuditArchitecturalRole =
  "DataRealityVisualStageAuditBoundary" as const;

export const dataRealityVisualStageAuditReadiness =
  "ReadyForVisualStateValidation" as const;

export interface DataRealityVisualStageAuditIdentity {
  readonly identity: "P2:8.1/DataRealityVisualStageAudit";
  readonly version: "2.8.1";
  readonly namespace: "nexora.data-reality.visual-stage-audit";
  readonly phase: "VisualRealityAudit";
  readonly architecturalRole: "DataRealityVisualStageAuditBoundary";
  readonly readiness: "ReadyForVisualStateValidation";
}

const IDENTITY: DataRealityVisualStageAuditIdentity = Object.freeze({
  identity: dataRealityVisualStageAuditIdentity,
  version: dataRealityVisualStageAuditVersion,
  namespace: dataRealityVisualStageAuditNamespace,
  phase: dataRealityVisualStageAuditPhase,
  architecturalRole: dataRealityVisualStageAuditArchitecturalRole,
  readiness: dataRealityVisualStageAuditReadiness,
});

export function getDataRealityVisualStageAuditIdentity(): DataRealityVisualStageAuditIdentity {
  return IDENTITY;
}

export const DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityVisualStageAuditArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsAdvisorReasoning: false as const,
  inventsRelationships: false as const,
  inventsSeverityScores: false as const,
  recomputesFocusAttention: false as const,
  recomputesChoreography: false as const,
  recomputesConnectionsContext: false as const,
  redesignsStageVisuals: false as const,
  certifiesHumanVisualPerception: false as const,
  usesStagePresentationAsTruth: false as const,
  exposesThreeJsObjects: false as const,
  introducesGlobalStore: false as const,
  consumesCanonicalRuntimeOnly: true as const,
  auditCertified: false as const,
});

export const DATA_REALITY_VISUAL_STAGE_AUDIT_PROVENANCE_CHAIN = Object.freeze([
  "NexoraDataset",
  "P0 Data Reality",
  "P1 Executive Advisor",
  "P2:1 MVP Bridge",
  "P2:2 MVP Runtime Reality State",
  "P2:3 Stage Experience Binding",
  "P2:5 Focus & Attention Experience",
  "P2:6 Interaction & Scene Choreography",
  "P2:7 Connections & Context Reveal",
  "P2:8.1 Visual Stage Audit",
] as const);

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const VISUAL_REALITY_AUDIT_STATUSES = Object.freeze([
  "visible-and-consistent",
  "visible-but-weak",
  "computed-but-not-visible",
  "visually-misleading",
  "unresolved-as-designed",
  "not-applicable",
] as const);

export type VisualRealityAuditStatus =
  (typeof VISUAL_REALITY_AUDIT_STATUSES)[number];

export const VISUAL_REALITY_AUDIT_DIMENSIONS = Object.freeze([
  "object-presence",
  "executive-state",
  "attention",
  "focus-anchor",
  "connections",
  "context",
  "density",
  "camera-spatial",
] as const);

export type VisualRealityAuditDimension =
  (typeof VISUAL_REALITY_AUDIT_DIMENSIONS)[number];

export const VISUAL_REALITY_AUDIT_SEVERITIES = Object.freeze([
  "blocker",
  "high",
  "medium",
  "low",
] as const);

export type VisualRealityAuditSeverity =
  (typeof VISUAL_REALITY_AUDIT_SEVERITIES)[number];

export const VISUAL_REALITY_EVIDENCE_KINDS = Object.freeze([
  "structural",
  "visual-perception-pending",
] as const);

export type VisualRealityEvidenceKind =
  (typeof VISUAL_REALITY_EVIDENCE_KINDS)[number];

/** Status values that Stage meshes map to distinct material colors. */
export const STAGE_STATUS_VISUAL_TREATMENTS = Object.freeze({
  stable: "color:#7dd3fc",
  watch: "color:#fbbf24",
  risk: "color:#f87171",
  unresolved: "color:#94a3b8",
} as const);

// ─── Observed Stage evidence (structural; not human perception) ─────────────

export type ObservedStageObjectEvidence = {
  readonly objectId: string;
  readonly label: string;
  readonly present: boolean;
  readonly role: string;
  readonly status: string;
  readonly attention: string;
  readonly focused: boolean;
  readonly selected: boolean;
  readonly opacity: number;
  readonly scale: number;
  readonly emissiveIntensity: number;
  readonly labelProminence: "full" | "reduced" | "minimal" | string;
  readonly targetPosition: readonly [number, number, number];
  readonly hasStatusColorTreatment: boolean;
};

export type ObservedStageConnectionEvidence = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly present: boolean;
  readonly emphasized: boolean;
  readonly opacity: number;
};

export type ObservedStageContextEvidence = {
  readonly contextId: string;
  readonly subjectId: string;
  readonly kind: string;
  readonly role: string;
  readonly present: boolean;
  readonly opacity: number;
  readonly scale: number;
  readonly focused: boolean;
};

export type ObservedStageCameraEvidence = {
  readonly mode: "overview" | "focus" | string;
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
  readonly focusedObjectId: string | null;
};

export type ObservedStageVisualEvidence = {
  readonly evidenceKind: VisualRealityEvidenceKind;
  readonly objects: readonly ObservedStageObjectEvidence[];
  readonly connections: readonly ObservedStageConnectionEvidence[];
  readonly contextNodes: readonly ObservedStageContextEvidence[];
  readonly camera: ObservedStageCameraEvidence;
  readonly instrumentationMarkers: readonly string[];
};

export type CanonicalRelationshipEdge = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type CanonicalNonEdgePair = {
  readonly sourceId: string;
  readonly targetId: string;
  readonly reason: string;
};

export type DataRealityAuditSubjectDescriptor = {
  readonly subjectId: string;
  readonly objectKey: string;
  readonly caption: string;
  readonly stageObjectId: string | null;
  readonly alignment: "exact" | "semantic-approximate" | "missing";
};

/** Certified Executive Operations subjects for NEX-MVP Stage audit. */
export const DATA_REALITY_VISUAL_STAGE_AUDIT_SUBJECTS: readonly DataRealityAuditSubjectDescriptor[] =
  Object.freeze([
    Object.freeze({
      subjectId: "revenue",
      objectKey: "revenue",
      caption: "Revenue",
      stageObjectId: "obj-revenue",
      alignment: "exact" as const,
    }),
    Object.freeze({
      subjectId: "production",
      objectKey: "production",
      caption: "Production/Capacity",
      stageObjectId: "obj-capacity",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      subjectId: "warehouse",
      objectKey: "warehouse",
      caption: "Inventory",
      stageObjectId: "obj-inventory",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      subjectId: "shipping",
      objectKey: "shipping",
      caption: "Delivery",
      stageObjectId: "obj-delivery",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      subjectId: "customer",
      objectKey: "customer",
      caption: "Customer",
      stageObjectId: "obj-customer",
      alignment: "exact" as const,
    }),
    Object.freeze({
      subjectId: "cost",
      objectKey: "cost",
      caption: "Cost",
      stageObjectId: null,
      alignment: "missing" as const,
    }),
  ]);

/** Simultaneous attention must never invent this edge. */
export const DATA_REALITY_VISUAL_STAGE_CANONICAL_NON_EDGES: readonly CanonicalNonEdgePair[] =
  Object.freeze([
    Object.freeze({
      sourceId: "obj-revenue",
      targetId: "obj-capacity",
      reason: "Simultaneous attention is not a canonical relationship",
    }),
  ]);

// ─── Finding / summary contracts ────────────────────────────────────────────

export type VisualRealityAuditFinding = {
  readonly findingId: string;
  readonly subjectId: string;
  readonly dimension: VisualRealityAuditDimension;
  readonly expectedState: unknown;
  readonly observedState: unknown;
  readonly status: VisualRealityAuditStatus;
  readonly severity: VisualRealityAuditSeverity;
  readonly evidenceKind: VisualRealityEvidenceKind;
  readonly evidence: readonly string[];
  readonly recommendation?: string;
};

export type VisualRealityAuditSummary = {
  readonly totalSubjectsAudited: number;
  readonly totalFindings: number;
  readonly visibleAndConsistentCount: number;
  readonly visibleButWeakCount: number;
  readonly computedButNotVisibleCount: number;
  readonly visuallyMisleadingCount: number;
  readonly unresolvedAsDesignedCount: number;
  readonly notApplicableCount: number;
  readonly blockerCount: number;
  readonly highCount: number;
  readonly mediumCount: number;
  readonly lowCount: number;
  readonly byDimension: Readonly<
    Record<VisualRealityAuditDimension, number>
  >;
};

export type DataRealityVisualStageAuditProvenance = {
  readonly auditIdentity: "P2:8.1/DataRealityVisualStageAudit";
  readonly auditVersion: "2.8.1";
  readonly auditNamespace: "nexora.data-reality.visual-stage-audit";
  readonly auditPhase: "VisualRealityAudit";
  readonly auditCertified: false;
  readonly chain: typeof DATA_REALITY_VISUAL_STAGE_AUDIT_PROVENANCE_CHAIN;
  readonly stageBindingSource: typeof dataRealityAwareStageExperienceBindingIdentity;
  readonly stageBindingVersion: typeof dataRealityAwareStageExperienceBindingVersion;
  readonly stageBindingNamespace: typeof dataRealityAwareStageExperienceBindingNamespace;
  readonly focusAttentionSource: typeof dataRealityAwareFocusAttentionExperienceIdentity;
  readonly focusAttentionVersion: typeof dataRealityAwareFocusAttentionExperienceVersion;
  readonly focusAttentionNamespace: typeof dataRealityAwareFocusAttentionExperienceNamespace;
  readonly choreographySource: typeof dataRealityAwareSceneChoreographyIdentity;
  readonly choreographyVersion: typeof dataRealityAwareSceneChoreographyVersion;
  readonly choreographyNamespace: typeof dataRealityAwareSceneChoreographyNamespace;
  readonly connectionsContextSource: typeof dataRealityAwareConnectionsContextIdentity;
  readonly connectionsContextVersion: typeof dataRealityAwareConnectionsContextVersion;
  readonly connectionsContextNamespace: typeof dataRealityAwareConnectionsContextNamespace;
  readonly datasetId: string;
};

export type DataRealityVisualStageAuditResult = {
  readonly auditId: string;
  readonly identity: DataRealityVisualStageAuditIdentity;
  readonly scenario: string;
  readonly interactionMode: "overview" | "focus" | string;
  readonly anchorObjectId?: string;
  readonly findings: readonly VisualRealityAuditFinding[];
  readonly summary: VisualRealityAuditSummary;
  readonly blockersForP282: readonly VisualRealityAuditFinding[];
  readonly knownLimitations: readonly string[];
  readonly provenance: DataRealityVisualStageAuditProvenance;
};

export type AuditDataRealityVisualStageInput = {
  readonly scenario: string;
  readonly interactionMode: "overview" | "focus" | string;
  readonly stageBinding: DataRealityAwareStageBindingResult;
  readonly focusAttention: DataRealityAwareFocusAttentionExperienceResult;
  readonly choreography: DataRealityAwareSceneChoreographyResult;
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
  readonly observed: ObservedStageVisualEvidence;
  readonly canonicalRelationships: readonly CanonicalRelationshipEdge[];
  readonly subjects?: readonly DataRealityAuditSubjectDescriptor[];
  readonly nonEdgePairs?: readonly CanonicalNonEdgePair[];
};

// ─── Classification helpers (pure; testable) ────────────────────────────────

export type CompareExecutiveStateVisibilityInput = {
  readonly expectedMvpStatus: string | undefined;
  readonly expectedMvpAttention: string | undefined;
  readonly expectedUnresolved: boolean;
  readonly hasStageObject: boolean;
  readonly observed: ObservedStageObjectEvidence | undefined;
  readonly stageObjectMissingByDesign: boolean;
};

/**
 * Compare expected executive/MVP state with observed Stage presentation.
 * Distinguishes missing treatment from weak treatment from contradiction.
 */
export function compareExecutiveStateVisibility(
  input: CompareExecutiveStateVisibilityInput,
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
} {
  if (input.stageObjectMissingByDesign || input.expectedUnresolved) {
    if (!input.hasStageObject) {
      return Object.freeze({
        status: "unresolved-as-designed" as const,
        evidence: Object.freeze([
          "No Stage object identity for unresolved/missing subject",
          "Canonical non-fabrication preserved",
        ]),
      });
    }
  }

  if (!input.hasStageObject || !input.observed) {
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        "Expected Stage subject has no observed Stage object evidence",
      ]),
    });
  }

  const expectedStatus = input.expectedMvpStatus;
  if (expectedStatus === undefined) {
    return Object.freeze({
      status: "unresolved-as-designed" as const,
      evidence: Object.freeze(["No expected MVP status (unresolved path)"]),
    });
  }

  if (input.observed.status !== expectedStatus) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        `Expected status=${expectedStatus}`,
        `Observed status=${input.observed.status}`,
        "Stage status contradicts canonical executive projection",
      ]),
    });
  }

  if (!input.observed.hasStatusColorTreatment) {
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        `Status=${expectedStatus} present structurally`,
        "No mapped status color treatment in Stage visual vocabulary",
      ]),
    });
  }

  const expectedAttention = input.expectedMvpAttention ?? "normal";
  if (
    input.observed.attention !== expectedAttention &&
    expectedAttention !== "normal"
  ) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        `Expected attention=${expectedAttention}`,
        `Observed attention=${input.observed.attention}`,
      ]),
    });
  }

  const attentionIsElevated =
    expectedAttention === "critical" ||
    expectedAttention === "important" ||
    expectedAttention === "elevated";

  if (attentionIsElevated) {
    const scaleFloor =
      expectedAttention === "critical"
        ? 1.08
        : expectedAttention === "important"
          ? 1.04
          : 1.02;
    const emissiveFloor =
      expectedAttention === "critical"
        ? 0.28
        : expectedAttention === "important"
          ? 0.18
          : 0.1;
    const weakScale = input.observed.scale < scaleFloor;
    const weakEmissive = input.observed.emissiveIntensity < emissiveFloor;
    if (weakScale && weakEmissive && input.observed.role === "unrelated") {
      return Object.freeze({
        status: "computed-but-not-visible" as const,
        evidence: Object.freeze([
          `Attention=${expectedAttention} retained in runtime`,
          `Observed scale=${input.observed.scale} opacity=${input.observed.opacity} emissive=${input.observed.emissiveIntensity}`,
          "Background treatment effectively hides elevated attention",
        ]),
      });
    }
    if (weakScale || weakEmissive) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          `Status color for ${expectedStatus} is present`,
          `Attention=${expectedAttention} scale=${input.observed.scale} emissive=${input.observed.emissiveIntensity}`,
          "Elevated attention differentiation is weak relative to severity",
        ]),
      });
    }
  }

  return Object.freeze({
    status: "visible-and-consistent" as const,
    evidence: Object.freeze([
      `Observed status=${input.observed.status} matches expected`,
      `Observed attention=${input.observed.attention}`,
      `Status color treatment present (${STAGE_STATUS_VISUAL_TREATMENTS[expectedStatus as keyof typeof STAGE_STATUS_VISUAL_TREATMENTS] ?? "unknown"})`,
      "Structural evidence only — human perception not auto-certified",
    ]),
  });
}

export type CompareAttentionVisibilityInput = {
  readonly expectedAttention: string;
  readonly retainAttention: boolean;
  readonly isAnchor: boolean;
  readonly observed: ObservedStageObjectEvidence | undefined;
};

export function compareAttentionVisibility(
  input: CompareAttentionVisibilityInput,
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
} {
  if (!input.observed) {
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze(["No observed object for attention audit"]),
    });
  }

  if (input.isAnchor) {
    if (
      input.observed.focused &&
      input.observed.role === "focused" &&
      input.observed.scale >= 1.15
    ) {
      return Object.freeze({
        status: "visible-and-consistent" as const,
        evidence: Object.freeze([
          "Anchor role focused with elevated scale",
          `scale=${input.observed.scale} emissive=${input.observed.emissiveIntensity}`,
        ]),
      });
    }
    if (input.observed.focused) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          "Anchor flagged focused but emphasis cues are weak",
          `role=${input.observed.role} scale=${input.observed.scale}`,
        ]),
      });
    }
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        "Runtime marks object as anchor but Stage presentation is not focused",
      ]),
    });
  }

  const elevated =
    input.expectedAttention === "critical" ||
    input.expectedAttention === "important" ||
    input.retainAttention;

  if (!elevated) {
    return Object.freeze({
      status: "visible-and-consistent" as const,
      evidence: Object.freeze([
        `Attention=${input.expectedAttention} with no elevated retention requirement`,
      ]),
    });
  }

  if (input.observed.role === "unrelated" && input.observed.opacity < 0.4) {
    if (input.retainAttention && input.observed.opacity >= 0.5) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          "Retained attention opacity floor applied but still competing with background",
          `opacity=${input.observed.opacity}`,
        ]),
      });
    }
    if (input.retainAttention) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          "retainAttention requested",
          `opacity=${input.observed.opacity} label=${input.observed.labelProminence}`,
          "Competing attention may be hard to discover under focus dimming",
        ]),
      });
    }
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        `Elevated attention=${input.expectedAttention} but role=unrelated opacity=${input.observed.opacity}`,
      ]),
    });
  }

  if (
    input.observed.attention === input.expectedAttention ||
    input.retainAttention
  ) {
    if (
      input.expectedAttention === "critical" &&
      input.observed.emissiveIntensity < 0.25 &&
      input.observed.role !== "focused"
    ) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          "Critical attention present with muted emissive treatment",
          `emissive=${input.observed.emissiveIntensity}`,
        ]),
      });
    }
    return Object.freeze({
      status: "visible-and-consistent" as const,
      evidence: Object.freeze([
        `Attention=${input.observed.attention} opacity=${input.observed.opacity} scale=${input.observed.scale}`,
      ]),
    });
  }

  return Object.freeze({
    status: "visually-misleading" as const,
    evidence: Object.freeze([
      `Expected attention=${input.expectedAttention}`,
      `Observed attention=${input.observed.attention}`,
    ]),
  });
}

export type CompareAnchorFocusVisibilityInput = {
  readonly expectedAnchorId: string | undefined;
  readonly observedFocusedId: string | null;
  readonly observedAnchor: ObservedStageObjectEvidence | undefined;
  readonly backgroundObjects: readonly ObservedStageObjectEvidence[];
  readonly retainedObjectIds: readonly string[];
};

export function compareAnchorFocusVisibility(
  input: CompareAnchorFocusVisibilityInput,
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
} {
  if (input.expectedAnchorId === undefined) {
    if (
      input.observedFocusedId == null &&
      input.backgroundObjects.every((entry) => entry.role === "normal")
    ) {
      return Object.freeze({
        status: "visible-and-consistent" as const,
        evidence: Object.freeze([
          "Overview mode: no anchor expected; objects remain normal roles",
        ]),
      });
    }
    if (input.observedFocusedId != null) {
      return Object.freeze({
        status: "visually-misleading" as const,
        evidence: Object.freeze([
          "No P2:6 anchor but Stage reports a focused object",
          `focused=${input.observedFocusedId}`,
        ]),
      });
    }
    return Object.freeze({
      status: "not-applicable" as const,
      evidence: Object.freeze(["No active P2:6 anchor in this interaction"]),
    });
  }

  if (input.observedFocusedId !== input.expectedAnchorId) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        `Expected anchor=${input.expectedAnchorId}`,
        `Observed focused=${input.observedFocusedId ?? "none"}`,
      ]),
    });
  }

  if (!input.observedAnchor?.focused || input.observedAnchor.role !== "focused") {
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        `Anchor identity ${input.expectedAnchorId} matches focused id`,
        "Observed object lacks focused role/flag visual consequence",
      ]),
    });
  }

  const retained = new Set(input.retainedObjectIds);
  const nonRetainedBackgroundOk = input.backgroundObjects
    .filter((entry) => !retained.has(entry.objectId))
    .every(
      (entry) =>
        entry.role === "unrelated" &&
        !entry.focused &&
        entry.opacity <= 0.35,
    );
  const retainedBackgroundOk = input.backgroundObjects
    .filter((entry) => retained.has(entry.objectId))
    .every(
      (entry) =>
        entry.role === "unrelated" &&
        !entry.focused &&
        entry.selected !== true,
    );
  const radial = Math.hypot(
    input.observedAnchor.targetPosition[0],
    input.observedAnchor.targetPosition[2],
  );
  const anchorOwnsSpace =
    input.observedAnchor.scale >= 1.28 &&
    radial <= 0.45 &&
    input.observedAnchor.targetPosition[1] >= 0.25;

  if (!nonRetainedBackgroundOk) {
    return Object.freeze({
      status: "visible-but-weak" as const,
      evidence: Object.freeze([
        "Anchor is focused",
        "Non-retained background subjects remain insufficiently deemphasized",
      ]),
    });
  }

  if (!retainedBackgroundOk) {
    return Object.freeze({
      status: "visible-but-weak" as const,
      evidence: Object.freeze([
        "Anchor is focused",
        "Retained competing-attention subjects incorrectly appear focused/selected",
      ]),
    });
  }

  if (!anchorOwnsSpace) {
    return Object.freeze({
      status: "visible-but-weak" as const,
      evidence: Object.freeze([
        "Anchor is focused",
        "Spatial ownership of Stage center is weak relative to competing attention",
        `scale=${input.observedAnchor.scale} radial=${radial.toFixed(3)}`,
      ]),
    });
  }

  return Object.freeze({
    status: "visible-and-consistent" as const,
    evidence: Object.freeze([
      `Anchor ${input.expectedAnchorId} owns interaction focus spatially`,
      `scale=${input.observedAnchor.scale} radial=${radial.toFixed(3)} y=${input.observedAnchor.targetPosition[1]}`,
      "Non-retained background deemphasized; retained competing attention discoverable but unfocused",
      "Structural evidence — manual visual confirmation still required",
    ]),
  });
}

export type CompareConnectionVisibilityInput = {
  readonly expected: {
    readonly connectionId: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly isRevealed: boolean;
    readonly isForeground: boolean;
    readonly isBackground: boolean;
    readonly impliesCausality: boolean;
  };
  readonly observed: ObservedStageConnectionEvidence | undefined;
};

export function compareConnectionVisibility(
  input: CompareConnectionVisibilityInput,
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
} {
  if (input.expected.impliesCausality) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        "Connection incorrectly implies causality — forbidden by P2:7",
      ]),
    });
  }

  if (!input.observed?.present) {
    if (input.expected.isRevealed) {
      return Object.freeze({
        status: "computed-but-not-visible" as const,
        evidence: Object.freeze([
          `Revealed connection ${input.expected.connectionId} missing from Stage presentation`,
        ]),
      });
    }
    return Object.freeze({
      status: "not-applicable" as const,
      evidence: Object.freeze(["Non-revealed connection not required on Stage"]),
    });
  }

  if (input.expected.isForeground || input.expected.isRevealed) {
    if (input.observed.emphasized || input.observed.opacity >= 0.5) {
      return Object.freeze({
        status: "visible-and-consistent" as const,
        evidence: Object.freeze([
          `Connection ${input.expected.connectionId} rendered`,
          `emphasized=${input.observed.emphasized} opacity=${input.observed.opacity}`,
          "Direction/causality not asserted by presentation",
        ]),
      });
    }
    if (input.observed.opacity >= 0.2) {
      return Object.freeze({
        status: "visible-but-weak" as const,
        evidence: Object.freeze([
          "Canonical revealed edge is present but weakly emphasized",
          `opacity=${input.observed.opacity}`,
        ]),
      });
    }
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        "Revealed connection present at near-invisible opacity",
        `opacity=${input.observed.opacity}`,
      ]),
    });
  }

  if (input.expected.isBackground && input.observed.opacity > 0.25) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        "Background connection remains visually competitive",
        `opacity=${input.observed.opacity}`,
      ]),
    });
  }

  return Object.freeze({
    status: "visible-and-consistent" as const,
    evidence: Object.freeze([
      `Connection ${input.expected.connectionId} background treatment opacity=${input.observed.opacity}`,
    ]),
  });
}

export function assertCanonicalNonEdgesPreserved(
  observedConnections: readonly ObservedStageConnectionEvidence[],
  nonEdgePairs: readonly CanonicalNonEdgePair[],
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
  readonly fabricated: readonly string[];
} {
  const fabricated: string[] = [];
  for (const pair of nonEdgePairs) {
    const hit = observedConnections.find(
      (edge) =>
        edge.present &&
        ((edge.sourceId === pair.sourceId &&
          edge.targetId === pair.targetId) ||
          (edge.sourceId === pair.targetId &&
            edge.targetId === pair.sourceId)),
    );
    if (hit) fabricated.push(hit.connectionId);
  }
  if (fabricated.length > 0) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        "Canonical non-edge appeared on Stage",
        ...fabricated.map((id) => `fabricated:${id}`),
      ]),
      fabricated: Object.freeze(fabricated),
    });
  }
  return Object.freeze({
    status: "visible-and-consistent" as const,
    evidence: Object.freeze([
      "Canonical non-edges remain absent from Stage connections",
      ...nonEdgePairs.map(
        (pair) => `non-edge:${pair.sourceId}<->${pair.targetId}`,
      ),
    ]),
    fabricated: Object.freeze([]),
  });
}

export type CompareContextRevealVisibilityInput = {
  readonly revealDepthHops: number;
  readonly maxDirectContextItems: number;
  readonly expectedItems: readonly {
    readonly contextId: string;
    readonly revealRole: string;
    readonly isDirect: boolean;
  }[];
  readonly observed: readonly ObservedStageContextEvidence[];
};

export function compareContextRevealVisibility(
  input: CompareContextRevealVisibilityInput,
): {
  readonly status: VisualRealityAuditStatus;
  readonly evidence: readonly string[];
} {
  if (input.revealDepthHops !== 1) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        `Context reveal depth ${input.revealDepthHops} exceeds approved 1-hop`,
      ]),
    });
  }

  const directExpected = input.expectedItems.filter(
    (entry) => entry.revealRole === "direct-context" || entry.isDirect,
  );
  const hiddenExpected = input.expectedItems.filter(
    (entry) => entry.revealRole === "hidden",
  );

  const missingDirect: string[] = [];
  const weakDirect: string[] = [];
  for (const item of directExpected) {
    const obs = input.observed.find(
      (entry) =>
        entry.contextId === item.contextId ||
        entry.subjectId === item.contextId,
    );
    if (!obs?.present || obs.opacity < 0.2) {
      missingDirect.push(item.contextId);
    } else if (obs.opacity < 0.7) {
      weakDirect.push(item.contextId);
    }
  }

  const leakedHidden = hiddenExpected.filter((item) => {
    const obs = input.observed.find(
      (entry) =>
        entry.contextId === item.contextId ||
        entry.subjectId === item.contextId,
    );
    return obs != null && obs.opacity > 0.2;
  });

  if (missingDirect.length > 0) {
    return Object.freeze({
      status: "computed-but-not-visible" as const,
      evidence: Object.freeze([
        "Direct 1-hop context not observable",
        ...missingDirect.map((id) => `missing-context:${id}`),
      ]),
    });
  }

  if (leakedHidden.length > 0) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        "Hidden overflow context remains visually prominent",
        ...leakedHidden.map((entry) => `leaked:${entry.contextId}`),
      ]),
    });
  }

  if (directExpected.length > input.maxDirectContextItems) {
    return Object.freeze({
      status: "visually-misleading" as const,
      evidence: Object.freeze([
        `Direct context count ${directExpected.length} exceeds max ${input.maxDirectContextItems}`,
      ]),
    });
  }

  if (weakDirect.length > 0) {
    return Object.freeze({
      status: "visible-but-weak" as const,
      evidence: Object.freeze([
        "Direct context present but association/emphasis is weak",
        ...weakDirect.map((id) => `weak-context:${id}`),
        "revealDepthHops=1 preserved",
      ]),
    });
  }

  return Object.freeze({
    status: "visible-and-consistent" as const,
    evidence: Object.freeze([
      `Direct context count=${directExpected.length}`,
      `Hidden overflow count=${hiddenExpected.length}`,
      "revealDepthHops=1 preserved",
      "Context remains distinct from canonical Stage object identities",
    ]),
  });
}

// ─── Severity mapping ───────────────────────────────────────────────────────

function severityFor(
  status: VisualRealityAuditStatus,
  dimension: VisualRealityAuditDimension,
  options?: { readonly critical?: boolean },
): VisualRealityAuditSeverity {
  if (status === "visually-misleading") {
    if (
      dimension === "executive-state" ||
      dimension === "connections" ||
      dimension === "focus-anchor" ||
      options?.critical
    ) {
      return "blocker";
    }
    return "high";
  }
  if (status === "computed-but-not-visible") {
    if (
      options?.critical ||
      dimension === "executive-state" ||
      dimension === "attention" ||
      dimension === "focus-anchor"
    ) {
      return "high";
    }
    return "medium";
  }
  if (status === "visible-but-weak") {
    if (dimension === "density" || dimension === "camera-spatial") {
      return "medium";
    }
    return "medium";
  }
  if (status === "unresolved-as-designed" || status === "not-applicable") {
    return "low";
  }
  return "low";
}

function countStatus(
  findings: readonly VisualRealityAuditFinding[],
  status: VisualRealityAuditStatus,
): number {
  return findings.filter((entry) => entry.status === status).length;
}

function countSeverity(
  findings: readonly VisualRealityAuditFinding[],
  severity: VisualRealityAuditSeverity,
): number {
  return findings.filter((entry) => entry.severity === severity).length;
}

export function summarizeVisualRealityAudit(
  findings: readonly VisualRealityAuditFinding[],
  totalSubjectsAudited: number,
): VisualRealityAuditSummary {
  const byDimension = Object.fromEntries(
    VISUAL_REALITY_AUDIT_DIMENSIONS.map((dimension) => [
      dimension,
      findings.filter((entry) => entry.dimension === dimension).length,
    ]),
  ) as Record<VisualRealityAuditDimension, number>;

  return Object.freeze({
    totalSubjectsAudited,
    totalFindings: findings.length,
    visibleAndConsistentCount: countStatus(findings, "visible-and-consistent"),
    visibleButWeakCount: countStatus(findings, "visible-but-weak"),
    computedButNotVisibleCount: countStatus(
      findings,
      "computed-but-not-visible",
    ),
    visuallyMisleadingCount: countStatus(findings, "visually-misleading"),
    unresolvedAsDesignedCount: countStatus(findings, "unresolved-as-designed"),
    notApplicableCount: countStatus(findings, "not-applicable"),
    blockerCount: countSeverity(findings, "blocker"),
    highCount: countSeverity(findings, "high"),
    mediumCount: countSeverity(findings, "medium"),
    lowCount: countSeverity(findings, "low"),
    byDimension: Object.freeze(byDimension),
  });
}

export function groupVisualRealityFindingsByDimension(
  findings: readonly VisualRealityAuditFinding[],
): Readonly<Record<VisualRealityAuditDimension, readonly VisualRealityAuditFinding[]>> {
  const grouped = Object.fromEntries(
    VISUAL_REALITY_AUDIT_DIMENSIONS.map((dimension) => [dimension, [] as VisualRealityAuditFinding[]]),
  ) as Record<VisualRealityAuditDimension, VisualRealityAuditFinding[]>;

  for (const finding of findings) {
    grouped[finding.dimension].push(finding);
  }

  return Object.freeze(
    Object.fromEntries(
      VISUAL_REALITY_AUDIT_DIMENSIONS.map((dimension) => [
        dimension,
        Object.freeze(grouped[dimension]),
      ]),
    ) as Record<
      VisualRealityAuditDimension,
      readonly VisualRealityAuditFinding[]
    >,
  );
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function pushFinding(
  findings: VisualRealityAuditFinding[],
  finding: Omit<VisualRealityAuditFinding, "findingId"> & {
    readonly findingId?: string;
  },
): void {
  const findingId =
    finding.findingId ??
    `${finding.dimension}:${finding.subjectId}:${finding.status}`;
  findings.push(
    Object.freeze({
      findingId,
      subjectId: finding.subjectId,
      dimension: finding.dimension,
      expectedState: finding.expectedState,
      observedState: finding.observedState,
      status: finding.status,
      severity: finding.severity,
      evidenceKind: finding.evidenceKind,
      evidence: Object.freeze([...finding.evidence]),
      ...(finding.recommendation !== undefined
        ? { recommendation: finding.recommendation }
        : {}),
    }),
  );
}

function hasStatusColorTreatment(status: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    STAGE_STATUS_VISUAL_TREATMENTS,
    status,
  );
}

// ─── Main audit ─────────────────────────────────────────────────────────────

/**
 * Audit canonical Data Reality / P2:5–P2:7 outputs against observed Stage
 * structural presentation evidence. Does not claim human visual certification.
 */
export function auditDataRealityVisualStage(
  input: AuditDataRealityVisualStageInput,
): DataRealityVisualStageAuditResult {
  const subjects =
    input.subjects ?? DATA_REALITY_VISUAL_STAGE_AUDIT_SUBJECTS;
  const nonEdgePairs =
    input.nonEdgePairs ?? DATA_REALITY_VISUAL_STAGE_CANONICAL_NON_EDGES;
  const findings: VisualRealityAuditFinding[] = [];
  const observedById = new Map(
    input.observed.objects.map((entry) => [entry.objectId, entry]),
  );
  const bindingById = new Map(
    input.stageBinding.objects.map((entry) => [entry.objectId, entry]),
  );
  const choreographyById = new Map(
    input.choreography.objects.map((entry) => [entry.objectId, entry]),
  );
  const connectionObservedById = new Map(
    input.observed.connections.map((entry) => [entry.connectionId, entry]),
  );

  // A. Object presence + B. Executive state + C. Attention
  for (const subject of subjects) {
    const stageId = subject.stageObjectId;
    if (stageId == null) {
      pushFinding(findings, {
        subjectId: subject.subjectId,
        dimension: "object-presence",
        expectedState: {
          objectKey: subject.objectKey,
          stageObjectId: null,
          alignment: subject.alignment,
        },
        observedState: { present: false },
        status: "unresolved-as-designed",
        severity: "low",
        evidenceKind: "structural",
        evidence: [
          `${subject.caption} has no MVP Stage identity by design`,
          "Cost/unmapped subjects must not be fabricated onto Stage",
        ],
        recommendation:
          "Keep unresolved; do not invent a Stage object for visual completeness",
      });
      pushFinding(findings, {
        subjectId: subject.subjectId,
        dimension: "executive-state",
        expectedState: { unresolved: true, hasKPI: false },
        observedState: { stageObjectId: null },
        status: "unresolved-as-designed",
        severity: "low",
        evidenceKind: "structural",
        evidence: [
          "No KPI/executive state Stage projection for missing identity",
        ],
      });
      continue;
    }

    const observed = observedById.get(stageId);
    const binding = bindingById.get(stageId);
    const choreography = choreographyById.get(stageId);

    pushFinding(findings, {
      subjectId: subject.subjectId,
      dimension: "object-presence",
      expectedState: {
        stageObjectId: stageId,
        alignment: subject.alignment,
        shouldRender: true,
      },
      observedState: observed
        ? {
            present: observed.present,
            role: observed.role,
            opacity: observed.opacity,
          }
        : { present: false },
      status: observed?.present
        ? observed.opacity <= 0.05
          ? "computed-but-not-visible"
          : "visible-and-consistent"
        : "computed-but-not-visible",
      severity: observed?.present
        ? observed.opacity <= 0.05
          ? "high"
          : "low"
        : "blocker",
      evidenceKind: "structural",
      evidence: observed?.present
        ? [
            `Stage object ${stageId} present`,
            `role=${observed.role} opacity=${observed.opacity}`,
            subject.alignment === "semantic-approximate"
              ? "Semantic Stage identity adapter (not identity equivalence)"
              : "Exact Stage identity alignment",
          ]
        : [`Expected Stage object ${stageId} missing from presentation`],
      recommendation: observed?.present
        ? undefined
        : "Restore Stage catalog presence for certified Data Reality subject",
    });

    const stateCompare = compareExecutiveStateVisibility({
      expectedMvpStatus: binding?.mvpStatus,
      expectedMvpAttention: binding?.mvpAttention,
      expectedUnresolved: binding?.isUnresolved === true,
      hasStageObject: observed?.present === true,
      observed,
      stageObjectMissingByDesign: false,
    });
    pushFinding(findings, {
      subjectId: subject.subjectId,
      dimension: "executive-state",
      expectedState: {
        realityState: binding?.realityState,
        mvpStatus: binding?.mvpStatus,
        mvpAttention: binding?.mvpAttention,
        isUnresolved: binding?.isUnresolved ?? false,
        advisorMeaning: binding?.advisorMeaning,
      },
      observedState: observed
        ? {
            status: observed.status,
            attention: observed.attention,
            hasStatusColorTreatment: observed.hasStatusColorTreatment,
            opacity: observed.opacity,
            scale: observed.scale,
            emissiveIntensity: observed.emissiveIntensity,
          }
        : { present: false },
      status: stateCompare.status,
      severity: severityFor(stateCompare.status, "executive-state", {
        critical: binding?.mvpAttention === "critical",
      }),
      evidenceKind: "structural",
      evidence: stateCompare.evidence,
      recommendation:
        stateCompare.status === "visible-and-consistent"
          ? "Manual visual validation still required before P2:8.2 certification"
          : stateCompare.status === "visible-but-weak"
            ? "Strengthen status/attention perceptual differentiation in P2:8.2"
            : "Ensure Stage presentation communicates canonical executive state",
    });

    const attentionCompare = compareAttentionVisibility({
      expectedAttention: binding?.mvpAttention ?? "normal",
      retainAttention: choreography?.retainAttention === true,
      isAnchor: choreography?.isAnchor === true,
      observed,
    });
    pushFinding(findings, {
      subjectId: subject.subjectId,
      dimension: "attention",
      expectedState: {
        mvpAttention: binding?.mvpAttention,
        retainAttention: choreography?.retainAttention === true,
        presentationEmphasis: binding?.presentationEmphasis,
        competing:
          input.focusAttention.presentationGuidance.retainAttentionObjectIds.includes(
            stageId,
          ),
      },
      observedState: observed
        ? {
            attention: observed.attention,
            role: observed.role,
            opacity: observed.opacity,
            scale: observed.scale,
            emissiveIntensity: observed.emissiveIntensity,
            labelProminence: observed.labelProminence,
          }
        : { present: false },
      status: attentionCompare.status,
      severity: severityFor(attentionCompare.status, "attention", {
        critical: binding?.mvpAttention === "critical",
      }),
      evidenceKind: "structural",
      evidence: attentionCompare.evidence,
    });
  }

  // D. Focus / Anchor
  const anchorId = input.choreography.anchorObjectId;
  const observedAnchor = anchorId ? observedById.get(anchorId) : undefined;
  const backgroundObjects = input.observed.objects.filter((entry) => {
    const plan = choreographyById.get(entry.objectId);
    return plan?.isBackground === true;
  });
  const anchorCompare = compareAnchorFocusVisibility({
    expectedAnchorId: anchorId,
    observedFocusedId: input.observed.camera.focusedObjectId,
    observedAnchor,
    backgroundObjects,
    retainedObjectIds: input.choreography.attentionRetention.objectIds,
  });
  pushFinding(findings, {
    subjectId: anchorId ?? "overview",
    dimension: "focus-anchor",
    expectedState: {
      anchorObjectId: anchorId,
      cameraMode: input.choreography.camera.mode,
      retainedAttentionObjectIds:
        input.choreography.attentionRetention.objectIds,
    },
    observedState: {
      focusedObjectId: input.observed.camera.focusedObjectId,
      mode: input.observed.camera.mode,
      anchorRole: observedAnchor?.role,
      anchorFocused: observedAnchor?.focused,
      backgroundCount: backgroundObjects.length,
    },
    status: anchorCompare.status,
    severity: severityFor(anchorCompare.status, "focus-anchor"),
    evidenceKind: "structural",
    evidence: anchorCompare.evidence,
    recommendation:
      anchorCompare.status === "visible-and-consistent"
        ? "Confirm anchor readability under real camera framing in P2:8.2"
        : "Make P2:6 anchor/focus visually obvious without inventing meaning",
  });

  // E. Connections
  for (const connection of input.connectionsContext.connections) {
    const observed = connectionObservedById.get(connection.connectionId);
    const compare = compareConnectionVisibility({
      expected: {
        connectionId: connection.connectionId,
        sourceId: connection.sourceObjectId,
        targetId: connection.targetObjectId,
        isRevealed: connection.isRevealed,
        isForeground: connection.isForeground,
        isBackground: connection.isBackground,
        impliesCausality: connection.impliesCausality,
      },
      observed,
    });
    if (compare.status === "not-applicable") continue;
    pushFinding(findings, {
      subjectId: connection.connectionId,
      dimension: "connections",
      expectedState: {
        sourceObjectId: connection.sourceObjectId,
        targetObjectId: connection.targetObjectId,
        isRevealed: connection.isRevealed,
        emphasis: connection.emphasis,
        impliesCausality: connection.impliesCausality,
      },
      observedState: observed ?? { present: false },
      status: compare.status,
      severity: severityFor(compare.status, "connections"),
      evidenceKind: "structural",
      evidence: compare.evidence,
    });
  }

  const nonEdge = assertCanonicalNonEdgesPreserved(
    input.observed.connections,
    nonEdgePairs,
  );
  const canonicalIds = new Set(
    input.canonicalRelationships.map((entry) => entry.id),
  );
  const unexpectedEdges = input.observed.connections.filter(
    (edge) => edge.present && !canonicalIds.has(edge.connectionId),
  );
  pushFinding(findings, {
    subjectId: "canonical-non-edges",
    dimension: "connections",
    expectedState: {
      nonEdgePairs,
      fabricatedEdgeCount:
        input.connectionsContext.relationshipSummary.fabricatedEdgeCount,
    },
    observedState: {
      fabricated: nonEdge.fabricated,
      unexpectedEdgeIds: unexpectedEdges.map((entry) => entry.connectionId),
    },
    status:
      nonEdge.status === "visible-and-consistent" &&
      unexpectedEdges.length === 0
        ? "visible-and-consistent"
        : "visually-misleading",
    severity:
      nonEdge.status === "visible-and-consistent" &&
      unexpectedEdges.length === 0
        ? "low"
        : "blocker",
    evidenceKind: "structural",
    evidence: Object.freeze([
      ...nonEdge.evidence,
      `P2:7 fabricatedEdgeCount=${input.connectionsContext.relationshipSummary.fabricatedEdgeCount}`,
      ...(unexpectedEdges.length > 0
        ? unexpectedEdges.map(
            (edge) => `unexpected-edge:${edge.connectionId}`,
          )
        : ["No unexpected Stage edges beyond canonical relationship fixtures"]),
    ]),
    recommendation:
      "Never invent Revenue↔Capacity or other non-edges for composition",
  });

  // F. Context reveal
  const contextCompare = compareContextRevealVisibility({
    revealDepthHops:
      input.connectionsContext.relationshipSummary.revealDepthHops,
    maxDirectContextItems:
      input.connectionsContext.relationshipSummary.maxDirectContextItems,
    expectedItems: input.connectionsContext.contextItems.map((entry) =>
      Object.freeze({
        contextId: entry.contextId,
        revealRole: entry.revealRole,
        isDirect: entry.isDirect,
      }),
    ),
    observed: input.observed.contextNodes,
  });
  pushFinding(findings, {
    subjectId: anchorId ?? "overview-context",
    dimension: "context",
    expectedState: {
      revealDepthHops:
        input.connectionsContext.relationshipSummary.revealDepthHops,
      revealedContextIds: input.connectionsContext.revealedContextIds,
      hiddenCount: input.connectionsContext.contextItems.filter(
        (entry) => entry.revealRole === "hidden",
      ).length,
    },
    observedState: {
      contextNodeCount: input.observed.contextNodes.length,
      visibleContextIds: input.observed.contextNodes
        .filter((entry) => entry.opacity >= 0.5)
        .map((entry) => entry.contextId),
    },
    status: contextCompare.status,
    severity: severityFor(contextCompare.status, "context"),
    evidenceKind: "structural",
    evidence: contextCompare.evidence,
    recommendation:
      "Keep context 1-hop; do not let context nodes masquerade as Stage objects",
  });

  // G. Density
  const objectCount = input.observed.objects.length;
  const visibleLabels = input.observed.objects.filter(
    (entry) => entry.labelProminence !== "minimal" && entry.opacity >= 0.4,
  ).length;
  const emphasizedConnections = input.observed.connections.filter(
    (entry) => entry.emphasized || entry.opacity >= 0.5,
  ).length;
  const competingEmphasis = input.observed.objects.filter(
    (entry) =>
      (entry.attention === "critical" || entry.attention === "important") &&
      entry.opacity >= 0.5,
  ).length;
  let densityStatus: VisualRealityAuditStatus = "visible-and-consistent";
  const densityEvidence: string[] = [
    `objectCount=${objectCount}`,
    `visibleLabels=${visibleLabels}`,
    `emphasizedConnections=${emphasizedConnections}`,
    `competingEmphasis=${competingEmphasis}`,
  ];
  if (objectCount > 10 || emphasizedConnections > 6) {
    densityStatus = "visible-but-weak";
    densityEvidence.push("Crowding risk: too many concurrent emphasized elements");
  } else if (
    input.interactionMode === "focus" &&
    competingEmphasis >= 4 &&
    backgroundObjects.some((entry) => entry.opacity < 0.2)
  ) {
    densityStatus = "visible-but-weak";
    densityEvidence.push(
      "Focus mode: competing attention vs heavy dimming creates discoverability tension",
    );
  } else if (visibleLabels >= objectCount && objectCount >= 8) {
    densityStatus = "visible-but-weak";
    densityEvidence.push(
      "All labels prominent in dense Stage — collision/readability risk",
    );
  }
  pushFinding(findings, {
    subjectId: "stage-density",
    dimension: "density",
    expectedState: {
      readableExecutivePopulation: true,
      restrainedConnections: true,
    },
    observedState: {
      objectCount,
      visibleLabels,
      emphasizedConnections,
      competingEmphasis,
    },
    status: densityStatus,
    severity: severityFor(densityStatus, "density"),
    evidenceKind: "visual-perception-pending",
    evidence: Object.freeze(densityEvidence),
    recommendation:
      "Apply P2:8.5 label priority / edge attenuation / camera framing — do not weaken this threshold",
  });

  // H. Camera / spatial
  const camera = input.observed.camera;
  const distance = Math.hypot(
    camera.position[0] - camera.target[0],
    camera.position[1] - camera.target[1],
    camera.position[2] - camera.target[2],
  );
  let cameraStatus: VisualRealityAuditStatus = "visible-and-consistent";
  const cameraEvidence: string[] = [
    `mode=${camera.mode}`,
    `distance=${distance.toFixed(2)}`,
    `fov=${camera.fov}`,
    `focusedObjectId=${camera.focusedObjectId ?? "none"}`,
  ];
  if (anchorId && camera.mode !== "focus") {
    cameraStatus = "computed-but-not-visible";
    cameraEvidence.push("Anchor active but camera mode is not focus");
  } else if (distance > 12.5) {
    cameraStatus = "visible-but-weak";
    cameraEvidence.push("Camera distance may reduce object/relationship readability");
  } else if (distance < 3.5 && camera.mode === "focus") {
    cameraStatus = "visible-but-weak";
    cameraEvidence.push("Camera proximity may clip context/relationships");
  } else if (anchorId && camera.focusedObjectId === anchorId) {
    cameraEvidence.push("Camera focus mode aligned with P2:6 anchor");
    cameraEvidence.push(
      "Spatial readability still requires manual visual inspection",
    );
  }
  pushFinding(findings, {
    subjectId: "stage-camera",
    dimension: "camera-spatial",
    expectedState: {
      cameraMode: input.choreography.camera.mode,
      targetObjectId: input.choreography.camera.targetObjectId,
    },
    observedState: {
      mode: camera.mode,
      position: camera.position,
      target: camera.target,
      fov: camera.fov,
      distance,
    },
    status: cameraStatus,
    severity: severityFor(cameraStatus, "camera-spatial"),
    evidenceKind: "visual-perception-pending",
    evidence: Object.freeze(cameraEvidence),
    recommendation:
      "Do not redesign camera architecture in P2:8.1; validate framing in P2:8.2",
  });

  // Deterministic ordering
  findings.sort((a, b) => {
    const dim =
      VISUAL_REALITY_AUDIT_DIMENSIONS.indexOf(a.dimension) -
      VISUAL_REALITY_AUDIT_DIMENSIONS.indexOf(b.dimension);
    if (dim !== 0) return dim;
    if (a.subjectId === b.subjectId) {
      return a.findingId.localeCompare(b.findingId);
    }
    return a.subjectId.localeCompare(b.subjectId);
  });

  const frozenFindings = Object.freeze(findings.map((entry) => entry));
  const summary = summarizeVisualRealityAudit(
    frozenFindings,
    subjects.length,
  );
  const blockersForP282 = Object.freeze(
    frozenFindings.filter((entry) => entry.severity === "blocker"),
  );

  const auditId = [
    "visual-stage-audit",
    normalizeToken(input.scenario),
    normalizeToken(input.interactionMode),
    normalizeToken(anchorId),
    normalizeToken(input.stageBinding.datasetIdentity.datasetId),
  ].join(":");

  return Object.freeze({
    auditId,
    identity: IDENTITY,
    scenario: input.scenario,
    interactionMode: input.interactionMode,
    ...(anchorId !== undefined ? { anchorObjectId: anchorId } : {}),
    findings: frozenFindings,
    summary,
    blockersForP282,
    knownLimitations: Object.freeze([
      "Structural Stage presentation evidence is not equivalent to human visual perception",
      "Three.js mesh presence / data-* markers / material values do not certify executive readability",
      "Status-color vocabulary proves propagation, not final Nexora executive visual language",
      "Semantic Stage adapters (Production→Capacity, Warehouse→Inventory, Shipping→Delivery) remain approximate",
      "Manual browser validation is required before P2:8.2 Visual State Validation",
    ]),
    provenance: Object.freeze({
      auditIdentity: dataRealityVisualStageAuditIdentity,
      auditVersion: dataRealityVisualStageAuditVersion,
      auditNamespace: dataRealityVisualStageAuditNamespace,
      auditPhase: dataRealityVisualStageAuditPhase,
      auditCertified: false as const,
      chain: DATA_REALITY_VISUAL_STAGE_AUDIT_PROVENANCE_CHAIN,
      stageBindingSource: dataRealityAwareStageExperienceBindingIdentity,
      stageBindingVersion: dataRealityAwareStageExperienceBindingVersion,
      stageBindingNamespace: dataRealityAwareStageExperienceBindingNamespace,
      focusAttentionSource: dataRealityAwareFocusAttentionExperienceIdentity,
      focusAttentionVersion: dataRealityAwareFocusAttentionExperienceVersion,
      focusAttentionNamespace:
        dataRealityAwareFocusAttentionExperienceNamespace,
      choreographySource: dataRealityAwareSceneChoreographyIdentity,
      choreographyVersion: dataRealityAwareSceneChoreographyVersion,
      choreographyNamespace: dataRealityAwareSceneChoreographyNamespace,
      connectionsContextSource: dataRealityAwareConnectionsContextIdentity,
      connectionsContextVersion: dataRealityAwareConnectionsContextVersion,
      connectionsContextNamespace:
        dataRealityAwareConnectionsContextNamespace,
      datasetId: input.stageBinding.datasetIdentity.datasetId,
    }),
  });
}

/**
 * Extract structural observed evidence from Stage interaction presentation.
 * This is NOT a visual-perception certificate.
 */
export function extractObservedStageEvidenceFromPresentation(presentation: {
  readonly scene: {
    readonly mode: string;
    readonly focusedObjectId: string | null;
    readonly objects: readonly {
      readonly id: string;
      readonly label: string;
      readonly role: string;
      readonly status: string;
      readonly attention: string;
      readonly focused: boolean;
      readonly selected: boolean;
      readonly opacity: number;
      readonly scale: number;
      readonly emissiveIntensity: number;
      readonly labelProminence: string;
      readonly targetPosition: readonly [number, number, number];
    }[];
    readonly connections: readonly {
      readonly id: string;
      readonly sourceId: string;
      readonly targetId: string;
      readonly emphasized: boolean;
      readonly opacity: number;
    }[];
    readonly camera: {
      readonly position: readonly [number, number, number];
      readonly target: readonly [number, number, number];
      readonly fov: number;
    };
  };
  readonly contextNodes?: readonly {
    readonly id: string;
    readonly subjectId: string;
    readonly kind: string;
    readonly role: string;
    readonly opacity: number;
    readonly scale: number;
    readonly focused: boolean;
  }[];
}): ObservedStageVisualEvidence {
  const objects = Object.freeze(
    presentation.scene.objects.map(
      (object): ObservedStageObjectEvidence =>
        Object.freeze({
          objectId: object.id,
          label: object.label,
          present: true,
          role: object.role,
          status: object.status,
          attention: object.attention,
          focused: object.focused,
          selected: object.selected,
          opacity: object.opacity,
          scale: object.scale,
          emissiveIntensity: object.emissiveIntensity,
          labelProminence: object.labelProminence,
          targetPosition: object.targetPosition,
          hasStatusColorTreatment: hasStatusColorTreatment(object.status),
        }),
    ),
  );

  const connections = Object.freeze(
    presentation.scene.connections.map(
      (connection): ObservedStageConnectionEvidence =>
        Object.freeze({
          connectionId: connection.id,
          sourceId: connection.sourceId,
          targetId: connection.targetId,
          present: true,
          emphasized: connection.emphasized,
          opacity: connection.opacity,
        }),
    ),
  );

  const contextNodes = Object.freeze(
    (presentation.contextNodes ?? []).map(
      (node): ObservedStageContextEvidence =>
        Object.freeze({
          contextId: node.id,
          subjectId: node.subjectId,
          kind: node.kind,
          role: node.role,
          present: true,
          opacity: node.opacity,
          scale: node.scale,
          focused: node.focused,
        }),
    ),
  );

  const markers = Object.freeze([
    ...objects.map(
      (object) =>
        `object:${object.objectId}:status=${object.status}:attention=${object.attention}:role=${object.role}`,
    ),
    ...connections.map(
      (connection) =>
        `connection:${connection.connectionId}:emphasized=${connection.emphasized}:opacity=${connection.opacity}`,
    ),
    ...contextNodes.map(
      (node) =>
        `context:${node.contextId}:opacity=${node.opacity}:role=${node.role}`,
    ),
    `camera:mode=${presentation.scene.mode}:focused=${presentation.scene.focusedObjectId ?? "none"}`,
  ]);

  return Object.freeze({
    evidenceKind: "structural",
    objects,
    connections,
    contextNodes,
    camera: Object.freeze({
      mode: presentation.scene.mode,
      position: presentation.scene.camera.position,
      target: presentation.scene.camera.target,
      fov: presentation.scene.camera.fov,
      focusedObjectId: presentation.scene.focusedObjectId,
    }),
    instrumentationMarkers: markers,
  });
}
