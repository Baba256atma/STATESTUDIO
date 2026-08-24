/**
 * NEX-EXP:5 — option/scenario classification. Reuses EI:4/CC:9 boundaries.
 * Does not invent numeric outcomes, rank trade-offs, or mutate Reality.
 */

import { SCENARIO_PRIORITY_TRADEOFF_BOUNDARY } from "@/app/lib/executive-intelligence/scenarioPriorityTradeoffIntelligence.ts";
import { NEXORA_SCENARIO_EVALUATION_POLICY } from "@/app/lib/conversational-control/executiveScenarioPolicy.ts";
import { getExecutiveScenarioConversationIdentity } from "@/app/lib/conversational-control/executiveScenarioConversation.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraScenarioDiscoveryHandoff } from "./nexoraIssueDiscoveryTypes.ts";
import type {
  ExecutiveOptionCandidate,
  ExecutiveScenarioAssumption,
  ExecutiveScenarioObject,
  OptionFeasibility,
  ScenarioStatus,
} from "./nexoraScenarioDiscoveryTypes.ts";

export const SCENARIO_STAGE_BUDGET = 4;

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "option",
  "scenario",
  "plan",
]);

export function ei4ScenarioBoundary() {
  return SCENARIO_PRIORITY_TRADEOFF_BOUNDARY;
}

export function cc9ScenarioIdentity() {
  return getExecutiveScenarioConversationIdentity().id;
}

export function inventsNumericOutcomes(): boolean {
  return NEXORA_SCENARIO_EVALUATION_POLICY.inventNumericBusinessOutcomes;
}

export function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokensOverlap(left: string, right: string): boolean {
  const a = new Set(
    normalizeKey(left)
      .split(" ")
      .filter((token) => token.length > 2 && !STOP.has(token)),
  );
  const b = new Set(
    normalizeKey(right)
      .split(" ")
      .filter((token) => token.length > 2 && !STOP.has(token)),
  );
  if (a.size === 0 || b.size === 0) return false;
  for (const token of a) {
    if (b.has(token)) return true;
  }
  return false;
}

