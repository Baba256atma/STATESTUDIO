/**
 * NEX-STAGE-CARD:1 — semantic entity role and role-aware card projection.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEXORA_DECISION_THEATRE_DATA_ID_PREFIX,
  NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX,
  projectNexoraDecisionTheatreFoundation,
  projectNexoraDecisionTheatreObjectInvestigation,
  resolveStageEntityPresentationRole,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import { NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE } from "./nexoraDecisionTheatreIconicFixtures.ts";
import { CAPABILITY_INTRODUCTORY_COPY } from "@/app/lib/nexora-entrance/nexoraEntranceConversationContinuity.ts";
import { NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY } from "@/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts";
import { NEXORA_EDUCATIONAL_EXAMPLE_PROVENANCE } from "@/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts";
import { NEXORA_ENTRANCE_OBJECT_ID } from "@/app/lib/nexora-entrance/nexoraEntranceTypes.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  projectNexoraEntranceCatalog,
} from "@/app/lib/nexora-entrance/nexoraEntranceExperience.ts";
import { withActiveNexoraGuidedEntrance } from "@/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { isNexoraEntranceRestrained } from "@/app/lib/nexora-entrance/nexoraEntranceExperience.ts";
import { objectEducationOf } from "@/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
  nextCatalog = catalog,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog: nextCatalog,
    ...extra,
  });
}

function guidedCatalog() {
  return projectNexoraEntranceCatalog(
    withActiveNexoraGuidedEntrance(
      createNexoraEntranceSession({ workspaceResolution: "first-time" }),
    ),
  );
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session =
    previous?.nextEntranceSession ??
    withActiveNexoraGuidedEntrance(
      createNexoraEntranceSession({ workspaceResolution: "first-time" }),
    );
  const nextCatalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(nextCatalog),
    runtimeState:
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initial(), session),
    catalog: nextCatalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-stage-card1-${utterance}`,
  });
}

function atGoal() {
  return run("Show me the next one", run("Show me how focus works", run("Show me")));
}

function cardText(investigation: NonNullable<ReturnType<typeof projectNexoraDecisionTheatreObjectInvestigation>>) {
  return [
    investigation.glance.identity,
    investigation.glance.state,
    investigation.glance.whyRelevant,
    investigation.advisorReadable.evidence,
    investigation.advisorReadable.related,
    investigation.advisorReadable.currentState,
  ].join("\n");
}

describe("NEX-STAGE-CARD:1 semantic entity role", () => {
  it("resolves educational NEXORA from catalog provenance, not label or DOM", () => {
    const educational = resolveStageEntityPresentationRole({
      entityId: NEXORA_ENTRANCE_OBJECT_ID,
      catalogProvenance: "entrance-education",
    });
    assert.equal(educational.presentationRole, "EDUCATIONAL_ACTOR");
    assert.equal(educational.inferredFromLabel, false);
    assert.equal(educational.inferredFromDom, false);
    const labeled = resolveStageEntityPresentationRole({
      entityId: "obj-other",
      catalogProvenance: null,
    });
    assert.equal(labeled.presentationRole, "EXECUTIVE_OBJECT");
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "nexoraStageEntityPresentationRole.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /obj-nexora-entrance/);
    assert.doesNotMatch(source, /label\.includes\("NEXORA"\)/);
  });

  it("NEXORA card omits business status, evidence, and relationship fallbacks", () => {
    const session = withActiveNexoraGuidedEntrance(
      createNexoraEntranceSession({ workspaceResolution: "first-time" }),
    );
    const nextCatalog = projectNexoraEntranceCatalog(session);
    const focused = selectNexoraMVPInteractionSubject(
      applyEntranceCenterSubject(initial(), session),
      NEXORA_ENTRANCE_OBJECT_ID,
      nextCatalog,
    );
    const theatre = project(focused, undefined, nextCatalog);
    const investigation = theatre.objectInvestigation;
    assert.ok(investigation);
    assert.equal(investigation.objectId, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(investigation.presentationRole, "EDUCATIONAL_ACTOR");
    assert.equal(investigation.statusSource, "not-applicable");
    assert.equal(investigation.evidenceApplicability, "NOT_APPLICABLE");
    assert.equal(investigation.relationshipApplicability, "NOT_APPLICABLE");
    const text = cardText(investigation);
    assert.doesNotMatch(text, /Current state: stable/);
    assert.doesNotMatch(text, /is a object/);
    assert.doesNotMatch(text, /does not yet have enough evidence/);
    assert.doesNotMatch(text, /No supported relationships/);
    assert.equal(investigation.glance.identity, NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY);
    assert.equal(investigation.glance.state, CAPABILITY_INTRODUCTORY_COPY);
    assert.match(investigation.glance.whyRelevant, /Role in this Stage/i);
    assert.equal(
      nextCatalog.objects.find((item) => item.id === NEXORA_ENTRANCE_OBJECT_ID)?.status,
      "stable",
    );
  });

  it("educational Goal/KPI preserve example provenance and do not write Goal state", () => {
    const goalTurn = atGoal();
    assert.equal(objectEducationOf(goalTurn.nextEntranceSession).state, "GOAL");
    const goalCatalog = projectNexoraEntranceCatalog(goalTurn.nextEntranceSession!);
    const goalTheatre = project(goalTurn.nextRuntimeState, undefined, goalCatalog);
    assert.equal(goalTheatre.objectInvestigation?.educationalExample, true);
    assert.match(goalTheatre.objectInvestigation?.glance.state ?? "", /educational example/i);
    assert.doesNotMatch(goalTheatre.objectInvestigation?.glance.state ?? "", /Current state: stable/);
    assert.equal(goalTurn.nextEntranceSession?.goalDiscovery, null);
    const kpiTurn = run("Show me the next one", goalTurn);
    const kpiCatalog = projectNexoraEntranceCatalog(kpiTurn.nextEntranceSession!);
    const kpiTheatre = project(kpiTurn.nextRuntimeState, undefined, kpiCatalog);
    assert.equal(objectEducationOf(kpiTurn.nextEntranceSession).state, "KPI");
    assert.match(kpiTheatre.objectInvestigation?.managerReadableName ?? "", /kpi/i);
    assert.equal(kpiTheatre.objectInvestigation?.educationalExample, true);
    assert.equal(kpiTheatre.objectInvestigation?.glance.state, NEXORA_EDUCATIONAL_EXAMPLE_PROVENANCE);
  });

  it("real executive objects keep status, UNKNOWN evidence, and relationship sections", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
    const theatre = project(focused, {
      iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE],
    });
    const investigation = theatre.objectInvestigation;
    assert.ok(investigation);
    assert.equal(investigation.presentationRole, "EXECUTIVE_OBJECT");
    assert.equal(investigation.evidenceApplicability, "APPLICABLE");
    assert.equal(investigation.relationshipApplicability, "APPLICABLE");
    assert.match(investigation.glance.state, /Current state:/);
    assert.match(investigation.advisorReadable.evidence, /does not yet have enough evidence/i);
    assert.match(investigation.glance.identity, /is an? /);
    assert.doesNotMatch(investigation.glance.identity, /is a object/);
  });

  it("Data Object role uses DATA_OBJECT family, not executive investigation copy", () => {
    const role = resolveStageEntityPresentationRole({
      entityId: `${NEXORA_DECISION_THEATRE_DATA_ID_PREFIX}overview:csv-fixture`,
    });
    assert.equal(role.presentationRole, "DATA_OBJECT");
    assert.equal(role.visualFamily, "DATA_OBJECT");
    assert.equal(role.applicableSections.includes("businessStatus"), false);
    assert.equal(role.applicableSections.includes("dataSource"), true);
  });

  it("iconic entities resolve ICONIC_ENTITY without inventing selectability", () => {
    const role = resolveStageEntityPresentationRole({
      entityId: `${NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX}owner:evidence:owner:src`,
    });
    assert.equal(role.presentationRole, "ICONIC_ENTITY");
  });

  it("card open/close and conversation actions do not write Decision, Execution, or Data", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-decision-capacity", catalog);
    const theatre = project(focused);
    const closed = projectNexoraDecisionTheatreObjectInvestigation({
      theatre,
      level: "glance",
    });
    assert.equal(closed?.derivationMetadata.mutatedDecision, false);
    assert.equal(closed?.derivationMetadata.startedExecution, false);
    const existing = executeNexoraConversationalExperience({
      utterance: "Continue",
      executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
      runtimeState: focused,
      catalog,
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-stage-card1-existing-continue",
    });
    assert.equal(existing.nextEntranceSession?.decisionExperience, null);
    assert.equal(existing.nextEntranceSession?.executionPlanning, null);
  });

  it("Goal → KPI while investigation is open follows the resulting subject", () => {
    const goalTurn = atGoal();
    const goalCatalog = projectNexoraEntranceCatalog(goalTurn.nextEntranceSession!);
    const openGoal = project(goalTurn.nextRuntimeState, undefined, goalCatalog);
    assert.match(openGoal.objectInvestigation?.objectId ?? "", /goal/);
    const kpiTurn = run("Show me the next one", goalTurn);
    const kpiCatalog = projectNexoraEntranceCatalog(kpiTurn.nextEntranceSession!);
    const openKpi = project(kpiTurn.nextRuntimeState, undefined, kpiCatalog);
    assert.match(openKpi.objectInvestigation?.objectId ?? "", /kpi/);
    assert.notEqual(openKpi.objectInvestigation?.objectId, openGoal.objectInvestigation?.objectId);
  });

  it("FIX3, Skip, and ENT:10 handoff keep one investigation composer", () => {
    const appears = run("What appears here?", run("Show me"));
    const continued = run("Continue", appears);
    assert.match(continued.nexoraMessage.text, /focus/i);
    const skipped = run("Skip this", atGoal());
    assert.equal(objectEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    const afterSkip = project(
      skipped.nextRuntimeState,
      undefined,
      getDefaultNexoraMVPObjectInteractionCatalog(),
    );
    assert.notEqual(afterSkip.objectInvestigation?.presentationRole, "EDUCATIONAL_ACTOR");
    assert.equal(afterSkip.objectInvestigation?.catalogProvenance ?? null, null);
    const source = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "nexoraDecisionTheatreObjectInvestigationComposer.ts",
      ),
      "utf8",
    );
    const surface = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../../executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx",
      ),
      "utf8",
    );
    assert.match(source, /resolveStageEntityPresentationRole/);
    assert.doesNotMatch(source, /ObjectCardV2/);
    assert.doesNotMatch(source, /NexoraEducationalCard/);
    assert.doesNotMatch(surface, /display:\s*none/);
    assert.doesNotMatch(source, /text\.includes\("not enough evidence"\)/);
    void guidedCatalog;
  });
});
