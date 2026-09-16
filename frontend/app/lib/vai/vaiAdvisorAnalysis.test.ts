/**
 * NPA-T VAI:4 — Advisor Variable Analysis tests A–R.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { formatVaiAdvisorDiagnostics } from "./vaiAdvisorDiagnostics.ts";
import { composeVaiAdvisorAnalysis, verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import { VAI_ADVISOR_BOUNDARY } from "./vaiAdvisorContract.ts";
import type { VaiAdvisorBundle, VaiAdvisorSession } from "./vaiAdvisorContract.ts";
import { resolveVaiCausalSafety } from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";

const CAPACITY = "ctx-problem-capacity";
const DEMAND_SURGE = "ctx-scenario-demand";
const LEAK = /\b(?:VAI:[1-4]|CC:8|CORE-INT:3|causal resolver|semantic authority|causalAssertion|role registry)\b/i;

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
  readonly includeRevenue?: boolean;
  readonly relationship?: VaiAdvisorBundle["relationship"] | "default" | "none";
  readonly extraRoles?: Parameters<typeof resolveVaiObjectVariableRoles>[0]["roleEvidence"];
  readonly extraVariables?: VaiVariable[];
}): { readonly variables: VaiVariable[]; readonly bundle: VaiAdvisorBundle } {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const backlog = vai1(trusted("vai:backlog", "Backlog"));
  const season = vai1(trusted("vai:seasonality", "Seasonality"));
  const otd = vai1(trusted("vai:otd", "OTD %", { sourceKind: "KPI_OBSERVATION", relatedObjectIds: [CAPACITY] }));
  const machine = vai1(trusted("vai:machine", "Machine Availability"));
  const revenue = vai1(trusted("vai:revenue", "Revenue", { relatedObjectIds: ["obj-finance"] }));
  const variables = [
    staffing,
    backlog,
    season,
    otd,
    machine,
    ...(extras?.includeRevenue ? [revenue] : []),
    ...(extras?.extraVariables ?? []),
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
    relevanceLinks: extras?.includeRevenue
      ? [{ variableId: "vai:revenue", objectId: CAPACITY, basis: "NAME_SIMILARITY", trusted: false, sourceRef: "name" }]
      : [],
    roleEvidence: [
      { variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "staff-lever" },
      { variableId: "vai:backlog", role: "PATH_OF_EFFECT", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "path" },
      { variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" },
      { variableId: "vai:machine", role: "LEVER", status: "CANDIDATE", basis: "OBJECT_ATTRIBUTE", sourceRef: "m-lever" },
      { variableId: "vai:machine", role: "MODERATOR", status: "CANDIDATE", basis: "OBJECT_ATTRIBUTE", sourceRef: "m-mod" },
      ...(extras?.extraRoles ?? []),
    ],
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
      staleObjectLabel: "Capacity Expansion Plan",
    },
  };
}

function ask(utterance: string, bundle: VaiAdvisorBundle, previous?: VaiAdvisorSession | null, focalOverride?: { id: string; label: string } | null) {
  return composeVaiAdvisorAnalysis({ utterance, bundle, previousSession: previous, focalOverride });
}

test("VAI:4 reuses VAI:1–3 without a second Advisor", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(VAI_ADVISOR_BOUNDARY.secondAdvisor, false);
  assert.equal(VAI_ADVISOR_BOUNDARY.startsVai5, false);
});

test("A — Basic Variable question uses relevant Variables only", () => {
  const { bundle } = bundleForCapacity({ includeRevenue: true });
  const result = ask("What variables matter here?", bundle);
  assert.match(result.response ?? "", /Staffing Level|Backlog|Seasonality/);
  assert.doesNotMatch(result.response ?? "", /Revenue/);
  assert.equal(result.focalObjectId, CAPACITY);
  assert.equal(result.npsPathCreated, false);
});

test("B — Lever question does not claim improvement", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What can I potentially change?", bundle);
  assert.match(result.response ?? "", /Staffing Level is a potential lever/);
  assert.doesNotMatch(result.response ?? "", /hire|buy another/i);
  assert.doesNotMatch(result.response ?? "", /changing it will improve/i);
  assert.doesNotMatch(result.response ?? "", /Machine Availability is a potential lever/);
});

test("C — Outcome question requires VAI:2 OUTCOME", () => {
  const { bundle } = bundleForCapacity();
  const none = ask("What outcome are we watching?", bundle);
  assert.match(none.response ?? "", /not automatically the outcome|do not have a confirmed outcome/i);
  const withOutcome = bundleForCapacity({
    extraRoles: [{ variableId: "vai:otd", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "otd-out" }],
  });
  const result = ask("What outcome are we watching?", withOutcome.bundle);
  assert.match(result.response ?? "", /OTD % is the main outcome/);
});

test("D — Causal question explains association without a cause claim", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-d",
    analysisContextId: "ctx-capacity-vars",
    source: demand,
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("a1"), ev("a2")],
    scope: { objectScope: CAPACITY },
  }).relationship;
  const { bundle } = bundleForCapacity({ relationship });
  const result = ask("Is demand causing the delay?", bundle);
  assert.match(result.response ?? "", /associated/i);
  assert.doesNotMatch(result.response ?? "", /\bcauses\b|\bdrove\b|is the cause of/i);
  assert.equal(result.causalUpgrade, false);
});

test("E — Manager-asserted cause stays attributed", () => {
  const downtime = vai1(trusted("vai:downtime", "Machine downtime"));
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-m",
    analysisContextId: "ctx-capacity-vars",
    source: downtime,
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
  const result = ask("Is demand causing the delay?", bundle);
  assert.match(result.response ?? "", /You identified machine downtime as the cause/);
  assert.match(result.response ?? "", /has not independently confirmed/);
});

test("F — Confounder limits causal confidence", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What could explain this relationship?", bundle);
  assert.match(result.response ?? "", /Seasonality/);
  assert.match(result.response ?? "", /alternative explanation/);
  assert.doesNotMatch(result.response ?? "", /caused the Capacity Gap/i);
});

test("G — Ambiguous role preserves both possibilities", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What variables matter here?", bundle);
  assert.match(result.response ?? "", /Machine Availability is relevant, but its analytical role is not yet clear/);
  assert.match(result.response ?? "", /management can change/);
  assert.match(result.response ?? "", /changes how other factors/);
});

test("H — Ambiguous CAP_AV is not Available Capacity", () => {
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
  const result = ask("What variables matter here?", bundle);
  assert.match(result.response ?? "", /CAP_AV/);
  assert.match(result.response ?? "", /cannot safely use it as Available Capacity/);
  assert.doesNotMatch(result.response ?? "", /CAP_AV is Available Capacity|Available Capacity is relevant/i);
  assert.match(result.response ?? "", /not confirmed/);
});

test("I — Conflicting evidence is explicit and not a recommendation", () => {
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-c",
    analysisContextId: "ctx-capacity-vars",
    source: vai1(trusted("vai:staffing", "Staffing Level")),
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [ev("ok", "ASSOCIATION", "SUPPORTING"), ev("no", "ASSOCIATION", "CONFLICTING")],
    scope: { objectScope: CAPACITY },
  }).relationship;
  const { bundle } = bundleForCapacity({ relationship });
  const result = ask("Is demand causing the delay?", bundle);
  assert.match(result.response ?? "", /mixed/i);
  assert.doesNotMatch(result.response ?? "", /hire|buy/i);
  assert.doesNotMatch(result.response ?? "", /hire five|buy another machine/i);
});

test("J — Why role is grounded in VAI:2 without causal promotion", () => {
  const { bundle } = bundleForCapacity();
  const first = ask("What can I potentially change?", bundle);
  const result = ask("Why is staffing a lever?", bundle, first.nextSession);
  assert.match(result.response ?? "", /potential lever/);
  assert.match(result.response ?? "", /does not prove that changing it will solve/);
});

test("K — Why not cause is grounded in VAI:3", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("Why can’t you say it caused the delay?", bundle);
  assert.match(result.response ?? "", /Seasonality|association|threshold/i);
  assert.doesNotMatch(result.response ?? "", LEAK);
});

test("L — Investigation guidance does not mutate executive state", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What should I investigate?", bundle);
  assert.match(result.response ?? "", /Seasonality|analytical investigation/i);
  assert.equal(result.scenarioCreated, false);
  assert.equal(result.decisionCreated, false);
  assert.equal(result.executionStarted, false);
});

test("M — Deictic follow-up keeps the lever Variable", () => {
  const { bundle } = bundleForCapacity();
  const first = ask("What can I potentially change?", bundle);
  const result = ask("Tell me more about the lever.", bundle, first.nextSession);
  assert.match(result.response ?? "", /Staffing Level/);
  assert.equal(result.nextSession?.lastVariableId, "vai:staffing");
});

test("N — Evidence follow-up stays on the same analysis", () => {
  const { bundle } = bundleForCapacity();
  const first = ask("What can I potentially change?", bundle);
  const result = ask("What evidence do we have for it?", bundle, first.nextSession);
  assert.equal(result.analysisContextId, "ctx-capacity-vars");
  assert.match(result.response ?? "", /association|alternative explanation|mixed|observations/i);
});

test("O — Stage referent wins over a stale Scenario label", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What variables matter here?", bundle, null, { id: DEMAND_SURGE, label: "Demand Surge" });
  assert.equal(result.focalObjectId, DEMAND_SURGE);
  assert.doesNotMatch(result.response ?? "", /Capacity Expansion Plan/);
});

test("P — No architecture leakage", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What variables matter here?", bundle);
  assert.doesNotMatch(result.response ?? "", LEAK);
});

test("Q — Mutation safety flags remain false", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const { variables, bundle } = bundleForCapacity();
  const before = JSON.stringify(variables);
  const result = ask("What variables matter here?", bundle);
  assert.equal(JSON.stringify(variables), before);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.equal(result.stageMutated, false);
  assert.equal(result.npsPathCreated, false);
});

test("R — NPS boundary: Variable analysis does not create a solution path", () => {
  const { bundle } = bundleForCapacity();
  const result = ask("What can I potentially change?", bundle);
  assert.equal(result.npsPathCreated, false);
  assert.equal(result.recommendationIssued, false);
  assert.doesNotMatch(result.response ?? "", /hire five|buy another machine|create a scenario/i);
  const diagnostics = formatVaiAdvisorDiagnostics("What can I potentially change?", result);
  assert.equal(diagnostics.apply, true);
});

test("CC:5 overlay consumes VAI without replacing Advisor authority", () => {
  const { bundle } = bundleForCapacity();
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const selected = selectNexoraMVPInteractionSubject(state, CAPACITY, catalog);
  state = selected;
  const turn = executeNexoraConversationalExperience({
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
    messageIdSeed: "vai4-overlay",
  });
  assert.match(turn.response, /Staffing Level|potential lever|Backlog/);
  assert.doesNotMatch(turn.response, LEAK);
  assert.equal(turn.vaiAdvisorAnalysis?.apply, true);
});
