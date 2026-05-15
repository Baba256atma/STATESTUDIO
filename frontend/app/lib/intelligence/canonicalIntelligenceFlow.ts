import { listIntelligenceLayers } from "./intelligenceLayerRegistry.ts";

export type CanonicalIntelligenceStage =
  | "signals"
  | "propagation"
  | "fragility"
  | "scenarios"
  | "recommendations"
  | "confidence"
  | "monitoring"
  | "strategic_synthesis"
  | "executive_ux";

export type CanonicalIntelligenceFlowStep = {
  stage: CanonicalIntelligenceStage;
  layerIds: string[];
  produces: string[];
};

export const CANONICAL_INTELLIGENCE_FLOW: CanonicalIntelligenceFlowStep[] = [
  {
    stage: "signals",
    layerIds: ["domain_graph", "cross_domain", "timeline"],
    produces: ["domain_objects", "domain_relationships", "cross_domain_insights", "timeline_intelligence"],
  },
  {
    stage: "propagation",
    layerIds: ["timeline"],
    produces: ["timeline_intelligence"],
  },
  {
    stage: "fragility",
    layerIds: ["fragility_map", "drift"],
    produces: ["fragility_zones", "strategic_drift_signals"],
  },
  {
    stage: "scenarios",
    layerIds: ["scenario_intelligence", "war_room_flow"],
    produces: ["domain_scenarios", "scenario_comparisons", "war_room_flow_state"],
  },
  {
    stage: "recommendations",
    layerIds: ["recommendations", "interventions"],
    produces: ["decision_recommendations", "strategic_interventions"],
  },
  {
    stage: "confidence",
    layerIds: ["confidence", "readiness"],
    produces: ["decision_confidence", "decision_readiness"],
  },
  {
    stage: "monitoring",
    layerIds: ["monitoring", "alerts", "forecast"],
    produces: ["monitoring_signals", "executive_alerts", "stability_forecasts"],
  },
  {
    stage: "strategic_synthesis",
    layerIds: ["coordination", "resilience", "adaptation", "narratives", "compression"],
    produces: ["coordination_insights", "resilience_signals", "adaptation_signals", "executive_narratives", "compressed_insights"],
  },
  {
    stage: "executive_ux",
    layerIds: ["compression", "war_room_flow", "narratives", "alerts"],
    produces: ["executive_briefing", "war_room_overlay", "narrative_overlay", "attention_overlay"],
  },
];

export function getCanonicalIntelligenceFlow(): CanonicalIntelligenceFlowStep[] {
  return CANONICAL_INTELLIGENCE_FLOW.map((step) => ({
    ...step,
    layerIds: [...step.layerIds],
    produces: [...step.produces],
  }));
}

export function validateCanonicalFlow(): {
  valid: boolean;
  warnings: string[];
} {
  const registered = new Set(listIntelligenceLayers().map((layer) => layer.id));
  const seen = new Set<string>();
  const warnings: string[] = [];
  const allowedMultiStage = new Set(["timeline", "compression", "war_room_flow", "narratives", "alerts"]);

  for (const step of CANONICAL_INTELLIGENCE_FLOW) {
    for (const layerId of step.layerIds) {
      if (!registered.has(layerId)) warnings.push(`Flow references unregistered layer: ${layerId}`);
      if (seen.has(layerId) && step.stage !== "executive_ux" && !allowedMultiStage.has(layerId)) {
        warnings.push(`Layer appears in multiple pre-UX stages: ${layerId}`);
      }
      seen.add(layerId);
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
