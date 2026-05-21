import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalMemorySyncStore } from "./temporalMemorySyncStore";
import { getTemporalCompressionStore } from "./temporalCompressionStore";
import { getTemporalConvergenceStore } from "./temporalConvergenceStore";
import { getOperationalReplayStore } from "./operationalReplayStore";
import {
  beginTemporalFieldEvaluation,
  confidenceToFieldLevel,
  endTemporalFieldEvaluation,
  horizonRank,
  shouldEvaluateTemporalField,
  shouldRetainTimeField,
} from "./temporalFieldGuards";
import { getTemporalFieldStore } from "./temporalFieldStore";
import type { ExecutiveTemporalDigest } from "./temporalCompressionTypes";
import type { TemporalMemorySyncRecord } from "./temporalMemorySyncTypes";
import type { StabilityConvergencePattern } from "./temporalConvergenceTypes";
import type {
  EnterpriseLongHorizonPattern,
  FieldCategory,
  FieldStrength,
  HorizonState,
  InstitutionalContinuityField,
  LongHorizonAwarenessSnapshot,
  LongHorizonContinuitySignal,
  OperationalEraEvolution,
  OrganizationalTimeField,
  StrategicTemporalField,
  StrategicTimeFieldInput,
  StrategicTimeFieldResult,
} from "./temporalFieldTypes";
import type { OrganizationalContinuitySnapshot } from "../institutional-memory/institutionalContinuityTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalField]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildFieldId(category: FieldCategory, strength: FieldStrength): string {
  return stableSignature(["enterprise-time-field", category, strength]).slice(0, 56);
}

function dedupeSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createTimeField(
  category: FieldCategory,
  fieldStrength: FieldStrength,
  horizonState: HorizonState,
  summary: string,
  signals: string[],
  confidence: number,
  now: number
): OrganizationalTimeField {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    temporalFieldId: buildFieldId(category, fieldStrength),
    category,
    fieldStrength,
    horizonState,
    summary,
    fieldSignals: dedupeSignals(signals),
    confidence: conf,
    confidenceLevel: confidenceToFieldLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildFoundationalResilienceField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  digests: readonly ExecutiveTemporalDigest[],
  convergence: readonly StabilityConvergencePattern[],
  maturityTrend: string | undefined,
  resilienceForecastLine: string,
  now: number
): OrganizationalTimeField | null {
  const resilienceSync = syncRecords.some((r) => r.category === "resilience_shift");
  const resilienceDigest = digests.some((d) => d.category === "resilience" || d.category === "recovery");
  const resilienceConvergence = convergence.some((p) => p.category === "resilience_alignment");
  const forecastPositive =
    resilienceForecastLine.includes("strengthen") ||
    resilienceForecastLine.includes("improv") ||
    resilienceForecastLine.includes("recover");
  const improving = maturityTrend === "improving" || maturityTrend === "accelerating";

  if (!resilienceSync && !resilienceDigest && !resilienceConvergence && !forecastPositive) {
    return null;
  }

  const foundational =
    resilienceSync && resilienceConvergence && (improving || forecastPositive);

  return createTimeField(
    "resilience",
    foundational ? "foundational" : resilienceConvergence ? "strong" : "moderate",
    foundational ? "institutional" : "long_term",
    "The organization demonstrates persistent long-term resilience evolution characterized by governance stabilization, reduced escalation spread, and increasing operational recovery maturity.",
    [
      "resilience_growth",
      "reduced_fragility",
      "coordination_stabilization",
      "institutional_adaptation",
    ],
    foundational ? 0.91 : resilienceConvergence ? 0.86 : 0.78,
    now
  );
}

