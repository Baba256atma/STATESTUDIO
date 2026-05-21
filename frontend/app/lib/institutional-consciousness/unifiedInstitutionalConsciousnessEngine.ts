import { stableSignature } from "../intelligence/shared/dedupe";
import {
  awarenessLevelRank,
  beginUnifiedInstitutionalConsciousnessEvaluation,
  endUnifiedInstitutionalConsciousnessEvaluation,
  runtimeStatusRank,
  shouldEvaluateUnifiedInstitutionalConsciousness,
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_RUNTIME_SIGNALS,
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_ACTIVE_SUBSYSTEMS,
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_STEWARDSHIP_DEPTH,
  validateCivilizationScaleEnterpriseSnapshot,
} from "./unifiedInstitutionalConsciousnessGuards";
import { getUnifiedInstitutionalConsciousnessStore } from "./unifiedInstitutionalConsciousnessStore";
import type {
  CivilizationScaleEnterpriseSnapshot,
  CivilizationScaleRuntimeSignal,
  InstitutionalAwarenessLevel,
  InstitutionalConsciousnessHealth,
  InstitutionalConsciousnessRuntimeHistoryEntry,
  InstitutionalConsciousnessSubsystemId,
  InstitutionalConsciousnessSubsystemState,
  MacroSystemAwarenessSummary,
  UnifiedInstitutionalConsciousnessRuntimeInput,
  UnifiedInstitutionalConsciousnessRuntimeResult,
  UnifiedInstitutionalConsciousnessRuntimeStatus,
} from "./unifiedInstitutionalConsciousnessTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedInstitutionalConsciousness]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapPostureToAwareness(
  posture: string | undefined
): InstitutionalAwarenessLevel {
  if (posture === "executive_grade" || posture === "civilization_scale") return "civilization_scale";
  if (posture === "high" || posture === "institutional_grade") return "institutional_grade";
  if (posture === "moderate" || posture === "systemic") return "systemic";
  if (posture === "low") return "weak";
  return "moderate";
}

function mapStrengthToAwareness(strength: string | undefined): InstitutionalAwarenessLevel {
  if (strength === "civilization_scale") return "civilization_scale";
  if (strength === "systemic" || strength === "resilient" || strength === "stable") return "systemic";
  if (strength === "moderate" || strength === "mature") return "moderate";
  return "weak";
}

function subsystemStatusFromAwareness(
  awareness: InstitutionalAwarenessLevel,
  pressured: boolean
): UnifiedInstitutionalConsciousnessRuntimeStatus {
  if (pressured && (awareness === "weak" || awareness === "moderate")) return "pressured";
  if (awareness === "civilization_scale" || awareness === "institutional_grade") {
    return pressured ? "adaptive" : "stable";
  }
  if (awareness === "systemic") return pressured ? "adaptive" : "stable";
  if (awareness === "moderate") return "adaptive";
  return "initializing";
}

function buildSubsystemState(
  subsystemId: InstitutionalConsciousnessSubsystemId,
  observationCount: number,
  headline: string,
  awarenessLevel: InstitutionalAwarenessLevel,
  pressured: boolean,
  now: number
): InstitutionalConsciousnessSubsystemState {
  return {
    subsystemId,
    status: subsystemStatusFromAwareness(awarenessLevel, pressured),
    observationCount,
    awarenessLevel,
    headline: headline.slice(0, 120),
    active: observationCount > 0,
    lastUpdatedAt: now,
  };
}

