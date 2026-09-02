"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { NexoraDecisionTheatreDataObjectStageParticipant } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection";

type Props = Readonly<{
  participant: NexoraDecisionTheatreDataObjectStageParticipant;
  onSelect: (dataObjectId: string) => void;
}>;

/** Native R3F DATA_OBJECT renderer. Presentation-only; it owns no source state. */
export function NexoraStageDataObject({ participant, onSelect }: Props) {
  const { dataObject, presentation } = participant;
  const selected = presentation.selected;
  const unresolved = dataObject.unresolvedFieldCount > 0;
  const status = unresolved ? "Needs clarification" : "Ready";
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(dataObject.id);
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
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} onClick={select} onPointerDown={(event) => event.stopPropagation()}>
        <cylinderGeometry args={[0.42, 0.42, 0.22, 6]} />
        <meshStandardMaterial
          color="#1a2430"
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
        position={[0, -0.62, 0]}
        distanceFactor={10}
        zIndexRange={[90, 0]}
        style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}
      >
        <span
          data-testid={`nexora-stage-data-object-label-${dataObject.id}`}
          data-data-object-id={dataObject.id}
          data-source-id={dataObject.sourceId}
          data-source-type={dataObject.sourceType}
          data-source-status={unresolved ? "needs-clarification" : "ready"}
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
            Data source · CSV · {status}
          </span>
        </span>
      </Html>
    </group>
  );
}