function buildStructuralGovernanceWeaknessField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  convergence: readonly StabilityConvergencePattern[],
  continuityPreserved: boolean,
  now: number
): OrganizationalTimeField | null {
  const escalationSync = syncRecords.filter((r) => r.category === "escalation_cycle").length;
  const govWeak = convergence.some(
    (p) => p.alignmentState === "emerging" && p.category === "governance_stabilization"
  );
  if (escalationSync < 1 && continuityPreserved && !govWeak) return null;

  return createTimeField(
    "governance",
    escalationSync >= 2 ? "strong" : "moderate",
    "structural",
    "Persistent governance instability over long horizons indicates structural governance weakness within the enterprise temporal field.",
    [
      "governance_instability",
      "oversight_fragmentation",
      "structural_pressure",
      "long_horizon_governance_drift",
    ],
    escalationSync >= 2 ? 0.84 : 0.74,
    now
  );
}

function buildInstitutionalFragilityContinuityField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  digests: readonly ExecutiveTemporalDigest[],
  fragilityElevated: boolean,
  now: number
): OrganizationalTimeField | null {
  const escalationCycles = syncRecords.filter((r) => r.category === "escalation_cycle").length;
  const fragilityDigest = digests.filter((d) => d.category === "fragility" || d.category === "escalation").length;
  if (escalationCycles < 1 && fragilityDigest < 1 && !fragilityElevated) return null;

  return createTimeField(
    "fragility",
    escalationCycles >= 2 || fragilityElevated ? "strong" : "moderate",
    "institutional",
    "Recurring escalation cycles across operational eras form an institutional fragility continuity field with persistent long-horizon pressure concentration.",
    [
      "escalation_recurrence",
      "fragility_persistence",
      "institutional_pressure_field",
      "long_horizon_instability",
    ],
    escalationCycles >= 2 ? 0.83 : 0.72,
    now
  );
}

function buildAdaptiveOperationalEvolutionField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  convergence: readonly StabilityConvergencePattern[],
  now: number
): OrganizationalTimeField | null {
  const coordination = convergence.some((p) => p.category === "operational_coordination");
  const continuity = syncRecords.some((r) => r.category === "continuity");
  if (!coordination && !continuity) return null;

  return createTimeField(
    "coordination",
    coordination && continuity ? "strong" : "moderate",
    "long_term",
    "Long-term coordination improvement across synchronized periods indicates adaptive operational evolution within the enterprise time field.",
    [
      "coordination_improvement",
      "operational_synchronization",
      "adaptive_evolution",
      "cross_era_coordination",
    ],
    coordination ? 0.85 : 0.76,
    now
  );
}

function buildResilienceMaturityField(
  replays: readonly { replayState: string; replayCategory: string }[],
  convergence: readonly StabilityConvergencePattern[],
  now: number
): OrganizationalTimeField | null {
  const recoveryReplay = replays.some(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  );
  const recoveryConvergence = convergence.some((p) => p.category === "recovery_synchronization");
  if (!recoveryReplay && !recoveryConvergence) return null;

  return createTimeField(
    "recovery",
    recoveryReplay && recoveryConvergence ? "foundational" : "strong",
    "institutional",
    "Recovery stabilization strengthening gradually across operational eras signals enterprise resilience maturity within the long-horizon field.",
    [
      "recovery_maturity",
      "operational_restoration",
      "stabilization_strengthening",
      "era_recovery_progression",
    ],
    recoveryConvergence ? 0.88 : 0.8,
    now
  );
}

function buildLongHorizonStabilizationField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  convergence: readonly StabilityConvergencePattern[],
  now: number
): OrganizationalTimeField | null {
  const decay = convergence.some((p) => p.category === "escalation_decay");
  const operationalShift = syncRecords.filter((r) => r.category === "operational_shift").length;
  if (!decay && operationalShift < 1) return null;

  return createTimeField(
    "operational",
    decay ? "strong" : "moderate",
    "long_term",
    "Pressure propagation weakening structurally across horizons indicates a long-horizon stabilization trend within the organizational time field.",
    [
      "pressure_decay",
      "stabilization_trend",
      "reduced_propagation",
      "structural_de_escalation",
    ],
    decay ? 0.87 : 0.75,
    now
  );
}

