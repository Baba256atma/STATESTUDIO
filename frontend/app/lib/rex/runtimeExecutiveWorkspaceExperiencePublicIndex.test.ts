import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED as platformLock,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES as consumerGuarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_CERTIFICATION_APIS as certificationApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS as compositionApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS as dialApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS as sections,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS as orchestrationApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS as resolutionApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS as snapshotApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS as transitionApis,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_VALIDATION_APIS as validationApis,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveWorkspaceExperienceConsumerInformation,
  getRuntimeExecutiveWorkspaceExperiencePublicIndexIdentity,
  getRuntimeExecutiveWorkspaceExperiencePublicIndexRegistry,
  getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  runtimeExecutiveWorkspaceExperienceConsumerInformation as consumerInfo,
  runtimeExecutiveWorkspaceExperiencePublicIndex as publicIndex,
  runtimeExecutiveWorkspaceExperiencePublicIndexCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperiencePublicIndexRegistry as registry,
  verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze,
  verifyRuntimeExecutiveWorkspaceExperienceCompatibility,
  verifyRuntimeExecutiveWorkspaceExperiencePublicIndex,
} from "./runtimeExecutiveWorkspaceExperiencePublicIndex.ts";

import {
  runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceCertificationFreeze";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperiencePublicIndex.ts",
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
      workspaceId: `workspace.public.${kind}`,
      workspaceKind: kind,
    },
    subject,
    focus: { primarySubject: subject, relatedSubjects: [] },
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

test("1. exact identity / version / namespace / phase / consumer role", () => {
  assert.equal(
    publicIndex.identity,
    "REX-6:9/RuntimeExecutiveWorkspaceExperiencePublicIndex",
  );
  assert.equal(publicIndex.version, "6.9.0");
  assert.equal(
    publicIndex.namespace,
    "nexora.rex.workspace-experience.public-index",
  );
  assert.equal(publicIndex.phase, "PublicIndex");
  assert.equal(
    publicIndex.architecturalRole,
    "RuntimeExecutiveWorkspaceExperiencePublicIndex",
  );
  assert.equal(publicIndex.consumerRole, "SoleConsumerEntryPoint");
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperiencePublicIndexIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:8 certification freeze", () => {
  assert.equal(
    publicIndex.upstreamDependency,
    "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze",
  );
  assert.equal(
    publicIndex.upstreamDependency,
    runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  );
  assert.equal(
    publicIndex.dependencyPath,
    runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
  );

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceCertificationFreeze",
  ]);
});

test("3. consumer import path and release states", () => {
  assert.equal(
    publicIndex.supportedImportPath,
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePublicIndex",
  );
  assert.equal(publicIndex.status, "Released");
  assert.equal(consumerInfo.releaseStatus, "Released");
  assert.equal(consumerInfo.certificationStatus, "Certified");
  assert.equal(consumerInfo.compatibilityStatus, "Compatible");
  assert.equal(consumerInfo.freezeStatus, "Frozen");
  assert.equal(consumerInfo.lockStatus, "Locked");
  assert.equal(consumerInfo.stability, "Stable");
  assert.equal(consumerInfo.readiness, "ReadyForConsumer");
  assert.equal(
    platformLock,
    "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED",
  );
  assert.equal(consumerInfo.platformLock, platformLock);
  assert.equal(publicIndex.rex6Complete, true);
});

test("4. workspace / surface / participation exposure", () => {
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
    "stage",
    "advisor",
    "insight",
    "action",
  ]);
  assert.deepEqual(
    [...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS],
    ["primary", "supporting", "contextual", "inactive"],
  );
  assert.ok(
    !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[])
      .includes("dial"),
  );
  assert.equal(publicIndex.primarySurface, "stage");
  assert.equal(publicIndex.dialIsNotWorkspace, true);
  assert.equal(publicIndex.dialIsNotSurface, true);
  assert.equal(publicIndex.dialGeometryPublished, false);
});

test("5. resolution / composition / transition / dial / orchestration APIs", () => {
  assert.equal(resolutionApis.length, 9);
  assert.equal(compositionApis.length, 3);
  assert.equal(transitionApis.length, 3);
  assert.equal(dialApis.length, 2);
  assert.equal(orchestrationApis.length, 2);
  assert.equal(snapshotApis.length, 3);
  assert.equal(typeof resolveRuntimeExecutiveWorkspaceContext, "function");
  assert.equal(
    typeof resolveRuntimeExecutiveWorkspaceSurfaceComposition,
    "function",
  );
  assert.equal(
    typeof orchestrateRuntimeExecutiveWorkspaceExperience,
    "function",
  );

  const decision = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("overview"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision", id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(decision.status, "resolved");
  assert.deepEqual(
    Object.fromEntries(
      decision.targetComposition!.surfaces.map((entry) => [
        entry.surface,
        entry.participation,
      ]),
    ),
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision,
  );

  const dial = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
  });
  assert.equal(dial.source, "dial");
  assert.equal("angle" in dial, false);
  assert.equal("radius" in dial, false);
});

