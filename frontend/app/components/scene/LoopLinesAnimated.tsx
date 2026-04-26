"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

import type { SceneLoop } from "../../lib/sceneTypes";
import type { DecisionPathRendererEdge } from "../overlays/DecisionPathOverlayLayer";
import { getThemeTokens } from "../../lib/design/designTokens";
import { resolveRelationVisualProfile } from "../../lib/visual/objectVisualLanguage";
import {
  classifyRelationRole,
  getInteractionProfile,
  getNarrativeEdgeStyle,
  getObjPos,
  getRelationEmphasisStyle,
  getSimulationEdgeStyle,
  normalizeScannerLabelSeverity,
  type InteractionRole,
  type RelationRole,
  type ScannerStoryReveal,
  type SimulatedPathEdge,
} from "./sceneRenderUtils";

type LoopEdge = {
  from: string;
  to: string;
  weight: number;
  polarity: string;
  loopId: string;
  label?: string;
  kind?: string;
};

export type LoopLinesAnimatedProps = {
  objects: any[];
  loops: SceneLoop[];
  activeLoopId: string | null;
  showLoops: boolean | undefined;
  showLoopLabels?: boolean;
  modeId?: string;
  theme?: "day" | "night" | "stars";
  scannerSceneActive?: boolean;
  primaryId?: string | null;
  affectedIds?: string[];
  contextIds?: string[];
  scannerFragilityScore?: number;
  scannerStoryReveal?: ScannerStoryReveal;
  hoveredId?: string | null;
  hoveredInteractionRole?: InteractionRole;
  attentionMemoryStrengthById?: Map<string, number>;
  narrativeFocusStrength?: number;
  narrativePathEdges?: Array<{ from: string; to: string }>;
  simulationSourceId?: string | null;
  simulationPathEdges?: SimulatedPathEdge[];
  decisionPathEdges?: DecisionPathRendererEdge[];
};

