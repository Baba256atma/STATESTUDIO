/**
 * NPA-T NPS:4 runtime adapter.
 * Observes catalog Scenarios and NPS:3 analysis. Does not write Scenarios.
 */

import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type { NpsCanonicalFacts, NpsProblemSolvingPath } from "./npsProblemSolvingPath.ts";
import type { NpsEvidenceCauseAnalysis } from "./npsEvidenceCauseAnalysis.ts";
import {
  composeNpsOptionGeneration,
  type NpsExistingScenarioRef,
  type NpsOptionCandidate,
  type NpsOptionGeneration,
} from "./npsOptionGeneration.ts";

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function collectExistingScenarios(problemId: string | null): readonly NpsExistingScenarioRef[] {
  if (!problemId) return freeze([]);
  const linkedObjectIds = NEXORA_MVP_CONTEXT_LINK_FIXTURES.filter((link) => link.contextId === problemId).map(
    (link) => link.objectId,
  );
  const scenarioIds = new Set(
    NEXORA_MVP_CONTEXT_LINK_FIXTURES.filter(
      (link) => linkedObjectIds.includes(link.objectId) && link.contextId.startsWith("ctx-scenario-"),
    ).map((link) => link.contextId),
  );
  return freeze(
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.filter((item) => item.kind === "scenario" && scenarioIds.has(item.id)).map(
      (item) =>
        freeze({
          id: item.id,
          title: item.label,
          mechanism: item.label,
          problemId,
        }),
    ),
  );
}

function focusedCandidate(
  utterance: string,
  options: readonly NpsOptionCandidate[],
  previousId: string | null,
): NpsOptionCandidate | null {
  const text = utterance.toLowerCase();
  if (/external/.test(text)) {
    return options.find((item) => item.intent === "TRANSFER" || /external/i.test(item.title)) ?? null;
  }
  if (/internal|expansion plan/.test(text)) {
    return options.find((item) => item.intent === "ABSORB" && !item.currentlyInfeasible) ?? null;
  }
  if (/monitor|do nothing|current operation/.test(text)) {
    return options.find((item) => item.intent === "DO_NOTHING" || item.intent === "MONITOR") ?? null;
  }
  if (/schedul|demand/.test(text) && /option|tell me more/.test(text)) {
    return options.find((item) => item.intent === "ADAPT") ?? null;
  }
  return options.find((item) => item.candidateId === previousId) ?? null;
}

export function composeNpsRuntimeOptionGeneration(input: {
  readonly path: NpsProblemSolvingPath;
  readonly pathFacts: NpsCanonicalFacts;
  readonly analysis: NpsEvidenceCauseAnalysis;
}): NpsOptionGeneration {
  return composeNpsOptionGeneration({
    path: input.path,
    pathFacts: input.pathFacts,
    analysis: input.analysis,
    facts: freeze({
      existingScenarios: collectExistingScenarios(input.analysis.problemId),
      hardConstraints: freeze([]),
      externalAvailabilityUnknown: true,
      includeHiringOption: false,
      managerKnowledgeRequired: false,
    }),
  });
}

export function applyNpsOptionGenerationToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly generation: NpsOptionGeneration;
  readonly previousOptionCandidateId?: string | null;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const asksOptions = /what options|response options|options do we have|what can we do/i.test(utterance);
  const asksDetail = /tell me more about|more about the .+ option/i.test(utterance);
  if (asksDetail && input.generation.problemId) {
    const focused = focusedCandidate(
      utterance,
      input.generation.optionCandidates,
      input.previousOptionCandidateId ?? null,
    );
    if (focused) {
      const detail = `${focused.title} is one candidate for ${input.generation.problemTitle ?? "this Problem"} because it addresses ${focused.addresses.toLowerCase()}. Assumption: ${focused.assumptions[0] ?? "Not yet confirmed."} ${focused.requiresValidation ? "That assumption still requires validation." : ""} Important uncertainty remains: contributors are not confirmed causes.`;
      if (input.source.toLowerCase().includes(focused.title.toLowerCase()) && /assumption/i.test(input.source)) {
        return input.source;
      }
      return `${input.source} ${detail}`.trim();
    }
  }
  if (!asksOptions || input.generation.problemId == null) return input.source;
  const facing = input.generation.managerProjection.text.replace(/\n/g, " ");
  if (input.source.toLowerCase().includes("responses are worth evaluating")) return input.source;
  return `${input.source} ${facing}`.trim();
}

export function resolveNpsRuntimeFocusedOptionId(input: {
  readonly utterance: string;
  readonly generation: NpsOptionGeneration;
  readonly previousOptionCandidateId?: string | null;
}): string | null {
  return (
    focusedCandidate(
      input.utterance,
      input.generation.optionCandidates,
      input.previousOptionCandidateId ?? null,
    )?.candidateId ?? null
  );
}
