/**
 * D7:1:10 — Deterministic governance policy thresholds (aligned with D7 guard rails).
 */

import { DEFAULT_MAX_ACTIVE_BRANCHES, DEFAULT_MAX_BRANCH_DEPTH } from "../branching/branchingGuards.ts";
import { DEFAULT_MAX_WAR_ROOM_SCENARIOS } from "../warroom/warRoomGuards.ts";
import { PROPAGATION_MAX_EFFECTIVE_DEPTH } from "../simulationPropagationAttenuation.ts";

export const GOVERNANCE_POLICY = Object.freeze({
  maxActiveBranches: DEFAULT_MAX_ACTIVE_BRANCHES,
  maxBranchDepth: DEFAULT_MAX_BRANCH_DEPTH,
  maxWarRoomScenarios: DEFAULT_MAX_WAR_ROOM_SCENARIOS,
  maxUniverseTimelines: 32,
  maxPropagationDepthAverage: PROPAGATION_MAX_EFFECTIVE_DEPTH - 0.5,
  minReplayIntegrityScore: 0.85,
  minIntegrityScoreStable: 0.92,
  minIntegrityScoreMonitoring: 0.75,
  minIntegrityScoreDegraded: 0.55,
  branchExplosionWarningRatio: 0.85,
  orchestrationPressurePerScenario: 0.08,
  comparisonPressureWeight: 0.04,
});

export type GovernancePolicy = typeof GOVERNANCE_POLICY;
