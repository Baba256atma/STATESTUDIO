"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION } from "@/app/lib/spatial-presentation/executiveLightingFoundation";
import {
  applyExecutiveLightingHierarchyToMaterial,
  resolveExecutiveLightingEmphasis,
} from "@/app/lib/spatial-presentation/executiveLightingHierarchy";
import { sampleExecutiveStageMotionObject } from "@/app/lib/spatial-presentation/executiveStageMotion";
import { EXECUTIVE_THREAD_GATEWAY_FOOTPRINT } from "@/app/lib/spatial-presentation/executiveThreadExpansion";
import {
  clearExecutiveStage2DLivePosition,
  publishExecutiveStage2DLivePosition,
} from "./executiveStage2DLivePositions";

type Props = {
  readonly nodes: readonly NexoraMVPContextNodePresentation[];
  readonly hoveredId: string | null;
  readonly onSelect: (subjectId: string) => void;
  readonly onHover: (subjectId: string | null) => void;
};

const KIND_COLOR: Record<string, string> = {
  object: "#7dd3fc",
  problem: "#f87171",
  scenario: "#c4b5fd",
  decision: "#fbbf24",
  execution: "#4ade80",
  "executive-thread": "#94a3b8",
};

const pickShadow = EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.pickingHelpers;

function ContextNodeMesh({
  node,
  hoveredId,
  onSelect,
  onHover,
}: {
  readonly node: NexoraMVPContextNodePresentation;
  readonly hoveredId: string | null;
  readonly onSelect: (subjectId: string) => void;
  readonly onHover: (subjectId: string | null) => void;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [pressed, setPressed] = useState(false);
  const hovered = hoveredId === node.subjectId;
  const color = KIND_COLOR[node.kind] ?? KIND_COLOR.object;
  const isAnchor = node.role === "source-anchor";
  const isCollapsedThread = node.role === "collapsed-thread";
  const isDiscoverableGateway =
    isCollapsedThread && node.gatewayMode !== "quiet-collapse";
  const isQuietCollapse =
    isCollapsedThread && node.gatewayMode === "quiet-collapse";
  const interactive = node.interactive !== false;
  const labelVisible = node.labelVisible !== false;
  const footprint = EXECUTIVE_THREAD_GATEWAY_FOOTPRINT;
  const hitWidth = isQuietCollapse
    ? footprint.collapseHitWidth
    : isDiscoverableGateway
      ? footprint.hitWidth
      : isCollapsedThread
        ? footprint.hitWidth
        : 0.7;
  const hitHeight = isQuietCollapse
    ? footprint.collapseHitHeight
    : isDiscoverableGateway
      ? footprint.hitHeight
      : isCollapsedThread
        ? footprint.hitHeight
        : 0.7;
  const gatewayCount = node.gatewayCount ?? node.collapsedMemberIds?.length ?? 0;

  const lightingEmphasis = useMemo(
    () =>
      resolveExecutiveLightingEmphasis({
        objectId: node.subjectId,
        focused: node.focused,
        presentationTarget: "context-node",
        spatialRole: node.focused ? "focus" : "background",
        stageRole: node.focused ? "focused" : "unrelated",
      }),
    [node.focused, node.subjectId],
  );

  const lightingMaterial = useMemo(
    () =>
      applyExecutiveLightingHierarchyToMaterial(
        Object.freeze({
          color,
          emissiveColor: color,
          emissiveIntensity: node.focused ? 0.22 : 0.1,
          roughness: 0.58,
          metalness: 0.18,
          opacity: node.opacity,
          transparent: true,
          envMapIntensity: 0.3,
        }),
        lightingEmphasis,
      ),
    [color, lightingEmphasis, node.focused, node.opacity],
  );

  // Seed once — never bind declarative position (fights STAGE-MOTION:1).
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || group.userData.__nexoraLayoutSeeded === true) return;
    const [tx, ty, tz] = node.targetPosition;
    group.position.set(tx, ty, tz);
    group.userData.__nexoraLayoutSeeded = true;
    publishExecutiveStage2DLivePosition(node.id, [tx, ty, tz]);
    publishExecutiveStage2DLivePosition(node.subjectId, [tx, ty, tz]);
  }, [node.id, node.subjectId, node.targetPosition]);

  useLayoutEffect(() => {
    return () => {
      clearExecutiveStage2DLivePosition(node.id);
      clearExecutiveStage2DLivePosition(node.subjectId);
    };
  }, [node.id, node.subjectId]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const hoverScale = isDiscoverableGateway
      ? pressed
        ? 0.97
        : hovered
          ? 1.04
          : 1
      : hovered
        ? 1.08
        : 1;
    const sample = sampleExecutiveStageMotionObject(node.id, now, {
      position: node.targetPosition,
      opacity: lightingMaterial.opacity,
      scale: node.scale * hoverScale,
      visible: node.opacity > 0.04,
    });
    group.position.set(
      sample.position[0],
      sample.position[1],
      sample.position[2],
    );
    publishExecutiveStage2DLivePosition(node.id, [
      sample.position[0],
      sample.position[1],
      sample.position[2],
    ]);
    publishExecutiveStage2DLivePosition(node.subjectId, [
      sample.position[0],
      sample.position[1],
      sample.position[2],
    ]);
    group.scale.setScalar(sample.scale);
    group.visible = sample.visible;

    const mesh = meshRef.current;
    if (mesh && "opacity" in mesh.material) {
      const material = mesh.material as {
        opacity: number;
        emissiveIntensity?: number;
        roughness?: number;
        envMapIntensity?: number;
      };
      material.opacity = sample.opacity;
      if (typeof material.emissiveIntensity === "number") {
        material.emissiveIntensity = lightingMaterial.emissiveIntensity;
      }
      if (typeof material.roughness === "number") {
        material.roughness = lightingMaterial.roughness;
      }
      if (typeof material.envMapIntensity === "number") {
        material.envMapIntensity = lightingMaterial.envMapIntensity;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      userData={{
        contextId: node.id,
        subjectId: node.subjectId,
        kind: node.kind,
        role: node.role,
        opacity: node.opacity,
        scale: node.scale,
        focused: node.focused,
        visualAudit: isDiscoverableGateway
          ? "stage-thread-gateway"
          : "stage-context",
        lightingEmphasisLevel: lightingEmphasis.level,
        lightingEmphasisRank: lightingEmphasis.rank,
        contextVisibility:
          node.opacity >= 0.5 ? "revealed" : "hidden-or-background",
        stageMotionAuthority: "stage-motion-1",
        gatewayMode: node.gatewayMode ?? null,
      }}
    >
      {interactive ? (
        <mesh
          castShadow={pickShadow.castShadow}
          receiveShadow={pickShadow.receiveShadow}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(node.subjectId);
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            setPressed(true);
          }}
          onPointerUp={() => setPressed(false)}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(node.subjectId);
            if (typeof document !== "undefined") {
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={() => {
            setPressed(false);
            onHover(null);
            if (typeof document !== "undefined") {
              document.body.style.cursor = "auto";
            }
          }}
        >
          <planeGeometry args={[hitWidth, hitHeight]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ) : null}

      {isCollapsedThread ? (
        <Html
          center
          distanceFactor={9.2}
          position={[0, 0, 0.02]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            data-testid={`nexora-thread-gateway-${node.subjectId}`}
            data-canonical-id={node.id}
            data-context-subject={node.subjectId}
            data-kind={node.kind}
            data-role={node.role}
            data-gateway-mode={node.gatewayMode ?? "discoverable-collapsed"}
            data-gateway-count={String(gatewayCount)}
            data-gateway-hit-target="true"
            data-visual-audit={
              isDiscoverableGateway
                ? "stage-thread-gateway"
                : "stage-thread-collapse"
            }
            aria-label={
              isQuietCollapse
                ? "Collapse Executive Thread"
                : `Open Executive Thread with ${gatewayCount} items`
            }
            aria-expanded={isQuietCollapse ? "true" : "false"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isQuietCollapse ? "0.28rem" : "0.42rem",
              minWidth: isQuietCollapse ? "7.2rem" : "10.5rem",
              padding: isQuietCollapse
                ? "0.28rem 0.55rem"
                : "0.42rem 0.72rem",
              borderRadius: "999px",
              border: hovered
                ? "1px solid rgba(148, 197, 232, 0.85)"
                : isQuietCollapse
                  ? "1px solid rgba(100, 116, 139, 0.55)"
                  : "1px solid rgba(125, 168, 204, 0.72)",
              background: hovered
                ? "rgba(18, 36, 58, 0.92)"
                : isQuietCollapse
                  ? "rgba(10, 18, 30, 0.72)"
                  : "rgba(12, 24, 40, 0.88)",
              boxShadow: hovered
                ? "0 0 0 1px rgba(56, 120, 180, 0.25)"
                : "0 6px 18px rgba(2, 6, 14, 0.45)",
              color: hovered ? "#f8fafc" : "rgba(226, 232, 240, 0.92)",
              fontFamily:
                '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
              fontSize: isQuietCollapse ? "10px" : "11.5px",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              opacity: isQuietCollapse ? 0.82 : 1,
              transform: pressed
                ? "scale(0.97)"
                : hovered
                  ? "scale(1.02)"
                  : "scale(1)",
              transition:
                "border-color 120ms ease, background 120ms ease, transform 120ms ease",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: isQuietCollapse ? "0.38rem" : "0.48rem",
                height: isQuietCollapse ? "0.38rem" : "0.48rem",
                borderRadius: "999px",
                border: "1.5px solid rgba(148, 197, 232, 0.9)",
                boxShadow: "inset 0 0 0 2px rgba(12, 24, 40, 0.9)",
                background: "rgba(56, 120, 180, 0.35)",
                flex: "0 0 auto",
              }}
            />
            <span data-testid={`nexora-context-label-${node.subjectId}`}>
              {node.label}
            </span>
          </div>
        </Html>
      ) : (
        <mesh
          ref={meshRef}
          castShadow={false}
          receiveShadow={false}
          rotation={[0, 0, node.kind === "decision" ? Math.PI / 4 : 0]}
        >
          {isAnchor || node.kind === "object" ? (
            <planeGeometry args={[0.34, 0.34]} />
          ) : node.kind === "decision" ? (
            <planeGeometry args={[0.3, 0.3]} />
          ) : node.kind === "execution" ? (
            <circleGeometry args={[0.2, 28]} />
          ) : (
            <circleGeometry args={[0.22, 28]} />
          )}
          <meshBasicMaterial
            color={lightingMaterial.color}
            transparent
            opacity={Math.min(
              lightingMaterial.opacity,
              node.role === "context"
                ? 0.55
                : Math.min(lightingMaterial.opacity, 0.85),
            )}
            depthWrite={false}
            wireframe={node.kind === "scenario"}
          />
        </mesh>
      )}

      {!isCollapsedThread && labelVisible ? (
        <Html
          center
          distanceFactor={10}
          position={[0, 0.55, 0]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
            fontSize: node.role === "context" ? "9px" : "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: hovered || node.focused ? "#f8fafc" : "rgba(226,232,240,0.7)",
            textShadow: "0 1px 8px rgba(2, 6, 14, 0.85)",
            opacity: node.role === "context" ? 0.9 : 1,
          }}
        >
          <span
            data-testid={`nexora-context-label-${node.subjectId}`}
            data-canonical-id={node.id}
            data-context-subject={node.subjectId}
            data-kind={node.kind}
            data-role={node.role}
            data-opacity={String(node.opacity)}
            data-scale={String(node.scale)}
            data-context-visibility={
              node.opacity >= 0.5 ? "revealed" : "hidden-or-background"
            }
            data-context-peer="false"
            data-visual-audit="stage-context-label"
          >
            {node.label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

/**
 * Contextual Problem / Scenario / Decision / Execution nodes.
 * Presentation only — selection forwarded to interaction coordinator.
 * STAGE-THREAD:1-FIX — collapsed thread renders as discoverable gateway capsule.
 */
export function NexoraStageContextNodes({
  nodes,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  if (nodes.length === 0) return null;
  return (
    <group>
      {nodes.map((node) => (
        <ContextNodeMesh
          key={node.id}
          node={node}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
