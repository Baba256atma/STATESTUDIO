import { buildFinalD2CertificationReport } from "./finalD2CertificationReport.ts";

export type D3LaunchGateCondition =
  | "overlay_systems_stable"
  | "ingress_validation_active"
  | "no_uncontrolled_scene_mutation"
  | "runtime_deterministic"
  | "connector_bridge_ready"
  | "type_c_integrity_preserved";

export type D3LaunchGateResult = {
  approved: boolean;
  conditions: Record<D3LaunchGateCondition, boolean>;
  blockers: string[];
};

export function evaluateD3LaunchGate(): D3LaunchGateResult {
  const certification = buildFinalD2CertificationReport();
  const conditions: Record<D3LaunchGateCondition, boolean> = {
    overlay_systems_stable: certification.runtimeStability !== "needs_attention",
    ingress_validation_active: certification.connectorReadiness !== "blocked",
    no_uncontrolled_scene_mutation: certification.architectureMaturity === "production_foundation",
    runtime_deterministic: certification.orchestrationQuality !== "needs_attention",
    connector_bridge_ready: certification.connectorReadiness === "ready",
    type_c_integrity_preserved: certification.typeCIntegrity === "preserved",
  };
  const blockers = Object.entries(conditions)
    .filter(([, passed]) => !passed)
    .map(([condition]) => condition);
  return {
    approved: blockers.length === 0 && certification.d3LaunchReadiness,
    conditions,
    blockers,
  };
}
