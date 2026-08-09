import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_RUNTIME_ATTENTION_LEVELS as attentionLevels,
  EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION as authoritySourceVersion,
  EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY as boundary,
  EXECUTIVE_RUNTIME_CONTRACTS_PRINCIPLE as principle,
  EXECUTIVE_RUNTIME_CONTRACT_FAMILIES as families,
  EXECUTIVE_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES as guarantees,
  EXECUTIVE_RUNTIME_FOCUS_RELATIONSHIPS as focusRelationships,
  createExecutiveRuntimeAdvisorContract,
  createExecutiveRuntimeAttentionContract,
  createExecutiveRuntimeAuthorityContract,
  createExecutiveRuntimeExperienceContract,
  createExecutiveRuntimeExplorerContract,
  createExecutiveRuntimeFocusContract,
  createExecutiveRuntimeInsightContract,
  createExecutiveRuntimeInteractionContext,
  createExecutiveRuntimePresentationContract,
  createExecutiveRuntimeReadinessContract,
  createExecutiveRuntimeStageContract,
  createExecutiveRuntimeSubjectReference,
  createExecutiveRuntimeSurfaceContract,
  createExecutiveRuntimeSurfaceReference,
  createExecutiveRuntimeTimelineContract,
  getRuntimeEnabledExecutiveExperienceContractsIdentity,
  isExecutiveRuntimeContractFamily,
  isExecutiveRuntimeSubjectReference,
  isExecutiveRuntimeSurfaceReference,
  listExecutiveRuntimeContractFamilies,
  runtimeEnabledExecutiveExperienceContracts as contracts,
  runtimeEnabledExecutiveExperienceContractsApiNames as apiNames,
  runtimeEnabledExecutiveExperienceContractsCanonicalIdentity as canonicalIdentity,
  runtimeEnabledExecutiveExperienceContractsRegistry as registry,
  verifyExecutiveRuntimeAttentionContract,
  verifyExecutiveRuntimeAuthorityContract,
  verifyExecutiveRuntimeContracts,
  verifyExecutiveRuntimeExperienceContract,
  verifyExecutiveRuntimeFocusContract,
  verifyExecutiveRuntimePresentationContract,
  verifyExecutiveRuntimeReadinessContract,
} from "./runtimeEnabledExecutiveExperienceContracts.ts";