export function isDecisionOrExecutionCommand(normalized: string): boolean {
  return (
    /^(?:approve|commit|decide on|i(?:'m| am) (?:choosing|selecting)|start|execute|implement|roll out)\b/.test(
      normalized,
    ) ||
    /\bapprove scenario\b/.test(normalized) ||
    /\bstart scenario\b/.test(normalized) ||
    /\bchoose scenario\b/.test(normalized) ||
    /\blet'?s go with\b/.test(normalized) ||
    /\blet'?s do (?:that|this|it)\b/.test(normalized) ||
    /\bgo with scenario\b/.test(normalized)
  );
}

export function isScenarioMetaUtterance(normalized: string): boolean {
  return (
    /what options/.test(normalized) ||
    /what are my options/.test(normalized) ||
    /what could we do/.test(normalized) ||
    /let'?s explore (?:some )?scenarios/.test(normalized) ||
    /is that a prediction or a scenario/.test(normalized) ||
    /what does scenario [a-d] assume/.test(normalized) ||
    /what constraints affect/.test(normalized) ||
    /is scenario [a-d] feasible/.test(normalized) ||
    /does this mean you recommend/.test(normalized) ||
    /which scenario did i choose/.test(normalized) ||
    /i haven'?t decided/.test(normalized) ||
    /compare these scenarios/.test(normalized) ||
    /^compare them$/.test(normalized) ||
    /give me another scenario/.test(normalized) ||
    /another option/.test(normalized) ||
    /what would happen if/.test(normalized) ||
    /what don'?t we know/.test(normalized)
  );
}

export function isOptionProposalUtterance(normalized: string): boolean {
  return (
    /\bwe could\b/.test(normalized) ||
    /\bwhat if we\b/.test(normalized) ||
    /\blet'?s (?:add|model|explore)\b/.test(normalized) ||
    /\bmaybe\b/.test(normalized) &&
      /outsource|delay|add|increase|reduce/.test(normalized) ||
    /\bdo nothing\b/.test(normalized) ||
    /\bmaintain (?:the )?current (?:plan|process)\b/.test(normalized) ||
    /\bno-action\b/.test(normalized) ||
    /\bcollect more evidence\b/.test(normalized) ||
    /\bnot possible\b/.test(normalized) ||
    /\bremove that option\b/.test(normalized) ||
    /\bactually,?\s+make\b/.test(normalized) ||
    /\bcompare .+ versus\b/.test(normalized) ||
    /\badd a no-action\b/.test(normalized)
  );
}

export function isScenarioDiscoveryUtterance(normalized: string): boolean {
  return isScenarioMetaUtterance(normalized) || isOptionProposalUtterance(normalized);
}

export function titleFromUtterance(utterance: string): string {
  const cleaned = utterance
    .replace(/[.!?]+$/g, "")
    .replace(
      /^(?:we could|what if we|let'?s (?:add|model|explore)?|maybe|add a)\s+/i,
      "",
    )
    .replace(/\b(?:for the next .+|to compare|as well)\b/gi, "")
    .trim();
  if (/\bdo nothing\b/i.test(utterance) || /no-action|current plan/i.test(utterance)) {
    return "Maintain Current Plan";
  }
  if (/collect more evidence/i.test(utterance)) {
    return "Collect More Evidence";
  }
  if (/outsource/i.test(utterance)) return "External Production Support";
  const titled = cleaned
    .replace(/\b(a|an|the|our|part of it|this)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (titled.length < 3) return "Possible Response";
  return titled.replace(/\b([a-z])/g, (match) => match.toUpperCase()).slice(0, 60);
}

export function slugOptionId(title: string): string {
  const slug = normalizeKey(title).replace(/\s+/g, "-").slice(0, 48);
  return `option-${slug || "response"}`;
}

export function slugScenarioId(title: string): string {
  const slug = normalizeKey(title).replace(/\s+/g, "-").slice(0, 48);
  return `issue-scenario-${slug || "path"}`;
}

export function findCanonicalScenarioId(
  catalog: NexoraMVPObjectInteractionCatalog,
  title: string,
): string | null {
  const hit = catalog.contextSubjects.find(
    (entry) =>
      entry.kind === "scenario" && tokensOverlap(entry.label, title),
  );
  return hit?.id ?? null;
}

export function constraintBlocksOption(
  title: string,
  constraints: readonly string[],
): boolean {
  const capitalHeavy =
    /purchase|new line|capital expansion|buy equipment/.test(normalizeKey(title));
  if (!capitalHeavy) return false;
  return constraints.some((item) =>
    /cap|capital|cannot exceed|no capital|spending prohibited/.test(
      normalizeKey(item),
    ),
  );
}

export function optionFromUtterance(input: {
  readonly utterance: string;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly goalId: string | null;
  readonly issueIds: readonly string[];
  readonly realityIds: readonly string[];
  readonly constraints: readonly string[];
}): ExecutiveOptionCandidate | null {
  const normalized = input.utterance.toLowerCase();
  if (/not possible|remove that option/.test(normalized)) return null;
  if (!isOptionProposalUtterance(normalized) && !/we could|what if|let'?s model/.test(normalized)) {
    return null;
  }
  const title = titleFromUtterance(input.utterance);
  const baseline =
    /do nothing|maintain current|no-action/.test(normalized);
  const evidence =
    /collect more evidence/.test(normalized);
  const canonical = findCanonicalScenarioId(input.catalog, title);
  const blocked = constraintBlocksOption(title, input.constraints);
  const feasibility: OptionFeasibility = blocked
    ? "CONSTRAINED"
    : baseline || evidence || /we could|what if|let'?s/.test(normalized)
      ? "POSSIBLE"
      : "UNKNOWN";
  const assumption: ExecutiveScenarioAssumption | null = /assume|staff|available/.test(normalized)
    ? {
        statement: "Required conditions remain available.",
        source: "INFERRED",
        epistemicStatus: "ASSUMED",
        validated: false,
        materiality: "MATERIAL",
      }
    : null;
  return freezeOption({
    optionId: canonical ?? slugOptionId(title),
    title: canonical
      ? input.catalog.contextSubjects.find((entry) => entry.id === canonical)?.label ?? title
      : title,
    description: input.utterance.trim(),
    source: baseline
      ? "BASELINE"
      : evidence
        ? "EVIDENCE"
        : canonical
          ? "CANONICAL"
          : "MANAGER_STATED",
    sourceAuthority: canonical ? "NEX-MVP:4/context-subject" : "manager-stated",
    relatedGoalId: input.goalId,
    relatedIssueIds: input.issueIds,
    relatedRealityIds: input.realityIds,
    constraints: blocked ? input.constraints : [],
    assumptions: assumption ? [assumption] : [],
    evidence: [input.utterance.trim()],
    feasibility,
    managerStated: !canonical,
    existingCanonicalOption: Boolean(canonical),
  });
}

export function mergeOption(
  existing: readonly ExecutiveOptionCandidate[],
  next: ExecutiveOptionCandidate,
): readonly ExecutiveOptionCandidate[] {
  const match = existing.find(
    (option) =>
      option.optionId === next.optionId || tokensOverlap(option.title, next.title),
  );
  if (!match) return Object.freeze([...existing, next]);
  return Object.freeze(
    existing.map((option) =>
      option.optionId === match.optionId
        ? Object.freeze({
            ...option,
            description: next.description ?? option.description,
            evidence: unique([...option.evidence, ...next.evidence]),
            feasibility: next.feasibility !== "UNKNOWN" ? next.feasibility : option.feasibility,
            validationStatus: next.feasibility !== "UNKNOWN" ? next.feasibility : option.validationStatus,
            active: option.active,
          })
        : option,
    ),
  );
}

export function deactivateMatchingOptions(
  options: readonly ExecutiveOptionCandidate[],
  utterance: string,
): readonly ExecutiveOptionCandidate[] {
  const normalized = utterance.toLowerCase();
  if (!/not possible|remove that option/.test(normalized)) return options;
  return Object.freeze(
    options.map((option) =>
      tokensOverlap(option.title, utterance)
        ? Object.freeze({
            ...option,
            feasibility: "UNAVAILABLE" as const,
            validationStatus: "UNAVAILABLE" as const,
            active: false,
          })
        : option,
    ),
  );
}

export function formScenarioFromOption(
  option: ExecutiveOptionCandidate,
  letter: string,
  extra?: {
    readonly timeHorizon?: string | null;
    readonly parentScenarioId?: string | null;
    readonly expectedEffects?: readonly string[];
    readonly risks?: readonly string[];
    readonly unknowns?: readonly string[];
  },
): ExecutiveScenarioObject | null {
  if (!option.active) return null;
  if (option.feasibility === "UNKNOWN" && option.source === "OPPORTUNITY") {
    return null;
  }
  const constrained =
    option.feasibility === "CONSTRAINED" || option.feasibility === "UNAVAILABLE";
  const status: ScenarioStatus = constrained ? "CONSTRAINED" : "POSSIBLE";
  const assumptions =
    option.assumptions.length > 0
      ? option.assumptions
      : option.source === "BASELINE"
        ? [
            {
              statement: "Current operations continue without material intervention.",
              source: "CONTEXT" as const,
              epistemicStatus: "ASSUMED" as const,
              validated: false,
              materiality: "MATERIAL" as const,
            },
          ]
        : [
            {
              statement: "The proposed response can be carried out as described.",
              source: "INFERRED" as const,
              epistemicStatus: "ASSUMED" as const,
              validated: false,
              materiality: "UNKNOWN" as const,
            },
          ];
  return Object.freeze({
    id: option.existingCanonicalOption ? option.optionId : slugScenarioId(option.title),
    title: option.title,
    description: option.description,
    source: option.source,
    relatedOptionId: option.optionId,
    goalId: option.relatedGoalId,
    issueIds: option.relatedIssueIds,
    realityIds: option.relatedRealityIds,
    assumptions,
    constraints: option.constraints,
    expectedEffects: extra?.expectedEffects ?? [
      "Relevant conditions may change if this path is taken.",
    ],
    risks: extra?.risks ?? [],
    opportunities: [],
    unknowns: extra?.unknowns ?? ["exact cost", "actual effect size", "implementation time"],
    timeHorizon: extra?.timeHorizon ?? null,
    evidence: option.evidence,
    provenance: option.sourceAuthority ? [option.sourceAuthority] : ["manager-stated"],
    epistemicStatus: "INFERRED" as const,
    scenarioStatus: status,
    managerConfirmed: option.managerStated,
    selected: false,
    approved: false,
    executing: false,
    parentScenarioId: extra?.parentScenarioId ?? null,
    reusedExisting: option.existingCanonicalOption,
    letter,
  });
}

export function emergeScenarioObjects(
  options: readonly ExecutiveOptionCandidate[],
  existing: readonly ExecutiveScenarioObject[],
): readonly ExecutiveScenarioObject[] {
  const letters = ["A", "B", "C", "D"];
  const next: ExecutiveScenarioObject[] = [...existing];
  for (const option of options) {
    if (option.feasibility === "UNAVAILABLE" || option.feasibility === "INVALID") {
      continue;
    }
    if (next.some((scenario) => tokensOverlap(scenario.title, option.title))) {
      continue;
    }
    if (next.length >= SCENARIO_STAGE_BUDGET) break;
    const formed = formScenarioFromOption(option, letters[next.length] ?? "A");
    if (formed) next.push(formed);
  }
  return Object.freeze(
    next.map((scenario, index) =>
      Object.freeze({ ...scenario, letter: letters[index] ?? scenario.letter }),
    ),
  );
}

const WEEK_WORDS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  twelve: "12",
};

function parseWeeks(utterance: string): string | null {
  const digit = utterance.match(/(\d+)\s+weeks?/i);
  if (digit) return `${digit[1]} weeks`;
  const word = utterance.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve)\s+weeks?/i,
  );
  if (word) return `${WEEK_WORDS[word[1].toLowerCase()]} weeks`;
  return null;
}

