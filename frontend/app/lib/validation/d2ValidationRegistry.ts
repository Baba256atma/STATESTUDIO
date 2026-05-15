export type D2ValidationCategory =
  | "architecture"
  | "orchestration"
  | "overlays"
  | "ux"
  | "cognition"
  | "propagation"
  | "monitoring"
  | "resilience"
  | "readiness"
  | "connectors"
  | "runtime_stability";

export type D2ValidationRegistryEntry = {
  id: string;
  label: string;
  category: D2ValidationCategory;
  requiredForD3: boolean;
};

export const D2_VALIDATION_REGISTRY: D2ValidationRegistryEntry[] = [
  { id: "runtime_layer_map", label: "Runtime Layer Map", category: "architecture", requiredForD3: true },
  { id: "canonical_intelligence_flow", label: "Canonical Intelligence Flow", category: "orchestration", requiredForD3: true },
  { id: "architecture_boundary_audit", label: "Architecture Boundary Audit", category: "architecture", requiredForD3: true },
  { id: "intelligence_contracts", label: "Canonical Intelligence Contracts", category: "orchestration", requiredForD3: true },
  { id: "fault_isolation", label: "Fault Isolation Rules", category: "runtime_stability", requiredForD3: true },
  { id: "connector_ingress_boundary", label: "Connector Ingress Boundary", category: "connectors", requiredForD3: true },
  { id: "async_connector_safeguards", label: "Async Connector Safeguards", category: "connectors", requiredForD3: true },
  { id: "executive_signal_hierarchy", label: "Executive Signal Hierarchy", category: "ux", requiredForD3: true },
  { id: "executive_visual_language", label: "Executive Visual Language", category: "ux", requiredForD3: true },
  { id: "harmonized_cognition_flow", label: "Harmonized Executive Cognition Flow", category: "cognition", requiredForD3: true },
  { id: "type_c_operating_philosophy", label: "Type-C Operating Philosophy", category: "cognition", requiredForD3: true },
  { id: "propagation_intelligence", label: "Propagation Intelligence", category: "propagation", requiredForD3: true },
  { id: "executive_monitoring", label: "Executive Monitoring", category: "monitoring", requiredForD3: true },
  { id: "resilience_intelligence", label: "Resilience Intelligence", category: "resilience", requiredForD3: true },
  { id: "readiness_intelligence", label: "Decision Readiness Intelligence", category: "readiness", requiredForD3: true },
  { id: "overlay_derived_only_policy", label: "Overlay Derived-Only Policy", category: "overlays", requiredForD3: true },
];

export function listD2ValidationRegistry(): D2ValidationRegistryEntry[] {
  return D2_VALIDATION_REGISTRY.map((entry) => ({ ...entry }));
}

export function validateD2RegistryCoverage(): {
  valid: boolean;
  missingCategories: D2ValidationCategory[];
} {
  const categories = new Set(D2_VALIDATION_REGISTRY.map((entry) => entry.category));
  const required: D2ValidationCategory[] = [
    "architecture",
    "orchestration",
    "overlays",
    "ux",
    "cognition",
    "propagation",
    "monitoring",
    "resilience",
    "readiness",
    "connectors",
    "runtime_stability",
  ];
  const missingCategories = required.filter((category) => !categories.has(category));
  return {
    valid: missingCategories.length === 0,
    missingCategories,
  };
}
