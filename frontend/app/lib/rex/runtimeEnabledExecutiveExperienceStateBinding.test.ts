import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER as surfaceOrder,
  EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_RUNTIME_BINDING_STATUSES as statuses,
  EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY as boundary,
  EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS as registrySections,
  bindExecutiveRuntimeActiveSubject,
  bindExecutiveRuntimeActiveSurface,
  bindExecutiveRuntimeAttention,
  bindExecutiveRuntimeAuthority,
  bindExecutiveRuntimeContext,
  bindExecutiveRuntimeExperienceState,
  bindExecutiveRuntimeFocus,
  bindExecutiveRuntimeInteractionContext,
  bindExecutiveRuntimePresentation,
  bindExecutiveRuntimeReadiness,
  bindExecutiveRuntimeSurfaceStates,
  createExecutiveRuntimeBoundSnapshot,
  getRuntimeEnabledExecutiveExperienceStateBindingIdentity,
  runtimeEnabledExecutiveExperienceStateBinding as binding,
  runtimeEnabledExecutiveExperienceStateBindingCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceStateBindingRegistry as registry,
  validateBoundExecutiveRuntimeContext,
  validateBoundExecutiveRuntimeExperienceState,
  validateExecutiveRuntimeStateBindingInput,
  verifyRuntimeContextStateBinding,
} from "./runtimeEnabledExecutiveExperienceStateBinding.ts";

import {
  createExecutiveRuntimeAttentionContract,
  createExecutiveRuntimeAuthorityContract,
  createExecutiveRuntimeExperienceContract,
  createExecutiveRuntimeFocusContract,
  createExecutiveRuntimeInteractionContext,
  createExecutiveRuntimePresentationContract,
  createExecutiveRuntimeReadinessContract,
  createExecutiveRuntimeSubjectReference,
  createExecutiveRuntimeSurfaceContract,
  createExecutiveRuntimeSurfaceReference,
  runtimeEnabledExecutiveExperienceContractsIdentity,
  verifyExecutiveRuntimeContracts,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts";

import {
  RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  createRuntimeExecutiveExperienceContext,
  createRuntimeExecutiveExperienceSnapshot,
  createRuntimeExecutiveSurfaceState,
  verifyRuntimeEnabledExecutiveExperienceFoundation,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperienceStateBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const runtimeSource = RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;

function subject(id = "goal-1") {
  return createExecutiveRuntimeSubjectReference({
    kind: "goal",
    id,
    label: "Grow capacity",
    parentId: "pack-1",
  });
}

function surfaceRef(
  surface: "stage" | "advisor" | "insight" | "timeline" | "explorer" | "experience" = "stage",
) {
  return createExecutiveRuntimeSurfaceReference({
    surface,
    surfaceId: `surface.${surface}.primary`,
    runtimeState: "ready",
    activationState: "eligible",
  });
}

function readiness(overrides?: Partial<ReturnType<typeof createExecutiveRuntimeReadinessContract>>) {
  return createExecutiveRuntimeReadinessContract({
    runtimeAvailable: true,
    contextAvailable: true,
    surfaceReady: true,
    subjectReady: true,
    presentationReady: true,
    interactionReady: true,
    overallReady: true,
    ...overrides,
  });
}

function experienceContract(options?: {
  readonly includeFocus?: boolean;
  readonly includeAttention?: boolean;
  readonly includePresentation?: boolean;
  readonly includeInteraction?: boolean;
  readonly includeActiveSubject?: boolean;
  readonly includeActiveSurface?: boolean;
  readonly surfaces?: ReadonlyArray<"stage" | "advisor" | "insight" | "explorer" | "timeline">;
  readonly runtimeState?: "unavailable" | "available" | "ready" | "active";
  readonly overallReady?: boolean;
}) {
  const activeSubject =
    options?.includeActiveSubject === false ? undefined : subject();
  const activeSurface =
    options?.includeActiveSurface === false ? undefined : surfaceRef("stage");
  const focus =
    options?.includeFocus === false
      ? undefined
      : createExecutiveRuntimeFocusContract({
          focusedSubject: subject(),
          relationship: "primary",
          runtimeSource,
        });
  const attention =
    options?.includeAttention === false
      ? undefined
      : createExecutiveRuntimeAttentionContract({
          subject: subject(),
          level: "primary",
          runtimeSource,
        });
  const presentation =
    options?.includePresentation === false
      ? undefined
      : createExecutiveRuntimePresentationContract({
          subject: subject(),
          targetSurface: "stage",
          presentationState: "report",
          visibility: "visible",
          runtimeSource,
        });
  const interaction =
    options?.includeInteraction === false
      ? undefined
      : createExecutiveRuntimeInteractionContext({
          interactionId: "ix.select.goal-1",
          sourceSurface: "stage",
          targetSubject: subject(),
          interactionKind: "select",
          snapshotId: "snap.bind.1",
          runtimeSource,
        });

  const surfaceNames = options?.surfaces ?? ["explorer", "stage", "advisor"];
  const surfaceContracts = surfaceNames.map((name) =>
    createExecutiveRuntimeSurfaceContract({
      surface: surfaceRef(name),
      currentSubject: activeSubject,
      focus,
      attention,
      presentation:
        name === "stage"
          ? presentation
          : presentation
            ? createExecutiveRuntimePresentationContract({
                ...presentation,
                targetSurface: name,
              })
            : undefined,
      activation: "eligible",
      readiness: options?.runtimeState ?? "ready",
      interactionContext: name === "stage" ? interaction : undefined,
    }),
  );

  const context = createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.binding",
    runtimeState: options?.runtimeState ?? "ready",
    activationState: "eligible",
    activeSurface: activeSurface?.surface,
    activeSubjectKind: activeSubject?.kind,
    activeSubjectId: activeSubject?.id,
    presentationState: presentation?.presentationState,
    runtimeContextAvailable: options?.runtimeState !== "unavailable",
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });

  const snapshot = createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.bind.1",
    context,
    surfaceStates: surfaceNames.map((name) =>
      createRuntimeExecutiveSurfaceState({
        surface: name,
        availability: options?.runtimeState ?? "ready",
        activation: "eligible",
        subjectKind: activeSubject?.kind,
        subjectId: activeSubject?.id,
        presentationState: presentation?.presentationState,
      }),
    ),
    currentSubjectKind: activeSubject?.kind,
    currentSubjectId: activeSubject?.id,
    runtimeReadiness: options?.runtimeState ?? "ready",
    upstreamIntegrationIdentity: runtimeSource.authorityIdentity,
    upstreamIntegrationVersion: "1.9.0",
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });

  return createExecutiveRuntimeExperienceContract({
    experienceContext: context,
    currentSnapshot: snapshot,
    activeSubject,
    activeSurface,
    surfaceContracts,
    focus,
    attention,
    presentation,
    readiness: readiness({
      overallReady: options?.overallReady ?? true,
      runtimeAvailable: options?.runtimeState !== "unavailable",
    }),
    authority: createExecutiveRuntimeAuthorityContract(),
    contractIdentity: "REX-1:2/ExecutiveRuntimeContracts",
    contractVersion: "1.2.0",
  });
}

