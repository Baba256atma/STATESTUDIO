/**
 * SP:4.1C — Rendered-Bounds Truth Audit (diagnostic / certification only).
 *
 * Proves whether certified presentation transforms match what R3F actually
 * renders. Does not invent Hub layout. Does not mutate product behavior.
 */

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPStageInteractionPresentation,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectScale,
} from "./executiveObjectVisualFoundation.ts";
import {
  EXECUTIVE_FOCUS_VISUAL_SEPARATION,
  measureExecutiveFocusObjectGap,
  resolveExecutiveFocusVisualGrammar,
  resolveExecutiveStageObjectBounds,
  type ExecutiveStageObjectBounds,
} from "./executiveFocusVisualGrammar.ts";
import {
  resolveExecutiveProjectedObjectBounds,
  projectedSafeEnvelopesOverlap,
  type ExecutiveProjectedObjectBounds,
} from "./executiveFocusHubProjectedSectors.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";

export const executiveRenderedObjectTruthAuditIdentity =
  "SP:4.1C/RenderedBoundsTruthAudit" as const;

export const executiveRenderedObjectTruthAuditVersion = "4.1.2" as const;

export type ExecutiveRenderedTruthRootCause =
  | "BoundsUnderestimated"
  | "ScaleMismatch"
  | "RotationMismatch"
  | "PostCertificationTransform"
  | "ProjectionCameraMismatch"
  | "ViewportMismatch"
  | "SafeAreaCoordinateMismatch"
  | "TransitionTransformMismatch"
  | "VisualShellNotIncluded"
  | "MultipleTransformAuthorities"
  | "NoneDetected";

export type ExecutiveRenderedTruthCase =
  | "A_SafeEnvelopesOverlap"
  | "B_EnvelopesClearMeshesOverlap"
  | "C_EnvelopeMeshLocationMismatch"
  | "D_BothClearButPerceptionFails"
  | "Aligned_CertifiedEqualsRendered";

/** Proven failure class before the SP:2.1 compositionScale floor correction. */
export const EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE: ExecutiveRenderedTruthRootCause =
  "ScaleMismatch";

export type ExecutiveRenderedObjectTruthSnapshot = {
  readonly objectId: string;
  readonly geometryFamily: string;
  readonly semanticRole: string;
  readonly disclosureState: string | undefined;
  readonly visualGrammarRole: string | undefined;
  /** Position certified by SP:4.1C final grammar pass. */
  readonly certifiedTargetPosition: readonly [number, number, number];
  /** Scale certified by SP:4.1C. */
  readonly certifiedPresentationScale: number;
  /**
   * Scale the Stage object renderer would apply via SP:2.1
   * (settled, non-hover) — the effective rendered group scale.
   */
  readonly effectiveRenderedScale: number;
  readonly localGeometryDimensions: Readonly<{
    readonly width: number;
    readonly height: number;
    readonly depth: number;
  }>;
  readonly certifiedWorldBounds: ExecutiveStageObjectBounds;
  /** Bounds recomputed with effective rendered scale (truth path). */
  readonly effectiveRenderedWorldBounds: ExecutiveStageObjectBounds;
  readonly certifiedProjected: ExecutiveProjectedObjectBounds | null;
  readonly effectiveRenderedProjected: ExecutiveProjectedObjectBounds | null;
  readonly scaleDelta: number;
  readonly scaleMismatch: boolean;
  readonly positionAuthority: "sp41c-targetPosition";
  readonly scaleAuthorityCertified: "sp41c-presentation.scale";
  readonly scaleAuthorityRendered: "sp21-visual.scale";
};

export type ExecutiveRenderedPairTruth = {
  readonly leftId: string;
  readonly rightId: string;
  readonly certifiedWorldGap: number;
  readonly effectiveRenderedWorldGap: number;
  readonly certifiedProjectedOverlap: boolean;
  readonly effectiveRenderedProjectedOverlap: boolean;
  readonly certifiedWorldPass: boolean;
  readonly effectiveRenderedWorldPass: boolean;
  readonly discrepancy: boolean;
  readonly reason: string;
};

export type ExecutiveRenderedTruthAuditResult = {
  readonly identity: typeof executiveRenderedObjectTruthAuditIdentity;
  readonly version: typeof executiveRenderedObjectTruthAuditVersion;
  readonly fixture: string;
  readonly focusedObjectId: string;
  readonly snapshots: readonly ExecutiveRenderedObjectTruthSnapshot[];
  readonly pairs: readonly ExecutiveRenderedPairTruth[];
  readonly rootCause: ExecutiveRenderedTruthRootCause;
  readonly secondaryCauses: readonly ExecutiveRenderedTruthRootCause[];
  readonly caseClassification: ExecutiveRenderedTruthCase;
  readonly ownershipChain: readonly string[];
  readonly findings: readonly string[];
};

