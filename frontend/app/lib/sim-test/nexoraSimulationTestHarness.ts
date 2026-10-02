/**
 * NPA-T SIM-TEST:1 — bounded orchestration around certified RMS v1 and real Nexora.
 * This module schedules existing authorities and emits read-only evidence.
 */

import { getDefaultNexoraMVPObjectInteractionCatalog, selectNexoraMVPInteractionSubject, type NexoraMVPObjectInteractionState } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyManagementLevelInteraction,
  classifyManagementLevelInteraction,
} from "../nmi/nmiManagementLevelInteractionCompose.ts";
import { composeNmiLiveManagementLevels } from "../nmi/nmiLiveManagementLevelsCompose.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import type { RmsObserverFinding } from "../rms/rmsObserverContract.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import { observationPolicyForSources } from "../rms/rmsObservationPolicy.ts";
import { emptyRmsManagerKnowledge } from "../rms/rmsManagerRuntime.ts";
import type { RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import {
  RMS_SCENARIO_MANAGER_ACTOR,
  RMS_SCENARIO_OBSERVER_ACTOR,
  RMS_SCENARIO_OPERATOR_ACTOR,
  RMS_SCENARIO_RUN_ACTORS,
  resolveRmsScenario,
} from "../rms/rmsScenarioRunner.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { resetPostDecisionCaptureForTests } from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
import {
  listCapturedObservations,
  resetOutcomeObservationCaptureForTests,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  createRmsFoundationSession,
  inspectRmsEventSchedule,
  inspectRmsGroundTruth,
  inspectRmsManagerConversation,
  inspectRmsOperatorLedger,
  loadRmsEventSchedule,
  measureRmsObserverIntelligence,
  prepareRmsManagerConversation,
  publishRmsOperatorObservableData,
  runRmsManagerConversationTurn,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
} from "../rms/rmsSession.ts";
import { RMS_NORTHSTAR_MACHINE_RECOVERY } from "../rms/rmsEventFixtures.ts";
import {
  assessCrossRunIsolation,
  classifyAdaptiveJourney,
  classifyLifecycleJourney,
  classifyManagerJourney,
  decorateJourneyObservation,
  EMPTY_MANAGEMENT_CONTINUITY,
} from "./nexoraSimulationJourneyObservation.ts";
import {
  SIM_TEST_1_BOUNDARY,
  SIM_TEST_CHECKPOINT_KINDS,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
  type NexoraSimulationJourneyTurnObservation,
  type NexoraSimulationTestAggregateReport,
  type NexoraSimulationTestCheckpoint,
  type NexoraSimulationTestCheckpointKind,
  type NexoraSimulationTestFailureOwner,
  type NexoraSimulationTestFinding,
  type NexoraSimulationTestJourney,
  type NexoraSimulationTestJourneyStep,
  type NexoraSimulationTestRunReport,
  type NexoraSimulationTestSeverity,
} from "./nexoraSimulationTestContract.ts";
import { shapePopulationManagerTurn } from "./nexoraSimulationManagerPopulation.ts";
import {
  ingestSimulationCsvFile,
  projectRmsOperatorRecordsToCsv,
  traceSimulationCsvIngestion,
  type SimulationCsvFileVersion,
  type SimulationCsvIngestionState,
  type SimulationIngestionTrace,
} from "./nexoraSimulationCsvIngestion.ts";

function requireText(value: string, label: string): string {
  if (!value.trim()) throw new Error(`SIM-TEST:1 ${label} is required`);
  return value;
}

function containsForbiddenKey(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  for (const [key, child] of Object.entries(value)) {
    if ((SIM_TEST_FORBIDDEN_JOURNEY_KEYS as readonly string[]).includes(key)) return key;
    const nested = containsForbiddenKey(child);
    if (nested) return nested;
  }
  return null;
}

export function validateNexoraSimulationTestJourney(journey: NexoraSimulationTestJourney): void {
  requireText(journey.journeyId, "journeyId");
  requireText(journey.version, "journey version");
  if (journey.turnBudget < 1 || journey.boundedDurationTicks < 0) throw new Error("SIM-TEST:1 budgets must be bounded");
  if (journey.maxRepeatedClarificationAttempts !== undefined && journey.maxRepeatedClarificationAttempts < 1) {
    throw new Error("SIM-TEST:3 clarification budget must be positive");
  }
  if (journey.maxUnresolvedLoops !== undefined && journey.maxUnresolvedLoops < 1) {
    throw new Error("SIM-TEST:3 unresolved-loop budget must be positive");
  }
  if (journey.maxNavigationCycles !== undefined && journey.maxNavigationCycles < 1) {
    throw new Error("SIM-TEST:4 navigation-cycle budget must be positive");
  }
  const forbidden = containsForbiddenKey(journey);
  if (forbidden) throw new Error(`SIM-TEST:1 journey cannot encode ${forbidden}`);
  const unknown = journey.requiredCheckpoints.find((kind) => !(SIM_TEST_CHECKPOINT_KINDS as readonly string[]).includes(kind));
  if (unknown) throw new Error(`SIM-TEST:1 unknown checkpoint ${unknown}`);
  for (const step of journey.steps) {
    if ((step.kind === "PUBLISH_OBSERVABLE_DATA" || step.kind === "ADVANCE_WORLD") && (step.atTick < 0 || step.atTick > journey.boundedDurationTicks)) {
      throw new Error("SIM-TEST:1 publication step exceeds tick budget");
    }
  }
}

function severityOf(finding: RmsObserverFinding): NexoraSimulationTestSeverity {
  if (finding.subtype === "FIREWALL_VIOLATION" || finding.subtype === "KNOWLEDGE_LEAK" || finding.subtype === "UNAUTHORIZED_MUTATION") return "S0";
  if (finding.severity === "CRITICAL_CONTRACT_FAILURE" || finding.severity === "FAILURE") return "S1";
  if (finding.severity === "WARNING") return "S2";
  return "S3";
}

function ownerOf(finding: RmsObserverFinding): NexoraSimulationTestFailureOwner {
  if (finding.subtype === "REFERENT_ERROR") return "REFERENT";
  if (finding.taxonomy === "OPERATOR_ERROR") return "OPERATOR";
  if (finding.taxonomy === "DATA_ERROR") return "DATA_REALITY";
  if (finding.taxonomy === "CONVERSATION_ERROR") return "CC5_CONVERSATION";
  if (finding.taxonomy === "NEXORA_ERROR") return "ADVISOR";
  if (finding.taxonomy === "SIMULATION_ERROR") return "RMS";
  if (finding.taxonomy === "RUNTIME_ERROR") return "UNKNOWN";
  return "UNKNOWN";
}

function measurementTurn(measurementId: string): number | null {
  const match = /^m:(?:causal|referent|nexora-leak):(\d+)$/.exec(measurementId);
  return match ? Number(match[1]) : null;
}

export function projectNexoraSimulationTestFinding(input: {
  finding: RmsObserverFinding;
  testRunId: string;
  journey: NexoraSimulationTestJourney;
  rmsRunId: string;
  checkpoint: NexoraSimulationTestCheckpoint | null;
  measurementId?: string;
  managerTurn?: number;
}): NexoraSimulationTestFinding {
  const checkpoint = input.checkpoint;
  const measurementId = input.measurementId ?? input.finding.measurementIds[0] ?? input.finding.findingId;
  return Object.freeze({
    findingId: `${input.testRunId}:${input.finding.findingId}:${measurementId}`,
    testRunId: input.testRunId,
    journeyId: input.journey.journeyId,
    scenarioId: input.journey.scenarioId,
    scenarioVersion: input.journey.scenarioVersion,
    rmsRunId: input.rmsRunId,
    tick: input.finding.tick,
    managerTurn: input.managerTurn ?? measurementTurn(measurementId) ?? checkpoint?.managerTurn ?? 0,
    visibleDataRefs: checkpoint?.operatorRecordIds ?? Object.freeze([]),
    activeCanonicalSubjectId: checkpoint?.canonicalSubjectId ?? null,
    mlevelActiveId: checkpoint?.mlevel.l1ActiveId ?? null,
    stageActiveSubjectId: checkpoint?.stage.activeSubjectId ?? null,
    observedBehavior: input.finding.explanation,
    expectedInvariant: input.finding.subtype,
    classification: `${input.finding.taxonomy}/${input.finding.subtype}`,
    severity: severityOf(input.finding),
    likelyOwner: ownerOf(input.finding),
    traceReferences: Object.freeze([measurementId]),
    repaired: false as const,
  });
}

export function shouldStopNexoraSimulationTest(findings: readonly NexoraSimulationTestFinding[]): boolean {
  return findings.some((finding) => finding.severity === "S0");
}

function unique(values: readonly (string | null | undefined)[]): readonly string[] {
  return Object.freeze([...new Set(values.filter((value): value is string => Boolean(value)))]);
}

function latestVisibleNumbers(ledger: ReturnType<typeof inspectRmsOperatorLedger>): Readonly<Record<string, number>> {
  const numbers: Record<string, number> = {};
  for (const record of ledger.observations) {
    if (record.status === "AVAILABLE" && typeof record.value === "number") numbers[record.field] = record.value;
  }
  return Object.freeze(numbers);
}

function latestCsvVersions(files: readonly SimulationCsvFileVersion[]): NexoraSimulationJourneyTurnObservation["csvVersions"] {
  const latest = new Map<string, { sourceType: string; version: number; tick: number }>();
  for (const file of files) {
    latest.set(file.sourceType, { sourceType: file.sourceType, version: file.version, tick: file.generatedAtTick });
  }
  return Object.freeze([...latest.values()].map((item) => Object.freeze(item)));
}

function observerHiddenNumbers(session: Parameters<typeof inspectRmsGroundTruth>[0]): Readonly<Record<string, number>> {
  const ground = inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
  const numbers: Record<string, number> = {};
  if ("variables" in ground) {
    for (const variable of ground.variables) {
      if (typeof variable.value === "number") numbers[variable.key] = variable.value;
    }
  }
  return Object.freeze(numbers);
}

function lifecycleSlice(result: RmsCc5Turn) {
  const decisions = result.decisionRuntime?.listDecisions() ?? [];
  const approved = decisions.filter((item) => item.status === "Approved");
  const executions = result.executionRuntime?.listExecutions() ?? [];
  const latestExecution = executions.at(-1) ?? null;
  const learning = result.npsOutcomeLearning;
  const scenarioRecord = result as {
    readonly scenarioResult?: { readonly scenario?: { readonly scenarioId?: string } | null } | null;
    readonly nextScenarioSession?: { readonly activeScenarioId?: string | null } | null;
    readonly nxa3OutcomeState?: string | null;
  };
  return Object.freeze({
    problemId: result.npsPath?.problemId ?? learning?.problemId ?? null,
    scenarioId: scenarioRecord.scenarioResult?.scenario?.scenarioId ?? scenarioRecord.nextScenarioSession?.activeScenarioId ?? null,
    decisionId: approved.at(-1)?.decisionId ?? result.decisionCommitmentResult?.decision?.decisionId ?? null,
    decisionCount: approved.length,
    executionId: latestExecution?.executionId ?? null,
    executionCount: executions.length,
    executionStatus: latestExecution?.status ?? null,
    npsOutcomeStatus: learning?.outcomeStatus ?? null,
    npsResolutionStatus: learning?.resolutionStatus ?? null,
    npsLearningStatus: learning?.learningStatus ?? null,
    npsLearningDurable: Boolean(learning?.learningDurable),
    nxa3OutcomeState: scenarioRecord.nxa3OutcomeState ?? null,
    capturedOutcomeObservationCount: listCapturedObservations().length,
    npsExpectedOutcome: learning?.expectedOutcome ?? null,
    npsObservedOutcome: learning?.observedOutcome ?? null,
    npsAttribution: learning?.attribution ?? null,
  });
}

function isManagerTurn(step: NexoraSimulationTestJourneyStep): step is Extract<NexoraSimulationTestJourneyStep, { kind: "MANAGER_TURN" }> {
  return step.kind === "MANAGER_TURN";
}

function captureCheckpoint(input: {
  kind: NexoraSimulationTestCheckpointKind;
  index: number;
  tick: number;
  turnCount: number;
  ledger: ReturnType<typeof inspectRmsOperatorLedger>;
  conversation: ReturnType<typeof inspectRmsManagerConversation>;
  lastCc5: RmsCc5Turn | null;
  ingestionPublicationIds?: readonly string[];
}): NexoraSimulationTestCheckpoint {
  const result = input.lastCc5;
  const state = result?.nextRuntimeState ?? null;
  const activeId = state?.focusedSubject?.id ?? result?.trace.executiveCurrentSubjectId ?? null;
  const nmi = hostNmiLiveManagementIntelligence({
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    focusedSubjectId: activeId,
  });
  const levels = composeNmiLiveManagementLevels({ map: nmi.map, selectedCanonicalId: activeId });
  const latestTurn = input.conversation.turns[input.conversation.turns.length - 1] ?? null;
  const publications = input.ledger.publications.filter((item) => item.accepted);
  const visibleObjectIds = unique([
    state?.selectedSubject?.id,
    state?.focusedSubject?.id,
    ...(state?.trail.map((item) => item.id) ?? []),
    ...(state?.collectionContext?.objectIds ?? []),
  ]);
  return Object.freeze({
    checkpointId: `checkpoint:${input.index}:${input.kind}`,
    kind: input.kind,
    tick: input.tick,
    managerTurn: input.turnCount,
    operatorRecordIds: Object.freeze(input.ledger.observations.map((item) => item.recordId)),
    dataRealityPublicationIds: unique([
      ...publications.map((item) => item.attemptId),
      ...(input.ingestionPublicationIds ?? []),
    ]),
    managerUtterance: latestTurn?.utterance ?? null,
    nexoraResponse: latestTurn?.nexoraResponse ?? null,
    canonicalSubjectId: result?.nextExecutiveContext.currentSubject?.subjectId ?? activeId,
    conversationSubjectId: result?.nextConversationContext.currentSubjectId ?? null,
    clarificationRequired: result ? result.status === "clarification-required" : null,
    mlevel: Object.freeze({
      l1ActiveId: levels.path.active?.canonicalId ?? null,
      l2ParentId: levels.path.parent?.canonicalId ?? null,
      l3GrandparentId: levels.path.grandparent?.canonicalId ?? null,
      visibleDepth: levels.path.visibleDepth,
      authority: "NPA-T MLEVEL:1/ManagementLevelPath" as const,
    }),
    stage: Object.freeze({
      activeSubjectId: state?.focusedSubject?.id ?? null,
      selectedObjectId: state?.selectedSubject?.id ?? null,
      workspace: state?.workspace ?? null,
      sceneIntent: result?.directorPlan?.intent ?? null,
      visibleObjectIds,
    }),
    decisionStatus: result?.decisionCommitmentResult?.status ?? null,
    executionCount: result?.executionRuntime?.listExecutions().length ?? 0,
    problemAvailable: result?.npsUnderstanding != null,
    scenarioAvailable: result?.scenarioResult != null || result?.nextScenarioSession != null,
    outcomeState: result?.trace.nxa3OutcomeState ?? null,
    learningState: result?.npsOutcomeLearning?.learningStatus ?? null,
    writeAttempted: false as const,
  });
}

function signatureOf(report: {
  journey: NexoraSimulationTestJourney;
  turns: number;
  ticks: number;
  checkpoints: readonly NexoraSimulationTestCheckpoint[];
  findings: readonly NexoraSimulationTestFinding[];
  journeyFindings: readonly NexoraSimulationTestFinding[];
}): string {
  const stable = JSON.stringify({
    scenario: `${report.journey.scenarioId}@${report.journey.scenarioVersion}`,
    journey: `${report.journey.journeyId}@${report.journey.version}`,
    profile: report.journey.managerProfileId,
    ...(report.journey.behaviorSeed != null ? { behaviorSeed: report.journey.behaviorSeed, conversationLength: report.journey.conversationLength ?? null } : {}),
    ...(report.journey.adaptiveFamily ? { adaptiveFamily: report.journey.adaptiveFamily, adaptiveEventPack: report.journey.adaptiveEventPack ?? "SCENARIO" } : {}),
    turns: report.turns,
    ticks: report.ticks,
    checkpoints: report.checkpoints.map((item) => ({
      kind: item.kind, tick: item.tick, managerTurn: item.managerTurn,
      subject: item.canonicalSubjectId, conversation: item.conversationSubjectId,
      mlevel: item.mlevel, stage: item.stage, decision: item.decisionStatus,
      executions: item.executionCount, problem: item.problemAvailable, scenario: item.scenarioAvailable,
    })),
    findings: report.findings.map((item) => ({ classification: item.classification, severity: item.severity, owner: item.likelyOwner, tick: item.tick })),
    journeyFindings: report.journeyFindings.map((item) => ({ classification: item.classification, severity: item.severity, owner: item.likelyOwner, tick: item.tick, turn: item.managerTurn })),
  });
  let hash = 2166136261;
  for (let index = 0; index < stable.length; index += 1) {
    hash ^= stable.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function counts(findings: readonly NexoraSimulationTestFinding[]): Readonly<Record<NexoraSimulationTestSeverity, number>> {
  return Object.freeze({
    S0: findings.filter((item) => item.severity === "S0").length,
    S1: findings.filter((item) => item.severity === "S1").length,
    S2: findings.filter((item) => item.severity === "S2").length,
    S3: findings.filter((item) => item.severity === "S3").length,
  });
}

export function runNexoraSimulationTestJourney(input: {
  readonly journey: NexoraSimulationTestJourney;
  readonly runId: string;
}): NexoraSimulationTestRunReport {
  validateNexoraSimulationTestJourney(input.journey);
  resetCsvRealDataImportStoreForTests();
  resetOutcomeObservationCaptureForTests();
  resetPostDecisionCaptureForTests();
  if (SIM_TEST_1_BOUNDARY.ingestionImplemented || SIM_TEST_1_BOUNDARY.autoRepairs) throw new Error("SIM-TEST:1 boundary violation");
  if (RMS_REAL_CONVERSATION_ENTRY_NAME !== "executeNexoraConversationalExperience") throw new Error("SIM-TEST:1 requires real CC:5");

  const journey = input.journey;
  const scenario = resolveRmsScenario({ scenarioId: journey.scenarioId, version: journey.scenarioVersion });
  const world = scenario.instantiateWorld();
  const testRunId = `sim-test-1:${journey.journeyId}:${input.runId}`;
  const rmsRunId = `rms:${input.runId}`;
  const session = createRmsFoundationSession({
    simulationId: `rms-7:${scenario.scenarioId}`,
    simulationType: "scenario-library",
    sessionId: `rms-7-${rmsRunId}`,
    runId: rmsRunId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: RMS_SCENARIO_RUN_ACTORS,
    groundTruth: world,
  });
  loadRmsEventSchedule(
    session,
    RMS_SCENARIO_OPERATOR_ACTOR,
    journey.adaptiveEventPack === "MACHINE_RECOVERY"
      ? Object.freeze([...scenario.eventSchedule, RMS_NORTHSTAR_MACHINE_RECOVERY])
      : scenario.eventSchedule,
  );
  prepareRmsManagerConversation(session, RMS_SCENARIO_MANAGER_ACTOR, {
    profile: RMS_MANAGER_PROFILES[journey.managerProfileId],
    objective: scenario.managerObjective,
    knowledge: emptyRmsManagerKnowledge(scenario.managerVisibleContext),
    behaviorSeed: journey.behaviorSeed ?? null,
  });

  const checkpoints: NexoraSimulationTestCheckpoint[] = [];
  const journeyObservations: NexoraSimulationJourneyTurnObservation[] = [];
  const findingMap = new Map<string, NexoraSimulationTestFinding>();
  let lastCc5: RmsCc5Turn | null = null;
  let turns = 0;
  let tick = 0;
  let unpublishedWorld = false;
  let worldAdvances = 0;
  let publications = 0;
  let stopReason: NexoraSimulationTestRunReport["stopReason"] = "JOURNEY_COMPLETE";
  let error: string | null = null;
  const csvFiles: SimulationCsvFileVersion[] = [];
  const ingestionStates: SimulationCsvIngestionState[] = [];
  const ingestionTraces: SimulationIngestionTrace[] = [];
  const ingestionPublicationIds: string[] = [];
  const ingestedMetricKeys = new Set<string>();
  const ingestionEligibleFields = new Set<string>();
  const expectedObservationFields = observationPolicyForSources(
    scenario.enabledSources,
  ).map((rule) => rule.field);
  const trace = (kind: Parameters<typeof traceSimulationCsvIngestion>[0]["kind"], extras?: {
    sourceType?: Parameters<typeof traceSimulationCsvIngestion>[0]["sourceType"];
    fileName?: string | null;
    ref?: string;
  }) => ingestionTraces.push(traceSimulationCsvIngestion({
    tick,
    sequence: ingestionTraces.length,
    kind,
    sourceType: extras?.sourceType,
    fileName: extras?.fileName,
    ref: extras?.ref ?? `${rmsRunId}:tick:${tick}`,
  }));

  const capture = (kind: NexoraSimulationTestCheckpointKind) => {
    const checkpoint = captureCheckpoint({
      kind,
      index: checkpoints.length,
      tick,
      turnCount: turns,
      ledger: inspectRmsOperatorLedger(session, RMS_SCENARIO_OBSERVER_ACTOR),
      conversation: inspectRmsManagerConversation(session, RMS_SCENARIO_OBSERVER_ACTOR),
      lastCc5,
      ingestionPublicationIds,
    });
    checkpoints.push(checkpoint);
    return checkpoint;
  };

  const observe = () => {
    const report = measureRmsObserverIntelligence(session, RMS_SCENARIO_OBSERVER_ACTOR, journey.mode === "INGESTION"
      ? {
          publishedMetricKeys: Object.freeze([...ingestedMetricKeys]),
          expectedObservationFields,
          publicationEligibleFields: Object.freeze([...ingestionEligibleFields]),
        }
      : { expectedObservationFields });
    const checkpoint = checkpoints[checkpoints.length - 1] ?? null;
    for (const finding of report.findings) {
      const ids = finding.measurementIds.length > 0 ? finding.measurementIds : [finding.findingId];
      for (const measurementId of ids) {
        const managerTurn = measurementTurn(measurementId) ?? checkpoint?.managerTurn ?? 0;
        const projected = projectNexoraSimulationTestFinding({
          finding, testRunId, journey, rmsRunId, checkpoint, measurementId, managerTurn,
        });
        findingMap.set(projected.findingId, projected);
      }
    }
    return shouldStopNexoraSimulationTest([...findingMap.values()]);
  };

  try {
    for (const step of journey.steps) {
      if (step.kind === "ADVANCE_WORLD") {
        if (step.atTick > journey.boundedDurationTicks) { stopReason = "TICK_BUDGET"; break; }
        if (step.atTick > tick) {
          stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, step.atTick);
          if (journey.mode === "INGESTION") trace("GROUND_TRUTH_CHANGED");
        }
        tick = step.atTick;
        unpublishedWorld = true;
        worldAdvances += 1;
      } else if (step.kind === "PUBLISH_OBSERVABLE_DATA") {
        if (step.atTick > journey.boundedDurationTicks) { stopReason = "TICK_BUDGET"; break; }
        if (step.atTick > tick) {
          stepRmsEventSchedule(session, RMS_SCENARIO_OPERATOR_ACTOR, step.atTick);
          if (journey.mode === "INGESTION") trace("GROUND_TRUTH_CHANGED");
        }
        tick = step.atTick;
        unpublishedWorld = false;
        publications += 1;
        const observations = runRmsOperatorObservation(session, RMS_SCENARIO_OPERATOR_ACTOR, { enabledSources: scenario.enabledSources });
        if (journey.mode === "FAST") {
          publishRmsOperatorObservableData(session, RMS_SCENARIO_OPERATOR_ACTOR, observations);
        } else {
          trace("OPERATOR_OBSERVED", { ref: observations.map((item) => item.recordId).join(",") });
          const projected = projectRmsOperatorRecordsToCsv({
            scenarioId: scenario.scenarioId,
            simulationRunId: rmsRunId,
            tick,
            records: observations,
            previous: csvFiles,
          });
          for (const file of projected) {
            for (const record of observations) {
              if (record.sourceFamily === file.sourceType && record.status === "AVAILABLE") {
                ingestionEligibleFields.add(record.field);
              }
            }
            const isUpdate = csvFiles.some((item) => item.sourceType === file.sourceType);
            csvFiles.push(file);
            trace(isUpdate ? "CSV_UPDATED" : "CSV_GENERATED", { sourceType: file.sourceType, fileName: file.fileName, ref: file.fileId });
            trace("INGESTION_STARTED", { sourceType: file.sourceType, fileName: file.fileName, ref: file.provenance.sourceContextId });
            const state = ingestSimulationCsvFile(file);
            ingestionStates.push(state);
            if (state.committed) {
              if (state.publicationRef) ingestionPublicationIds.push(state.publicationRef);
              for (const record of state.prepared?.handoff?.dataset.records ?? []) ingestedMetricKeys.add(record.metricKey);
              for (const record of observations) {
                if (record.sourceFamily === file.sourceType && record.status === "AVAILABLE") ingestedMetricKeys.add(record.field);
              }
              trace("INGESTION_COMPLETED", { sourceType: file.sourceType, fileName: file.fileName, ref: state.publicationRef ?? file.fileId });
              trace("DATA_REALITY_UPDATED", { sourceType: file.sourceType, fileName: file.fileName, ref: state.prepared?.dataReality?.snapshot.datasetId ?? file.fileId });
            }
          }
        }
        capture("DATA_VISIBLE");
      } else if (step.kind === "MANAGER_TURN") {
        if (turns >= journey.turnBudget) { stopReason = "TURN_BUDGET"; break; }
        const priorSubject = inspectRmsManagerConversation(session, RMS_SCENARIO_OBSERVER_ACTOR).knowledge?.currentSubject ?? null;
        const turn = runRmsManagerConversationTurn(
          session,
          RMS_SCENARIO_MANAGER_ACTOR,
          step.utterance ? { forcedUtterance: step.utterance } : undefined,
        );
        const shaped = step.utterance ? null : shapePopulationManagerTurn({
          utterance: turn.utterance,
          intent: turn.intent,
          priorSubject,
        });
        turns += 1;
        lastCc5 = turn.result;
        if (journey.mode === "INGESTION") {
          trace("MANAGER_TURN", { ref: `${rmsRunId}:manager:${turns}` });
          trace("NEXORA_OBSERVED", { ref: `${rmsRunId}:nexora:${turns}` });
        }
        capture("MANAGER_TURN_COMPLETED");
        const completed = capture("NEXORA_TURN_COMPLETED");
        if (isManagerTurn(step) && turn.result) {
          const ledger = inspectRmsOperatorLedger(session, RMS_SCENARIO_OBSERVER_ACTOR);
          journeyObservations.push(decorateJourneyObservation({
            turn: turns,
            tick,
            intent: step.managementIntent ?? shaped?.managementIntent ?? null,
            utterance: step.utterance ?? turn.utterance,
            deictic: step.deictic === true || shaped?.deictic === true,
            intendedSubject: step.intendedSubject ?? shaped?.intendedSubject ?? null,
            response: completed.nexoraResponse ?? "",
            conversationSubjectId: completed.conversationSubjectId,
            canonicalSubjectId: completed.canonicalSubjectId,
            focusedSubjectLabel: turn.result.nextRuntimeState.focusedSubject?.label ?? null,
            nmiCanonicalId: turn.result.nmiAdvisorComposition?.activeCanonicalId ?? null,
            advisorReferentId: turn.result.nxaAdvisorContract?.referentId ?? null,
            advisorReferentName: turn.result.nxaAdvisorContract?.referentName ?? null,
            mlevelL1: completed.mlevel.l1ActiveId,
            mlevelL2: completed.mlevel.l2ParentId,
            mlevelL3: completed.mlevel.l3GrandparentId,
            mlevelVisibleDepth: completed.mlevel.visibleDepth,
            ancestorApplicable: completed.mlevel.l2ParentId ? "CANONICAL" : "NOT_APPLICABLE",
            stageActiveSubjectId: completed.stage.activeSubjectId,
            stageSelectedObjectId: completed.stage.selectedObjectId,
            sceneIntent: completed.stage.sceneIntent,
            clarificationRequired: completed.clarificationRequired === true,
            decisionStatus: completed.decisionStatus,
            npsState: turn.result.npsPath?.currentState ?? null,
            npsProblemLabel: turn.result.npsPath?.problemLabel ?? null,
            vaiFocalObjectId: turn.result.vaiAdvisorAnalysis?.focalObjectId ?? null,
            vaiRoleSummaries: Object.freeze([...(turn.result.vaiAdvisorAnalysis?.roleSummaries ?? [])]),
            dataPublicationIds: completed.dataRealityPublicationIds,
            csvVersions: latestCsvVersions(csvFiles),
            visibleNumbers: latestVisibleNumbers(ledger),
            observerHiddenNumbers: observerHiddenNumbers(session),
            worldAdvancedUnpublished: unpublishedWorld,
            activeScenarioId: turn.result.nextScenarioSession?.activeScenarioId ?? null,
            scenarioCandidateIds: Object.freeze([
              ...(turn.result.nextScenarioSession?.candidateScenarioIds ?? []),
            ]),
            scenarioLedger: Object.freeze(
              Object.values(turn.result.nextScenarioSession?.scenariosById ?? {}).map((scenario) => Object.freeze({
                scenarioId: scenario.scenarioId,
                title: scenario.name,
                subjectIds: Object.freeze([...scenario.subjectIds]),
                sourceSubjectId: scenario.sourceSubjectId ?? scenario.interventions[0]?.subjectId ?? null,
                parentScenarioId: scenario.parentScenarioId ?? null,
              })),
            ),
            decisionLedger: Object.freeze(
              (turn.result.decisionRuntime?.listDecisions() ?? []).map((decision) => Object.freeze({
                decisionId: decision.decisionId,
                title: decision.title,
                status: decision.status,
                subjectIds: Object.freeze([...decision.subjectIds]),
                scenarioId: decision.scenarioId ?? null,
              })),
            ),
            executionLedger: Object.freeze(
              (turn.result.executionRuntime?.listExecutions() ?? []).map((execution) => Object.freeze({
                executionId: execution.executionId,
                decisionId: execution.decisionId,
                status: execution.status,
              })),
            ),
            ...lifecycleSlice(turn.result),
            focusedSubjectId: turn.result.nextRuntimeState.focusedSubject?.id ?? null,
            consumedSupportedLearning: turn.result.ecaLearningClosureJudgment?.consumedSupportedLearning === true,
            coreOut2LearningIds: Object.freeze([...(turn.result.ecaLearningClosureJudgment?.coreOut2LearningIds ?? [])]),
            ecaLearningStatement: turn.result.ecaLearningClosureJudgment?.learningStatement ?? null,
            ecaLastLearningNote: turn.result.managerObjectTurn.session.ecaLearningClosureSession?.lastLearningNote ?? null,
            ecaLastFingerprint: turn.result.managerObjectTurn.session.ecaLearningClosureSession?.lastFingerprint ?? null,
            scenarioLearningInformedSubjectId:
              turn.result.nextScenarioSession?.learningInformedReassessment?.subjectId ?? null,
            scenarioLearningInformedIds: Object.freeze([
              ...(turn.result.nextScenarioSession?.learningInformedReassessment?.coreOut2LearningIds ?? []),
            ]),
          }));
        }
      } else if (step.kind === "INTERACT_VISIBLE") {
        if (lastCc5) {
          const live: RmsCc5Turn = lastCc5;
          const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
          const current: NexoraMVPObjectInteractionState = live.nextRuntimeState;
          const focusedId = current.focusedSubject?.id ?? live.trace.executiveCurrentSubjectId ?? null;
          const nmi = hostNmiLiveManagementIntelligence({ catalog, focusedSubjectId: focusedId });
          const levels = composeNmiLiveManagementLevels({ map: nmi.map, selectedCanonicalId: focusedId });
          let targetId: string | null = null;
          if (step.surface === "STAGE_FOCUSED") targetId = focusedId;
          else if (step.surface === "MLEVEL_L2") targetId = levels.path.parent?.canonicalId ?? null;
          else if (step.surface === "MLEVEL_L3") targetId = levels.path.grandparent?.canonicalId ?? null;
          else {
            const visible = unique([
              current.selectedSubject?.id,
              ...(current.trail.map((item) => item.id)),
              ...(current.collectionContext?.objectIds ?? []),
            ]).filter((id) => id !== focusedId);
            targetId = visible[0] ?? null;
          }
          if (targetId) {
            let nextState: NexoraMVPObjectInteractionState = current;
            if (step.surface === "MLEVEL_L2" || step.surface === "MLEVEL_L3") {
              const applied = applyManagementLevelInteraction({
                request: classifyManagementLevelInteraction({
                  path: levels.path,
                  map: nmi.map,
                  kind: "ACTIVATE",
                  sourceLevel: step.surface === "MLEVEL_L2" ? "PARENT" : "GRANDPARENT",
                  targetCanonicalId: targetId,
                }),
                path: levels.path,
                map: nmi.map,
                interactionState: current,
                catalog,
              });
              nextState = applied.nextInteractionState;
            } else {
              nextState = selectNexoraMVPInteractionSubject(current, targetId, catalog);
            }
            lastCc5 = { ...live, nextRuntimeState: nextState };
          }
        }
        capture("SUBJECT_SELECTED");
      } else {
        for (const kind of step.checkpoints) capture(kind);
      }
      if (observe()) { stopReason = "S0"; break; }
    }
    for (const kind of journey.requiredCheckpoints) {
      if (!checkpoints.some((item) => item.kind === kind)) capture(kind);
    }
    observe();
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    stopReason = "RUNTIME_ERROR";
  }

  const observerFindings = Object.freeze([...findingMap.values()]);
  const intentDriven = journeyObservations.some((item) => item.intent != null)
    || journey.steps.some((step) => step.kind === "MANAGER_TURN" && step.managementIntent);
  const managerMeasured = intentDriven
    ? classifyManagerJourney({
        testRunId,
        rmsRunId,
        journey,
        observations: journeyObservations,
        causalOverclaimTurns: observerFindings
          .filter((finding) => finding.classification.includes("CAUSAL_OVERCLAIM"))
          .map((finding) => finding.managerTurn),
      })
    : Object.freeze({
        findings: Object.freeze([]),
        continuity: EMPTY_MANAGEMENT_CONTINUITY,
        freshness: Object.freeze([]),
      });
  const lifecycleFindings = journey.targetSurfaces.includes("CC10") || journey.targetSurfaces.includes("CC11")
    ? classifyLifecycleJourney({
        testRunId,
        rmsRunId,
        journey,
        observations: journeyObservations,
      })
    : Object.freeze([]);
  const adaptiveFindings = classifyAdaptiveJourney({
    testRunId,
    rmsRunId,
    journey,
    observations: journeyObservations,
  });
  const measured = Object.freeze({
    findings: Object.freeze([...managerMeasured.findings, ...lifecycleFindings, ...adaptiveFindings]),
    continuity: managerMeasured.continuity,
    freshness: managerMeasured.freshness,
  });
  const materialJourneyFindings = measured.findings.filter((finding) =>
    (finding.severity === "S0" || finding.severity === "S1")
    && finding.classification !== "JOURNEY/UNSUPPORTED_CAUSAL_CLAIM",
  );
  const managerInspection = inspectRmsManagerConversation(session, RMS_SCENARIO_OBSERVER_ACTOR);
  const firewallClosed = managerInspection.profile?.groundTruthAccess === false
    && managerInspection.knowledge?.observerKnowledge === false
    && managerInspection.knowledge?.sealedGroundTruth === false
    && managerInspection.fedGroundTruthToManager === false;
  const firewallFindings = firewallClosed ? [] : [Object.freeze({
    findingId: `${testRunId}:firewall`,
    testRunId,
    journeyId: journey.journeyId,
    scenarioId: journey.scenarioId,
    scenarioVersion: journey.scenarioVersion,
    rmsRunId,
    tick,
    managerTurn: turns,
    visibleDataRefs: Object.freeze([]),
    activeCanonicalSubjectId: null,
    mlevelActiveId: null,
    stageActiveSubjectId: null,
    observedBehavior: "Manager firewall was open",
    expectedInvariant: "Manager Agent cannot read Ground Truth or Observer knowledge",
    classification: "JOURNEY/KNOWLEDGE_LEAK",
    severity: "S0" as const,
    likelyOwner: "MANAGER_AGENT" as const,
    traceReferences: Object.freeze([`${rmsRunId}:manager-firewall`]),
    repaired: false as const,
  })];
  const findings = Object.freeze([...observerFindings, ...materialJourneyFindings, ...firewallFindings]);
  const finalWorld = inspectRmsGroundTruth(session, RMS_SCENARIO_OBSERVER_ACTOR);
  const eventInspection = inspectRmsEventSchedule(session, RMS_SCENARIO_OBSERVER_ACTOR);
  const finalStatus = error ? "ERROR" : stopReason === "JOURNEY_COMPLETE" ? "COMPLETED" : "STOPPED";
  const deterministicSignature = signatureOf({
    journey,
    turns,
    ticks: tick,
    checkpoints,
    findings,
    journeyFindings: measured.findings,
  });
  return Object.freeze({
    identity: Object.freeze({
      simulationTestRunId: testRunId,
      journeyId: journey.journeyId,
      journeyVersion: journey.version,
      scenarioId: scenario.scenarioId,
      scenarioVersion: scenario.version,
      rmsSimulationId: session.identity.simulationId,
      rmsRunId,
      managerProfileId: journey.managerProfileId,
      mode: journey.mode,
      startedAt: world.clock.simulatedAt,
      endedAt: finalWorld.clock.simulatedAt,
      observerReportRef: `${rmsRunId}:observer`,
      finalStatus,
    }),
    harnessStatus: error ? "FAIL" : "PASS",
    productStatus: findings.length > 0 ? "FAIL" : "PASS",
    stopReason,
    turns,
    ticks: tick,
    checkpoints: Object.freeze(checkpoints),
    findings,
    findingCounts: counts(findings),
    deterministicSignature,
    autoRepairAttempted: false as const,
    ingestionActivated: journey.mode === "INGESTION",
    ingestion: journey.mode === "INGESTION" ? Object.freeze({
      files: Object.freeze(csvFiles),
      states: Object.freeze(ingestionStates),
      traces: Object.freeze(ingestionTraces),
    }) : null,
    journeyObservations: Object.freeze(journeyObservations),
    journeyFindings: measured.findings,
    continuity: measured.continuity,
    freshness: measured.freshness,
    managerFirewall: firewallClosed
      ? Object.freeze({
          groundTruthAccess: false as const,
          observerKnowledge: false as const,
          sealedGroundTruth: false as const,
        })
      : null,
    adaptiveTrace: Object.freeze({
      worldAdvances,
      publications,
      unpublishedAsks: journeyObservations.filter((item) => item.worldAdvancedUnpublished).length,
      eventTraces: eventInspection.runtime?.traces.length ?? 0,
      hiddenFromNexora: true as const,
      hiddenFromManager: true as const,
      writeAttempted: false as const,
    }),
    error,
  });
}

export function aggregateNexoraSimulationTestReports(
  suiteId: string,
  reports: readonly NexoraSimulationTestRunReport[],
): NexoraSimulationTestAggregateReport {
  const severity = { S0: 0, S1: 0, S2: 0, S3: 0 };
  const owners: Partial<Record<NexoraSimulationTestFailureOwner, number>> = {};
  for (const report of reports) {
    for (const level of Object.keys(severity) as NexoraSimulationTestSeverity[]) severity[level] += report.findingCounts[level];
    for (const finding of report.findings) owners[finding.likelyOwner] = (owners[finding.likelyOwner] ?? 0) + 1;
  }
  return Object.freeze({
    suiteId: requireText(suiteId, "suiteId"),
    journeysRun: reports.length,
    domainsExercised: unique(reports.map((item) => item.identity.scenarioId)),
    turns: reports.reduce((sum, item) => sum + item.turns, 0),
    simulationTicks: reports.reduce((sum, item) => sum + item.ticks, 0),
    findingsBySeverity: Object.freeze(severity),
    findingsByOwner: Object.freeze(owners),
    reproducible: reports.every((item) => item.deterministicSignature.startsWith("fnv1a32:")),
    harnessFailures: reports.filter((item) => item.harnessStatus === "FAIL").length,
    productFailures: reports.filter((item) => item.productStatus === "FAIL").length,
    crossRunIsolation: assessCrossRunIsolation(reports).status,
    reports: Object.freeze([...reports]),
  });
}