test("1. exact REX-1:3 identity", () => {
  assert.equal(binding.identity, "REX-1:3/RuntimeContextStateBinding");
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "REX-1");
  assert.equal(binding.stage, "RuntimeContextStateBinding");
  assert.equal(binding.layer, "REX");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceStateBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.3.0", () => {
  assert.equal(binding.version, "1.3.0");
  assert.equal(registry.version, "1.3.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.rex.runtime-enabled-executive-experience.state-binding",
  );
});

test("4. sole immediate dependency is REX-1:2 contracts", () => {
  assert.equal(
    binding.upstreamDependency,
    "REX-1:2/ExecutiveRuntimeContracts",
  );
  assert.equal(
    binding.upstreamDependency,
    runtimeEnabledExecutiveExperienceContractsIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts",
  );
  assert.equal(boundary.consumesContractsOnly, true);

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts",
  ]);
});

test("5. forbidden direct imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperienceFoundation["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|three|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.equal(boundary.importsFoundationDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
});

test("6. deterministic context binding", () => {
  const input = { experienceContract: experienceContract() };
  const first = bindExecutiveRuntimeContext(input);
  const second = bindExecutiveRuntimeContext(input);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.experienceId, "rex.exp.binding");
  assert.equal(validateBoundExecutiveRuntimeContext(first), true);
});

