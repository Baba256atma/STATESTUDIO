export type RuntimeLayerId =
  | "ui"
  | "executive_intelligence"
  | "decision_intelligence"
  | "propagation"
  | "scene"
  | "infrastructure";

export type RuntimeLayerDefinition = {
  id: RuntimeLayerId;
  label: string;
  ownership: string;
  responsibilities: string[];
  allowedDependencies: RuntimeLayerId[];
  forbiddenResponsibilities: string[];
};

export const RUNTIME_LAYER_MAP: RuntimeLayerDefinition[] = [
  {
    id: "ui",
    label: "UI Layer",
    ownership: "React components, panels, overlays, and executive UX surfaces.",
    responsibilities: ["render canonical state", "present derived overlays", "capture explicit user intent"],
    allowedDependencies: ["executive_intelligence", "decision_intelligence", "scene", "infrastructure"],
    forbiddenResponsibilities: ["mutate scene contracts directly", "derive live connector intelligence", "own canonical orchestration"],
  },
  {
    id: "executive_intelligence",
    label: "Executive Intelligence Layer",
    ownership: "Monitoring, narratives, compression, alerts, readiness, and executive focus.",
    responsibilities: ["synthesize executive overlays", "rank attention", "preserve explainability"],
    allowedDependencies: ["decision_intelligence", "propagation", "scene", "infrastructure"],
    forbiddenResponsibilities: ["write scene state", "open panels", "call connector APIs directly"],
  },
  {
    id: "decision_intelligence",
    label: "Decision Intelligence Layer",
    ownership: "Scenarios, comparisons, recommendations, confidence, and decision graphs.",
    responsibilities: ["derive decision guidance", "explain rationale", "produce confidence-aware metadata"],
    allowedDependencies: ["propagation", "scene", "infrastructure"],
    forbiddenResponsibilities: ["execute recommendations", "modify graph topology", "own UI navigation"],
  },
  {
    id: "propagation",
    label: "Propagation Layer",
    ownership: "Relationship semantics, risk flow, fragility, drift, and timeline derivation.",
    responsibilities: ["derive risk movement", "produce overlay-safe propagation metadata", "score fragility"],
    allowedDependencies: ["scene", "infrastructure"],
    forbiddenResponsibilities: ["animate render loops", "mutate scene objects", "create autonomous simulations"],
  },
  {
    id: "scene",
    label: "Scene Layer",
    ownership: "Canonical scene contracts, object insertion, edge insertion, and render-safe scene normalization.",
    responsibilities: ["own canonical scene shape", "provide immutable scene updates", "protect object and edge contracts"],
    allowedDependencies: ["infrastructure"],
    forbiddenResponsibilities: ["derive executive strategy", "call connector APIs", "open panels"],
  },
  {
    id: "infrastructure",
    label: "Infrastructure Layer",
    ownership: "Local storage, APIs, connector ingress, telemetry policy, and environment guards.",
    responsibilities: ["normalize ingress", "isolate failures", "guard platform capabilities"],
    allowedDependencies: [],
    forbiddenResponsibilities: ["mutate UI state", "bypass canonical scene insertion", "produce executive conclusions without normalization"],
  },
];

export function listRuntimeLayers(): RuntimeLayerDefinition[] {
  return RUNTIME_LAYER_MAP.map((layer) => ({
    ...layer,
    responsibilities: [...layer.responsibilities],
    allowedDependencies: [...layer.allowedDependencies],
    forbiddenResponsibilities: [...layer.forbiddenResponsibilities],
  }));
}

export function getRuntimeLayer(id: RuntimeLayerId): RuntimeLayerDefinition | null {
  return listRuntimeLayers().find((layer) => layer.id === id) ?? null;
}

export function validateRuntimeLayerMap(): {
  valid: boolean;
  warnings: string[];
} {
  const ids = new Set(RUNTIME_LAYER_MAP.map((layer) => layer.id));
  const warnings: string[] = [];
  for (const layer of RUNTIME_LAYER_MAP) {
    if (layer.responsibilities.length === 0) warnings.push(`${layer.id} has no responsibilities.`);
    for (const dependency of layer.allowedDependencies) {
      if (!ids.has(dependency)) warnings.push(`${layer.id} references unknown dependency ${dependency}.`);
      if (dependency === layer.id) warnings.push(`${layer.id} cannot depend on itself.`);
    }
  }
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
