/**
 * P5 — Executive command-center graphics profile (materials, hierarchy, view modes).
 */

import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ObjectVisualRole } from "../../visual/objectVisualLanguage";
import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";

export type ExecutiveObjectVisualCategory =
  | "core_operations"
  | "flow"
  | "process_risk"
  | "constraint"
  | "finance_pressure"
  | "customer_outcome"
  | "decision_control";

export type ExecutiveVisualHierarchyTier =
  | "selected"
  | "scenario_active"
  | "risk"
  | "core_operation"
  | "supporting";

export type ExecutiveObjectMaterialPreset = {
  category: ExecutiveObjectVisualCategory;
  metalness: number;
  roughness: number;
  opacityMul: number;
  emissiveBoost: number;
  borderOpacity: number;
  labelWeight: number;
  accentHex: string;
};

export type ExecutiveGraphicsViewProfile = {
  viewMode: WorkspaceViewMode;
  visualProfile: string;
  relationshipProfile: string;
  objectMaterialCompact: boolean;
  relationshipLineDominance: number;
  nodeDepthEmphasis: number;
  labelContrast: number;
  performanceSafe: true;
};

const loggedGraphicsSignatures = new Set<string>();

const CATEGORY_PRESETS: Readonly<Record<ExecutiveObjectVisualCategory, ExecutiveObjectMaterialPreset>> =
  Object.freeze({
    core_operations: {
      category: "core_operations",
      metalness: 0.42,
      roughness: 0.38,
      opacityMul: 0.94,
      emissiveBoost: 0.08,
      borderOpacity: 0.22,
      labelWeight: 1.08,
      accentHex: "#94a3b8",
    },
    flow: {
      category: "flow",
      metalness: 0.36,
      roughness: 0.42,
      opacityMul: 0.9,
      emissiveBoost: 0.06,
      borderOpacity: 0.16,
      labelWeight: 0.98,
      accentHex: "#64748b",
    },
    process_risk: {
      category: "process_risk",
      metalness: 0.34,
      roughness: 0.4,
      opacityMul: 0.92,
      emissiveBoost: 0.12,
      borderOpacity: 0.28,
      labelWeight: 1.04,
      accentHex: "#b45309",
    },
    constraint: {
      category: "constraint",
      metalness: 0.32,
      roughness: 0.44,
      opacityMul: 0.88,
      emissiveBoost: 0.07,
      borderOpacity: 0.2,
      labelWeight: 0.96,
      accentHex: "#78716c",
    },
    finance_pressure: {
      category: "finance_pressure",
      metalness: 0.38,
      roughness: 0.4,
      opacityMul: 0.9,
      emissiveBoost: 0.1,
      borderOpacity: 0.24,
      labelWeight: 1.02,
      accentHex: "#a16207",
    },
    customer_outcome: {
      category: "customer_outcome",
      metalness: 0.3,
      roughness: 0.46,
      opacityMul: 0.88,
      emissiveBoost: 0.05,
      borderOpacity: 0.18,
      labelWeight: 1.0,
      accentHex: "#0f766e",
    },
    decision_control: {
      category: "decision_control",
      metalness: 0.4,
      roughness: 0.36,
      opacityMul: 0.93,
      emissiveBoost: 0.09,
      borderOpacity: 0.26,
      labelWeight: 1.06,
      accentHex: "#6366f1",
    },
  });

const VIEW_PROFILES: Readonly<Record<WorkspaceViewMode, ExecutiveGraphicsViewProfile>> = Object.freeze({
  "2D": {
    viewMode: "2D",
    visualProfile: "executive_strategic_map",
    relationshipProfile: "topology_first",
    objectMaterialCompact: true,
    relationshipLineDominance: 1.12,
    nodeDepthEmphasis: 0.72,
    labelContrast: 1.08,
    performanceSafe: true,
  },
  "3D": {
    viewMode: "3D",
    visualProfile: "executive_command_center",
    relationshipProfile: "spatial_network",
    objectMaterialCompact: false,
    relationshipLineDominance: 0.96,
    nodeDepthEmphasis: 1.08,
    labelContrast: 1.0,
    performanceSafe: true,
  },
});

