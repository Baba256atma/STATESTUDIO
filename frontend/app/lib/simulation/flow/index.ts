/**
 * D7:2:2 — Organizational flow dynamics (public surface).
 */

export type {
  OrganizationalFlowType,
  OrganizationalFlow,
  RegionFlowPressure,
  OperationalBottleneck,
  OrganizationalFlowState,
  ExecutiveFlowSemantics,
  OrganizationalFlowSnapshot,
  FlowPanelContract,
  FlowPanelFlowRow,
  FlowPanelBottleneckRow,
  RegionFlowMetrics,
  CalculateOrganizationalFlowsInput,
  CalculateOrganizationalFlowsResult,
} from "./flowDynamicsTypes.ts";

export type { FlowGuardCode, FlowGuardResult } from "./flowGuards.ts";
export {
  DEFAULT_MAX_ORGANIZATIONAL_FLOWS,
  DEFAULT_MAX_FLOW_CYCLE_DEPTH,
  buildFlowContentFingerprint,
  detectFlowCycle,
  guardCalculateOrganizationalFlows,
} from "./flowGuards.ts";

export { logFlowDev } from "./flowDevLog.ts";
export type { FlowDevChannel } from "./flowDevLog.ts";

export {
  deriveFlowsFromTopology,
  applySimulationEventFlowAdjustments,
} from "./resourceCirculationModel.ts";

export {
  computeRegionFlowPressures,
  detectOperationalBottlenecks,
} from "./bottleneckDetection.ts";

export {
  calculateFlowPressureScore,
  calculateOperationalMomentum,
} from "./flowMomentumModel.ts";

export { buildExecutiveFlowSemantics } from "./executiveFlowSemantics.ts";

export {
  calculateOrganizationalFlows,
  buildFlowPanelContract,
  freezeOrganizationalFlowSnapshot,
} from "./organizationalFlowDynamicsEngine.ts";
