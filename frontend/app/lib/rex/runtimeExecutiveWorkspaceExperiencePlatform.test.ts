import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as approvedExports,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS as functionalApis,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES as publicTypes,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS as sections,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS as validationApis,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities,
  getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees,
  getRuntimeExecutiveWorkspaceExperiencePlatformIdentity,
  getRuntimeExecutiveWorkspaceExperiencePlatformRegistry,
  getRuntimeExecutiveWorkspaceExperiencePlatformSummary,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  runtimeExecutiveWorkspaceExperiencePlatform as platform,
  runtimeExecutiveWorkspaceExperiencePlatformCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperiencePlatformRegistry as registry,
  verifyRuntimeExecutiveWorkspaceExperiencePlatform,
  verifyRuntimeExecutiveWorkspaceExperiencePlatformRegistry,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
} from "./runtimeExecutiveWorkspaceExperiencePlatform.ts";

import {
  runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
  runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceOrchestration";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperiencePlatform.ts",
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
      workspaceId: `workspace.platform.${kind}`,
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

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    platform.identity,
    "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform",
  );
  assert.equal(platform.version, "6.7.0");
  assert.equal(
    platform.namespace,
    "nexora.rex.workspace-experience.platform",
  );
  assert.equal(platform.phase, "Platform");
  assert.equal(
    platform.architecturalRole,
    "RuntimeExecutiveWorkspaceExperiencePlatform",
  );
  assert.equal(platform.status, "Assembled");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.isCertified, false);
  assert.equal(platform.isFrozen, false);
  assert.equal(platform.readyForCertification, true);
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperiencePlatformIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:6 orchestration", () => {
  assert.equal(
    platform.upstreamDependency,
    "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration",
  );
  assert.equal(
    platform.upstreamDependency,
    runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
  );
  assert.equal(
    platform.dependencyPath,
    runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
  );
  assert.equal(boundary.consumesOrchestrationOnly, true);
  assert.equal(boundary.importsRex65Directly, false);
  assert.equal(boundary.importsRex64Directly, false);
  assert.equal(boundary.importsRex63Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceOrchestration",
  ]);
  assert.equal(
    verifyRuntimeExecutiveWorkspaceExperienceOrchestration().ok,
    true,
  );
});

test("3. canonical vocabularies", () => {
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
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES], [
    "prepare",
    "leave",
    "enter",
    "settle",
  ]);
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES], [
    "user",
    "dial",
    "advisor",
    "action",
    "runtime",
    "system",
  ]);
  assert.deepEqual(
    [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES],
    ["resolved", "unchanged", "rejected"],
  );
  assert.deepEqual([...RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.ok(
    !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[])
      .includes("dial"),
  );
});

test("4. capabilities, exports, sections, guarantees", () => {
  assert.deepEqual([...capabilities], [
    "workspace-foundation",
    "workspace-contracts",
    "context-resolution",
    "surface-composition",
    "transition-orchestration",
    "dial-request-normalization",
    "experience-orchestration",
    "snapshot-derivation",
    "validation",
    "registry-inspection",
  ]);
  assert.equal(new Set(capabilities).size, capabilities.length);
  assert.equal(new Set(approvedExports).size, approvedExports.length);
  assert.equal(new Set(guarantees).size, guarantees.length);
  assert.deepEqual([...sections], [
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Resolution",
    "Composition",
    "Transition",
    "Orchestration",
    "Validation",
    "Registry",
    "Guarantees",
  ]);
  assert.deepEqual([...guarantees], [
    "determinism",
    "immutability",
    "serialization",
    "workspace-canonicality",
    "non-linear-navigation",
    "presentation-independence",
    "surface-completeness",
    "single-primary-surface",
    "stage-primary",
    "transition-determinism",
    "same-workspace-context-change",
    "dial-semantic-independence",
    "renderer-independence",
    "framework-independence",
    "business-action-independence",
  ]);
  assert.ok(
    !approvedExports.some((name) => String(name) === "AnimatableObject"),
  );
  assert.ok(!approvedExports.some((name) => String(name) === "useState"));
  assert.ok(!approvedExports.some((name) => String(name) === "Mesh"));
});

test("5. resolution / composition / transition / dial / orchestration exposure", () => {
  assert.equal(typeof resolveRuntimeExecutiveWorkspaceContext, "function");
  assert.equal(typeof resolveRuntimeExecutiveWorkspaceMode, "function");
  assert.equal(
    typeof resolveRuntimeExecutiveWorkspaceSurfaceComposition,
    "function",
  );
  assert.equal(typeof planRuntimeExecutiveWorkspaceTransition, "function");
  assert.equal(
    typeof resolveRuntimeExecutiveWorkspaceSurfaceTransition,
    "function",
  );
  assert.equal(
    typeof normalizeRuntimeExecutiveWorkspaceDialRequest,
    "function",
  );
  assert.equal(
    typeof orchestrateRuntimeExecutiveWorkspaceExperience,
    "function",
  );

  const dial = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
  });
  assert.equal(dial.source, "dial");
  assert.equal(dial.requestedWorkspaceKind, "decision");
  assert.equal("angle" in dial, false);
  assert.equal("radius" in dial, false);

  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "contextual",
      to: "supporting",
    }),
    "promote",
  );
});

