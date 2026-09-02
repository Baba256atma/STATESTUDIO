/** DATA-UX:5 — Advisor explains removal impact. It never deletes. */

import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import type { CsvSourceRemovalImpact } from "../data-reality/csvSourceRemovalImpact.ts";

export const csvSourceRemovalAdvisorIdentity =
  "DATA-UX:5/CsvSourceRemovalAdvisor" as const;

export type CsvSourceRemovalAdvisorIntent =
  | "explain-impact"
  | "request-review"
  | "cancel-review"
  | null;

export function resolveCsvSourceRemovalAdvisorIntent(utterance: string): CsvSourceRemovalAdvisorIntent {
  const meaning = interpretCanonicalManagerMeaning({
    utterance,
    subjects: Object.freeze([]),
  });
  const prepared = meaning.preparedUtterance;
  if (/\b(?:cancel|keep it|never mind|do not remove|dont remove)\b/.test(prepared)) {
    return "cancel-review";
  }
  if (/\b(?:remove|delete|get rid|discard)\b/.test(prepared) && /\b(?:this|it|source|csv|file|data)\b/.test(prepared)) {
    return "request-review";
  }
  if (
    /\b(?:happen if i remove|depend|depend on|using this source|lose the kpi|add it again|affect)\b/.test(prepared)
  ) {
    return "explain-impact";
  }
  return null;
}

export function explainCsvSourceRemovalImpact(impact: CsvSourceRemovalImpact): string {
  if (impact.dependents.length === 0) {
    return `${impact.managerSummary} Historical records of this source are kept. Removing it requires an explicit confirmation in Data.`;
  }
  return `${impact.managerSummary} Decisions and history are not rewritten. I will not remove the source until you confirm in Data.`;
}

export function answerCsvSourceRemovalInquiry(input: Readonly<{
  impact: CsvSourceRemovalImpact;
  utterance: string;
}>): Readonly<{ text: string; intent: Exclude<CsvSourceRemovalAdvisorIntent, null> }> | null {
  const intent = resolveCsvSourceRemovalAdvisorIntent(input.utterance);
  if (!intent) return null;
  if (intent === "cancel-review") {
    return Object.freeze({
      intent,
      text: "No source was removed. Current data is unchanged.",
    });
  }
  if (intent === "request-review") {
    return Object.freeze({
      intent,
      text: `${explainCsvSourceRemovalImpact(input.impact)} Open Data and confirm Remove data source if you still want to proceed.`,
    });
  }
  return Object.freeze({
    intent,
    text: explainCsvSourceRemovalImpact(input.impact),
  });
}