function buildAllSubsystemStates(
  input: UnifiedInstitutionalConsciousnessRuntimeInput,
  now: number
): InstitutionalConsciousnessSubsystemState[] {
  const pressured = input.fragilityElevated === true || input.operationalTopologyStressed === true;
  const foundation = input.institutionalConsciousnessSnapshot;
  const sync = input.ecosystemSynchronizationSnapshot;
  const fragility = input.civilizationFragilitySnapshot;
  const influence = input.institutionalInfluenceSnapshot;
  const continuity = input.civilizationContinuitySnapshot;
  const adaptation = input.civilizationAdaptationSnapshot;
  const coordination = input.civilizationCoordinationSnapshot;
  const wisdom = input.civilizationWisdomSnapshot;
  const stewardship = input.civilizationStewardshipSnapshot;

  return [
    buildSubsystemState(
      "institutional_consciousness",
      foundation?.observationCount ?? 0,
      foundation?.awarenessSummary.awarenessHeadline ??
        "Institutional consciousness foundation awaiting depth.",
      mapPostureToAwareness(foundation?.awarenessSummary.ecosystemPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "ecosystem_synchronization",
      sync?.observationCount ?? 0,
      sync?.synchronizationSummary.synchronizationHeadline ??
        "Ecosystem synchronization awaiting depth.",
      mapPostureToAwareness(sync?.synchronizationSummary.interdependencyPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_fragility",
      fragility?.observationCount ?? 0,
      fragility?.resilienceSummary.resilienceHeadline ?? "Civilization fragility awaiting depth.",
      mapStrengthToAwareness(fragility?.resilienceSummary.dominantPropagationStrength),
      pressured,
      now
    ),
    buildSubsystemState(
      "institutional_influence",
      influence?.observationCount ?? 0,
      influence?.impactSummary.impactHeadline ?? "Institutional influence awaiting depth.",
      mapPostureToAwareness(influence?.impactSummary.ecosystemInfluencePosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_continuity",
      continuity?.observationCount ?? 0,
      continuity?.continuitySummary.continuityHeadline ?? "Civilization continuity awaiting depth.",
      mapPostureToAwareness(continuity?.continuitySummary.survivabilityPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_adaptation",
      adaptation?.observationCount ?? 0,
      adaptation?.adaptationSummary.adaptationHeadline ?? "Civilization adaptation awaiting depth.",
      mapPostureToAwareness(adaptation?.adaptationSummary.evolutionPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_coordination",
      coordination?.observationCount ?? 0,
      coordination?.coordinationSummary.coordinationHeadline ??
        "Civilization coordination awaiting depth.",
      mapPostureToAwareness(coordination?.coordinationSummary.harmonyPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_wisdom",
      wisdom?.observationCount ?? 0,
      wisdom?.wisdomSummary.wisdomHeadline ?? "Civilization wisdom awaiting depth.",
      mapPostureToAwareness(wisdom?.wisdomSummary.learningPosture),
      pressured,
      now
    ),
    buildSubsystemState(
      "civilization_stewardship",
      stewardship?.observationCount ?? 0,
      stewardship?.stewardshipSummary.stewardshipHeadline ??
        "Civilization stewardship awaiting depth.",
      mapPostureToAwareness(stewardship?.stewardshipSummary.preservationPosture),
      pressured,
      now
    ),
  ];
}

function formatStateLabel(state: string | undefined): string {
  return state?.replace(/_/g, " ") ?? "pending";
}

function mapEcosystemState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const sync = input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState;
  if (
    sync === "synchronized" ||
    sync === "systemically_integrated" ||
    sync === "civilization_coherent"
  ) {
    return "interconnected";
  }
  if (sync === "partially_connected") return "partially_interconnected";
  return formatStateLabel(sync);
}

function mapContinuityState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const state =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState;
  if (state === "continuity_preserved" || state === "sustainable") return "preserved";
  if (state === "adaptive") return "adaptive";
  if (state === "pressured" || state === "fragile") return "pressured";
  return formatStateLabel(state);
}

function mapAdaptationState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const state = input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState;
  if (state === "reorganizing") return "reorganizing";
  if (state === "evolutionarily_stable" || state === "adaptive") return "adaptive";
  if (state === "shifting") return "shifting";
  if (state === "static") return "static";
  return formatStateLabel(state);
}

function mapCoordinationState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const state = input.civilizationCoordinationSnapshot?.coordinationSummary.dominantHarmonyState;
  if (state === "harmonized" || state === "civilization_coherent") return "harmonized";
  if (state === "coordinated") return "coordinated";
  if (state === "unstable" || state === "fragmented") return "strained";
  return formatStateLabel(state);
}

function mapWisdomState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const state = input.civilizationWisdomSnapshot?.wisdomSummary.dominantConvergenceState;
  if (state === "wisdom_stabilized" || state === "converging") return "converging";
  if (state === "adaptive" || state === "emerging") return "emerging";
  if (state === "fragmented") return "fragmented";
  return formatStateLabel(state);
}

function mapStewardshipState(input: UnifiedInstitutionalConsciousnessRuntimeInput): string {
  const state =
    input.civilizationStewardshipSnapshot?.stewardshipSummary.dominantPreservationState;
  if (state === "reinforced" || state === "sustainably_preserved") return "reinforced";
  if (state === "protected") return "protected";
  if (state === "pressured" || state === "degrading") return "pressured";
  return formatStateLabel(state);
}

function buildMacroSummary(
  input: UnifiedInstitutionalConsciousnessRuntimeInput
): MacroSystemAwarenessSummary {
  const fragility = input.civilizationFragilitySnapshot;
  const coordination = input.civilizationCoordinationSnapshot;
  const stewardship = input.civilizationStewardshipSnapshot;

  let primaryMacroRisk = "localized operational strain";
  if (input.fragilityElevated) {
    primaryMacroRisk =
      fragility?.recentObservations[0]?.fragilityCategory === "logistics_fragility"
        ? "cascading logistics fragility"
        : "cascading macro-system fragility";
  } else if (
    fragility?.resilienceSummary.dominantResilienceState === "unstable" ||
    fragility?.resilienceSummary.dominantResilienceState === "pressured"
  ) {
    primaryMacroRisk = "elevated resilience propagation risk";
  }

  let primaryMacroOpportunity = "operational continuity reinforcement";
  if (
    coordination?.coordinationSummary.dominantHarmonyState === "harmonized" ||
    coordination?.coordinationSummary.dominantHarmonyState === "civilization_coherent"
  ) {
    primaryMacroOpportunity = "distributed resilience reinforcement";
  } else if (
    stewardship?.stewardshipSummary.dominantPreservationState === "reinforced" ||
    stewardship?.stewardshipSummary.dominantPreservationState === "sustainably_preserved"
  ) {
    primaryMacroOpportunity = "long-horizon ecosystem survivability reinforcement";
  }

  return {
    ecosystemState: mapEcosystemState(input),
    continuityState: mapContinuityState(input),
    adaptationState: mapAdaptationState(input),
    coordinationState: mapCoordinationState(input),
    wisdomState: mapWisdomState(input),
    stewardshipState: mapStewardshipState(input),
    primaryMacroRisk,
    primaryMacroOpportunity,
  };
}

function deriveRuntimeStatus(
  subsystemStates: InstitutionalConsciousnessSubsystemState[],
  priorStatus: UnifiedInstitutionalConsciousnessRuntimeStatus | null,
  fragilityElevated: boolean
): UnifiedInstitutionalConsciousnessRuntimeStatus {
  const active = subsystemStates.filter((s) => s.active);
  if (active.length < UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_ACTIVE_SUBSYSTEMS) {
    return "initializing";
  }

  const pressuredCount = active.filter((s) => s.status === "pressured").length;
  const stableCount = active.filter((s) => s.status === "stable").length;

  if (pressuredCount >= 3 || (fragilityElevated && pressuredCount >= 1)) {
    if (priorStatus === "pressured" || priorStatus === "adaptive") return "pressured";
    return "pressured";
  }

  if (stableCount >= active.length - 1 && !fragilityElevated) return "stable";

  if (
    priorStatus === "pressured" &&
    stableCount >= Math.floor(active.length / 2)
  ) {
    return "recovering";
  }

  return "adaptive";
}

function deriveAwarenessLevel(
  subsystemStates: InstitutionalConsciousnessSubsystemState[]
): InstitutionalAwarenessLevel {
  const active = subsystemStates.filter((s) => s.active);
  if (active.length === 0) return "weak";

  const levels = active.map((s) => s.awarenessLevel);
  if (levels.some((l) => l === "civilization_scale")) return "civilization_scale";
  if (levels.filter((l) => l === "institutional_grade" || l === "systemic").length >= 4) {
    return "institutional_grade";
  }
  if (levels.filter((l) => l === "systemic" || l === "moderate").length >= 3) return "systemic";
  if (levels.some((l) => l === "moderate")) return "moderate";
  return "weak";
}

function buildInstitutionalConsciousnessHealth(
  awarenessLevel: InstitutionalAwarenessLevel,
  summary: MacroSystemAwarenessSummary,
  runtimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus
): InstitutionalConsciousnessHealth {
  return {
    level: awarenessLevel,
    integrityState: runtimeStatus.replace(/_/g, " "),
    macroHeadline: `Civilization-scale enterprise awareness ${runtimeStatus.replace(/_/g, " ")} — ${summary.ecosystemState} ecosystems, ${summary.stewardshipState} stewardship, ${summary.coordinationState} coordination.`,
    resiliencePosture:
      summary.stewardshipState === "reinforced" || summary.continuityState === "preserved"
        ? "high"
        : summary.continuityState === "pressured"
          ? "moderate"
          : "low",
  };
}

function buildRuntimeSignals(
  activeSubsystems: InstitutionalConsciousnessSubsystemId[],
  summary: MacroSystemAwarenessSummary,
  runtimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus,
  now: number
): CivilizationScaleRuntimeSignal[] {
  const signals: CivilizationScaleRuntimeSignal[] = [];

  if (activeSubsystems.includes("civilization_fragility")) {
    signals.push({
      signalId: stableSignature(["civilization-runtime-signal", "fragility"]).slice(0, 48),
      signalLabel: "macro fragility awareness",
      signalSummary: summary.primaryMacroRisk.slice(0, 100),
      linkedSubsystems: Object.freeze(["civilization_fragility", "ecosystem_synchronization"]),
      signalIntensity: runtimeStatus === "pressured" ? "high" : "moderate",
      generatedAt: now,
    });
  }

  if (activeSubsystems.includes("civilization_stewardship")) {
    signals.push({
      signalId: stableSignature(["civilization-runtime-signal", "stewardship"]).slice(0, 48),
      signalLabel: "stewardship preservation",
      signalSummary: `Stewardship ${summary.stewardshipState} — ${summary.primaryMacroOpportunity}`.slice(
        0,
        100
      ),
      linkedSubsystems: Object.freeze([
        "civilization_stewardship",
        "civilization_continuity",
      ]),
      signalIntensity: summary.stewardshipState === "reinforced" ? "high" : "moderate",
      generatedAt: now,
    });
  }

  if (activeSubsystems.includes("civilization_coordination")) {
    signals.push({
      signalId: stableSignature(["civilization-runtime-signal", "coordination"]).slice(0, 48),
      signalLabel: "ecosystem coordination",
      signalSummary: `Coordination ${summary.coordinationState} across interconnected macro-operational ecosystems.`.slice(
        0,
        100
      ),
      linkedSubsystems: Object.freeze([
        "civilization_coordination",
        "ecosystem_synchronization",
      ]),
      signalIntensity: summary.coordinationState === "coordinated" ? "moderate" : "low",
      generatedAt: now,
    });
  }

  return signals.slice(0, UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_RUNTIME_SIGNALS);
}

function buildEnterpriseSnapshot(
  organizationId: string,
  runtimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus,
  awarenessLevel: InstitutionalAwarenessLevel,
  summary: MacroSystemAwarenessSummary,
  activeSubsystems: InstitutionalConsciousnessSubsystemId[],
  subsystemStates: InstitutionalConsciousnessSubsystemState[],
  health: InstitutionalConsciousnessHealth,
  runtimeSignals: CivilizationScaleRuntimeSignal[],
  now: number
): CivilizationScaleEnterpriseSnapshot {
  const signature = stableSignature([
    "d9-8-10-unified-institutional-consciousness-snapshot",
    organizationId,
    runtimeStatus,
    awarenessLevel,
    activeSubsystems.join(","),
    summary.ecosystemState,
    summary.stewardshipState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    runtimeStatus,
    awarenessLevel,
    summary,
    activeSubsystems: Object.freeze(activeSubsystems),
    subsystemStates: Object.freeze(subsystemStates),
    institutionalConsciousnessHealth: health,
    runtimeSignals: Object.freeze(runtimeSignals),
  };
}

export function evaluateUnifiedInstitutionalConsciousnessRuntime(
  input: UnifiedInstitutionalConsciousnessRuntimeInput
): UnifiedInstitutionalConsciousnessRuntimeResult {
  if (!beginUnifiedInstitutionalConsciousnessEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      activeSubsystemCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getUnifiedInstitutionalConsciousnessStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-10-unified-institutional-consciousness-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.institutionalConsciousnessSnapshot?.signature ?? "no-foundation",
      input.ecosystemSynchronizationSnapshot?.signature ?? "no-sync",
      input.civilizationFragilitySnapshot?.signature ?? "no-fragility",
      input.institutionalInfluenceSnapshot?.signature ?? "no-influence",
      input.civilizationContinuitySnapshot?.signature ?? "no-continuity",
      input.civilizationAdaptationSnapshot?.signature ?? "no-adaptation",
      input.civilizationCoordinationSnapshot?.signature ?? "no-coordination",
      input.civilizationWisdomSnapshot?.signature ?? "no-wisdom",
      input.civilizationStewardshipSnapshot?.signature ?? "no-stewardship",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateUnifiedInstitutionalConsciousness(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.enterpriseSnapshots[0] ?? null,
        activeSubsystemCount: prior.subsystemStates.filter((s) => s.active).length,
        storeSignature: prior.signature,
      };
    }

    const stewardshipDepth = input.civilizationStewardshipSnapshot?.observationCount ?? 0;
    if (stewardshipDepth < UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_STEWARDSHIP_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_stewardship_depth",
        snapshot: prior.enterpriseSnapshots[0] ?? null,
        activeSubsystemCount: 0,
        storeSignature: prior.signature,
      };
    }

    const subsystemStates = buildAllSubsystemStates(input, now);
    const activeSubsystems = subsystemStates
      .filter((s) => s.active)
      .map((s) => s.subsystemId) as InstitutionalConsciousnessSubsystemId[];

    if (activeSubsystems.length < UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_ACTIVE_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_subsystems",
        snapshot: prior.enterpriseSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const runtimeStatus = deriveRuntimeStatus(
      subsystemStates,
      prior.lastRuntimeStatus,
      input.fragilityElevated ?? false
    );
    const awarenessLevel = deriveAwarenessLevel(subsystemStates);
    const summary = buildMacroSummary(input);
    const health = buildInstitutionalConsciousnessHealth(awarenessLevel, summary, runtimeStatus);
    const runtimeSignals = buildRuntimeSignals(
      activeSubsystems,
      summary,
      runtimeStatus,
      now
    );

    const snapshot = buildEnterpriseSnapshot(
      organizationId,
      runtimeStatus,
      awarenessLevel,
      summary,
      activeSubsystems,
      subsystemStates,
      health,
      runtimeSignals,
      now
    );

    if (!validateCivilizationScaleEnterpriseSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_enterprise_snapshot",
        snapshot: prior.enterpriseSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: InstitutionalConsciousnessRuntimeHistoryEntry = {
      entryId: stableSignature(["institutional-consciousness-history", snapshot.signature]).slice(
        0,
        48
      ),
      awarenessLevel,
      runtimeStatus,
      headline: health.macroHeadline.slice(0, 80),
      generatedAt: now,
    };

    store.upsertEnterpriseSnapshots([snapshot], now);
    store.upsertSubsystemStates(subsystemStates, now);
    store.upsertRuntimeHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(runtimeStatus);

    const finalState = store.getState();
    const priorRuntime = prior.lastRuntimeStatus;

    if (priorRuntime && priorRuntime !== runtimeStatus) {
      if (runtimeStatus === "stable" || runtimeStatus === "recovering") {
        devLog(`runtime health change — ${priorRuntime} → ${runtimeStatus}`);
      } else if (runtimeStatus === "pressured") {
        devLog("macro-system awareness formation — civilization-scale pressure mapped");
      }
    }

    if (
      activeSubsystems.includes("civilization_fragility") &&
      (input.fragilityElevated || summary.primaryMacroRisk.includes("cascading"))
    ) {
      devLog("civilization-scale fragility emergence — bounded propagation awareness active");
    }

    if (
      summary.stewardshipState === "reinforced" ||
      summary.stewardshipState === "protected"
    ) {
      devLog("stewardship stabilization — ecosystem durability reinforcement observed");
    }

    if (
      summary.coordinationState === "coordinated" ||
      summary.coordinationState === "harmonized"
    ) {
      if (priorRuntime === "pressured" || priorRuntime === "adaptive") {
        devLog("ecosystem coordination shift — macro-operational harmony advancing");
      }
    }

    if (awarenessLevel === "civilization_scale" && runtimeStatus === "stable") {
      devLog("long-horizon continuity stabilization — unified institutional consciousness runtime complete");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeSubsystemCount: activeSubsystems.length,
      storeSignature: finalState.signature,
    };
  } finally {
    endUnifiedInstitutionalConsciousnessEvaluation();
  }
}
