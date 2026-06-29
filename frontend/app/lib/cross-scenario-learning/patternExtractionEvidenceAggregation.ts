/**
 * APP-10:2 — Pattern Extraction Engine deterministic evidence aggregation.
 */

import { PATTERN_CATEGORY_LABELS } from "./patternExtractionEngineConstants.ts";
import {
  buildPatternGroupKey,
  buildPatternId,
  buildStrategySignature,
} from "./patternExtractionNormalizer.ts";
import type {
  ExecutivePattern,
  NormalizedCompletedScenario,
  PatternConfidenceMetadata,
  PatternEvidence,
  PatternMetadata,
  PatternOutcome,
  PatternProvenance,
  PatternSummary,
  PatternType,
} from "./patternExtractionEngineTypes.ts";
import { PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION } from "./patternExtractionEngineConstants.ts";

export type PatternEvidenceGroup = Readonly<{
  groupKey: string;
  workspaceId: string;
  patternCategory: NormalizedCompletedScenario["patternCategory"];
  patternType: PatternType;
  strategySignature: string;
  strategyChain: readonly string[];
  scenarios: readonly NormalizedCompletedScenario[];
  readOnly: true;
}>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))].sort());
}

export function groupScenariosByPatternSignature(
  scenarios: readonly NormalizedCompletedScenario[]
): readonly PatternEvidenceGroup[] {
  const groups = new Map<string, NormalizedCompletedScenario[]>();
  for (const scenario of scenarios) {
    const key = buildPatternGroupKey(
      scenario.workspaceId,
      scenario.patternCategory,
      scenario.patternType,
      scenario.strategySignature
    );
    const existing = groups.get(key) ?? [];
    existing.push(scenario);
    groups.set(key, existing);
  }
  return Object.freeze(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupKey, entries]) => {
        const first = entries[0]!;
        return Object.freeze({
          groupKey,
          workspaceId: first.workspaceId,
          patternCategory: first.patternCategory,
          patternType: first.patternType,
          strategySignature: first.strategySignature,
          strategyChain: first.strategyChain,
          scenarios: Object.freeze([...entries].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId))),
          readOnly: true as const,
        });
      })
  );
}

function buildEvidenceId(sourceType: string, referenceId: string, scenarioId: string): string {
  return `${sourceType}:${referenceId}:${scenarioId}`;
}

