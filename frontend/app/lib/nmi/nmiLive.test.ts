/**
 * NPA-T NMI:8 — Live Management Intelligence & Real Manager Certification tests.
 * Does not start DTH-EXP. Does not create a second management store.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { composeNpsProblemSolvingPath } from "@/app/lib/nexora-problem-solving/npsProblemSolvingPath.ts";
import { ECA_EXECUTIVE_COMMITMENT_IDENTITY } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import {
  executiveStageQueueFoundationIdentity,
  verifyExecutiveStageQueueFoundation,
} from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import {
  composeNmiAdvisorAnalysis,
  detectNmiAdvisorIntent,
  rejectSealedRmsAdvisorFact,
} from "./nmiAdvisorCompose.ts";
import { identifyManagementGaps, summarizeDecisionRoadmap } from "./nmiAdvisorQuery.ts";
import { NMI_ADVISOR_CONTRACT } from "./nmiAdvisorContract.ts";
import { verifyNmiAdvisorIntegration } from "./nmiAdvisorFoundation.ts";
import { NMI_LIVE_GATE_FLOW, NMI_LIVE_HOST_CONTRACT, NMI_LIVE_PIPELINE } from "./nmiLiveContract.ts";
import { verifyNmiLiveHost } from "./nmiLiveFoundation.ts";
import { nmiLiveIdentity } from "./nmiLiveIdentity.ts";
import { composeNmiLiveUnifiedManagementModel } from "./nmiLiveHost.ts";
import {
  hostNmiLiveManagementIntelligence,
  projectNmiLiveSelectionToStage,
} from "./nmiLivePipeline.ts";
import { handoffNmiStageProjectionToExistingStage } from "./nmiStageProjectionHandoff.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function live(overrides: Partial<Parameters<typeof hostNmiLiveManagementIntelligence>[0]> = {}) {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(initial, catalog());
  return hostNmiLiveManagementIntelligence({
    catalog: catalog(),
    queueEntries: presentation.queueEntries ?? [],
    focusedSubjectId: null,
    ...overrides,
  });
}

function talk(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  hosted = live(),
  resolvedRuntime = previous?.nextRuntimeState,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog()),
    runtimeState:
      resolvedRuntime ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nmi8-${utterance}`,
    nmiAdvisorBundle: hosted.advisorBundle,
  });
}

test("NMI:8 verifies on NMI:1–7 without a second store, Queue, Advisor, or DTH-EXP", () => {
  assert.equal(verifyNmiAdvisorIntegration().ok, true);
  assert.equal(verifyNmiLiveHost().ok, true);
  assert.equal(verifyExecutiveStageQueueFoundation().ok, true);
  assert.equal(NMI_ADVISOR_CONTRACT.startsNmi8, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.secondManagementStore, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.secondQueue, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.startsDthExp, false);
  assert.equal(nmiLiveIdentity, "NPA-T NMI:8/LiveManagementIntelligenceHost");
  assert.equal(NMI_LIVE_PIPELINE.at(-1), "EXISTING_UI_STAGE_ADVISOR");
  assert.equal(NMI_LIVE_HOST_CONTRACT.conversationalAuthority, conversationalExperienceIdentity);
  assert.equal(NMI_LIVE_HOST_CONTRACT.gateApi, realDataIntegrationFoundationIdentity);
});

test("live UnifiedManagementModel is a read-only composer preserving canonical IDs and partial knowledge", () => {
  const before = JSON.stringify(catalog());
  const hosted = composeNmiLiveUnifiedManagementModel({ catalog: catalog() });
  assert.equal(hosted.model.identity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(hosted.writesCanonical, false);
  assert.equal(hosted.secondManagementStore, false);
  assert.equal(Object.isFrozen(hosted.model), true);
  assert.equal(hosted.model.mutatesObjects, false);
  assert.ok(hosted.model.nodes.some((node) => node.id === "ctx-problem-capacity"));
  assert.ok(hosted.model.nodes.some((node) => node.id === "goal-capacity-availability"));
  assert.equal(
    hosted.model.nodes.find((node) => node.id === "ctx-problem-capacity")?.kind,
    "PROBLEM",
  );
  assert.ok(hosted.model.missingNodes.includes("KPI"));
  assert.ok(hosted.model.missingNodes.includes("OUTCOME"));
  assert.equal(hosted.model.scenarioIsDecision, false);
  assert.equal(hosted.model.decisionIsExecution, false);
  assert.equal(hosted.model.executionIsOutcome, false);
  assert.equal(JSON.stringify(catalog()), before);
  const partialCatalog = Object.freeze({
    ...catalog(),
    contextSubjects: catalog().contextSubjects.filter((item) => item.id === "ctx-problem-capacity"),
    contextLinks: Object.freeze([]),
  });
  const partial = composeNmiLiveUnifiedManagementModel({ catalog: partialCatalog });
  assert.ok(partial.model.nodes.some((node) => node.kind === "GOAL"));
  assert.ok(partial.model.nodes.some((node) => node.kind === "PROBLEM"));
  assert.equal(partial.model.nodes.some((node) => node.kind === "DECISION"), false);
  assert.ok(partial.model.missingNodes.includes("KPI"));
  assert.equal(partial.fabricatesMissingStructure, false);
});

test("Management Map receives live model counts and Attention still derives from Queue", () => {
  const hosted = live();
  const problems = hosted.map.nodes.filter((node) => node.kind === "PROBLEM");
  const scenarios = hosted.map.nodes.filter((node) => node.kind === "SCENARIO");
  const decisions = hosted.map.nodes.filter((node) => node.kind === "DECISION");
  const executions = hosted.map.nodes.filter((node) => node.kind === "EXECUTION");
  const goals = hosted.map.nodes.filter((node) => node.kind === "GOAL");
  assert.equal(problems.length, catalog().contextSubjects.filter((item) => item.kind === "problem").length);
  assert.equal(scenarios.length, catalog().contextSubjects.filter((item) => item.kind === "scenario").length);
  assert.equal(decisions.length, catalog().contextSubjects.filter((item) => item.kind === "decision").length);
  assert.equal(executions.length, catalog().contextSubjects.filter((item) => item.kind === "execution").length);
  assert.equal(goals.length, 1);
  assert.equal(hosted.map.nodes.filter((node) => node.kind === "PROCESS").length, 0);
  const problemView = hosted.navigation.mapViews.find((view) => view.section === "PROBLEMS_RISKS");
  assert.equal(problemView?.count, problems.length);
  const queueIds = [...new Set((hosted.navigation.queueEntries ?? []).flatMap((entry) => [...entry.objectIds]))].sort();
  const attentionIds = hosted.navigation.attentionItems.map((item) => item.itemId).sort();
  assert.deepEqual(attentionIds, queueIds);
  assert.equal(hosted.navigation.secondQueue, false);
  assert.equal(hosted.navigation.inventsPriorityScore, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.secondQueue, false);
  assert.equal(executiveStageQueueFoundationIdentity.includes("ExecutiveStageQueue"), true);
});

test("Map and Attention selection reach Stage with preserved projection anchors", () => {
  const hosted = live();
  const mapProjection = projectNmiLiveSelectionToStage({
    live: hosted,
    selectedCanonicalId: "ctx-problem-capacity",
    source: "MANAGEMENT_MAP",
  });
  assert.equal(mapProjection.selectedCanonicalId, "ctx-problem-capacity");
  assert.equal(mapProjection.projectionAnchorId, "ctx-problem-capacity");
  assert.equal(mapProjection.collectionOwnsReferent, false);
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const mapHandoff = handoffNmiStageProjectionToExistingStage({
    projection: mapProjection,
    interactionState: initial,
    catalog: catalog(),
  });
  assert.equal(mapHandoff.nmiWroteStage, false);
  assert.equal(mapHandoff.focusedSubjectId, "ctx-problem-capacity");
  const attentionId = hosted.navigation.attentionItems[0]?.itemId;
  assert.ok(attentionId);
  const attentionProjection = projectNmiLiveSelectionToStage({
    live: hosted,
    selectedCanonicalId: attentionId,
    source: "ATTENTION",
  });
  assert.equal(attentionProjection.selectedCanonicalId, attentionId);
  assert.equal(attentionProjection.projectionAnchorId, attentionId);
  const collected = openNexoraMVPExecutiveQueueCollection(initial, "problem");
  const afterCollection = handoffNmiStageProjectionToExistingStage({
    projection: mapProjection,
    interactionState: collected,
    catalog: catalog(),
  });
  assert.equal(afterCollection.focusedSubjectId, "ctx-problem-capacity");
  const selected = selectNexoraMVPInteractionSubject(initial, "ctx-problem-capacity", catalog());
  assert.equal(selected.focusedSubject?.id, "ctx-problem-capacity");
});

test("Advisor receives the live NMI bundle and Journeys A–E remain canonical", () => {
  const hosted = live();
  let turn = talk("Explain Capacity Gap.", undefined, hosted);
  turn = talk("Where is this in my business?", turn, hosted);
  assert.equal(turn.nmiAdvisorComposition?.apply, true);
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
  assert.match(turn.response, /Capacity Gap/);
  turn = talk("What is related to it?", turn, hosted);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.match(turn.response, /related/i);
  assert.doesNotMatch(turn.response, /Margin Pressure is related/);
  turn = talk("Why is this in Attention?", turn, hosted);
  assert.match(turn.response, /Capacity Gap|Queue|Attention/i);
  turn = talk("Where are we with this problem?", turn, hosted);
  assert.match(turn.response, /roadmap position|descriptive/i);
  turn = talk("What is missing?", turn, hosted);
  assert.match(turn.response, /MISSING|UNRESOLVED|NOT_REACHED/);
  let margin = talk("Explain Margin Pressure.", undefined, hosted);
  margin = talk("What is related to it?", margin, hosted);
  assert.equal(margin.ncaTurn.reference.resolvedName, "Margin Pressure");
  assert.equal(margin.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-margin");
  assert.doesNotMatch(margin.response, /Capacity Gap is related/);
  let scenario = talk("What Demand Surge?", undefined, hosted);
  assert.equal(scenario.ncaTurn.reference.resolvedName, "Demand Surge");
  const addresses = detectNmiAdvisorIntent("What problem does this address?");
  assert.equal(addresses, "RELATED");
  const addressAnalysis = composeNmiAdvisorAnalysis({
    utterance: "What problem does this address?",
    resolvedCanonicalId: "ctx-scenario-demand",
    bundle: hosted.advisorBundle,
  });
  assert.equal(addressAnalysis.activeCanonicalId, "ctx-scenario-demand");
  assert.equal(hosted.map.nodes.find((node) => node.nodeId === "ctx-scenario-demand")?.kind, "SCENARIO");
  const decisionAsk = composeNmiAdvisorAnalysis({
    utterance: "Has a decision been made?",
    resolvedCanonicalId: "ctx-scenario-demand",
    bundle: hosted.advisorBundle,
  });
  assert.equal(decisionAsk.activeCanonicalId, "ctx-scenario-demand");
  assert.equal(decisionAsk.intent, "ROADMAP");
  assert.match(decisionAsk.response ?? "", /Decision is (MISSING|NOT_REACHED|PARTIAL|PRESENT)/);
  assert.doesNotMatch(decisionAsk.response ?? "", /promoted to Decision|is now Decision/);
  scenario = talk("Has a decision been made?", scenario, hosted);
  assert.equal(scenario.nmiAdvisorComposition?.intent, "ROADMAP");
  let decision = talk("Explain Expand Capacity.", undefined, hosted);
  decision = talk("Is this being executed?", decision, hosted);
  assert.equal(decision.nmiAdvisorComposition?.intent, "ROADMAP");
  assert.match(decision.response, /Execution is (MISSING|NOT_REACHED|PARTIAL|PRESENT)/);
  assert.doesNotMatch(decision.response, /is now Execution|became an Outcome/);
  let causal = talk("Explain Capacity Gap.", undefined, hosted);
  causal = talk("Does Capacity cause the delivery problem?", causal, hosted);
  assert.doesNotMatch(causal.response, /\bis (?:the |a )?confirmed cause\b/i);
  causal = talk("What evidence do we have?", causal, hosted);
  assert.match(causal.response, /evidence|provenance|unresolved/i);
  const unknown = talk("What is missing?", causal, hosted);
  assert.match(unknown.response, /MISSING|UNRESOLVED|NOT_REACHED/);
  const greeting = talk("What is Profit?");
  assert.notEqual(greeting.nmiAdvisorComposition?.apply, true);
  const partialCatalog = Object.freeze({
    ...catalog(),
    contextSubjects: catalog().contextSubjects.filter((item) => item.id === "ctx-problem-capacity"),
    contextLinks: Object.freeze([]),
  });
  const partial = hostNmiLiveManagementIntelligence({ catalog: partialCatalog, queueEntries: [] });
  const roadmap = summarizeDecisionRoadmap(partial.map, "ctx-problem-capacity");
  const statuses = roadmap.stageStatuses as Readonly<Record<string, string | undefined>>;
  assert.ok(["MISSING", "PARTIAL", "UNRESOLVED", "NOT_REACHED", "NOT_APPLICABLE"].includes(statuses.KPI_DATA ?? "MISSING"));
  assert.ok(["MISSING", "NOT_REACHED", "NOT_APPLICABLE"].includes(statuses.DECISION ?? "MISSING"));
  const notes = identifyManagementGaps(partial.map, "ctx-problem-capacity");
  assert.ok(notes.some((note) => note.status === "MISSING"));
  assert.ok(
    notes.some(
      (note) =>
        note.status === "NOT_REACHED" || note.status === "UNRESOLVED" || note.status === "MISSING",
    ),
  );
  const statusSet = new Set(Object.values(roadmap.stageStatuses as Readonly<Record<string, string>>));
  assert.ok(statusSet.has("MISSING") || statusSet.has("NOT_REACHED") || statusSet.has("UNRESOLVED"));
});

test("authority, Gate, RMS, Queue, Stage, and overlay wiring stay downstream", () => {
  const hosted = live();
  assert.equal(hosted.writesCanonical, false);
  assert.equal(hosted.bypassesGate, false);
  assert.equal(NMI_LIVE_GATE_FLOW[0], "EXTERNAL_OR_INTERNAL_INPUT");
  assert.equal(NMI_LIVE_GATE_FLOW[1], "GATE_API_RDI_1");
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.feedbackLoop, false);
  const sealed = rejectSealedRmsAdvisorFact("rms:ground-truth:secret-cause");
  assert.equal(sealed.spoken, false);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(NMI_RMS_BOUNDARY.nmiIsSimulationEngine, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  const hostSource = readFileSync(join(HERE, "nmiLiveHost.ts"), "utf8");
  assert.doesNotMatch(hostSource, /rmsGroundTruth/);
  const shell = readFileSync(join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /hostNmiLiveManagementIntelligence/);
  assert.match(shell, /nmiAdvisorBundle:/);
  const stage = readFileSync(join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.match(stage, /nmiManagementMap/);
  assert.match(stage, /composeNmiStageProjection/);
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      entries: [
        {
          category: "problem",
          count: 1,
          objectIds: ["ctx-problem-capacity"],
          isSemanticObject: false,
          isActive: false,
        },
      ],
      mapNodes: hosted.overlayMapNodes,
      projectionAnchorId: "ctx-problem-capacity",
      onSelectCategory: () => undefined,
      onSelectCanonicalId: () => undefined,
    }),
  );
  assert.match(html, /data-nmi-live="8"/);
  assert.match(html, /data-nmi-map-node="ctx-problem-capacity"/);
  assert.match(html, /data-nmi-section-count/);
  const nps = composeNpsProblemSolvingPath({
    problem: {
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "MO",
    },
    investigationPresent: false,
    evidenceState: "NONE",
    causeHypothesesAvailable: false,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: { present: false, executionId: null, status: "NONE" },
    outcome: { observed: false, problemResolved: null },
    stageFocusId: "ctx-problem-capacity",
    conversationSubjectId: "ctx-problem-capacity",
  });
  assert.equal(nps.problemId, "ctx-problem-capacity");
  assert.equal(ECA_EXECUTIVE_COMMITMENT_IDENTITY, "NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge");
  assert.equal(NMI_LIVE_HOST_CONTRACT.writesDecision, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.writesExecution, false);
});