import {
  RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  RUNTIME_EXECUTIVE_PRESENTATION_STATES,
  createRuntimeExecutiveExperienceContext,
  createRuntimeExecutiveExperienceSnapshot,
  createRuntimeExecutiveSurfaceState,
  runtimeEnabledExecutiveExperienceFoundationIdentity,
  verifyRuntimeEnabledExecutiveExperienceFoundation,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeEnabledExecutiveExperienceContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

const runtimeSource = RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;

function sampleSubject() {
  return createExecutiveRuntimeSubjectReference({
    kind: "goal",
    id: "goal-1",
    label: "Grow capacity",
    parentId: "pack-1",
    sourceVersion: "1",
  });
}

function sampleSurfaceRef() {
  return createExecutiveRuntimeSurfaceReference({
    surface: "stage",
    surfaceId: "surface.stage.primary",
    runtimeState: "ready",
    activationState: "eligible",
  });
}

function sampleExperienceContext() {
  return createRuntimeExecutiveExperienceContext({
    experienceId: "rex.exp.contracts",
    runtimeState: "ready",
    activationState: "eligible",
    activeSurface: "stage",
    activeSubjectKind: "goal",
    activeSubjectId: "goal-1",
    presentationState: "report",
    runtimeContextAvailable: true,
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });
}

function sampleSnapshot() {
  return createRuntimeExecutiveExperienceSnapshot({
    snapshotId: "snap.contracts.1",
    context: sampleExperienceContext(),
    surfaceStates: [
      createRuntimeExecutiveSurfaceState({
        surface: "stage",
        availability: "ready",
        activation: "eligible",
        subjectKind: "goal",
        subjectId: "goal-1",
        presentationState: "report",
      }),
    ],
    currentSubjectKind: "goal",
    currentSubjectId: "goal-1",
    runtimeReadiness: "ready",
    upstreamIntegrationIdentity:
      runtimeSource.authorityIdentity,
    upstreamIntegrationVersion: "1.9.0",
    runtimeSource,
    foundationIdentity:
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
    foundationVersion: "1.1.0",
  });
}

test("1. exact REX-1:2 identity", () => {
  assert.equal(contracts.identity, "REX-1:2/ExecutiveRuntimeContracts");
  assert.equal(canonicalIdentity.identity, contracts.identity);
  assert.equal(contracts.phase, "REX-1");
  assert.equal(contracts.name, "ExecutiveRuntimeContracts");
  assert.equal(contracts.layer, "REX");
  assert.equal(contracts.stage, "Contracts");
  assert.equal(contracts.role, "Contracts");
  assert.equal(contracts.status, "ContractsReady");
  assert.deepEqual(
    getRuntimeEnabledExecutiveExperienceContractsIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.2.0", () => {
  assert.equal(contracts.version, "1.2.0");
  assert.equal(canonicalIdentity.version, "1.2.0");
  assert.equal(registry.version, "1.2.0");
});

test("3. exact namespace", () => {
  assert.equal(
    contracts.namespace,
    "nexora.rex.runtime-enabled-executive-experience.contracts",
  );
  assert.equal(canonicalIdentity.namespace, contracts.namespace);
  assert.equal(registry.namespace, contracts.namespace);
});

test("4. sole immediate dependency is REX-1:1 foundation", () => {
  assert.equal(
    contracts.upstreamDependency,
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    runtimeEnabledExecutiveExperienceFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(boundary.consumesFoundationOnly, true);
  assert.equal(contracts.foundationBoundary, "REX-1:1-foundation-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation",
  ]);
});

test("5. forbidden direct imports", () => {
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
    /from\s+["']@\/app\/(?:components|executive|screens|stores)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("6. contract-family count and order", () => {
  assert.deepEqual([...families], [
    "SubjectReference",
    "SurfaceReference",
    "Focus",
    "Attention",
    "Presentation",
    "InteractionContext",
    "Surface",
    "Experience",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "Readiness",
    "RuntimeAuthority",
  ]);
  assert.equal(families.length, 15);
  assert.equal(registry.familyCount, 15);
  assert.deepEqual([...listExecutiveRuntimeContractFamilies()], [...families]);
  assert.equal(isExecutiveRuntimeContractFamily("Focus"), true);
  assert.equal(isExecutiveRuntimeContractFamily("Rendering"), false);
});

test("7. subject reference contract behavior", () => {
  const subject = sampleSubject();
  assert.equal(Object.isFrozen(subject), true);
  assert.equal(subject.kind, "goal");
  assert.equal(subject.id, "goal-1");
  assert.equal(subject.parentId, "pack-1");
  assert.equal(isExecutiveRuntimeSubjectReference(subject), true);
  assert.equal(
    isExecutiveRuntimeSubjectReference({ kind: "kor", id: "x" }),
    false,
  );
  assert.throws(() =>
    createExecutiveRuntimeSubjectReference({ kind: "object", id: "" }),
  );
});

test("8. surface reference contract behavior", () => {
  const surface = sampleSurfaceRef();
  assert.equal(Object.isFrozen(surface), true);
  assert.equal(surface.surface, "stage");
  assert.equal(surface.runtimeState, "ready");
  assert.equal(surface.activationState, "eligible");
  assert.equal(isExecutiveRuntimeSurfaceReference(surface), true);
  assert.throws(() =>
    createExecutiveRuntimeSurfaceReference({
      surface: "dashboard" as never,
      surfaceId: "x",
      runtimeState: "ready",
      activationState: "inactive",
    }),
  );
});

test("9. focus contract representation", () => {
  const focus = createExecutiveRuntimeFocusContract({
    focusedSubject: sampleSubject(),
    relationship: "primary",
    secondarySubject: {
      kind: "object",
      id: "object-1",
    },
    reason: "upstream-selected",
    scope: "experience",
    surface: "stage",
    runtimeSource,
  });
  assert.equal(Object.isFrozen(focus), true);
  assert.equal(focus.relationship, "primary");
  assert.equal(focus.runtimeSource, runtimeSource);
  assert.equal(verifyExecutiveRuntimeFocusContract(focus), true);
  assert.deepEqual([...focusRelationships], ["primary", "secondary"]);
  assert.equal(boundary.calculatesFocus, false);
});

test("10. attention contract representation", () => {
  const attention = createExecutiveRuntimeAttentionContract({
    subject: sampleSubject(),
    level: "primary",
    reason: "executive-priority",
    scope: "subject",
    persistence: "sticky",
    surface: "advisor",
    runtimeSource,
  });
  assert.equal(Object.isFrozen(attention), true);
  assert.equal(attention.level, "primary");
  assert.equal(verifyExecutiveRuntimeAttentionContract(attention), true);
  assert.deepEqual([...attentionLevels], [
    "primary",
    "secondary",
    "context",
    "background",
    "suppressed",
  ]);
  assert.equal(boundary.calculatesAttention, false);
});

test("11. presentation contract compatibility", () => {
  const presentation = createExecutiveRuntimePresentationContract({
    subject: sampleSubject(),
    targetSurface: "insight",
    presentationState: "report",
    visibility: "visible",
    emphasis: "high",
    priority: 1,
    runtimeSource,
  });
  assert.equal(presentation.presentationState, "report");
  assert.deepEqual([...RUNTIME_EXECUTIVE_PRESENTATION_STATES], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(
    verifyExecutiveRuntimePresentationContract(presentation),
    true,
  );
  assert.equal(boundary.resolvesPresentation, false);
  assert.throws(() =>
    createExecutiveRuntimePresentationContract({
      subject: sampleSubject(),
      targetSurface: "stage",
      presentationState: "detail" as never,
      runtimeSource,
    }),
  );
});

test("12. interaction context representation", () => {
  const interaction = createExecutiveRuntimeInteractionContext({
    interactionId: "ix.select.goal-1",
    sourceSurface: "stage",
    targetSubject: sampleSubject(),
    interactionKind: "select",
    contextId: "ctx.1",
    snapshotId: "snap.contracts.1",
    runtimeSource,
  });
  assert.equal(Object.isFrozen(interaction), true);
  assert.equal(interaction.interactionKind, "select");
  assert.equal(boundary.executesInteraction, false);
});

test("13. Stage contract", () => {
  const stage = createExecutiveRuntimeStageContract({
    surface: "stage",
    availability: "ready",
    activation: "activated",
    activeSubject: sampleSubject(),
    focusedSubject: sampleSubject(),
    subjectReferences: [sampleSubject()],
    readiness: "ready",
    runtimeSource,
  });
  assert.equal(stage.surface, "stage");
  assert.equal(Object.isFrozen(stage.subjectReferences), true);
  assert.doesNotMatch(source, /\b(?:THREE|Object3D|Mesh|Scene|WebGLRenderer)\b/);
});

test("14. Advisor contract", () => {
  const advisor = createExecutiveRuntimeAdvisorContract({
    surface: "advisor",
    activeSubject: sampleSubject(),
    contextId: "ctx.1",
    availability: "available",
    readiness: "ready",
    activation: "eligible",
    runtimeSource,
  });
  assert.equal(advisor.surface, "advisor");
  assert.doesNotMatch(
    source,
    /from\s+["'](?:openai|anthropic|@anthropic-ai\/[^"']*|langchain(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:chat\.completions|createCompletion|invokeModel)\s*\(/,
  );
});

test("15. Insight contract", () => {
  const insight = createExecutiveRuntimeInsightContract({
    surface: "insight",
    activeSubject: sampleSubject(),
    relatedMetrics: [
      { metricId: "m-1", metricKind: "generic", label: "Throughput" },
    ],
    presentationState: "report",
    readiness: "ready",
    activation: "eligible",
    runtimeSource,
  });
  assert.equal(insight.surface, "insight");
  assert.equal(insight.relatedMetrics?.[0]?.metricId, "m-1");
  assert.doesNotMatch(source, /\b(?:calculateKpi|calculateKoi)\b/);
});

test("16. Timeline contract", () => {
  const timeline = createExecutiveRuntimeTimelineContract({
    surface: "timeline",
    contextId: "timeline.ctx",
    selectedPositionId: "t+0",
    associatedSubject: sampleSubject(),
    associatedPackId: "pack-1",
    temporalContextId: "temporal.1",
    readiness: "available",
    activation: "inactive",
    runtimeSource,
  });
  assert.equal(timeline.surface, "timeline");
  assert.doesNotMatch(source, /\b(?:replayTimeline|persistTimeline)\b/);
});

test("17. Explorer contract", () => {
  const explorer = createExecutiveRuntimeExplorerContract({
    surface: "explorer",
    contextId: "explorer.ctx",
    collectionKind: "object",
    selectedSubject: { kind: "object", id: "object-1" },
    readiness: "ready",
    activation: "eligible",
    relatedSurfaceIds: ["surface.stage.primary"],
    runtimeSource,
  });
  assert.equal(explorer.surface, "explorer");
  assert.equal(explorer.collectionKind, "object");
  assert.doesNotMatch(source, /\b(?:fetch\(|axios|graphql)\b/);
});

test("18. readiness contract", () => {
  const readiness = createExecutiveRuntimeReadinessContract({
    runtimeAvailable: true,
    contextAvailable: true,
    surfaceReady: true,
    subjectReady: true,
    presentationReady: true,
    interactionReady: false,
    overallReady: false,
  });
  assert.equal(Object.isFrozen(readiness), true);
  assert.equal(verifyExecutiveRuntimeReadinessContract(readiness), true);
  assert.equal(
    verifyExecutiveRuntimeReadinessContract({
      runtimeAvailable: true,
    }),
    false,
  );
});

test("19. runtime authority contract", () => {
  const authority = createExecutiveRuntimeAuthorityContract();
  assert.equal(authority.sourceLayer, "EX-DRI");
  assert.equal(authority.consumedByLayer, "REX");
  assert.equal(authority.relationship, "EX-DRI → REX");
  assert.equal(authority.sourceVersion, "1.9.0");
  assert.equal(authoritySourceVersion, "1.9.0");
  assert.equal(
    authority.sourceIdentity,
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex",
  );
  assert.equal(verifyExecutiveRuntimeAuthorityContract(authority), true);
  assert.equal(
    verifyExecutiveRuntimeAuthorityContract({
      ...authority,
      sourceLayer: "DRI",
    }),
    false,
  );
});

test("20. top-level experience contract", () => {
  const subject = sampleSubject();
  const surface = sampleSurfaceRef();
  const focus = createExecutiveRuntimeFocusContract({
    focusedSubject: subject,
    relationship: "primary",
    runtimeSource,
  });
  const attention = createExecutiveRuntimeAttentionContract({
    subject,
    level: "secondary",
    runtimeSource,
  });
  const presentation = createExecutiveRuntimePresentationContract({
    subject,
    targetSurface: "stage",
    presentationState: "operation",
    runtimeSource,
  });
  const surfaceContract = createExecutiveRuntimeSurfaceContract({
    surface,
    currentSubject: subject,
    focus,
    attention,
    presentation,
    activation: "activated",
    readiness: "active",
    interactionContext: createExecutiveRuntimeInteractionContext({
      interactionId: "ix.1",
      sourceSurface: "stage",
      targetSubject: subject,
      runtimeSource,
    }),
  });
  const experience = createExecutiveRuntimeExperienceContract({
    experienceContext: sampleExperienceContext(),
    currentSnapshot: sampleSnapshot(),
    activeSubject: subject,
    activeSurface: surface,
    surfaceContracts: [surfaceContract],
    focus,
    attention,
    presentation,
    readiness: createExecutiveRuntimeReadinessContract({
      runtimeAvailable: true,
      contextAvailable: true,
      surfaceReady: true,
      subjectReady: true,
      presentationReady: true,
      interactionReady: true,
      overallReady: true,
    }),
    authority: createExecutiveRuntimeAuthorityContract(),
    contractIdentity: "REX-1:2/ExecutiveRuntimeContracts",
    contractVersion: "1.2.0",
  });
  assert.equal(Object.isFrozen(experience), true);
  assert.equal(Object.isFrozen(experience.surfaceContracts), true);
  assert.equal(experience.contractVersion, "1.2.0");
  assert.equal(verifyExecutiveRuntimeExperienceContract(experience), true);
});

test("21. immutable registry and guarantees", () => {
  assert.equal(guarantees.length, 20);
  assert.equal(registry.guaranteeCount, 20);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(families), true);
  assert.throws(() => {
    (families as unknown as string[]).push("Rendering");
  });
  assert.throws(() => {
    (contracts as { version?: string }).version = "0.0.0";
  });
  assert.deepEqual(
    guarantees.map((entry) => entry.id),
    [
      "depends-only-on-rex-1-1",
      "framework-neutral-contracts",
      "no-rendering-behavior",
      "no-ai-reasoning",
      "no-business-calculations",
      "no-persistence-logic",
      "no-network-logic",
      "no-mutable-collections",
      "focus-represented-not-calculated",
      "attention-represented-not-calculated",
      "presentation-represented-not-resolved",
      "interaction-represented-not-executed",
      "stage-no-threejs-objects",
      "advisor-no-model-provider",
      "insight-no-kpi-koi-calculation",
      "timeline-no-replay",
      "explorer-no-fetch",
      "runtime-authority-ex-dri-originated",
      "presentation-states-unchanged",
      "surfaces-independently-addressable",
    ],
  );
});

test("22. deterministic validation", () => {
  const first = verifyExecutiveRuntimeContracts();
  const second = verifyExecutiveRuntimeContracts();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.familyCount, 15);
  assert.equal(first.guaranteeCount, 20);
  assert.equal(first.foundationBoundaryIntact, true);
  assert.equal(first.authorityDirectionValid, true);
  assert.equal(first.presentationStatesValid, true);
  assert.equal(
    contracts.architecturalStatus,
    "Contracts Complete · Deterministic · Immutable · Framework-Independent · ReadyForRuntimeContextBinding",
  );
  assert.equal(
    principle,
    "REX-1:2 describes what runtime-enabled Executive Experience data looks like. It does not decide what should happen.",
  );
  assert.equal(apiNames.includes("verifyExecutiveRuntimeContracts"), true);
});

test("23. no mutation of caller-owned values", () => {
  const mutable = {
    kind: "pack" as const,
    id: "pack-1",
    label: "Pack",
  };
  const snap = JSON.stringify(mutable);
  createExecutiveRuntimeSubjectReference(mutable);
  assert.equal(JSON.stringify(mutable), snap);
  mutable.label = "mutated";
  assert.equal(mutable.label, "mutated");
});

test("24. no React / Three.js / AI / persistence / network dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|@react-three(?:\/[^"']*)?|zustand|redux|openai|anthropic|@anthropic-ai\/[^"']*)["']/i,
  );
  assert.doesNotMatch(
    source,
    /import\s+.*\b(?:React|useState|useEffect|THREE|WebGLRenderer)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:localStorage|sessionStorage|XMLHttpRequest|indexedDB)\b/,
  );
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  for (const required of [
    "React hooks",
    "Three.js integration",
    "AI reasoning",
    "KPI calculation",
    "persistence",
    "networking",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
});

test("25. REX-1:1 foundation regression remains intact", () => {
  const foundation = verifyRuntimeEnabledExecutiveExperienceFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(
    foundation.identity,
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
  );
  assert.equal(
    runtimeEnabledExecutiveExperienceFoundationIdentity,
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation",
  );
});
