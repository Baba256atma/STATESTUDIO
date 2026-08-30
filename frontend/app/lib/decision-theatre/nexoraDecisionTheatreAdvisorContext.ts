/**
 * DTH:1 — Advisor-readable Theatre context.
 * Read-only. Does not redesign Advisor responses or add an Advisor route.
 */

import type {
  NexoraDecisionTheatreAdvisorReadableContext,
  NexoraDecisionTheatreAdvisorVisualExplanation,
  NexoraDecisionTheatreExecutiveObject,
  NexoraDecisionTheatreRelationship,
  NexoraDecisionTheatreReservedCapability,
} from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreAdvisorSceneSummary } from "./nexoraDecisionTheatreSceneScript.ts";
import type { NexoraDecisionTheatreAdvisorInvestigationSummary } from "./nexoraDecisionTheatreObjectInvestigation.ts";
import type { NexoraDecisionTheatreAdvisorComparisonSummary } from "./nexoraDecisionTheatreDecisionComparison.ts";

const UNAVAILABLE_LABELS: Readonly<Record<NexoraDecisionTheatreReservedCapability, string>> = Object.freeze({
  "visual-behavior-engine": "Animated visual behavior is not available yet",
  "object-investigation-cards-and-charts": "Investigation cards and charts are not available yet",
  "nexo-lens-library": "Lens library is not available yet",
  "nexo-select-scenario-theatre": "Scenario theatre selection is not available yet",
  "nexo-compare-decision-arena": "Decision comparison arena is not available yet",
  "nexo-time-and-theatre-replay": "Replay is not available yet",
  "theatre-aware-advisor-suggestions": "Suggested questions from the scene are not available yet",
});

