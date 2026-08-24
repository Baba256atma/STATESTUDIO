"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { ExecutiveStageDensityProfile } from "@/app/lib/spatial-presentation/executiveFramingVisualCalibration";
import {
  applyExecutiveLightingHierarchyToMaterial,
  resolveExecutiveLightingEmphasis,
} from "@/app/lib/spatial-presentation/executiveLightingHierarchy";
import type { ExecutiveObjectLabelCollisionAdjustment } from "@/app/lib/spatial-presentation/executiveObjectLabelInformationDensity";
import {
  applyExecutiveObjectLabelCollisionAdjustment,
  resolveExecutiveObjectLabelPresentation,
} from "@/app/lib/spatial-presentation/executiveObjectLabelInformationDensity";
import {
  resolveExecutiveLabelPlacementSideForSector,
  resolveExecutiveStageAngularSector,
} from "@/app/lib/spatial-presentation/executiveObjectLabelRelationshipGrammar";
import { EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET } from "@/app/lib/spatial-presentation/executiveStageVisualBalance";
import {
  resolveExecutiveObjectVisualPresentation,
  toExecutiveObjectVisualInput,
  type ExecutiveObjectVisualPresentation,
} from "@/app/lib/spatial-presentation/executiveObjectVisualFoundation";
import {
  isExecutiveObject3DGeometryEnabled,
  resolveExecutiveObject3DGeometryProfile,
  type ExecutiveObject3DPresentationLevel,
} from "@/app/lib/spatial-presentation/executiveObject3DGeometry";
import {
  isExecutiveObjectPresenceV2Enabled,
  resolveExecutiveObjectVisualIdentity,
} from "@/app/lib/spatial-presentation/executiveObjectPresenceIdentity";
import { isExecutive3DObjectTerritoryVisible } from "@/app/lib/spatial-presentation/executive3DObjectPremiumForm";
import { NexoraExecutiveObjectLabel } from "./NexoraExecutiveObjectLabel";
import {
  ExecutiveObjectEdgeGeometry,
  ExecutiveObjectGeometryRenderer,
} from "./ExecutiveObjectGeometryRenderer";
import {
  clearExecutiveStage2DLivePosition,
  publishExecutiveStage2DLivePosition,
} from "./executiveStage2DLivePositions";
import { sampleExecutiveStageMotionObject } from "@/app/lib/spatial-presentation/executiveStageMotion";

type Props = {
  readonly presentation: NexoraMVPStageObjectPresentation;
  readonly hoveredId: string | null;
  readonly onSelect: (objectId: string) => void;
  readonly onHover: (objectId: string | null) => void;
  readonly cameraDistance?: number;
  readonly densityProfile?: ExecutiveStageDensityProfile;
  readonly stageOrder?: number;
  readonly labelCollision?: ExecutiveObjectLabelCollisionAdjustment;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
};

/**
 * Compact executive object mesh — consumes SP:2.1 visual presentation.
 * SP:2.2 geometry family arrives via the visual resolver (not JSX kind switches).
 * SP:2.5 label density arrives via visual.label (dumb Html renderer).
 * STAGE-MOTION:1 — position/opacity/scale owned exclusively by motion authority.
 * Never bind overviewPosition (or any layout prop) on the group — React
 * reconciliation would fight the motion authority and leave focus off-center.
 */
