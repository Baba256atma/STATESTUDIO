/**
 * D7:2:2 — Flow dynamics guard rails.
 */

import type { OrganizationalFlow } from "./flowDynamicsTypes.ts";
import { logFlowDev } from "./flowDevLog.ts";

export type FlowGuardCode =
  | "empty_topology"
  | "too_many_flows"
  | "invalid_flow_intensity"
  | "recursive_flow_loop"
  | "orphan_flow_path"
  | "duplicate_flow_build"
  | "unstable_throughput_spike"
  | "corrupted_flow_state";

export type FlowGuardResult =
  | { ok: true }
  | { ok: false; code: FlowGuardCode; message: string };

export const DEFAULT_MAX_ORGANIZATIONAL_FLOWS = 160;
export const DEFAULT_MAX_FLOW_CYCLE_DEPTH = 8;

function reject(code: FlowGuardCode, message: string): FlowGuardResult {
  const result = { ok: false as const, code, message };
  logFlowDev("FlowGuard", { code, message });
  return result;
}

export function buildFlowContentFingerprint(input: {
  topologyFingerprint: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectFlowCycle(flows: readonly OrganizationalFlow[]): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const flow of flows) {
    if (flow.flowType === "information") continue;
    const list = adjacency.get(flow.sourceRegionId) ?? [];
    list.push(flow.targetRegionId);
    adjacency.set(flow.sourceRegionId, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): string[] | null {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      return idx >= 0 ? [...stack.slice(idx), node] : [node, node];
    }
    if (visited.has(node)) return null;
    visiting.add(node);
    stack.push(node);
    for (const next of adjacency.get(node) ?? []) {
      const found = dfs(next);
      if (found) return found;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }

  for (const node of [...adjacency.keys()].sort()) {
    const found = dfs(node);
    if (found && found.length >= 3) return found;
  }
  return null;
}

export function guardCalculateOrganizationalFlows(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  flows: readonly OrganizationalFlow[];
  priorFlowFingerprints?: readonly string[];
  pendingFingerprint?: string;
  throughputSpike?: number;
}): FlowGuardResult {
  if (!input.topologyId) {
    return reject("empty_topology", "Topology is required to calculate organizational flows");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.flows.length > DEFAULT_MAX_ORGANIZATIONAL_FLOWS) {
    return reject(
      "too_many_flows",
      `Flow count ${input.flows.length} exceeds max ${DEFAULT_MAX_ORGANIZATIONAL_FLOWS}`
    );
  }

  for (const flow of input.flows) {
    if (flow.intensity < 0 || flow.intensity > 1) {
      return reject(
        "invalid_flow_intensity",
        `Flow ${flow.flowId} intensity must be between 0 and 1`
      );
    }
    if (!regionSet.has(flow.sourceRegionId) || !regionSet.has(flow.targetRegionId)) {
      return reject(
        "orphan_flow_path",
        `Flow ${flow.flowId} references unknown region(s)`
      );
    }
  }

  const cycle = detectFlowCycle(input.flows);
  if (cycle) {
    return reject(
      "recursive_flow_loop",
      `Recursive flow loop detected: ${cycle.join(" -> ")}`
    );
  }

  if ((input.throughputSpike ?? 0) > 0.95) {
    return reject(
      "unstable_throughput_spike",
      "Throughput spike exceeds safe governance threshold"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorFlowFingerprints ?? []).includes(pending)) {
    return reject("duplicate_flow_build", "Identical flow calculation was already executed");
  }

  return { ok: true };
}
