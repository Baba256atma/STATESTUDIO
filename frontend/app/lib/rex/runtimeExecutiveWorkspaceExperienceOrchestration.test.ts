import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS as bootstrapDefaults,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS as reasons,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES as pipelineStages,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES as capabilities,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperienceOrchestrationGuarantees,
  getRuntimeExecutiveWorkspaceExperienceOrchestrationIdentity,
  getRuntimeExecutiveWorkspaceExperienceOrchestrationInvariants,
  getRuntimeExecutiveWorkspaceExperienceOrchestrationRegistry,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest,
  runtimeExecutiveWorkspaceExperienceOrchestration as orchestration,
  runtimeExecutiveWorkspaceExperienceOrchestrationApiNames as apiNames,
  runtimeExecutiveWorkspaceExperienceOrchestrationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperienceOrchestrationRegistry as registry,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
} from "./runtimeExecutiveWorkspaceExperienceOrchestration.ts";

import {
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  resolveRuntimeExecutiveWorkspaceContext,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceTransitionDialOrchestration";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperienceOrchestration.ts",
    import.meta.url,
  ),
  "utf8",
);

function experienceFor(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  subjectId?: string,
  presentation: "minimum" | "report" | "operation" = "report",
) {
  const subject =
    kind === "overview"
      ? null
      : {
          kind,
          id:
            subjectId ??
            (kind === "problem"
              ? "supply-risk"
              : kind === "scenario"
                ? "scenario-a"
                : kind === "decision"
                  ? "increase-capacity"
                  : "capacity-expansion"),
        };

  const intent =
    kind === "overview"
      ? ("observe" as const)
      : kind === "problem"
        ? ("investigate" as const)
        : kind === "scenario"
          ? ("explore" as const)
          : kind === "decision"
            ? ("decide" as const)
            : ("execute" as const);

  const current = createRuntimeExecutiveWorkspaceContextContract({
    workspace: {
      workspaceId: `workspace.alpha.${kind}`,
      workspaceKind: kind,
    },
    subject,
    focus: {
      primarySubject: subject,
      relatedSubjects: [],
    },
    intent: { intent },
    activation: { state: "active" },
    presentation: { state: presentation },
  });

  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: current,
    requestedWorkspaceKind: kind,
    requestedSubject: current.subject,
    requestedIntent: current.intent.intent,
    requestedPresentation: presentation,
  });

  return createRuntimeExecutiveWorkspaceExperienceSnapshot({
    context: resolution.resolvedContext,
    composition: composeRuntimeExecutiveWorkspaceSurfacesFromResolution(
      resolution,
    ),
  });
}

function surfaceKind(
  result: ReturnType<typeof orchestrateRuntimeExecutiveWorkspaceExperience>,
  surface: "stage" | "advisor" | "insight" | "action",
) {
  return result.transition?.surfaces.find((entry) => entry.surface === surface)
    ?.kind;
}

function participation(
  result: ReturnType<typeof orchestrateRuntimeExecutiveWorkspaceExperience>,
  surface: "stage" | "advisor" | "insight" | "action",
) {
  return result.targetComposition?.surfaces.find(
    (entry) => entry.surface === surface,
  )?.participation;
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    orchestration.identity,
    "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration",
  );
  assert.equal(orchestration.version, "6.6.0");
  assert.equal(
    orchestration.namespace,
    "nexora.rex.workspace-experience.orchestration",
  );
  assert.equal(orchestration.phase, "ExperienceOrchestration");
  assert.equal(
    orchestration.architecturalRole,
    "RuntimeExecutiveWorkspaceExperienceOrchestration",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperienceOrchestrationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:5 transition orchestration", () => {
  assert.equal(
    orchestration.upstreamDependency,
    "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration",
  );
  assert.equal(
    orchestration.upstreamDependency,
    runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
  );
  assert.equal(
    orchestration.dependencyPath,
    runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
  );
  assert.equal(boundary.consumesTransitionOrchestrationOnly, true);
  assert.equal(boundary.importsRex64Directly, false);
  assert.equal(boundary.importsRex63Directly, false);
  assert.equal(boundary.importsRex62Directly, false);
  assert.equal(boundary.importsRex61Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceTransitionDialOrchestration",
  ]);
  assert.equal(
    verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration().ok,
    true,
  );
});

test("3. pipeline stages and orchestration vocabularies", () => {
  assert.deepEqual([...pipelineStages], [
    "request",
    "context-resolution",
    "surface-composition",
    "transition-orchestration",
    "snapshot",
    "complete",
  ]);
  assert.deepEqual([...statuses], ["resolved", "unchanged", "rejected"]);
  assert.deepEqual([...reasons], [
    "bootstrap",
    "workspace-change",
    "context-change",
    "preserved",
    "rejected-request",
  ]);
  assert.deepEqual([...capabilities], [
    "context-resolution",
    "surface-composition",
    "transition-planning",
    "dial-request-support",
    "snapshot-derivation",
  ]);
  assert.deepEqual(bootstrapDefaults, {
    workspace: "overview",
    intent: "observe",
  });
});