export function applyHorizonCorrection(
  scenarios: readonly ExecutiveScenarioObject[],
  utterance: string,
): readonly ExecutiveScenarioObject[] {
  const horizon = parseWeeks(utterance);
  if (!horizon || !/actually|make the .+ scenario/i.test(utterance)) {
    return scenarios;
  }
  const target = scenarios.find((scenario) => tokensOverlap(scenario.title, utterance))
    ?? scenarios[0];
  if (!target) return scenarios;
  return Object.freeze(
    scenarios.map((scenario) =>
      scenario.id === target.id
        ? Object.freeze({ ...scenario, timeHorizon: horizon })
        : scenario,
    ),
  );
}

export function addHorizonVariant(
  scenarios: readonly ExecutiveScenarioObject[],
  options: readonly ExecutiveOptionCandidate[],
  utterance: string,
): readonly ExecutiveScenarioObject[] {
  const versus = utterance.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|\d+)\s+weeks?\s+versus\s+(one|two|three|four|five|six|seven|eight|nine|ten|twelve|\d+)\s+weeks?/i,
  );
  if (!versus) return scenarios;
  const firstHorizon = parseWeeks(`${versus[1]} weeks`);
  const secondHorizon = parseWeeks(`${versus[2]} weeks`);
  const base = scenarios[0];
  if (!base || !firstHorizon || !secondHorizon) return scenarios;
  const option = options.find((entry) => entry.optionId === base.relatedOptionId);
  if (!option) return scenarios;
  const first = Object.freeze({ ...base, timeHorizon: firstHorizon });
  const second = formScenarioFromOption(option, "B", {
    timeHorizon: secondHorizon,
    parentScenarioId: base.id,
    expectedEffects: base.expectedEffects,
    unknowns: base.unknowns,
  });
  if (!second) return Object.freeze([first]);
  return Object.freeze([
    first,
    Object.freeze({
      ...second,
      id: `${second.id}-variant-${secondHorizon.replace(/\s+/g, "")}`,
      title: `${option.title} (${secondHorizon})`,
    }),
  ]);
}