export function NexoraStageObject({
  presentation,
  hoveredId,
  onSelect,
  onHover,
  cameraDistance,
  densityProfile,
  stageOrder,
  labelCollision,
  presentationLevel = "minimum",
}: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const hovered = hoveredId === presentation.id;

  // Seed once from targetPosition so first paint is not at world origin.
  // Subsequent motion is owned exclusively by STAGE-MOTION:1.
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || group.userData.__nexoraLayoutSeeded === true) return;
    const [tx, ty, tz] = presentation.targetPosition;
    group.position.set(tx, ty, tz);
    group.userData.__nexoraLayoutSeeded = true;
    publishExecutiveStage2DLivePosition(presentation.id, [tx, ty, tz]);
  }, [presentation.id, presentation.targetPosition]);

  useLayoutEffect(() => {
    return () => {
      clearExecutiveStage2DLivePosition(presentation.id);
    };
  }, [presentation.id]);

  /** STAGE-3DOBJ:1 — id/label cues so Risk/Problem/etc. resolve when kind is generic "object". */
  const semanticKindCue = [
    presentation.id,
    presentation.label,
    presentation.kind,
  ]
    .filter(Boolean)
    .join(" ");

  const visual: ExecutiveObjectVisualPresentation = useMemo(
    () =>
      resolveExecutiveObjectVisualPresentation(
        toExecutiveObjectVisualInput({
          objectId: presentation.id,
          objectKind: semanticKindCue,
          objectName: presentation.label,
          selected: presentation.selected,
          focused: presentation.focused,
          hovered,
          attention: presentation.attention,
          status: presentation.status,
          role: presentation.role,
          occlusionState: presentation.occlusionState,
          readabilityAssist: presentation.readabilityAssist,
          silhouetteAssist: presentation.silhouetteAssist,
          scale: presentation.scale,
          opacity: presentation.opacity,
          emissiveIntensity: presentation.emissiveIntensity,
          labelProminence: presentation.labelProminence,
          rimIntensity: presentation.rimIntensity,
          stateMarker: presentation.stateMarker,
          primaryValue: presentation.primaryValue,
          primaryMetricLabel: presentation.primaryMetricLabel,
          cameraDistance,
          densityProfile,
          stageOrder,
        }),
      ),
    [
      cameraDistance,
      densityProfile,
      hovered,
      presentation,
      semanticKindCue,
      stageOrder,
    ],
  );

  const label = useMemo(() => {
    const objectName =
      presentation.labelPrimaryLine?.trim() || presentation.label;
    const preferredPlacementSide =
      presentation.labelSide ??
      (presentation.focused || presentation.role === "focused"
        ? ("top" as const)
        : resolveExecutiveLabelPlacementSideForSector(
            resolveExecutiveStageAngularSector(
              presentation.targetPosition[0],
              presentation.targetPosition[1],
            ),
          ));
    const base =
      resolveExecutiveObjectLabelPresentation({
        objectId: presentation.id,
        objectName,
        objectKind: presentation.kind,
        status: presentation.status,
        attention: presentation.attention,
        stateMarker: presentation.stateMarker,
        primaryValue: presentation.primaryValue,
        primaryMetricLabel: presentation.primaryMetricLabel,
        spatialRole:
          presentation.role === "related"
            ? "related"
            : presentation.role === "peripheral"
              ? "background"
              : presentation.role === "unrelated"
                ? "background"
                : presentation.focused
                  ? "focus"
                  : "overview",
        focused: presentation.focused,
        selected: presentation.selected,
        hovered,
        occlusionState: presentation.occlusionState,
        readabilityAssist: presentation.readabilityAssist,
        cameraDistance,
        densityProfile,
        labelProminence: presentation.labelProminence,
        stageOrder,
        preferredPlacementSide,
      }) ?? visual.label;

    // STAGE-LABEL:1 — owned side/offset/content is final; skip free-float collision.
    if (
      presentation.stageLabelContract === "stage-label-1" &&
      typeof presentation.labelWorldOffsetX === "number" &&
      typeof presentation.labelWorldOffsetY === "number"
    ) {
      const ownedVisible =
        presentation.labelVisible !== false &&
        presentation.labelVisibilityMode !== "hidden" &&
        presentation.disclosureState !== "hidden" &&
        presentation.opacity >=
          EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.orphanLabelMinBodyOpacity;
      const primary =
        presentation.labelPrimaryLine?.trim() || base.nameText || objectName;
      const secondary = presentation.labelSecondaryLine ?? null;
      const lines = Object.freeze(
        [primary, secondary].filter(
          (line): line is string =>
            typeof line === "string" && line.trim().length > 0,
        ),
      );
      return Object.freeze({
        ...base,
        nameText: primary,
        stateText: secondary,
        showName: ownedVisible,
        showStateCue: ownedVisible && secondary != null,
        showPrimaryValue: false,
        showMetricLabel: false,
        showSecondaryContext: false,
        lines,
        visible: ownedVisible,
        opacity: ownedVisible ? base.opacity : 0,
        anchor: Object.freeze({
          ...base.anchor,
          position: presentation.labelSide ?? preferredPlacementSide,
          offset: Math.hypot(
            presentation.labelWorldOffsetX,
            presentation.labelWorldOffsetY,
          ),
          worldOffsetX: presentation.labelWorldOffsetX,
          worldOffsetY: presentation.labelWorldOffsetY,
          screenOffsetX: 0,
          screenOffsetY: 0,
        }),
      });
    }

    const adjusted = applyExecutiveObjectLabelCollisionAdjustment(
      base,
      labelCollision,
    );
    if (presentation.labelVisible === false) {
      return Object.freeze({
        ...adjusted,
        visible: false,
        showName: false,
        showStateCue: false,
        showPrimaryValue: false,
        showMetricLabel: false,
        showSecondaryContext: false,
        lines: Object.freeze([]),
        opacity: 0,
      });
    }
    if (
      presentation.disclosureState === "hidden" ||
      presentation.opacity <
        EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.orphanLabelMinBodyOpacity
    ) {
      return Object.freeze({
        ...adjusted,
        visible: false,
        showName: false,
        showStateCue: false,
        showPrimaryValue: false,
        showMetricLabel: false,
        showSecondaryContext: false,
        lines: Object.freeze([]),
        opacity: 0,
      });
    }
    return adjusted;
  }, [
    cameraDistance,
    densityProfile,
    hovered,
    labelCollision,
    presentation,
    stageOrder,
    visual.label,
  ]);

  const lightingEmphasis = useMemo(
    () =>
      resolveExecutiveLightingEmphasis({
        objectId: presentation.id,
        focused: presentation.focused,
        selected: presentation.selected,
        attention: presentation.attention,
        status: presentation.status,
        stateMarker: presentation.stateMarker,
        spatialRole: visual.spatialRole,
        stageRole: presentation.role,
        presentationTarget: "stage-object",
      }),
    [
      presentation.attention,
      presentation.focused,
      presentation.id,
      presentation.role,
      presentation.selected,
      presentation.stateMarker,
      presentation.status,
      visual.spatialRole,
    ],
  );

  const material = useMemo(
    () =>
      applyExecutiveLightingHierarchyToMaterial(
        visual.material,
        lightingEmphasis,
      ),
    [lightingEmphasis, visual.material],
  );

  const executiveVisualState =
    presentation.executiveVisualState ?? "normal";
  const stateMarker = presentation.stateMarker ?? "none";
  const isCollectionMember = presentation.spatialRole === "collection";
  const { dimensions, edge, emphasis, geometry } = visual;

  const geometryProfile = useMemo(
    () =>
      resolveExecutiveObject3DGeometryProfile({
        objectKind: semanticKindCue,
        geometryFamily: geometry.family,
        presentationLevel,
        width: dimensions.width,
        height: dimensions.height,
        enabled: isExecutiveObject3DGeometryEnabled(),
        interactionState: presentation.focused
          ? "focused"
          : presentation.selected
            ? "selected"
            : presentation.role === "related"
              ? "related"
              : presentation.role === "peripheral"
                ? "secondary"
                : presentation.role === "unrelated"
                  ? "background"
                  : "overview",
        executiveState:
          presentation.status === "risk"
            ? "critical"
            : presentation.status === "watch"
              ? "watch"
              : presentation.status === "unresolved"
                ? "unresolved"
                : "normal",
      }),
    [
      semanticKindCue,
      presentation.focused,
      presentation.selected,
      presentation.role,
      presentation.status,
      geometry.family,
      presentationLevel,
      dimensions.width,
      dimensions.height,
    ],
  );

  const visualIdentity = useMemo(() => {
    if (!isExecutiveObjectPresenceV2Enabled()) return null;
    return resolveExecutiveObjectVisualIdentity({
      objectKind: semanticKindCue,
      presentationLevel,
      interactionState: presentation.focused
        ? "focused"
        : presentation.selected
          ? "selected"
          : presentation.role === "related"
            ? "related"
            : presentation.role === "peripheral"
              ? "secondary"
              : presentation.role === "unrelated"
                ? "background"
                : "overview",
      executiveState:
        presentation.status === "risk"
          ? "critical"
          : presentation.status === "watch"
            ? "watch"
            : presentation.status === "unresolved"
              ? "unresolved"
              : "normal",
    });
  }, [
    semanticKindCue,
    presentation.focused,
    presentation.selected,
    presentation.role,
    presentation.role,
    presentation.status,
    presentationLevel,
  ]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    // STAGE-2D:6V-FIX — rotation lock (planar front-on only).
    group.rotation.x = 0;
    group.rotation.y = 0;

    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const sample = sampleExecutiveStageMotionObject(presentation.id, now, {
      position: presentation.targetPosition,
      opacity: material.opacity,
      scale: visual.scale,
      visible:
        presentation.disclosureState !== "hidden" && material.opacity > 0.04,
    });

    // STAGE-MOTION:1 — single position authority (legacy frame lerp removed).
    group.position.set(
      sample.position[0],
      sample.position[1],
      sample.position[2],
    );
    publishExecutiveStage2DLivePosition(presentation.id, [
      sample.position[0],
      sample.position[1],
      sample.position[2],
    ]);
    group.scale.setScalar(sample.scale);
    group.visible = sample.visible;

    const mesh = meshRef.current;
    if (mesh && "opacity" in mesh.material) {
      const meshMaterial = mesh.material as {
        opacity: number;
        emissiveIntensity?: number;
        roughness?: number;
        envMapIntensity?: number;
      };
      meshMaterial.opacity = sample.opacity;
      // Material emphasis channels ease with the same progress via direct assign
      // toward semantic targets (no second competing lerp authority).
      if (typeof meshMaterial.emissiveIntensity === "number") {
        meshMaterial.emissiveIntensity = material.emissiveIntensity;
      }
      if (typeof meshMaterial.roughness === "number") {
        meshMaterial.roughness = material.roughness;
      }
      if (typeof meshMaterial.envMapIntensity === "number") {
        meshMaterial.envMapIntensity = material.envMapIntensity;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      // STAGE-MOTION:1 — visibility owned by motion sample (exit fade).
      visible
      userData={{
        objectId: presentation.id,
        canonicalId: presentation.id,
        visualAudit: "stage-object",
        status: presentation.status,
        attention: presentation.attention,
        role: presentation.role,
        focused: presentation.focused,
        selected: presentation.selected,
        opacity: material.opacity,
        scale: visual.scale,
        labelProminence: label.prominence,
        labelLevel: label.level,
        executiveVisualState,
        stateMarker,
        rimIntensity: emphasis.attentionRimIntensity,
        occlusionState: visual.occlusionState,
        readabilityAssist: emphasis.readabilityAssist,
        silhouetteAssist: emphasis.silhouetteAssist,
        visualGeometryFamily: geometry.family,
        visualSemanticFamily: geometry.semanticFamily,
        visualSurfaceTone: material.surfaceTone,
        visualEdgeMode: edge.mode,
        visualStatusClass: emphasis.stateClass,
        visualRecommended: emphasis.recommendationCue,
        visualEnergy: emphasis.visualEnergy,
        visualProminenceRank: emphasis.prominenceRank,
        visualMarker: emphasis.marker,
        visualEmphasisRank: emphasis.emphasisRank,
        visualSuppressInteractionNoise: emphasis.suppressInteractionNoise,
        lightingEmphasisLevel: lightingEmphasis.level,
        lightingEmphasisRank: lightingEmphasis.rank,
        lightingEmphasisStrength: lightingEmphasis.strength,
        connectionAnchorRadius: visual.connectionAnchor.radius,
        layoutTargetPosition: presentation.targetPosition,
        stageMotionAuthority: "stage-motion-1",
      }}
    >
      <ExecutiveObjectGeometryRenderer
        ref={meshRef}
        family={geometry.family}
        dimensions={dimensions}
        material={material}
        resourceKey={geometry.resourceKey}
        pickingExtentScale={geometry.pickingExtentScale}
        interactive={presentation.interactive !== false}
        objectKind={semanticKindCue}
        presentationLevel={presentationLevel}
        interactionState={
          presentation.focused
            ? "focused"
            : presentation.selected
              ? "selected"
              : presentation.role === "related"
                ? "related"
                : presentation.role === "peripheral"
                  ? "secondary"
                  : presentation.role === "unrelated"
                    ? "background"
                    : "overview"
        }
        executiveState={
          presentation.status === "risk"
            ? "critical"
            : presentation.status === "watch"
              ? "watch"
              : presentation.status === "unresolved"
                ? "unresolved"
                : "normal"
        }
        onSelect={() => onSelect(presentation.id)}
        onHover={(nextHovered) =>
          onHover(nextHovered ? presentation.id : null)
        }
      />

      {/* STAGE-OBJ:2 — restrained planar territory (not Deep-Z, not topology). */}
      {isExecutive3DObjectTerritoryVisible() &&
      visualIdentity &&
      visualIdentity.territoryStyle !== "none" &&
      // UX:5-FIX1 — a broad circular territory around a compact collection
      // peer can read as a second body. Collection state stays visible through
      // the shape-aware edge and corner marker below.
      !isCollectionMember &&
      visualIdentity.territoryOpacity > 0.04 ? (
        <mesh
          position={[0, 0, geometryProfile.frontZ + 0.015]}
          rotation={[0, 0, 0]}
          userData={{
            visualAudit: "stage-object-territory",
            visualLayerRole: "state-territory",
            decorative: true,
            interactive: false,
            territoryStyle: visualIdentity.territoryStyle,
            territoryCollision: visualIdentity.territoryCollision,
          }}
        >
          <ringGeometry
            args={[
              // STAGE-3DOBJ:2-FIX — thinner territory band so body/face dominate.
              Math.min(
                visualIdentity.territoryOuter - 0.035,
                visualIdentity.territoryInner +
                  (visualIdentity.territoryOuter - visualIdentity.territoryInner) *
                    0.55,
              ),
              visualIdentity.territoryOuter,
              56,
            ]}
          />
          <meshBasicMaterial
            color={
              visualIdentity.territoryStyle === "critical"
                ? "#f87171"
                : visualIdentity.territoryStyle === "attention"
                  ? "#fbbf24"
                  : edge.color
            }
            transparent
            opacity={visualIdentity.territoryOpacity}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {/* STAGE-OBJ:1 — planar focus ring on front face (not a depth shell). */}
      {emphasis.showFocusPedestal &&
      !(visualIdentity && visualIdentity.territoryStyle === "focused") ? (
        <mesh
          position={[0, 0, geometryProfile.frontZ + 0.02]}
          rotation={[0, 0, 0]}
          userData={{
            visualLayerRole: "selection-indication",
            decorative: true,
            interactive: false,
          }}
        >
          <ringGeometry
            args={[
              Math.max(geometryProfile.width, geometryProfile.height) * 0.52 +
                0.04,
              Math.max(geometryProfile.width, geometryProfile.height) * 0.52 +
                0.1,
              48,
            ]}
          />
          <meshBasicMaterial
            color={edge.color}
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {/* STAGE-OBJ:2 — small state marker (does not redefine silhouette). */}
      {visualIdentity &&
      visualIdentity.stateMarkerStyle !== "none" &&
      !presentation.focused ? (
        <mesh
          position={[
            geometryProfile.width * 0.42,
            geometryProfile.height * 0.42,
            geometryProfile.frontZ + 0.03,
          ]}
          userData={{
            visualLayerRole: "state-marker",
            decorative: true,
            interactive: false,
          }}
        >
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial
            color={
              visualIdentity.stateMarkerStyle === "corner"
                ? "#f87171"
                : visualIdentity.territoryStyle === "attention"
                  ? "#fbbf24"
                  : "#94a3b8"
            }
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {/* Edge channel — planar outline outside body. */}
      {edge.mode !== "none" && edge.wireframe ? (
        <ExecutiveObjectEdgeGeometry
          family={geometry.family}
          dimensions={dimensions}
          extentScale={edge.extentScale}
          color={edge.color}
          opacity={edge.opacity}
          depthTest={edge.mode !== "occlusion"}
          presentationLevel={presentationLevel}
          objectKind={semanticKindCue}
        />
      ) : null}

      <NexoraExecutiveObjectLabel
        label={label}
        testId={`nexora-stage-object-label-${presentation.id}`}
        auditAttributes={{
          "data-canonical-id": presentation.id,
          "data-status": presentation.status,
          "data-attention": presentation.attention,
          "data-role": presentation.role,
          "data-focused": presentation.focused ? "true" : "false",
          "data-selected": presentation.selected ? "true" : "false",
          "data-executive-visual-state": executiveVisualState,
          "data-state-marker": stateMarker,
          "data-occlusion-state": visual.occlusionState,
          "data-label-anchor": String(label.anchor.position),
          "data-label-owner-id": presentation.id,
          "data-label-side": presentation.labelSide ?? String(label.anchor.position),
          "data-label-visibility":
            presentation.labelVisibilityMode ??
            (label.visible ? "full" : "hidden"),
          "data-label-owner-distance":
            presentation.labelOwnerDistance != null
              ? String(presentation.labelOwnerDistance)
              : undefined,
          "data-label-territory-status":
            presentation.labelTerritoryStatus ?? "owned",
          "data-geometry-family": geometry.family,
          "data-semantic-family": geometry.semanticFamily,
        }}
      />
    </group>
  );
}
