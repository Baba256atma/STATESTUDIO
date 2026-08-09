import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES as actionAuthorities,
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS as preconditionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES as actionSafeties,
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE as emptyPackage,
  RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS as actionKinds,
  RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES as actionStates,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_FORBIDDEN,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS as guidanceKinds,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES as guidancePriorities,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES as guidanceStates,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS as mappings,
  createRuntimeExecutiveAdvisorGuidancePackage,
  deriveRuntimeExecutiveAdvisorExecutiveActions,
  deriveRuntimeExecutiveAdvisorGuidance,
  evaluateRuntimeExecutiveAdvisorActionPreconditions,
  getRuntimeExecutiveAdvisorGuidanceActionsIdentity,
  isRuntimeExecutiveAdvisorActionReady,
  resolveRuntimeExecutiveAdvisorActionAuthority,
  resolveRuntimeExecutiveAdvisorActionSafety,
  resolveRuntimeExecutiveAdvisorActionState,
  resolveRuntimeExecutiveAdvisorGuidancePriority,
  resolveRuntimeExecutiveAdvisorGuidanceState,
  resolveRuntimeExecutiveAdvisorPrimaryGuidance,
  runtimeExecutiveAdvisorGuidanceActions as module,
  runtimeExecutiveAdvisorGuidanceActionsApiNames as apiNames,
  runtimeExecutiveAdvisorGuidanceActionsCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorGuidanceActionsRegistry as registry,
  validateRuntimeExecutiveAdvisorExecutiveAction,
  validateRuntimeExecutiveAdvisorGuidance,
  validateRuntimeExecutiveAdvisorGuidancePackage,
  verifyRuntimeExecutiveAdvisorGuidanceActions,
} from "./runtimeExecutiveAdvisorGuidanceActions.ts";

import {
  bindRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorBindingEvidence,
  createRuntimeExecutiveAdvisorSubject,
  resolveRuntimeExecutiveAdvisorResponse,
  runtimeExecutiveAdvisorResponseModelIdentity,
  runtimeExecutiveAdvisorResponseModelSupportedImportPath,
  verifyRuntimeExecutiveAdvisorResponseModel,
} from "@/app/lib/rex/runtimeExecutiveAdvisorResponseModel";

const source = readFileSync(
  new URL("./runtimeExecutiveAdvisorGuidanceActions.ts", import.meta.url),
  "utf8",
);

function subject(
  id: string,
  label: string,
  kind: "nexora-object" | "decision" | "execution" | "scenario" = "nexora-object",
) {
  return createRuntimeExecutiveAdvisorSubject({ id, kind, label });
}

function responseFrom(
  evidence: Parameters<typeof createRuntimeExecutiveAdvisorBindingEvidence>[0][],
) {
  return resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({
      evidence: evidence.map((entry) =>
        createRuntimeExecutiveAdvisorBindingEvidence(entry),
      ),
    }),
  );
}

test("1. exact identity / version / namespace / sole dependency", () => {
  assert.equal(
    module.identity,
    "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions",
  );
  assert.equal(module.version, "3.4.0");
  assert.equal(
    module.namespace,
    "nexora.rex.advisor-experience.guidance-actions",
  );
  assert.equal(module.status, "GuidanceReady");
  assert.equal(
    module.upstreamDependency,
    "REX-3:3/RuntimeExecutiveAdvisorResponseModel",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveAdvisorResponseModelIdentity,
  );
  assert.equal(
    module.dependencyPath,
    runtimeExecutiveAdvisorResponseModelSupportedImportPath,
  );
  assert.deepEqual(
    getRuntimeExecutiveAdvisorGuidanceActionsIdentity(),
    canonicalIdentity,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorResponseModel",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveAdvisor(?:ExperienceFoundation|ContextSubjectBinding)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol|rex\/runtimeExecutiveStage|rex\/runtimeEnabled)[^"']*["']/,
  );
});

