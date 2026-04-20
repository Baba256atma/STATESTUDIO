/**
 * B.37 — Source tables for building locale domain packs (B.36 wording + B.13 vocabulary mirrors).
 */

import { FINANCE_ALIAS, RETAIL_ALIAS, SUPPLY_CHAIN_ALIAS } from "./domainVocabularyRegistry.ts";
import type { NexoraLocaleDomainId } from "./nexoraDomainPack.ts";

export type LocalePhraseRow = Record<NexoraLocaleDomainId, string>;

/** B.13 payload alias extensions merged in `domainVocabulary.expandPayloadAliasTokensForDomain` (additive). */
export const LOCALE_PACK_EXTRA_VOCAB: Partial<Record<NexoraLocaleDomainId, Record<string, string[]>>> = {
  retail: RETAIL_ALIAS,
  supply_chain: SUPPLY_CHAIN_ALIAS,
  finance: FINANCE_ALIAS,
};

export const REVIEW_WEAKNESS: Record<string, LocalePhraseRow> = {
  "Users are not exploring scenarios enough": {
    generic: "Users are not exploring scenarios enough",
    retail: "Operators are not comparing operational paths enough",
    supply_chain: "Flow scenarios are not being explored enough",
    finance: "Risk paths are not being evaluated enough",
    psych_yung: "Interpretive paths are not being explored enough",
  },
  "Users hesitate to make decisions": {
    generic: "Users hesitate to make decisions",
    retail: "Operators hesitate to commit to operational decisions",
    supply_chain: "Response decisions are hesitating under uncertainty",
    finance: "Risk decisions are hesitating relative to available signals",
    psych_yung: "Reflection hesitates before integrating interpretations",
  },
  "Learning loop is weak": {
    generic: "Learning loop is weak",
    retail: "Operational feedback loop is weak",
    supply_chain: "Downstream learning signals are missing",
    finance: "Outcome tracking for decisions is weak",
    psych_yung: "Reflection loop is weak",
  },
  "System reliability is still affecting usage": {
    generic: "System reliability is still affecting usage",
    retail: "System reliability is still affecting usage",
    supply_chain: "System reliability is still affecting usage",
    finance: "System reliability is still affecting usage",
    psych_yung: "System reliability is still affecting usage",
  },
  "Decision quality is weak": {
    generic: "Decision quality is weak",
    retail: "Operational decision quality is weak",
    supply_chain: "Flow decision quality is weak",
    finance: "Risk decision quality is weak",
    psych_yung: "Interpretive coherence is weak",
  },
  "Decision quality is declining": {
    generic: "Decision quality is declining",
    retail: "Operational decision quality is declining",
    supply_chain: "Flow decision quality is declining",
    finance: "Risk decision quality is declining",
    psych_yung: "Interpretive coherence is declining",
  },
  "Core scenario validation is not reliable enough": {
    generic: "Core scenario validation is not reliable enough",
    retail: "Operational path validation is not reliable enough",
    supply_chain: "Flow scenario validation is not reliable enough",
    finance: "Risk scenario validation is not reliable enough",
    psych_yung: "Interpretive frame validation is not reliable enough",
  },
};

export const REVIEW_STRENGTH: Record<string, LocalePhraseRow> = {
  "Decision quality is improving over time": {
    generic: "Decision quality is improving over time",
    retail: "Operational decision quality is improving over time",
    supply_chain: "Flow decision quality is improving over time",
    finance: "Risk decision quality is improving over time",
    psych_yung: "Interpretive coherence is improving over time",
  },
  "Decision outputs are performing well": {
    generic: "Decision outputs are performing well",
    retail: "Operational decisions are performing well",
    supply_chain: "Flow responses are performing well",
    finance: "Risk decisions are performing well",
    psych_yung: "Interpretive outputs are performing well",
  },
  "Core analysis is stable enough for pilot": {
    generic: "Core analysis is stable enough for pilot",
    retail: "Operational analysis is stable enough for pilot",
    supply_chain: "Flow analysis is stable enough for pilot",
    finance: "Risk analysis is stable enough for pilot",
    psych_yung: "Interpretive structure is stable enough for pilot",
  },
};

