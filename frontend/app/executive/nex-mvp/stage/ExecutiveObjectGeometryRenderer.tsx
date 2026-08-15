"use client";

import { forwardRef, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import {
  isExecutiveObject3DGeometryEnabled,
  resolveExecutiveObject3DGeometryProfile,
  type ExecutiveObject3DPresentationLevel,
} from "@/app/lib/spatial-presentation/executiveObject3DGeometry";
import {
  isExecutive3DObjectVisualEnabled,
  resolveExecutive3DObjectVisualProfile,
} from "@/app/lib/spatial-presentation/executive3DObjectVisualProfile";
import {
  isExecutive3DObjectSurfaceEnabled,
  resolveExecutive3DObjectFaceSymbology,
} from "@/app/lib/spatial-presentation/executive3DObjectFaceSymbology";
import {
  applyExecutivePremiumFormAspect,
  getExecutive3DObjectFormRuntimeEpoch,
  isExecutive3DObjectPremiumFormEnabled,
  isExecutive3DObjectSymbolVisible,
  resolveExecutivePremiumObjectForm,
  subscribeExecutive3DObjectFormRuntime,
} from "@/app/lib/spatial-presentation/executive3DObjectPremiumForm";
import { ExecutiveObjectFaceSurface } from "./ExecutiveObjectFaceSurface";
import { ExecutiveObjectPremiumBody } from "./ExecutiveObjectPremiumBody";
import type {
  ExecutiveObjectDimensions,
  ExecutiveObjectGeometryFamily,
  ExecutiveObjectMaterialPresentation,
} from "@/app/lib/spatial-presentation/executiveObjectVisualFoundation";

type GeometryProps = {
  readonly family: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly material: ExecutiveObjectMaterialPresentation;
  readonly resourceKey: string;
  readonly pickingExtentScale: number;
  readonly interactive?: boolean;
  readonly objectKind?: string;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly interactionState?:
    | "overview"
    | "focused"
    | "selected"
    | "related"
    | "secondary"
    | "background";
  readonly executiveState?:
    | "normal"
    | "watch"
    | "critical"
    | "recommended"
    | "unresolved";
  readonly onSelect: () => void;
  readonly onHover: (hovered: boolean) => void;
};

/** Legacy planar constant retained for OFF-mode / compare path. */
export const EXECUTIVE_STAGE_2D_PLANAR_BODY_THICKNESS = 0;

function mixHexToward(hex: string, toward: string, amount: number): string {
  const parse = (value: string) => {
    const raw = value.replace("#", "");
    const full =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw.padStart(6, "0").slice(0, 6);
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
    };
  };
  try {
    const a = parse(hex);
    const b = parse(toward);
    const t = Math.min(1, Math.max(0, amount));
    const to = (n: number) =>
      Math.round(n).toString(16).padStart(2, "0");
    return `#${to(a.r + (b.r - a.r) * t)}${to(a.g + (b.g - a.g) * t)}${to(
      a.b + (b.b - a.b) * t,
    )}`;
  } catch {
    return hex;
  }
}

/**
 * STAGE-OBJ:1 + STAGE-3DOBJ:1 — restrained 3D executive object bodies on semantic z=0.
 * When obj3d disabled, falls back to STAGE-2D planar bodies.
 * When obj3dVisual=0, basic STAGE-OBJ:1 slabs; when ON, premium visual foundation.
 * When obj3dSurface=1, STAGE-3DOBJ:2 face symbology / surface identity.
 * When obj3dForm=1, STAGE-3DOBJ:3 premium form language (form-first).
 *
 * Geometry origin: back on plane (z≈0), front toward camera (+Z).
 */
