"use client";

import { Html } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Plane, Raycaster, Vector2, Vector3 } from "three";
import type { NexoraDecisionTheatreDataObjectStageParticipant } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection";
import {
  EXECUTIVE_STAGE_LABEL_MEASUREMENT,
  resolveExecutiveStageSharedCaptionBox,
} from "@/app/lib/spatial-presentation/executiveStageObjectLabelTerritory";
import { stageDragMove } from "./stageDataObjectDragEpoch";

type Props = Readonly<{
  participant: NexoraDecisionTheatreDataObjectStageParticipant;
  onSelect: (dataObjectId: string) => void;
  onReposition?: (dataObjectId: string, position: { x: number; y: number; z: 0 }) => boolean;
  spatialEpoch?: string;
}>;

/** Native R3F DATA_OBJECT renderer. Presentation-only; it owns no source state. */
export function NexoraStageDataObject({
  participant,
  onSelect,
  onReposition,
  spatialEpoch = "",
}: Props) {
  const { dataObject, presentation } = participant;
  const selected = presentation.selected;
  const unresolved = dataObject.unresolvedFieldCount > 0;
  const status = unresolved ? "Needs clarification" : "Ready";
  const caption = resolveExecutiveStageSharedCaptionBox({
    ownerX: 0,
    ownerY: 0,
    halfExtent: 0.45,
    kind: "object",
    lines: dataObject.decisionDomain
      ? [dataObject.label, `${dataObject.decisionDomain.kind} · ${dataObject.decisionDomain.lifecycleStatus}`]
      : [dataObject.label, `Data source · CSV · ${status}`],
    side: presentation.labelSide,
  });
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(dataObject.id);
  };
  const { camera, gl } = useThree();
  const dragging = useRef(false);
  const dragEpoch = useRef(spatialEpoch);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new Raycaster(), []);
  const pointer = useMemo(() => new Vector2(), []);
  const hit = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const element = gl.domElement;
    const move = (event: PointerEvent) => {
      const dragMove = stageDragMove(dragging.current, dragEpoch.current, spatialEpoch);
      if (dragMove === "idle" || !onReposition) return;
      if (dragMove === "cancel") {
        dragging.current = false;
        return;
      }
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.ray.intersectPlane(plane, hit)) return;
      onReposition(dataObject.id, { x: hit.x, y: hit.y, z: 0 });
    };
    const stop = () => {
      dragging.current = false;
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", stop);
    element.addEventListener("pointercancel", stop);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", stop);
      element.removeEventListener("pointercancel", stop);
    };
  }, [camera, dataObject.id, gl, hit, onReposition, plane, pointer, raycaster, spatialEpoch]);
  const beginDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragging.current = true;
    dragEpoch.current = spatialEpoch;
  };

  return (
    <group
      position={presentation.targetPosition}
      scale={presentation.scale}
      userData={{
        objectId: dataObject.id,
        canonicalId: dataObject.id,
        sourceId: dataObject.sourceId,
        sourceType: dataObject.sourceType,
        visualFamily: dataObject.visualFamily,
        stageInstanceId: `stage:${dataObject.id}`,
        projectionAuthority: participant.placementAuthority,
        visibilityReason: participant.visibilityReason,
        selected,
        businessFocus: false,
        writesDataReality: false,
        visualAudit: "stage-data-object",
      }}
    >
      {/* Hexagonal source token — engineered family form, not an executive body. */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} onClick={select} onPointerDown={beginDrag}>
        <cylinderGeometry args={[0.42, 0.42, 0.22, 6]} />
        <meshStandardMaterial
          color={dataObject.impactRole === "DIRECT_TARGET" ? "#9a3412" : dataObject.impactRole === "CONNECTED_OBJECT" ? "#075985" : dataObject.decisionDomain ? "#134e4a" : "#1a2430"}
          metalness={0.7}
          roughness={0.32}
          emissive={selected ? "#2a3d4f" : "#0b121a"}
          emissiveIntensity={selected ? 0.28 : 0.1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} position={[0, 0, 0.02]} onClick={select}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.78} roughness={0.28} />
      </mesh>

      {/* CSV subtype lattice — form identity, not a file icon and not color coding. */}
      {[-0.09, 0, 0.09].map((x) => (
        <mesh key={`v-${x}`} position={[x, 0.02, 0.14]} onClick={select}>
          <boxGeometry args={[0.028, 0.2, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.74} roughness={0.3} />
        </mesh>
      ))}
      {[-0.07, 0.07].map((y) => (
        <mesh key={`h-${y}`} position={[0, y, 0.14]} onClick={select}>
          <boxGeometry args={[0.22, 0.022, 0.02]} />
          <meshStandardMaterial color="#7d8b99" metalness={0.7} roughness={0.34} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.28, 0.13]} onClick={select}>
        <cylinderGeometry args={[0.055, 0.055, 0.03, 4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.68} roughness={0.26} />
      </mesh>

      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
          <ringGeometry args={[0.5, 0.55, 6]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.42} depthWrite={false} />
        </mesh>
      ) : null}
      {unresolved ? (
        <mesh position={[0.3, 0.22, 0.16]}>
          <circleGeometry args={[0.032, 12]} />
          <meshBasicMaterial color="#c9a86a" transparent opacity={0.86} />
        </mesh>
      ) : null}

      <Html
        center
        position={[caption.offsetX, caption.offsetY, 0]}
        distanceFactor={EXECUTIVE_STAGE_LABEL_MEASUREMENT.distanceFactor}
        zIndexRange={[90, 0]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          transformOrigin: EXECUTIVE_STAGE_LABEL_MEASUREMENT.paintOrigin,
        }}
      >
        <span
          data-testid={`nexora-stage-data-object-label-${dataObject.id}`}
          data-data-object-id={dataObject.id}
          data-source-id={dataObject.sourceId}
          data-source-type={dataObject.sourceType}
          data-source-status={unresolved ? "needs-clarification" : "ready"}
          data-label-side={presentation.labelSide}
          data-stage-position={presentation.targetPosition.join(",")}
          data-impact-role={dataObject.impactRole ?? "none"}
          aria-label={`Data source ${dataObject.label}, CSV, ${status}`}
          style={{
            display: "grid",
            gap: 2,
            color: "rgba(241,245,249,0.92)",
            fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.045em",
            textAlign: "center",
            textShadow: "0 1px 6px rgba(2,6,14,0.82)",
          }}
        >
          <span>{dataObject.label}</span>
          <span style={{ color: "rgba(148,163,184,0.8)", fontSize: 7, textTransform: "uppercase" }}>
            {dataObject.organizational ? dataObject.organizational.objectType : `Data source · CSV · ${status}`}
          </span>
        </span>
      </Html>
    </group>
  );
}