export const REVIEW_RECOMMENDATION: Record<string, LocalePhraseRow> = {
  "Improve compare clarity and visibility": {
    generic: "Improve compare clarity and visibility",
    retail: "Improve visibility of operational options",
    supply_chain: "Improve visibility of flow alternatives",
    finance: "Improve visibility of risk scenarios",
    psych_yung: "Improve clarity of interpretive alternatives",
  },
  "Improve recommendation clarity and action confidence": {
    generic: "Improve recommendation clarity and action confidence",
    retail: "Improve operational recommendation clarity and action confidence",
    supply_chain: "Improve response clarity and commitment confidence",
    finance: "Improve risk recommendation clarity and commitment confidence",
    psych_yung: "Improve interpretive clarity and integration confidence",
  },
  "Improve outcome recording flow": {
    generic: "Improve outcome recording flow",
    retail: "Improve execution outcome capture flow",
    supply_chain: "Improve downstream outcome capture flow",
    finance: "Improve decision outcome capture flow",
    psych_yung: "Improve reflection outcome capture flow",
  },
  "Improve reliability and error recovery": {
    generic: "Improve reliability and error recovery",
    retail: "Improve reliability and error recovery",
    supply_chain: "Improve reliability and error recovery",
    finance: "Improve reliability and error recovery",
    psych_yung: "Improve reliability and error recovery",
  },
  "Review adaptive bias, memory, and decision heuristics": {
    generic: "Review adaptive bias, memory, and decision heuristics",
    retail: "Review adaptive bias, memory, and operational heuristics",
    supply_chain: "Review adaptive bias, memory, and flow heuristics",
    finance: "Review adaptive bias, memory, and risk heuristics",
    psych_yung: "Review adaptive bias, memory, and interpretive heuristics",
  },
  "Investigate outcome feedback and adaptive logic": {
    generic: "Investigate outcome feedback and adaptive logic",
    retail: "Investigate execution feedback and adaptive logic",
    supply_chain: "Investigate downstream feedback and adaptive logic",
    finance: "Investigate outcome feedback and adaptive logic",
    psych_yung: "Investigate reflection feedback and adaptive logic",
  },
  "Improve mapping, signal interpretation, and domain calibration": {
    generic: "Improve mapping, signal interpretation, and domain calibration",
    retail: "Improve mapping, signal interpretation, and retail calibration",
    supply_chain: "Improve mapping, signal interpretation, and flow calibration",
    finance: "Improve mapping, signal interpretation, and risk calibration",
    psych_yung: "Improve mapping, signal interpretation, and interpretive calibration",
  },
};

