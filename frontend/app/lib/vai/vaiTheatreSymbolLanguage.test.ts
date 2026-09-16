/**
 * NPA-T VAI:5 — Theatre Symbol Language tests A–S.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  classifyNexoraDecisionTheatreVisualFamily,
  NEXORA_DECISION_THEATRE_VARIABLE_SYMBOL_ID_PREFIX,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { resolveStageEntityPresentationRole } from "@/app/lib/decision-theatre/nexoraStageEntityPresentationRole.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_THEATRE_BOUNDARY, VAI_THEATRE_ROLE_GRAMMAR, VAI_THEATRE_VISIBLE_LIMIT } from "./vaiTheatreContract.ts";
import { formatVaiTheatreDiagnostics } from "./vaiTheatreDiagnostics.ts";
import { inspectVaiTheatreSymbol } from "./vaiTheatreInspection.ts";
import { projectVaiTheatreSymbols, symbolIdOf, verifyVaiTheatreSymbolLanguage } from "./vaiTheatreProjector.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import { resolveVaiCausalSafety } from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import { verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";

const CAPACITY = "ctx-problem-capacity";
const LEAK = /\b(?:VAI:[1-6]|CC:\d|CORE-INT:3|causalAssertion|role resolver|semantic authority|DTH:\d|DIR:1)\b/i;

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
        { variableId: "vai:staffing", role: "LEVER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "staff-lever" },
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

test("VAI:5 reuses VAI:1–4 and Theatre families without a second Stage", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(verifyVaiTheatreSymbolLanguage().ok, true);
  assert.equal(VAI_THEATRE_BOUNDARY.secondStage, false);
  assert.equal(VAI_THEATRE_BOUNDARY.startsVai6, false);
});

test("A — Variable is not an Object", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  const staffing = projection.symbols.find((item) => item.variableId === "vai:staffing");
  assert.equal(staffing?.visualFamily, "VARIABLE_SYMBOL");
  assert.equal(staffing?.isExecutiveObject, false);
  assert.equal(staffing?.isStageObject, false);
  assert.equal(staffing?.analyticalRole, "LEVER");
  assert.equal(projection.objectsCreated, false);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.equal(classifyNexoraDecisionTheatreVisualFamily({ id: staffing!.symbolId }), "VARIABLE_SYMBOL");
  assert.equal(resolveStageEntityPresentationRole({ entityId: staffing!.symbolId }).presentationRole, "ANALYTICAL_SYMBOL");
  assert.ok(staffing!.symbolId.startsWith(NEXORA_DECISION_THEATRE_VARIABLE_SYMBOL_ID_PREFIX));
});

test("B — Six roles have distinguishable visual grammar", () => {
  const { bundle } = bundleForCapacity({ sixRoles: true, relationship: "none" });
  const projection = projectVaiTheatreSymbols({ bundle });
  const byRole = new Map(projection.symbols.map((item) => [item.analyticalRole, item]));
  for (const role of Object.keys(VAI_THEATRE_ROLE_GRAMMAR) as (keyof typeof VAI_THEATRE_ROLE_GRAMMAR)[]) {
    const symbol = byRole.get(role);
    assert.ok(symbol, role);
    assert.equal(symbol!.geometryToken, VAI_THEATRE_ROLE_GRAMMAR[role].geometryToken);
    assert.equal(symbol!.iconToken, VAI_THEATRE_ROLE_GRAMMAR[role].iconToken);
    assert.equal(symbol!.colorNotSoleSignal, true);
  }
  const geometries = new Set(projection.symbols.map((item) => item.geometryToken));
  const icons = new Set(projection.symbols.map((item) => item.iconToken));
  assert.equal(geometries.size, 6);
  assert.equal(icons.size, 6);
});

test("C — Variable Symbol remains visually subordinate", () => {
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.equal(projection.focalObject?.scaleToken, "size-dominant");
  assert.equal(projection.focalObject?.visualFamily, "EXECUTIVE_OBJECT");
  assert.ok(projection.symbols.every((item) => item.scaleToken === "size-subordinate"));
  assert.ok(projection.symbols.every((item) => item.dimensionalTreatment === "2d-overlay-token"));
});

test("D — LEVER suggests actionability without guaranteed improvement", () => {
  const { bundle } = bundleForCapacity();
  const lever = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:staffing")!;
  assert.equal(lever.geometryToken, "geometry-knob");
  assert.match(lever.microLabel, /Can change/);
  assert.ok(VAI_THEATRE_ROLE_GRAMMAR.LEVER.mustNotInterpretAs.includes("guaranteed improvement"));
  assert.doesNotMatch(lever.accessibilityLabel, /will improve|guaranteed/i);
});

test("E — PATH_OF_EFFECT is not a confirmed causal flow", () => {
  const { bundle } = bundleForCapacity();
  const path = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:backlog")!;
  assert.equal(path.analyticalRole, "PATH_OF_EFFECT");
  assert.notEqual(path.connectorType, "causal-confirmed");
  assert.equal(path.causalPresentation, "unconfirmed");
});

test("F — CONFOUNDER is not a Risk Object", () => {
  const { bundle } = bundleForCapacity();
  const confounder = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:seasonality")!;
  assert.equal(confounder.analyticalRole, "CONFOUNDER");
  assert.equal(confounder.visualFamily, "VARIABLE_SYMBOL");
  assert.match(confounder.microLabel, /Another explanation/);
  assert.ok(VAI_THEATRE_ROLE_GRAMMAR.CONFOUNDER.mustNotInterpretAs.includes("Risk Object"));
});

test("G — Ambiguous role is not collapsed", () => {
  const { bundle } = bundleForCapacity();
  const machine = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:machine")!;
  assert.equal(machine.roleAmbiguous, true);
  assert.equal(machine.analyticalRole, null);
  assert.match(machine.microLabel, /Lever \/ Moderator \?/);
  assert.ok(machine.candidateRoles.includes("LEVER"));
  assert.ok(machine.candidateRoles.includes("MODERATOR"));
});

test("H — Unresolved CAP_AV is not Available Capacity", () => {
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
  const { bundle } = bundleForCapacity({ extraVariables: [capAv] });
  const symbol = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:csv:CAP_AV");
  assert.ok(symbol);
  assert.equal(symbol!.displayLabel, "CAP_AV");
  assert.match(symbol!.microLabel, /Meaning unresolved/);
  assert.doesNotMatch(symbol!.displayLabel, /Available Capacity/);
  assert.doesNotMatch(symbol!.accessibilityLabel, /Available Capacity/);
});

test("I — ASSOCIATED uses a neutral association connector", () => {
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.ok(projection.symbols.every((item) => item.connectorType === "association-neutral"));
  assert.ok(projection.symbols.every((item) => item.connectorType !== "causal-confirmed"));
});

test("J — Manager-asserted cause is attributed", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-m",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:downtime", "Machine downtime")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("obs", "CO_OBSERVATION")],
    scope: { objectScope: CAPACITY },
    managerAssertion: {
      statement: "The delay is caused by machine downtime.",
      sourceRef: "manager:downtime",
      assertedCauseVariableId: "machine downtime",
    },
  }).relationship;
  const { bundle } = bundleForCapacity({ relationship });
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.ok(projection.symbols.every((item) => item.connectorType === "manager-view"));
  assert.ok(projection.symbols.every((item) => item.managerAssertionAttributed));
  assert.match(projection.symbols[0]!.accessibilityLabel, /manager/i);
});

test("K — Strong causal visual requires VAI:3 EVIDENCE_SUPPORTED_CAUSAL", () => {
  const associated = bundleForCapacity();
  assert.notEqual(projectVaiTheatreSymbols({ bundle: associated.bundle }).symbols[0]?.connectorType, "causal-confirmed");
  const gated = resolveVaiCausalSafety({
    relationshipId: "rel-gated",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:demand", "Demand")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("core")],
    scope: { objectScope: CAPACITY },
    coreInt3: { relationKind: "supported-causal", causeEstablished: true },
  }).relationship;
  const { bundle } = bundleForCapacity({ relationship: gated });
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.equal(gated.evidenceSupportedCausal, true);
  assert.ok(projection.symbols.every((item) => item.connectorType === "causal-confirmed"));
});

test("L — Conflicting evidence remains visible", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-c",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:staffing", "Staffing Level")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("ok", "ASSOCIATION", "SUPPORTING"), ev("no", "ASSOCIATION", "CONFLICTING")],
    scope: { objectScope: CAPACITY },
  }).relationship;
  const { bundle } = bundleForCapacity({ relationship });
  const staffing = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:staffing")!;
  assert.equal(staffing.evidencePresentation, "mixed");
});

test("M — Density hides extra Variables without deleting them", () => {
  const extras = Array.from({ length: 8 }, (_, index) => vai1(trusted(`vai:extra-${index}`, `Extra ${index}`)));
  const extraRoles = extras.map((item) => ({
    variableId: item.variableId,
    role: "CONTROL" as const,
    status: "SUPPORTED" as const,
    basis: "OBJECT_ATTRIBUTE" as const,
    sourceRef: item.variableId,
  }));
  const { bundle } = bundleForCapacity({ extraVariables: extras, extraRoles });
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.ok(projection.symbols.length > VAI_THEATRE_VISIBLE_LIMIT);
  assert.equal(projection.visibleSymbolIds.length, VAI_THEATRE_VISIBLE_LIMIT);
  assert.equal(projection.collapsedSymbolIds.length, projection.symbols.length - VAI_THEATRE_VISIBLE_LIMIT);
  assert.ok(projection.symbols.some((item) => item.visibility === "collapsed"));
});

test("N — Inspection is read-only", () => {
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  const staffingId = symbolIdOf("ctx-capacity-vars", "vai:staffing");
  const inspection = inspectVaiTheatreSymbol({ projection, symbolId: staffingId, bundle });
  assert.equal(inspection.presentationState, "expanded");
  assert.equal(inspection.writes.objects, false);
  assert.equal(inspection.writes.stage, false);
  assert.equal(inspection.writes.decision, false);
  assert.equal(inspection.writes.execution, false);
});

test("O — Advisor handoff reuses VAI:4", () => {
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  const inspection = inspectVaiTheatreSymbol({
    projection,
    symbolId: symbolIdOf("ctx-capacity-vars", "vai:staffing"),
    bundle,
  });
  assert.equal(inspection.secondAdvisorState, false);
  assert.equal(inspection.advisorHandoffApplies, true);
  assert.match(inspection.advisorResponse ?? "", /Staffing Level/);
});

test("P — Missing VAI projection invents no symbols", () => {
  const projection = projectVaiTheatreSymbols({ bundle: null });
  assert.equal(projection.apply, false);
  assert.equal(projection.symbols.length, 0);
  assert.equal(projection.invented, false);
});

test("Q — No architecture leakage", () => {
  const { bundle } = bundleForCapacity();
  const projection = projectVaiTheatreSymbols({ bundle });
  for (const symbol of projection.symbols) {
    assert.doesNotMatch(symbol.displayLabel, LEAK);
    assert.doesNotMatch(symbol.microLabel, LEAK);
    assert.doesNotMatch(symbol.accessibilityLabel, LEAK);
  }
});

test("R — Mutation safety", () => {
  const { variables, bundle } = bundleForCapacity();
  const before = JSON.stringify(variables);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const projection = projectVaiTheatreSymbols({ bundle });
  inspectVaiTheatreSymbol({
    projection,
    symbolId: symbolIdOf("ctx-capacity-vars", "vai:staffing"),
    bundle,
  });
  assert.equal(JSON.stringify(variables), before);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.equal(projection.stageMutated, false);
});

test("S — Existing Theatre integrity", () => {
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
  const symbols = projectVaiTheatreSymbols({ bundle });
  assert.ok((theatre.visibleExecutiveObjects?.length ?? 0) > 0);
  assert.ok(symbols.symbols.every((item) => item.visualFamily === "VARIABLE_SYMBOL"));
  assert.ok(theatre.visibleExecutiveObjects?.every((item) => item.visualFamily === "EXECUTIVE_OBJECT"));
  const turn = executeNexoraConversationalExperience({
    utterance: "Show me the stage.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    messageIdSeed: "vai5-theatre-integrity",
  });
  assert.equal(turn.vaiTheatreProjection ?? null, null);
  const withVai = executeNexoraConversationalExperience({
    utterance: "What variables matter here?",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    messageIdSeed: "vai5-overlay",
  });
  assert.equal(withVai.vaiTheatreProjection?.apply, true);
  assert.equal(withVai.vaiTheatreProjection?.objectsCreated, false);
  assert.ok(formatVaiTheatreDiagnostics(withVai.vaiTheatreProjection!).length > 0);
});
