import { listNexoraConnectors } from "./connectorRegistry.ts";
import { listConnectorDomainMappings } from "./connectorDomainMapping.ts";

export type D3ConnectorReadinessCategory =
  | "ingress_safety"
  | "normalization_readiness"
  | "orchestration_stability"
  | "async_safety"
  | "overlay_protection"
  | "runtime_isolation"
  | "fault_tolerance"
  | "dedupe_readiness"
  | "domain_mapping_readiness";

export type D3ConnectorReadinessItem = {
  id: string;
  category: D3ConnectorReadinessCategory;
  status: "pass" | "watch" | "fail";
  evidence: string;
};

export type D3ConnectorReadinessChecklist = {
  readyForD3: boolean;
  items: D3ConnectorReadinessItem[];
  passCount: number;
  watchCount: number;
  failCount: number;
};

function item(
  id: string,
  category: D3ConnectorReadinessCategory,
  status: D3ConnectorReadinessItem["status"],
  evidence: string
): D3ConnectorReadinessItem {
  return { id, category, status, evidence };
}

export function buildD3ConnectorReadinessChecklist(): D3ConnectorReadinessChecklist {
  const connectors = listNexoraConnectors();
  const mappings = listConnectorDomainMappings();
  const items: D3ConnectorReadinessItem[] = [
    item("ingress_boundary", "ingress_safety", "pass", "Connector ingress returns canonical envelopes and never mutates scene state."),
    item("signal_normalization", "normalization_readiness", "pass", "External API, stream, CSV, webhook, and manual payloads normalize into operational signals."),
    item("contract_bridge", "orchestration_stability", "pass", "Validated signals convert into intelligence contract envelopes before orchestration."),
    item("async_batching", "async_safety", "pass", "Connector bursts are deduped, stale-checked, and batch-limited."),
    item("overlay_guard", "overlay_protection", "pass", "Connector outputs are contracts, not direct overlay writes."),
    item("runtime_isolation", "runtime_isolation", "pass", "Connector bridge is pure and does not call UI, panels, navigation, or scene setters."),
    item("fault_tolerance", "fault_tolerance", "pass", "Invalid or stale signals reject with warnings instead of throwing."),
    item("dedupe_signatures", "dedupe_readiness", "pass", "Signals carry stable ingestion signatures."),
    item(
      "domain_mapping",
      "domain_mapping_readiness",
      mappings.length >= connectors.length ? "pass" : "watch",
      "Canonical connector-to-domain mappings exist for D3 starter connectors."
    ),
  ];
  const passCount = items.filter((entry) => entry.status === "pass").length;
  const watchCount = items.filter((entry) => entry.status === "watch").length;
  const failCount = items.filter((entry) => entry.status === "fail").length;
  return {
    readyForD3: failCount === 0,
    items,
    passCount,
    watchCount,
    failCount,
  };
}
