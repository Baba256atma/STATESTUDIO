import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "../institutional-memory/adaptationRecoveryStore";
import { getInstitutionalCorrelationStore } from "../institutional-memory/institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "../institutional-memory/institutionalMemoryStore";
import {
  beginCausalDependencyEvaluation,
  confidenceToLevel,
  endCausalDependencyEvaluation,
  shouldEvaluateCausalDependencies,
  shouldRetainCausalChain,
  validateCausalChain,
} from "./causalDependencyGuards";
import { getCausalDependencyStore } from "./causalDependencyStore";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  CausalDependencySnapshot,
  DependencyCategory,
  DependencyPropagationSignal,
  DependencyStrength,
  OperationalCausalChain,
  OperationalCausalDependencyInput,
  OperationalCausalDependencyResult,
  OrganizationalImpactChain,
  PropagationType,
  StrategicCauseEffectSequence,
  TemporalDependencyLink,
} from "./causalDependencyTypes";
import type {
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TimelineCategory,
} from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][CausalDependency]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function toDependencyCategory(category: TimelineCategory): DependencyCategory {
  if (category === "unknown") return "unknown";
  return category;
}

function buildChainId(category: DependencyCategory, chain: string[]): string {
  return stableSignature(["causal-chain", category, ...chain.slice(0, 4)]).slice(0, 56);
}

function buildLinkId(from: string, to: string): string {
  return stableSignature(["causal-link", from, to]).slice(0, 48);
}

function strengthFromEvidence(depth: number, cascading: boolean): DependencyStrength {
  if (cascading && depth >= 4) return "systemic";
  if (depth >= 4) return "strong";
  if (depth >= 3) return "moderate";
  return "weak";
}

function hasCategoryBefore(
  events: readonly OrganizationalTimelineEvent[],
  before: TimelineCategory,
  after: TimelineCategory
): boolean {
  const beforeIdx = events.findIndex((e) => e.category === before);
  const afterIdx = events.findIndex((e) => e.category === after);
  return beforeIdx >= 0 && afterIdx > beforeIdx;
}

