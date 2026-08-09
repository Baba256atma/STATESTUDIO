import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE as emptyResponse,
  RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS as headlineIntents,
  RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS as implicationKinds,
  RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS as nextStepKinds,
  RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES as observationCategories,
  RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE as observationImportance,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS as responseDepths,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES as responseEmphases,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS as responseKinds,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS as relationshipKinds,
  RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES as responseStates,
  RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS as signalKinds,
  RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES as signalSeverities,
  deriveRuntimeExecutiveAdvisorImplications,
  deriveRuntimeExecutiveAdvisorObservations,
  deriveRuntimeExecutiveAdvisorRelationships,
  deriveRuntimeExecutiveAdvisorSignals,
  getRuntimeExecutiveAdvisorResponseModelIdentity,
  isRuntimeExecutiveAdvisorResponseActionable,
  resolveRuntimeExecutiveAdvisorHeadlineIntent,
  resolveRuntimeExecutiveAdvisorResponse,
  resolveRuntimeExecutiveAdvisorResponseDepth,
  resolveRuntimeExecutiveAdvisorResponseEmphasis,
  resolveRuntimeExecutiveAdvisorResponseKind,
  resolveRuntimeExecutiveAdvisorResponseState,
  runtimeExecutiveAdvisorResponseModel as module,
  runtimeExecutiveAdvisorResponseModelApiNames as apiNames,
  runtimeExecutiveAdvisorResponseModelCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorResponseModelRegistry as registry,
  validateRuntimeExecutiveAdvisorResponse,
  verifyRuntimeExecutiveAdvisorResponseModel,
} from "./runtimeExecutiveAdvisorResponseModel.ts";

import {
  bindRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorBindingEvidence,
  createRuntimeExecutiveAdvisorSubject,
  runtimeExecutiveAdvisorContextSubjectBindingIdentity,
  runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
  verifyRuntimeExecutiveAdvisorContextSubjectBinding,
} from "@/app/lib/rex/runtimeExecutiveAdvisorContextSubjectBinding";

const source = readFileSync(
  new URL("./runtimeExecutiveAdvisorResponseModel.ts", import.meta.url),
  "utf8",
);

function subject(
  id: string,
  label: string,
  kind: "nexora-object" | "decision" | "execution" | "scenario" | "kpi" = "nexora-object",
) {
  return createRuntimeExecutiveAdvisorSubject({ id, kind, label });
}

function bind(
  evidence: Parameters<typeof createRuntimeExecutiveAdvisorBindingEvidence>[0][],
) {
  return bindRuntimeExecutiveAdvisorContext({
    evidence: evidence.map((entry) =>
      createRuntimeExecutiveAdvisorBindingEvidence(entry),
    ),
  });
}

test("1. exact identity / version / namespace / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:3/RuntimeExecutiveAdvisorResponseModel",
  );
  assert.equal(module.version, "3.3.0");
  assert.equal(
    module.namespace,
    "nexora.rex.advisor-experience.response-model",
  );
  assert.equal(module.status, "ResponseModelReady");
  assert.equal(
    module.upstreamDependency,
    "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorContextSubjectBindingIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorResponseModelIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorContextSubjectBinding",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisorExperienceFoundation["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
});

test("2. vocabulary collections and registry", () => {
  assert.deepEqual([...responseStates], [
    "empty",
    "contextual",
    "interpreted",
    "actionable",
  ]);
  assert.deepEqual([...responseKinds], [
    "status",
    "explanation",
    "inspection",
    "comparison",
    "risk",
    "opportunity",
    "relationship",
    "decision-support",
    "execution-support",
  ]);
  assert.equal(headlineIntents.length, 7);
  assert.equal(observationCategories.length, 7);
  assert.equal(observationImportance.length, 4);
  assert.equal(signalKinds.length, 8);
  assert.equal(signalSeverities.length, 5);
  assert.equal(relationshipKinds.length, 6);
  assert.equal(implicationKinds.length, 6);
  assert.equal(responseDepths.length, 3);
  assert.equal(responseEmphases.length, 6);
  assert.equal(nextStepKinds.length, 8);
  assert.equal(capabilities.length, 19);
  assert.deepEqual([...registrySections], [
    "Identity",
    "ResponseStates",
    "ResponseKinds",
    "HeadlineIntents",
    "ObservationCategories",
    "ObservationImportance",
    "SignalKinds",
    "SignalSeverities",
    "RelationshipKinds",
    "ImplicationKinds",
    "ResponseDepths",
    "ResponseEmphases",
    "NextStepKinds",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.responseStateCount, responseStates.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
});

test("3. empty response", () => {
  const response = resolveRuntimeExecutiveAdvisorResponse(
    bind([]),
  );
  assert.deepEqual(response, emptyResponse);
  assert.equal(response.state, "empty");
  assert.equal(response.subject, null);
  assert.equal(response.isActionable, false);
  assert.equal(response.confidence, "unknown");
  assert.equal(response.urgency, "none");
  assert.equal(response.depth, "signal");
  assert.equal(response.emphasis, "neutral");
});

test("4. Example — simple Stage selection / inspection → contextual", () => {
  const binding = bind([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      guidanceIntent: "inspect",
      presentationState: "report",
      attention: "normal",
    },
  ]);
  const response = resolveRuntimeExecutiveAdvisorResponse(binding);

  assert.equal(resolveRuntimeExecutiveAdvisorResponseKind(binding), "inspection");
  assert.equal(response.kind, "inspection");
  assert.equal(response.subject?.id, "object.factory");
  assert.equal(response.headlineIntent, "clarify");
  assert.equal(response.state, "contextual");
  assert.equal(response.depth, "summary");
  assert.equal(response.emphasis, "neutral");
  assert.ok(["medium", "high"].includes(response.confidence));
  assert.doesNotMatch(JSON.stringify(response), /dangerous|causing/i);
});

test("5. attention context — no fabricated risk; investigate implication", () => {
  const binding = bind([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      guidanceIntent: "inspect",
    },
    {
      sourceKind: "attention",
      subject: subject("object.delivery", "Delivery"),
      attention: "critical",
    },
  ]);
  const response = resolveRuntimeExecutiveAdvisorResponse(binding);
  const signals = deriveRuntimeExecutiveAdvisorSignals(binding);

  assert.ok(signals.some((signal) => signal.kind === "attention"));
  assert.ok(!signals.some((signal) => signal.kind === "risk"));
  assert.ok(
    response.implications.some((entry) => entry.kind === "investigate"),
  );
  assert.ok(
    response.relationships.every(
      (entry) =>
        entry.kind === "related" || entry.kind === "connected-to",
    ),
  );
  assert.ok(response.state === "interpreted" || response.state === "actionable");
  assert.doesNotMatch(
    JSON.stringify(response),
    /Factory is causing Delivery risk/i,
  );
});