export function aggregatePatternEvidence(group: PatternEvidenceGroup): PatternSummary {
  const evidenceMap = new Map<string, PatternEvidence>();
  const outcomes = new Map<string, PatternOutcome>();

  for (const scenario of group.scenarios) {
    for (const referenceId of scenario.timelineReferences) {
      const evidenceId = buildEvidenceId("timeline", referenceId, scenario.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-5",
            sourceType: "timeline_reference",
            referenceId,
            scenarioId: scenario.scenarioId,
            description: `Timeline reference ${referenceId} from scenario ${scenario.scenarioId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const referenceId of scenario.journalReferences) {
      const evidenceId = buildEvidenceId("journal", referenceId, scenario.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-8",
            sourceType: "journal_reference",
            referenceId,
            scenarioId: scenario.scenarioId,
            description: `Journal reference ${referenceId} from scenario ${scenario.scenarioId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const referenceId of scenario.confidenceReferences) {
      const evidenceId = buildEvidenceId("confidence", referenceId, scenario.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-9",
            sourceType: "confidence_reference",
            referenceId,
            scenarioId: scenario.scenarioId,
            description: `Confidence reference ${referenceId} from scenario ${scenario.scenarioId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const decisionId of scenario.decisionIds) {
      const evidenceId = buildEvidenceId("decision", decisionId, scenario.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-6",
            sourceType: "decision_reference",
            referenceId: decisionId,
            scenarioId: scenario.scenarioId,
            decisionId,
            description: `Decision ${decisionId} from scenario ${scenario.scenarioId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    const outcomeKey = scenario.outcomeSummary.toLowerCase();
    const existingOutcome = outcomes.get(outcomeKey);
    if (existingOutcome) {
      outcomes.set(
        outcomeKey,
        Object.freeze({
          outcomeId: existingOutcome.outcomeId,
          summary: existingOutcome.summary,
          scenarioIds: uniqueSorted([...existingOutcome.scenarioIds, scenario.scenarioId]),
          readOnly: true as const,
        })
      );
    } else {
      outcomes.set(
        outcomeKey,
        Object.freeze({
          outcomeId: `outcome-${buildStrategySignature([scenario.outcomeSummary]).slice(0, 16)}`,
          summary: scenario.outcomeSummary,
          scenarioIds: Object.freeze([scenario.scenarioId]),
          readOnly: true as const,
        })
      );
    }
  }

  const supportingEvidence = Object.freeze(
    [...evidenceMap.values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId))
  );

  return Object.freeze({
    evidenceCount: supportingEvidence.length,
    contributingScenarios: uniqueSorted(group.scenarios.map((scenario) => scenario.scenarioId)),
    contributingDecisions: uniqueSorted(group.scenarios.flatMap((scenario) => scenario.decisionIds)),
    contributingOutcomes: Object.freeze([...outcomes.values()].sort((a, b) => a.outcomeId.localeCompare(b.outcomeId))),
    timelineReferences: uniqueSorted(group.scenarios.flatMap((scenario) => scenario.timelineReferences)),
    journalReferences: uniqueSorted(group.scenarios.flatMap((scenario) => scenario.journalReferences)),
    confidenceReferences: uniqueSorted(group.scenarios.flatMap((scenario) => scenario.confidenceReferences)),
    readOnly: true as const,
  });
}

export function buildPatternProvenance(
  group: PatternEvidenceGroup,
  summary: PatternSummary
): PatternProvenance {
  const confidenceVersion =
    group.scenarios.find((scenario) => scenario.confidenceVersion.trim().length > 0)?.confidenceVersion ?? "APP-9/1";
  return Object.freeze({
    scenarioIds: summary.contributingScenarios,
    decisionIds: summary.contributingDecisions,
    confidenceVersion,
    journalEntryIds: summary.journalReferences,
    timelineReferences: summary.timelineReferences,
    extractionVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    engineVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-10/1",
    readOnly: true as const,
  });
}

export function buildPatternConfidenceMetadata(summary: PatternSummary, confidenceVersion: string): PatternConfidenceMetadata {
  return Object.freeze({
    referenceCount: summary.confidenceReferences.length,
    confidenceVersion,
    confidenceReferences: summary.confidenceReferences,
    readOnly: true as const,
  });
}

export function buildExecutivePatternFromGroup(
  group: PatternEvidenceGroup,
  extractionTimestamp: string,
  patternNamePrefix?: string
): ExecutivePattern {
  const summary = aggregatePatternEvidence(group);
  const supportingEvidence = Object.freeze(
    [...new Map(
      group.scenarios.flatMap((scenario) => {
        const entries: PatternEvidence[] = [
          Object.freeze({
            evidenceId: buildEvidenceId("scenario", scenario.scenarioId, scenario.scenarioId),
            sourceApp: "APP-5",
            sourceType: "completed_scenario",
            referenceId: scenario.scenarioId,
            scenarioId: scenario.scenarioId,
            description: `Completed scenario ${scenario.scenarioTitle}.`,
            readOnly: true as const,
          }),
        ];
        for (const referenceId of scenario.timelineReferences) {
          entries.push(
            Object.freeze({
              evidenceId: buildEvidenceId("timeline", referenceId, scenario.scenarioId),
              sourceApp: "APP-5",
              sourceType: "timeline_reference",
              referenceId,
              scenarioId: scenario.scenarioId,
              description: `Timeline reference ${referenceId}.`,
              readOnly: true as const,
            })
          );
        }
        for (const referenceId of scenario.journalReferences) {
          entries.push(
            Object.freeze({
              evidenceId: buildEvidenceId("journal", referenceId, scenario.scenarioId),
              sourceApp: "APP-8",
              sourceType: "journal_reference",
              referenceId,
              scenarioId: scenario.scenarioId,
              description: `Journal reference ${referenceId}.`,
              readOnly: true as const,
            })
          );
        }
        for (const referenceId of scenario.confidenceReferences) {
          entries.push(
            Object.freeze({
              evidenceId: buildEvidenceId("confidence", referenceId, scenario.scenarioId),
              sourceApp: "APP-9",
              sourceType: "confidence_reference",
              referenceId,
              scenarioId: scenario.scenarioId,
              description: `Confidence reference ${referenceId}.`,
              readOnly: true as const,
            })
          );
        }
        for (const decisionId of scenario.decisionIds) {
          entries.push(
            Object.freeze({
              evidenceId: buildEvidenceId("decision", decisionId, scenario.scenarioId),
              sourceApp: "APP-6",
              sourceType: "decision_reference",
              referenceId: decisionId,
              scenarioId: scenario.scenarioId,
              decisionId,
              description: `Decision ${decisionId}.`,
              readOnly: true as const,
            })
          );
        }
        return entries;
      }).map((entry) => [entry.evidenceId, entry] as const)
    ).values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId))
  );

  const provenance = buildPatternProvenance(group, summary);
  const categoryLabel = PATTERN_CATEGORY_LABELS[group.patternCategory];
  const chainLabel = group.strategyChain[0] ?? categoryLabel;
  const patternName = patternNamePrefix
    ? `${patternNamePrefix.trim()} Pattern`
    : `${chainLabel} ${categoryLabel} Pattern`;

  const metadata: PatternMetadata = Object.freeze({
    metadataVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    owner: "pattern-extraction-engine",
    extensions: Object.freeze({
      evidenceCount: String(summary.evidenceCount),
      occurrenceCount: String(group.scenarios.length),
    }),
    readOnly: true as const,
  });

  return Object.freeze({
    patternId: buildPatternId(group.workspaceId, group.patternCategory, group.patternType, group.strategySignature),
    patternName,
    patternType: group.patternType,
    patternCategory: group.patternCategory,
    workspaceId: group.workspaceId,
    executiveSummary: `Repeated ${categoryLabel.toLowerCase()} pattern observed across ${group.scenarios.length} completed scenarios: ${group.strategyChain.join(" → ")}.`,
    supportingEvidence,
    sourceScenarioIds: summary.contributingScenarios,
    sourceDecisionIds: summary.contributingDecisions,
    outcomeSummary: summary.contributingOutcomes.map((outcome) => outcome.summary).join("; "),
    confidenceMetadata: buildPatternConfidenceMetadata(summary, provenance.confidenceVersion),
    extractionTimestamp,
    version: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    provenance,
    metadata,
    readOnly: true as const,
  });
}

export const PatternExtractionEvidenceAggregation = Object.freeze({
  groupScenariosByPatternSignature,
  aggregatePatternEvidence,
  buildExecutivePatternFromGroup,
  buildPatternProvenance,
});