function buildFragilityToEscalationChain(
  events: readonly OrganizationalTimelineEvent[],
  sequences: readonly StrategicTimelineSequence[],
  now: number
): OperationalCausalChain | null {
  const cascadingSeq = sequences.find(
    (s) => s.category === "escalation" && s.sequenceType === "cascading"
  );
  const hasOrdering =
    hasCategoryBefore(events, "fragility", "escalation") ||
    hasCategoryBefore(events, "fragility", "coordination");

  if (!hasOrdering && !cascadingSeq) return null;

  const chain = Object.freeze([
    "fragility_accumulation",
    "pressure_growth",
    "coordination_instability",
    "escalation_spread",
  ]);

  const causalChainId = buildChainId("escalation", [...chain]);
  const confidence = cascadingSeq ? Math.max(0.86, cascadingSeq.confidence) : 0.82;

  return {
    causalChainId,
    category: "escalation",
    dependencyStrength: cascadingSeq ? "strong" : "moderate",
    propagationType: cascadingSeq ? "cascading" : "distributed",
    summary:
      "Supply-chain fragility accumulation triggered escalation propagation across dependent operational systems following delayed governance stabilization.",
    chain,
    upstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "fragility").map((e) => e.eventId).slice(0, 4)
    ),
    downstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "escalation").map((e) => e.eventId).slice(0, 4)
    ),
    confidence: Number(Math.min(0.94, confidence).toFixed(2)),
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: events.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildGovernanceDependencyFailure(
  events: readonly OrganizationalTimelineEvent[],
  continuityPreserved: boolean,
  now: number
): OperationalCausalChain | null {
  const govBeforePressure =
    hasCategoryBefore(events, "governance", "coordination") ||
    hasCategoryBefore(events, "governance", "strategic");

  if (!govBeforePressure && continuityPreserved) return null;

  const chain = Object.freeze([
    "governance_delay",
    "pressure_amplification",
    "coordination_degradation",
  ]);

  const confidence = continuityPreserved ? 0.74 : 0.86;
  return {
    causalChainId: buildChainId("governance", [...chain]),
    category: "governance",
    dependencyStrength: continuityPreserved ? "moderate" : "strong",
    propagationType: "distributed",
    summary:
      "Governance delay amplified operational pressure before coordination stabilization could contain downstream instability.",
    chain,
    upstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "governance").map((e) => e.eventId).slice(0, 3)
    ),
    downstreamNodeIds: Object.freeze(
      events
        .filter((e) => e.category === "coordination" || e.category === "strategic")
        .map((e) => e.eventId)
        .slice(0, 3)
    ),
    confidence,
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: events.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildResilienceSupportingChain(
  events: readonly OrganizationalTimelineEvent[],
  adaptationLabels: readonly string[],
  now: number
): OperationalCausalChain | null {
  const hasStabilization =
    hasCategoryBefore(events, "governance", "recovery") ||
    hasCategoryBefore(events, "coordination", "recovery") ||
    adaptationLabels.some((l) => /coordination_recovery|governance_stabilization/i.test(l));

  if (!hasStabilization) return null;

  const chain = Object.freeze([
    "coordination_stabilization",
    "governance_alignment",
    "recovery_acceleration",
  ]);

  const confidence = 0.87;
  return {
    causalChainId: buildChainId("resilience", [...chain]),
    category: "resilience",
    dependencyStrength: "strong",
    propagationType: "localized",
    summary:
      "Coordination stabilization and governance alignment formed a resilience-supporting causal chain that accelerated recovery progression.",
    chain,
    upstreamNodeIds: Object.freeze(
      events
        .filter((e) => e.category === "governance" || e.category === "coordination")
        .map((e) => e.eventId)
        .slice(0, 3)
    ),
    downstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "recovery").map((e) => e.eventId).slice(0, 3)
    ),
    confidence,
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: events.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildPressureConsequenceChain(
  events: readonly OrganizationalTimelineEvent[],
  pressureElevated: boolean,
  now: number
): OperationalCausalChain | null {
  const pressureBeforeOps =
    hasCategoryBefore(events, "coordination", "operational") ||
    hasCategoryBefore(events, "strategic", "operational");

  if (!pressureBeforeOps && !pressureElevated) return null;

  const chain = Object.freeze([
    "pressure_concentration",
    "operational_degradation",
    "strategic_consequence",
  ]);

  const confidence = pressureElevated ? 0.85 : 0.76;
  return {
    causalChainId: buildChainId("operational", [...chain]),
    category: "operational",
    dependencyStrength: pressureElevated ? "strong" : "moderate",
    propagationType: pressureElevated ? "cascading" : "distributed",
    summary:
      "Pressure concentration preceded operational degradation, forming a strategic consequence chain across dependent systems.",
    chain,
    upstreamNodeIds: Object.freeze(
      events
        .filter((e) => e.category === "coordination" || e.category === "strategic")
        .map((e) => e.eventId)
        .slice(0, 3)
    ),
    downstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "operational").map((e) => e.eventId).slice(0, 3)
    ),
    confidence,
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: events.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildAdaptiveResilienceChain(
  events: readonly OrganizationalTimelineEvent[],
  adaptationLabels: readonly string[],
  now: number
): OperationalCausalChain | null {
  const hasRecoveryIntervention = adaptationLabels.some((l) =>
    /recovery|fragility_reduction|resilience_growth/i.test(l)
  );
  const fragilityReduced =
    events.filter((e) => e.category === "fragility").length >= 1 &&
    events.some((e) => e.category === "recovery" || e.category === "resilience");

  if (!hasRecoveryIntervention && !fragilityReduced) return null;

  const chain = Object.freeze([
    "recovery_intervention",
    "fragility_reduction",
    "resilience_strengthening",
  ]);

  const confidence = 0.84;
  return {
    causalChainId: buildChainId("recovery", [...chain]),
    category: "recovery",
    dependencyStrength: "moderate",
    propagationType: "localized",
    summary:
      "Recovery interventions reduced fragility over time through an adaptive resilience dependency pathway.",
    chain,
    upstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "recovery").map((e) => e.eventId).slice(0, 3)
    ),
    downstreamNodeIds: Object.freeze(
      events.filter((e) => e.category === "resilience").map((e) => e.eventId).slice(0, 3)
    ),
    confidence,
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: events.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildCascadingFromTimeline(
  sequences: readonly StrategicTimelineSequence[],
  now: number
): OperationalCausalChain | null {
  const cascading = sequences.find((s) => s.sequenceType === "cascading");
  if (!cascading) return null;

  const chain =
    cascading.events.length >= 2
      ? cascading.events
      : Object.freeze(["upstream_instability", "dependency_propagation", "downstream_impact"]);

  const confidence = cascading.confidence;
  return {
    causalChainId: buildChainId(toDependencyCategory(cascading.category), [...chain]),
    category: toDependencyCategory(cascading.category),
    dependencyStrength: "systemic",
    propagationType: "cascading",
    summary:
      "Escalation propagated across connected systems as a cascading dependency sequence through temporal organizational progression.",
    chain: Object.freeze([...chain]),
    upstreamNodeIds: Object.freeze(cascading.eventIds.slice(0, 4)),
    downstreamNodeIds: Object.freeze(cascading.eventIds.slice(-4)),
    confidence: Number(Math.min(0.94, confidence + 0.02).toFixed(2)),
    confidenceLevel: confidenceToLevel(confidence),
    generatedAt: now,
    lastObservedAt: cascading.lastObservedAt,
    occurrenceCount: cascading.occurrenceCount,
  };
}

