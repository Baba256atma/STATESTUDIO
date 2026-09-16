/**
 * NPA-T VAI:6 — Director Impact Scene tests A–W.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_IMPACT_BOUNDARY, VAI_IMPACT_ROLE_REGIONS, VAI_IMPACT_SAFE_ZONES } from "./vaiImpactContract.ts";
import {
  composeVaiImpactScene,
  explainVaiImpactScene,
  inspectVaiImpactSymbol,
  isPredictionUtterance,
  verifyVaiImpactScene,
} from "./vaiImpactComposer.ts";
import { formatVaiImpactDiagnostics } from "./vaiImpactDiagnostics.ts";
import { symbolIdOf } from "./vaiTheatreProjector.ts";
import { verifyVaiTheatreSymbolLanguage } from "./vaiTheatreProjector.ts";
import { verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import { resolveVaiCausalSafety } from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";

const CAPACITY = "ctx-problem-capacity";

function trusted(id: string, name: string, extras: Partial<VaiTrustedObservationSource> = {}): VaiTrustedObservationSource {
  return {
    kind: "TRUSTED_OBSERVATION",
    variableId: id,
    displayName: name,
    sourceKind: "OBJECT_ATTRIBUTE",
    authority: "MO:1",
    sourceRef: `attr:${id}`,
    semanticStatus: "CONFIRMED",
    semanticMeaning: name,
    relatedObjectIds: [CAPACITY],
    ...extras,
  };
}

function vai1(source: VaiTrustedObservationSource | VaiCsvFieldSource): VaiVariable {
  return resolveVaiVariables({
    analysisContext: { analysisContextId: "vai1" },
    applications: [{ source, role: "CONTROL" }],
  }).variables[0]!;
}

function ev(id: string, kind: VaiRelationshipEvidenceRef["kind"] = "ASSOCIATION", polarity: VaiRelationshipEvidenceRef["polarity"] = "SUPPORTING"): VaiRelationshipEvidenceRef {
  return { evidenceRef: id, kind, polarity, authority: "CC:8" };
}

function bundleForCapacity(extras?: {
  readonly relationship?: VaiAdvisorBundle["relationship"] | "default" | "none";
  readonly extraRoles?: Parameters<typeof resolveVaiObjectVariableRoles>[0]["roleEvidence"];
  readonly extraVariables?: VaiVariable[];
  readonly sixRoles?: boolean;
  readonly staffingRole?: "LEVER" | "CONTROL";
}): { readonly variables: VaiVariable[]; readonly bundle: VaiAdvisorBundle } {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const backlog = vai1(trusted("vai:backlog", "Backlog"));
  const season = vai1(trusted("vai:seasonality", "Seasonality"));
  const otd = vai1(trusted("vai:otd", "OTD %", { sourceKind: "KPI_OBSERVATION" }));
  const machine = vai1(trusted("vai:machine", "Machine Availability"));
  const shift = vai1(trusted("vai:shift", "Shift Length"));
  const moderator = vai1(trusted("vai:availability", "Demand Pressure"));
  const extrasVars = extras?.extraVariables ?? [];
  const variables = extras?.sixRoles
    ? [staffing, otd, backlog, moderator, shift, season, ...extrasVars]
    : [staffing, backlog, season, otd, machine, ...extrasVars];
  const staffingRole = extras?.staffingRole ?? "LEVER";
  const roleEvidence = extras?.sixRoles
    ? [
        { variableId: "vai:staffing", role: "LEVER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "staff-lever" },
        { variableId: "vai:otd", role: "OUTCOME" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "otd-out" },
        { variableId: "vai:backlog", role: "PATH_OF_EFFECT" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "path" },
        { variableId: "vai:availability", role: "MODERATOR" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "mod" },
        { variableId: "vai:shift", role: "CONTROL" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "ctrl" },
        { variableId: "vai:seasonality", role: "CONFOUNDER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "season" },
        ...(extras?.extraRoles ?? []),
      ]
    : [
        { variableId: "vai:staffing", role: staffingRole, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "staff-role" },
        { variableId: "vai:backlog", role: "PATH_OF_EFFECT" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "path" },
        { variableId: "vai:seasonality", role: "CONFOUNDER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "season" },
        { variableId: "vai:machine", role: "LEVER" as const, status: "CANDIDATE" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "m-lever" },
        { variableId: "vai:machine", role: "MODERATOR" as const, status: "CANDIDATE" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "m-mod" },
        ...(extras?.extraRoles ?? []),
      ];
  const roleResult = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-capacity-vars",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: variables.map((item) => item.variableId),
    },
    variables,
    roleEvidence,
  });
  const relationship = extras?.relationship === "none"
    ? null
    : extras?.relationship && extras.relationship !== "default"
      ? extras.relationship
      : resolveVaiCausalSafety({
          relationshipId: "rel-demand-delay",
          analysisContextId: "ctx-capacity-vars",
          source: vai1(trusted("vai:demand", "Demand")),
          target: { kind: "VARIABLE", id: "vai:delay" },
          evidence: [ev("a1"), ev("a2")],
          scope: { objectScope: CAPACITY },
          vai2: { confounders: roleResult.items.filter((item) => item.primaryRole === "CONFOUNDER") },
        }).relationship;
  return {
    variables,
    bundle: {
      analysisContextId: "ctx-capacity-vars",
      focalObject: { id: CAPACITY, label: "Capacity Gap" },
      variables,
      roleResult,
      relationship,
    },
  };
}

test("VAI:6 reuses Director/Theatre without a second Director", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(verifyVaiTheatreSymbolLanguage().ok, true);
  assert.equal(verifyVaiImpactScene().ok, true);
  assert.equal(VAI_IMPACT_BOUNDARY.secondDirector, false);
  assert.equal(VAI_IMPACT_BOUNDARY.startsVai7, false);
  assert.equal(VAI_IMPACT_BOUNDARY.causalGraphAuthority, false);
});

test("A — Basic Impact Scene keeps Capacity Gap dominant", () => {
  const { bundle } = bundleForCapacity({
    extraRoles: [{ variableId: "vai:otd", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "otd" }],
  });
  const scene = composeVaiImpactScene({ bundle });
  assert.equal(scene.apply, true);
  assert.equal(scene.sceneIntent, "IMPACT_ANALYSIS");
  assert.equal(scene.focalObjectLabel, "Capacity Gap");
  assert.equal(scene.focalDominant, true);
  const focal = scene.placements.find((item) => item.kind === "EXECUTIVE_OBJECT");
  assert.equal(focal?.scaleToken, "size-dominant");
  assert.equal(focal?.regionId, VAI_IMPACT_ROLE_REGIONS.FOCAL.regionId);
  assert.match(scene.narrative ?? "", /Staffing Level/);
  assert.match(scene.narrative ?? "", /Backlog/);
  assert.match(scene.narrative ?? "", /Seasonality/);
});

test("B — Six role regions are deterministic", () => {
  const { bundle } = bundleForCapacity({ sixRoles: true, relationship: "none" });
  const scene = composeVaiImpactScene({ bundle });
  const byRole = new Map(scene.placements.filter((item) => item.kind === "VARIABLE_SYMBOL").map((item) => [item.role, item.regionId]));
  assert.equal(byRole.get("LEVER"), VAI_IMPACT_ROLE_REGIONS.LEVER.regionId);
  assert.equal(byRole.get("OUTCOME"), VAI_IMPACT_ROLE_REGIONS.OUTCOME.regionId);
  assert.equal(byRole.get("PATH_OF_EFFECT"), VAI_IMPACT_ROLE_REGIONS.PATH_OF_EFFECT.regionId);
  assert.equal(byRole.get("MODERATOR"), VAI_IMPACT_ROLE_REGIONS.MODERATOR.regionId);
  assert.equal(byRole.get("CONTROL"), VAI_IMPACT_ROLE_REGIONS.CONTROL.regionId);
  assert.equal(byRole.get("CONFOUNDER"), VAI_IMPACT_ROLE_REGIONS.CONFOUNDER.regionId);
});

test("C — Director does not resolve roles", () => {
  const lever = composeVaiImpactScene({ bundle: bundleForCapacity({ staffingRole: "LEVER" }).bundle });
  const control = composeVaiImpactScene({ bundle: bundleForCapacity({ staffingRole: "CONTROL" }).bundle });
  const leverPlace = lever.placements.find((item) => item.participantId.includes("vai:staffing"));
  const controlPlace = control.placements.find((item) => item.participantId.includes("vai:staffing"));
  assert.equal(leverPlace?.role, "LEVER");
  assert.equal(controlPlace?.role, "CONTROL");
  assert.equal(leverPlace?.regionId, VAI_IMPACT_ROLE_REGIONS.LEVER.regionId);
  assert.equal(controlPlace?.regionId, VAI_IMPACT_ROLE_REGIONS.CONTROL.regionId);
});

test("D — No Variable to Object promotion", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity().bundle });
  assert.equal(scene.objectsCreated, false);
  assert.ok(scene.placements.filter((item) => item.kind === "VARIABLE_SYMBOL").every((item) => item.scaleToken === "size-subordinate"));
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});

test("E — Association connector is not upgraded to causal", () => {
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity().bundle });
  assert.ok(scene.connectors.every((item) => item.connectorType === "association-neutral"));
  assert.ok(scene.connectors.every((item) => item.geometryUpgradedSemantics === false));
});

test("F — Causal hypothesis remains uncertain", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-h",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:demand", "Demand")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("a1"), ev("a2")],
    scope: { objectScope: CAPACITY },
    causalHypothesis: true,
  }).relationship;
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ relationship }).bundle });
  assert.ok(scene.connectors.every((item) => item.connectorType === "hypothesis" || item.connectorType === "association-neutral"));
  if (relationship.relationshipStatus === "CAUSAL_HYPOTHESIS") {
    assert.ok(scene.connectors.every((item) => item.connectorType === "hypothesis"));
  }
  assert.ok(scene.connectors.every((item) => item.connectorType !== "causal-confirmed"));
});

test("G — Manager-asserted cause stays attributed", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-m",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:downtime", "Machine downtime")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("obs", "CO_OBSERVATION")],
    scope: { objectScope: CAPACITY },
    managerAssertion: { statement: "The delay is caused by machine downtime.", sourceRef: "manager:downtime" },
  }).relationship;
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ relationship }).bundle });
  assert.ok(scene.connectors.every((item) => item.connectorType === "manager-view"));
});

test("H — Strong causal visual requires VAI:3 gate", () => {
  const associated = composeVaiImpactScene({ bundle: bundleForCapacity().bundle });
  assert.ok(associated.connectors.every((item) => item.connectorType !== "causal-confirmed"));
  const gated = resolveVaiCausalSafety({
    relationshipId: "rel-gated",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:demand", "Demand")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("core")],
    scope: { objectScope: CAPACITY },
    coreInt3: { relationKind: "supported-causal", causeEstablished: true },
  }).relationship;
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ relationship: gated }).bundle });
  assert.equal(gated.evidenceSupportedCausal, true);
  assert.ok(scene.connectors.every((item) => item.connectorType === "causal-confirmed"));
});

test("I — Confounder remains discoverable", () => {
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity().bundle });
  assert.equal(scene.confounderVisible, true);
  const season = scene.placements.find((item) => item.participantId.includes("vai:seasonality"));
  assert.equal(season?.regionId, VAI_IMPACT_ROLE_REGIONS.CONFOUNDER.regionId);
});

test("J — Ambiguous role is not placed as a single resolved role", () => {
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity().bundle });
  const machine = scene.placements.find((item) => item.participantId.includes("vai:machine"));
  assert.equal(machine?.role, "AMBIGUOUS");
  assert.equal(machine?.regionId, VAI_IMPACT_ROLE_REGIONS.AMBIGUOUS.regionId);
  assert.notEqual(machine?.regionId, VAI_IMPACT_ROLE_REGIONS.LEVER.regionId);
});

test("K — Unresolved CAP_AV is not Available Capacity", () => {
  const capAv = vai1({
    kind: "CSV_FIELD",
    variableId: "vai:csv:CAP_AV",
    sourceColumn: "CAP_AV",
    fieldId: "cap",
    proposedMeaning: "Available Capacity",
    confirmedMeaning: null,
    confirmationSource: "none",
    semanticState: "AMBIGUOUS",
    sourceRef: "csv:CAP_AV",
    relatedObjectIds: [CAPACITY],
  });
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ extraVariables: [capAv] }).bundle });
  const labels = scene.theatreProjection?.symbols.map((item) => item.displayLabel).join(" ") ?? "";
  assert.match(labels, /CAP_AV/);
  assert.doesNotMatch(labels, /Available Capacity/);
  assert.doesNotMatch(scene.narrative ?? "", /Available Capacity/);
});

test("L — Conflicting evidence is not cleaned into a causal story", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-c",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:staffing", "Staffing Level")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("ok", "ASSOCIATION", "SUPPORTING"), ev("no", "ASSOCIATION", "CONFLICTING")],
    scope: { objectScope: CAPACITY },
  }).relationship;
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ relationship }).bundle });
  assert.ok(scene.theatreProjection?.symbols.some((item) => item.evidencePresentation === "mixed"));
  assert.ok(scene.connectors.every((item) => item.connectorType !== "causal-confirmed"));
});

test("M — Density collapses extras without deleting them", () => {
  const extras = Array.from({ length: 8 }, (_, index) => vai1(trusted(`vai:extra-${index}`, `Extra ${index}`)));
  const extraRoles = extras.map((item) => ({
    variableId: item.variableId,
    role: "CONTROL" as const,
    status: "SUPPORTED" as const,
    basis: "OBJECT_ATTRIBUTE" as const,
    sourceRef: item.variableId,
  }));
  const scene = composeVaiImpactScene({
    bundle: bundleForCapacity({ extraVariables: extras, extraRoles }).bundle,
    complexity: "SIMPLE",
  });
  assert.ok(scene.hiddenCount > 0);
  assert.equal(scene.confounderVisible, true);
  assert.ok((scene.theatreProjection?.symbols.length ?? 0) > scene.placements.filter((item) => item.kind === "VARIABLE_SYMBOL").length);
});

test("N — Safe zones are respected", () => {
  const scene = composeVaiImpactScene({ bundle: bundleForCapacity({ sixRoles: true }).bundle });
  for (const item of scene.placements) {
    assert.ok(item.x > VAI_IMPACT_SAFE_ZONES.left.reservedUntil);
    assert.ok(item.x < VAI_IMPACT_SAFE_ZONES.right.reservedFrom);
    assert.ok(item.y > VAI_IMPACT_SAFE_ZONES.top.reservedUntil);
    assert.ok(item.y < VAI_IMPACT_SAFE_ZONES.bottom.reservedFrom);
  }
});

test("O — Equivalent inputs produce a stable scene identity", () => {
  const { bundle } = bundleForCapacity();
  const a = composeVaiImpactScene({ bundle, theatreWidth: 1440, theatreHeight: 900 });
  const b = composeVaiImpactScene({ bundle, theatreWidth: 1440, theatreHeight: 900 });
  assert.equal(a.sceneId, b.sceneId);
  assert.deepEqual(a.placements, b.placements);
});

test("P — Refresh follows new VAI input without mutation", () => {
  const first = bundleForCapacity({ staffingRole: "LEVER" });
  const before = JSON.stringify(first.variables);
  const scene1 = composeVaiImpactScene({ bundle: first.bundle });
  const second = bundleForCapacity({ staffingRole: "CONTROL" });
  const scene2 = composeVaiImpactScene({ bundle: second.bundle });
  assert.notEqual(
    scene1.placements.find((item) => item.participantId.includes("vai:staffing"))?.regionId,
    scene2.placements.find((item) => item.participantId.includes("vai:staffing"))?.regionId,
  );
  assert.equal(JSON.stringify(first.variables), before);
});

test("Q — Variable inspection remains VAI:5 read-only", () => {
  const { bundle } = bundleForCapacity();
  const scene = composeVaiImpactScene({ bundle });
  const inspection = inspectVaiImpactSymbol({
    scene,
    symbolId: symbolIdOf("ctx-capacity-vars", "vai:staffing"),
    bundle,
  });
  assert.equal(inspection.writes.stage, false);
  assert.equal(inspection.writes.objects, false);
  assert.equal(inspection.secondAdvisorState, false);
});

test("R — Advisor handoff uses VAI:4", () => {
  const { bundle } = bundleForCapacity();
  const scene = composeVaiImpactScene({ bundle });
  const composition = explainVaiImpactScene({ scene, bundle, utterance: "Explain this impact map." });
  assert.equal(composition.apply, true);
  assert.match(composition.response ?? "", /Staffing Level|potential lever|Seasonality/);
});

test("S — Missing VAI projection invents no Impact Scene", () => {
  const scene = composeVaiImpactScene({ bundle: null });
  assert.equal(scene.apply, false);
  assert.equal(scene.placements.length, 0);
});

test("T — No intervention prediction", () => {
  assert.equal(isPredictionUtterance("What happens if staffing increases 10%?"), true);
  const { bundle } = bundleForCapacity();
  const scene = composeVaiImpactScene({ bundle });
  const composition = explainVaiImpactScene({
    scene,
    bundle,
    utterance: "What happens if staffing increases 10%?",
  });
  assert.equal(scene.interventionPredicted, false);
  assert.equal(scene.outcomeDelta, null);
  assert.doesNotMatch(composition.response ?? "", /10%|percentage points|will improve OTD/i);
});

test("U — Lever inspection does not create a Scenario", () => {
  const { bundle } = bundleForCapacity();
  const scene = composeVaiImpactScene({ bundle });
  inspectVaiImpactSymbol({ scene, symbolId: symbolIdOf("ctx-capacity-vars", "vai:staffing"), bundle });
  assert.equal(scene.scenarioCreated, false);
});

test("V — Existing Theatre integrity", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "problem",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY,
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({ stageState: state, catalog });
  const { bundle } = bundleForCapacity();
  const scene = composeVaiImpactScene({ bundle });
  assert.ok((theatre.visibleExecutiveObjects?.length ?? 0) > 0);
  assert.equal(scene.causalGraphCreated, false);
  const without = executeNexoraConversationalExperience({
    utterance: "Show me the stage.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    messageIdSeed: "vai6-integrity",
  });
  assert.equal(without.vaiImpactScene ?? null, null);
  const withVai = executeNexoraConversationalExperience({
    utterance: "Explain this impact map.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    messageIdSeed: "vai6-overlay",
  });
  assert.equal(withVai.vaiImpactScene?.apply, true);
  assert.ok(formatVaiImpactDiagnostics(withVai.vaiImpactScene!).sceneId);
});

test("W — Mutation safety", () => {
  const { variables, bundle } = bundleForCapacity();
  const before = JSON.stringify(variables);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  composeVaiImpactScene({ bundle });
  assert.equal(JSON.stringify(variables), before);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});