test("6. comparison / decision / execution examples", () => {
  const comparison = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "explicit-manager-intent",
        subject: subject("scenario.a", "Scenario A", "scenario"),
        guidanceIntent: "compare",
        presentationState: "operation",
      },
      {
        sourceKind: "related-subject",
        subject: subject("scenario.b", "Scenario B", "scenario"),
      },
    ]),
  );
  assert.equal(comparison.kind, "comparison");
  assert.equal(comparison.headlineIntent, "compare");
  assert.equal(comparison.depth, "analysis");
  assert.ok(comparison.nextSteps.includes("compare"));
  assert.ok(comparison.state === "interpreted" || comparison.state === "actionable");

  const decision = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "stage-selection",
        subject: subject("decision.capacity", "Increase Capacity", "decision"),
      },
    ]),
  );
  assert.equal(decision.kind, "decision-support");
  assert.equal(decision.headlineIntent, "prepare-decision");
  assert.equal(decision.emphasis, "decision");
  assert.ok(decision.nextSteps.includes("review-decision"));

  const execution = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "stage-selection",
        subject: subject("execution.expand", "Capacity Expansion", "execution"),
        attention: "elevated",
      },
    ]),
  );
  assert.equal(execution.kind, "execution-support");
  assert.equal(execution.emphasis, "execution");
  assert.ok(
    execution.implications.some((entry) => entry.kind === "monitor"),
  );
  assert.ok(execution.nextSteps.includes("review-execution"));
  assert.doesNotMatch(source, /\b(start|pause|resume|complete|cancel)Execution\b/);
});

test("7. risk only with explicit marker; relationship no causal overreach", () => {
  const withRisk = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
        markers: ["risk"],
      },
    ]),
  );
  assert.equal(withRisk.kind, "risk");
  assert.ok(withRisk.signals.some((signal) => signal.kind === "risk"));
  assert.equal(withRisk.headlineIntent, "warn");
  assert.equal(withRisk.emphasis, "risk");

  const linked = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
      },
      {
        sourceKind: "related-subject",
        subject: subject("object.delivery", "Delivery"),
        linkageKind: "connected-to",
        linkageTargetSubjectId: "object.factory",
      },
    ]),
  );
  assert.ok(
    linked.relationships.some((entry) => entry.kind === "connected-to"),
  );
  assert.ok(
    !linked.relationships.some((entry) => entry.kind === "influences"),
  );
});