export const REVIEW_SUMMARY: Record<string, LocalePhraseRow> = {
  "Not enough pilot usage yet — run assessments, validation, and record outcomes to populate this review.": {
    generic: "Not enough pilot usage yet — run assessments, validation, and record outcomes to populate this review.",
    retail:
      "Not enough pilot usage yet — run assessments, validation, and capture execution outcomes to populate this review.",
    supply_chain:
      "Not enough pilot usage yet — run assessments, validation, and capture downstream outcomes to populate this review.",
    finance:
      "Not enough pilot usage yet — run assessments, validation, and capture decision outcomes to populate this review.",
    psych_yung:
      "Not enough pilot usage yet — run assessments, validation, and capture reflection outcomes to populate this review.",
  },
  "Nexora is improving, but reliability and validation still need work.": {
    generic: "Nexora is improving, but reliability and validation still need work.",
    retail: "Nexora is improving, but reliability and operational validation still need work.",
    supply_chain: "Nexora is improving, but reliability and flow validation still need work.",
    finance: "Nexora is improving, but reliability and risk validation still need work.",
    psych_yung: "Nexora is improving, but reliability and interpretive validation still need work.",
  },
  "Nexora is promising for pilot, but users are not completing the learning loop.": {
    generic: "Nexora is promising for pilot, but users are not completing the learning loop.",
    retail: "Nexora is promising for pilot, but operators are not completing the operational feedback loop.",
    supply_chain: "Nexora is promising for pilot, but downstream learning signals are not closing the loop.",
    finance: "Nexora is promising for pilot, but outcome tracking for decisions is not closing the loop.",
    psych_yung: "Nexora is promising for pilot, but reflection is not completing the interpretive loop.",
  },
  "Nexora is analytically strong, but decision usage is still shallow.": {
    generic: "Nexora is analytically strong, but decision usage is still shallow.",
    retail: "Nexora is analytically strong, but operational decision usage is still shallow.",
    supply_chain: "Flow analysis is strong, but operator engagement with scenarios is shallow.",
    finance: "Risk analysis is stable, but decision engagement is limited.",
    psych_yung: "Interpretive structure is forming, but user reflection is still shallow.",
  },
  "Nexora is on a positive trajectory for pilot readiness.": {
    generic: "Nexora is on a positive trajectory for pilot readiness.",
    retail: "Nexora is on a positive trajectory for operational pilot readiness.",
    supply_chain: "Nexora is on a positive trajectory for flow pilot readiness.",
    finance: "Nexora is on a positive trajectory for risk pilot readiness.",
    psych_yung: "Nexora is on a positive trajectory for interpretive pilot readiness.",
  },
  "Current signals look favorable for pilot — keep monitoring usage and validation.": {
    generic: "Current signals look favorable for pilot — keep monitoring usage and validation.",
    retail: "Current signals look favorable for pilot — keep monitoring operations and validation.",
    supply_chain: "Current signals look favorable for pilot — keep monitoring flow signals and validation.",
    finance: "Current signals look favorable for pilot — keep monitoring risk signals and validation.",
    psych_yung: "Current signals look favorable for pilot — keep monitoring reflection and validation.",
  },
  "Continue gathering usage, validation, and quality signals to sharpen this review.": {
    generic: "Continue gathering usage, validation, and quality signals to sharpen this review.",
    retail: "Continue gathering usage, validation, and operational quality signals to sharpen this review.",
    supply_chain: "Continue gathering usage, validation, and flow quality signals to sharpen this review.",
    finance: "Continue gathering usage, validation, and risk quality signals to sharpen this review.",
    psych_yung: "Continue gathering usage, validation, and interpretive quality signals to sharpen this review.",
  },
};

export const SYNTH_FINDING: Record<string, LocalePhraseRow> = {
  "Users are not exploring scenarios": {
    generic: "Users are not exploring scenarios",
    retail: "Operators are not comparing operational paths",
    supply_chain: "Flow scenarios are not being explored",
    finance: "Risk paths are not being evaluated",
    psych_yung: "Interpretive paths are not being explored",
  },
  "Decision engagement is low": {
    generic: "Decision engagement is low",
    retail: "Operational decision engagement is low",
    supply_chain: "Response engagement is low",
    finance: "Risk decision engagement is low",
    psych_yung: "Interpretive integration is low",
  },
  "Learning loop is weak": {
    generic: "Learning loop is weak",
    retail: "Operational feedback loop is weak",
    supply_chain: "Downstream learning signals are missing",
    finance: "Outcome tracking for decisions is weak",
    psych_yung: "Reflection loop is weak",
  },
  "Decision quality is weak": {
    generic: "Decision quality is weak",
    retail: "Operational decision quality is weak",
    supply_chain: "Flow decision quality is weak",
    finance: "Risk decision quality is weak",
    psych_yung: "Interpretive coherence is weak",
  },
  "Decision quality is improving": {
    generic: "Decision quality is improving",
    retail: "Operational decision quality is improving",
    supply_chain: "Flow decision quality is improving",
    finance: "Risk decision quality is improving",
    psych_yung: "Interpretive coherence is improving",
  },
  "Core analysis is not reliable": {
    generic: "Core analysis is not reliable",
    retail: "Operational analysis is not reliable",
    supply_chain: "Flow analysis is not reliable",
    finance: "Risk analysis is not reliable",
    psych_yung: "Interpretive analysis is not reliable",
  },
  "Users do not find results helpful": {
    generic: "Users do not find results helpful",
    retail: "Operators do not find results helpful",
    supply_chain: "Operators do not find results helpful",
    finance: "Operators do not find results helpful",
    psych_yung: "Operators do not find results helpful",
  },
  "Results are confusing": {
    generic: "Results are confusing",
    retail: "Results are confusing",
    supply_chain: "Results are confusing",
    finance: "Results are confusing",
    psych_yung: "Results are confusing",
  },
};

