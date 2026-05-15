export type IntelligenceLayerLifecycle =
  | "source"
  | "derived"
  | "synthesis"
  | "orchestration"
  | "ux_overlay";

export type IntelligenceLayerRegistryEntry = {
  id: string;
  label: string;
  lifecycle: IntelligenceLayerLifecycle;
  consumes: string[];
  produces: string[];
  overlayConsumers: string[];
  panelConsumers: string[];
  orchestrationDependencies: string[];
  owner: string;
};

export const D2_INTELLIGENCE_LAYER_REGISTRY: IntelligenceLayerRegistryEntry[] = [
  {
    id: "domain_graph",
    label: "Domain Graph",
    lifecycle: "source",
    consumes: ["scene_objects", "scene_edges", "domain_registry"],
    produces: ["domain_objects", "domain_relationships"],
    overlayConsumers: ["scene_overlays"],
    panelConsumers: ["objects", "risk_flow"],
    orchestrationDependencies: [],
    owner: "domain",
  },
  {
    id: "timeline",
    label: "Timeline Intelligence",
    lifecycle: "derived",
    consumes: ["propagation_hints", "monitoring_history", "strategic_memory"],
    produces: ["timeline_intelligence"],
    overlayConsumers: ["timeline_overlay"],
    panelConsumers: ["timeline", "war_room"],
    orchestrationDependencies: ["domain_graph"],
    owner: "timeline",
  },
  {
    id: "fragility_map",
    label: "Enterprise Fragility Map",
    lifecycle: "derived",
    consumes: ["propagation_hints", "domain_relationships", "cross_domain_insights"],
    produces: ["fragility_zones", "fragility_corridors"],
    overlayConsumers: ["risk_overlay"],
    panelConsumers: ["risk_flow", "executive_dashboard"],
    orchestrationDependencies: ["domain_graph"],
    owner: "fragilityMap",
  },
  {
    id: "scenario_intelligence",
    label: "Scenario Intelligence",
    lifecycle: "derived",
    consumes: ["fragility_zones", "domain_relationships", "risk_signals"],
    produces: ["domain_scenarios", "scenario_comparisons"],
    overlayConsumers: ["scenario_overlay"],
    panelConsumers: ["war_room", "compare"],
    orchestrationDependencies: ["fragility_map"],
    owner: "scenario",
  },
  {
    id: "executive_insights",
    label: "Executive Insight Ranking",
    lifecycle: "synthesis",
    consumes: ["scenarios", "propagation_insights", "fragility_signals", "relationship_intelligence"],
    produces: ["executive_insights", "ranked_insights"],
    overlayConsumers: ["insight_overlay"],
    panelConsumers: ["executive_dashboard", "advice"],
    orchestrationDependencies: ["scenario_intelligence", "fragility_map"],
    owner: "intelligence",
  },
  {
    id: "recommendations",
    label: "Decision Recommendations",
    lifecycle: "derived",
    consumes: ["executive_insights", "scenario_comparisons", "fragility_zones"],
    produces: ["decision_recommendations"],
    overlayConsumers: ["recommendation_overlay"],
    panelConsumers: ["advice", "war_room"],
    orchestrationDependencies: ["scenario_intelligence", "executive_insights"],
    owner: "decision",
  },
  {
    id: "confidence",
    label: "Decision Confidence",
    lifecycle: "derived",
    consumes: ["decision_recommendations", "timeline_intelligence", "monitoring_signals", "scenario_comparisons"],
    produces: ["decision_confidence", "uncertainty_factors"],
    overlayConsumers: ["confidence_overlay"],
    panelConsumers: ["advice", "compare", "war_room"],
    orchestrationDependencies: ["recommendations", "timeline"],
    owner: "confidence",
  },
  {
    id: "strategic_memory",
    label: "Strategic Memory",
    lifecycle: "derived",
    consumes: ["executive_insights", "recommendations", "timeline_intelligence", "propagation_history"],
    produces: ["strategic_memory", "timeline_memory"],
    overlayConsumers: ["memory_overlay"],
    panelConsumers: ["timeline", "monitoring"],
    orchestrationDependencies: ["executive_insights", "timeline"],
    owner: "memory",
  },
  {
    id: "monitoring",
    label: "Executive Monitoring",
    lifecycle: "derived",
    consumes: ["timeline_intelligence", "strategic_memory", "propagation_state", "decision_recommendations"],
    produces: ["monitoring_signals"],
    overlayConsumers: ["monitoring_overlay"],
    panelConsumers: ["monitoring", "executive_dashboard"],
    orchestrationDependencies: ["timeline", "strategic_memory"],
    owner: "monitoring",
  },
  {
    id: "forecast",
    label: "Executive Stability Forecast",
    lifecycle: "derived",
    consumes: ["timeline_intelligence", "monitoring_signals", "strategic_memory", "interventions", "fragility_zones", "decision_confidence"],
    produces: ["stability_forecasts"],
    overlayConsumers: ["forecast_overlay"],
    panelConsumers: ["timeline", "monitoring", "executive_dashboard"],
    orchestrationDependencies: ["monitoring", "strategic_memory", "interventions"],
    owner: "forecast",
  },
  {
    id: "alerts",
    label: "Executive Alerts",
    lifecycle: "synthesis",
    consumes: ["monitoring_signals", "strategic_memory", "timeline_intelligence", "compressed_insights", "decision_confidence"],
    produces: ["executive_alerts"],
    overlayConsumers: ["attention_overlay"],
    panelConsumers: ["executive_dashboard", "primary_decision_strip"],
    orchestrationDependencies: ["monitoring", "confidence", "compression"],
    owner: "alerts",
  },
  {
    id: "cross_domain",
    label: "Cross-Domain Intelligence",
    lifecycle: "derived",
    consumes: ["domain_relationships", "propagation_overlap", "monitoring_signals"],
    produces: ["cross_domain_insights", "cross_domain_clusters"],
    overlayConsumers: ["cross_domain_overlay"],
    panelConsumers: ["executive_dashboard", "war_room"],
    orchestrationDependencies: ["domain_graph", "monitoring"],
    owner: "crossdomain",
  },
  {
    id: "coordination",
    label: "Enterprise Coordination",
    lifecycle: "derived",
    consumes: ["cross_domain_insights", "fragility_zones", "interventions", "monitoring_signals"],
    produces: ["coordination_insights"],
    overlayConsumers: ["coordination_overlay"],
    panelConsumers: ["war_room", "monitoring"],
    orchestrationDependencies: ["cross_domain", "fragility_map", "interventions"],
    owner: "coordination",
  },
  {
    id: "interventions",
    label: "Strategic Interventions",
    lifecycle: "derived",
    consumes: ["fragility_zones", "monitoring_signals", "decision_graph", "cross_domain_insights"],
    produces: ["strategic_interventions", "stabilization_pathway"],
    overlayConsumers: ["intervention_overlay"],
    panelConsumers: ["advice", "war_room", "risk_flow"],
    orchestrationDependencies: ["fragility_map", "recommendations", "cross_domain"],
    owner: "intervention",
  },
  {
    id: "drift",
    label: "Strategic Drift",
    lifecycle: "derived",
    consumes: ["stability_forecasts", "monitoring_signals", "fragility_zones", "coordination_insights", "strategic_memory"],
    produces: ["strategic_drift_signals"],
    overlayConsumers: ["drift_overlay"],
    panelConsumers: ["timeline", "monitoring"],
    orchestrationDependencies: ["forecast", "coordination", "strategic_memory"],
    owner: "drift",
  },
  {
    id: "resilience",
    label: "Organizational Resilience",
    lifecycle: "derived",
    consumes: ["interventions", "monitoring_signals", "forecasts", "fragility_zones", "drift_signals"],
    produces: ["resilience_signals"],
    overlayConsumers: ["resilience_overlay"],
    panelConsumers: ["executive_dashboard", "monitoring"],
    orchestrationDependencies: ["interventions", "forecast", "drift"],
    owner: "resilience",
  },
  {
    id: "readiness",
    label: "Executive Decision Readiness",
    lifecycle: "synthesis",
    consumes: ["confidence", "monitoring_signals", "coordination_insights", "drift_signals", "resilience_signals"],
    produces: ["decision_readiness"],
    overlayConsumers: ["readiness_overlay"],
    panelConsumers: ["war_room", "advice", "primary_decision_strip"],
    orchestrationDependencies: ["confidence", "monitoring", "coordination", "drift", "resilience"],
    owner: "readiness",
  },
  {
    id: "adaptation",
    label: "Enterprise Adaptation",
    lifecycle: "derived",
    consumes: ["resilience_signals", "decision_readiness", "interventions", "coordination_insights", "drift_signals"],
    produces: ["adaptation_signals"],
    overlayConsumers: ["adaptation_overlay"],
    panelConsumers: ["executive_dashboard", "war_room", "monitoring"],
    orchestrationDependencies: ["resilience", "readiness", "coordination", "drift"],
    owner: "adaptation",
  },
  {
    id: "narratives",
    label: "Executive Narratives",
    lifecycle: "synthesis",
    consumes: ["executive_insights", "compressed_insights", "timeline_intelligence", "recommendations", "cross_domain_insights"],
    produces: ["executive_narratives"],
    overlayConsumers: ["narrative_overlay"],
    panelConsumers: ["executive_dashboard", "advice", "war_room"],
    orchestrationDependencies: ["compression", "timeline", "recommendations"],
    owner: "narrative",
  },
  {
    id: "compression",
    label: "Strategic Compression",
    lifecycle: "synthesis",
    consumes: ["executive_insights", "monitoring_signals", "recommendations", "timeline_intelligence", "strategic_memory", "decision_confidence"],
    produces: ["compressed_insights", "executive_briefing"],
    overlayConsumers: ["briefing_overlay"],
    panelConsumers: ["executive_dashboard", "primary_decision_strip"],
    orchestrationDependencies: ["monitoring", "recommendations", "confidence"],
    owner: "compression",
  },
  {
    id: "war_room_flow",
    label: "War Room Flow",
    lifecycle: "orchestration",
    consumes: ["scenarios", "comparisons", "ranked_insights", "recommendations"],
    produces: ["war_room_flow_state"],
    overlayConsumers: ["war_room_overlay"],
    panelConsumers: ["war_room", "primary_decision_strip"],
    orchestrationDependencies: ["scenario_intelligence", "recommendations", "compression"],
    owner: "warroom",
  },
];

export function listIntelligenceLayers(): IntelligenceLayerRegistryEntry[] {
  return D2_INTELLIGENCE_LAYER_REGISTRY.map((entry) => ({
    ...entry,
    consumes: [...entry.consumes],
    produces: [...entry.produces],
    overlayConsumers: [...entry.overlayConsumers],
    panelConsumers: [...entry.panelConsumers],
    orchestrationDependencies: [...entry.orchestrationDependencies],
  }));
}

export function getIntelligenceLayer(id: string): IntelligenceLayerRegistryEntry | null {
  return listIntelligenceLayers().find((entry) => entry.id === id) ?? null;
}

export function findLayersProducing(signal: string): IntelligenceLayerRegistryEntry[] {
  return listIntelligenceLayers().filter((entry) => entry.produces.includes(signal));
}
