import type { ScenarioDomain, ScenarioSeed } from "./decisionAssistantTypes.ts";
import { SCENARIO_DOMAIN_TEMPLATES } from "./scenarioDomainTemplates.ts";

function isScenarioDomain(value: string): value is ScenarioDomain {
  return value === "business" || value === "politics" || value === "strategy" || value === "generic";
}

export function getScenarioSeedsForDomain(domain: ScenarioDomain): ScenarioSeed[] {
  const seeds = SCENARIO_DOMAIN_TEMPLATES[domain];
  return seeds?.length ? seeds.map((s) => ({ ...s, delta: { ...s.delta } })) : getScenarioSeedsForDomain("generic");
}

/** Resolve arbitrary domain string to catalog domain with safe fallback. */
export function resolveScenarioDomain(domainId: string | undefined): ScenarioDomain {
  const raw = String(domainId ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "generic";
  if (raw.includes("politic") || raw.includes("coalition") || raw.includes("diplom")) return "politics";
  if (raw.includes("strateg") || raw.includes("portfolio") || raw.includes("competitive")) return "strategy";
  if (raw.includes("retail") || raw.includes("supply") || raw.includes("operat") || raw.includes("business"))
    return "business";
  if (isScenarioDomain(raw)) return raw;
  return "generic";
}
