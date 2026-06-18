import { buildExecutiveScenarioSummary } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import {
  buildScenarioDraft,
  SCENARIO_AUTHORING_CONTRACT,
  type ScenarioAuthoringType,
  type ScenarioDraft,
} from "./scenarioAuthoringContract.ts";
import {
  ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTICS,
  ASSISTANT_SCENARIO_AUTHORING_BRIDGE_VERSION,
  EMPTY_ASSISTANT_SCENARIO_AUTHORING_ASSISTANCE,
  type AssistantScenarioAuthoringAssistance,
  type AssistantScenarioAuthoringBridgeBuildInput,
  type AssistantScenarioFieldExplanation,
  type AssistantScenarioMissingInput,
  type AssistantScenarioStructureSuggestion,
} from "./assistantScenarioAuthoringBridgeContract.ts";

let latestAssistantScenarioAuthoringAssistance: AssistantScenarioAuthoringAssistance =
  EMPTY_ASSISTANT_SCENARIO_AUTHORING_ASSISTANCE;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function collectBuildInput(input: AssistantScenarioAuthoringBridgeBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId,
  });
}

function resolveDraft(input: AssistantScenarioAuthoringBridgeBuildInput): ScenarioDraft {
  if (input.draft) return input.draft;
  const partial = input.partialDraft ?? {};
  return buildScenarioDraft({
    name: partial.name,
    scenarioType: partial.scenarioType,
    summary: partial.summary,
    description: partial.description,
    assumptions: partial.assumptions,
    focusObjectIds: partial.focusObjectIds,
    author: "assistant",
    source: "assistant",
  });
}

function fieldExplanations(): readonly AssistantScenarioFieldExplanation[] {
  return Object.freeze([
    Object.freeze({
      field: "name",
      label: "Draft Name",
      explanation:
        "Draft name identifies the scenario for executives. Use a concise business label such as Supplier Delay Risk.",
    }),
    Object.freeze({
      field: "scenarioType",
      label: "Draft Type",
      explanation:
        "Draft type selects the scenario posture: baseline, alternative, risk, or opportunity.",
    }),
    Object.freeze({
      field: "summary",
      label: "Draft Summary",
      explanation:
        "Draft summary captures the executive narrative in one or two sentences without running simulations.",
    }),
    Object.freeze({
      field: "description",
      label: "Description",
      explanation:
        "Description expands the scenario context with assumptions, scope, and intended comparison target.",
    }),
    Object.freeze({
      field: "assumptions",
      label: "Assumptions",
      explanation:
        "Assumptions list the conditions the scenario depends on. Keep them explicit and reviewable.",
    }),
    Object.freeze({
      field: "focusObjectIds",
      label: "Focus Objects",
      explanation:
        "Focus objects anchor the scenario to certified DS object intelligence without modifying the scene graph.",
    }),
  ]);
}

function structureSuggestions(
  scenarioIntelligence: ReturnType<typeof buildExecutiveScenarioSummary>
): readonly AssistantScenarioStructureSuggestion[] {
  const suggestions: AssistantScenarioStructureSuggestion[] = SCENARIO_AUTHORING_CONTRACT.supportedScenarioTypes.map(
    (scenarioType) => {
      const label = SCENARIO_AUTHORING_CONTRACT.scenarioTypeLabels[scenarioType];
      const profile = scenarioIntelligence.summaryByScenarioId[`scenario:${scenarioType}`];
      const swotHint = profile
        ? `${profile.strengths.length} strength signal(s), ${profile.weaknesses.length} weakness signal(s), ${profile.recommendedActions.length} recommended action(s).`
        : "Use certified scenario intelligence for structure hints.";
      const suggestionByType: Readonly<Record<ScenarioAuthoringType, string>> = Object.freeze({
        baseline: `Structure ${label} around current-state stability, object coverage, and baseline assumptions. ${swotHint}`,
        alternative: `Structure ${label} around one primary what-if change, comparison target, and measurable focus objects. ${swotHint}`,
        risk: `Structure ${label} around downside triggers, threat posture, and mitigation-ready assumptions. ${swotHint}`,
        opportunity: `Structure ${label} around upside levers, opportunity signals, and recovery assumptions. ${swotHint}`,
      });
      return Object.freeze({
        scenarioType,
        label,
        suggestion: suggestionByType[scenarioType],
      });
    }
  );
  return Object.freeze(suggestions);
}