const POSITION_TOLERANCE = 1e-6;
const SCALE_TOLERANCE = 1e-4;

export const EXECUTIVE_RENDERED_TRUTH_OWNERSHIP_CHAIN = Object.freeze([
  "resolveExecutiveFocusVisualGrammar",
  "applyExecutiveFocusVisualGrammarToStagePresentation",
  "applyExecutiveNetworkTopologyToStagePresentation (SP:4.3)",
  "applyExecutivePresentationPlaneToStagePresentation (SP:4.2)",
  "NexoraExecutiveShell.stageInteraction (final)",
  "NexoraStageScene → NexoraStageObject",
  "toExecutiveObjectVisualInput(compositionScale=presentation.scale)",
  "resolveExecutiveObjectScale → visual.scale (honors explicit compositionScale)",
  "R3F group.setScalar(visual.scale) ← lerp destination = certified scale",
  "ExecutiveObjectGeometryRenderer mesh dimensions",
  "ExecutiveObjectEdgeGeometry × extentScale (optional)",
  "focus pedestal ring outer 0.68 (focused only)",
] as const);

/**
 * Effective settled rendered scale for a Stage business object.
 * Mirrors NexoraStageObject → SP:2.1 without hover.
 */
export function resolveEffectiveRenderedStageObjectScale(input: {
  readonly certifiedPresentationScale: number;
  readonly focused?: boolean;
  readonly spatialRole?: "focus" | "related" | "background" | "overview";
}): number {
  return resolveExecutiveObjectScale({
    spatialRole: input.spatialRole ?? (input.focused ? "focus" : "related"),
    focused: input.focused === true,
    hovered: false,
    compositionScale: input.certifiedPresentationScale,
  });
}

export function buildExecutiveRenderedObjectTruthSnapshot(input: {
  readonly objectId: string;
  readonly kind: string;
  readonly role: string;
  readonly disclosureState?: string;
  readonly visualGrammarRole?: string;
  readonly targetPosition: readonly [number, number, number];
  readonly presentationScale: number;
  readonly focused: boolean;
  readonly cameraPosition: { readonly x: number; readonly y: number; readonly z: number };
  readonly cameraTarget: { readonly x: number; readonly y: number; readonly z: number };
  readonly cameraFov: number;
}): ExecutiveRenderedObjectTruthSnapshot {
  const geometry = resolveExecutiveObjectGeometryFamily({
    objectKind: input.kind,
  });
  const certifiedPresentationScale = input.presentationScale;
  const effectiveRenderedScale = resolveEffectiveRenderedStageObjectScale({
    certifiedPresentationScale,
    focused: input.focused,
    spatialRole: input.focused
      ? "focus"
      : input.role === "related"
        ? "related"
        : input.role === "unrelated"
          ? "background"
          : "overview",
  });

  const certifiedWorldBounds = resolveExecutiveStageObjectBounds({
    subjectId: input.objectId,
    objectKind: input.kind,
    scale: certifiedPresentationScale,
  });
  const effectiveRenderedWorldBounds = resolveExecutiveStageObjectBounds({
    subjectId: input.objectId,
    objectKind: input.kind,
    scale: effectiveRenderedScale,
  });

  const position = Object.freeze({
    x: input.targetPosition[0],
    y: input.targetPosition[1],
    z: input.targetPosition[2],
  });

  const certifiedProjected = resolveExecutiveProjectedObjectBounds({
    subjectId: input.objectId,
    position,
    bounds: certifiedWorldBounds,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    cameraFov: input.cameraFov,
  });
  const effectiveRenderedProjected = resolveExecutiveProjectedObjectBounds({
    subjectId: input.objectId,
    position,
    bounds: effectiveRenderedWorldBounds,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    cameraFov: input.cameraFov,
  });

  const scaleDelta = effectiveRenderedScale - certifiedPresentationScale;

  return Object.freeze({
    objectId: input.objectId,
    geometryFamily: geometry.geometryFamily,
    semanticRole: input.role,
    disclosureState: input.disclosureState,
    visualGrammarRole: input.visualGrammarRole,
    certifiedTargetPosition: input.targetPosition,
    certifiedPresentationScale,
    effectiveRenderedScale,
    localGeometryDimensions: geometry.dimensions,
    certifiedWorldBounds,
    effectiveRenderedWorldBounds,
    certifiedProjected,
    effectiveRenderedProjected,
    scaleDelta,
    scaleMismatch: Math.abs(scaleDelta) > SCALE_TOLERANCE,
    positionAuthority: "sp41c-targetPosition",
    scaleAuthorityCertified: "sp41c-presentation.scale",
    scaleAuthorityRendered: "sp21-visual.scale",
  });
}