export const ExecutiveObjectGeometryRenderer = forwardRef<Mesh, GeometryProps>(
  function ExecutiveObjectGeometryRenderer(
    {
      family,
      dimensions,
      material,
      resourceKey,
      pickingExtentScale,
      interactive = true,
      objectKind,
      presentationLevel = "minimum",
      interactionState = "overview",
      executiveState = "normal",
      onSelect,
      onHover,
    },
    ref,
  ) {
    const formRuntimeEpoch = useSyncExternalStore(
      subscribeExecutive3DObjectFormRuntime,
      getExecutive3DObjectFormRuntimeEpoch,
      () => 0,
    );
    const surfaceEnabled = isExecutive3DObjectSurfaceEnabled();
    const formEnabled = isExecutive3DObjectPremiumFormEnabled();
    const symbolsVisible = isExecutive3DObjectSymbolVisible();
    void formRuntimeEpoch;
    const profile = useMemo(
      () =>
        resolveExecutiveObject3DGeometryProfile({
          objectKind,
          geometryFamily: family,
          presentationLevel,
          width: dimensions.width,
          height: dimensions.height,
          enabled: isExecutiveObject3DGeometryEnabled(),
          interactionState,
          executiveState,
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- toggles are query/env live
      [
        objectKind,
        family,
        presentationLevel,
        dimensions.width,
        dimensions.height,
        interactionState,
        executiveState,
        isExecutive3DObjectVisualEnabled(),
        surfaceEnabled,
        formEnabled,
      ],
    );

    const visual = useMemo(
      () =>
        resolveExecutive3DObjectVisualProfile({
          objectKind,
          presentationLevel,
          interactionState,
          executiveState,
          width: profile.width,
          height: profile.height,
          enabled:
            profile.enabled &&
            profile.visualFoundation &&
            isExecutive3DObjectVisualEnabled(),
        }),
      [
        objectKind,
        presentationLevel,
        interactionState,
        executiveState,
        profile.width,
        profile.height,
        profile.enabled,
        profile.visualFoundation,
      ],
    );

    const form = useMemo(
      () =>
        resolveExecutivePremiumObjectForm({
          objectKind,
          presentationLevel,
          interactionState,
          width: profile.width,
          height: profile.height,
          enabled: profile.enabled && visual.enabled && formEnabled,
        }),
      [
        objectKind,
        presentationLevel,
        interactionState,
        profile.width,
        profile.height,
        profile.enabled,
        visual.enabled,
        formEnabled,
      ],
    );

    const sized = useMemo(
      () =>
        applyExecutivePremiumFormAspect({
          width: profile.width,
          height: profile.height,
          aspectRatio: form.aspectRatio,
          enabled: form.enabled,
        }),
      [profile.width, profile.height, form.aspectRatio, form.enabled],
    );

    const face = useMemo(
      () =>
        resolveExecutive3DObjectFaceSymbology({
          objectKind,
          presentationLevel,
          interactionState,
          executiveState,
          enabled:
            profile.enabled &&
            visual.enabled &&
            surfaceEnabled &&
            symbolsVisible,
        }),
      [
        objectKind,
        presentationLevel,
        interactionState,
        executiveState,
        profile.enabled,
        visual.enabled,
        surfaceEnabled,
        formEnabled,
        symbolsVisible,
        formRuntimeEpoch,
      ],
    );

    const width = sized.width;
    const height = sized.height;
    const depth = form.enabled ? form.depth : profile.depth;
    const radius = Math.max(width, height) * 0.5;
    const pickW = width * pickingExtentScale;
    const pickH = height * pickingExtentScale;
    const needsExpandedPick =
      interactive &&
      pickingExtentScale > 1.001 &&
      (family === "planar" ||
        family === "cylindrical" ||
        family === "orbital");

    const sideDarken = form.enabled
      ? 0.68
      : visual.enabled
        ? Math.min(visual.sideFaceDarken, face.enabled ? 0.72 : 0.82)
        : 0.88;
    const sideColor = mixHexToward(
      material.color,
      "#060b14",
      1 - sideDarken,
    );
    const frontLift = form.enabled
      ? 0.1
      : visual.enabled
        ? (visual.frontFaceContrast - 1) * (face.enabled ? 0.85 : 0.55) +
          (face.enabled ? 0.08 : 0)
        : 0.04;
    const frontColor = mixHexToward(material.color, "#ffffff", frontLift);
    // Machined recess is slightly darker than body — not a bright card plate.
    const recessColor = form.enabled
      ? mixHexToward(material.color, "#020617", 0.22)
      : frontColor;

    const bodyMaterialNode = profile.enabled ? (
      <meshStandardMaterial
        color={visual.enabled ? sideColor : material.color}
        emissive={material.emissiveColor ?? material.color}
        emissiveIntensity={Math.min(
          (material.emissiveIntensity ?? 0.2) *
            (visual.enabled ? (form.enabled ? 0.55 : 0.85) : 1) +
            (visual.enabled ? visual.emissiveCue * 0.25 : 0),
          form.enabled ? 0.18 : 0.28,
        )}
        metalness={Math.min(
          (material.metalness ?? 0.1) +
            (form.enabled ? 0.06 : visual.enabled ? 0.02 : 0),
          form.enabled ? 0.22 : 0.16,
        )}
        roughness={Math.max(
          (material.roughness ?? 0.7) +
            (form.enabled
              ? 0.12
              : visual.enabled
                ? face.enabled
                  ? 0.1
                  : 0.04
                : 0),
          form.enabled ? 0.58 : 0.62,
        )}
        transparent={material.transparent}
        opacity={material.opacity}
        envMapIntensity={form.enabled ? 0.34 : visual.enabled ? 0.28 : 0.22}
        depthWrite={material.depthWrite ?? true}
        depthTest={material.depthTest ?? true}
        toneMapped={material.toneMapped ?? true}
      />
    ) : (
      <meshBasicMaterial
        color={material.color}
        transparent={material.transparent}
        opacity={material.opacity}
        depthWrite={material.depthWrite ?? true}
        depthTest={material.depthTest ?? true}
        toneMapped={material.toneMapped ?? true}
      />
    );

    const frontMaterialNode = (
      <meshStandardMaterial
        color={frontColor}
        emissive={material.emissiveColor ?? frontColor}
        emissiveIntensity={Math.min(
          (material.emissiveIntensity ?? 0.18) *
            (form.enabled ? 0.45 : 1) +
            (visual.enabled ? visual.emissiveCue * (form.enabled ? 0.4 : 1) : 0),
          form.enabled ? 0.16 : 0.3,
        )}
        metalness={Math.min(
          (material.metalness ?? 0.08) + (form.enabled ? 0.05 : 0.02),
          form.enabled ? 0.18 : 0.14,
        )}
        roughness={Math.max(
          (material.roughness ?? 0.68) - (form.enabled ? 0.12 : 0.06),
          form.enabled ? 0.42 : 0.52,
        )}
        transparent={material.transparent}
        opacity={
          visual.frontFaceRole === "incomplete"
            ? Math.min(material.opacity * 0.88, 0.94)
            : material.opacity
        }
        envMapIntensity={form.enabled ? 0.4 : 0.34}
        depthWrite={material.depthWrite ?? true}
        depthTest={material.depthTest ?? true}
        toneMapped={material.toneMapped ?? true}
      />
    );

    const recessMaterialNode = form.enabled ? (
      <meshStandardMaterial
        color={recessColor}
        emissive={recessColor}
        emissiveIntensity={0.04}
        metalness={0.1}
        roughness={0.62}
        transparent={material.transparent}
        opacity={material.opacity}
        envMapIntensity={0.28}
        depthWrite={material.depthWrite ?? true}
        depthTest={material.depthTest ?? true}
        toneMapped={material.toneMapped ?? true}
      />
    ) : (
      frontMaterialNode
    );

    const pointerHandlers = interactive
      ? {
          onClick: (event: { stopPropagation: () => void }) => {
            event.stopPropagation();
            onSelect();
          },
          onPointerOver: (event: { stopPropagation: () => void }) => {
            event.stopPropagation();
            onHover(true);
          },
          onPointerOut: () => onHover(false),
        }
      : {};

    // ─── Planar OFF path ────────────────────────────────────────────────────
    if (!profile.enabled) {
      const bodyGeometry =
        family === "cylindrical" ||
        family === "orbital" ||
        family === "rounded" ? (
          <circleGeometry args={[radius * (family === "rounded" ? 0.92 : 1), 40]} />
        ) : family === "planar" ? (
          <planeGeometry args={[width * 1.05, height * 0.72]} />
        ) : (
          <planeGeometry args={[width, height]} />
        );

      return (
        <group
          userData={{
            geometryResourceKey: resourceKey,
            geometryFamily: family,
            geometryType: "planeGeometry",
            geometryDepth: 0,
            frontZ: 0,
            backZ: 0,
            rotationX: 0,
            rotationY: 0,
            bodyCount: 1,
            spatialLayer: "object-geometry",
            stageObj3d: false,
            stage3dobj: false,
          }}
          rotation={[0, 0, 0]}
        >
          {needsExpandedPick ? (
            <mesh castShadow={false} receiveShadow={false} {...pointerHandlers}>
              <planeGeometry args={[pickW, pickH]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          ) : null}
          <mesh
            ref={ref}
            castShadow={false}
            receiveShadow={false}
            rotation={[0, 0, 0]}
            {...(needsExpandedPick || !interactive ? {} : pointerHandlers)}
          >
            {bodyGeometry}
            {bodyMaterialNode}
          </mesh>
        </group>
      );
    }

    // ─── 3D ON path — back on plane, front toward camera ────────────────────
    const centerZ = form.enabled ? form.centerZ : profile.centerZ;
    const frontZ = form.enabled ? form.frontZ : profile.frontZ;
    const bevel = Math.max(
      0.008,
      (form.enabled ? form.bevelSize : profile.bevel) *
        (face.enabled && !form.enabled ? face.bevelFactor : 1),
    );
    const handlers =
      needsExpandedPick || !interactive ? {} : pointerHandlers;
    const visualOn = visual.enabled;
    const surfaceOn = face.enabled;
    const formOn = form.enabled;
    const frontInset = formOn
      ? form.recessInset
      : visualOn
        ? visual.frontFaceInset
        : 0;
    const frontPlateZ = frontZ - Math.max(frontInset * 0.35, 0.004);
    const frontW = formOn
      ? width * form.frontScale * (1 - form.recessInset * 0.5)
      : visualOn
        ? visual.frontFaceBounds.width
        : width * 0.9;
    const frontH = formOn
      ? height * form.frontScale * (1 - form.recessInset * 0.5)
      : visualOn
        ? visual.frontFaceBounds.height
        : height * 0.9;

    // Scenario soft-plate → soft hex when visual foundation ON (legacy path).
    const renderShape =
      visualOn && profile.shape === "soft-plate"
        ? "hex-slab"
        : profile.shape;

    let body: ReactNode = null;
    let frontFace: ReactNode = null;

    if (formOn) {
      body = (
        <ExecutiveObjectPremiumBody
          ref={ref}
          form={form}
          width={width}
          height={height}
          bodyMaterial={bodyMaterialNode}
          faceMaterial={frontMaterialNode}
          recessMaterial={recessMaterialNode}
          edgeColor={mixHexToward(frontColor, "#ffffff", 0.35)}
          interactiveHandlers={handlers}
        />
      );
    } else if (renderShape === "disc-slab") {
      body = (
        <mesh
          ref={ref}
          position={[0, 0, centerZ]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow={false}
          receiveShadow={false}
          {...handlers}
        >
          <cylinderGeometry
            args={[
              radius * (visualOn ? 0.94 : 0.92),
              radius * (visualOn ? 0.94 : 0.92),
              depth,
              visualOn ? 48 : 36,
            ]}
          />
          {bodyMaterialNode}
        </mesh>
      );
    } else if (renderShape === "hex-slab" || renderShape === "diamond-slab") {
      const zRot = renderShape === "diamond-slab" ? Math.PI / 4 : 0;
      const radial =
        Math.min(width, height) * (visualOn ? 0.5 : 0.48);
      body = (
        <mesh
          ref={ref}
          position={[0, 0, centerZ]}
          rotation={[Math.PI / 2, 0, zRot]}
          castShadow={false}
          receiveShadow={false}
          {...handlers}
        >
          <cylinderGeometry
            args={[
              radial,
              radial,
              depth,
              renderShape === "hex-slab" ? 6 : 4,
            ]}
          />
          {bodyMaterialNode}
        </mesh>
      );
    } else if (
      renderShape === "rounded-slab" ||
      (bevel > 0.012 && renderShape !== "rect-slab")
    ) {
      body = (
        <RoundedBox
          ref={ref}
          args={[width, height, depth]}
          radius={Math.max(0.012, bevel)}
          smoothness={visualOn ? 4 : 3}
          position={[0, 0, centerZ]}
          castShadow={false}
          receiveShadow={false}
          {...handlers}
        >
          {bodyMaterialNode}
        </RoundedBox>
      );
    } else {
      // Problem angular block — sharp rect with minimal bevel.
      body = (
        <mesh
          ref={ref}
          position={[0, 0, centerZ]}
          rotation={[0, 0, 0]}
          castShadow={false}
          receiveShadow={false}
          {...handlers}
        >
          <boxGeometry args={[width, height, depth]} />
          {bodyMaterialNode}
        </mesh>
      );
    }

    if (!formOn && visualOn && visual.layers.frontFace && !surfaceOn) {
      frontFace =
        renderShape === "disc-slab" ? (
          <mesh
            raycast={() => null}
            position={[0, 0, frontPlateZ]}
            rotation={[0, 0, 0]}
            castShadow={false}
            receiveShadow={false}
          >
            <circleGeometry args={[Math.min(frontW, frontH) * 0.48, 48]} />
            {frontMaterialNode}
          </mesh>
        ) : renderShape === "hex-slab" || renderShape === "diamond-slab" ? (
          <mesh
            raycast={() => null}
            position={[0, 0, frontPlateZ]}
            rotation={[0, 0, renderShape === "diamond-slab" ? Math.PI / 4 : 0]}
            castShadow={false}
            receiveShadow={false}
          >
            <circleGeometry
              args={[
                Math.min(frontW, frontH) * 0.46,
                renderShape === "hex-slab" ? 6 : 4,
              ]}
            />
            {frontMaterialNode}
          </mesh>
        ) : (
          <mesh
            raycast={() => null}
            position={[0, 0, frontPlateZ]}
            castShadow={false}
            receiveShadow={false}
          >
            <planeGeometry args={[frontW, frontH]} />
            {frontMaterialNode}
          </mesh>
        );
    }

    const faceSurface =
      surfaceOn ? (
        <ExecutiveObjectFaceSurface
          face={face}
          frontZ={frontZ}
          faceWidth={frontW}
          faceHeight={frontH}
          renderShape={
            formOn
              ? form.bodyProfile === "target-puck"
                ? "disc-slab"
                : form.bodyProfile === "faceted-diamond"
                  ? "diamond-slab"
                  : form.bodyProfile === "layered-soft-hex" ||
                      form.bodyProfile === "decisive-hex-plate"
                    ? "hex-slab"
                    : "rounded-slab"
              : renderShape === "soft-plate"
                ? "hex-slab"
                : renderShape
          }
          frontColor={frontColor}
          symbolColor={mixHexToward(
            frontColor,
            formOn ? "#cbd5e1" : "#f1f5f9",
            face.symbolContrast,
          )}
          edgeTrimColor={
            face.stateMarker === "critical-edge"
              ? "#f87171"
              : face.stateMarker === "warm-edge"
                ? "#fbbf24"
                : face.stateMarker === "positive-edge"
                  ? "#86efac"
                  : mixHexToward(frontColor, "#ffffff", formOn ? 0.28 : 0.4)
          }
          symbolOpacity={
            face.stateMarker === "incomplete-segment"
              ? 0.65
              : formOn
                ? 0.62
                : 0.98
          }
          incomplete={face.stateMarker === "incomplete-segment"}
        />
      ) : null;

    const contactCue =
      visualOn && visual.layers.contactCue && !formOn ? (
        <mesh
          raycast={() => null}
          position={[0, 0, 0.002]}
          rotation={[0, 0, 0]}
          castShadow={false}
          receiveShadow={false}
        >
          <circleGeometry args={[Math.max(width, height) * 0.42, 32]} />
          <meshBasicMaterial
            color="#020617"
            transparent
            opacity={visual.contactShadowOpacity}
            depthWrite={false}
          />
        </mesh>
      ) : null;

    return (
      <group
        userData={{
          geometryResourceKey: resourceKey,
          geometryFamily: family,
          geometryType: formOn ? form.bodyProfile : profile.shape,
          geometryDepth: depth,
          frontZ,
          backZ: formOn ? form.backZ : profile.backZ,
          rotationX: 0,
          rotationY: 0,
          bodyCount: 1,
          spatialLayer: "object-geometry",
          stageObj3d: true,
          stage3dobj: visualOn,
          stage3dobjContract: formOn
            ? "stage-3dobj-3"
            : visualOn
              ? "stage-3dobj-1"
              : "stage-obj-1",
          stage3dobjSurface: surfaceOn,
          stage3dobjSurfaceContract: surfaceOn ? "stage-3dobj-2" : "off",
          stage3dobjForm: formOn,
          stage3dobjFormContract: formOn ? "stage-3dobj-3" : "off",
          stage3dobjFormProfile: form.bodyProfile,
          stage3dobjAspectRatio: form.aspectRatio,
          stage3dobjFrontScale: form.frontScale,
          stage3dobjTaper: form.taper,
          stage3dobjRecessProfile: form.recessProfile,
          stage3dobjEdgeProfile: form.edgeProfile,
          stage3dobjSymbolKind: face.symbolKind,
          stage3dobjKind: visual.shapeFamily,
          stage3dobjDepth: depth,
          stage3dobjBevel: bevel,
          stage3dobjProfile: visual.visualShape,
          stage3dobjMaterialRole: visual.materialRole,
          geometryOrigin: "back-on-plane-front-toward-camera",
        }}
        rotation={[0, 0, 0]}
      >
        {needsExpandedPick ? (
          <mesh
            castShadow={false}
            receiveShadow={false}
            position={[0, 0, centerZ]}
            {...pointerHandlers}
          >
            <boxGeometry args={[pickW, pickH, Math.max(depth, 0.08)]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        ) : null}
        {contactCue}
        {body}
        {frontFace}
        {faceSurface}
      </group>
    );
  },
);

type EdgeGeometryProps = {
  readonly family: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly extentScale: number;
  readonly color: string;
  readonly opacity: number;
  readonly depthTest: boolean;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly objectKind?: string;
};

/**
 * Focus/selection edge — planar ring/frame outside the body silhouette.
 * Never a second volumetric shell.
 */
export function ExecutiveObjectEdgeGeometry({
  family,
  dimensions,
  extentScale,
  color,
  opacity,
  depthTest,
  presentationLevel = "minimum",
  objectKind,
}: EdgeGeometryProps) {
  const profile = resolveExecutiveObject3DGeometryProfile({
    objectKind,
    geometryFamily: family,
    presentationLevel,
    width: dimensions.width,
    height: dimensions.height,
  });
  const width = profile.width * extentScale;
  const height = profile.height * extentScale;
  const radius = Math.max(width, height) * 0.5;
  const frontZ = profile.enabled ? profile.frontZ + 0.012 : 0.01;

  const edgeMaterial = (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
      depthTest={depthTest}
    />
  );

  if (
    profile.shape === "disc-slab" ||
    family === "cylindrical" ||
    family === "orbital" ||
    family === "rounded"
  ) {
    return (
      <mesh
        raycast={() => null}
        position={[0, 0, frontZ]}
        rotation={[0, 0, 0]}
      >
        <ringGeometry args={[radius * 0.92, radius * 1.08, 48]} />
        {edgeMaterial}
      </mesh>
    );
  }

  if (profile.shape === "hex-slab" || profile.shape === "diamond-slab") {
    const zRot = profile.shape === "diamond-slab" ? Math.PI / 4 : 0;
    return (
      <mesh
        raycast={() => null}
        position={[0, 0, frontZ]}
        rotation={[0, 0, zRot]}
      >
        <ringGeometry
          args={[
            Math.min(width, height) * 0.46,
            Math.min(width, height) * 0.54,
            profile.shape === "hex-slab" ? 6 : 4,
          ]}
        />
        {edgeMaterial}
      </mesh>
    );
  }

  const stroke = Math.max(0.02, Math.min(width, height) * 0.055);
  return (
    <group raycast={() => null} position={[0, 0, frontZ]} rotation={[0, 0, 0]}>
      <mesh position={[0, height / 2 - stroke / 2, 0]}>
        <planeGeometry args={[width, stroke]} />
        {edgeMaterial}
      </mesh>
      <mesh position={[0, -(height / 2 - stroke / 2), 0]}>
        <planeGeometry args={[width, stroke]} />
        {edgeMaterial}
      </mesh>
      <mesh position={[-(width / 2 - stroke / 2), 0, 0]}>
        <planeGeometry args={[stroke, height]} />
        {edgeMaterial}
      </mesh>
      <mesh position={[width / 2 - stroke / 2, 0, 0]}>
        <planeGeometry args={[stroke, height]} />
        {edgeMaterial}
      </mesh>
    </group>
  );
}
