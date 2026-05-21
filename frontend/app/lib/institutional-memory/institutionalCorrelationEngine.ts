import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginInstitutionalCorrelationEvaluation,
  endInstitutionalCorrelationEvaluation,
  shouldEvaluateInstitutionalCorrelation,
  shouldRetainCorrelation,
  validateInstitutionalCorrelation,
} from "./institutionalCorrelationGuards";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  ExperienceCorrelationStrength,
  InstitutionalCorrelation,
  InstitutionalExperienceCorrelationInput,
  LearningConsolidationSnapshot,
  LearningPatternCategory,
  OrganizationalLearningPattern,
  StrategicExperienceLink,
  CorrelatedOperationalSequence,
} from "./institutionalCorrelationTypes";
import type { InstitutionalMemoryRecord, MemoryCategory } from "./institutionalMemoryTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalCorrelation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function hasCategory(
  records: readonly InstitutionalMemoryRecord[],
  category: MemoryCategory
): InstitutionalMemoryRecord[] {
  return records.filter((r) => r.category === category);
}

function maxRecurrence(records: readonly InstitutionalMemoryRecord[]): number {
  return records.reduce((max, r) => Math.max(max, r.recurrenceCount), 0);
}

function inferStrength(
  linkedCount: number,
  maxRec: number,
  systemic: boolean
): ExperienceCorrelationStrength {
  if (systemic || linkedCount >= 4) return "systemic";
  if (linkedCount >= 3 || maxRec >= 3) return "strong";
  if (linkedCount >= 2 || maxRec >= 2) return "moderate";
  return "weak";
}

function buildCorrelationId(category: LearningPatternCategory, memoryIds: string[]): string {
  return stableSignature(["correlation", category, ...memoryIds.sort().slice(0, 6)]).slice(0, 56);
}

function createCorrelation(params: {
  category: LearningPatternCategory;
  summary: string;
  linkedExperiences: string[];
  observations: string[];
  strength: ExperienceCorrelationStrength;
  now: number;
}): InstitutionalCorrelation {
  const linked = Object.freeze(params.linkedExperiences.slice(0, 8));
  return {
    correlationId: buildCorrelationId(params.category, [...linked]),
    category: params.category,
    strength: params.strength,
    summary: params.summary,
    linkedExperiences: linked,
    observations: Object.freeze(params.observations.slice(0, 6)),
    generatedAt: params.now,
    lastObservedAt: params.now,
    occurrenceCount: 1,
  };
}

function buildLinksFromCorrelation(correlation: InstitutionalCorrelation): StrategicExperienceLink[] {
  const ids = correlation.linkedExperiences;
  const links: StrategicExperienceLink[] = [];
  for (let i = 0; i < ids.length - 1; i += 1) {
    links.push({
      linkId: stableSignature(["link", ids[i], ids[i + 1], correlation.category]).slice(0, 48),
      fromMemoryId: ids[i]!,
      toMemoryId: ids[i + 1]!,
      strength: correlation.strength,
      relationship: `${correlation.category}_sequence`,
      generatedAt: correlation.generatedAt,
    });
  }
  return links;
}

