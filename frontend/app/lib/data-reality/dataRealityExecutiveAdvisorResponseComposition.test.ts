/**
 * P1:5 — Executive Advisor Response Composition unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import type { NexoraDataRealitySnapshot } from "./dataRealityContracts.ts";
import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import { buildDataRealityAwareAdvisorContext } from "./dataRealityAwareAdvisorContextResolution.ts";
import { resolveDataRealityExecutiveAdvisoryResolution } from "./dataRealityExecutiveAdvisoryResolution.ts";
import {
  DATA_REALITY_ADVISOR_RESPONSE_MODES,
  DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS,
  DATA_REALITY_ADVISOR_RESPONSE_TONES,
  DATA_REALITY_ADVISOR_STATE_TO_RESPONSE_TONE,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_INVARIANTS,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_CORE_PRINCIPLE,
  composeDataRealityExecutiveAdvisorResponse,
  dataRealityExecutiveAdvisorResponseCompositionArchitecturalRole,
  dataRealityExecutiveAdvisorResponseCompositionIdentity,
  dataRealityExecutiveAdvisorResponseCompositionNamespace,
  dataRealityExecutiveAdvisorResponseCompositionPhase,
  dataRealityExecutiveAdvisorResponseCompositionVersion,
  getDataRealityExecutiveAdvisorResponseCompositionIdentity,
  getDataRealityExecutiveAdvisorResponseCompositionMetadata,
  resolveDataRealityAdvisorResponseTone,
  resolveRequiresImmediateAttention,
} from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(
  here,
  "dataRealityExecutiveAdvisorResponseComposition.ts",
);

function snapshotFor(
  scenario: "baseline" | "operational-pressure",
): NexoraDataRealitySnapshot {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();
  return resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  }).snapshot;
}

function pipeline(
  scenario: "baseline" | "operational-pressure",
  options: {
    readonly focusedObjectId?: string;
    readonly selectedObjectIds?: readonly string[];
    readonly currentWorkspace?: string;
    readonly requestedIntent?:
      | "observe"
      | "explain"
      | "investigate"
      | "compare"
      | "prioritize"
      | "recommend"
      | "simulate"
      | "decide"
      | "act";
    readonly mode?: "minimum" | "brief" | "standard" | "detailed";
    readonly includeSecondaryGuidance?: boolean;
  } = {},
) {
  const context = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor(scenario),
    focusedObjectId: options.focusedObjectId,
    selectedObjectIds: options.selectedObjectIds,
    currentWorkspace: options.currentWorkspace ?? "problem",
    requestedIntent: options.requestedIntent ?? "investigate",
  });
  const advisoryResolution = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: options.requestedIntent ?? "investigate",
  });
  const response = composeDataRealityExecutiveAdvisorResponse({
    context,
    advisoryResolution,
    mode: options.mode ?? "standard",
    includeSecondaryGuidance: options.includeSecondaryGuidance,
  });
  return Object.freeze({ context, advisoryResolution, response });
}

function sectionKinds(
  response: ReturnType<typeof composeDataRealityExecutiveAdvisorResponse>,
) {
  return response.sections.map((section) => section.kind);
}

test("P1:5 identity and metadata", () => {
  const identity = getDataRealityExecutiveAdvisorResponseCompositionIdentity();
  assert.equal(
    dataRealityExecutiveAdvisorResponseCompositionIdentity,
    "P1:5/ExecutiveAdvisorResponseComposition",
  );
  assert.equal(
    identity.identity,
    "P1:5/ExecutiveAdvisorResponseComposition",
  );
  assert.equal(dataRealityExecutiveAdvisorResponseCompositionVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    dataRealityExecutiveAdvisorResponseCompositionNamespace,
    "nexora.data-reality.executive-advisor.response-composition",
  );
  assert.equal(
    identity.namespace,
    "nexora.data-reality.executive-advisor.response-composition",
  );
  assert.equal(
    dataRealityExecutiveAdvisorResponseCompositionPhase,
    "AdvisorResponseComposition",
  );
  assert.equal(identity.phase, "AdvisorResponseComposition");
  assert.equal(
    dataRealityExecutiveAdvisorResponseCompositionArchitecturalRole,
    "ExecutiveAdvisorResponseComposer",
  );
  assert.equal(
    identity.architecturalRole,
    "ExecutiveAdvisorResponseComposer",
  );

  const metadata = getDataRealityExecutiveAdvisorResponseCompositionMetadata();
  assert.equal(DATA_REALITY_ADVISOR_RESPONSE_MODES.length, 4);
  assert.equal(DATA_REALITY_ADVISOR_RESPONSE_TONES.length, 6);
  assert.equal(DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS.length, 6);
  assert.equal(metadata.capabilities.length, 23);
  assert.equal(metadata.invariants.length, 43);
  assert.equal(metadata.principles.length, 9);
  assert.equal(
    DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_CORE_PRINCIPLE.includes(
      "never become a new source of executive truth",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_INVARIANTS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES),
    true,
  );
});

test("P1:5 tone mapping from structured state", () => {
  assert.equal(resolveDataRealityAdvisorResponseTone("stable"), "neutral");
  assert.equal(resolveDataRealityAdvisorResponseTone("watch"), "attention");
  assert.equal(resolveDataRealityAdvisorResponseTone("risk"), "warning");
  assert.equal(resolveDataRealityAdvisorResponseTone("critical"), "critical");
  assert.equal(
    resolveDataRealityAdvisorResponseTone("opportunity"),
    "opportunity",
  );
  assert.equal(resolveDataRealityAdvisorResponseTone("unresolved"), "uncertain");
  assert.deepEqual(DATA_REALITY_ADVISOR_STATE_TO_RESPONSE_TONE, {
    stable: "neutral",
    watch: "attention",
    risk: "warning",
    critical: "critical",
    opportunity: "opportunity",
    unresolved: "uncertain",
  });
  assert.equal(resolveRequiresImmediateAttention("immediate"), true);
  assert.equal(resolveRequiresImmediateAttention("medium"), false);
});

test("P1:5 Dataset A standard response — watch / attention", () => {
  const { context, advisoryResolution, response } = pipeline("baseline", {
    focusedObjectId: "obj-capacity",
    mode: "standard",
  });

  assert.equal(context.dominantState, "watch");
  assert.equal(context.attention, "medium");
  assert.equal(response.tone, "attention");
  assert.equal(response.requiresImmediateAttention, false);
  assert.equal(response.primarySubjectId, "obj-capacity");
  assert.match(response.headline, /Production|Capacity|Attention|Elevated/i);
  assert.ok(sectionKinds(response).includes("situation"));
  assert.ok(sectionKinds(response).includes("evidence"));
  assert.ok(sectionKinds(response).includes("meaning"));
  assert.ok(sectionKinds(response).includes("guidance"));
  assert.equal(/escalat/i.test(response.summary), false);

  const primaryGuidance = advisoryResolution.guidance.find(
    (entry) => entry.id === advisoryResolution.primaryGuidanceId,
  )!;
  assert.ok(response.summary.includes(primaryGuidance.title.replace(/\.$/, "")));
});

test("P1:5 Dataset B standard response — critical / immediate", () => {
  const { context, advisoryResolution, response } = pipeline(
    "operational-pressure",
    {
      focusedObjectId: "obj-capacity",
      mode: "standard",
    },
  );

  assert.equal(context.dominantState, "critical");
  assert.equal(context.attention, "immediate");
  assert.equal(response.tone, "critical");
  assert.equal(response.requiresImmediateAttention, true);
  assert.equal(response.headline, "Production Capacity Under Pressure");
  assert.match(response.summary, /critical executive state/i);
  assert.match(response.summary, /96%/);
  assert.match(response.summary, /practical capacity limit|operational flexibility/i);

  const primaryGuidance = advisoryResolution.guidance.find(
    (entry) => entry.id === advisoryResolution.primaryGuidanceId,
  )!;
  assert.ok(response.guidanceIds.includes(primaryGuidance.id));
  assert.ok(response.summary.includes(primaryGuidance.title.replace(/\.$/, "")));
});

test("P1:5 cross-dataset same interaction → different response", () => {
  const shared = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory"] as const,
    requestedIntent: "investigate" as const,
    mode: "standard" as const,
  };
  const a = pipeline("baseline", shared);
  const b = pipeline("operational-pressure", shared);

  assert.equal(a.response.tone, "attention");
  assert.equal(b.response.tone, "critical");
  assert.equal(a.response.requiresImmediateAttention, false);
  assert.equal(b.response.requiresImmediateAttention, true);
  assert.notEqual(a.response.headline, b.response.headline);
  assert.notEqual(a.response.summary, b.response.summary);
  assert.notEqual(a.response.id, b.response.id);
});

test("P1:5 response modes control density, not truth", () => {
  const shared = {
    focusedObjectId: "obj-capacity" as const,
    scenario: "operational-pressure" as const,
  };
  const minimum = pipeline(shared.scenario, {
    focusedObjectId: shared.focusedObjectId,
    mode: "minimum",
  }).response;
  const brief = pipeline(shared.scenario, {
    focusedObjectId: shared.focusedObjectId,
    mode: "brief",
  }).response;
  const standard = pipeline(shared.scenario, {
    focusedObjectId: shared.focusedObjectId,
    mode: "standard",
  }).response;
  const detailed = pipeline(shared.scenario, {
    focusedObjectId: shared.focusedObjectId,
    mode: "detailed",
    includeSecondaryGuidance: true,
  }).response;

  assert.deepEqual(sectionKinds(minimum), ["headline", "situation"]);
  assert.deepEqual(sectionKinds(brief), ["headline", "situation", "meaning"]);
  assert.deepEqual(sectionKinds(standard), [
    "headline",
    "situation",
    "evidence",
    "meaning",
    "guidance",
  ]);
  assert.ok(sectionKinds(detailed).includes("guidance"));
  assert.ok(sectionKinds(detailed).includes("caveat"));
  assert.ok(detailed.guidanceIds.length >= standard.guidanceIds.length);
  assert.equal(minimum.tone, standard.tone);
  assert.equal(brief.requiresImmediateAttention, standard.requiresImmediateAttention);
  assert.equal(detailed.requiresImmediateAttention, true);
});

test("P1:5 stable response remains calm", () => {
  const { response } = pipeline("baseline", {
    focusedObjectId: "obj-revenue",
    mode: "standard",
    includeSecondaryGuidance: false,
  });

  // Force stable-focused composition path with includeLowAttention advisory already done in context.
  assert.equal(response.primarySubjectId, "obj-revenue");
  assert.equal(response.tone, "neutral");
  assert.match(response.headline, /Revenue Performance Stable/i);
  assert.match(response.summary, /expected operating range|currently stable/i);
  assert.equal(/escalat|urgent|warning/i.test(response.summary), false);
  assert.equal(response.requiresImmediateAttention, false);
});

test("P1:5 unresolved response protection for Cost", () => {
  const { response } = pipeline("baseline", {
    focusedObjectId: "cost",
    mode: "detailed",
  });

  assert.equal(response.primarySubjectId, "cost");
  assert.equal(response.tone, "uncertain");
  assert.match(response.headline, /Cost Performance Unresolved/i);
  assert.match(response.summary, /unresolved|insufficient|unavailable/i);
  assert.equal(/poor|reduce costs|too high|unhealthy/i.test(response.summary), false);
  assert.ok(response.hasUnresolvedReality);
  assert.ok(sectionKinds(response).includes("caveat"));
});

test("P1:5 focus does not hide enterprise immediate attention", () => {
  const { context, response } = pipeline("operational-pressure", {
    focusedObjectId: "obj-revenue",
    mode: "standard",
  });

  assert.equal(context.primarySubjectId, "obj-revenue");
  assert.equal(context.attention, "immediate");
  assert.equal(response.primarySubjectId, "obj-revenue");
  assert.equal(response.tone, "attention");
  assert.equal(response.requiresImmediateAttention, true);
});

test("P1:5 guidance fidelity — no semantic strengthening", () => {
  const { advisoryResolution, response } = pipeline("operational-pressure", {
    focusedObjectId: "obj-capacity",
    mode: "standard",
  });

  const primaryGuidance = advisoryResolution.guidance.find(
    (entry) => entry.id === advisoryResolution.primaryGuidanceId,
  )!;
  assert.ok(response.summary.includes(primaryGuidance.title.replace(/\.$/, "")));
  assert.equal(response.summary.includes("Increase capacity immediately"), false);
  assert.equal(response.summary.includes("Buy another production line"), false);
  assert.equal(
    /I have escalated|I created|I notified|has been initiated/i.test(
      response.summary,
    ),
    false,
  );
  assert.equal(/The decision is/i.test(response.summary), false);

  const recommendGuidance = advisoryResolution.guidance.find(
    (entry) => entry.kind === "recommend" && entry.subjectId === "obj-capacity",
  );
  assert.ok(recommendGuidance);
  assert.match(recommendGuidance!.title, /Consider evaluating/i);
  assert.equal(/Increase|Buy|approved decision/i.test(recommendGuidance!.title), false);
});

test("P1:5 no new claim / no causal invention", () => {
  const { context, advisoryResolution, response } = pipeline(
    "operational-pressure",
    {
      focusedObjectId: "obj-capacity",
      mode: "standard",
    },
  );

  for (const section of response.sections) {
    if (section.kind === "headline" || section.kind === "situation") {
      assert.ok(section.observationIds.length > 0);
    }
    if (section.kind === "evidence") {
      assert.ok(section.evidenceIds.length > 0);
      for (const evidenceId of section.evidenceIds) {
        assert.ok(context.evidence.some((entry) => entry.id === evidenceId));
      }
    }
    if (section.kind === "meaning") {
      const observation = context.observations.find((entry) =>
        section.observationIds.includes(entry.id),
      )!;
      assert.ok(section.text.includes(observation.executiveMeaning.replace(/\.$/, "")));
    }
    if (section.kind === "guidance") {
      for (const guidanceId of section.guidanceIds) {
        const guidance = advisoryResolution.guidance.find(
          (entry) => entry.id === guidanceId,
        )!;
        assert.ok(section.text.includes(guidance.title.replace(/\.$/, "")));
      }
    }
  }

  assert.equal(
    /because production|caused by|due to overloaded production/i.test(
      response.summary,
    ),
    false,
  );
});

test("P1:5 traceability integrity", () => {
  const { context, advisoryResolution, response } = pipeline(
    "operational-pressure",
    {
      focusedObjectId: "obj-capacity",
      mode: "detailed",
      includeSecondaryGuidance: true,
    },
  );

  const evidenceIds = new Set(context.evidence.map((entry) => entry.id));
  const observationIds = new Set(
    context.observations.map((entry) => entry.id),
  );
  const guidanceIds = new Set(
    advisoryResolution.guidance.map((entry) => entry.id),
  );
  const candidateIds = new Set(
    advisoryResolution.candidates.map((entry) => entry.id),
  );

  for (const evidenceId of response.evidenceIds) {
    assert.ok(evidenceIds.has(evidenceId));
  }
  for (const observationId of response.observationIds) {
    assert.ok(observationIds.has(observationId));
  }
  for (const guidanceId of response.guidanceIds) {
    assert.ok(guidanceIds.has(guidanceId));
  }
  for (const candidateId of response.advisoryCandidateIds) {
    assert.ok(candidateIds.has(candidateId));
  }
});

test("P1:5 determinism and immutability", () => {
  const context = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshotFor("baseline"),
    focusedObjectId: "obj-capacity",
    requestedIntent: "investigate",
    currentWorkspace: "problem",
  });
  const advisoryResolution = resolveDataRealityExecutiveAdvisoryResolution({
    context,
    requestedIntent: "investigate",
  });
  const contextJson = JSON.stringify(context);
  const advisoryJson = JSON.stringify(advisoryResolution);

  const a = composeDataRealityExecutiveAdvisorResponse({
    context,
    advisoryResolution,
    mode: "standard",
  });
  const b = composeDataRealityExecutiveAdvisorResponse({
    context,
    advisoryResolution,
    mode: "standard",
  });

  assert.equal(JSON.stringify(context), contextJson);
  assert.equal(JSON.stringify(advisoryResolution), advisoryJson);
  assert.deepEqual(a, b);
  assert.equal(Object.isFrozen(a), true);
  assert.equal(Object.isFrozen(a.sections), true);
  assert.equal(Object.isFrozen(a.evidenceIds), true);
  assert.equal(Object.isFrozen(a.guidanceIds), true);
  assert.ok(a.id.startsWith("advisor-response:"));
});

test("P1:5 end-to-end Dataset→P0→P1:2→P1:3→P1:4→P1:5 causal proof", () => {
  const shared = {
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory"] as const,
    requestedIntent: "investigate" as const,
    mode: "standard" as const,
  };

  const a = pipeline("baseline", shared);
  const b = pipeline("operational-pressure", shared);

  assert.equal(a.context.dominantState, "watch");
  assert.equal(a.context.attention, "medium");
  assert.equal(a.response.tone, "attention");
  assert.equal(a.response.requiresImmediateAttention, false);
  assert.equal(/escalat/i.test(a.response.summary), false);

  assert.equal(b.context.dominantState, "critical");
  assert.equal(b.context.attention, "immediate");
  assert.equal(b.response.tone, "critical");
  assert.equal(b.response.requiresImmediateAttention, true);
  assert.ok(
    b.advisoryResolution.guidance.some((entry) => entry.priority === "urgent"),
  );
  assert.ok(
    b.response.guidanceIds.some((id) =>
      b.advisoryResolution.guidance.some(
        (entry) => entry.id === id && entry.priority === "urgent",
      ),
    ),
  );

  assert.notEqual(
    a.context.observations.find((entry) => entry.subjectId === "obj-capacity")!
      .executiveMeaning,
    b.context.observations.find((entry) => entry.subjectId === "obj-capacity")!
      .executiveMeaning,
  );
  assert.notEqual(a.response.summary, b.response.summary);
});

test("P1:5 dependency and non-duplication rules", () => {
  const source = readFileSync(sourcePath, "utf8");
  assert.ok(
    source.includes('from "./dataRealityAwareExecutiveAdvisorFoundation.ts"'),
  );
  assert.ok(
    source.includes('from "./dataRealityExecutiveAdvisoryResolution.ts"'),
  );
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
  assert.equal(/buildDataRealityAwareAdvisorContext/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveObservationResolution/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveAdvisoryResolution/.test(source), false);
  assert.equal(
    /export\s+(type|interface)\s+DataRealityAwareAdvisorContext\b/.test(source),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+DataRealityExecutiveGuidance\b/.test(source),
    false,
  );

  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
  ];
  for (const pattern of forbidden) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
});