test("4. bootstrap resolves to overview / observe", () => {
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({
      source: "system",
      reason: "restore",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.reason, "bootstrap");
  assert.equal(result.nextExperience?.workspace, "overview");
  assert.equal(result.nextExperience?.intent, "observe");
  assert.equal(result.workspaceChanged, true);
  assert.equal(result.contextChanged, true);
  assert.equal(participation(result, "stage"), "primary");
  assert.equal(participation(result, "advisor"), "supporting");
  assert.equal(participation(result, "insight"), "contextual");
  assert.equal(participation(result, "action"), "inactive");
  assert.deepEqual(
    result.trace.stages.map((entry) => entry.stage),
    [...pipelineStages],
  );
});

test("5. problem → scenario via dial", () => {
  const current = experienceFor("problem");
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
      source: "dial",
      reason: "user-request",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.source, "dial");
  assert.equal(result.nextExperience?.workspace, "scenario");
  assert.equal(result.workspaceChanged, true);
  assert.equal(result.contextChanged, true);
  assert.equal(participation(result, "stage"), "primary");
  assert.equal(participation(result, "advisor"), "supporting");
  assert.equal(participation(result, "insight"), "supporting");
  assert.equal(participation(result, "action"), "contextual");
  assert.equal(surfaceKind(result, "stage"), "preserve");
  assert.equal(surfaceKind(result, "advisor"), "preserve");
  assert.equal(surfaceKind(result, "insight"), "preserve");
  assert.equal(surfaceKind(result, "action"), "preserve");
  assert.doesNotMatch(JSON.stringify(result.request), /angle|radius|degrees/);
});

test("6. scenario → decision promotes Action", () => {
  const current = experienceFor("scenario", "scenario-b");
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.nextExperience?.workspace, "decision");
  assert.equal(result.nextExperience?.subject?.id, "increase-capacity");
  assert.equal(result.nextExperience?.intent, "decide");
  assert.equal(surfaceKind(result, "action"), "promote");
  assert.equal(participation(result, "action"), "supporting");
});

test("7. decision → execution composition/transition", () => {
  const current = experienceFor("decision");
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "execution",
      requestedSubject: { kind: "execution" as const, id: "capacity-expansion" },
      source: "user",
      reason: "user-request",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.nextExperience?.workspace, "execution");
  assert.equal(participation(result, "advisor"), "contextual");
  assert.equal(surfaceKind(result, "advisor"), "demote");
  assert.equal(participation(result, "action"), "supporting");
});

test("8. non-linear decision → scenario and execution → decision", () => {
  const decisionToScenario = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision", "d1"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-c" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(decisionToScenario.status, "resolved");
  assert.equal(decisionToScenario.workspaceChanged, true);
  assert.equal(decisionToScenario.nextExperience?.workspace, "scenario");

  const executionToDecision = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("execution"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(executionToDecision.status, "resolved");
  assert.equal(executionToDecision.workspaceChanged, true);
  assert.equal(executionToDecision.nextExperience?.workspace, "decision");
});

test("9. same-workspace context change scenario:A → scenario:B", () => {
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
      source: "user",
      reason: "subject-selection",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, true);
  assert.equal(result.reason, "context-change");
  assert.equal(result.transition?.subject.kind, "replace");
  assert.equal(result.nextExperience?.subject?.id, "scenario-b");
});

test("10. identical context is unchanged", () => {
  const current = experienceFor("decision", "increase-capacity", "report");
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: current.subject,
      requestedIntent: "decide",
      requestedPresentation: "report",
      source: "user",
      reason: "user-request",
    }),
  });

  assert.equal(result.status, "unchanged");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, false);
  assert.equal(result.reason, "preserved");
  assert.equal(result.nextExperience, current);
  assert.ok(
    !result.trace.stages.some((entry) => entry.stage === "snapshot") ||
      result.trace.stages.every((entry) => entry.ok),
  );
});

test("11. presentation independence across workspace change", () => {
  const current = experienceFor("scenario", "scenario-a", "report");
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.nextExperience?.workspace, "decision");
  assert.equal(result.nextExperience?.presentation, "report");
  assert.notEqual(result.nextExperience?.presentation, "operation");
});

