export type FaultIsolationDomain =
  | "connector_ingress"
  | "scene"
  | "overlay"
  | "panel"
  | "executive_intelligence"
  | "logging";

export type FaultIsolationRule = {
  id: string;
  domain: FaultIsolationDomain;
  failureMode: string;
  containmentRule: string;
  fallbackBehavior: string;
  severity: "low" | "medium" | "high";
};

export const FAULT_ISOLATION_RULES: FaultIsolationRule[] = [
  {
    id: "connector_failure_no_scene_break",
    domain: "connector_ingress",
    failureMode: "Connector payload fails validation or fetch fails.",
    containmentRule: "Keep failure inside ingress adapter and return warnings.",
    fallbackBehavior: "Preserve current scene and keep derived overlays from last valid canonical input.",
    severity: "high",
  },
  {
    id: "overlay_failure_no_scene_mutation",
    domain: "overlay",
    failureMode: "Derived overlay cannot be built.",
    containmentRule: "Return empty passive overlay state.",
    fallbackBehavior: "Render canonical scene without overlay emphasis.",
    severity: "high",
  },
  {
    id: "scene_contract_failure_no_overlay_cascade",
    domain: "scene",
    failureMode: "Scene snapshot is malformed or missing expected object/edge arrays.",
    containmentRule: "Normalize through canonical scene contracts and return warnings instead of mutating in place.",
    fallbackBehavior: "Preserve last valid scene snapshot and suppress dependent overlay escalation.",
    severity: "high",
  },
  {
    id: "panel_payload_failure_fallback",
    domain: "panel",
    failureMode: "Panel payload is missing or malformed.",
    containmentRule: "Use right-panel fallback/readiness state instead of forcing panel route changes.",
    fallbackBehavior: "Show calm empty/loading fallback.",
    severity: "medium",
  },
  {
    id: "intelligence_failure_preserve_monitoring",
    domain: "executive_intelligence",
    failureMode: "Narrative, compression, or recommendation derivation fails.",
    containmentRule: "Do not cascade into monitoring, scene, or panel routing.",
    fallbackBehavior: "Return steady-state executive focus with warnings.",
    severity: "medium",
  },
  {
    id: "logging_failure_no_runtime_effect",
    domain: "logging",
    failureMode: "Diagnostics cannot emit or console is unavailable.",
    containmentRule: "Logging must be optional and non-blocking.",
    fallbackBehavior: "Drop diagnostic output silently.",
    severity: "low",
  },
];

export function listFaultIsolationRules(): FaultIsolationRule[] {
  return FAULT_ISOLATION_RULES.map((rule) => ({ ...rule }));
}

export function evaluateFaultIsolationCoverage(domains: FaultIsolationDomain[]): {
  covered: boolean;
  missingDomains: FaultIsolationDomain[];
  rules: FaultIsolationRule[];
} {
  const rules = listFaultIsolationRules();
  const coveredDomains = new Set(rules.map((rule) => rule.domain));
  const missingDomains = domains.filter((domain) => !coveredDomains.has(domain));
  return {
    covered: missingDomains.length === 0,
    missingDomains,
    rules,
  };
}