test("6. bootstrap via platform orchestration surface", () => {
  const result = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({
      source: "system",
      reason: "restore",
    }),
  });
  assert.equal(result.status, "resolved");
  assert.equal(result.nextExperience?.workspace, "overview");
  assert.equal(result.nextExperience?.intent, "observe");
});

test("7. problem → scenario and non-linear decision → scenario", () => {
  const forward = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("problem"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
      source: "dial",
      reason: "user-request",
    }),
  });
  assert.equal(forward.status, "resolved");
  assert.equal(forward.workspaceChanged, true);
  assert.equal(forward.nextExperience?.workspace, "scenario");

  const backward = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision", "d1"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-c" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(backward.status, "resolved");
  assert.equal(backward.workspaceChanged, true);
  assert.equal(backward.nextExperience?.workspace, "scenario");
});

test("8. same-workspace context change and presentation independence", () => {
  const sameWorkspace = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
      source: "user",
      reason: "subject-selection",
    }),
  });
  assert.equal(sameWorkspace.status, "resolved");
  assert.equal(sameWorkspace.workspaceChanged, false);
  assert.equal(sameWorkspace.contextChanged, true);

  const presentation = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a", "report"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
      source: "user",
      reason: "user-request",
    }),
  });
  assert.equal(presentation.nextExperience?.workspace, "decision");
  assert.equal(presentation.nextExperience?.presentation, "report");
});

test("9. registry, summary, and derived counts", () => {
  assert.equal(registry.sectionCount, sections.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.approvedExportCount, approvedExports.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.functionalApiCount, functionalApis.length);
  assert.equal(registry.validationApiCount, validationApis.length);
  assert.equal(registry.workspaceCount, 5);
  assert.equal(registry.surfaceCount, 4);
  assert.equal(registry.transitionPhaseCount, 4);
  assert.equal(registry.transitionSourceCount, 6);
  assert.equal(registry.orchestrationStatusCount, 3);
  assert.equal(registry.invariantCount, 35);
  assert.equal(
    getRuntimeExecutiveWorkspaceExperiencePlatformRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities(),
    capabilities,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees(),
    guarantees,
  );

  const summary = getRuntimeExecutiveWorkspaceExperiencePlatformSummary();
  assert.equal(summary.identity, platform.identity);
  assert.equal(summary.capabilityCount, capabilities.length);
  assert.equal(summary.readyForCertification, true);
  assert.equal(summary.isCertified, false);
  assert.equal(summary.isFrozen, false);
});

test("10. verification API and malformed registry detection", () => {
  const first = verifyRuntimeExecutiveWorkspaceExperiencePlatform();
  const second = verifyRuntimeExecutiveWorkspaceExperiencePlatform();
  assert.deepEqual(first, second);
  assert.equal(first.valid, true);
  assert.equal(first.status, "valid");
  assert.equal(first.failedCount, 0);
  assert.equal(first.readyForCertification, true);
  assert.equal(first.isCertified, false);
  assert.equal(first.isFrozen, false);
  assert.equal(first.upstreamOrchestrationOk, true);

  const duplicateIdentitySections = Object.freeze(
    sections.map((section, index) => (index === 1 ? sections[0] : section)),
  );
  const broken = verifyRuntimeExecutiveWorkspaceExperiencePlatformRegistry({
    ...registry,
    sections: duplicateIdentitySections as typeof sections,
  });
  assert.equal(broken.valid, false);
  assert.equal(broken.status, "invalid");
  assert.ok(broken.failedChecks.includes("sections-unique"));
  assert.equal(registry.sections.length, sections.length);
});

test("11. mutation safety and determinism", () => {
  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(Object.isFrozen(approvedExports), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(sections), true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS), true);
  assert.equal(
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES),
    true,
  );
  assert.throws(() => {
    (capabilities as unknown as string[]).push("ui-rendering");
  });
  assert.throws(() => {
    (approvedExports as unknown as string[]).push("secretHelper");
  });
  assert.throws(() => {
    (sections as unknown as string[]).push("Geometry");
  });

  const a = getRuntimeExecutiveWorkspaceExperiencePlatformSummary();
  const b = getRuntimeExecutiveWorkspaceExperiencePlatformSummary();
  assert.deepEqual(a, b);
});

test("12. architectural boundary and forbidden dependencies", () => {
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
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspace(?:ExperienceFoundation|ExperienceContracts|ContextModeResolution|SurfaceComposition|TransitionDialOrchestration)["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*(?:CertificationFreeze|PublicIndex)\b/,
  );

  assert.equal(boundary.introducesNewWorkspaceSemantics, false);
  assert.equal(boundary.introducesNewResolutionPolicy, false);
  assert.equal(boundary.introducesNewCompositionPolicy, false);
  assert.equal(boundary.introducesNewTransitionPolicy, false);
  assert.equal(boundary.duplicatesOrchestrationPolicy, false);
  assert.equal(boundary.cockpitLayoutIndependent, true);
  assert.equal(boundary.dialGeometryIndependent, true);
  assert.equal(boundary.isCertified, false);
  assert.equal(boundary.isFrozen, false);
  assert.equal(boundary.readyForCertification, true);
  assert.equal(platform.primarySurface, "stage");
  assert.equal(platform.dialIsNotSurface, true);
});