test("7. subject binding preserves identity and never invents ids", () => {
  const bound = bindExecutiveRuntimeActiveSubject(subject("goal-9"));
  assert.equal(bound?.id, "goal-9");
  assert.equal(bound?.kind, "goal");
  assert.equal(bound?.parentId, "pack-1");
  assert.equal(bindExecutiveRuntimeActiveSubject(undefined), undefined);
  assert.equal(boundary.inventsSubjectIds, false);
});

test("8. surface binding preserves runtime/activation and never infers", () => {
  const bound = bindExecutiveRuntimeActiveSurface(surfaceRef("advisor"));
  assert.equal(bound?.surface, "advisor");
  assert.equal(bound?.runtimeState, "ready");
  assert.equal(bound?.activationState, "eligible");
  assert.equal(bindExecutiveRuntimeActiveSurface(undefined), undefined);
  assert.equal(boundary.infersSurfaceActivation, false);
});

test("9. surface ordering is canonical and sparse", () => {
  assert.deepEqual([...surfaceOrder], [
    "experience",
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
  ]);
  const contract = experienceContract({
    surfaces: ["explorer", "insight", "stage"],
  });
  const bound = bindExecutiveRuntimeSurfaceStates(contract.surfaceContracts);
  assert.deepEqual(
    bound.map((entry) => entry.surface),
    ["stage", "insight", "explorer"],
  );
  assert.equal(
    bound.some((entry) => entry.surface === "timeline"),
    false,
  );
  assert.equal(registry.sparseSurfaceBinding, true);
  assert.match(source, /Sparse binding rule/);
});

test("10. focus / attention / presentation preservation", () => {
  const focus = bindExecutiveRuntimeFocus(
    createExecutiveRuntimeFocusContract({
      focusedSubject: subject(),
      relationship: "secondary",
      reason: "upstream",
      runtimeSource,
    }),
  );
  assert.equal(focus?.relationship, "secondary");
  assert.equal(focus?.reason, "upstream");
  assert.equal(boundary.calculatesFocus, false);

  const attention = bindExecutiveRuntimeAttention(
    createExecutiveRuntimeAttentionContract({
      subject: subject(),
      level: "context",
      persistence: "session",
      runtimeSource,
    }),
  );
  assert.equal(attention?.level, "context");
  assert.equal(boundary.calculatesAttention, false);

  const presentation = bindExecutiveRuntimePresentation(
    createExecutiveRuntimePresentationContract({
      subject: subject(),
      targetSurface: "insight",
      presentationState: "operation",
      emphasis: "high",
      runtimeSource,
    }),
  );
  assert.equal(presentation?.presentationState, "operation");
  assert.equal(boundary.resolvesPresentation, false);
});

test("11. readiness and runtime authority preservation", () => {
  const ready = bindExecutiveRuntimeReadiness(
    readiness({ overallReady: false, interactionReady: false }),
  );
  assert.equal(ready?.overallReady, false);
  assert.equal(boundary.fabricatesReadiness, false);

  const authority = bindExecutiveRuntimeAuthority(
    createExecutiveRuntimeAuthorityContract(),
  );
  assert.equal(authority?.relationship, "EX-DRI → REX");
  assert.equal(authority?.sourceLayer, "EX-DRI");
  assert.equal(authority?.consumedByLayer, "REX");
  assert.equal(boundary.rewritesRuntimeAuthority, false);
});

test("12. interaction-context preservation without execution", () => {
  const interaction = bindExecutiveRuntimeInteractionContext(
    createExecutiveRuntimeInteractionContext({
      interactionId: "ix.1",
      sourceSurface: "stage",
      targetSubject: subject(),
      interactionKind: "select",
      contextId: "ctx.1",
      runtimeSource,
    }),
  );
  assert.equal(interaction?.interactionId, "ix.1");
  assert.equal(interaction?.interactionKind, "select");
  assert.equal(boundary.executesInteraction, false);
});

test("13. complete binding", () => {
  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experienceContract(),
  });
  assert.equal(result.status, "bound");
  assert.ok(result.boundState);
  assert.equal(
    validateBoundExecutiveRuntimeExperienceState(result.boundState),
    true,
  );
  assert.equal(result.boundState?.activeSubject?.id, "goal-1");
  assert.equal(result.boundState?.presentation?.presentationState, "report");
  assert.equal(result.boundState?.authority.relationship, "EX-DRI → REX");
});