export const SYNTH_PRIORITY: Record<string, LocalePhraseRow> = {
  "Improve reliability": {
    generic: "Improve reliability",
    retail: "Improve reliability",
    supply_chain: "Improve reliability",
    finance: "Improve reliability",
    psych_yung: "Improve reliability",
  },
  "Improve mapping / signals": {
    generic: "Improve mapping / signals",
    retail: "Improve operational mapping / signals",
    supply_chain: "Improve flow mapping / signals",
    finance: "Improve risk mapping / signals",
    psych_yung: "Improve interpretive mapping / signals",
  },
  "Improve recommendation clarity": {
    generic: "Improve recommendation clarity",
    retail: "Improve operational recommendation clarity",
    supply_chain: "Improve response recommendation clarity",
    finance: "Improve risk recommendation clarity",
    psych_yung: "Improve interpretive recommendation clarity",
  },
  "Improve compare visibility": {
    generic: "Improve compare visibility",
    retail: "Improve visibility of operational options",
    supply_chain: "Improve visibility of flow alternatives",
    finance: "Improve visibility of risk scenarios",
    psych_yung: "Improve clarity of interpretive alternatives",
  },
  "Improve outcome capture UX": {
    generic: "Improve outcome capture UX",
    retail: "Improve execution outcome capture UX",
    supply_chain: "Improve downstream outcome capture UX",
    finance: "Improve decision outcome capture UX",
    psych_yung: "Improve reflection outcome capture UX",
  },
  "Improve explanation layer": {
    generic: "Improve explanation layer",
    retail: "Improve explanation layer",
    supply_chain: "Improve explanation layer",
    finance: "Improve explanation layer",
    psych_yung: "Improve explanation layer",
  },
};

export const SYNTH_SUMMARY: Record<string, LocalePhraseRow> = {
  "Nexora is not yet reliable enough for pilot usage.": {
    generic: "Nexora is not yet reliable enough for pilot usage.",
    retail: "Nexora is not yet reliable enough for operational pilot usage.",
    supply_chain: "Nexora is not yet reliable enough for flow pilot usage.",
    finance: "Nexora is not yet reliable enough for risk pilot usage.",
    psych_yung: "Nexora is not yet reliable enough for interpretive pilot usage.",
  },
  "Nexora needs attention before broader pilot use.": {
    generic: "Nexora needs attention before broader pilot use.",
    retail: "Nexora needs attention before broader operational pilot use.",
    supply_chain: "Nexora needs attention before broader flow pilot use.",
    finance: "Nexora needs attention before broader risk pilot use.",
    psych_yung: "Nexora needs attention before broader interpretive pilot use.",
  },
  "Nexora is analytically strong but user engagement is still shallow.": {
    generic: "Nexora is analytically strong but user engagement is still shallow.",
    retail: "Nexora is analytically strong but operational engagement is still shallow.",
    supply_chain: "Flow analysis is strong, but operator engagement with scenarios is shallow.",
    finance: "Risk analysis is stable, but decision engagement is limited.",
    psych_yung: "Interpretive structure is forming, but user reflection is still shallow.",
  },
  "Nexora is capable but signals are mixed — tighten workflows before scaling the pilot.": {
    generic: "Nexora is capable but signals are mixed — tighten workflows before scaling the pilot.",
    retail: "Operations are capable but signals are mixed — tighten workflows before scaling the pilot.",
    supply_chain: "Flow signals are mixed — tighten response workflows before scaling the pilot.",
    finance: "Risk signals are mixed — tighten decision workflows before scaling the pilot.",
    psych_yung: "Interpretive signals are mixed — tighten reflection workflows before scaling the pilot.",
  },
  "Nexora is performing well and ready for controlled pilot.": {
    generic: "Nexora is performing well and ready for controlled pilot.",
    retail: "Operations are performing well and ready for controlled pilot.",
    supply_chain: "Flow performance is strong and ready for controlled pilot.",
    finance: "Risk posture is performing well and ready for controlled pilot.",
    psych_yung: "Interpretive work is performing well and ready for controlled pilot.",
  },
};

/** B.38 — canonical mapping keys for synthesis coverage checks. */
export const CANONICAL_SYNTH_SUMMARY_KEYS = Object.keys(SYNTH_SUMMARY);
export const CANONICAL_SYNTH_FINDING_KEYS = Object.keys(SYNTH_FINDING);
export const CANONICAL_SYNTH_PRIORITY_KEYS = Object.keys(SYNTH_PRIORITY);
