/**
 * APP-8:6 — Decision Journal retrospective flags.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalOutcomeStatus,
  DecisionJournalRetrospectiveFlag,
  DecisionJournalRetrospectiveFlagType,
  DecisionJournalRetrospectiveModel,
} from "./decisionJournalRetrospectiveTypes.ts";
import { clampRetrospectiveConfidence, readObservedOutcome } from "./decisionJournalOutcomeRules.ts";
import { DECISION_JOURNAL_RETROSPECTIVE_RULES } from "./decisionJournalRetrospectiveRules.ts";

function buildFlag(
  type: DecisionJournalRetrospectiveFlagType,
  entry: DecisionJournalEngineEntry,
  title: string,
  description: string,
  confidence: number,
  metadata: Readonly<Record<string, string>> = Object.freeze({})
): DecisionJournalRetrospectiveFlag {
  return Object.freeze({
    type,
    entryId: entry.id,
    title,
    description,
    confidence: clampRetrospectiveConfidence(confidence),
    metadata: Object.freeze({ ...metadata }),
    readOnly: true as const,
  });
}

export function detectRetrospectiveFlags(
  entry: DecisionJournalEngineEntry,
  retrospective: DecisionJournalRetrospectiveModel
): readonly DecisionJournalRetrospectiveFlag[] {
  const flags: DecisionJournalRetrospectiveFlag[] = [];
  const observedOutcome = readObservedOutcome(entry);
  const outcomeStatus = retrospective.outcomeStatus;

  if (!observedOutcome) {
    flags.push(
      buildFlag(
        "no-observed-outcome",
        entry,
        "No observed outcome recorded",
        `Entry "${entry.title}" has no observed outcome metadata.`,
        0.95
      )
    );
  }

  appendOutcomeFlags(flags, entry, outcomeStatus);

  if (retrospective.assumptionAccuracy >= DECISION_JOURNAL_RETROSPECTIVE_RULES.verifiedAssumptionThreshold) {
    flags.push(
      buildFlag(
        "assumptions-verified",
        entry,
        "Assumptions verified",
        `Entry "${entry.title}" assumption accuracy is ${retrospective.assumptionAccuracy.toFixed(2)}.`,
        retrospective.assumptionAccuracy,
        Object.freeze({ assumptionAccuracy: String(retrospective.assumptionAccuracy) })
      )
    );
  }

  if (retrospective.assumptionAccuracy <= DECISION_JOURNAL_RETROSPECTIVE_RULES.invalidatedAssumptionThreshold) {
    flags.push(
      buildFlag(
        "assumptions-invalidated",
        entry,
        "Assumptions invalidated",
        `Entry "${entry.title}" assumption accuracy is ${retrospective.assumptionAccuracy.toFixed(2)}.`,
        0.85,
        Object.freeze({ assumptionAccuracy: String(retrospective.assumptionAccuracy) })
      )
    );
  }

  if (retrospective.riskRealization >= DECISION_JOURNAL_RETROSPECTIVE_RULES.riskRealizedThreshold) {
    flags.push(
      buildFlag(
        "risk-realized",
        entry,
        "Risk realized",
        `Entry "${entry.title}" accepted risks were realized.`,
        retrospective.riskRealization,
        Object.freeze({ riskRealization: String(retrospective.riskRealization) })
      )
    );
  }

  if (retrospective.evidenceReliability >= DECISION_JOURNAL_RETROSPECTIVE_RULES.reliableEvidenceThreshold) {
    flags.push(
      buildFlag(
        "evidence-reliable",
        entry,
        "Evidence reliable",
        `Entry "${entry.title}" evidence reliability is ${retrospective.evidenceReliability.toFixed(2)}.`,
        retrospective.evidenceReliability
      )
    );
  }

  if (retrospective.evidenceReliability <= DECISION_JOURNAL_RETROSPECTIVE_RULES.unreliableEvidenceThreshold) {
    flags.push(
      buildFlag(
        "evidence-unreliable",
        entry,
        "Evidence unreliable",
        `Entry "${entry.title}" evidence reliability is ${retrospective.evidenceReliability.toFixed(2)}.`,
        0.85
      )
    );
  }

  if (retrospective.reviewCompleteness < DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewIncompleteThreshold) {
    flags.push(
      buildFlag(
        "review-incomplete",
        entry,
        "Review incomplete",
        `Entry "${entry.title}" review completeness is ${retrospective.reviewCompleteness.toFixed(2)}.`,
        0.8,
        Object.freeze({ reviewCompleteness: String(retrospective.reviewCompleteness) })
      )
    );
  }

  if (retrospective.lessonsLearned.length === 0) {
    flags.push(
      buildFlag(
        "lessons-missing",
        entry,
        "Lessons missing",
        `Entry "${entry.title}" has no lessons learned metadata.`,
        0.75
      )
    );
  } else {
    flags.push(
      buildFlag(
        "lessons-recorded",
        entry,
        "Lessons recorded",
        `Entry "${entry.title}" has ${retrospective.lessonsLearned.length} lesson(s) recorded.`,
        0.85,
        Object.freeze({ lessonCount: String(retrospective.lessonsLearned.length) })
      )
    );
  }

  return Object.freeze(flags.sort((left, right) => left.type.localeCompare(right.type)));
}

function appendOutcomeFlags(
  flags: DecisionJournalRetrospectiveFlag[],
  entry: DecisionJournalEngineEntry,
  outcomeStatus: DecisionJournalOutcomeStatus
): void {
  if (outcomeStatus === "aligned") {
    flags.push(
      buildFlag(
        "outcome-aligned",
        entry,
        "Outcome aligned",
        `Entry "${entry.title}" observed outcome aligns with expectation.`,
        0.9,
        Object.freeze({ outcomeStatus })
      )
    );
  }
  if (outcomeStatus === "misaligned") {
    flags.push(
      buildFlag(
        "outcome-misaligned",
        entry,
        "Outcome misaligned",
        `Entry "${entry.title}" observed outcome misaligns with expectation.`,
        0.9,
        Object.freeze({ outcomeStatus })
      )
    );
  }
  if (outcomeStatus === "exceeded") {
    flags.push(
      buildFlag(
        "outcome-exceeded",
        entry,
        "Outcome exceeded",
        `Entry "${entry.title}" observed outcome exceeded expectation.`,
        0.9,
        Object.freeze({ outcomeStatus })
      )
    );
  }
}

export const DecisionJournalRetrospectiveFlags = Object.freeze({
  detectRetrospectiveFlags,
});