test("2. vocabulary collections, mappings, registry", () => {
  assert.deepEqual([...guidanceStates], [
    "none",
    "available",
    "recommended",
    "urgent",
  ]);
  assert.equal(guidanceKinds.length, 11);
  assert.deepEqual([...guidancePriorities], [
    "low",
    "normal",
    "high",
    "critical",
  ]);
  assert.equal(actionKinds.length, 12);
  assert.deepEqual([...actionStates], [
    "available",
    "disabled",
    "requires-confirmation",
    "blocked",
  ]);
  assert.deepEqual([...actionAuthorities], [
    "advisor-only",
    "manager-confirmation",
    "runtime-coordination",
  ]);
  assert.deepEqual([...actionSafeties], [
    "informational",
    "navigational",
    "workflow",
    "controlled",
  ]);
  assert.equal(preconditionKinds.length, 8);
  assert.ok(mappings.length >= 10);
  assert.equal(capabilities.length, 23);
  assert.deepEqual([...registrySections], [
    "Identity",
    "GuidanceStates",
    "GuidanceKinds",
    "GuidancePriorities",
    "ActionKinds",
    "ActionStates",
    "ActionAuthorities",
    "ActionSafeties",
    "ActionPreconditions",
    "Mappings",
    "Validation",
    "Capabilities",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.mappingCount, mappings.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
});

test("3. empty guidance package", () => {
  const pkg = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([]),
  );
  assert.deepEqual(pkg, emptyPackage);
  assert.equal(pkg.state, "none");
  assert.equal(pkg.primaryGuidance, null);
  assert.equal(pkg.isActionReady, false);
});

test("4. Example A — inspect Factory", () => {
  const response = responseFrom([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      guidanceIntent: "inspect",
      presentationState: "report",
    },
  ]);
  const pkg = createRuntimeExecutiveAdvisorGuidancePackage(response);
  assert.ok(pkg.guidance.some((entry) => entry.kind === "inspect"));
  assert.ok(
    pkg.actions.some(
      (action) =>
        action.kind === "inspect-subject" &&
        action.targetSubjectIds.includes("object.factory"),
    ),
  );
  assert.ok(pkg.state === "available" || pkg.state === "recommended");
});

test("5. Example B — Delivery attention → investigate + trace", () => {
  const response = responseFrom([
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
  const pkg = createRuntimeExecutiveAdvisorGuidancePackage(response);
  assert.ok(
    pkg.guidance.some(
      (entry) =>
        entry.kind === "investigate" &&
        entry.target.subjectId === "object.delivery",
    ),
  );
  assert.ok(pkg.guidance.some((entry) => entry.kind === "trace"));
  const primary = resolveRuntimeExecutiveAdvisorPrimaryGuidance(pkg.guidance);
  assert.ok(primary);
  assert.ok(
    pkg.actions.some((action) => action.kind === "inspect-subject"),
  );
  assert.ok(
    pkg.actions.some(
      (action) =>
        action.kind === "trace-relationship" &&
        action.authority === "runtime-coordination",
    ),
  );
  assert.ok(pkg.state === "recommended" || pkg.state === "urgent");
  assert.doesNotMatch(JSON.stringify(pkg), /Increase Factory capacity/i);
});

test("6. Example C/D/E — compare / decision / execution", () => {
  const comparison = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([
      {
        sourceKind: "explicit-manager-intent",
        subject: subject("scenario.a", "Scenario A", "scenario"),
        guidanceIntent: "compare",
      },
      {
        sourceKind: "related-subject",
        subject: subject("scenario.b", "Scenario B", "scenario"),
      },
    ]),
  );
  assert.ok(comparison.guidance.some((entry) => entry.kind === "compare"));
  const compareAction = comparison.actions.find(
    (action) => action.kind === "compare-subjects",
  );
  assert.ok(compareAction);
  assert.ok(
    compareAction!.state === "available" ||
      compareAction!.state === "requires-confirmation",
  );

  const decision = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject(
          "decision.capacity",
          "Increase Capacity",
          "decision",
        ),
      },
    ]),
  );
  assert.ok(
    decision.guidance.some((entry) => entry.kind === "prepare-decision"),
  );
  assert.ok(
    decision.actions.some((action) => action.kind === "review-decision"),
  );
  assert.ok(
    !decision.actions.some((action) =>
      String(action.kind).includes("approve"),
    ),
  );

  const execution = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject(
          "execution.expand",
          "Capacity Expansion",
          "execution",
        ),
        markers: ["blocker"],
      },
    ]),
  );
  assert.ok(
    execution.guidance.some(
      (entry) =>
        entry.kind === "prepare-action" || entry.kind === "monitor",
    ),
  );
  assert.ok(
    execution.actions.some((action) => action.kind === "review-execution"),
  );
});

