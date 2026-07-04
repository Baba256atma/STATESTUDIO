import type { ExecutiveConnectionCompatibility } from "./executiveLayerConnectionTypes.ts";

export const EXECUTIVE_CONNECTION_COMPATIBILITY: readonly ExecutiveConnectionCompatibility[] = Object.freeze([
  Object.freeze({ layerId: "LAY", compatible: true, mode: "metadata-only", notes: Object.freeze(["Canonical executive layer consumer."] as const) }),
  Object.freeze({ layerId: "CORE", compatible: true, mode: "metadata-only", notes: Object.freeze(["Consumes stable contracts only."] as const) }),
  Object.freeze({ layerId: "DS", compatible: true, mode: "metadata-only", notes: Object.freeze(["No data mutation or persistence."] as const) }),
  Object.freeze({ layerId: "INT", compatible: true, mode: "metadata-only", notes: Object.freeze(["No network integration in this phase."] as const) }),
  Object.freeze({ layerId: "APP", compatible: true, mode: "metadata-only", notes: Object.freeze(["Executive intelligence platforms may inspect contracts."] as const) }),
  Object.freeze({ layerId: "KNL", compatible: true, mode: "metadata-only", notes: Object.freeze(["Knowledge consumers receive only contract metadata."] as const) }),
  Object.freeze({ layerId: "LLM", compatible: true, mode: "metadata-only", notes: Object.freeze(["No model interaction is performed."] as const) }),
  Object.freeze({ layerId: "ASS", compatible: true, mode: "metadata-only", notes: Object.freeze(["Assistant contracts are metadata-only."] as const) }),
  Object.freeze({ layerId: "SMM", compatible: true, mode: "metadata-only", notes: Object.freeze(["Simulation metadata compatibility only."] as const) }),
  Object.freeze({ layerId: "IDN", compatible: true, mode: "metadata-only", notes: Object.freeze(["No identity auth or authorization behavior."] as const) }),
  Object.freeze({ layerId: "Scene", compatible: true, mode: "future", notes: Object.freeze(["Scene bridge implementation belongs to a future phase."] as const) }),
  Object.freeze({ layerId: "Dashboard", compatible: true, mode: "future", notes: Object.freeze(["Dashboard rendering is explicitly out of scope."] as const) }),
  Object.freeze({ layerId: "Assistant", compatible: true, mode: "future", notes: Object.freeze(["Assistant runtime is explicitly out of scope."] as const) }),
  Object.freeze({ layerId: "Runtime", compatible: true, mode: "future", notes: Object.freeze(["Execution coordination is explicitly out of scope."] as const) }),
]);

export function getExecutiveConnectionCompatibilityMatrix(): readonly ExecutiveConnectionCompatibility[] {
  return EXECUTIVE_CONNECTION_COMPATIBILITY;
}