test("8. observation / signal / relationship / implication derivation + dedupe", () => {
  const binding = bind([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      sourceId: "sel.factory",
      attention: "elevated",
    },
    {
      sourceKind: "stage-focus",
      subject: subject("object.factory", "Factory"),
      sourceId: "focus.factory",
      attention: "elevated",
    },
    {
      sourceKind: "related-subject",
      subject: subject("object.delivery", "Delivery"),
    },
  ]);

  const observations = deriveRuntimeExecutiveAdvisorObservations(binding);
  const attentionObs = observations.filter(
    (entry) => entry.category === "attention" && entry.subjectId === "object.factory",
  );
  assert.equal(attentionObs.length, 1);
  assert.ok(attentionObs[0]!.sourceIds.includes("sel.factory"));
  assert.ok(attentionObs[0]!.sourceIds.includes("focus.factory"));

  const signals = deriveRuntimeExecutiveAdvisorSignals(binding);
  const attentionSignals = signals.filter(
    (entry) => entry.kind === "attention" && entry.subjectId === "object.factory",
  );
  assert.equal(attentionSignals.length, 1);
  assert.ok(attentionSignals[0]!.sourceIds.includes("sel.factory"));
  assert.ok(attentionSignals[0]!.sourceIds.includes("focus.factory"));

  const relationships = deriveRuntimeExecutiveAdvisorRelationships(binding);
  assert.ok(
    relationships.some(
      (entry) =>
        entry.sourceSubjectId === "object.factory" &&
        entry.targetSubjectId === "object.delivery",
    ),
  );

  const implications = deriveRuntimeExecutiveAdvisorImplications(
    binding,
    signals,
  );
  assert.ok(implications.some((entry) => entry.kind === "investigate"));
});

test("9. headline / depth / emphasis / actionability / state resolution", () => {
  assert.equal(
    resolveRuntimeExecutiveAdvisorHeadlineIntent("status"),
    "inform",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorHeadlineIntent("risk"),
    "warn",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorHeadlineIntent("decision-support"),
    "prepare-decision",
  );

  const binding = bind([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      presentationState: "minimum",
    },
  ]);
  assert.equal(resolveRuntimeExecutiveAdvisorResponseDepth(binding), "signal");

  const signals = deriveRuntimeExecutiveAdvisorSignals(
    bind([
      {
        sourceKind: "attention",
        subject: subject("object.factory", "Factory"),
        attention: "critical",
        markers: ["risk"],
      },
    ]),
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorResponseEmphasis({
      kind: "risk",
      signals,
    }),
    "risk",
  );

  const actionable = resolveRuntimeExecutiveAdvisorResponse(
    bind([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
        guidanceIntent: "inspect",
      },
      {
        sourceKind: "attention",
        subject: subject("object.delivery", "Delivery"),
        attention: "critical",
      },
    ]),
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorResponseState({
      binding: bind([
        {
          sourceKind: "stage-selection",
          subject: subject("object.factory", "Factory"),
          guidanceIntent: "inspect",
        },
        {
          sourceKind: "attention",
          subject: subject("object.delivery", "Delivery"),
          attention: "critical",
        },
      ]),
      observations: actionable.observations,
      signals: actionable.signals,
      relationships: actionable.relationships,
      implications: actionable.implications,
      nextSteps: actionable.nextSteps,
    }),
    actionable.state,
  );
  if (actionable.state === "actionable") {
    assert.equal(actionable.isActionable, true);
    assert.equal(isRuntimeExecutiveAdvisorResponseActionable(actionable), true);
  }
});

test("10. validation, determinism, immutability", () => {
  const evidence = Object.freeze([
    Object.freeze({
      sourceKind: "stage-selection" as const,
      subject: Object.freeze(subject("object.factory", "Factory")),
      guidanceIntent: "inspect" as const,
    }),
  ]);
  const input = Object.freeze({ evidence });
  const before = JSON.stringify(input);
  const bindingA = bindRuntimeExecutiveAdvisorContext(input);
  const bindingB = bindRuntimeExecutiveAdvisorContext(input);
  assert.equal(JSON.stringify(input), before);

  const a = resolveRuntimeExecutiveAdvisorResponse(bindingA);
  const b = resolveRuntimeExecutiveAdvisorResponse(bindingB);
  assert.deepEqual(a, b);
  assert.equal(validateRuntimeExecutiveAdvisorResponse(a).ok, true);

  const invalid = validateRuntimeExecutiveAdvisorResponse({
    ...emptyResponse,
    state: "not-a-state",
    subject: { id: "x", kind: "nexora-object", label: "X" },
    isActionable: true,
  });
  assert.equal(invalid.ok, false);
});

test("11. no AI / no UI / no Stage mutation / REX-3:2 compatibility / verification", () => {
  assert.equal(boundary.generatesProse, false);
  assert.equal(boundary.generatesAdvice, false);
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.fabricatesRisk, false);
  assert.equal(boundary.strengthensCausality, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\b(?:select|focus|navigate|dispatch)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.doesNotMatch(source, /Factory performance is dangerous/);
  assert.ok(module.forbiddenResponsibilities.includes("LLM calls"));
  assert.ok(module.forbiddenResponsibilities.includes("Stage mutation"));

  assert.equal(verifyRuntimeExecutiveAdvisorContextSubjectBinding().ok, true);
  const verification = verifyRuntimeExecutiveAdvisorResponseModel();
  assert.equal(verification.ok, true);
  assert.equal(verification.noRiskFromAttentionAlone, true);
  assert.equal(verification.noCausalStrengthening, true);
  assert.equal(verification.bindingOk, true);
  assert.equal(verification.responseStateCount, 4);
  assert.equal(verification.responseKindCount, 9);
  assert.equal(verification.capabilityCount, 19);
  assert.equal(verification.sectionCount, 14);
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:4 Advisor Guidance & Executive Actions/,
  );
});
