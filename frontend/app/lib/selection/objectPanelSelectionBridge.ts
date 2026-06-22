import type { PanelOpenSource } from "../ui/right-panel/panelControllerTypes.ts";

export type ObjectPanelSelectionOpenRequest = Readonly<{
  source: Extract<PanelOpenSource, "object_click">;
  family: "SCN";
  view: "object";
  contextId: string;
  reason: string;
  forceOpen: true;
  objectClickRequestId: number;
}>;

export function buildObjectPanelSelectionOpenRequest(input: {
  objectId: string;
  objectClickRequestId: number;
  reason?: string;
}): ObjectPanelSelectionOpenRequest {
  const objectId = String(input.objectId ?? "").trim();
  return Object.freeze({
    source: "object_click",
    family: "SCN",
    view: "object",
    contextId: objectId,
    reason: input.reason ?? "selection_budget_deferred",
    forceOpen: true,
    objectClickRequestId: input.objectClickRequestId,
  });
}

export function shouldOpenObjectPanelForSelection(input: {
  currentView: string | null;
  currentContextId: string | null;
  isOpen: boolean;
  objectId: string;
}): boolean {
  return (
    input.currentView !== "object" ||
    (input.currentContextId ?? null) !== input.objectId ||
    input.isOpen !== true
  );
}
