/**
 * NPA-T NMI:2 — manager-readable Management Map projection.
 * Derived from canonical current map state. Does not invent titles or edges.
 */

import {
  NMI_MANAGEMENT_MAP_SECTIONS,
  type ManagementMap,
  type ManagementMapNode,
  type NmiManagementMapProjection,
  type NmiManagementMapSection,
} from "./nmiManagementMapContract.ts";

const SECTION_LABEL: Readonly<Record<NmiManagementMapSection, string>> = Object.freeze({
  CONTEXT: "Context",
  GOALS: "Goals",
  OPERATIONS: "Operations",
  KPI_DATA: "KPI & Data",
  PROBLEMS: "Problems",
  RISKS: "Risks",
  VARIABLES: "Variables",
  SCENARIOS: "Scenarios",
  DECISIONS: "Decisions",
  EXECUTIONS: "Executions",
  OUTCOMES: "Outcomes",
  LEARNING: "Learning",
});

function nodeLabel(node: ManagementMapNode): string {
  if (node.title) return node.title;
  return `${node.nodeId} [title missing]`;
}

function renderNodeLine(node: ManagementMapNode, last: boolean, extra: string): string {
  const connector = last ? "└──" : "├──";
  const status = node.knownStatus ? ` (${node.knownStatus})` : "";
  return `│   ${connector} ${nodeLabel(node)}${status}${extra}`;
}

function laneNodes(map: ManagementMap, lane: "BUSINESS" | "PROJECT" | "HYBRID" | "UNKNOWN"): readonly ManagementMapNode[] {
  return map.nodes.filter((node) => node.contextKind === lane);
}

function renderSectionBlock(
  nodes: readonly ManagementMapNode[],
  lastSection: boolean,
): readonly string[] {
  const lines: string[] = [];
  for (let i = 0; i < NMI_MANAGEMENT_MAP_SECTIONS.length; i += 1) {
    const section = NMI_MANAGEMENT_MAP_SECTIONS[i]!;
    const inSection = nodes.filter((node) => node.section === section);
    const isLast = lastSection && i === NMI_MANAGEMENT_MAP_SECTIONS.length - 1;
    const sectionConnector = isLast ? "└──" : "├──";
    lines.push(`${sectionConnector} ${SECTION_LABEL[section]}`);
    if (inSection.length === 0) {
      lines.push(`│   └── [none]`);
      continue;
    }
    inSection.forEach((node, index) => {
      const extra = node.analyticalRole ? " [analytical]" : "";
      lines.push(renderNodeLine(node, index === inSection.length - 1, extra));
    });
  }
  return lines;
}

export function projectNmiManagementMap(map: ManagementMap): NmiManagementMapProjection {
  const lines: string[] = [map.contextKind, "│"];
  if (map.contextKind === "HYBRID" && map.hybridLanes) {
    const lanes = [
      { kind: "BUSINESS" as const, label: "Business context", ids: map.hybridLanes.businessNodeIds },
      { kind: "PROJECT" as const, label: "Project context", ids: map.hybridLanes.projectNodeIds },
      { kind: "HYBRID" as const, label: "Shared hybrid context", ids: map.hybridLanes.hybridNodeIds },
      { kind: "UNKNOWN" as const, label: "Unknown context", ids: map.hybridLanes.unknownNodeIds },
    ];
    lanes.forEach((lane, index) => {
      const last = index === lanes.length - 1;
      lines.push(`${last ? "└──" : "├──"} ${lane.label}`);
      const nodes = laneNodes(map, lane.kind);
      if (nodes.length === 0) {
        lines.push("│   └── [none]");
        return;
      }
      for (const nested of renderSectionBlock(nodes, last)) {
        lines.push(`│   ${nested}`);
      }
    });
  } else {
    lines.push(...renderSectionBlock(map.nodes, true));
  }

  return Object.freeze({
    mapId: map.mapId,
    contextKind: map.contextKind,
    scope: map.scope,
    lines: Object.freeze(lines),
    sections: map.sections,
    mutatesQueue: false,
    mutatesStage: false,
  });
}