export function buildNexoraDecisionTheatreAdvisorReadableContext(input: {
  readonly stageMode: string;
  readonly collectionLabel: string | null;
  readonly presentationLevel: string;
  readonly focusedId: string | null;
  readonly selectedId: string | null;
  readonly objects: readonly NexoraDecisionTheatreExecutiveObject[];
  readonly relationships: readonly NexoraDecisionTheatreRelationship[];
  readonly requestedUnsupported: NexoraDecisionTheatreReservedCapability | null;
  readonly iconicObjects?: readonly NexoraDecisionTheatreIconicObject[];
  readonly visualExplanations?: readonly NexoraDecisionTheatreAdvisorVisualExplanation[];
  readonly atmosphereExplanation?: Readonly<{
    meaning: string;
    supportedBy: string;
    remainsUnknown: string;
    doNotInfer: string;
  }> | null;
  readonly sceneSummary?: NexoraDecisionTheatreAdvisorSceneSummary | null;
  readonly investigationSummary?: NexoraDecisionTheatreAdvisorInvestigationSummary | null;
  readonly comparisonSummary?: NexoraDecisionTheatreAdvisorComparisonSummary | null;
  readonly commitmentSummary?: import("./nexoraDecisionTheatreDecisionCommitment.ts").NexoraDecisionTheatreAdvisorCommitmentSummary | null;
  readonly executionReadinessSummary?: import("./nexoraDecisionTheatreExecutionReadiness.ts").NexoraDecisionTheatreAdvisorExecutionReadinessSummary | null;
  readonly liveExecutionSummary?: import("./nexoraDecisionTheatreLiveExecution.ts").NexoraDecisionTheatreAdvisorLiveExecutionSummary | null;
  readonly outcomeObservationSummary?: import("./nexoraDecisionTheatreOutcomeObservation.ts").NexoraDecisionTheatreAdvisorOutcomeObservationSummary | null;
  readonly learningReassessmentSummary?: import("./nexoraDecisionTheatreLearningReassessment.ts").NexoraDecisionTheatreAdvisorLearningSummary | null;
}): NexoraDecisionTheatreAdvisorReadableContext {
  const visible = input.objects.filter((item) => item.visibility !== "hidden");
  const focused = visible.find((item) => item.id === input.focusedId) ?? null;
  const selected = visible.find((item) => item.id === input.selectedId) ?? null;
  const whatIsOnStage =
    input.learningReassessmentSummary?.scene
      ? input.learningReassessmentSummary.scene
      : input.outcomeObservationSummary?.scene
      ? input.outcomeObservationSummary.scene
      : input.liveExecutionSummary?.scene
      ? input.liveExecutionSummary.scene
      : input.executionReadinessSummary?.scene
      ? input.executionReadinessSummary.scene
      : input.collectionLabel != null
      ? `The Stage shows the ${input.collectionLabel} collection.`
      : focused != null
        ? `The Stage is focused on ${focused.label}.`
        : visible.length === 0
          ? "The Stage is empty."
          : "The Stage shows the current overview.";
  const unavailable = Object.freeze(
    input.requestedUnsupported
      ? [UNAVAILABLE_LABELS[input.requestedUnsupported]]
      : Object.freeze([] as string[]),
  );
  const iconicObjects = Object.freeze(
    (input.iconicObjects ?? []).map((item) => {
      const owner = input.objects.find((object) => object.id === item.ownerExecutiveObjectId);
      const value =
        item.unknown || item.missing || item.value == null
          ? item.unknown
            ? "unknown"
            : "missing"
          : `${item.value}${item.unit && item.unit !== "none" ? ` ${item.unit}` : ""}`;
      return Object.freeze({
        ownerLabel: owner?.label ?? item.ownerExecutiveObjectId,
        meaning: item.managerReadableLabel,
        authoritativeSource: item.provenance.replace(/-/g, " "),
        value,
        unit: item.unit,
        epistemicStatus: item.epistemicStatus,
        confidenceOrLimitation:
          item.confidenceRef != null
            ? "Confidence is taken from the supporting source."
            : item.unknown
              ? "This remains unknown; it is not zero."
              : item.missing
                ? "This value is missing; it is not false."
                : "Limitations follow the supporting source.",
        whyVisible: item.whyVisible,
        mustNotInterpretAs: item.mustNotInterpretAs,
      });
    }),
  );
  return Object.freeze({
    whatIsOnStage,
    focusedObject: focused?.label ?? null,
    selectedObject: selected?.label ?? null,
    visibleObjectLabels: Object.freeze(visible.map((item) => item.label)),
    whyPresent: Object.freeze(
      visible.map((item) => `${item.label}: ${item.presenceReason}`),
    ),
    relationshipsShown: Object.freeze(
      input.relationships.map((item) => {
        const source = input.objects.find((object) => object.id === item.sourceId)?.label ?? item.sourceId;
        const target = input.objects.find((object) => object.id === item.targetId)?.label ?? item.targetId;
        const relation = item.semanticRelation ?? "related";
        return `${source} ${relation} ${target}`;
      }),
    ),
    presentationLevel: input.presentationLevel,
    unavailable,
    supportedCapabilities: Object.freeze([
      "Current Stage scene",
      "Focus and selection",
      "Visible objects",
      "Shown relationships",
      "Presentation level",
      "Attached indicators",
      "Object appearance",
      "Stage environment",
      "Current scene purpose",
      "Current investigation",
      "Current comparison",
      "Current decision review",
      "Current execution readiness",
    ]),
    iconicObjects,
    visualExplanations: Object.freeze(input.visualExplanations ?? []),
    atmosphere: Object.freeze(
      input.atmosphereExplanation ?? {
        meaning: "No special Stage environment is active.",
        supportedBy: "No whole-scene atmosphere support is present.",
        remainsUnknown: "That does not mean there is no executive context.",
        doNotInfer: "Do not treat a calm Stage as a healthy or approved business.",
      },
    ),
    scene: Object.freeze(
      input.sceneSummary ?? {
        question: "What is currently on Stage?",
        anchor: focused?.label ?? null,
        visibleActors: Object.freeze(visible.map((item) => item.label)),
        roles: Object.freeze([] as string[]),
        whyPresent: Object.freeze(visible.map((item) => item.presenceReason)),
        relationshipsThatMatter: Object.freeze([] as string[]),
        uncertainRelationships: Object.freeze([] as string[]),
        iconicObjects: Object.freeze([] as string[]),
        evidence: Object.freeze([] as string[]),
        unavailable: Object.freeze([] as string[]),
        mustNotInfer: Object.freeze([
          "Visible relatedness is not a confirmed cause.",
        ]),
        stagePreserved: true,
      },
    ),
    investigation: input.investigationSummary ?? null,
    comparison: input.comparisonSummary ?? null,
    commitment: input.commitmentSummary ?? null,
    executionReadiness: input.executionReadinessSummary ?? null,
    liveExecution: input.liveExecutionSummary ?? null,
    outcomeObservation: input.outcomeObservationSummary ?? null,
    learningReassessment: input.learningReassessmentSummary ?? null,
  });
}