test("7. weak evidence — conservative guidance only", () => {
  const pkg = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
        attention: "normal",
      },
    ]),
  );
  assert.ok(pkg.guidance.every((entry) => entry.kind === "inspect"));
  assert.ok(pkg.guidance.every((entry) => entry.priority === "low"));
  assert.ok(
    !pkg.guidance.some((entry) =>
      ["investigate", "prepare-scenario", "prepare-action"].includes(
        entry.kind,
      ),
    ),
  );
});

test("8. priority / primary / rationale / confidence / urgency", () => {
  const response = responseFrom([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
    },
    {
      sourceKind: "attention",
      subject: subject("object.delivery", "Delivery"),
      attention: "critical",
      markers: ["risk"],
    },
  ]);
  const guidance = deriveRuntimeExecutiveAdvisorGuidance(response);
  const investigate = guidance.find((entry) => entry.kind === "investigate");
  assert.ok(investigate);
  assert.ok(
    resolveRuntimeExecutiveAdvisorGuidancePriority({
      kind: "investigate",
      response,
      targetSubjectId: "object.delivery",
    }) === "high" ||
      resolveRuntimeExecutiveAdvisorGuidancePriority({
        kind: "investigate",
        response,
        targetSubjectId: "object.delivery",
      }) === "critical",
  );
  assert.ok(investigate!.rationale.sourceSignalIds.length > 0);
  assert.ok(investigate!.provenance.length >= 0);
  assert.ok(["low", "medium", "high"].includes(investigate!.confidence));

  const primary = resolveRuntimeExecutiveAdvisorPrimaryGuidance(guidance);
  assert.equal(primary?.id, guidance[0]?.id);
  assert.ok(guidance.length > 1);

  const state = resolveRuntimeExecutiveAdvisorGuidanceState({
    guidance,
    response,
  });
  assert.ok(state === "recommended" || state === "urgent");
});

test("9. action mapping, authority, safety, preconditions, readiness", () => {
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionAuthority("inspect-subject"),
    "advisor-only",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionAuthority("focus-subject"),
    "runtime-coordination",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionAuthority("open-scenario"),
    "manager-confirmation",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionSafety("inspect-subject"),
    "informational",
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionSafety("open-decision"),
    "workflow",
  );

  const response = responseFrom([
    {
      sourceKind: "stage-selection",
      subject: subject("object.factory", "Factory"),
      guidanceIntent: "inspect",
    },
  ]);
  const guidance = deriveRuntimeExecutiveAdvisorGuidance(response);
  const actions = deriveRuntimeExecutiveAdvisorExecutiveActions({
    response,
    guidance,
  });
  assert.ok(actions.some((action) => action.sourceGuidanceIds.length > 0));
  assert.ok(isRuntimeExecutiveAdvisorActionReady(actions));

  const blockedCompare = evaluateRuntimeExecutiveAdvisorActionPreconditions({
    kind: "compare-subjects",
    response: responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
      },
    ]),
    targetSubjectIds: ["object.factory"],
  });
  assert.ok(
    blockedCompare.some(
      (entry) =>
        entry.kind === "comparison-subjects-present" &&
        entry.satisfied === false,
    ),
  );
  assert.equal(
    resolveRuntimeExecutiveAdvisorActionState({
      kind: "compare-subjects",
      preconditions: blockedCompare,
      authority: "manager-confirmation",
    }),
    "blocked",
  );

  const noDecision = evaluateRuntimeExecutiveAdvisorActionPreconditions({
    kind: "review-decision",
    response: responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject("object.factory", "Factory"),
      },
    ]),
    targetSubjectIds: ["object.factory"],
  });
  assert.ok(
    noDecision.some(
      (entry) => entry.kind === "decision-present" && !entry.satisfied,
    ),
  );

  const openScenario = createRuntimeExecutiveAdvisorGuidancePackage(
    responseFrom([
      {
        sourceKind: "stage-selection",
        subject: subject("scenario.a", "Scenario A", "scenario"),
        guidanceIntent: "inspect",
      },
    ]),
  );
  const scenarioAction = openScenario.actions.find(
    (action) => action.kind === "open-scenario",
  );
  if (scenarioAction) {
    assert.equal(scenarioAction.state, "requires-confirmation");
  }
});