export function seedOptionsFromHandoff(
  handoff: NexoraScenarioDiscoveryHandoff | null,
): readonly ExecutiveOptionCandidate[] {
  if (!handoff) return Object.freeze([]);
  const seeded: ExecutiveOptionCandidate[] = [];
  for (const opportunity of handoff.opportunities) {
    seeded.push(
      freezeOption({
        optionId: slugOptionId(opportunity.displayName),
        title: opportunity.displayName,
        description: "Seeded from a known Opportunity. Not yet a formed Scenario.",
        source: "OPPORTUNITY",
        sourceAuthority: "NEX-EXP:4",
        relatedGoalId: opportunity.relatedGoalId,
        relatedIssueIds: [opportunity.id],
        relatedRealityIds: opportunity.relatedRealityIds,
        constraints: [],
        assumptions: [],
        evidence: opportunity.evidence,
        feasibility: "UNKNOWN",
        managerStated: false,
        existingCanonicalOption: false,
      }),
    );
  }
  return Object.freeze(seeded);
}

export function comparableSetReady(
  scenarios: readonly ExecutiveScenarioObject[],
): boolean {
  const active = scenarios.filter(
    (scenario) =>
      scenario.scenarioStatus === "POSSIBLE" ||
      scenario.scenarioStatus === "READY_FOR_COMPARISON",
  );
  const hasBaseline = active.some(
    (scenario) => scenario.source === "BASELINE" || /current plan/i.test(scenario.title),
  );
  return active.length >= 2 || (active.length === 1 && hasBaseline);
}