function normalizeToken(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

export function deriveExecutiveObjectVisualCategory(input: {
  label?: unknown;
  role?: unknown;
  tags?: string[];
  semanticRole?: unknown;
  semanticCategory?: unknown;
  visualRole?: ObjectVisualRole;
}): ExecutiveObjectVisualCategory {
  const haystack = [
    normalizeToken(input.label),
    normalizeToken(input.role),
    normalizeToken(input.semanticRole),
    normalizeToken(input.semanticCategory),
    ...(input.tags ?? []).map((tag) => normalizeToken(tag)),
  ].join(" ");

  if (/cash|finance|liquidity|margin|price|debt|cost|budget|revenue/.test(haystack)) {
    return "finance_pressure";
  }
  if (/customer|trust|outcome|satisfaction|demand|retention/.test(haystack)) {
    return "customer_outcome";
  }
  if (/decision|control|governance|steering|approval|executive/.test(haystack)) {
    return "decision_control";
  }
  if (/risk|delay|disruption|fragil|threat|pressure|exposure|vulner/.test(haystack)) {
    return "process_risk";
  }
  if (/constraint|blocker|limit|bottleneck|capacity/.test(haystack)) {
    return "constraint";
  }
  if (/supplier|delivery|inventory|warehouse|flow|fulfillment|pipeline|throughput/.test(haystack)) {
    return "flow";
  }
  if (/core|operations|hub|anchor|backbone|primary|main/.test(haystack) || input.visualRole === "core") {
    return "core_operations";
  }
  if (input.visualRole === "risk") return "process_risk";
  if (input.visualRole === "strategic") return "decision_control";
  return "flow";
}

export function resolveExecutiveVisualHierarchyTier(input: {
  selected?: boolean;
  focused?: boolean;
  scenarioActive?: boolean;
  visualRole?: ObjectVisualRole;
  category?: ExecutiveObjectVisualCategory;
}): ExecutiveVisualHierarchyTier {
  if (input.selected || input.focused) return "selected";
  if (input.scenarioActive) return "scenario_active";
  if (input.visualRole === "risk" || input.category === "process_risk") return "risk";
  if (input.visualRole === "core" || input.category === "core_operations") return "core_operation";
  return "supporting";
}

export function resolveExecutiveObjectMaterialPreset(input: {
  category: ExecutiveObjectVisualCategory;
  viewMode: WorkspaceViewMode;
  hierarchyTier: ExecutiveVisualHierarchyTier;
}): ExecutiveObjectMaterialPreset {
  const base = CATEGORY_PRESETS[input.category];
  const view = VIEW_PROFILES[input.viewMode];
  const tierBoost =
    input.hierarchyTier === "selected"
      ? { opacity: 1.04, emissive: 0.06, border: 0.14, label: 0.08 }
      : input.hierarchyTier === "scenario_active"
        ? { opacity: 1.02, emissive: 0.04, border: 0.1, label: 0.05 }
        : input.hierarchyTier === "risk"
          ? { opacity: 1.0, emissive: 0.03, border: 0.06, label: 0.03 }
          : input.hierarchyTier === "core_operation"
            ? { opacity: 1.0, emissive: 0.02, border: 0.04, label: 0.02 }
            : { opacity: view.objectMaterialCompact ? 0.94 : 0.96, emissive: 0, border: 0, label: 0 };

  return {
    ...base,
    opacityMul: base.opacityMul * tierBoost.opacity * (view.objectMaterialCompact ? 0.96 : 1),
    emissiveBoost: base.emissiveBoost + tierBoost.emissive,
    borderOpacity: Math.min(0.42, base.borderOpacity + tierBoost.border),
    labelWeight: base.labelWeight + tierBoost.label,
    metalness: base.metalness * view.nodeDepthEmphasis,
    roughness: Math.min(0.52, base.roughness + (view.objectMaterialCompact ? 0.04 : 0)),
  };
}

export function resolveExecutiveGraphicsViewProfile(viewMode: WorkspaceViewMode): ExecutiveGraphicsViewProfile {
  return VIEW_PROFILES[viewMode];
}

export function resolveExecutiveRelationshipGraphicsProfile(viewMode: WorkspaceViewMode): {
  profile: string;
  lineOpacityMul: number;
  pulseEnabled: boolean;
  directionCue: boolean;
} {
  const view = VIEW_PROFILES[viewMode];
  return {
    profile: view.relationshipProfile,
    lineOpacityMul: view.relationshipLineDominance,
    pulseEnabled: viewMode === "3D",
    directionCue: true,
  };
}

export function logExecutiveGraphicsProfileOnce(input: {
  viewMode: WorkspaceViewMode;
  objectCount: number;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const view = resolveExecutiveGraphicsViewProfile(input.viewMode);
  const relationship = resolveExecutiveRelationshipGraphicsProfile(input.viewMode);
  const signature = [
    input.viewMode,
    input.objectCount,
    view.visualProfile,
    relationship.profile,
  ].join("|");
  if (loggedGraphicsSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`executive-graphics-profile:${signature}`)) return;
  loggedGraphicsSignatures.add(signature);
  console.info("[Nexora][GraphicsProfile]", {
    viewMode: input.viewMode,
    objectCount: input.objectCount,
    visualProfile: view.visualProfile,
    relationshipProfile: relationship.profile,
    performanceSafe: true,
  });
}

export function resetExecutiveGraphicsProfileLogsForTests(): void {
  loggedGraphicsSignatures.clear();
}