function buildDependencyLinks(chains: OperationalCausalChain[], now: number): TemporalDependencyLink[] {
  const links: TemporalDependencyLink[] = [];
  for (const chain of chains) {
    for (let i = 0; i < chain.chain.length - 1; i += 1) {
      const fromLabel = chain.chain[i]!;
      const toLabel = chain.chain[i + 1]!;
      links.push({
        linkId: buildLinkId(fromLabel, toLabel),
        fromCategory: chain.category,
        toCategory: chain.category,
        fromLabel,
        toLabel,
        dependencyStrength: chain.dependencyStrength,
        propagationType: chain.propagationType,
        summary: `${fromLabel} → ${toLabel} within ${chain.category} causal progression`,
        generatedAt: now,
      });
    }
  }
  return links;
}

function buildCauseEffectSequences(
  chains: OperationalCausalChain[],
  now: number
): StrategicCauseEffectSequence[] {
  return chains.slice(0, 4).map((chain) => ({
    sequenceId: stableSignature(["cause-effect", chain.causalChainId]).slice(0, 48),
    category: chain.category,
    causeLabel: chain.chain[0] ?? "unknown_cause",
    effectLabel: chain.chain.at(-1) ?? "unknown_effect",
    dependencyStrength: chain.dependencyStrength,
    progressionSummary: chain.summary.slice(0, 160),
    linkedChainIds: Object.freeze([chain.causalChainId]),
    generatedAt: now,
  }));
}

function buildImpactChains(
  chains: OperationalCausalChain[],
  now: number
): OrganizationalImpactChain[] {
  return chains
    .filter((c) => c.propagationType === "cascading" || c.dependencyStrength === "systemic")
    .slice(0, 3)
    .map((chain) => ({
      impactChainId: stableSignature(["impact", chain.causalChainId]).slice(0, 48),
      category: chain.category,
      impactSummary: chain.summary.slice(0, 160),
      consequenceLabels: Object.freeze(chain.chain.slice(-3)),
      linkedChainIds: Object.freeze([chain.causalChainId]),
      generatedAt: now,
    }));
}