test("10. dedupe, ordering, validation, determinism, immutability", () => {
  const evidence = Object.freeze([
    Object.freeze({
      sourceKind: "stage-selection" as const,
      subject: Object.freeze(subject("object.factory", "Factory")),
      guidanceIntent: "inspect" as const,
    }),
    Object.freeze({
      sourceKind: "attention" as const,
      subject: Object.freeze(subject("object.delivery", "Delivery")),
      attention: "critical" as const,
    }),
  ]);
  const before = JSON.stringify(evidence);
  const responseA = resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({ evidence }),
  );
  const responseB = resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({ evidence }),
  );
  assert.equal(JSON.stringify(evidence), before);

  const a = createRuntimeExecutiveAdvisorGuidancePackage(responseA);
  const b = createRuntimeExecutiveAdvisorGuidancePackage(responseB);
  assert.deepEqual(a, b);
  assert.equal(validateRuntimeExecutiveAdvisorGuidancePackage(a).ok, true);
  assert.ok(
    a.primaryGuidance === null ||
      a.guidance.some((entry) => entry.id === a.primaryGuidance?.id),
  );

  const inspectIds = a.actions.filter(
    (action) =>
      action.kind === "inspect-subject" &&
      action.targetSubjectIds.includes("object.delivery"),
  );
  assert.ok(inspectIds.length <= 1);

  assert.equal(
    validateRuntimeExecutiveAdvisorGuidance(a.guidance[0]).ok,
    true,
  );
  assert.equal(
    validateRuntimeExecutiveAdvisorExecutiveAction(a.actions[0]).ok,
    true,
  );
});

test("11. no AI / no UI / no execution / REX-3:3 compatibility / verification", () => {
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.coordinatesStage, false);
  assert.equal(boundary.generatesProse, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']zustand["']/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.ok(
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_FORBIDDEN.includes("dispatch()"),
  );
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.mutatesStageState, false);
  assert.ok(module.forbiddenResponsibilities.includes("action execution"));
  assert.ok(module.forbiddenResponsibilities.includes("Stage mutation"));

  assert.equal(verifyRuntimeExecutiveAdvisorResponseModel().ok, true);
  const verification = verifyRuntimeExecutiveAdvisorGuidanceActions();
  assert.equal(verification.ok, true);
  assert.equal(verification.noAutoExecution, true);
  assert.equal(verification.noStageMutation, true);
  assert.equal(verification.responseOk, true);
  assert.equal(verification.guidanceStateCount, 4);
  assert.equal(verification.guidanceKindCount, 11);
  assert.equal(verification.actionKindCount, 12);
  assert.equal(verification.capabilityCount, 23);
  assert.equal(verification.sectionCount, 12);
  assert.match(
    module.architecturalStatus,
    /Ready for REX-3:5 Advisor Stage Coordination/,
  );
});
