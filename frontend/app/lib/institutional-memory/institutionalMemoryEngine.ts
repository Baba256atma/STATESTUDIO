import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginInstitutionalMemoryAccumulation,
  endInstitutionalMemoryAccumulation,
  shouldEvaluateInstitutionalMemory,
  validateInstitutionalMemoryRecord,
} from "./institutionalMemoryGuards";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  EnterpriseCognitionObservationInput,
  ExperienceSeverity,
  HistoricalOperationalEvent,
  InstitutionalLearningSnapshot,
  InstitutionalMemoryAccumulationInput,
  InstitutionalMemoryRecord,
  MemoryCategory,
  OrganizationalExperience,
} from "./institutionalMemoryTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalMemory]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildMemoryId(category: MemoryCategory, observations: readonly string[]): string {
  return stableSignature(["memory", category, ...observations.slice(0, 4).sort()]).slice(0, 64);
}

function createRecord(params: {
  category: MemoryCategory;
  severity: ExperienceSeverity;
  title: string;
  summary: string;
  observations: string[];
  now: number;
}): InstitutionalMemoryRecord {
  const observations = Object.freeze(params.observations.slice(0, 6));
  return {
    memoryId: buildMemoryId(params.category, observations),
    category: params.category,
    severity: params.severity,
    title: params.title,
    summary: params.summary,
    observations,
    recordedAt: params.now,
    lastObservedAt: params.now,
    recurrenceCount: 1,
  };
}

function inferCandidates(
  input: InstitutionalMemoryAccumulationInput,
  now: number
): InstitutionalMemoryRecord[] {
  const stack = input.cognitionSnapshot;
  const obs: EnterpriseCognitionObservationInput = input.observations ?? {};
  const fragilityElevated = input.fragilityElevated ?? false;
  const continuityPreserved = input.continuityPreserved ?? true;
  const candidates: InstitutionalMemoryRecord[] = [];

  if (fragilityElevated || stack?.pressurePosture === "attention") {
    candidates.push(
      createRecord({
        category: "fragility",
        severity: fragilityElevated ? "high" : "medium",
        title: "Recurring operational fragility under pressure.",
        summary:
          "Operational fragility escalated across sustained pressure periods with cross-system dependency strain.",
        observations: ["fragility_accumulation", "sustained_pressure", "cross_system_dependency"],
        now,
      })
    );
  }

  if (
    (obs.escalationCount ?? 0) >= 2 ||
    stack?.pressurePosture === "attention" ||
    obs.monitoringAlertActive
  ) {
    candidates.push(
      createRecord({
        category: "escalation",
        severity: (obs.escalationCount ?? 0) >= 3 ? "critical" : "high",
        title: "Organizational escalation experience recorded.",
        summary:
          "Escalation patterns repeated across operational cycles — executive stability governance engaged.",
        observations: ["repeated_escalation", "executive_stability_engaged"],
        now,
      })
    );
  }

  if (stack?.governanceOversightActive && (stack.pressureGovernanceActive || obs.narrativePressureElevated)) {
    candidates.push(
      createRecord({
        category: "governance",
        severity: "medium",
        title: "Governance pressure accumulation observed.",
        summary:
          "Governance oversight active while strategic pressure accumulated — institutional discipline under evaluation.",
        observations: ["governance_pressure", "oversight_active"],
        now,
      })
    );
  }

  if (
    stack?.executiveStabilityActive &&
    (fragilityElevated || stack.pressurePosture !== "idle")
  ) {
    candidates.push(
      createRecord({
        category: "recovery",
        severity: "medium",
        title: "Recovery after operational instability.",
        summary:
          "Executive stability governance engaged following pressure — resilience learning event forming.",
        observations: ["post_instability_recovery", "stability_governance"],
        now,
      })
    );
  }

  if (stack?.executiveStabilityActive && stack.cognitiveEvolutionActive) {
    candidates.push(
      createRecord({
        category: "resilience",
        severity: "medium",
        title: "Resilience strengthening continuity.",
        summary:
          "Resilience progression observed alongside cognitive evolution — institutional learning substrate strengthening.",
        observations: ["resilience_strengthening", "cognitive_evolution"],
        now,
      })
    );
  }

  if (
    obs.pressureTopologyStressed ||
    obs.patternRecurrenceDetected ||
    stack?.enterpriseCoherenceActive === false
  ) {
    candidates.push(
      createRecord({
        category: "coordination",
        severity: "medium",
        title: "Cross-system operational degradation pattern.",
        summary:
          "Coordination strain detected across operational systems — systemic degradation pattern accumulating.",
        observations: ["cross_system_degradation", "coordination_strain"],
        now,
      })
    );
  }

  if (!continuityPreserved || obs.continuityDegraded || stack?.metaIntelligencePosture === "attention") {
    candidates.push(
      createRecord({
        category: "strategic",
        severity: "high",
        title: "Persistent strategic continuity concern.",
        summary:
          "Long-lived continuity concern recorded — meta-intelligence and governance continuity require attention.",
        observations: ["continuity_concern", "persistent_strategic_attention"],
        now,
      })
    );
  }

  if (obs.resilienceForecastAtRisk || stack?.strategicForesightPosture === "attention") {
    candidates.push(
      createRecord({
        category: "strategic",
        severity: "medium",
        title: "Future-state resilience trajectory concern.",
        summary:
          "Foresight cognition flagged resilience trajectory risk — possible institutional futures under elevated variance.",
        observations: ["foresight_at_risk", "resilience_trajectory"],
        now,
      })
    );
  }

  if (stack?.institutionalReflectionActive && stack.cognitiveEvolutionActive) {
    candidates.push(
      createRecord({
        category: "operational",
        severity: "low",
        title: "Institutional learning maturation observed.",
        summary:
          "Organizational learning reflection active — accumulated operational experience informing maturity progression.",
        observations: ["institutional_learning", "maturity_progression"],
        now,
      })
    );
  }

  return candidates.filter(validateInstitutionalMemoryRecord);
}