function inferCorrelations(
  records: readonly InstitutionalMemoryRecord[],
  now: number
): InstitutionalCorrelation[] {
  if (records.length < 2) return [];

  const candidates: InstitutionalCorrelation[] = [];
  const fragility = hasCategory(records, "fragility");
  const escalation = hasCategory(records, "escalation");
  const governance = hasCategory(records, "governance");
  const resilience = hasCategory(records, "resilience");
  const recovery = hasCategory(records, "recovery");
  const coordination = hasCategory(records, "coordination");
  const strategic = hasCategory(records, "strategic");

  if (fragility.length > 0 && escalation.length > 0) {
    const linked = [...fragility, ...escalation].map((r) => r.memoryId);
    const strength = inferStrength(linked.length, maxRecurrence([...fragility, ...escalation]), false);
    candidates.push(
      createCorrelation({
        category: "escalation_chain",
        strength,
        summary:
          "Operational fragility repeatedly correlates with downstream escalation and executive stability engagement.",
        linkedExperiences: linked,
        observations: ["recurring_operational_sequence", "fragility_to_escalation"],
        now,
      })
    );
  }

  if (fragility.length >= 2 || maxRecurrence(fragility) >= 2) {
    const linked = fragility.map((r) => r.memoryId);
    candidates.push(
      createCorrelation({
        category: "fragility_cycle",
        strength: inferStrength(linked.length, maxRecurrence(fragility), false),
        summary:
          "Long-term recurring fragility cycles observed — institutional memory tracks repeated instability patterns.",
        linkedExperiences: linked,
        observations: ["persistent_fragility_pattern", "recurring_instability"],
        now,
      })
    );
  }

  if (governance.length > 0 && (fragility.length > 0 || coordination.length > 0)) {
    const linked = [...governance, ...fragility, ...coordination].map((r) => r.memoryId).slice(0, 6);
    candidates.push(
      createCorrelation({
        category: "governance_pressure",
        strength: inferStrength(linked.length, maxRecurrence([...governance, ...fragility]), false),
        summary:
          "Governance pressure correlates with operational instability — oversight active during strategic pressure accumulation.",
        linkedExperiences: linked,
        observations: ["governance_instability_chain", "oversight_under_pressure"],
        now,
      })
    );
  }

  if (recovery.length > 0 && (resilience.length > 0 || escalation.length > 0)) {
    const linked = [...recovery, ...resilience, ...escalation].map((r) => r.memoryId).slice(0, 6);
    candidates.push(
      createCorrelation({
        category: "resilience_growth",
        strength: inferStrength(linked.length, maxRecurrence([...recovery, ...resilience]), false),
        summary:
          "Recovery and resilience learning correlate — organizational experience suggests strengthening after instability.",
        linkedExperiences: linked,
        observations: ["recovery_resilience_sequence", "institutional_learning"],
        now,
      })
    );
  }

  if (recovery.length > 0 && (fragility.length > 0 || escalation.length > 0)) {
    const linked = [...recovery, ...fragility, ...escalation].map((r) => r.memoryId).slice(0, 6);
    candidates.push(
      createCorrelation({
        category: "operational_recovery",
        strength: inferStrength(linked.length, maxRecurrence(recovery), false),
        summary:
          "Operational recovery follows fragility or escalation — repeated mitigation and stabilization patterns linked.",
        linkedExperiences: linked,
        observations: ["post_instability_recovery", "mitigation_pattern"],
        now,
      })
    );
  }

  if (coordination.length > 0 && (fragility.length > 0 || strategic.length > 0)) {
    const linked = [...coordination, ...fragility, ...strategic].map((r) => r.memoryId).slice(0, 6);
    candidates.push(
      createCorrelation({
        category: "coordination_breakdown",
        strength: inferStrength(linked.length, maxRecurrence(coordination), false),
        summary:
          "Coordination strain correlates with cross-system degradation and strategic continuity concerns.",
        linkedExperiences: linked,
        observations: ["coordination_failure", "cross_system_degradation"],
        now,
      })
    );
  }

  const systemicCategories = [
    fragility.length > 0,
    escalation.length > 0,
    governance.length > 0,
    coordination.length > 0,
  ].filter(Boolean).length;

  if (systemicCategories >= 3) {
    const linked = records
      .filter((r) =>
        ["fragility", "escalation", "governance", "coordination", "strategic"].includes(r.category)
      )
      .map((r) => r.memoryId)
      .slice(0, 8);
    if (linked.length >= 3) {
      candidates.push(
        createCorrelation({
          category: "systemic_instability",
          strength: "systemic",
          summary:
            "Cross-system operational degradation sequences correlate — systemic institutional instability pattern forming.",
          linkedExperiences: linked,
          observations: ["cross_system_instability", "systemic_operational_sequence"],
          now,
        })
      );
    }
  }

  return candidates.filter(validateInstitutionalCorrelation).filter(shouldRetainCorrelation);
}