test("14. partial binding for missing optional relationships", () => {
  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experienceContract({
      includeFocus: false,
      includeAttention: false,
      includePresentation: false,
      includeInteraction: false,
      includeActiveSubject: false,
      overallReady: false,
    }),
  });
  assert.equal(result.status, "partial");
  assert.ok(result.boundState);
  assert.equal(result.boundState?.focus, undefined);
  assert.equal(result.boundState?.activeSubject, undefined);
  assert.ok(
    result.issues.some((entry) => entry.code === "presentation-unavailable"),
  );
});

test("15. unavailable binding when runtime unavailable", () => {
  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experienceContract({
      runtimeState: "unavailable",
    }),
  });
  assert.equal(result.status, "unavailable");
  assert.ok(result.boundState);
  assert.equal(result.boundState?.context.runtimeState, "unavailable");
});

test("16. invalid binding for structurally bad active surface", () => {
  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experienceContract(),
    activeSurface: {
      surface: "dashboard" as never,
      surfaceId: "bad",
      runtimeState: "ready",
      activationState: "eligible",
    },
  });
  assert.equal(result.status, "invalid");
  assert.equal(result.boundState, undefined);
  assert.ok(
    result.issues.some((entry) => entry.code === "invalid-active-surface"),
  );
});

test("17. missing subject / surface handled without throw", () => {
  assert.doesNotThrow(() => {
    const result = bindExecutiveRuntimeExperienceState({
      experienceContract: experienceContract({
        includeActiveSubject: false,
        includeActiveSurface: false,
        overallReady: false,
      }),
    });
    assert.equal(result.boundState?.activeSubject, undefined);
    assert.equal(result.boundState?.activeSurface, undefined);
  });
});

test("18. snapshot creation is pure and clock-free", () => {
  const result = bindExecutiveRuntimeExperienceState({
    experienceContract: experienceContract(),
  });
  assert.ok(result.boundState);
  const snapshot = createExecutiveRuntimeBoundSnapshot({
    snapshotId: "snap.bound.1",
    boundState: result.boundState!,
    timestampIso: "2026-08-08T00:00:00.000Z",
  });
  assert.equal(snapshot.snapshotId, "snap.bound.1");
  assert.equal(snapshot.sourceVersion, "1.9.0");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|crypto\.randomUUID\(/);
});

test("19. deterministic repeated execution and no input mutation", () => {
  const experience = experienceContract();
  const mutableInput = {
    experienceContract: experience,
    activeSubject: { kind: "goal" as const, id: "goal-1", label: "A" },
  };
  const snap = JSON.stringify(mutableInput);
  const first = bindExecutiveRuntimeExperienceState(mutableInput);
  const second = bindExecutiveRuntimeExperienceState(mutableInput);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(mutableInput), snap);
  mutableInput.activeSubject.label = "mutated";
  assert.equal(mutableInput.activeSubject.label, "mutated");
});

test("20. immutable registry / guarantees / validation helpers", () => {
  assert.equal(guarantees.length, 25);
  assert.equal(statuses.length, 4);
  assert.equal(issueCodes.length, 13);
  assert.equal(registrySections.length, 17);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.throws(() => {
    (surfaceOrder as unknown as string[]).push("dashboard");
  });

  const issues = validateExecutiveRuntimeStateBindingInput({});
  assert.ok(
    issues.some((entry) => entry.code === "missing-runtime-authority"),
  );

  const verified = verifyRuntimeContextStateBinding();
  assert.equal(verified.ok, true);
  assert.deepEqual(verified, verifyRuntimeContextStateBinding());
  assert.equal(verified.guaranteeCount, 25);
  assert.equal(verified.sparseSurfaceBinding, true);
  assert.equal(
    binding.architecturalStatus,
    "Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExecutiveSceneBinding",
  );
});

test("21. no React / Three.js / AI / persistence / network dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|@react-three(?:\/[^"']*)?|zustand|openai|anthropic)["']/i,
  );
  assert.doesNotMatch(
    source,
    /import\s+.*\b(?:React|useState|THREE|WebGLRenderer)\b/,
  );
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /\b(?:localStorage|sessionStorage|XMLHttpRequest|createStore|EventEmitter)\b/,
  );
});

test("22. REX-1:2 and REX-1:1 regression remain intact", () => {
  const contracts = verifyExecutiveRuntimeContracts();
  assert.equal(contracts.ok, true);
  const foundation = verifyRuntimeEnabledExecutiveExperienceFoundation();
  assert.equal(foundation.ok, true);
});