function missingInputs(draft: ScenarioDraft): readonly AssistantScenarioMissingInput[] {
  const missing: AssistantScenarioMissingInput[] = [];

  if (!readString(draft.name)) {
    missing.push(
      Object.freeze({
        field: "name",
        label: "Draft Name",
        reason: "Provide a draft name before saving or comparing the scenario draft.",
      })
    );
  }
  if (!readString(draft.summary)) {
    missing.push(
      Object.freeze({
        field: "summary",
        label: "Draft Summary",
        reason: "Add an executive summary so the scenario draft is reviewable in the Scenario panel.",
      })
    );
  }
  if (draft.scenarioType !== "baseline" && draft.focusObjectIds.length === 0) {
    missing.push(
      Object.freeze({
        field: "focusObjectIds",
        label: "Focus Objects",
        reason: "Select at least one focus object to anchor this scenario type.",
      })
    );
  }
  if (
    (draft.scenarioType === "risk" || draft.scenarioType === "opportunity") &&
    draft.assumptions.length === 0
  ) {
    missing.push(
      Object.freeze({
        field: "assumptions",
        label: "Assumptions",
        reason: `${SCENARIO_AUTHORING_CONTRACT.scenarioTypeLabels[draft.scenarioType]} drafts should list explicit assumptions.`,
      })
    );
  }
  if (!readString(draft.description) && draft.scenarioType === "alternative") {
    missing.push(
      Object.freeze({
        field: "description",
        label: "Description",
        reason: "Alternative scenario drafts benefit from a short description of the proposed change.",
      })
    );
  }

  for (const message of draft.validationMessages) {
    if (missing.some((entry) => entry.reason === message)) continue;
    missing.push(
      Object.freeze({
        field: "validation",
        label: "Validation",
        reason: message,
      })
    );
  }

  return Object.freeze(missing);
}

function buildDraftGuidance(
  draft: ScenarioDraft,
  scenarioIntelligence: ReturnType<typeof buildExecutiveScenarioSummary>
): string {
  const typeLabel = SCENARIO_AUTHORING_CONTRACT.scenarioTypeLabels[draft.scenarioType];
  return [
    "Assistant scenario draft assistance is ready.",
    `Draft posture: ${typeLabel}.`,
    `Validation state: ${draft.validationState}.`,
    `Certified scenario intelligence covers ${scenarioIntelligence.scenarioCount} scenario(s).`,
    "Assistant may explain fields and suggest structure only; it does not execute simulations or modify DS intelligence.",
  ].join(" ");
}

export function buildAssistantScenarioAuthoringAssistance(
  input: AssistantScenarioAuthoringBridgeBuildInput = {}
): AssistantScenarioAuthoringAssistance {
  const buildInput = collectBuildInput(input);
  const scenarioIntelligence =
    input.scenarioIntelligence ?? buildExecutiveScenarioSummary(buildInput);
  const draft = resolveDraft(input);
  const explanations = fieldExplanations();
  const structures = structureSuggestions(scenarioIntelligence);
  const missing = missingInputs(draft);

  const assistance = Object.freeze({
    version: ASSISTANT_SCENARIO_AUTHORING_BRIDGE_VERSION,
    draftGuidance: buildDraftGuidance(draft, scenarioIntelligence),
    fieldExplanations: explanations,
    structureSuggestions: structures,
    missingInputs: missing,
    scenarioIntelligence,
    assistanceReady: true as const,
    draftAssistanceOnly: true as const,
    readOnly: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTICS,
  });

  latestAssistantScenarioAuthoringAssistance = assistance;
  return assistance;
}

export function getAssistantScenarioAuthoringAssistance(): AssistantScenarioAuthoringAssistance {
  return latestAssistantScenarioAuthoringAssistance;
}

export function resetAssistantScenarioAuthoringBridgeForTests(): void {
  latestAssistantScenarioAuthoringAssistance = EMPTY_ASSISTANT_SCENARIO_AUTHORING_ASSISTANCE;
}

export const AssistantScenarioAuthoringBridge = Object.freeze({
  buildAssistantScenarioAuthoringAssistance,
  getAssistantScenarioAuthoringAssistance,
  resetAssistantScenarioAuthoringBridgeForTests,
});