function buildPatternsFromCorrelations(
  correlations: readonly InstitutionalCorrelation[]
): OrganizationalLearningPattern[] {
  const byCategory = new Map<LearningPatternCategory, InstitutionalCorrelation[]>();
  for (const c of correlations) {
    const list = byCategory.get(c.category) ?? [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  const patterns: OrganizationalLearningPattern[] = [];
  for (const [category, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    const linkedMemoryIds = Object.freeze(
      Array.from(new Set(group.flatMap((c) => [...c.linkedExperiences]))).slice(0, 10)
    );
    patterns.push({
      patternId: stableSignature(["pattern", category, ...linkedMemoryIds.slice(0, 3)]).slice(0, 48),
      category,
      strength: group.reduce<ExperienceCorrelationStrength>(
        (best, c) =>
          strengthRank(c.strength) > strengthRank(best) ? c.strength : best,
        "weak"
      ),
      lesson: `Recurring organizational lesson: ${anchor.summary}`,
      correlationIds: Object.freeze(group.map((c) => c.correlationId)),
      linkedMemoryIds,
      firstObservedAt: Math.min(...group.map((c) => c.generatedAt)),
      lastObservedAt: Math.max(...group.map((c) => c.lastObservedAt)),
      occurrenceCount: group.reduce((sum, c) => sum + c.occurrenceCount, 0),
    });
  }
  return patterns;
}

function strengthRank(strength: ExperienceCorrelationStrength): number {
  if (strength === "systemic") return 4;
  if (strength === "strong") return 3;
  if (strength === "moderate") return 2;
  return 1;
}

function buildConsolidationSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalCorrelationStore>["getState"]>,
  now: number
): LearningConsolidationSnapshot {
  const strong = storeState.correlations.filter(
    (c) => c.strength === "strong" || c.strength === "systemic"
  );

  const summary =
    storeState.correlations.length === 0
      ? "Experience correlation awaiting sufficient institutional memory depth."
      : `Consolidated ${storeState.patterns.length} learning patterns across ${storeState.correlations.length} strategic correlations.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    correlationCount: storeState.correlations.length,
    patternCount: storeState.patterns.length,
    linkCount: storeState.links.length,
    consolidationSummary: summary,
    dominantPatterns: Object.freeze(
      Array.from(new Set(storeState.patterns.map((p) => p.category))).slice(0, 4)
    ),
    strongCorrelations: Object.freeze(strong.slice(0, 6)),
    consolidatedPatterns: Object.freeze(storeState.patterns.slice(0, 6)),
  };
}

export type InstitutionalExperienceCorrelationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: LearningConsolidationSnapshot | null;
  newCorrelations: number;
  storeSignature: string;
};

export function evaluateInstitutionalExperienceCorrelation(
  input: InstitutionalExperienceCorrelationInput
): InstitutionalExperienceCorrelationResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalCorrelationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_correlation_guard",
      snapshot: null,
      newCorrelations: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryStore = getInstitutionalMemoryStore(organizationId);
    const memoryState = memoryStore.getState();
    const records = input.records ?? memoryState.records;
    const experiences = input.experiences ?? memoryState.experiences;

    if (records.length < 2) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_memory_depth",
        snapshot: null,
        newCorrelations: 0,
        storeSignature: "",
      };
    }

    const correlationStore = getInstitutionalCorrelationStore(organizationId);
    const prior = correlationStore.getState();

    const evaluationSignature = stableSignature([
      "d9-2-2-correlation-eval",
      organizationId,
      memoryState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      records.length,
      experiences.length,
    ]);

    if (
      !shouldEvaluateInstitutionalCorrelation(
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
        snapshot:
          prior.correlations.length > 0
            ? buildConsolidationSnapshot(organizationId, prior, now)
            : null,
        newCorrelations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorCount = prior.correlations.length;
    const candidates = inferCorrelations(records, now);

    if (candidates.length > 0) {
      correlationStore.upsertCorrelations(candidates, now);
    }

    const links = candidates.flatMap(buildLinksFromCorrelation);
    if (links.length > 0) {
      correlationStore.upsertLinks(links, now);
    }

    const sequences: CorrelatedOperationalSequence[] = candidates.map((c) => ({
      sequenceId: stableSignature(["sequence", c.correlationId]).slice(0, 40),
      category: c.category,
      memoryIds: c.linkedExperiences,
      summary: c.summary,
      generatedAt: now,
    }));
    if (sequences.length > 0) {
      correlationStore.upsertSequences(sequences, now);
    }

    const afterCorr = correlationStore.getState();
    const patterns = buildPatternsFromCorrelations(afterCorr.correlations);
    if (patterns.length > 0) {
      correlationStore.upsertPatterns(patterns, now);
    }

    correlationStore.setLastEvaluationSignature(evaluationSignature);
    const finalState = correlationStore.getState();
    const newCorrelations = Math.max(0, finalState.correlations.length - priorCount);

    for (const c of finalState.correlations) {
      if (c.strength === "strong" || c.strength === "systemic") {
        devLog(`strong correlation — ${c.category}: ${c.summary.slice(0, 80)}`);
        break;
      }
    }

    const snapshot = buildConsolidationSnapshot(organizationId, finalState, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newCorrelations,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalCorrelationEvaluation();
  }
}
