/** DATA-UX:4 — read-only Advisor explanation of selected/visible DATA_OBJECTs. */

import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import type { CsvMappingReview } from "../data-reality/csvRealDataVerticalSlice.ts";
import { summarizeCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import type { NexoraDecisionTheatreDataObject } from "./nexoraDecisionTheatreDataObjectProjection.ts";

export const nexoraDecisionTheatreDataObjectAdvisorIdentity =
  "DATA-UX:4/DataObjectAdvisorStageAwareness" as const;

function describeSupport(dataObject: NexoraDecisionTheatreDataObject): string {
  if (dataObject.relationships.length === 0) {
    return `${dataObject.label} has no supported executive-object relationship. Nexora will not invent one.`;
  }
  const targets = dataObject.relationships.map((entry) => entry.targetLabel);
  return `${dataObject.label} supplies mapped data to ${targets.join(", ")}. That is a provenance relationship, not evidence that the source caused any business condition.`;
}

function describeSource(
  dataObject: NexoraDecisionTheatreDataObject,
  review: CsvMappingReview,
): string {
  const summary = summarizeCsvSemantics(review, dataObject.label);
  return `${dataObject.label} is a CSV Data Object with ${dataObject.recordCount} rows and ${dataObject.columnCount} fields. ${summary.understood} ${summary.unresolved}`;
}

export function answerNexoraDecisionTheatreDataObjectInquiry(input: Readonly<{
  dataObject: NexoraDecisionTheatreDataObject;
  review: CsvMappingReview;
  utterance: string;
}>): string | null {
  const meaning = interpretCanonicalManagerMeaning({
    utterance: input.utterance,
    subjects: Object.freeze([]),
  });
  const prepared = meaning.preparedUtterance;
  if (!/\b(?:this|that|it|source|csv|file|data)\b/.test(prepared)) return null;
  if (/\bdelete\b/.test(prepared) || /\b(?:remove|get rid)\b/.test(prepared)) {
    return null;
  }

  const asksSupport =
    meaning.requestedOperation === "IMPACT" ||
    meaning.requestedOperation === "CAUSE" ||
    meaning.questionType === "IMPACT" ||
    meaning.questionType === "CAUSE" ||
    /\b(?:support|supplies|used by|behind|relationship)\b/.test(prepared);
  if (asksSupport) return describeSupport(input.dataObject);

  const asksUnresolved =
    meaning.questionType === "STATUS" ||
    (/\b(?:unknown|unresolved|clarify)\b/.test(prepared) ||
      (/\bunderstand\b/.test(prepared) && /\b(?:dont|do not|not)\b/.test(prepared)));
  if (asksUnresolved && !asksSupport) {
    return summarizeCsvSemantics(input.review, input.dataObject.label).unresolved;
  }

  if (
    meaning.requestedOperation === "EXPLAIN" ||
    meaning.requestedOperation === "INVESTIGATE" ||
    meaning.requestedOperation === "STATUS" ||
    meaning.questionType === "EXPLANATION" ||
    meaning.communicativeIntent === "ASK_EXPLANATION"
  ) {
    return describeSource(input.dataObject, input.review);
  }

  return null;
}
