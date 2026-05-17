/**
 * D7:2:4 — Operational fragility concentration mapping (public surface).
 */

export type {
  FragilityConcentrationLevel,
  FragilityConcentrationZone,
  RegionFragilityProfile,
  CrossDomainVulnerabilityCorridor,
  OperationalFragilityMap,
  ExecutiveFragilitySemantics,
  FragilityConcentrationSnapshot,
  FragilityPanelContract,
  FragilityPanelZoneRow,
  FragilityPanelRegionRow,
  RegionFragilityMetrics,
  SimulationFragilityContext,
  MapOperationalFragilityInput,
  MapOperationalFragilityResult,
} from "./fragilityConcentrationTypes.ts";

export type { FragilityGuardCode, FragilityGuardResult } from "./fragilityGuards.ts";
export {
  DEFAULT_MAX_FRAGILITY_ZONES,
  DEFAULT_MAX_CONCENTRATION_HOTSPOTS,
  DEFAULT_MAX_SYSTEMIC_EXPOSURE_SCORE,
  buildFragilityContentFingerprint,
  detectFalseConcentrationLoop,
  guardMapOperationalFragility,
} from "./fragilityGuards.ts";

export { logFragilityDev } from "./fragilityDevLog.ts";
export type { FragilityDevChannel } from "./fragilityDevLog.ts";

export {
  buildRegionalFragilityProfiles,
  identifyCriticalRegions,
  identifyConcentrationHotspots,
} from "./fragilityAccumulationModel.ts";

export { clusterFragilityConcentrationZones } from "./hotspotClusteringModel.ts";

export {
  calculateConcentrationDensity,
  calculateSystemicExposureScore,
  calculateCascadePotentialScore,
  classifyCollapseRiskLabel,
} from "./systemicExposureAnalysis.ts";

export { mapCrossDomainVulnerabilityCorridors } from "./crossDomainVulnerabilityMapping.ts";

export { buildExecutiveFragilitySemantics } from "./executiveFragilitySemantics.ts";

export {
  mapOperationalFragility,
  buildFragilityPanelContract,
  freezeFragilityConcentrationSnapshot,
} from "./operationalFragilityConcentrationEngine.ts";