export function containsInventedNumeric(text: string): boolean {
  return /\$\d|\d+\s*%|roi\s*=/i.test(text);
}

function freezeOption(input: {
  readonly optionId: string;
  readonly title: string;
  readonly description: string | null;
  readonly source: ExecutiveOptionCandidate["source"];
  readonly sourceAuthority: string | null;
  readonly relatedGoalId: string | null;
  readonly relatedIssueIds: readonly string[];
  readonly relatedRealityIds: readonly string[];
  readonly constraints: readonly string[];
  readonly assumptions: readonly ExecutiveScenarioAssumption[];
  readonly evidence: readonly string[];
  readonly feasibility: OptionFeasibility;
  readonly managerStated: boolean;
  readonly existingCanonicalOption: boolean;
}): ExecutiveOptionCandidate {
  return Object.freeze({
    optionId: input.optionId,
    title: input.title,
    description: input.description,
    source: input.source,
    sourceAuthority: input.sourceAuthority,
    relatedGoalId: input.relatedGoalId,
    relatedIssueIds: input.relatedIssueIds,
    relatedRealityIds: input.relatedRealityIds,
    requiredConditions: Object.freeze([]),
    constraints: Object.freeze([...input.constraints]),
    assumptions: Object.freeze([...input.assumptions]),
    evidence: Object.freeze([...input.evidence]),
    epistemicStatus: input.managerStated ? "INFERRED" : "UNKNOWN",
    feasibility: input.feasibility,
    validationStatus: input.feasibility,
    managerStated: input.managerStated,
    existingCanonicalOption: input.existingCanonicalOption,
    createsDecision: false,
    startsExecution: false,
    active: input.feasibility !== "UNAVAILABLE" && input.feasibility !== "INVALID",
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}