test("12. dial / advisor / action sources through same pipeline", () => {
  const current = experienceFor("decision");

  const dial = orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest({
    currentExperience: experienceFor("problem"),
    dialRequest: {
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
    },
  });
  assert.equal(dial.status, "resolved");
  assert.equal(dial.source, "dial");
  assert.equal(dial.nextExperience?.workspace, "scenario");

  const advisor = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("overview"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "advisor",
      reason: "runtime-guidance",
    }),
  });
  assert.equal(advisor.status, "resolved");
  assert.equal(advisor.source, "advisor");
  assert.equal(advisor.nextExperience?.workspace, "decision");

  const action = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: current,
    request: Object.freeze({
      requestedWorkspace: "execution",
      requestedSubject: { kind: "execution" as const, id: "capacity-expansion" },
      source: "action",
      reason: "action-result",
    }),
  });
  assert.equal(action.status, "resolved");
  assert.equal(action.source, "action");
  assert.equal(action.nextExperience?.workspace, "execution");
  assert.doesNotMatch(source, /\bexecuteAction\b|\bperformBusiness/);
});

test("13. surface completeness and snapshot consistency", () => {
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("problem"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });

  assert.ok(result.nextExperience);
  assert.ok(result.targetComposition);
  const surfaces = result.targetComposition!.surfaces.map(
    (entry) => entry.surface,
  );
  assert.deepEqual(surfaces, ["stage", "advisor", "insight", "action"]);
  assert.equal(new Set(surfaces).size, 4);
  assert.equal(
    result.nextExperience!.workspace,
    result.resolvedContext!.workspace.workspaceKind,
  );
  assert.equal(
    result.nextExperience!.composition.workspace,
    result.targetComposition!.workspace,
  );
  assert.deepEqual(
    result.nextExperience!.composition.surfaces,
    result.targetComposition!.surfaces,
  );

  const derived = deriveRuntimeExecutiveWorkspaceExperienceSnapshot({
    context: result.resolvedContext!,
    composition: result.targetComposition!,
  });
  assert.deepEqual(derived, result.nextExperience);
});

test("14. determinism, immutability, registry", () => {
  const input = Object.freeze({
    currentExperience: experienceFor("scenario", "scenario-a"),
    request: Object.freeze({
      requestedWorkspace: "decision" as const,
      requestedSubject: {
        kind: "decision" as const,
        id: "increase-capacity",
      },
      source: "user" as const,
      reason: "user-request" as const,
    }),
  });
  const first = orchestrateRuntimeExecutiveWorkspaceExperience(input);
  const second = orchestrateRuntimeExecutiveWorkspaceExperience(input);
  assert.deepEqual(first, second);

  assert.equal(registry.statusCount, statuses.length);
  assert.equal(registry.reasonCount, reasons.length);
  assert.equal(registry.pipelineStageCount, pipelineStages.length);
  assert.equal(registry.upstreamCapabilityCount, capabilities.length);
  assert.equal(registry.invariantCount, 34);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(invariants.length, 34);
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceOrchestrationRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceOrchestrationGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceOrchestrationInvariants(),
    invariants,
  );

  assert.equal(Object.isFrozen(pipelineStages), true);
  assert.equal(Object.isFrozen(statuses), true);
  assert.equal(Object.isFrozen(reasons), true);
  assert.equal(Object.isFrozen(orchestration), true);
  assert.throws(() => {
    (pipelineStages as unknown as string[]).push("animating");
  });
  assert.throws(() => {
    (statuses as unknown as string[]).push("rendering");
  });
});

test("15. architectural boundary and verification", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(
    source,
    /\bCadillac(?:Workspace|Dial)\b|\bPorsche(?:Workspace|Dial)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:angle|degrees|radius|rotation|detent)\s*[:=]/,
  );
  assert.doesNotMatch(source, /\b250ms\b|\b300ms\b|\bease-in\b|\bspring\b/);
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(|setTimeout\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspace(?:ExperienceFoundation|ExperienceContracts|ContextModeResolution|SurfaceComposition)["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*(?:Platform|CertificationFreeze|PublicIndex)\b/,
  );

  assert.equal(boundary.duplicatesContextPolicy, false);
  assert.equal(boundary.duplicatesCompositionPolicy, false);
  assert.equal(boundary.duplicatesTransitionPolicy, false);
  assert.equal(boundary.introducesUi, false);
  assert.equal(boundary.cockpitLayoutIndependent, true);
  assert.equal(orchestration.dialGeometryIndependent, true);

  const first = verifyRuntimeExecutiveWorkspaceExperienceOrchestration();
  const second = verifyRuntimeExecutiveWorkspaceExperienceOrchestration();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamTransitionOk, true);
  assert.equal(first.pipelineOrderExact, true);
  assert.equal(first.bootstrapDefaultsExact, true);
  assert.equal(first.invariantCount, 34);
  assert.equal(
    orchestration.architecturalStatus,
    "REX-6:6 Runtime Executive Workspace Experience Orchestration — ExperienceOrchestrationReady",
  );
});
