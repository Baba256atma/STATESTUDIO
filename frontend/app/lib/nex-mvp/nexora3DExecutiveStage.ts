/**
 * NEX-MVP:3 — Nexora 3D Executive Stage (presentation contracts).
 *
 * Pure scene-mapping for the spatial Stage. No React, Three.js, or DOM.
 * Answers: how should application/runtime state be shown?
 */

import type {
  NexoraMVPPresentationState,
  NexoraMVPSceneEnvironmentIntent,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type {
  NexoraMVPStageObjectFixture,
  NexoraMVPStageRelationshipFixture,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  buildExecutiveOccupiedBoundsFromPositions,
  resolveExecutiveDensityAwareFraming,
} from "@/app/lib/spatial-presentation/executiveDensityAwareFraming";
import {
  resolveExecutiveFocusChoreography,
} from "@/app/lib/spatial-presentation/executiveFocusChoreography";
import {
  resolveExecutiveFocusVisualGrammar,
} from "@/app/lib/spatial-presentation/executiveFocusVisualGrammar";
import {
  buildExecutiveTopologyStagePositionMap,
  resolveExecutiveTopologyGuidedStageComposition,
} from "@/app/lib/spatial-presentation/executiveTopologyGuidedStageComposition";
import { normalizeExecutiveStage2DPositionTuple } from "@/app/lib/spatial-presentation/executiveStage2DTopologyPlane";
import {
  resolveExecutiveStageDisclosure,
  type ExecutiveStageSpatialRole,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexora3DExecutiveStageIdentity =
  "NEX-MVP:3/Nexora3DExecutiveStage" as const;

export const nexora3DExecutiveStageVersion = "1.3.0" as const;

export const nexora3DExecutiveStageNamespace =
  "nexora.mvp.executive-stage" as const;

export const nexora3DExecutiveStagePhase = "3DExecutiveStage" as const;

export const nexora3DExecutiveStageArchitecturalRole =
  "MVPSpatialExecutiveInteractionSurface" as const;

export const nexora3DExecutiveStageReadiness =
  "ReadyForObjectInteraction" as const;

export const nexora3DExecutiveStageUpstreamShellIdentity =
  "NEX-MVP:2/NexoraExecutiveShell" as const;

export const nexora3DExecutiveStageUpstreamFoundationIdentity =
  "NEX-MVP:1/NexoraMVPApplicationFoundation" as const;

export type Nexora3DExecutiveStageIdentity = {
  readonly id: typeof nexora3DExecutiveStageIdentity;
  readonly version: typeof nexora3DExecutiveStageVersion;
  readonly namespace: typeof nexora3DExecutiveStageNamespace;
  readonly phase: typeof nexora3DExecutiveStagePhase;
  readonly architecturalRole: typeof nexora3DExecutiveStageArchitecturalRole;
};

const STAGE_IDENTITY: Nexora3DExecutiveStageIdentity = Object.freeze({
  id: nexora3DExecutiveStageIdentity,
  version: nexora3DExecutiveStageVersion,
  namespace: nexora3DExecutiveStageNamespace,
  phase: nexora3DExecutiveStagePhase,
  architecturalRole: nexora3DExecutiveStageArchitecturalRole,
});

export function getNexora3DExecutiveStageIdentity(): Nexora3DExecutiveStageIdentity {
  return STAGE_IDENTITY;
}

export const NEXORA_3D_EXECUTIVE_STAGE_BOUNDARY = Object.freeze({
  architecturalRole: nexora3DExecutiveStageArchitecturalRole,
  soleImmediateShellDependency: nexora3DExecutiveStageUpstreamShellIdentity,
  foundationDependency: nexora3DExecutiveStageUpstreamFoundationIdentity,
  ownsRuntimeSemantics: false as const,
  inventsDomainLogicInMeshes: false as const,
  introducesUnrestrictedOrbitControls: false as const,
  introducesDecorativeMotion: false as const,
});

// ─── Stage object / presentation contracts ──────────────────────────────────

export type NexoraMVPStageAttention =
  | "normal"
  | "elevated"
  | "important"
  | "critical";

export type NexoraMVPStageObjectRole =
  | "normal"
  | "focused"
  | "related"
  | "peripheral"
  | "unrelated";

export type NexoraMVPStageObject = {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly position: readonly [number, number, number];
  readonly status?: string;
  readonly attention?: NexoraMVPStageAttention;
  readonly selected?: boolean;
  readonly focused?: boolean;
};

export type NexoraMVPStageRelationship = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

/** P2:8.2 restrained executive-state marker — not a dashboard badge. */
export type NexoraMVPStageObjectStateMarker =
  | "none"
  | "attention"
  | "critical"
  | "unresolved";

export type NexoraMVPStageObjectPresentation = {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly role: NexoraMVPStageObjectRole;
  readonly overviewPosition: readonly [number, number, number];
  readonly targetPosition: readonly [number, number, number];
  readonly scale: number;
  readonly opacity: number;
  readonly emissiveIntensity: number;
  readonly labelProminence: "full" | "reduced" | "minimal";
  readonly selected: boolean;
  readonly focused: boolean;
  readonly attention: NexoraMVPStageAttention;
  readonly status: string;
  /** Canonical executive visual state from P2:8.2 (presentation only). */
  readonly executiveVisualState?:
    | "normal"
    | "attention"
    | "critical"
    | "unresolved";
  /** Non-color severity marker; distinct from focus/selection cues. */
  readonly stateMarker?: NexoraMVPStageObjectStateMarker;
  /** Restrained rim intensity for attention/critical/unresolved. */
  readonly rimIntensity?: number;
  /** SP:1.8 presentation-only occlusion classification. */
  readonly occlusionState?: "clear" | "partial" | "substantial";
  readonly occluderIds?: readonly string[];
  readonly readabilityAssist?: boolean;
  readonly silhouetteAssist?: boolean;
  /**
   * Optional preformatted Stage value (presentation passthrough only).
   * SP:2.5 never invents KPI/value text.
   */
  readonly primaryValue?: string;
  readonly primaryMetricLabel?: string;
  /** SP:4.1B presentation-only disclosure classification. */
  readonly disclosureState?:
    | "visible-primary"
    | "visible-related"
    | "collapsed-thread"
    | "background-discoverable"
    | "hidden";
  /** STAGE-PROD:0 spatial role (OBJECT KIND ≠ SPATIAL ROLE). */
  readonly spatialRole?: ExecutiveStageSpatialRole | "hidden";
  /** Hidden subjects must not accept pointer interaction. */
  readonly interactive?: boolean;
  /** Coherent with disclosure — hidden subjects suppress Stage labels. */
  readonly labelVisible?: boolean;
  /** SP:4.1C visual-grammar role (presentation only). */
  readonly visualGrammarRole?:
    | "primary"
    | "elevated"
    | "related"
    | "background"
    | "executive-thread"
    | "collapsed-thread";
  /** SP:4.1C deterministic label hierarchy lines. */
  readonly labelPrimaryLine?: string;
  readonly labelSecondaryLine?: string | null;
  /** SP:4.1C extra world-Y label clearance (focus silhouette breathing room). */
  readonly labelAnchorBoost?: number;
  /** STAGE-LABEL:1 — authoritative owned label placement. */
  readonly labelSide?:
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left";
  readonly labelWorldOffsetX?: number;
  readonly labelWorldOffsetY?: number;
  readonly labelOwnerDistance?: number;
  readonly labelVisibilityMode?: "full" | "compact" | "minimal" | "hidden";
  readonly labelTerritoryStatus?: "owned" | "hidden" | "degraded";
  readonly stageLabelContract?: "stage-label-1";
  /** SP:4.2 composition mode (internal migration; not an end-user setting). */
  readonly compositionMode?: "spatial-3d" | "executive-2_5d";
  /** SP:4.2 presentation-plane position (2D layout authority). */
  readonly presentationPosition?: Readonly<{ readonly x: number; readonly y: number }>;
  /** SP:4.3B legacy depth metadata — must not move Stage anchors. */
  readonly depthRole?:
    | "focus"
    | "foreground"
    | "standard"
    | "background"
    | "thread";
  /** SP:4.2 semantic presentation region. */
  readonly presentationRegion?:
    | "business-network"
    | "executive-thread"
    | "background-context";
  /** SP:4.2 full composition contract when plane authority is applied. */
  readonly presentationComposition?: Readonly<{
    readonly objectId: string;
    readonly presentationPosition: Readonly<{ readonly x: number; readonly y: number }>;
    readonly territory: Readonly<{
      readonly objectId: string;
      readonly center: Readonly<{ readonly x: number; readonly y: number }>;
      readonly width: number;
      readonly height: number;
      readonly padding: number;
      readonly region: string;
      readonly depthRole: string;
    }>;
    readonly compositionScale: number;
  }>;
  /** SP:4.3 network topology layer / slot (presentation only). */
  readonly networkTopologyLayer?: 0 | 1 | 2 | 3;
  readonly networkTopologySlotId?: string;
};

export type NexoraMVPStageConnectionVisualRole =
  | "anchor-incident"
  | "context"
  | "background"
  | "hidden";

export type NexoraMVPStageConnectionPresentation = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly emphasized: boolean;
  readonly opacity: number;
  /** Canonical relation kind from P2:7 — never invents causality. */
  readonly relation?: string;
  readonly visualRole?: NexoraMVPStageConnectionVisualRole;
  readonly directionCue?: "none" | "source-to-target";
  readonly lineWidth?: number;
  readonly impliesCausality?: false;
  /** STAGE-2D:4 planar readability routing — endpoints remain truthful. */
  readonly routeKind?: "straight" | "bent";
  readonly routePoints?: readonly (readonly [number, number, number])[];
};

export type NexoraMVPStageCameraPresentation = {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
  /** Optional SP:1.1 projection bounds; controller falls back to foundation defaults. */
  readonly near?: number;
  readonly far?: number;
};

export type NexoraMVPStageScenePresentation = {
  readonly mode: "overview" | "focus";
  readonly focusedObjectId: string | null;
  readonly selectedObjectId: string | null;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly objects: readonly NexoraMVPStageObjectPresentation[];
  readonly connections: readonly NexoraMVPStageConnectionPresentation[];
  readonly camera: NexoraMVPStageCameraPresentation;
  /** SP:4.2 internal Stage composition mode. */
  readonly compositionMode?: "spatial-3d" | "executive-2_5d";
  /** SP:4.3 topology kind when executive-network is active. */
  readonly topologyKind?: "executive-network" | "flow" | "hub";
};

export type ResolveNexoraMVPStageSceneInput = {
  readonly objects: readonly NexoraMVPStageObjectFixture[] | readonly NexoraMVPStageObject[];
  readonly relationships: readonly NexoraMVPStageRelationshipFixture[] | readonly NexoraMVPStageRelationship[];
  readonly selectedObjectId: string | null;
  readonly focusedObjectId: string | null;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
};

function attentionScale(attention: NexoraMVPStageAttention): number {
  switch (attention) {
    case "critical":
      return 1.12;
    case "important":
      return 1.06;
    case "elevated":
      return 1.03;
    default:
      return 1;
  }
}

function attentionEmissive(attention: NexoraMVPStageAttention): number {
  switch (attention) {
    case "critical":
      return 0.35;
    case "important":
      return 0.22;
    case "elevated":
      return 0.14;
    default:
      return 0.06;
  }
}

function mapSpatialRoleToLegacyDisclosureState(
  spatialRole: ExecutiveStageSpatialRole | "hidden",
):
  | "visible-primary"
  | "visible-related"
  | "background-discoverable"
  | "hidden" {
  if (spatialRole === "center") return "visible-primary";
  if (spatialRole === "related" || spatialRole === "collection") {
    return "visible-related";
  }
  if (spatialRole === "watch") return "background-discoverable";
  return "hidden";
}

/**
 * Deterministic Stage presentation from application selection/focus state.
 * Pure mapping — no domain invention beyond relationship adjacency.
 *
 * STAGE-PROD:0 — resolveExecutiveStageDisclosure selects WHAT is visible
 *   (CENTER / RELATED / WATCH). SP:4.1B is demoted and routed through it.
 * SP:4.1 — Topology positions the disclosed set (WHERE).
 * Focus choreography continues to supply roles + camera.
 */
export function resolveNexoraMVPStageScenePresentation(
  input: ResolveNexoraMVPStageSceneInput,
): NexoraMVPStageScenePresentation {
  const focusedId = input.focusedObjectId ?? input.selectedObjectId;
  const selectedId = input.selectedObjectId;
  const mode = focusedId == null ? "overview" : "focus";

  const productivityDisclosure = resolveExecutiveStageDisclosure({
    subjects: input.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        label: object.label,
        objectKind: object.kind,
        family: "business-object" as const,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: input.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    presentationMode: mode === "overview" ? "overview" : "object-focus",
    presentationDepth: input.presentationState,
    primaryStageSubjectId: focusedId,
    // Density: preserve CENTER + RELATED before expanding Watch.
    watchBudgetMax:
      input.presentationState === "operation"
        ? 4
        : input.presentationState === "report"
          ? 3
          : 2,
  });

  const disclosedBusinessIds = new Set(
    productivityDisclosure.entries
      .filter((entry) => entry.participatesInTopology)
      .map((entry) => entry.objectId)
      .filter((subjectId) =>
        input.objects.some((object) => object.id === subjectId),
      ),
  );

  const topologyObjects = input.objects
    .filter((object) => disclosedBusinessIds.has(object.id))
    .map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
      }),
    );

  const topologyRelationships = input.relationships
    .filter(
      (relationship) =>
        disclosedBusinessIds.has(relationship.sourceId) &&
        disclosedBusinessIds.has(relationship.targetId),
    )
    .map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    );

  /** Overview home layout — full catalog home positions (navigation restore). */
  const overviewTopology = resolveExecutiveTopologyGuidedStageComposition({
    objects: input.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: input.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    focusedObjectId: null,
    topologyType: "auto",
  });
  const overviewById =
    buildExecutiveTopologyStagePositionMap(overviewTopology);

  /** Active layout — topology receives disclosed subjects only. */
  const activeTopology = resolveExecutiveTopologyGuidedStageComposition({
    objects: topologyObjects,
    relationships: topologyRelationships,
    focusedObjectId: focusedId,
    topologyType: "auto",
  });
  const activeById = buildExecutiveTopologyStagePositionMap(activeTopology);

  const preferredBounds = buildExecutiveOccupiedBoundsFromPositions(
    input.objects.map((object) => {
      const overview = overviewById.get(object.id) ?? object.position;
      return Object.freeze({
        x: overview[0],
        y: overview[1],
        z: overview[2],
      });
    }),
  );
  const provisionalDensity = resolveExecutiveDensityAwareFraming({
    mode,
    visibleObjectCount: topologyObjects.length,
    visibleContextCount: 0,
    focusedObjectId: focusedId,
    relatedVisibleCount: 0,
    ...(preferredBounds !== undefined
      ? { spatialBounds: preferredBounds }
      : {}),
  });

  const relatedVisibleCount = productivityDisclosure.relatedObjectIds.length;

  const composedBounds = buildExecutiveOccupiedBoundsFromPositions(
    topologyObjects.map((object) => {
      const active =
        activeById.get(object.objectId) ??
        overviewById.get(object.objectId) ??
        ([0, 0, 0] as const);
      return Object.freeze({
        x: active[0],
        y: active[1],
        z: active[2],
      });
    }),
  );

  const densityFraming = resolveExecutiveDensityAwareFraming({
    mode,
    visibleObjectCount: topologyObjects.length,
    visibleContextCount: 0,
    focusedObjectId: focusedId,
    relatedVisibleCount,
    ...(composedBounds !== undefined
      ? { spatialBounds: composedBounds }
      : {}),
    previousProfile: provisionalDensity.profile,
  });

  const focusPlan = resolveExecutiveFocusChoreography({
    focusedObjectId: focusedId,
    objects: input.objects.map((object) => {
      const overview = overviewById.get(object.id) ?? object.position;
      return Object.freeze({
        objectId: object.id,
        basePosition: Object.freeze({
          x: overview[0],
          y: overview[1],
          z: overview[2],
        }),
        retainDiscoverability: object.attention === "critical",
      });
    }),
    connections: input.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    cameraDistance: densityFraming.cameraDistance,
    cameraFov: densityFraming.cameraFov,
  });

  const objects = input.objects.map((object) => {
    const selected = object.id === selectedId;
    const focused = object.id === focusedId;
    const productivityEntry = productivityDisclosure.byId.get(object.id);
    const spatialRole = productivityEntry?.spatialRole ?? "hidden";
    const disclosureState = mapSpatialRoleToLegacyDisclosureState(spatialRole);
    const interactive = spatialRole !== "hidden";
    const labelVisible = spatialRole !== "hidden";

    let role: NexoraMVPStageObjectRole = "normal";
    if (mode === "focus") {
      if (spatialRole === "center") role = "focused";
      else if (spatialRole === "related") role = "related";
      else role = "unrelated";
    }

    const overviewPosition =
      overviewById.get(object.id) ?? object.position;
    const topologyTarget =
      activeById.get(object.id) ?? overviewPosition;
    const targetPosition =
      disclosureState !== "hidden" ? topologyTarget : overviewPosition;

    const baseScale = attentionScale(object.attention ?? "normal");
    // Provisional scale — SP:4.1C grammar replaces dramatic focus scale.
    let scale =
      role === "focused"
        ? baseScale
        : role === "related"
          ? baseScale * 0.92
          : role === "unrelated"
            ? baseScale * 0.78
            : baseScale;
    let opacity =
      role === "unrelated" ? 0.28 : role === "related" ? 0.92 : 1;
    let emissiveIntensity =
      role === "focused"
        ? Math.max(0.45, attentionEmissive(object.attention ?? "normal"))
        : role === "unrelated"
          ? 0.02
          : attentionEmissive(object.attention ?? "normal");
    let labelProminence: NexoraMVPStageObjectPresentation["labelProminence"] =
      role === "focused" || role === "normal"
        ? "full"
        : role === "related"
          ? "reduced"
          : "minimal";

    if (disclosureState === "hidden") {
      opacity = 0;
      scale = baseScale * 0.72;
      emissiveIntensity = 0;
      labelProminence = "minimal";
    } else if (disclosureState === "background-discoverable") {
      opacity = Math.max(0.34, Math.min(opacity, 0.48));
      labelProminence = "minimal";
      scale = Math.max(scale, baseScale * 0.88);
      emissiveIntensity = Math.max(emissiveIntensity, 0.08);
    }

    return Object.freeze({
      id: object.id,
      label: object.label,
      kind: object.kind,
      role,
      overviewPosition,
      targetPosition,
      scale,
      opacity,
      emissiveIntensity,
      labelProminence,
      selected: selected && interactive,
      focused: focused && disclosureState === "visible-primary",
      attention: object.attention ?? "normal",
      status: object.status ?? "stable",
      disclosureState,
      spatialRole,
      interactive,
      labelVisible,
    });
  });

  // SP:4.1C — Visual Grammar + final separation after topology + scale.
  const grammar = resolveExecutiveFocusVisualGrammar({
    mode,
    presentationDepth: input.presentationState,
    focusedSubjectId: focusedId,
    cameraPosition: Object.freeze({
      x: (mode === "focus"
        ? focusPlan.cameraTuple.position
        : densityFraming.cameraTuple.position)[0],
      y: (mode === "focus"
        ? focusPlan.cameraTuple.position
        : densityFraming.cameraTuple.position)[1],
      z: (mode === "focus"
        ? focusPlan.cameraTuple.position
        : densityFraming.cameraTuple.position)[2],
    }),
    cameraTarget: Object.freeze({
      x: (mode === "focus"
        ? focusPlan.cameraTuple.target
        : densityFraming.cameraTuple.target)[0],
      y: (mode === "focus"
        ? focusPlan.cameraTuple.target
        : densityFraming.cameraTuple.target)[1],
      z: (mode === "focus"
        ? focusPlan.cameraTuple.target
        : densityFraming.cameraTuple.target)[2],
    }),
    cameraFov:
      mode === "focus"
        ? focusPlan.cameraTuple.fov
        : densityFraming.cameraTuple.fov,
    subjects: objects
      .filter((object) => object.disclosureState !== "hidden")
      .map((object) =>
        Object.freeze({
          subjectId: object.id,
          label: object.label,
          family: "business-object" as const,
          objectKind: object.kind,
          disclosureState: object.disclosureState,
          roleHint: object.role,
          attention: object.attention,
          status: object.status,
          position: object.targetPosition,
          scale: object.scale,
        }),
      ),
  });

  const calibratedObjects = Object.freeze(
    objects.map((object) => {
      const grammarEntry = grammar.byId.get(object.id);
      const withGrammar =
        grammarEntry == null || object.disclosureState === "hidden"
          ? object
          : Object.freeze({
              ...object,
              targetPosition: grammarEntry.targetPosition,
              scale: grammarEntry.scale,
              labelProminence: grammarEntry.label.prominence,
              visualGrammarRole: grammarEntry.visualRole,
              labelPrimaryLine: grammarEntry.label.primaryLine,
              labelSecondaryLine: grammarEntry.label.secondaryLine,
              labelAnchorBoost: grammarEntry.labelAnchorBoost,
            });
      // STAGE-2D:2 — seed Stage positions are always coplanar (z = 0).
      return Object.freeze({
        ...withGrammar,
        targetPosition: normalizeExecutiveStage2DPositionTuple(
          withGrammar.targetPosition,
        ),
        overviewPosition: normalizeExecutiveStage2DPositionTuple(
          withGrammar.overviewPosition,
        ),
      });
    }),
  );

    const connections = input.relationships.map((relationship) => {
    const sourceEntry = productivityDisclosure.byId.get(relationship.sourceId);
    const targetEntry = productivityDisclosure.byId.get(relationship.targetId);
    const bothVisible =
      sourceEntry != null &&
      targetEntry != null &&
      sourceEntry.spatialRole !== "hidden" &&
      targetEntry.spatialRole !== "hidden";
    const involvesFocus =
      focusedId != null &&
      (relationship.sourceId === focusedId ||
        relationship.targetId === focusedId);
    const emphasized = mode === "focus" && involvesFocus && bothVisible;
    const opacity = !bothVisible
      ? 0
      : mode === "overview"
        ? 0.14
        : emphasized
          ? 0.74
          : 0.045;

    return Object.freeze({
      id: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
      emphasized,
      opacity,
      visualRole: (!bothVisible
        ? "hidden"
        : emphasized
          ? "anchor-incident"
          : "background") as NexoraMVPStageConnectionVisualRole,
    });
  });

  const focusCamera: NexoraMVPStageCameraPresentation = Object.freeze({
    position: focusPlan.cameraTuple.position,
    target: focusPlan.cameraTuple.target,
    fov: focusPlan.cameraTuple.fov,
    near: focusPlan.cameraTuple.near,
    far: focusPlan.cameraTuple.far,
  });

  const overviewCamera: NexoraMVPStageCameraPresentation = Object.freeze({
    position: densityFraming.cameraTuple.position,
    target: densityFraming.cameraTuple.target,
    fov: densityFraming.cameraTuple.fov,
    near: densityFraming.cameraTuple.near,
    far: densityFraming.cameraTuple.far,
  });

  return Object.freeze({
    mode,
    focusedObjectId: focusedId,
    selectedObjectId: selectedId,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
    objects: calibratedObjects,
    connections: Object.freeze(connections),
    camera: mode === "focus" ? focusCamera : overviewCamera,
  });
}

