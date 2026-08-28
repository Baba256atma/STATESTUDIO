/**
 * NXA:5-FIX3D-DIAG — read-only reproduction. Writes artifacts only.
 * Does not change production or test sources.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveNexoraConversationalIntent } from "../../../app/lib/conversational-control/conversationalIntentResolver.ts";
import { normalizeNexoraConversationalUtterance } from "../../../app/lib/conversational-control/conversationalIntentNormalization.ts";
import { executeNexoraConversationalExperience } from "../../../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "../../../app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../../../app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectConversationPathTrace } from "../../../app/lib/nexora-certification/nxaConversationPathTrace.ts";
import { createConversationDiagnosis } from "../../../app/lib/nexora-certification/nxaConversationDiagnosis.ts";
import {
  getDiagnosticStatus,
  installDiagnosticConsoleHelper,
  isDiagnosticEnabled,
} from "../../../app/lib/runtime/diagnosticSwitch.ts";
import { getExecutiveOperationsDemoDataset } from "../../../app/lib/data-reality/demo/executiveOperationsDemoDataset.ts";
import { resolveDataRealityExecutiveAdvisorIntegration } from "../../../app/lib/data-reality/dataRealityExecutiveAdvisorIntegration.ts";
import { formatCanonicalStageKpiValue } from "../../../app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../../../app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "../../../app/lib/nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience.ts";
import { applyNca6StrategyToResponse } from "../../../app/lib/manager-object/nexoraNca6CommunicationIntelligence.ts";
import { evaluateNca6CommunicationStrategy } from "../../../app/lib/manager-object/nexoraNca6CommunicationIntelligence.ts";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function p12FormatDeterministicNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const fixed = value.toFixed(4);
  return fixed.replace(/\.?0+$/, "");
}

function kpiEvidenceInterpolation(value: number, unit: string): string {
  return `${String(value)}${unit}`;
}

installDiagnosticConsoleHelper();
const diagnostics = (globalThis as unknown as {
  nexoraDiagnostics: {
    enableScope: (s: string) => unknown;
    disableScope: (s: string) => unknown;
    status: () => unknown;
  };
}).nexoraDiagnostics;
diagnostics.enableScope("nxaConversation");
const nxaConversationEnabledDuringRun = isDiagnosticEnabled("nxaConversation");

function initial(presentationState: "minimum" | "report" = "minimum") {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
}

function snapshotTurn(utterance: string, previous: ReturnType<typeof executeNexoraConversationalExperience> | null, runtime: ReturnType<typeof initial>) {
  const normalized = normalizeNexoraConversationalUtterance(utterance);
  const cc1 = resolveNexoraConversationalIntent({ utterance });
  const result = executeNexoraConversationalExperience({
    utterance,
    runtimeState: runtime,
    catalog,
    executiveSubjects: subjects,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix3d-${utterance.slice(0, 28)}`,
  });
  const path = projectConversationPathTrace({
    utterance,
    inheritedSubjectId: runtime.focusedSubject?.id ?? null,
    result,
  });
  return {
    utterance,
    normalized,
    cc1Kind: cc1.intent.kind,
    presentedResponse: result.response,
    commandKind: result.commandResult?.command?.kind ?? null,
    commandPrimary: result.commandResult?.command?.primaryTargetId ?? null,
    nxaNeed: result.nxaAdvisorContract?.need ?? null,
    nxa5Type: result.executiveJudgment?.judgmentType ?? null,
    explanation: result.managerObjectTurn.explanation.managerFacingText,
    trustedAnswer: result.trustedCommunication.answer,
    path,
    nextRuntime: result.nextRuntimeState,
    result,
  };
}

const continueUtterance = "Continue reviewing Customer";
const focusTurn = snapshotTurn("focus Customer", null, initial("report"));
const continueTurn = snapshotTurn(continueUtterance, focusTurn.result, focusTurn.nextRuntime);
const explainTurn = snapshotTurn("explain Customer", null, initial("report"));

const dataset = getExecutiveOperationsDemoDataset();
const integration = resolveDataRealityExecutiveAdvisorIntegration({
  dataset,
  focusedObjectId: "obj-customer",
  selectedObjectIds: ["obj-customer"],
  currentWorkspace: "problem",
  requestedIntent: "investigate",
  responseMode: "standard",
  maxEvidenceItems: 3,
});

const customerKpi = integration.dataRealitySnapshot.kpis.find((item) => item.kpiId === "kpi.customer.satisfaction-index")!;
const customerState = integration.dataRealitySnapshot.objectStates.find((item) => item.objectKey === "customer")!;
const customerFacts = integration.dataRealitySnapshot.facts.filter((item) => item.objectKey === "customer");
const evidence = integration.advisorContext.evidence;
const sections = integration.response.sections.map((section) => ({ kind: section.kind, text: section.text }));

const scorePercent = (4.2 / 5) * 100;
const synthetic = [
  84.00000000000001,
  84.05000000000001,
  84.50000000000001,
  84.56789,
  0,
  -2.5000000000000004,
  100,
  0.00001,
  1234567.89,
  Number.NaN,
  Number.POSITIVE_INFINITY,
];

const numericInventory = synthetic.map((value) => ({
  input: value,
  isFinite: Number.isFinite(value),
  isInteger: Number.isInteger(value),
  stringCoercion: String(value),
  json: JSON.stringify(value),
  p12FormatDeterministicNumber: Number.isFinite(value) ? p12FormatDeterministicNumber(value) : "NON_FINITE_NOT_HANDLED_BY_P12",
  p15KpiInterpolation: Number.isFinite(value) ? kpiEvidenceInterpolation(value, "%") : `String:${String(value)}%`,
  stageToFixed1Percent: Number.isFinite(value) ? formatCanonicalStageKpiValue(value, "%") : "NON_FINITE",
  stageToFixed1Score: Number.isFinite(value) ? formatCanonicalStageKpiValue(value, "score") : "NON_FINITE",
  userExampleExpectedPercent:
    value === 84.00000000000001
      ? "84%"
      : value === 84.05000000000001
        ? "84.05%"
        : value === 84.50000000000001
          ? "84.5%"
          : null,
}));

const stageExperience = resolveNexoraMVPDataRealityAwareStageExperience({
  dataset,
  focusedObjectId: "obj-customer",
  selectedObjectId: "obj-customer",
  selectedObjectIds: ["obj-customer"],
  currentWorkspace: "problem",
  presentationState: "report",
  requestedIntent: "investigate",
});
const customerStageObject = stageExperience.catalog.objects.find((item) => item.id === "obj-customer");
const customerStageBinding = stageExperience.stageBinding.objects.find((item) => item.objectId === "obj-customer");
const advisorExperience = resolveNexoraMVPDataRealityAwareAdvisorExperience({
  runtimeState: stageExperience.runtimeState,
  focusedObjectId: "obj-customer",
  selectedObjectId: "obj-customer",
  presentationState: "report",
  workspace: "problem",
});
const binding = advisorExperience.advisorBinding;

const nca6OnP15 = evaluateNca6CommunicationStrategy({
  utterance: continueUtterance,
  source: integration.response.summary,
  nca: continueTurn.result.ncaTurn,
  conversation: continueTurn.result.ncaConversationState ?? null,
  nca3: continueTurn.result.nca3Strategy ?? null,
  nca4: continueTurn.result.nca4Strategy ?? null,
  nca5: continueTurn.result.nca5Strategy ?? null,
});
const nca6AppliedUnlocked = applyNca6StrategyToResponse({
  source: integration.response.summary,
  strategy: nca6OnP15,
  locked: false,
});
const nca6AppliedLocked = applyNca6StrategyToResponse({
  source: integration.response.summary,
  strategy: nca6OnP15,
  locked: true,
});

diagnostics.disableScope("nxaConversation");
const nxaConversationAfterDisable = isDiagnosticEnabled("nxaConversation");

const observedTarget = [
  "Customer Performance Requires Attention",
  "Customer requires executive attention.",
  "Customer Satisfaction Index is 84.00000000000001%.",
  "Customer executive state is attention.",
  "Customer maximumSatisfactionScore raw fact = 5 score.",
  "Customer performance is below the preferred operating range and may require investigation.",
  "Investigate Customer watch conditions.",
].join(" ");

const traces = {
  identity: "NXA:5-FIX3D-DIAG/Reproduction",
  nxaConversationEnabledDuringRun,
  nxaConversationAfterDisable,
  diagnosticStatusAfter: getDiagnosticStatus(),
  continueUtterance,
  preTurn: {
    activeFocusedObject: "obj-customer / Customer",
    activeCollection: null,
    previousAdvisorTurn: "focus Customer (or equivalent Stage focus)",
    dialogueJourney: continueTurn.path.dialogueJourney,
    customerEvidence: evidence.map((item) => ({
      id: item.id,
      sourceKind: item.sourceKind,
      label: item.label,
      summary: item.summary,
      value: item.value,
      unit: item.unit ?? null,
    })),
    kpiSource: {
      kpiId: customerKpi.kpiId,
      name: "Customer Satisfaction Index",
      computationKind: "score-percent",
      formula: "(satisfactionScore / maximumSatisfactionScore) * 100",
      left: 4.2,
      right: 5,
      canonicalIeeeValue: customerKpi.value,
      equalsFourPointTwoOverFiveTimes100: customerKpi.value === scorePercent,
      unit: customerKpi.unit,
      storedRepresentation: typeof customerKpi.value,
    },
    rawNumericRepresentation: {
      satisfactionScore: 4.2,
      maximumSatisfactionScore: 5,
      computed: scorePercent,
      snapshotKpi: customerKpi.value,
    },
    units: { kpi: "%", facts: "score" },
    dataRealityState: {
      datasetId: dataset.id,
      scenario: dataset.scenario,
      objectKey: "customer",
      executiveState: customerState.state,
      advisorState: integration.advisorContext.dominantState,
    },
    executiveState: customerState.state,
    advisorResponseMode: integration.response.mode,
    stageEffect: continueTurn.path.plannedPresentation,
  },
  p15: {
    headline: integration.response.headline,
    summary: integration.response.summary,
    tone: integration.response.tone,
    mode: integration.response.mode,
    sections,
    matchesObservedTarget: integration.response.summary === observedTarget,
    observedTarget,
  },
  cc5: {
    focus: {
      reply: focusTurn.presentedResponse,
      focusId: focusTurn.path.focusId,
      path: focusTurn.path,
    },
    continueReviewing: {
      reply: continueTurn.presentedResponse,
      focusId: continueTurn.path.focusId,
      nxaNeed: continueTurn.nxaNeed,
      explanation: continueTurn.explanation,
      trustedAnswer: continueTurn.trustedAnswer,
      path: continueTurn.path,
      containsFloatArtifact: /84\.00000000000001/.test(continueTurn.presentedResponse),
      containsRawFact: /raw fact/.test(continueTurn.presentedResponse),
    },
    explainCustomer: {
      reply: explainTurn.presentedResponse,
      explanation: explainTurn.explanation,
    },
  },
  crossSurface: {
    canonicalKpiValue: customerKpi.value,
    p12FormattedSummaryWouldBe: `${p12FormatDeterministicNumber(customerKpi.value)}${customerKpi.unit}`,
    p15KpiEvidenceText: sections.find((item) => item.kind === "evidence")?.text ?? null,
    stagePrimaryValue: customerStageObject?.primaryValue ?? null,
    stagePrimaryMetricLabel: customerStageObject?.primaryMetricLabel ?? null,
    stageBindingKpi: customerStageBinding?.primaryKPI ?? null,
    advisorBindingHeadline: binding.headline,
    advisorBindingSummary: binding.summary.summary,
    advisorBindingPrimaryMeaning: binding.primarySubject?.advisorMeaning ?? null,
    advisorBindingPrimaryAction: binding.recommendations.primaryAction?.title ?? null,
    mo2Explain: explainTurn.explanation,
  },
  nca6Bypass: {
    nca6AppliedUnlocked,
    nca6AppliedLocked,
    lockedWouldRewriteWatch: /worth monitoring/.test(nca6AppliedLocked),
    unlockedStillHasWatch: /watch conditions/.test(nca6AppliedUnlocked),
    unlockedStillHasRawFact: /raw fact/.test(nca6AppliedUnlocked),
  },
  facts: customerFacts,
};

writeFileSync(join(outDir, "reproduction-traces.json"), JSON.stringify(traces, null, 2));
writeFileSync(join(outDir, "numeric-presentation-inventory.json"), JSON.stringify({
  identity: "NXA:5-FIX3D-DIAG/NumericInventory",
  note: "p12FormatDeterministicNumber is a read-only replica of the private P1:2 helper; not a new formatter.",
  items: numericInventory,
}, null, 2));
writeFileSync(join(outDir, "numeric-value-flow.json"), JSON.stringify({
  identity: "NXA:5-FIX3D-DIAG/NumericValueFlow",
  layers: [
    { layer: "dataset-fact", satisfactionScore: 4.2, maximumSatisfactionScore: 5, unit: "score" },
    { layer: "kpi-computation-score-percent", formula: "(left/right)*100", ieee: scorePercent, stored: customerKpi.value },
    { layer: "p1-2-kpi-evidence.value", value: evidence.find((item) => item.sourceKind === "kpi")?.value, formattedSummary: evidence.find((item) => item.sourceKind === "kpi")?.summary },
    { layer: "p1-5-formatEvidenceText-kpi", interpolation: `String(value)+unit`, actual: kpiEvidenceInterpolation(customerKpi.value, customerKpi.unit) },
    { layer: "p1-5-summary-join", summaryContains: integration.response.summary.includes("84.00000000000001%") },
    { layer: "stage-formatCanonicalStageKpiValue", actual: formatCanonicalStageKpiValue(customerKpi.value, customerKpi.unit) },
  ],
}, null, 2));
writeFileSync(join(outDir, "language-label-source-trace.json"), JSON.stringify({
  identity: "NXA:5-FIX3D-DIAG/LanguageLabelSource",
  terms: {
    maximumSatisfactionScore: {
      source: "NexoraBusinessFact.metricKey interpolated in P1:2 buildBusinessFactEvidence label/summary",
      csvVerticalSliceLabelExists: "Maximum Satisfaction Score in csvRealDataVerticalSlice.ts",
      p12UsesLabel: false,
    },
    rawFact: {
      source: "P1:2 buildBusinessFactEvidence summary template '... raw fact = ...'",
      nca6StripsRawFact: false,
      final64ArchLeakIncludesRawFact: false,
    },
    attentionEnum: {
      source: "P0 executive state 'attention' interpolated in P1:2 buildExecutiveStateEvidence; P1:5 replaces ' = ' with ' is '",
      advisorState: integration.advisorContext.dominantState,
      p0State: customerState.state,
    },
    watchConditions: {
      source: "P1:4 guidanceTitle investigate: `Investigate ${displayName} ${state} conditions` with advisor state 'watch'",
    },
    fiveScore: {
      source: "unit suffix 'score' from fact.unit appended after formatted integer 5",
    },
  },
  sections,
}, null, 2));

function diagnosis(input: Parameters<typeof createConversationDiagnosis>[0] & { impactClassification: string }) {
  return { ...createConversationDiagnosis(input), impactClassification: input.impactClassification };
}

const diagnoses = {
  numericPrecision: diagnosis({
    defectId: "NXA-5-FIX3D-NUMERIC",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "Dataset A baseline; focusedObjectId obj-customer; P1:5 mode standard; presentationState report.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Manager-facing percent without IEEE residue; canonical 84.00000000000001 unchanged.",
    actual: `P1:5 evidence: Customer Satisfaction Index is ${String(customerKpi.value)}%. Stage: ${formatCanonicalStageKpiValue(customerKpi.value, "%")}. CC:5 chat: ${continueTurn.presentedResponse}`,
    firstDivergentLayer: "P1:5 formatEvidenceText KPI branch uses String(evidence.value)+unit, bypassing P1:2 formatDeterministicNumber already used in evidence.summary.",
    authoritativeOwner: "P1:5 dataRealityExecutiveAdvisorResponseComposition.formatEvidenceText (KPI path). Do not mutate kpiComputation.",
    neighboringBehaviors: [
      "P1:2 formatDeterministicNumber(toFixed(4)+strip zeros) would emit 84 for this IEEE value",
      "Stage formatCanonicalStageKpiValue uses toFixed(1) → 84.0%",
      "MO:2 interpolates presentation.primaryKpi.value as already-formatted string",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "NUMERIC_PRESENTATION_DEFECT",
  }),
  internalFieldName: diagnosis({
    defectId: "NXA-5-FIX3D-FIELD-NAME",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "Same P1:5 Customer standard report.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Manager-facing fact label, not camelCase metricKey.",
    actual: evidence.find((item) => item.sourceKind === "business-fact")?.summary ?? "",
    firstDivergentLayer: "P1:2 buildBusinessFactEvidence interpolates fact.metricKey into label and summary; existing CSV/KPI labels are not consulted.",
    authoritativeOwner: "P1:2 dataRealityExecutiveObservationResolution.buildBusinessFactEvidence. Reuse KPI/CSV display labels; do not create a second registry.",
    neighboringBehaviors: ["csvRealDataVerticalSlice already labels Maximum Satisfaction Score", "KPI evidence uses kpiName/reasonName, not kpiId"],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "INTERNAL_LABEL_LEAK",
  }),
  internalTerminology: diagnosis({
    defectId: "NXA-5-FIX3D-ARCH-LANGUAGE",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "Same P1:5 Customer standard report.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Natural executive language; evidence provenance preserved without architecture jargon.",
    actual: integration.response.summary,
    firstDivergentLayer: "P1:2 templates ('raw fact', 'executive state = ${state}') and P1:4 guidanceTitle ('${state} conditions') emit internal terms; NCA:6/FINAL:6.4 leak lists do not include these tokens and this report does not pass through NCA:6 before Advisor overlay.",
    authoritativeOwner: "P1:2 evidence templates + P1:4 guidanceTitle. NCA:6 is not the owner of this copy and currently bypassed.",
    neighboringBehaviors: [
      "NCA:6 ARCHITECTURE_LEAK would rewrite standalone watch→worth monitoring if this text were locked through applyNca6StrategyToResponse",
      "FINAL:6.4 NEXORA_MANAGER_ARCHITECTURE_LEAK does not match raw fact / executive state / watch conditions",
      "MO-INT:1 sanitizeManagerCopy does not cover these terms",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "ARCHITECTURE_LANGUAGE_LEAK",
  }),
  unitWording: diagnosis({
    defectId: "NXA-5-FIX3D-UNIT",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "Same P1:5 Customer standard report.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Unit presented as manager language if needed; not '5 score'.",
    actual: evidence.find((item) => item.sourceKind === "business-fact")?.summary ?? "",
    firstDivergentLayer: "P1:2 appends raw fact.unit ('score') after the number with a space.",
    authoritativeOwner: "P1:2 buildBusinessFactEvidence unitSuffix. Same evidence composer as field-name leak.",
    neighboringBehaviors: ["KPI unit '%' is concatenated with no space in P1:5 KPI path"],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "UNIT_PRESENTATION_DEFECT",
  }),
  repetition: diagnosis({
    defectId: "NXA-5-FIX3D-REPETITION",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "P1:5 standard mode concatenates headline+situation+evidence+meaning+guidance with spaces; no dedupe.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Attention stated once unless a later section adds distinct evidence.",
    actual: integration.response.summary,
    firstDivergentLayer: "P1:5 composeDataRealityExecutiveAdvisorResponse summaryParts.join(' ') with no redundancy policy. Headline, situation, executive-state evidence, and meaning independently restate attention.",
    authoritativeOwner: "P1:5 section join / Conciseness before Narrative principle (declared, not enforced).",
    neighboringBehaviors: [
      "POST:2 rewriteTautologicalAttentionLanguage does not match this pattern",
      "NXA:5 does not compose this report",
      "presentationDensity minimum would hide summary/evidence; report/standard reveals all sections",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "RESPONSE_REDUNDANCY",
  }),
  vagueRecommendation: diagnosis({
    defectId: "NXA-5-FIX3D-RECOMMENDATION",
    utteranceSequence: ["focus Customer", continueUtterance],
    setup: "P1:4 investigate guidance for watch state, non-Production.",
    currentFocus: "obj-customer",
    activeCollection: null,
    journeyOrDialogue: continueTurn.path.dialogueJourney,
    refreshOrRestoration: null,
    expected: "Actionable investigation target that does not leak advisor-state enum.",
    actual: integration.advisoryResolution.guidance[0]?.title ?? "",
    firstDivergentLayer: "P1:4 guidanceTitle investigate default: Investigate ${displayName} ${state} conditions.",
    authoritativeOwner: "P1:4 dataRealityExecutiveAdvisoryResolution.guidanceTitle",
    neighboringBehaviors: ["Production has a special-case title; Customer uses the generic template"],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: "ADVISORY_QUALITY_GAP",
  }),
};

writeFileSync(join(outDir, "diagnosis-records.json"), JSON.stringify(diagnoses, null, 2));
writeFileSync(join(outDir, "EXACT-REPRODUCTION-RECORD.md"), `<!-- diagnosis artifact -->
# Exact reproduction record — NXA:5-FIX3D-DIAG

## Utterance

Manager: \`${continueUtterance}\`

## Required pre-turn state

- Active/focused object: \`obj-customer\` / Customer
- Active collection: none
- Previous Advisor turn: focus Customer (or Stage click)
- Dialogue/journey: \`${continueTurn.path.dialogueJourney ?? "n/a"}\`
- Customer evidence: satisfactionScore=4.2 score; maximumSatisfactionScore=5 score
- KPI source: \`kpi.customer.satisfaction-index\` computationKind \`score-percent\`
- Raw numeric representation: IEEE number \`${String(customerKpi.value)}\` (not a string; not 0.84)
- Units: KPI \`%\`; facts \`score\`
- Data Reality: Dataset A \`${dataset.id}\` scenario \`${dataset.scenario}\`
- Executive state (P0): \`${customerState.state}\`
- Advisor state (P1): \`${integration.advisorContext.dominantState}\`
- Advisor response mode: \`${integration.response.mode}\`
- Stage effect (CC:5 continue): \`${continueTurn.path.plannedPresentation ?? "n/a"}\`

## P1:5 manager-facing summary (exact)

${integration.response.summary}

Matches observed target: ${String(integration.response.summary === observedTarget)}

## CC:5 chat reply for the same utterance (after focus)

${continueTurn.presentedResponse}

Contains IEEE percent: ${String(/84\.00000000000001/.test(continueTurn.presentedResponse))}

## Command

\`cd frontend && ./node_modules/.bin/tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts\`
`);

console.log(JSON.stringify({
  p15Match: integration.response.summary === observedTarget,
  canonical: customerKpi.value,
  p15Evidence: sections.find((item) => item.kind === "evidence")?.text,
  stageValue: customerStageObject?.primaryValue ?? null,
  cc5Continue: continueTurn.presentedResponse,
  nxaConversationEnabledDuringRun,
  nxaConversationAfterDisable,
}, null, 2));
