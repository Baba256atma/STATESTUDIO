/**
 * P2:7 — Data-Reality-Aware Connections & Context Reveal tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY,
  DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_PROVENANCE_CHAIN,
  DATA_REALITY_AWARE_DEFAULT_RELATIONSHIP_KIND,
  dataRealityAwareConnectionsContextArchitecturalRole,
  dataRealityAwareConnectionsContextIdentity,
  dataRealityAwareConnectionsContextNamespace,
  dataRealityAwareConnectionsContextPhase,
  dataRealityAwareConnectionsContextVersion,
  getDataRealityAwareConnectionsContextIdentity,
  getDataRealityAwareContextForObject,
  getDataRealityAwareDirectContext,
  getDataRealityAwareRetainedAttentionContext,
  getDataRealityAwareRevealedConnections,
  resolveDataRealityAwareConnectionsContext,
} from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareSceneChoreographyIdentity,
  resolveDataRealityAwareSceneChoreography,
} from "./dataRealityAwareSceneChoreography.ts";
import { resolveDataRealityAwareFocusAttentionExperience } from "./dataRealityAwareFocusAttentionExperience.ts";
import { resolveDataRealityAwareMVPRuntimeState } from "./dataRealityAwareMVPRuntimeState.ts";
import {
  getDataRealityAwareStageObjectBinding,
  resolveDataRealityAwareStageBinding,
} from "./dataRealityAwareStageExperienceBinding.ts";
import { resolveDataRealityAwareAdvisorBinding } from "./dataRealityAwareAdvisorExperienceBinding.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import { getExecutiveOperationsPressureDataset } from "./demo/executiveOperationsDemoDataset.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPDataRealityAwareFocusAttentionExperience } from "../nex-mvp/nexoraMVPDataRealityAwareFocusAttentionExperience.ts";
import { resolveNexoraMVPDataRealityAwareSceneChoreography } from "../nex-mvp/nexoraMVPDataRealityAwareSceneChoreography.ts";
import {
  applyDataRealityAwareConnectionsContextToStagePresentation,
  resolveNexoraMVPDataRealityAwareConnectionsContext,
} from "../nex-mvp/nexoraMVPDataRealityAwareConnectionsContext.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";

const here = dirname(fileURLToPath(import.meta.url));

const STAGE_OBJECTS = getDefaultNexoraMVPObjectInteractionCatalog().objects.map(
  (entry) => Object.freeze({ objectId: entry.id }),
);

const RELATIONSHIPS = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((entry) =>
  Object.freeze({
    id: entry.id,
    sourceId: entry.sourceId,
    targetId: entry.targetId,
  }),
);

const CONTEXT_LINKS = NEXORA_MVP_CONTEXT_LINK_FIXTURES.map((entry) =>
  Object.freeze({
    id: entry.id,
    objectId: entry.objectId,
    contextId: entry.contextId,
    relation: entry.relation,
  }),
);

const CONTEXT_SUBJECTS = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.map((entry) =>
  Object.freeze({
    id: entry.id,
    kind: entry.kind,
    label: entry.label,
  }),
);

const STAGE_BINDING_OBJECTS = STAGE_OBJECTS.map((entry) =>
  Object.freeze({ id: entry.objectId }),
);

function sharedRuntimeInput() {
  return {
    dataset: getExecutiveOperationsPressureDataset(),
    focusedObjectId:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.focusedObjectId,
    selectedObjectIds:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.selectedObjectIds,
    selectedObjectId: "obj-inventory",
    currentWorkspace:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.currentWorkspace,
    requestedIntent:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.requestedIntent,
    responseMode:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.responseMode,
    presentationState: "report" as const,
  };
}

function resolveChoreography(overrides: {
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
} = {}) {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    ...sharedRuntimeInput(),
    ...overrides,
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId:
      overrides.focusedObjectId ?? runtimeState.focus.focusedObjectId,
    selectedObjectId:
      overrides.selectedObjectId ?? runtimeState.focus.selectedObjectId,
    presentationState: "report",
  });
  return resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
    presentationState: "report",
  });
}

function resolveConnections(overrides: {
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
} = {}) {
  return resolveDataRealityAwareConnectionsContext({
    choreography: resolveChoreography(overrides),
    relationships: RELATIONSHIPS,
    contextLinks: CONTEXT_LINKS,
    contextSubjects: CONTEXT_SUBJECTS,
    presentationState: "report",
  });
}

test("P2:7 identity and boundary", () => {
  const identity = getDataRealityAwareConnectionsContextIdentity();
  assert.equal(
    dataRealityAwareConnectionsContextIdentity,
    "P2:7/DataRealityAwareConnectionsContextRevealIntegration",
  );
  assert.equal(
    identity.identity,
    "P2:7/DataRealityAwareConnectionsContextRevealIntegration",
  );
  assert.equal(dataRealityAwareConnectionsContextVersion, "2.7.0");
  assert.equal(
    dataRealityAwareConnectionsContextNamespace,
    "nexora.data-reality.connections-context-reveal",
  );
  assert.equal(
    dataRealityAwareConnectionsContextPhase,
    "ConnectionsContextRevealIntegration",
  );
  assert.equal(
    dataRealityAwareConnectionsContextArchitecturalRole,
    "DataRealityAwareExecutiveContextBoundary",
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.infersCausality,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.revealDepthHops,
    1,
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.immediateChoreographySource,
    dataRealityAwareSceneChoreographyIdentity,
  );
});

test("TEST 1 — Determinism", () => {
  const a = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const b = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:6 Anchor Preservation", () => {
  const choreography = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, choreography.anchorObjectId);
  assert.equal(result.anchorObjectId, "obj-revenue");
});

test("TEST 3 — No Independent Focus Resolution", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareConnectionsContext.ts"),
    "utf8",
  );
  assert.equal(
    /resolveDataRealityAwarePrimaryFocusObjectId|resolveDataRealityAwareFocusAttentionExperience\(/.test(
      source,
    ),
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.recomputesFocusAttention,
    false,
  );
});

test("TEST 4 — Canonical Connection Identity", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const ids = result.connections.map((entry) => entry.connectionId).sort();
  assert.deepEqual(
    ids,
    RELATIONSHIPS.map((entry) => entry.id).sort(),
  );
});

test("TEST 5 — Direction Preservation", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const customerRevenue = result.connections.find(
    (entry) => entry.connectionId === "rel-customer-revenue",
  )!;
  assert.equal(customerRevenue.sourceObjectId, "obj-customer");
  assert.equal(customerRevenue.targetObjectId, "obj-revenue");
  assert.equal(customerRevenue.direction, "directed");
});

test("TEST 6 — Relationship Kind Preservation", () => {
  const result = resolveDataRealityAwareConnectionsContext({
    choreography: resolveChoreography({
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
    }),
    relationships: [
      {
        id: "rel-customer-revenue",
        sourceId: "obj-customer",
        targetId: "obj-revenue",
        relationshipKind: "feeds",
      },
    ],
  });
  assert.equal(result.connections[0]?.relationshipKind, "feeds");

  const generic = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.ok(
    generic.connections.every(
      (entry) =>
        entry.relationshipKind === DATA_REALITY_AWARE_DEFAULT_RELATIONSHIP_KIND,
    ),
  );
});

test("TEST 7 — Direct Context", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const revealed = getDataRealityAwareRevealedConnections(result);
  assert.ok(revealed.some((e) => e.connectionId === "rel-customer-revenue"));
  assert.ok(revealed.some((e) => e.connectionId === "rel-demand-revenue"));
  const direct = getDataRealityAwareDirectContext(result).map((e) => e.objectId);
  assert.ok(direct.includes("obj-customer"));
  assert.ok(direct.includes("obj-demand"));
});

test("TEST 8 — No Recursive Explosion", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(result.relationshipSummary.revealDepthHops, 1);
  // Delivery is 2 hops from Revenue (via Customer) — must not be direct context.
  assert.equal(
    getDataRealityAwareContextForObject(result, "obj-delivery"),
    undefined,
  );
  assert.equal(
    result.relatedObjects.every((entry) => entry.isDirect),
    true,
  );
});

test("TEST 9 — Background Connections", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.ok(result.backgroundConnectionIds.includes("rel-budget-capacity"));
  const budget = result.connections.find(
    (entry) => entry.connectionId === "rel-budget-capacity",
  )!;
  assert.equal(budget.isBackground, true);
  assert.equal(budget.isRevealed, false);
});

test("TEST 10 — No Fabricated Edge", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(result.relationshipSummary.fabricatedEdgeCount, 0);
  assert.equal(
    result.connections.some(
      (entry) =>
        (entry.sourceObjectId === "obj-revenue" &&
          entry.targetObjectId === "obj-capacity") ||
        (entry.sourceObjectId === "obj-capacity" &&
          entry.targetObjectId === "obj-revenue"),
    ),
    false,
  );
});

test("TEST 11 — Attention Retention", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });
  assert.ok(
    getDataRealityAwareRetainedAttentionContext(result).includes(
      "obj-capacity",
    ),
  );
  assert.equal(
    result.connections.some(
      (entry) =>
        entry.isAnchorIncident &&
        (entry.sourceObjectId === "obj-capacity" ||
          entry.targetObjectId === "obj-capacity"),
    ),
    false,
  );
});

test("TEST 12 — Recommended Retention", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(focus.focusAttention.recommendedFocus, "obj-capacity");
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });
  const attentionItem = result.contextItems.find(
    (entry) => entry.subjectId === "obj-capacity",
  )!;
  assert.equal(attentionItem.isRecommended, true);
  assert.equal(attentionItem.isDirect, false);
  assert.equal(attentionItem.revealRole, "attention-context");
});

test("TEST 13 — Unresolved Retention", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  for (const unresolvedId of result.sourceChoreography.sourceFocusAttention
    .unresolvedObjects) {
    if (unresolvedId === result.anchorObjectId) continue;
    if (
      result.relatedObjects.some((entry) => entry.objectId === unresolvedId)
    ) {
      continue;
    }
    const item = result.contextItems.find(
      (entry) => entry.subjectId === unresolvedId,
    );
    if (!item) continue;
    assert.equal(item.isUnresolved, true);
  }
});

test("TEST 14 — No Causality Inference", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  assert.ok(result.connections.every((entry) => entry.impliesCausality === false));
  const source = readFileSync(
    join(here, "dataRealityAwareConnectionsContext.ts"),
    "utf8",
  );
  assert.equal(/caused|causalityFormula|inferCausal/.test(source), false);
});

test("TEST 15 — Stable Context Ordering", () => {
  const a = resolveConnections({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  const b = resolveConnections({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  assert.deepEqual(
    a.relatedObjects.map((entry) => entry.objectId),
    b.relatedObjects.map((entry) => entry.objectId),
  );
  assert.deepEqual(a.revealedConnectionIds, b.revealedConnectionIds);
  assert.deepEqual(
    a.contextItems.map((entry) => entry.contextId),
    b.contextItems.map((entry) => entry.contextId),
  );
});

test("TEST 16 — Context Entity Identity", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const contextIds = result.contextItems
    .filter((entry) => entry.isDirect)
    .map((entry) => entry.contextId);
  for (const id of contextIds) {
    assert.ok(CONTEXT_SUBJECTS.some((entry) => entry.id === id) || id.startsWith("attention:"));
  }
  assert.ok(contextIds.includes("ctx-problem-margin"));
});

test("TEST 17 — No Fake Context Entity", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const fabricated = result.contextItems.filter(
    (entry) =>
      entry.isDirect &&
      !CONTEXT_LINKS.some((link) => link.contextId === entry.contextId),
  );
  assert.equal(fabricated.length, 0);
});

test("TEST 18 — Reset", () => {
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: resolveDataRealityAwareMVPRuntimeState({
      ...sharedRuntimeInput(),
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
    }),
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const cleared = {
    ...focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention: cleared as typeof focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
    contextLinks: CONTEXT_LINKS,
  });
  assert.equal(result.anchorObjectId, undefined);
  assert.equal(result.resetState.restoreOverviewConnections, true);
  assert.equal(result.revealedConnectionIds.length, 0);
  assert.ok(result.connections.every((entry) => entry.emphasis === "standard"));
});

test("TEST 19 — No Camera Ownership", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareConnectionsContext.ts"),
    "utf8",
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.ownsCameraChoreography,
    false,
  );
  for (const token of ["OrbitControls", "camera.position", "PerspectiveCamera"]) {
    assert.equal(source.includes(token), false, token);
  }
});

test("TEST 20 — No Geometry Ownership", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareConnectionsContext.ts"),
    "utf8",
  );
  assert.equal(
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.repositionsGeometry,
    false,
  );
  for (const token of [
    "targetPosition",
    "focusLayoutPosition",
    "BoxGeometry",
    "repositionObject",
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test("TEST 21 — No Business Logic Duplication", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareConnectionsContext.ts"),
    "utf8",
  );
  assert.equal(/computeNexoraKPIs|minInclusive|worseWhen/.test(source), false);
  assert.equal(
    /resolveDataRealityExecutiveAdvisor|generateRecommendation/.test(source),
    false,
  );
});

test("TEST 22 — Provenance", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.deepEqual(
    result.provenance.chain,
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_PROVENANCE_CHAIN,
  );
  assert.equal(
    result.provenance.immediateChoreographySource,
    dataRealityAwareSceneChoreographyIdentity,
  );
  assert.equal(result.sourceChoreography.identity.identity, dataRealityAwareSceneChoreographyIdentity);
});

test("TEST 23 — Revenue Focus", () => {
  const result = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(result.anchorObjectId, "obj-revenue");
  assert.deepEqual(
    [...result.revealedConnectionIds].sort(),
    ["rel-customer-revenue", "rel-demand-revenue"].sort(),
  );
});

test("TEST 24 — Anchor Change", () => {
  const revenue = resolveConnections({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const capacity = resolveConnections({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  assert.equal(capacity.anchorObjectId, "obj-capacity");
  assert.ok(capacity.revealedConnectionIds.includes("rel-budget-capacity"));
  assert.ok(capacity.revealedConnectionIds.includes("rel-capacity-delivery"));
  assert.equal(
    capacity.revealedConnectionIds.includes("rel-customer-revenue"),
    false,
  );
  assert.notDeepEqual(
    revenue.revealedConnectionIds,
    capacity.revealedConnectionIds,
  );
});

test("TEST 25 — Clear Focus", () => {
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(interaction, "obj-revenue");
  interaction = resetNexoraMVPObjectInteractionOverview(interaction);
  assert.equal(interaction.focusedSubject, null);

  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: resolveDataRealityAwareMVPRuntimeState({
      ...sharedRuntimeInput(),
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
    }),
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const cleared = {
    ...focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention: cleared as typeof focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, undefined);
  assert.equal(result.resetState.restoreOverviewConnections, true);
  assert.equal(result.revealedConnectionIds.length, 0);
});

test("Competing attention — no fake Revenue↔Capacity edge", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const result = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, "obj-revenue");
  assert.ok(result.retainedAttentionContextIds.includes("obj-capacity"));
  assert.equal(
    result.connections.some(
      (entry) =>
        (entry.sourceObjectId === "obj-revenue" &&
          entry.targetObjectId === "obj-capacity") ||
        (entry.sourceObjectId === "obj-capacity" &&
          entry.targetObjectId === "obj-revenue"),
    ),
    false,
  );
});

test("TEST 26 — Full P2 Consistency", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState: shared.runtimeState,
    stageObjects: STAGE_BINDING_OBJECTS,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const advisor = resolveDataRealityAwareAdvisorBinding({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const connections = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: RELATIONSHIPS,
  });

  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-capacity")!.realityState,
    "critical",
  );
  assert.equal(advisor.focus.recommendedObjectId, "obj-capacity");
  assert.equal(focus.focusAttention.primaryFocus, "obj-revenue");
  assert.equal(choreography.anchorObjectId, "obj-revenue");
  assert.equal(connections.anchorObjectId, "obj-revenue");
  assert.equal(connections.relationshipSummary.fabricatedEdgeCount, 0);
});

test("TEST 27 — Context density bounded", () => {
  const manyLinks = Array.from({ length: 12 }, (_, index) =>
    Object.freeze({
      id: `link-extra-${index}`,
      objectId: "obj-revenue",
      contextId: `ctx-extra-${index}`,
      relation: "related",
    }),
  );
  const result = resolveDataRealityAwareConnectionsContext({
    choreography: resolveChoreography({
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
    }),
    relationships: RELATIONSHIPS,
    contextLinks: manyLinks,
    contextSubjects: manyLinks.map((link) =>
      Object.freeze({ id: link.contextId, kind: "problem" as const }),
    ),
  });
  const directVisible = result.contextItems.filter(
    (entry) => entry.revealRole === "direct-context",
  );
  const hidden = result.contextItems.filter(
    (entry) => entry.revealRole === "hidden",
  );
  assert.equal(directVisible.length, 8);
  assert.equal(hidden.length, 4);
  assert.equal(result.relationshipSummary.maxDirectContextItems, 8);
  // Canonical links are not deleted — hidden remain in result.
  assert.equal(directVisible.length + hidden.length, 12);
});

test("TEST 28 — Client-bundle node:fs safety", () => {
  const productionSources = [
    "dataRealityAwareConnectionsContext.ts",
    "dataRealityAwareSceneChoreography.ts",
    "dataRealityAwareFocusAttentionExperience.ts",
    "dataRealityAwareMVPRuntimeState.ts",
    "dataRealityAdvisorMVPBridge.ts",
    "dataRealityFoundation.ts",
  ];
  for (const file of productionSources) {
    const source = readFileSync(join(here, file), "utf8");
    assert.equal(
      /from\s+["']node:fs["']|require\(\s*["']fs["']\s*\)/.test(source),
      false,
      file,
    );
    assert.equal(
      /from\s+["']\.\/dataRealityExecutiveAdvisorCertification\.ts["']/.test(
        source,
      ),
      false,
      `${file} must not import Node-only certification`,
    );
  }
  const adapter = readFileSync(
    join(
      here,
      "../nex-mvp/nexoraMVPDataRealityAwareConnectionsContext.ts",
    ),
    "utf8",
  );
  assert.equal(/from\s+["']node:fs["']/.test(adapter), false);
});

test("Renderer apply — connection emphasis without inventing edges", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(interaction, "obj-revenue");
  const base = deriveNexoraMVPStageInteractionPresentation(interaction, catalog);

  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const { connectionsContext } =
    resolveNexoraMVPDataRealityAwareConnectionsContext({
      choreography,
      relationships: RELATIONSHIPS,
      contextLinks: CONTEXT_LINKS,
      contextSubjects: CONTEXT_SUBJECTS,
    });
  const applied = applyDataRealityAwareConnectionsContextToStagePresentation(
    base,
    connectionsContext,
  );

  assert.equal(
    applied.scene.connections.length,
    base.scene.connections.length,
  );
  const customerRevenue = applied.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(customerRevenue.emphasized, true);
  const budgetCapacity = applied.scene.connections.find(
    (entry) => entry.id === "rel-budget-capacity",
  )!;
  assert.equal(budgetCapacity.emphasized, false);
  assert.ok(budgetCapacity.opacity <= 0.12);
});
