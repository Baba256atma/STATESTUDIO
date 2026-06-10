import type { DashboardContext } from "../ui/mainRightPanelContract";

export type ObjectPanelState = "hidden" | "empty" | "selected";

export interface SelectedObject {
  id: string;
  name: string;
  type: string;
  status?: string;
  description?: string;
  health?: string;
  relationships?: readonly string[];
  tags?: readonly string[];
  owner?: string;
  metrics?: Readonly<Record<string, unknown>>;
}

export type ObjectPanelAction =
  | "view_details"
  | "analyze_object"
  | "show_risks"
  | "open_timeline"
  | "explain_object"
  | "focus_object"
  | "show_dependencies"
  | "run_scenario"
  | "compare_scenarios"
  | "open_war_room"
  | "open_decision_analysis"
  | "open_strategic_comparison";

export type ObjectSelectionAuthority = "HomeScreen.selectedObjectIdState";

export const OBJECT_PANEL_CONTRACT = Object.freeze({
  location: "right_side_of_three_scene",
  surface: "scene_native_hud",
  notLeftNav: true,
  notMainRightPanel: true,
  notModal: true,
  selectionMode: "single",
  selectionAuthority: "HomeScreen.selectedObjectIdState" satisfies ObjectSelectionAuthority,
  states: ["hidden", "empty", "selected"] as const satisfies readonly ObjectPanelState[],
  requiredObjectFields: ["id", "name", "type", "status"] as const,
  optionalObjectFields: [
    "description",
    "health",
    "relationships",
    "tags",
    "owner",
    "metrics",
  ] as const,
  actionsRouteOnly: [
    "view_details",
    "analyze_object",
    "show_risks",
    "open_timeline",
    "explain_object",
    "focus_object",
    "show_dependencies",
    "run_scenario",
    "compare_scenarios",
    "open_war_room",
    "open_decision_analysis",
    "open_strategic_comparison",
  ] as const satisfies readonly ObjectPanelAction[],
  actionDashboardContexts: {
    view_details: "overview",
    analyze_object: "overview",
    show_risks: "risk",
    open_timeline: "timeline",
    explain_object: "overview",
    focus_object: "overview",
    show_dependencies: "overview",
    run_scenario: "overview",
    compare_scenarios: "overview",
    open_war_room: "overview",
    open_decision_analysis: "overview",
    open_strategic_comparison: "overview",
  } as const satisfies Record<ObjectPanelAction, DashboardContext>,
});

const objectPanelWarnings = new Set<string>();

function warnObjectPanelBrake(message: string, payload?: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(payload ?? {})}`;
  if (objectPanelWarnings.has(key)) return;
  objectPanelWarnings.add(key);
  console.warn(message, payload ?? {});
}

export function normalizeObjectPanelState(
  value: ObjectPanelState | string | null | undefined
): ObjectPanelState {
  if (value === "hidden" || value === "empty" || value === "selected") return value;
  warnObjectPanelBrake("[ObjectPanel][Brake] Selection state corrupted.", {
    received: value ?? null,
    fallback: "empty",
  });
  return "empty";
}

export function resolveObjectPanelState(input: {
  visible?: boolean;
  selectedObject?: SelectedObject | null;
  selectedObjectId?: string | null;
}): ObjectPanelState {
  if (input.visible === false) return "hidden";
  const selectedObjectId =
    input.selectedObject?.id?.trim() ||
    (typeof input.selectedObjectId === "string" ? input.selectedObjectId.trim() : "");
  return selectedObjectId ? "selected" : "empty";
}

export function normalizeSelectedObjectContract(value: unknown): SelectedObject | null {
  if (!value || typeof value !== "object") {
    warnObjectPanelBrake("[ObjectPanel][Brake] Invalid selected object.", {
      reason: "not_object",
    });
    return null;
  }
  const record = value as Partial<SelectedObject>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const type = typeof record.type === "string" ? record.type.trim() : "";
  if (!id || !name || !type) {
    warnObjectPanelBrake("[ObjectPanel][Brake] Object metadata unavailable.", {
      hasId: Boolean(id),
      hasName: Boolean(name),
      hasType: Boolean(type),
    });
    return null;
  }
  return {
    ...record,
    id,
    name,
    type,
    status: typeof record.status === "string" ? record.status.trim() || undefined : record.status,
  };
}

export function warnMultipleSelectionStoresDetected(
  stores: readonly string[],
  authority: ObjectSelectionAuthority = OBJECT_PANEL_CONTRACT.selectionAuthority
): void {
  const competingStores = stores
    .map((store) => store.trim())
    .filter((store) => store.length > 0 && store !== authority);
  if (competingStores.length === 0) return;
  warnObjectPanelBrake("[ObjectPanel][Brake] Multiple selection stores detected.", {
    authority,
    competingStores,
  });
  void import("../architecture/nexoraArchitectureFreezeRuntime.ts").then(({ validateDuplicateOwnership }) => {
    validateDuplicateOwnership({
      domain: "selection",
      canonicalOwner: authority,
      competingOwners: competingStores,
      source: "warnMultipleSelectionStoresDetected",
    });
  });
}
