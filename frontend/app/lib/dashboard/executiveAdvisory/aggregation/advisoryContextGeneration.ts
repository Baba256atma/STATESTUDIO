/**
 * Phase 5:2 — Advisory context generation.
 */

import type {
  AdvisoryContext,
  AdvisoryContextAggregationInput,
  AdvisoryContextMetadata,
  AdvisoryInputConfidence,
  AggregationAuditTrail,
  ReasoningTraceContract,
} from "./advisoryContextContract.ts";
import {
  collectRegisteredIntelligenceSnapshots,
  flattenNormalizedInputs,
  normalizeOperationalInputs,
  normalizeRiskInputs,
  normalizeScenarioInputs,
  normalizeTimelineInputs,
  normalizeWarRoomInputs,
} from "./advisoryContextNormalization.ts";
import { rankAdvisoryInputs, resolveContextPriority } from "./advisoryPriorityScoring.ts";
import { listRegisteredAdvisorySources } from "./advisoryAggregationRegistry.ts";
import {
  reportAdvisoryAggregation,
  reportAdvisoryContext,
  reportAdvisoryNormalization,
  reportAdvisoryPriority,
  reportReasoningTrace,
} from "./advisoryAggregationLogging.ts";

function buildReasoningTrace(
  ranked: AdvisoryContext["rankedInputs"],
  snapshots: ReturnType<typeof collectRegisteredIntelligenceSnapshots>
): ReasoningTraceContract {
  return Object.freeze({
    sourceChain: Object.freeze([
      "operational",
      "risk",
      "timeline",
      "scenario",
      "war_room",
      "advisory_aggregation",
    ]),
    inputFactors: Object.freeze([
      `Operational health: ${snapshots.operational.health.level}`,
      `Risk exposure: ${snapshots.risk.exposure.level}`,
      `Timeline window: ${snapshots.timeline.decisionWindows.status}`,
      `Scenario impact: ${snapshots.scenario.expectedImpact.level}`,
      `War room focus: ${snapshots.warRoom.decisionFocus.focus}`,
    ]),
    priorityFactors: Object.freeze(
      ranked.slice(0, 3).map((input) => `${input.label} (${input.priority})`)
    ),
    confidenceFactors: Object.freeze([
      `Risk confidence: ${snapshots.risk.confidence.level}`,
      `Scenario confidence: ${snapshots.scenario.confidence.level}`,
      `War room advisory readiness: ${snapshots.warRoom.advisoryIntegration.readiness}`,
    ]),
  });
}

function buildAuditTrail(): AggregationAuditTrail {
  return Object.freeze({
    chain: Object.freeze([
      Object.freeze({ step: "collect", source: "operational", detail: "Operational intelligence feed" }),
      Object.freeze({ step: "collect", source: "risk", detail: "Risk intelligence feed" }),
      Object.freeze({ step: "collect", source: "timeline", detail: "Timeline intelligence feed" }),
      Object.freeze({ step: "collect", source: "scenario", detail: "Scenario intelligence feed" }),
      Object.freeze({ step: "collect", source: "war_room", detail: "War room intelligence feed" }),
      Object.freeze({
        step: "normalize",
        source: "aggregation",
        detail: "Normalized to standardized advisory inputs",
      }),
      Object.freeze({ step: "prioritize", source: "aggregation", detail: "Ranked advisory inputs by score" }),
      Object.freeze({
        step: "generate",
        source: "aggregation",
        detail: "Advisory context generated for Executive Advisory",
      }),
    ]),
    summary: "Operational → Risk → Timeline → Scenario → War Room → Advisory Context",
  });
}

function resolveContextConfidence(
  riskConfidence: AdvisoryInputConfidence,
  scenarioConfidence: AdvisoryInputConfidence
): AdvisoryInputConfidence {
  if (riskConfidence === "low" || scenarioConfidence === "low") return "low";
  if (riskConfidence === "high" && scenarioConfidence === "high") return "high";
  return "moderate";
}

export function generateAdvisoryContext(input: AdvisoryContextAggregationInput): AdvisoryContext {
  const timestamp = new Date().toISOString();
  const snapshots = collectRegisteredIntelligenceSnapshots(input);

  const operational = normalizeOperationalInputs(snapshots, timestamp);
  const risk = normalizeRiskInputs(snapshots, timestamp);
  const timeline = normalizeTimelineInputs(snapshots, timestamp);
  const scenario = normalizeScenarioInputs(snapshots, timestamp);
  const warRoom = normalizeWarRoomInputs(snapshots, timestamp);

  const flatInputs = flattenNormalizedInputs({ operational, risk, timeline, scenario, warRoom });
  reportAdvisoryNormalization(flatInputs);

  const rankedInputs = rankAdvisoryInputs(flatInputs);
  reportAdvisoryPriority(rankedInputs);

  const reasoningTrace = buildReasoningTrace(rankedInputs, snapshots);
  const auditTrail = buildAuditTrail();
  const contextPriority = resolveContextPriority(rankedInputs);
  const contextConfidence = resolveContextConfidence(risk.confidence.confidence, scenario.confidence.confidence);

  const metadata: AdvisoryContextMetadata = Object.freeze({
    sourceSurface: "advisory_aggregation",
    timestamp,
    confidence: contextConfidence,
    priority: contextPriority,
    reasoningTrace,
    auditTrail,
  });

  const context: AdvisoryContext = Object.freeze({
    operational,
    risk,
    timeline,
    scenario,
    warRoom,
    metadata,
    rankedInputs,
    topPriority: rankedInputs[0] ?? null,
  });

  reportAdvisoryAggregation({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "5.2.0",
    registeredSources: listRegisteredAdvisorySources(),
    inputCount: flatInputs.length,
    topPriority: context.topPriority?.label ?? null,
  });
  reportAdvisoryContext(context);
  reportReasoningTrace(context);

  return context;
}
