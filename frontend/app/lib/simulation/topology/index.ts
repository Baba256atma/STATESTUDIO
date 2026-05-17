/**
 * D7:2:1 — Operational universe topology (public surface).
 */

export type {
  OperationalDomainClass,
  OperationalRelationshipType,
  TopologyObjectInput,
  OperationalRegion,
  OperationalRelationship,
  CrossDomainDependencyChannel,
  OperationalUniverseTopology,
  TopologyObjectClassification,
  ExecutiveTopologySemantics,
  OperationalUniverseTopologySnapshot,
  TopologyPanelContract,
  TopologyPanelRegionRow,
  TopologyPanelRelationshipRow,
  BuildOperationalUniverseTopologyInput,
  BuildOperationalUniverseTopologyResult,
} from "./topologyTypes.ts";

export type { TopologyGuardCode, TopologyGuardResult } from "./topologyGuards.ts";
export {
  DEFAULT_MAX_TOPOLOGY_REGIONS,
  DEFAULT_MAX_TOPOLOGY_RELATIONSHIPS,
  DEFAULT_MAX_DEPENDENCY_CYCLE_DEPTH,
  buildTopologyContentFingerprint,
  guardBuildTopology,
  detectRegionDependencyCycle,
} from "./topologyGuards.ts";

export { logTopologyDev } from "./topologyDevLog.ts";
export type { TopologyDevChannel } from "./topologyDevLog.ts";

export type { CanonicalRegionId } from "./operationalUniverseClassification.ts";
export {
  CANONICAL_REGION_LABELS,
  classifyTopologyObject,
  classifyTopologyObjects,
  domainClassForRegion,
} from "./operationalUniverseClassification.ts";

export {
  inferCrossRegionRelationships,
  buildCrossDomainDependencyChannels,
} from "./crossDomainDependencyModel.ts";

export {
  buildExecutiveTopologySemantics,
  buildRegionExecutiveSummary,
} from "./executiveTopologySemantics.ts";

export {
  extractTopologyObjectsFromScene,
  buildOperationalUniverseTopology,
  buildTopologyPanelContract,
  freezeOperationalUniverseTopologySnapshot,
} from "./operationalUniverseTopologyEngine.ts";
