import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_ATTENTION_DIRECTION_LEVELS as attentionLevels,
  EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES as boundaryGuarantees,
  EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES as contractFamilies,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS as requestKinds,
  EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES as responseStatuses,
  EXECUTIVE_FOCUS_DIRECTION_ROLES as focusRoles,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeIntegrationContracts as contracts,
  executiveExperienceDirectorRuntimeIntegrationContractsApiNames as apiNames,
  executiveExperienceDirectorRuntimeIntegrationContractsCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames as constructionHelpers,
  executiveExperienceDirectorRuntimeIntegrationContractsRegistry as registry,
  executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames as validators,
  getExecutiveExperienceDirectorRuntimeIntegrationContractsIdentity,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeBoundaryContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeInteractionContract,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutiveInteractionDirectionContract,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
  listExecutiveDirectorRuntimeContractFamilies,
  listExecutiveDirectorRuntimeRequestKinds,
  listExecutiveDirectorRuntimeResponseStatuses,
  verifyExecutiveExperienceDirectorRuntimeIntegrationContracts,
  type ExecutiveDirectorRuntimeBoundaryContract,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveRuntimeDirectionContract,
} from "./executiveExperienceDirectorRuntimeIntegrationContracts.ts";

import {
  EXECUTIVE_EXPERIENCE_SURFACES,
  EXECUTIVE_PRESENTATION_STATES,
  EXECUTIVE_RUNTIME_DIRECTION_KINDS,
  executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
  verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation";

import {
  directorRuntimeConsumerIntegrationPublicIndexIdentity,
  verifyDirectorRuntimeConsumerIntegrationPublicIndex,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex";

const source = readFileSync(
  new URL(
    "./executiveExperienceDirectorRuntimeIntegrationContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

const factorySubject = Object.freeze({
  id: "factory-1",
  kind: "object" as const,
  label: "Factory",
});

const baseContext = Object.freeze({
  surface: "stage" as const,
  mode: "execution" as const,
  selectedSubject: factorySubject,
  presentationState: "report" as const,
});

const baseCorrelation = Object.freeze({
  correlationId: "corr-select-factory",
  sequence: 1,
});

const selectInteraction = Object.freeze({
  interactionId: "ix.select.factory",
  kind: "select" as const,
  surface: "stage" as const,
  subject: factorySubject,
});

test("1. exact EX-DRI-2 identity", () => {
  assert.equal(
    contracts.identity,
    "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
  );
  assert.equal(canonicalIdentity.identity, contracts.identity);
  assert.equal(contracts.phase, "EX-DRI-2");
  assert.equal(
    contracts.name,
    "ExecutiveExperienceDirectorRuntimeIntegrationContracts",
  );
  assert.equal(contracts.role, "Contracts");
  assert.equal(contracts.status, "ContractsReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeIntegrationContractsIdentity(),
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
    "nexora.ex.dri.integration.contracts",
  );
  assert.equal(canonicalIdentity.namespace, contracts.namespace);
});

test("4. architectural role is ExecutiveExperienceDirectorRuntimeContractBoundary", () => {
  assert.equal(
    contracts.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeContractBoundary",
  );
  assert.equal(
    canonicalIdentity.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeContractBoundary",
  );
});

test("5. sole immediate dependency is EX-DRI-1 foundation", () => {
  assert.equal(
    contracts.upstreamDependency,
    "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation",
  );
  assert.equal(contracts.foundationBoundary, "EX-DRI-1-foundation-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/[^"']+["']/,
  );
});

test("6. contract families have exact order and uniqueness", () => {
  assert.deepEqual([...contractFamilies], [
    "context",
    "subject",
    "interaction",
    "request",
    "scene",
    "focus",
    "attention",
    "presentation",
    "guidance",
    "coordination",
    "response",
    "correlation",
  ]);
  assert.equal(contractFamilies.length, 12);
  assert.equal(new Set(contractFamilies).size, 12);
  assert.deepEqual(
    [...listExecutiveDirectorRuntimeContractFamilies()],
    [...contractFamilies],
  );
});

test("7. request kinds and response statuses are canonical", () => {
  assert.deepEqual([...requestKinds], [
    "context",
    "interaction",
    "context-interaction",
  ]);
  assert.deepEqual([...responseStatuses], [
    "resolved",
    "partial",
    "rejected",
    "noop",
  ]);
  assert.deepEqual(
    [...listExecutiveDirectorRuntimeRequestKinds()],
    [...requestKinds],
  );
  assert.deepEqual(
    [...listExecutiveDirectorRuntimeResponseStatuses()],
    [...responseStatuses],
  );
});

test("8. correlation validation rules", () => {
  assert.equal(
    isExecutiveDirectorRuntimeCorrelation({
      correlationId: "c1",
    }),
    true,
  );
  assert.equal(
    isExecutiveDirectorRuntimeCorrelation({
      correlationId: "c1",
      sequence: 0,
      parentCorrelationId: "parent-1",
    }),
    true,
  );
  assert.equal(
    isExecutiveDirectorRuntimeCorrelation({ correlationId: "" }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeCorrelation({
      correlationId: "c1",
      sequence: -1,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeCorrelation({
      correlationId: "c1",
      parentCorrelationId: "c1",
    }),
    false,
  );
  const first = isExecutiveDirectorRuntimeCorrelation(baseCorrelation);
  const second = isExecutiveDirectorRuntimeCorrelation(baseCorrelation);
  assert.equal(first, second);
});

test("9. subject and context contracts reject non-identity payloads", () => {
  assert.equal(
    isExecutiveDirectorRuntimeSubjectContract(factorySubject),
    true,
  );
  assert.equal(
    isExecutiveDirectorRuntimeSubjectContract({
      id: "",
      kind: "object",
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeSubjectContract({
      id: "x",
      kind: "kor",
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeContextContract(baseContext),
    true,
  );
  assert.equal(
    isExecutiveDirectorRuntimeContextContract({
      surface: "dashboard",
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeInteractionContract(selectInteraction),
    true,
  );
  assert.equal(
    isExecutiveDirectorRuntimeInteractionContract({
      interactionId: "ix",
      kind: "centerFactory",
      surface: "stage",
    }),
    false,
  );
});

test("10. valid request contracts for all kinds", () => {
  const contextRequest = createExecutiveDirectorRuntimeRequest({
    direction: "ex-to-dri",
    kind: "context",
    correlation: baseCorrelation,
    context: baseContext,
  });
  assert.equal(contextRequest.direction, "ex-to-dri");
  assert.equal(contextRequest.kind, "context");
  assert.equal(Object.isFrozen(contextRequest), true);
  assert.equal(isExecutiveDirectorRuntimeRequestContract(contextRequest), true);

  const interactionRequest = createExecutiveDirectorRuntimeRequest({
    direction: "ex-to-dri",
    kind: "interaction",
    correlation: baseCorrelation,
    context: baseContext,
    interaction: selectInteraction,
  });
  assert.equal(interactionRequest.kind, "interaction");
  assert.ok(interactionRequest.interaction);

  const contextInteractionRequest = createExecutiveDirectorRuntimeRequest({
    direction: "ex-to-dri",
    kind: "context-interaction",
    correlation: baseCorrelation,
    context: baseContext,
    interaction: selectInteraction,
  });
  assert.equal(contextInteractionRequest.kind, "context-interaction");
  assert.ok(contextInteractionRequest.interaction);
});

test("11. invalid request combinations are rejected", () => {
  assert.equal(
    isExecutiveDirectorRuntimeRequestContract({
      direction: "dri-to-ex",
      kind: "context",
      correlation: baseCorrelation,
      context: baseContext,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeRequestContract({
      direction: "ex-to-dri",
      kind: "context",
      correlation: baseCorrelation,
      context: baseContext,
      interaction: selectInteraction,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeRequestContract({
      direction: "ex-to-dri",
      kind: "interaction",
      correlation: baseCorrelation,
      context: baseContext,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeRequestContract({
      direction: "ex-to-dri",
      kind: "context-interaction",
      correlation: baseCorrelation,
      context: baseContext,
    }),
    false,
  );
  assert.throws(() =>
    createExecutiveDirectorRuntimeRequest({
      direction: "ex-to-dri",
      kind: "interaction",
      correlation: baseCorrelation,
      context: baseContext,
    } as ExecutiveDirectorRuntimeRequestContract),
  );
});

test("12. every runtime direction validates and narrows by kind", () => {
  const scene: ExecutiveRuntimeDirectionContract = {
    kind: "scene",
    surface: "stage",
    primarySubject: factorySubject,
    relatedSubjects: [
      { id: "warehouse-1", kind: "object", label: "Warehouse" },
    ],
  };
  const focus: ExecutiveRuntimeDirectionContract = {
    kind: "focus",
    surface: "stage",
    subject: factorySubject,
    role: "focused",
  };
  const attention: ExecutiveRuntimeDirectionContract = {
    kind: "attention",
    surface: "stage",
    subject: factorySubject,
    level: "primary",
    reason: "selection",
  };
  const presentation: ExecutiveRuntimeDirectionContract = {
    kind: "presentation",
    surface: "stage",
    subject: factorySubject,
    state: "report",
  };
  const guidance: ExecutiveRuntimeDirectionContract = {
    kind: "guidance",
    surface: "advisor",
    subject: factorySubject,
    guidanceRole: "assist",
    messageKey: "factory.selected",
  };
  const interaction: ExecutiveRuntimeDirectionContract = {
    kind: "interaction",
    surface: "stage",
    subject: factorySubject,
    interaction: "select",
  };
  const coordination: ExecutiveRuntimeDirectionContract = {
    kind: "coordination",
    sourceSurface: "stage",
    targetSurfaces: ["advisor", "insight"],
    subject: factorySubject,
  };

  assert.equal(isExecutiveSceneDirectionContract(scene), true);
  assert.equal(isExecutiveFocusDirectionContract(focus), true);
  assert.equal(isExecutiveAttentionDirectionContract(attention), true);
  assert.equal(isExecutivePresentationDirectionContract(presentation), true);
  assert.equal(isExecutiveGuidanceDirectionContract(guidance), true);
  assert.equal(isExecutiveInteractionDirectionContract(interaction), true);
  assert.equal(isExecutiveCoordinationDirectionContract(coordination), true);

  const all = [
    scene,
    focus,
    attention,
    presentation,
    guidance,
    interaction,
    coordination,
  ];
  for (const direction of all) {
    assert.equal(isExecutiveRuntimeDirectionContract(direction), true);
    const frozen = createExecutiveRuntimeDirectionContract(direction);
    assert.equal(Object.isFrozen(frozen), true);
    if (frozen.kind === "scene") {
      assert.equal(frozen.relatedSubjects.length, 1);
    }
    if (frozen.kind === "presentation") {
      assert.equal(frozen.state, "report");
    }
    if (frozen.kind === "coordination") {
      assert.deepEqual([...frozen.targetSurfaces], ["advisor", "insight"]);
    }
  }

  assert.equal(
    isExecutiveRuntimeDirectionContract({
      kind: "animation",
      surface: "stage",
    }),
    false,
  );
  assert.equal(
    isExecutiveSceneDirectionContract({
      kind: "scene",
      surface: "stage",
      relatedSubjects: "factory",
    }),
    false,
  );
  assert.deepEqual([...focusRoles], [
    "focused",
    "supporting",
    "contextual",
    "peripheral",
    "none",
  ]);
  assert.deepEqual([...attentionLevels], [
    "primary",
    "secondary",
    "context",
    "background",
    "suppressed",
  ]);
});

test("13. response contracts enforce status/direction consistency", () => {
  const directions: ReadonlyArray<ExecutiveRuntimeDirectionContract> = [
    {
      kind: "focus",
      surface: "stage",
      subject: factorySubject,
      role: "focused",
    },
    {
      kind: "presentation",
      surface: "stage",
      subject: factorySubject,
      state: "report",
    },
    {
      kind: "coordination",
      sourceSurface: "stage",
      targetSurfaces: ["advisor", "insight"],
      subject: factorySubject,
    },
  ];

  const resolved = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: baseCorrelation,
    status: "resolved",
    directions,
  });
  assert.equal(resolved.direction, "dri-to-ex");
  assert.equal(resolved.status, "resolved");
  assert.equal(Object.isFrozen(resolved), true);
  assert.equal(Object.isFrozen(resolved.directions), true);
  assert.equal(isExecutiveDirectorRuntimeResponseContract(resolved), true);

  const partial = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: baseCorrelation,
    status: "partial",
    directions: [directions[0]!],
  });
  assert.equal(partial.status, "partial");

  const rejected = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: baseCorrelation,
    status: "rejected",
    directions: [],
  });
  assert.equal(rejected.status, "rejected");

  const noop = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: baseCorrelation,
    status: "noop",
    directions: [],
  });
  assert.equal(noop.status, "noop");

  assert.equal(
    isExecutiveDirectorRuntimeResponseContract({
      direction: "ex-to-dri",
      correlation: baseCorrelation,
      status: "resolved",
      directions,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeResponseContract({
      direction: "dri-to-ex",
      correlation: baseCorrelation,
      status: "noop",
      directions,
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeResponseContract({
      direction: "dri-to-ex",
      correlation: baseCorrelation,
      status: "resolved",
      directions: [],
    }),
    false,
  );
  assert.equal(
    isExecutiveDirectorRuntimeResponseContract({
      direction: "dri-to-ex",
      correlation: baseCorrelation,
      status: "rejected",
      directions,
    }),
    false,
  );
  assert.throws(() =>
    createExecutiveDirectorRuntimeResponse({
      direction: "dri-to-ex",
      correlation: baseCorrelation,
      status: "noop",
      directions,
    }),
  );
});

test("14. boundary contract union narrows by direction", () => {
  const request = createExecutiveDirectorRuntimeRequest({
    direction: "ex-to-dri",
    kind: "context-interaction",
    correlation: baseCorrelation,
    context: baseContext,
    interaction: selectInteraction,
  });
  const response = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: baseCorrelation,
    status: "resolved",
    directions: [
      {
        kind: "focus",
        surface: "stage",
        subject: factorySubject,
        role: "focused",
      },
    ],
  });

  assert.equal(isExecutiveDirectorRuntimeBoundaryContract(request), true);
  assert.equal(isExecutiveDirectorRuntimeBoundaryContract(response), true);

  const boundary: ExecutiveDirectorRuntimeBoundaryContract = request;
  if (boundary.direction === "ex-to-dri") {
    assert.equal(boundary.kind, "context-interaction");
  }
  const responseBoundary: ExecutiveDirectorRuntimeBoundaryContract = response;
  if (responseBoundary.direction === "dri-to-ex") {
    assert.equal(responseBoundary.status, "resolved");
  }
});

test("15. example select-Factory contract cycle is representable", () => {
  const request = createExecutiveDirectorRuntimeRequest({
    direction: "ex-to-dri",
    kind: "context-interaction",
    correlation: {
      correlationId: "corr-factory-select",
      sequence: 1,
    },
    context: {
      surface: "stage",
      mode: "execution",
      selectedSubject: factorySubject,
      presentationState: "minimum",
    },
    interaction: {
      interactionId: "ix.select.factory",
      kind: "select",
      surface: "stage",
      subject: factorySubject,
    },
  });

  const response = createExecutiveDirectorRuntimeResponse({
    direction: "dri-to-ex",
    correlation: request.correlation,
    status: "resolved",
    directions: [
      {
        kind: "focus",
        surface: "stage",
        subject: factorySubject,
        role: "focused",
      },
      {
        kind: "scene",
        surface: "stage",
        primarySubject: factorySubject,
        relatedSubjects: [
          { id: "warehouse-1", kind: "object", label: "Warehouse" },
        ],
      },
      {
        kind: "presentation",
        surface: "stage",
        subject: factorySubject,
        state: "report",
      },
      {
        kind: "coordination",
        sourceSurface: "stage",
        targetSurfaces: ["advisor", "insight"],
        subject: factorySubject,
      },
    ],
  });

  assert.equal(request.direction, "ex-to-dri");
  assert.equal(response.direction, "dri-to-ex");
  assert.equal(response.directions.length, 4);
  assert.doesNotMatch(JSON.stringify(request), /centerFactory|dimOthers|openAdvisorPanel|setObjectColorRed|showKpiChart/);
  assert.doesNotMatch(JSON.stringify(response), /camera|opacity|animate|Object3D|x=|y=/);
});

test("16. immutability of registries and constructed contracts", () => {
  assert.equal(Object.isFrozen(contracts), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(contractFamilies), true);
  assert.equal(Object.isFrozen(requestKinds), true);
  assert.equal(Object.isFrozen(responseStatuses), true);
  assert.equal(Object.isFrozen(boundaryGuarantees), true);
  assert.throws(() => {
    (contractFamilies as unknown as string[]).push("rendering");
  });
  assert.throws(() => {
    (contracts as { version?: string }).version = "0.0.0";
  });
});

test("17. framework and DRI-bypass independence", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*)["']/i,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/[^"']+["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|fetch|XMLHttpRequest)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|crypto\.randomUUID\(/);
});

test("18. boundary guarantees and catalogs", () => {
  assert.equal(boundaryGuarantees.length, 18);
  assert.equal(validators.length, 16);
  assert.equal(constructionHelpers.length, 7);
  assert.deepEqual([...registrySections], [
    "Identity",
    "ContractFamilies",
    "RequestContracts",
    "ResponseContracts",
    "RuntimeDirections",
    "Validation",
    "Compatibility",
    "BoundaryRules",
  ]);
  assert.equal(registry.surfaceCount, EXECUTIVE_EXPERIENCE_SURFACES.length);
  assert.equal(
    registry.presentationStateCount,
    EXECUTIVE_PRESENTATION_STATES.length,
  );
  assert.equal(
    registry.runtimeDirectionKindCount,
    EXECUTIVE_RUNTIME_DIRECTION_KINDS.length,
  );
  assert.deepEqual([...EXECUTIVE_PRESENTATION_STATES], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(apiNames.length, registry.publicApiCount);
});

test("19. verification returns successful canonical result", () => {
  const first =
    verifyExecutiveExperienceDirectorRuntimeIntegrationContracts();
  const second =
    verifyExecutiveExperienceDirectorRuntimeIntegrationContracts();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.identity, contracts.identity);
  assert.equal(first.version, "1.2.0");
  assert.equal(
    first.architecturalRole,
    "ExecutiveExperienceDirectorRuntimeContractBoundary",
  );
  assert.equal(first.contractFamilyCount, 12);
  assert.equal(first.requestKindCount, 3);
  assert.equal(first.responseStatusCount, 4);
  assert.equal(first.runtimeDirectionKindCount, 7);
  assert.equal(first.boundaryGuaranteeCount, 18);
  assert.equal(first.validatorCount, validators.length);
  assert.equal(first.constructionHelperCount, constructionHelpers.length);
  assert.equal(first.frozen, true);
  assert.equal(first.foundationBoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.directionIntegrity, true);
  assert.equal(first.presentationStatesCompatible, true);
  assert.equal(first.surfacesCompatible, true);
  assert.equal(
    contracts.architecturalStatus,
    "Contracts Complete · Deterministic · Immutable · Framework-Independent · ReadyForExDriContextStateBinding",
  );
});

test("20. EX-DRI-1 regression remains green", () => {
  const foundation =
    verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(
    foundation.identity,
    "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
  );
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
    "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
  );
});

test("21. DRI consumer integration public index remains intact", () => {
  const publicIndex = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexIdentity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("22. constructors do not mutate caller input", () => {
  const mutableRequest = {
    direction: "ex-to-dri" as const,
    kind: "interaction" as const,
    correlation: {
      correlationId: "corr-1",
      sequence: 2,
    },
    context: {
      surface: "stage" as const,
      selectedSubject: {
        id: "factory-1",
        kind: "object" as const,
      },
    },
    interaction: {
      interactionId: "ix-1",
      kind: "select" as const,
      surface: "stage" as const,
      subject: {
        id: "factory-1",
        kind: "object" as const,
      },
    },
  };
  const snap = JSON.stringify(mutableRequest);
  createExecutiveDirectorRuntimeRequest(mutableRequest);
  assert.equal(JSON.stringify(mutableRequest), snap);
});

test("23. metadata policies are immutable / deterministic / side-effect-free", () => {
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.mutationPolicy, "immutable");
  assert.equal(canonicalIdentity.sideEffectPolicy, "side-effect-free");
  assert.equal(
    canonicalIdentity.contractDirectionality,
    "bidirectional-separated",
  );
  assert.equal(contracts.deterministic, true);
  assert.equal(contracts.immutable, true);
  assert.equal(contracts.sideEffectFree, true);
  assert.equal(contracts.frameworkIndependent, true);
});
