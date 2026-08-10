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
};

export type NexoraMVPStageConnectionPresentation = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly emphasized: boolean;
  readonly opacity: number;
};

export type NexoraMVPStageCameraPresentation = {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
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
};

export type ResolveNexoraMVPStageSceneInput = {
  readonly objects: readonly NexoraMVPStageObjectFixture[] | readonly NexoraMVPStageObject[];
  readonly relationships: readonly NexoraMVPStageRelationshipFixture[] | readonly NexoraMVPStageRelationship[];
  readonly selectedObjectId: string | null;
  readonly focusedObjectId: string | null;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
};

const OVERVIEW_CAMERA = Object.freeze({
  position: [0, 4.6, 8.4] as const,
  target: [0, 0.1, 0] as const,
  fov: 42,
});

const FOCUS_CAMERA = Object.freeze({
  position: [0, 3.4, 6.2] as const,
  target: [0, 0.25, 0] as const,
  fov: 40,
});

function relatedIdsFor(
  objectId: string,
  relationships: readonly { sourceId: string; targetId: string }[],
): ReadonlySet<string> {
  const related = new Set<string>();
  for (const relationship of relationships) {
    if (relationship.sourceId === objectId) {
      related.add(relationship.targetId);
    }
    if (relationship.targetId === objectId) {
      related.add(relationship.sourceId);
    }
  }
  return related;
}

function focusLayoutPosition(
  index: number,
  total: number,
): readonly [number, number, number] {
  if (total <= 0) return [1.6, 0, 0];
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 1.85;
  return [
    Math.cos(angle) * radius,
    0.05,
    Math.sin(angle) * radius,
  ] as const;
}

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

/**
 * Deterministic Stage presentation from application selection/focus state.
 * Pure mapping — no domain invention beyond relationship adjacency.
 */
export function resolveNexoraMVPStageScenePresentation(
  input: ResolveNexoraMVPStageSceneInput,
): NexoraMVPStageScenePresentation {
  const focusedId = input.focusedObjectId ?? input.selectedObjectId;
  const selectedId = input.selectedObjectId;
  const mode = focusedId == null ? "overview" : "focus";
  const related =
    focusedId == null
      ? new Set<string>()
      : relatedIdsFor(focusedId, input.relationships);

  const relatedList = input.objects.filter(
    (object) => related.has(object.id) && object.id !== focusedId,
  );

  const objects = input.objects.map((object) => {
    const selected = object.id === selectedId;
    const focused = object.id === focusedId;
    let role: NexoraMVPStageObjectRole = "normal";
    if (mode === "focus") {
      if (focused) role = "focused";
      else if (related.has(object.id)) role = "related";
      else role = "unrelated";
    }

    const overviewPosition = object.position;
    let targetPosition = overviewPosition;
    if (mode === "focus" && focusedId != null) {
      if (focused) {
        targetPosition = [0, 0.25, 0] as const;
      } else if (role === "related") {
        const relatedIndex = relatedList.findIndex(
          (entry) => entry.id === object.id,
        );
        targetPosition = focusLayoutPosition(
          Math.max(0, relatedIndex),
          relatedList.length,
        );
      } else {
        targetPosition = [
          overviewPosition[0] * 1.35,
          overviewPosition[1] - 0.35,
          overviewPosition[2] * 1.35 - 1.1,
        ] as const;
      }
    }

    const baseScale = attentionScale(object.attention ?? "normal");
    const scale =
      role === "focused"
        ? baseScale * 1.28
        : role === "related"
          ? baseScale * 1.05
          : role === "unrelated"
            ? baseScale * 0.78
            : baseScale;

    const opacity =
      role === "unrelated" ? 0.28 : role === "related" ? 0.92 : 1;

    const emissiveIntensity =
      role === "focused"
        ? Math.max(0.45, attentionEmissive(object.attention ?? "normal"))
        : role === "unrelated"
          ? 0.02
          : attentionEmissive(object.attention ?? "normal");

    const labelProminence =
      role === "focused" || role === "normal"
        ? "full"
        : role === "related"
          ? "reduced"
          : "minimal";

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
      selected,
      focused,
      attention: object.attention ?? "normal",
      status: object.status ?? "stable",
    });
  });

  const connections = input.relationships.map((relationship) => {
    const involvesFocus =
      focusedId != null &&
      (relationship.sourceId === focusedId ||
        relationship.targetId === focusedId);
    const emphasized = mode === "focus" ? involvesFocus : false;
    const opacity =
      mode === "overview" ? 0.28 : emphasized ? 0.78 : 0.1;

    return Object.freeze({
      id: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
      emphasized,
      opacity,
    });
  });

  return Object.freeze({
    mode,
    focusedObjectId: focusedId,
    selectedObjectId: selectedId,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
    objects: Object.freeze(objects),
    connections: Object.freeze(connections),
    camera: mode === "focus" ? FOCUS_CAMERA : OVERVIEW_CAMERA,
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