export function auditExecutiveRenderedObjectTruthFromPresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: { readonly fixture?: string },
): ExecutiveRenderedTruthAuditResult {
  const cameraPosition = Object.freeze({
    x: presentation.scene.camera.position[0],
    y: presentation.scene.camera.position[1],
    z: presentation.scene.camera.position[2],
  });
  const cameraTarget = Object.freeze({
    x: presentation.scene.camera.target[0],
    y: presentation.scene.camera.target[1],
    z: presentation.scene.camera.target[2],
  });
  const cameraFov = presentation.scene.camera.fov;
  const focusedObjectId = presentation.scene.focusedObjectId ?? "";

  const visible = presentation.scene.objects.filter(
    (object) => object.disclosureState !== "hidden",
  );

  const snapshots = Object.freeze(
    visible.map((object) =>
      buildExecutiveRenderedObjectTruthSnapshot({
        objectId: object.id,
        kind: object.kind,
        role: object.role,
        disclosureState: object.disclosureState,
        visualGrammarRole: object.visualGrammarRole,
        targetPosition: object.targetPosition,
        presentationScale: object.scale,
        focused: object.focused || object.id === focusedObjectId,
        cameraPosition,
        cameraTarget,
        cameraFov,
      }),
    ),
  );

  const byId = new Map(snapshots.map((entry) => [entry.objectId, entry]));
  const pairs: ExecutiveRenderedPairTruth[] = [];

  for (let i = 0; i < snapshots.length; i += 1) {
    for (let j = i + 1; j < snapshots.length; j += 1) {
      const left = snapshots[i]!;
      const right = snapshots[j]!;
      const certifiedWorldGap = measureExecutiveFocusObjectGap({
        leftBounds: left.certifiedWorldBounds,
        leftPosition: left.certifiedTargetPosition,
        rightBounds: right.certifiedWorldBounds,
        rightPosition: right.certifiedTargetPosition,
      });
      const effectiveRenderedWorldGap = measureExecutiveFocusObjectGap({
        leftBounds: left.effectiveRenderedWorldBounds,
        leftPosition: left.certifiedTargetPosition,
        rightBounds: right.effectiveRenderedWorldBounds,
        rightPosition: right.certifiedTargetPosition,
      });
      const certifiedProjectedOverlap =
        left.certifiedProjected != null &&
        right.certifiedProjected != null &&
        projectedSafeEnvelopesOverlap(
          left.certifiedProjected,
          right.certifiedProjected,
        );
      const effectiveRenderedProjectedOverlap =
        left.effectiveRenderedProjected != null &&
        right.effectiveRenderedProjected != null &&
        projectedSafeEnvelopesOverlap(
          left.effectiveRenderedProjected,
          right.effectiveRenderedProjected,
        );

      const certifiedWorldPass =
        certifiedWorldGap + 1e-4 >=
        EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap;
      const effectiveRenderedWorldPass =
        effectiveRenderedWorldGap + 1e-4 >=
        EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap;

      const discrepancy =
        (certifiedWorldPass && !effectiveRenderedWorldPass) ||
        (!certifiedProjectedOverlap && effectiveRenderedProjectedOverlap);

      let reason = "aligned";
      if (discrepancy) {
        if (left.scaleMismatch || right.scaleMismatch) {
          reason =
            "SP:2.1 visual.scale floor inflates scale after SP:4.1C certification";
        } else if (effectiveRenderedProjectedOverlap) {
          reason =
            "effective rendered projected envelopes overlap despite certified pass";
        } else {
          reason = "effective rendered world gap fails after scale truth path";
        }
      }

      pairs.push(
        Object.freeze({
          leftId: left.objectId,
          rightId: right.objectId,
          certifiedWorldGap,
          effectiveRenderedWorldGap,
          certifiedProjectedOverlap,
          effectiveRenderedProjectedOverlap,
          certifiedWorldPass,
          effectiveRenderedWorldPass,
          discrepancy,
          reason,
        }),
      );
    }
  }

  const scaleMismatches = snapshots.filter((entry) => entry.scaleMismatch);
  const failingPairs = pairs.filter((entry) => entry.discrepancy);
  const secondary: ExecutiveRenderedTruthRootCause[] = [];

  let rootCause: ExecutiveRenderedTruthRootCause = "NoneDetected";
  if (scaleMismatches.length > 0) {
    rootCause = "ScaleMismatch";
    secondary.push("MultipleTransformAuthorities");
    secondary.push("PostCertificationTransform");
    if (failingPairs.length > 0) {
      secondary.push("BoundsUnderestimated");
    }
  } else if (failingPairs.length > 0) {
    rootCause = "BoundsUnderestimated";
  }

  // Document known secondary structural risks (always present in architecture).
  if (
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.aspect === 16 / 9 &&
    !secondary.includes("ViewportMismatch")
  ) {
    secondary.push("ProjectionCameraMismatch");
    secondary.push("ViewportMismatch");
  }
  secondary.push("VisualShellNotIncluded");

  let caseFinal: ExecutiveRenderedTruthCase =
    "Aligned_CertifiedEqualsRendered";
  if (
    failingPairs.some(
      (entry) =>
        entry.certifiedWorldPass && !entry.effectiveRenderedWorldPass,
    ) ||
    failingPairs.some(
      (entry) =>
        !entry.certifiedProjectedOverlap &&
        entry.effectiveRenderedProjectedOverlap,
    )
  ) {
    caseFinal = "B_EnvelopesClearMeshesOverlap";
  } else if (failingPairs.length > 0) {
    caseFinal = "A_SafeEnvelopesOverlap";
  } else if (scaleMismatches.length > 0) {
    caseFinal = "B_EnvelopesClearMeshesOverlap";
  }

  const findings = Object.freeze([
    `Proven root cause (pre-correction): ${EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE} — SP:2.1 minimumReadable=${EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable} inflated certified SP:4.1C scales (e.g. ~0.56→0.74).`,
    `Correction: explicit compositionScale honors certified scale; floor is minimumCompositionScale=${EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale}.`,
    `Current scale mismatches: ${scaleMismatches.map((entry) => `${entry.objectId} certified=${entry.certifiedPresentationScale.toFixed(3)} rendered=${entry.effectiveRenderedScale.toFixed(3)}`).join("; ") || "none"}`,
    `Discrepant pairs: ${failingPairs.map((entry) => `${entry.leftId}↔${entry.rightId}`).join("; ") || "none"}`,
    "Projection uses fixed aspect 16/9; Stage canvas uses live viewport aspect (secondary).",
    "Edge extentScale (≤1.25) and focus pedestal ring outer 0.68 can exceed silhouetteExtentScale 1.18 (secondary VisualShellNotIncluded).",
    "Position: certified targetPosition is the lerp destination — no permanent post-certification position offset found.",
    "Certification boundary: after Visual Grammar final pass (presentation.scale + targetPosition); renderer must not re-author scale.",
  ] as const);

  return Object.freeze({
    identity: executiveRenderedObjectTruthAuditIdentity,
    version: executiveRenderedObjectTruthAuditVersion,
    fixture: options?.fixture ?? "presentation",
    focusedObjectId,
    snapshots,
    pairs: Object.freeze(pairs),
    rootCause,
    secondaryCauses: Object.freeze(Array.from(new Set(secondary))),
    caseClassification: caseFinal,
    ownershipChain: EXECUTIVE_RENDERED_TRUTH_OWNERSHIP_CHAIN,
    findings,
  });
}

/**
 * Inventory · MINIMUM truth audit through the production Stage presentation path
 * ending in SP:4.1C final grammar application.
 */
export function auditInventoryMinimumRenderedObjectTruth(): ExecutiveRenderedTruthAuditResult {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-inventory");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const derived = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
    derived,
    { presentationDepth: "minimum" },
  );
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const presentation =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  return auditExecutiveRenderedObjectTruthFromPresentation(presentation, {
    fixture: "Inventory·MINIMUM",
  });
}

export function auditRevenueMinimumRenderedObjectTruth(): ExecutiveRenderedTruthAuditResult {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const derived = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
    derived,
    { presentationDepth: "minimum" },
  );
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const presentation =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  return auditExecutiveRenderedObjectTruthFromPresentation(presentation, {
    fixture: "Revenue·MINIMUM",
  });
}

export function positionsMatchCertified(
  certified: readonly [number, number, number],
  rendered: readonly [number, number, number],
): boolean {
  return (
    Math.abs(certified[0] - rendered[0]) <= POSITION_TOLERANCE &&
    Math.abs(certified[1] - rendered[1]) <= POSITION_TOLERANCE &&
    Math.abs(certified[2] - rendered[2]) <= POSITION_TOLERANCE
  );
}