function buildCausalSnapshot(
  organizationId: string,
  chains: OperationalCausalChain[],
  links: TemporalDependencyLink[],
  signals: DependencyPropagationSignal[],
  impacts: OrganizationalImpactChain[],
  sequences: StrategicCauseEffectSequence[],
  now: number
): CausalDependencySnapshot {
  const dominantCategories = Object.freeze(
    [...new Set(chains.map((c) => c.category))].slice(0, 4) as DependencyCategory[]
  );
  const dominantPropagationType =
    chains.find((c) => c.propagationType === "cascading")?.propagationType ??
    chains[0]?.propagationType ??
    "localized";
  const dominantDependencyStrength =
    chains.find((c) => c.dependencyStrength === "systemic")?.dependencyStrength ??
    chains[0]?.dependencyStrength ??
    "moderate";

  const causalSummary =
    chains[0]?.summary ??
    "Enterprise causal dependency awareness awaiting sufficient temporal chronology depth.";

  const signature = stableSignature([
    "d9-3-2-causal-snapshot",
    organizationId,
    chains.length,
    links.length,
    chains[0]?.causalChainId ?? "none",
    dominantPropagationType,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    chainCount: chains.length,
    linkCount: links.length,
    causalSummary,
    dominantCategories,
    dominantPropagationType,
    dominantDependencyStrength,
    recentChains: Object.freeze(chains.slice(0, 6)),
    dependencyLinks: Object.freeze(links.slice(0, 12)),
    propagationSignals: Object.freeze(signals),
    impactChains: Object.freeze(impacts),
    causeEffectSequences: Object.freeze(sequences),
  };
}

export function evaluateOperationalCausalDependencies(
  input: OperationalCausalDependencyInput
): OperationalCausalDependencyResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginCausalDependencyEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_causal_guard",
      snapshot: null,
      newChains: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getCausalDependencyStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();

    const temporalSnapshot =
      input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const cognitionSignature = input.cognitionSnapshot?.signature ?? "no-cognition";
    const temporalSignature = temporalSnapshot?.signature ?? temporalState.signature;
    const memorySignature = input.memorySnapshot?.signature ?? memoryState.signature;

    const evaluationSignature = stableSignature([
      "d9-3-2-causal-eval",
      organizationId,
      cognitionSignature,
      temporalSignature,
      memorySignature,
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateCausalDependencies(
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
        newChains: 0,
        storeSignature: prior.signature,
      };
    }

    const events = temporalSnapshot?.recentEvents ?? temporalState.events;
    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const adaptationLabels = adaptationState.adaptations.map((a) => a.adaptationType);

    const chronologyDepth =
      events.length +
      sequences.length +
      memoryState.records.length +
      correlationState.patterns.length;

    if (chronologyDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_chronology_depth",
        snapshot: prior.snapshots[0] ?? null,
        newChains: 0,
        storeSignature: prior.signature,
      };
    }

    const pressureElevated =
      input.cognitionSnapshot?.pressurePosture === "attention" ||
      (input.fragilityElevated ?? false);

    const candidates: OperationalCausalChain[] = [];

    const fragilityEscalation = buildFragilityToEscalationChain(events, sequences, now);
    if (fragilityEscalation) candidates.push(fragilityEscalation);

    const governanceFailure = buildGovernanceDependencyFailure(
      events,
      input.continuityPreserved !== false,
      now
    );
    if (governanceFailure) candidates.push(governanceFailure);

    const resilienceChain = buildResilienceSupportingChain(events, adaptationLabels, now);
    if (resilienceChain) candidates.push(resilienceChain);

    const pressureChain = buildPressureConsequenceChain(events, pressureElevated, now);
    if (pressureChain) candidates.push(pressureChain);

    const adaptiveResilience = buildAdaptiveResilienceChain(events, adaptationLabels, now);
    if (adaptiveResilience) candidates.push(adaptiveResilience);

    const cascading = buildCascadingFromTimeline(sequences, now);
    if (cascading && !candidates.some((c) => c.causalChainId === cascading.causalChainId)) {
      candidates.push(cascading);
    }

    if (
      correlationState.patterns.some((p) => p.category === "escalation_chain") &&
      !candidates.some((c) => c.category === "escalation")
    ) {
      const depth = correlationState.patterns.length;
      candidates.push({
        causalChainId: buildChainId("escalation", ["escalation_chain_pattern"]),
        category: "escalation",
        dependencyStrength: strengthFromEvidence(depth, true),
        propagationType: "cascading",
        summary:
          "Institutional correlation patterns indicate escalation amplification across temporally linked operational dependencies.",
        chain: Object.freeze(["pattern_detection", "escalation_amplification", "downstream_impact"]),
        upstreamNodeIds: Object.freeze([]),
        downstreamNodeIds: Object.freeze([]),
        confidence: 0.8,
        confidenceLevel: confidenceToLevel(0.8),
        generatedAt: now,
        lastObservedAt: now,
        occurrenceCount: 1,
      });
    }

    const retained = candidates.filter(shouldRetainCausalChain);
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_chains",
        snapshot: prior.snapshots[0] ?? null,
        newChains: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.chains.map((c) => c.causalChainId));
    const newCount = retained.filter((c) => !priorIds.has(c.causalChainId)).length;

    store.upsertChains(retained, now);
    const links = buildDependencyLinks(retained, now);
    store.upsertLinks(links, now);

    const signals: DependencyPropagationSignal[] = retained
      .filter(validateCausalChain)
      .slice(0, 4)
      .map((c) => ({
        signalId: stableSignature(["causal-signal", c.causalChainId]).slice(0, 48),
        category: c.category,
        propagationType: c.propagationType,
        dependencyStrength: c.dependencyStrength,
        summary: c.summary.slice(0, 160),
        confidence: c.confidence,
        generatedAt: now,
      }));

    store.upsertSignals(signals, now);

    const causeEffect = buildCauseEffectSequences(retained, now);
    store.upsertCauseEffectSequences(causeEffect, now);

    const impacts = buildImpactChains(retained, now);
    store.upsertImpactChains(impacts, now);

    const snapshot = buildCausalSnapshot(
      organizationId,
      retained,
      links,
      signals,
      impacts,
      causeEffect,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (fragilityEscalation?.propagationType === "cascading") {
      devLog(`cascading dependency — ${fragilityEscalation.summary.slice(0, 72)}`);
    }
    if (resilienceChain) {
      devLog(`resilience progression — ${resilienceChain.summary.slice(0, 72)}`);
    }
    if (retained.length >= 2) {
      devLog(`causal chain formation — ${retained.length} operational dependency chains`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newChains: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCausalDependencyEvaluation();
  }
}