function buildStrategicContinuityField(
  digests: readonly ExecutiveTemporalDigest[],
  enterpriseNarrativeLine: string,
  continuitySnapshot: OrganizationalContinuitySnapshot | null,
  now: number
): OrganizationalTimeField | null {
  const strategicDigest = digests.some(
    (d) => d.category === "strategic" || d.compressionLevel === "executive_core"
  );
  const narrativePresent = enterpriseNarrativeLine.trim().length > 12;
  const foundationalContinuity =
    continuitySnapshot?.dominantContinuityLevel === "foundational" ||
    continuitySnapshot?.dominantContinuityLevel === "institutionalized";
  if (!strategicDigest && !narrativePresent && !foundationalContinuity) return null;

  return createTimeField(
    "strategic",
    foundationalContinuity ? "foundational" : strategicDigest ? "strong" : "moderate",
    foundationalContinuity ? "structural" : "institutional",
    "Strategic operational continuity persists across extended horizons through executive evolution narratives and institutional knowledge preservation.",
    [
      "strategic_continuity",
      "executive_evolution",
      "institutional_persistence",
      "long_horizon_strategy",
    ],
    foundationalContinuity ? 0.9 : 0.82,
    now
  );
}

function buildGovernanceDurabilityField(
  syncRecords: readonly TemporalMemorySyncRecord[],
  convergence: readonly StabilityConvergencePattern[],
  continuityPreserved: boolean,
  now: number
): OrganizationalTimeField | null {
  const govSync = syncRecords.some((r) => r.category === "governance_evolution");
  const govConvergence = convergence.some((p) => p.category === "governance_stabilization");
  if (!govSync && !govConvergence && !continuityPreserved) return null;

  return createTimeField(
    "governance",
    govSync && govConvergence ? "foundational" : "strong",
    "institutional",
    "Governance durability evolution strengthens across long horizons as stabilization convergence and cross-period governance synchronization align.",
    [
      "governance_durability",
      "stabilization_persistence",
      "oversight_maturity",
      "institutional_governance_field",
    ],
    govConvergence ? 0.86 : 0.77,
    now
  );
}