test("6. consumer-level orchestration scenarios via Public Index only", () => {
  const bootstrap = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });
  assert.equal(bootstrap.nextExperience?.workspace, "overview");
  assert.equal(bootstrap.nextExperience?.intent, "observe");

  const problemToScenario = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("problem"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario", id: "scenario-b" },
      source: "dial",
      reason: "user-request",
    }),
  });
  assert.equal(problemToScenario.status, "resolved");
  assert.equal(problemToScenario.source, "dial");

  const scenarioToDecision = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-b"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision", id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(scenarioToDecision.status, "resolved");
  assert.equal(
    scenarioToDecision.transition?.surfaces.find(
      (entry) => entry.surface === "action",
    )?.kind,
    "promote",
  );

  const decisionToExecution = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision"),
    request: Object.freeze({
      requestedWorkspace: "execution",
      requestedSubject: { kind: "execution", id: "capacity-expansion" },
      source: "action",
      reason: "action-result",
    }),
  });
  assert.equal(decisionToExecution.status, "resolved");

  const decisionToScenario = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision", "d1"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario", id: "scenario-c" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(decisionToScenario.status, "resolved");
  assert.equal(decisionToScenario.workspaceChanged, true);

  const sameWorkspace = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario", id: "scenario-b" },
      source: "user",
      reason: "subject-selection",
    }),
  });
  assert.equal(sameWorkspace.workspaceChanged, false);
  assert.equal(sameWorkspace.contextChanged, true);
});

test("7. presentation independence via Public Index", () => {
  for (const presentation of ["minimum", "report", "operation"] as const) {
    const result = orchestrateRuntimeExecutiveWorkspaceExperience({
      currentExperience: experienceFor("overview", undefined, presentation),
      request: Object.freeze({
        requestedWorkspace: "decision",
        requestedSubject: { kind: "decision", id: "increase-capacity" },
        requestedPresentation: presentation,
        source: "user",
        reason: "user-request",
      }),
    });
    assert.equal(result.nextExperience?.workspace, "decision");
    assert.equal(result.nextExperience?.presentation, presentation);
  }
});

test("8. certification / compatibility exposure and registry", () => {
  const certificationIdentity =
    getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity();
  assert.equal(
    certificationIdentity.identity,
    "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze",
  );
  assert.equal(
    verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze().ok,
    true,
  );
  assert.equal(
    verifyRuntimeExecutiveWorkspaceExperienceCompatibility().status,
    "compatible",
  );

  assert.deepEqual([...sections], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ]);
  assert.equal(registry.sectionCount, sections.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(registry.certificationApiCount, certificationApis.length);
  assert.equal(registry.consumerGuaranteeCount, consumerGuarantees.length);
  assert.equal(registry.workspaceCount, 5);
  assert.equal(registry.surfaceCount, 4);
  assert.equal(consumerGuarantees.length, 22);
  assert.equal(new Set(consumerGuarantees).size, 22);
  assert.equal(
    getRuntimeExecutiveWorkspaceExperiencePublicIndexRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceConsumerInformation(),
    consumerInfo,
  );

  const summary = getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary();
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.readiness, "ReadyForConsumer");
  assert.equal(summary.rex6Complete, true);
});

test("9. mutation safety, determinism, verification", () => {
  assert.equal(Object.isFrozen(publicIndex), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(sections), true);
  assert.equal(Object.isFrozen(consumerGuarantees), true);
  assert.equal(Object.isFrozen(consumerInfo), true);
  assert.throws(() => {
    (sections as unknown as string[]).push("Geometry");
  });
  assert.throws(() => {
    (consumerGuarantees as unknown as string[]).push("ui");
  });

  const first = verifyRuntimeExecutiveWorkspaceExperiencePublicIndex();
  const second = verifyRuntimeExecutiveWorkspaceExperiencePublicIndex();
  assert.deepEqual(first, second);
  assert.equal(first.valid, true);
  assert.equal(first.readyForConsumer, true);
  assert.equal(first.rex6Complete, true);
  assert.equal(first.failedCheckCount, 0);

  const a = getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary();
  const b = getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary();
  assert.deepEqual(a, b);

  const o1 = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });
  const o2 = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });
  assert.deepEqual(o1, o2);
});

test("10. architectural boundary and forbidden dependencies", () => {
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
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(|setTimeout\s*\(/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspace(?:ExperienceFoundation|ExperienceContracts|ContextModeResolution|SurfaceComposition|TransitionDialOrchestration|ExperienceOrchestration|ExperiencePlatform)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*REX-7[^"']*["']|identity:\s*["']REX-7\//,
  );
  assert.equal(
    RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY.introducesRex7,
    false,
  );
  assert.equal(
    RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY.rex6Complete,
    true,
  );

  assert.equal(publicIndex.cockpitLayoutFrozen, false);
  assert.equal(publicIndex.automotiveStylingFrozen, false);
  assert.equal(
    publicIndex.architecturalStatus,
    "REX-6:9 Runtime Executive Workspace Experience Public Index — Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer — REX-6 COMPLETE",
  );
});
