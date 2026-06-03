/**
 * Topology connection highlight filtering (pure, read-only).
 */

import { buildTopologyConnectionLineId } from "./topologyConnectionResolver.ts";
import { logTopologyConnectionHighlightBrake } from "./topologyConnectionHighlightDevLog.ts";

export type TopologyLineVisualState = "active" | "dim";

export function isTopologyLineRelatedToSelectedObject(input: {
  line: {
    sourceId: string;
    targetId: string;
  };
  selectedObjectId?: string | null;
}): boolean {
  const selectedObjectId = input.selectedObjectId?.trim();
  if (!selectedObjectId) {
    return false;
  }
  return (
    input.line.sourceId === selectedObjectId ||
    input.line.targetId === selectedObjectId
  );
}

export function resolveTopologyLineVisualState(input: {
  line: {
    sourceId: string;
    targetId: string;
  };
  selectedObjectId?: string | null;
}): TopologyLineVisualState {
  return isTopologyLineRelatedToSelectedObject(input) ? "active" : "dim";
}

export function collectTopologyConnectionObjectIds(
  lines: readonly {
    sourceId: string;
    targetId: string;
    valid: boolean;
  }[]
): Set<string> {
  const ids = new Set<string>();
  for (const line of lines) {
    if (!line.valid) continue;
    ids.add(line.sourceId);
    ids.add(line.targetId);
  }
  return ids;
}

export function auditTopologyConnectionHighlight(input: {
  lines: readonly {
    id: string;
    sourceId: string;
    targetId: string;
    valid: boolean;
  }[];
  selectedObjectId?: string | null;
  visible?: boolean;
  topologyEnabled?: boolean;
}): void {
  if (input.visible === false || input.topologyEnabled === false) {
    return;
  }

  const selectedObjectId = input.selectedObjectId?.trim();
  if (!selectedObjectId) {
    return;
  }

  const validLines = input.lines.filter((line) => line.valid);
  if (validLines.length === 0) {
    return;
  }

  const knownObjectIds = collectTopologyConnectionObjectIds(validLines);

  for (const line of validLines) {
    const expectedId = buildTopologyConnectionLineId(line.sourceId, line.targetId);
    if (line.id !== expectedId) {
      logTopologyConnectionHighlightBrake(`Line id mismatch detected: ${line.id}`);
    }
  }

  if (!knownObjectIds.has(selectedObjectId)) {
    logTopologyConnectionHighlightBrake(
      `Selected object id does not exist in topology positions: ${selectedObjectId}`
    );
    return;
  }

  const activeLineCount = validLines.filter((line) =>
    isTopologyLineRelatedToSelectedObject({ line, selectedObjectId })
  ).length;

  if (activeLineCount === 0) {
    logTopologyConnectionHighlightBrake(
      `Active line count is zero for selected object: ${selectedObjectId}`
    );
  }
}