function buildLineSegmentsGeometry(edgeList: LoopEdge[], posMap: Map<string, [number, number, number]>) {
  const positions: number[] = [];
  edgeList.forEach((edge) => {
    const from = posMap.get(edge.from);
    const to = posMap.get(edge.to);
    if (!from || !to) return;
    positions.push(...from, ...to);
  });
  if (positions.length === 0) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function cloneOffsetGeometry(baseGeometry: THREE.BufferGeometry, offset: number) {
  const geometry = baseGeometry.clone();
  if (offset === 0) return geometry;
  const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
  const array = positionAttribute.array as Float32Array;
  for (let i = 0; i < array.length; i += 3) {
    array[i + 1] += offset;
  }
  positionAttribute.needsUpdate = true;
  return geometry;
}

export const LoopLinesAnimated = React.memo(function LoopLinesAnimated({
  objects,
  loops,
  activeLoopId,
  showLoops,
  showLoopLabels,
  modeId,
  theme = "night",
  scannerSceneActive = false,
  primaryId = null,
  affectedIds = [],
  contextIds = [],
  scannerFragilityScore = 0,
  scannerStoryReveal = { primary: 1, edge: 1, affected: 1, context: 1 },
  hoveredId = null,
  hoveredInteractionRole = "neutral",
  attentionMemoryStrengthById = new Map<string, number>(),
  narrativeFocusStrength = 0,
  narrativePathEdges = [],
  simulationSourceId = null,
  simulationPathEdges = [],
  decisionPathEdges = [],
}: LoopLinesAnimatedProps) {
  void simulationSourceId;
  const tokens = useMemo(() => getThemeTokens(theme, modeId), [theme, modeId]);
  const relationSeverity = normalizeScannerLabelSeverity(undefined, scannerFragilityScore);
  const hoveredInteractionProfile = getInteractionProfile(hoveredInteractionRole);

  const narrativePathEdgeSet = useMemo(
    () => new Set(narrativePathEdges.flatMap((edge) => [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`])),
    [narrativePathEdges]
  );

  const simulationEdgeStrengthByKey = useMemo(() => {
    const map = new Map<string, { depth: number; strength: number }>();
    simulationPathEdges.forEach((edge) => {
      const keys = [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`];
      keys.forEach((key) => {
        const existing = map.get(key);
        if (!existing || edge.strength > existing.strength) {
          map.set(key, { depth: edge.depth, strength: edge.strength });
        }
      });
    });
    return map;
  }, [simulationPathEdges]);

  const decisionPathEdgeByKey = useMemo(() => {
    const map = new Map<string, DecisionPathRendererEdge>();
    decisionPathEdges.forEach((edge) => {
      const keys = [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`];
      keys.forEach((key) => {
        const existing = map.get(key);
        if (!existing || edge.strength > existing.strength) {
          map.set(key, edge);
        }
      });
    });
    return map;
  }, [decisionPathEdges]);

  const getEdgeMemoryStrength = (edgeList: LoopEdge[]) =>
    edgeList.reduce(
      (maxStrength, edge) =>
        Math.max(
          maxStrength,
          attentionMemoryStrengthById.get(edge.from) ?? 0,
          attentionMemoryStrengthById.get(edge.to) ?? 0
        ),
      0
    );

  const getDecisionNarrativeRole = (edgeList: LoopEdge[]) =>
    edgeList.some((edge) => {
      const decisionEdge = decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`);
      return decisionEdge?.narrativeRole === "path" || narrativePathEdgeSet.has(`${edge.from}::${edge.to}`);
    })
      ? "path"
      : edgeList.some((edge) => decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`)?.narrativeRole === "secondary")
      ? "secondary"
      : edgeList.some(
          (edge) =>
            primaryId === edge.from ||
            primaryId === edge.to ||
            affectedIds.includes(edge.from) ||
            affectedIds.includes(edge.to) ||
            contextIds.includes(edge.from) ||
            contextIds.includes(edge.to)
        )
      ? "secondary"
      : "outside";

  const getCombinedSimulationEdge = (edgeList: LoopEdge[]): { depth: number; strength: number } | null =>
    edgeList.reduce<{ depth: number; strength: number } | null>((best, edge) => {
      const current =
        simulationEdgeStrengthByKey.get(`${edge.from}::${edge.to}`) ??
        (() => {
          const decisionEdge = decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`);
          return decisionEdge ? { depth: decisionEdge.depth, strength: decisionEdge.strength } : null;
        })();
      if (!current) return best;
      if (!best || current.strength > best.strength) return current;
      return best;
    }, null);

  const inactiveProfile = useMemo(
    () => resolveRelationVisualProfile({ kind: "dependency", active: false, mode_id: modeId }),
    [modeId]
  );

  const posMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    objects.forEach((object: any, index: number) => {
      const id = String(object?.id ?? `obj_${index}`);
      const position = getObjPos(id, objects);
      map.set(id, [position.x, position.y, position.z]);
    });
    return map;
  }, [objects]);

  const edges = useMemo(() => {
    const all: LoopEdge[] = [];
    loops.forEach((loop, loopIndex) => {
      const loopId = loop?.id ?? `loop_${loopIndex}`;
      const strength =
        typeof (loop as any)?.severity === "number"
          ? Math.min(1, Math.max(0, (loop as any).severity))
          : typeof (loop as any)?.strength === "number"
          ? Math.min(1, Math.max(0, (loop as any).strength))
          : 0.5;

      const polarity = ((loop as any)?.polarity as string) ?? "neutral";
      if (!Array.isArray(loop?.edges)) return;
      loop.edges.forEach((edge, edgeIndex) => {
        const from = String((edge as any)?.from ?? "");
        const to = String((edge as any)?.to ?? "");
        if (!from || !to) return;
        const weight = typeof (edge as any)?.weight === "number" ? Math.min(1, Math.max(0, (edge as any).weight)) : strength;
        const resolvedPolarity = ((edge as any)?.polarity as string) ?? ((edge as any)?.kind as string) ?? polarity;
        all.push({
          from,
          to,
          weight,
          polarity: resolvedPolarity,
          loopId,
          label: (edge as any)?.label ?? (loop as any)?.label,
          kind: (edge as any)?.kind ?? (loop as any)?.type ?? polarity ?? `edge_${edgeIndex}`,
        });
      });
    });
    return all;
  }, [loops]);

  const activeEdges = useMemo(() => edges.filter((edge) => activeLoopId && edge.loopId === activeLoopId), [edges, activeLoopId]);
  const inactiveEdges = useMemo(() => edges.filter((edge) => !activeLoopId || edge.loopId !== activeLoopId), [edges, activeLoopId]);
  const safeInactiveEdges = Array.isArray(inactiveEdges) ? inactiveEdges : [];
  const safeActiveEdges = Array.isArray(activeEdges) ? activeEdges : [];

  const activeWeightMean = useMemo(() => {
    if (!safeActiveEdges.length) return 0;
    const total = safeActiveEdges.reduce((sum, edge) => sum + Math.min(1, Math.max(0, Number(edge.weight ?? 0.5))), 0);
    return Math.min(1, Math.max(0, total / safeActiveEdges.length));
  }, [safeActiveEdges]);

  const groupedEdges = useMemo(() => {
    const makeGroups = (edgeList: LoopEdge[]) => {
      const groups = new Map<RelationRole, LoopEdge[]>();
      edgeList.forEach((edge) => {
        const relationRole = scannerSceneActive
          ? classifyRelationRole({
              fromId: edge.from,
              toId: edge.to,
              primaryId,
              affectedIds,
              contextIds,
            })
          : "neutral";
        const existing = groups.get(relationRole) ?? [];
        existing.push(edge);
        groups.set(relationRole, existing);
      });
      return groups;
    };
    return {
      inactive: makeGroups(safeInactiveEdges),
      active: makeGroups(safeActiveEdges),
    };
  }, [affectedIds, contextIds, primaryId, safeActiveEdges, safeInactiveEdges, scannerSceneActive]);

  const inactiveGeo = useMemo(() => buildLineSegmentsGeometry(safeInactiveEdges, posMap), [safeInactiveEdges, posMap]);
  const activeGeo = useMemo(() => buildLineSegmentsGeometry(safeActiveEdges, posMap), [safeActiveEdges, posMap]);

  useEffect(() => () => {
    try {
      inactiveGeo?.dispose();
    } catch {}
  }, [inactiveGeo]);

  useEffect(() => () => {
    try {
      activeGeo?.dispose();
    } catch {}
  }, [activeGeo]);

  const inactiveMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: inactiveProfile.color || tokens.design.colors.relationNeutral,
        transparent: true,
        opacity: safeActiveEdges.length > 0 ? inactiveProfile.opacity : Math.max(0.18, inactiveProfile.opacity),
      }),
    [inactiveProfile.color, inactiveProfile.opacity, safeActiveEdges.length, tokens.design.colors.relationNeutral]
  );

  const activeMaterials = useMemo(() => {
    const leadProfile = resolveRelationVisualProfile({
      kind: safeActiveEdges[0]?.kind,
      polarity: safeActiveEdges[0]?.polarity,
      active: true,
      mode_id: modeId,
    });
    const color = leadProfile.color as THREE.ColorRepresentation;
    const baseOpacity = Math.min(1, leadProfile.opacity + activeWeightMean * 0.18);
    return [
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: baseOpacity }),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: baseOpacity }),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: baseOpacity }),
    ];
  }, [safeActiveEdges, activeWeightMean, modeId]);

  const scannerInactiveGroups = useMemo(() => {
    if (!scannerSceneActive) return [] as Array<{
      role: RelationRole;
      isHovered: boolean;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
    }>;
    const groups: Array<{
      role: RelationRole;
      isHovered: boolean;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
    }> = [];
    groupedEdges.inactive.forEach((edgeList, role) => {
      const geometry = buildLineSegmentsGeometry(edgeList, posMap);
      if (!geometry) return;
      const isHovered = !!hoveredId && edgeList.some((edge) => edge.from === hoveredId || edge.to === hoveredId);
      const leadProfile = resolveRelationVisualProfile({
        kind: edgeList[0]?.kind,
        polarity: edgeList[0]?.polarity,
        active: false,
        mode_id: modeId,
      });
      const style = getRelationEmphasisStyle({ relationRole: role, severity: relationSeverity, theme, active: false });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
          ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
          : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
          ? scannerStoryReveal.context
          : 1;
      const revealOpacity = 0.42 + relationReveal * 0.58;
      const memoryBoost = getEdgeMemoryStrength(edgeList);
      const narrativeRole = getDecisionNarrativeRole(edgeList);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(edgeList);
      const simulationStyle = simulationEdge ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength) : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      const color = new THREE.Color(leadProfile.color || inactiveProfile.color || tokens.design.colors.relationNeutral);
      color.multiplyScalar(
        (0.88 + (style.colorMul - 0.88) * revealOpacity) *
          interactionBoost *
          (1 + memoryBoost * 0.08) *
          narrativeStyle.colorMul *
          simulationStyle.colorMul
      );
      groups.push({
        role,
        isHovered,
        geometry,
        material: new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: Math.min(
            1,
            style.opacity *
              revealOpacity *
              interactionBoost *
              (1 + memoryBoost * 0.12) *
              narrativeStyle.opacityMul *
              simulationStyle.opacityMul
          ),
        }),
      });
    });
    return groups;
  }, [getCombinedSimulationEdge, groupedEdges.inactive, hoveredId, hoveredInteractionProfile.edgeBoost, inactiveProfile.color, modeId, narrativeFocusStrength, posMap, relationSeverity, scannerSceneActive, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.edge, theme, tokens.design.colors.relationNeutral]);

  const scannerActiveGroups = useMemo(() => {
    if (!scannerSceneActive) return [] as Array<{
      role: RelationRole;
      isHovered: boolean;
      geos: THREE.BufferGeometry[];
      materials: THREE.LineBasicMaterial[];
    }>;
    const groups: Array<{
      role: RelationRole;
      isHovered: boolean;
      geos: THREE.BufferGeometry[];
      materials: THREE.LineBasicMaterial[];
    }> = [];
    groupedEdges.active.forEach((edgeList, role) => {
      const baseGeometry = buildLineSegmentsGeometry(edgeList, posMap);
      if (!baseGeometry) return;
      const isHovered = !!hoveredId && edgeList.some((edge) => edge.from === hoveredId || edge.to === hoveredId);
      const leadProfile = resolveRelationVisualProfile({
        kind: edgeList[0]?.kind,
        polarity: edgeList[0]?.polarity,
        active: true,
        mode_id: modeId,
      });
      const style = getRelationEmphasisStyle({ relationRole: role, severity: relationSeverity, theme, active: true });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
          ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
          : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
          ? scannerStoryReveal.context
          : 1;
      const revealOpacity = role === "primary_to_affected" ? 0.52 + relationReveal * 0.48 : 0.32 + relationReveal * 0.38;
      const memoryBoost = getEdgeMemoryStrength(edgeList);
      const narrativeRole = getDecisionNarrativeRole(edgeList);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(edgeList);
      const simulationStyle = simulationEdge ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength) : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      const color = new THREE.Color(leadProfile.color || tokens.design.colors.relationNeutral);
      color.multiplyScalar(
        (0.9 + (style.colorMul - 0.9) * revealOpacity) *
          interactionBoost *
          (1 + memoryBoost * 0.1) *
          narrativeStyle.colorMul *
          simulationStyle.colorMul
      );
      const baseOpacity = Math.min(
        1,
        style.opacity *
          revealOpacity *
          interactionBoost *
          (1 + memoryBoost * 0.14) *
          narrativeStyle.opacityMul *
          simulationStyle.opacityMul
      );
      const materials = Array.from({ length: style.lineCopies }, (_, index) =>
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: index === 0 ? baseOpacity : Math.max(0.08, baseOpacity * 0.46),
        })
      );
      const geos = materials.map((_, index) => {
        const offset = index === 0 ? 0 : index % 2 === 1 ? 0.006 * index : -0.006 * index;
        return cloneOffsetGeometry(baseGeometry, offset);
      });
      baseGeometry.dispose();
      groups.push({ role, isHovered, geos, materials });
    });
    return groups;
  }, [getCombinedSimulationEdge, groupedEdges.active, hoveredId, hoveredInteractionProfile.edgeBoost, modeId, narrativeFocusStrength, posMap, relationSeverity, scannerSceneActive, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.edge, theme, tokens.design.colors.relationNeutral]);

  useEffect(() => () => {
    try {
      inactiveMat.dispose();
    } catch {}
  }, [inactiveMat]);

  useEffect(() => () => {
    activeMaterials.forEach((material) => {
      try {
        material.dispose();
      } catch {}
    });
  }, [activeMaterials]);

  useEffect(() => {
    const base = 0.26 + activeWeightMean * 0.16;
    activeMaterials.forEach((material) => {
      material.opacity = Math.min(1, base + 0.26);
    });
    scannerActiveGroups.forEach(({ role, isHovered, materials }) => {
      const style = getRelationEmphasisStyle({ relationRole: role, severity: relationSeverity, theme, active: true });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
            ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
            : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
              ? scannerStoryReveal.context
              : 1;
      const revealOpacity = role === "primary_to_affected" ? 0.52 + relationReveal * 0.48 : 0.32 + relationReveal * 0.38;
      const roleEdges = groupedEdges.active.get(role) ?? [];
      const memoryBoost = materials.length > 0 ? getEdgeMemoryStrength(roleEdges) : 0;
      const narrativeRole = getDecisionNarrativeRole(roleEdges);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(roleEdges);
      const simulationStyle = simulationEdge ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength) : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      materials.forEach((material, index) => {
        const baseOpacity =
          style.opacity *
          revealOpacity *
          interactionBoost *
          (1 + memoryBoost * 0.14) *
          narrativeStyle.opacityMul *
          simulationStyle.opacityMul;
        const layeredOpacity = index === 0 ? baseOpacity : Math.max(0.08, baseOpacity * 0.46);
        material.opacity = Math.min(1, layeredOpacity);
      });
    });
  }, [
    activeMaterials,
    activeWeightMean,
    getCombinedSimulationEdge,
    getDecisionNarrativeRole,
    getEdgeMemoryStrength,
    groupedEdges.active,
    hoveredInteractionProfile.edgeBoost,
    narrativeFocusStrength,
    relationSeverity,
    scannerActiveGroups,
    scannerStoryReveal.affected,
    scannerStoryReveal.context,
    scannerStoryReveal.edge,
    theme,
  ]);

  const activeGeos = useMemo(() => {
    if (!activeGeo) return [] as THREE.BufferGeometry[];
    return activeMaterials.map((_, index) => cloneOffsetGeometry(activeGeo, index === 0 ? 0 : index === 1 ? 0.007 : -0.007));
  }, [activeGeo, activeMaterials]);

  useEffect(() => () => {
    activeGeos.forEach((geometry) => {
      try {
        geometry.dispose();
      } catch {}
    });
  }, [activeGeos]);

  useEffect(() => () => {
    scannerInactiveGroups.forEach(({ geometry, material }) => {
      try {
        geometry.dispose();
      } catch {}
      try {
        material.dispose();
      } catch {}
    });
  }, [scannerInactiveGroups]);

  useEffect(() => () => {
    scannerActiveGroups.forEach(({ geos, materials }) => {
      geos.forEach((geometry) => {
        try {
          geometry.dispose();
        } catch {}
      });
      materials.forEach((material) => {
        try {
          material.dispose();
        } catch {}
      });
    });
  }, [scannerActiveGroups]);

  const hasAny = safeInactiveEdges.length > 0 || safeActiveEdges.length > 0;
  if (!showLoops || !hasAny) return null;

  return (
    <group name="loop-lines" userData={{ showLoopLabels }}>
      {scannerSceneActive
        ? scannerInactiveGroups.map(({ role, geometry, material }) => (
            <lineSegments key={`inactive-${role}`} geometry={geometry} material={material} />
          ))
        : inactiveGeo && <lineSegments geometry={inactiveGeo} material={inactiveMat} />}
      {scannerSceneActive
        ? scannerActiveGroups.flatMap(({ role, geos, materials }) =>
            geos.map((geometry, index) => {
              const material = materials[index];
              return material ? (
                <lineSegments key={`active-${role}-${index}`} geometry={geometry} material={material} />
              ) : null;
            })
          )
        : activeGeos.length > 0 &&
          activeGeos.map((geometry, index) => {
            const material = activeMaterials[index];
            return material ? <lineSegments key={index} geometry={geometry} material={material} /> : null;
          })}
    </group>
  );
});