export function verifyNexora3DExecutiveStage(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly mappingDeterministic: boolean;
}> {
  const identity = getNexora3DExecutiveStageIdentity();
  const identityValid =
    identity.id === "NEX-MVP:3/Nexora3DExecutiveStage" &&
    identity.version === "1.3.0" &&
    identity.namespace === "nexora.mvp.executive-stage" &&
    identity.architecturalRole === "MVPSpatialExecutiveInteractionSurface";

  const boundaryValid =
    NEXORA_3D_EXECUTIVE_STAGE_BOUNDARY.ownsRuntimeSemantics === false &&
    NEXORA_3D_EXECUTIVE_STAGE_BOUNDARY.inventsDomainLogicInMeshes === false &&
    NEXORA_3D_EXECUTIVE_STAGE_BOUNDARY.introducesUnrestrictedOrbitControls ===
      false;

  const sampleObjects = [
    {
      id: "a",
      label: "A",
      kind: "object",
      position: [1, 0, 0] as const,
      attention: "normal" as const,
      status: "stable",
    },
    {
      id: "b",
      label: "B",
      kind: "object",
      position: [-1, 0, 0] as const,
      attention: "elevated" as const,
      status: "watch",
    },
  ];
  const sampleRels = [
    { id: "r1", sourceId: "a", targetId: "b" },
  ];
  const a = resolveNexoraMVPStageScenePresentation({
    objects: sampleObjects,
    relationships: sampleRels,
    selectedObjectId: "a",
    focusedObjectId: "a",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const b = resolveNexoraMVPStageScenePresentation({
    objects: sampleObjects,
    relationships: sampleRels,
    selectedObjectId: "a",
    focusedObjectId: "a",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const mappingDeterministic =
    JSON.stringify(a) === JSON.stringify(b) &&
    a.objects.find((entry) => entry.id === "a")?.role === "focused" &&
    a.objects.find((entry) => entry.id === "b")?.role === "related";

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    mappingDeterministic;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    mappingDeterministic,
  });
}