function rankTimeFields(fields: OrganizationalTimeField[]): OrganizationalTimeField[] {
  const strengthRank: Record<FieldStrength, number> = {
    foundational: 4,
    strong: 3,
    moderate: 2,
    weak: 1,
  };
  return [...fields]
    .sort(
      (a, b) =>
        strengthRank[b.fieldStrength] - strengthRank[a.fieldStrength] ||
        horizonRank(b.horizonState) - horizonRank(a.horizonState) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildLongHorizonPatterns(
  fields: OrganizationalTimeField[],
  now: number
): EnterpriseLongHorizonPattern[] {
  return fields.slice(0, 4).map((f) => ({
    patternId: stableSignature(["long-horizon-pattern", f.temporalFieldId]).slice(0, 48),
    category: f.category,
    fieldStrength: f.fieldStrength,
    horizonState: f.horizonState,
    patternLabel: `${f.category} long-horizon pattern`,
    patternSummary: f.summary.slice(0, 140),
    linkedFieldIds: Object.freeze([f.temporalFieldId]),
    confidence: f.confidence,
    generatedAt: now,
  }));
}

function buildStrategicTemporalFields(
  fields: OrganizationalTimeField[],
  now: number
): StrategicTemporalField[] {
  const byCategory = new Map<FieldCategory, OrganizationalTimeField[]>();
  for (const f of fields) {
    const list = byCategory.get(f.category) ?? [];
    list.push(f);
    byCategory.set(f.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, group]) => ({
    fieldKey: stableSignature(["strategic-temporal-field", category]).slice(0, 48),
    category,
    fieldLabel: `${category} temporal field`,
    structuralSummary: group[0]!.summary.slice(0, 120),
    horizonState: group.reduce<HorizonState>(
      (best, f) => (horizonRank(f.horizonState) > horizonRank(best) ? f.horizonState : best),
      group[0]!.horizonState
    ),
    fieldIds: Object.freeze(group.map((f) => f.temporalFieldId)),
    generatedAt: now,
  }));
}

function buildEraEvolutions(
  fields: OrganizationalTimeField[],
  now: number
): OperationalEraEvolution[] {
  return fields.slice(0, 3).map((f) => ({
    eraId: stableSignature(["operational-era", f.temporalFieldId]).slice(0, 48),
    category: f.category,
    eraLabel: `${f.category} era evolution`,
    evolutionSummary: f.summary.slice(0, 120),
    eraSignals: f.fieldSignals,
    horizonState: f.horizonState,
    generatedAt: now,
  }));
}

function buildContinuityFields(
  fields: OrganizationalTimeField[],
  continuitySnapshot: OrganizationalContinuitySnapshot | null,
  now: number
): InstitutionalContinuityField[] {
  const level = continuitySnapshot?.dominantContinuityLevel ?? "retained";
  return fields.slice(0, 3).map((f) => ({
    continuityFieldId: stableSignature(["continuity-field", f.temporalFieldId]).slice(0, 48),
    category: f.category,
    continuityLevel: level,
    fieldStrength: f.fieldStrength,
    continuitySummary: `Institutional continuity field bridging ${f.category} evolution across ${f.horizonState} horizons.`,
    linkedFieldIds: Object.freeze([f.temporalFieldId]),
    generatedAt: now,
  }));
}

function buildContinuitySignals(
  fields: OrganizationalTimeField[],
  now: number
): LongHorizonContinuitySignal[] {
  return fields.slice(0, 4).map((f) => ({
    signalId: stableSignature(["long-horizon-signal", f.temporalFieldId]).slice(0, 48),
    category: f.category,
    fieldStrength: f.fieldStrength,
    summary: f.summary.slice(0, 100),
    confidence: f.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSnapshot(
  organizationId: string,
  fields: OrganizationalTimeField[],
  patterns: EnterpriseLongHorizonPattern[],
  strategicFields: StrategicTemporalField[],
  eraEvolutions: OperationalEraEvolution[],
  continuityFields: InstitutionalContinuityField[],
  signals: LongHorizonContinuitySignal[],
  now: number
): LongHorizonAwarenessSnapshot {
  const dominant = fields[0];
  const signature = stableSignature([
    "d9-3-9-long-horizon-awareness",
    organizationId,
    fields.map((f) => f.temporalFieldId),
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    fieldCount: fields.length,
    horizonSummary: dominant
      ? dominant.summary
      : "Long-horizon organizational time-field awareness pending sufficient temporal depth.",
    dominantCategory: dominant?.category ?? "unknown",
    dominantFieldStrength: dominant?.fieldStrength ?? "weak",
    dominantHorizonState: dominant?.horizonState ?? "short_term",
    recentTimeFields: Object.freeze(fields),
    longHorizonPatterns: Object.freeze(patterns),
    strategicTemporalFields: Object.freeze(strategicFields),
    eraEvolutions: Object.freeze(eraEvolutions),
    continuityFields: Object.freeze(continuityFields),
    continuitySignals: Object.freeze(signals),
  };
}

/**
 * D9:3:9 — Passive strategic organizational time-field + long-horizon awareness evaluation.
 */
export function evaluateStrategicTimeFieldIntelligence(
  input: StrategicTimeFieldInput
): StrategicTimeFieldResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getTemporalFieldStore(organizationId);

  if (!beginTemporalFieldEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newTimeFields: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const syncState = getTemporalMemorySyncStore(organizationId).getState();
    const compressionState = getTemporalCompressionStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const syncSnapshot = input.syncSnapshot ?? syncState.snapshots[0] ?? null;
    const compressionSnapshot =
      input.compressionSnapshot ?? compressionState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-9-field-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      syncSnapshot?.signature ?? syncState.signature,
      compressionSnapshot?.signature ?? compressionState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
      input.maturitySnapshot?.signature ?? "no-maturity",
      input.continuitySnapshot?.signature ?? "no-continuity",
      input.resilienceForecastLine ?? "no-forecast",
    ]);

    if (
      !shouldEvaluateTemporalField(
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
        snapshot: prior.snapshots[0] ?? null,
        newTimeFields: 0,
        storeSignature: prior.signature,
      };
    }

    const horizonDepth =
      (syncSnapshot?.syncCount ?? syncState.syncRecords.length) +
      (compressionSnapshot?.digestCount ?? compressionState.digests.length) +
      (convergenceSnapshot?.convergenceCount ?? convergenceState.patterns.length) +
      (replaySnapshot?.replayCount ?? replayState.replays.length) +
      (input.continuitySnapshot?.artifactCount ?? 0);

    if (horizonDepth < 6) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_horizon_depth",
        snapshot: prior.snapshots[0] ?? null,
        newTimeFields: 0,
        storeSignature: prior.signature,
      };
    }

    const syncRecords = syncSnapshot?.recentSyncRecords ?? syncState.syncRecords;
    const digests = compressionSnapshot?.recentDigests ?? compressionState.digests;
    const convergence =
      convergenceSnapshot?.recentConvergencePatterns ?? convergenceState.patterns;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const enterpriseNarrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      "";

    const candidates: OrganizationalTimeField[] = [];

    const resilience = buildFoundationalResilienceField(
      syncRecords,
      digests,
      convergence,
      maturityTrend,
      resilienceForecastLine,
      now
    );
    if (resilience) candidates.push(resilience);

    const governanceWeakness = buildStructuralGovernanceWeaknessField(
      syncRecords,
      convergence,
      input.continuityPreserved ?? true,
      now
    );
    if (governanceWeakness) candidates.push(governanceWeakness);

    const fragility = buildInstitutionalFragilityContinuityField(
      syncRecords,
      digests,
      input.fragilityElevated ?? false,
      now
    );
    if (fragility) candidates.push(fragility);

    const coordination = buildAdaptiveOperationalEvolutionField(syncRecords, convergence, now);
    if (coordination) candidates.push(coordination);

    const recovery = buildResilienceMaturityField(replays, convergence, now);
    if (recovery) candidates.push(recovery);

    const stabilization = buildLongHorizonStabilizationField(syncRecords, convergence, now);
    if (stabilization) candidates.push(stabilization);

    const strategic = buildStrategicContinuityField(
      digests,
      enterpriseNarrativeLine,
      input.continuitySnapshot ?? null,
      now
    );
    if (strategic) candidates.push(strategic);

    const governanceDurability = buildGovernanceDurabilityField(
      syncRecords,
      convergence,
      input.continuityPreserved ?? true,
      now
    );
    if (governanceDurability) candidates.push(governanceDurability);

    const retained = rankTimeFields(candidates.filter(shouldRetainTimeField));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_time_fields",
        snapshot: prior.snapshots[0] ?? null,
        newTimeFields: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.timeFields.map((f) => f.temporalFieldId));
    const newCount = retained.filter((f) => !priorIds.has(f.temporalFieldId)).length;

    store.upsertTimeFields(retained, now);

    const patterns = buildLongHorizonPatterns(retained, now);
    store.upsertLongHorizonPatterns(patterns, now);

    const strategicFields = buildStrategicTemporalFields(retained, now);
    store.upsertStrategicTemporalFields(strategicFields, now);

    const eraEvolutions = buildEraEvolutions(retained, now);
    store.upsertEraEvolutions(eraEvolutions, now);

    const continuityFields = buildContinuityFields(
      retained,
      input.continuitySnapshot ?? null,
      now
    );
    store.upsertContinuityFields(continuityFields, now);

    const continuitySignals = buildContinuitySignals(retained, now);
    store.upsertContinuitySignals(continuitySignals, now);

    const snapshot = buildAwarenessSnapshot(
      organizationId,
      retained,
      patterns,
      strategicFields,
      eraEvolutions,
      continuityFields,
      continuitySignals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.length >= 2) {
      devLog(
        `long-horizon field formation — ${retained.length} fields at ${snapshot.dominantHorizonState}`
      );
    }
    if (resilience?.fieldStrength === "foundational") {
      devLog(`structural resilience evolution — ${resilience.fieldSignals[0]}`);
    }
    if (fragility) {
      devLog(`institutional fragility continuity — ${fragility.horizonState}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newTimeFields: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalFieldEvaluation();
  }
}
