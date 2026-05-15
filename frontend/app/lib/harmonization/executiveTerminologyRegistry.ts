import { normalizeIdPart } from "../intelligence/shared/normalization.ts";

export type ExecutiveTerminologyConcept =
  | "propagation"
  | "fragility"
  | "resilience"
  | "adaptation"
  | "drift"
  | "readiness"
  | "coordination"
  | "monitoring"
  | "intervention"
  | "confidence"
  | "review";

export type ExecutiveTerminologyEntry = {
  concept: ExecutiveTerminologyConcept;
  canonicalTerm: string;
  definition: string;
  preferredPhrases: string[];
  discouragedPhrases: string[];
};

export const EXECUTIVE_TERMINOLOGY_REGISTRY: ExecutiveTerminologyEntry[] = [
  {
    concept: "propagation",
    canonicalTerm: "propagation",
    definition: "Movement of operational pressure across relationships or dependency paths.",
    preferredPhrases: ["propagation pressure", "propagation exposure", "dependency propagation"],
    discouragedPhrases: ["instability spread", "risk blast", "cascade panic"],
  },
  {
    concept: "fragility",
    canonicalTerm: "fragility",
    definition: "A system condition where pressure can degrade stability or amplify exposure.",
    preferredPhrases: ["operational fragility", "fragility corridor", "fragility pressure"],
    discouragedPhrases: ["broken system", "collapse risk", "catastrophic weakness"],
  },
  {
    concept: "resilience",
    canonicalTerm: "resilience",
    definition: "Recovery capability and capacity to absorb operational pressure.",
    preferredPhrases: ["recovery capacity", "resilience state", "stabilization strength"],
    discouragedPhrases: ["guaranteed recovery", "invulnerable state"],
  },
  {
    concept: "adaptation",
    canonicalTerm: "adaptation",
    definition: "Operational flexibility and ability to adjust under pressure.",
    preferredPhrases: ["adaptation capacity", "operational flexibility", "adaptive response"],
    discouragedPhrases: ["automatic reorganization", "self-optimizing behavior"],
  },
  {
    concept: "drift",
    canonicalTerm: "drift",
    definition: "Gradual deviation from a stable or expected operational condition.",
    preferredPhrases: ["strategic drift", "early degradation", "stability deviation"],
    discouragedPhrases: ["silent failure", "hidden disaster"],
  },
  {
    concept: "readiness",
    canonicalTerm: "readiness",
    definition: "Evidence-based timing discipline for executive review or decision action.",
    preferredPhrases: ["decision readiness", "readiness constraint", "ready for review"],
    discouragedPhrases: ["auto-approved", "go now", "guaranteed action"],
  },
  {
    concept: "coordination",
    canonicalTerm: "coordination",
    definition: "Synchronization requirements across operational systems or domains.",
    preferredPhrases: ["coordination pressure", "operational alignment", "synchronization risk"],
    discouragedPhrases: ["department failure", "team blame"],
  },
  {
    concept: "monitoring",
    canonicalTerm: "monitoring",
    definition: "Ongoing executive watch state for unresolved or changing operational pressure.",
    preferredPhrases: ["monitoring focus", "operational watch", "continued monitoring"],
    discouragedPhrases: ["alarm wall", "constant alerts"],
  },
  {
    concept: "intervention",
    canonicalTerm: "intervention",
    definition: "Executive stabilization guidance that may reduce pressure or improve resilience.",
    preferredPhrases: ["strategic intervention", "stabilization guidance", "intervention opportunity"],
    discouragedPhrases: ["auto-fix", "automated execution"],
  },
  {
    concept: "confidence",
    canonicalTerm: "confidence",
    definition: "Evidence quality and reliability of an executive conclusion.",
    preferredPhrases: ["confidence level", "evidence quality", "uncertainty factor"],
    discouragedPhrases: ["certainty", "guarantee", "prediction truth"],
  },
  {
    concept: "review",
    canonicalTerm: "review",
    definition: "Decision hindsight, traceability, and reasoning continuity.",
    preferredPhrases: ["decision review", "strategic hindsight", "reasoning trace"],
    discouragedPhrases: ["human judgment score", "decision blame"],
  },
];

const ALIAS_TO_CONCEPT: Record<string, ExecutiveTerminologyConcept> = {
  instability_spread: "propagation",
  recovery_capability: "resilience",
  operational_flexibility: "adaptation",
  early_degradation: "drift",
  strategic_action_timing: "readiness",
  operational_synchronization: "coordination",
  operational_watch: "monitoring",
  action_timing: "readiness",
};

export function listExecutiveTerminology(): ExecutiveTerminologyEntry[] {
  return EXECUTIVE_TERMINOLOGY_REGISTRY.map((entry) => ({
    ...entry,
    preferredPhrases: [...entry.preferredPhrases],
    discouragedPhrases: [...entry.discouragedPhrases],
  }));
}

export function getExecutiveTerminology(concept: string): ExecutiveTerminologyEntry | null {
  const normalized = normalizeIdPart(concept);
  const canonical = (ALIAS_TO_CONCEPT[normalized] ?? normalized) as ExecutiveTerminologyConcept;
  return listExecutiveTerminology().find((entry) => entry.concept === canonical) ?? null;
}

export function canonicalExecutiveTerm(value: string): string {
  return getExecutiveTerminology(value)?.canonicalTerm ?? String(value ?? "").trim();
}

export function harmonizeExecutiveTerminology(text: unknown): string {
  let result = String(text ?? "").replace(/\s+/g, " ").trim();
  for (const entry of EXECUTIVE_TERMINOLOGY_REGISTRY) {
    for (const discouraged of entry.discouragedPhrases) {
      const pattern = new RegExp(`\\b${discouraged.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      result = result.replace(pattern, entry.canonicalTerm);
    }
  }
  return result;
}