function buildExperiencesFromRecords(
  records: readonly InstitutionalMemoryRecord[]
): OrganizationalExperience[] {
  const byCategory = new Map<MemoryCategory, InstitutionalMemoryRecord[]>();
  for (const record of records) {
    const list = byCategory.get(record.category) ?? [];
    list.push(record);
    byCategory.set(record.category, list);
  }

  const experiences: OrganizationalExperience[] = [];
  for (const [category, categoryRecords] of byCategory) {
    if (categoryRecords.length < 1) continue;
    const recurring = categoryRecords.filter((r) => r.recurrenceCount >= 2);
    if (recurring.length === 0 && categoryRecords[0].recurrenceCount < 2) continue;

    const anchor = recurring[0] ?? categoryRecords[0];
    const severity =
      recurring.length >= 2
        ? anchor.severity
        : anchor.recurrenceCount >= 2
          ? anchor.severity
          : "low";

    if (anchor.recurrenceCount < 2 && recurring.length === 0) continue;

    experiences.push({
      experienceId: stableSignature(["experience", category, anchor.memoryId]).slice(0, 48),
      category,
      severity,
      pattern: `recurring_${category}`,
      summary: `Organization repeatedly experienced ${category} patterns: ${anchor.title}`,
      relatedMemoryIds: Object.freeze(categoryRecords.map((r) => r.memoryId)),
      firstObservedAt: Math.min(...categoryRecords.map((r) => r.recordedAt)),
      lastObservedAt: Math.max(...categoryRecords.map((r) => r.lastObservedAt)),
      occurrenceCount: categoryRecords.reduce((sum, r) => sum + r.recurrenceCount, 0),
    });
  }

  return experiences;
}

function buildHistoricalSummary(records: readonly InstitutionalMemoryRecord[]): string {
  if (records.length === 0) {
    return "Institutional memory is observational — no accumulated organizational experiences yet.";
  }
  const top = records.slice(0, 3).map((r) => r.title);
  return `Organization has accumulated ${records.length} institutional memory records including: ${top.join("; ")}.`;
}

function buildLearningSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalMemoryStore>["getState"]>,
  continuityConcernActive: boolean,
  now: number
): InstitutionalLearningSnapshot {
  const dominantCategories = Array.from(
    new Set(storeState.records.map((r) => r.category))
  ).slice(0, 4) as MemoryCategory[];

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    memoryCount: storeState.records.length,
    experienceCount: storeState.experiences.length,
    historicalSummary: buildHistoricalSummary(storeState.records),
    dominantCategories: Object.freeze(dominantCategories),
    recentMemories: Object.freeze(storeState.records.slice(0, 6)),
    recentExperiences: Object.freeze(storeState.experiences.slice(0, 4)),
    continuityConcernActive,
  };
}

export type InstitutionalMemoryAccumulationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalLearningSnapshot | null;
  newRecords: number;
  storeSignature: string;
};

export function evaluateInstitutionalMemoryAccumulation(
  input: InstitutionalMemoryAccumulationInput
): InstitutionalMemoryAccumulationResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalMemoryAccumulation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_accumulation_guard",
      snapshot: null,
      newRecords: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getInstitutionalMemoryStore(organizationId);
    const prior = store.getState();
    const evaluationSignature = stableSignature([
      "d9-2-1-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.fragilityElevated ?? false,
      input.continuityPreserved ?? true,
      input.observations ?? null,
    ]);

    if (
      !shouldEvaluateInstitutionalMemory(
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
        snapshot: prior.records.length
          ? buildLearningSnapshot(
              organizationId,
              prior,
              !input.continuityPreserved,
              now
            )
          : null,
        newRecords: 0,
        storeSignature: prior.signature,
      };
    }

    const priorCount = prior.records.length;
    const candidates = inferCandidates(input, now);

    if (candidates.length > 0) {
      store.upsertRecords(candidates, now);
    }

    const events: HistoricalOperationalEvent[] = candidates.map((record) => ({
      eventId: stableSignature(["event", record.memoryId, now]).slice(0, 40),
      category: record.category,
      severity: record.severity,
      label: record.title,
      observedAt: now,
    }));
    if (events.length > 0) {
      store.appendEvents(events, now);
    }

    const afterRecords = store.getState();
    const experiences = buildExperiencesFromRecords(afterRecords.records);
    if (experiences.length > 0) {
      store.upsertExperiences(experiences, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newRecords = Math.max(0, finalState.records.length - priorCount);
    const continuityConcernActive = !input.continuityPreserved;

    if (newRecords > 0) {
      devLog(
        `accumulated ${newRecords} memory record(s) — ${finalState.records[0]?.title ?? "experience"}`
      );
    }

    const snapshot = buildLearningSnapshot(
      organizationId,
      finalState,
      continuityConcernActive,
      now
    );

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newRecords,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalMemoryAccumulation();
  }
}
