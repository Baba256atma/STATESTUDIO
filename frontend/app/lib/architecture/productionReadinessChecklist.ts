import { auditArchitectureBoundaries } from "./architectureBoundaryAudit.ts";
import { validateRuntimeLayerMap } from "./runtimeLayerMap.ts";
import { evaluateFaultIsolationCoverage } from "./faultIsolationRules.ts";

export type ProductionReadinessCategory =
  | "orchestration_stability"
  | "overlay_safety"
  | "connector_readiness"
  | "render_safety"
  | "state_consistency"
  | "ux_stability"
  | "fault_isolation"
  | "executive_clarity"
  | "runtime_determinism";

export type ProductionReadinessChecklistItem = {
  id: string;
  category: ProductionReadinessCategory;
  label: string;
  status: "pass" | "watch" | "fail";
  evidence: string;
};

export type ProductionReadinessChecklist = {
  ready: boolean;
  items: ProductionReadinessChecklistItem[];
  watchCount: number;
  failCount: number;
};

function item(
  id: string,
  category: ProductionReadinessCategory,
  label: string,
  status: ProductionReadinessChecklistItem["status"],
  evidence: string
): ProductionReadinessChecklistItem {
  return { id, category, label, status, evidence };
}

export function buildProductionReadinessChecklist(): ProductionReadinessChecklist {
  const boundaryWarnings = auditArchitectureBoundaries();
  const runtime = validateRuntimeLayerMap();
  const faultCoverage = evaluateFaultIsolationCoverage([
    "connector_ingress",
    "scene",
    "overlay",
    "panel",
    "executive_intelligence",
    "logging",
  ]);
  const highWarnings = boundaryWarnings.filter((warning) => warning.severity === "high");
  const mediumWarnings = boundaryWarnings.filter((warning) => warning.severity === "medium");

  const items: ProductionReadinessChecklistItem[] = [
    item(
      "canonical_orchestration_map",
      "orchestration_stability",
      "Canonical intelligence flow validates against the layer registry.",
      highWarnings.some((warning) => warning.category === "circular_dependency") ? "fail" : "pass",
      "D2 canonical intelligence flow is validated before connector expansion."
    ),
    item(
      "overlay_derived_only",
      "overlay_safety",
      "Overlay layers are treated as derived-only and scene-preserving.",
      boundaryWarnings.some((warning) => warning.category === "overlay_safety" && warning.severity === "high") ? "fail" : "pass",
      "Overlay safety is represented as passive metadata and fault-isolated fallback rules."
    ),
    item(
      "connector_ingress_boundary",
      "connector_readiness",
      "Connector ingress has a normalized pre-orchestration boundary.",
      "pass",
      "Connector ingress envelopes normalize payloads into intelligence contracts before D3 runtime wiring."
    ),
    item(
      "render_no_mutation_contract",
      "render_safety",
      "Production architecture forbids scene mutation from overlays and intelligence layers.",
      "pass",
      "Runtime layer map keeps scene ownership separate from UI and intelligence layers."
    ),
    item(
      "state_consistency_boundaries",
      "state_consistency",
      "Scene and panel state ownership boundaries are explicit.",
      mediumWarnings.some((warning) => warning.category === "ownership") ? "watch" : "pass",
      "Panel ownership is defined; high-overlap panels should use UX summaries as D3 grows."
    ),
    item(
      "executive_ux_hierarchy",
      "ux_stability",
      "Executive UX has a low-noise signal hierarchy.",
      "pass",
      "D2:41 focus summary and visual language helpers provide a stable consumption model."
    ),
    item(
      "fault_isolation_coverage",
      "fault_isolation",
      "Key failure domains have containment rules.",
      faultCoverage.covered ? "pass" : "watch",
      faultCoverage.covered ? "Connector, overlay, panel, intelligence, and logging faults are covered." : `Missing: ${faultCoverage.missingDomains.join(", ")}`,
    ),
    item(
      "executive_clarity_bridge",
      "executive_clarity",
      "Production readiness preserves executive clarity over raw signal volume.",
      "pass",
      "Readiness policy routes future connector outputs through contracts, hierarchy, and panel ownership."
    ),
    item(
      "runtime_layer_validation",
      "runtime_determinism",
      "Runtime layers validate without self-dependencies.",
      runtime.valid ? "pass" : "fail",
      runtime.valid ? "Runtime layer map is deterministic." : runtime.warnings.join("; ")
    ),
  ];

  const failCount = items.filter((entry) => entry.status === "fail").length;
  const watchCount = items.filter((entry) => entry.status === "watch").length;
  return {
    ready: failCount === 0,
    items,
    watchCount,
    failCount,
  };
}
