import type { ExecutiveTerminologyConcept } from "./executiveTerminologyRegistry.ts";

export type IntelligenceSemanticRelationship =
  | "creates_pressure_for"
  | "influences"
  | "constrains"
  | "strengthens"
  | "weakens"
  | "contextualizes"
  | "requires_review_by";

export type IntelligenceSemanticsMapEntry = {
  source: ExecutiveTerminologyConcept;
  relationship: IntelligenceSemanticRelationship;
  target: ExecutiveTerminologyConcept;
  executiveMeaning: string;
};

export const INTELLIGENCE_SEMANTICS_MAP: IntelligenceSemanticsMapEntry[] = [
  {
    source: "propagation",
    relationship: "creates_pressure_for",
    target: "fragility",
    executiveMeaning: "Propagation pressure can expose or amplify operational fragility.",
  },
  {
    source: "fragility",
    relationship: "influences",
    target: "intervention",
    executiveMeaning: "Fragility zones inform where stabilization guidance should focus.",
  },
  {
    source: "intervention",
    relationship: "strengthens",
    target: "resilience",
    executiveMeaning: "Effective interventions should improve recovery capacity and containment.",
  },
  {
    source: "drift",
    relationship: "weakens",
    target: "readiness",
    executiveMeaning: "Strategic drift lowers decision readiness until operational movement stabilizes.",
  },
  {
    source: "coordination",
    relationship: "constrains",
    target: "readiness",
    executiveMeaning: "Coordination gaps can limit when a recommendation is ready for executive review.",
  },
  {
    source: "monitoring",
    relationship: "contextualizes",
    target: "confidence",
    executiveMeaning: "Monitoring maturity affects the reliability of executive conclusions.",
  },
  {
    source: "adaptation",
    relationship: "strengthens",
    target: "resilience",
    executiveMeaning: "Adaptive capacity supports long-term operational resilience.",
  },
  {
    source: "confidence",
    relationship: "requires_review_by",
    target: "review",
    executiveMeaning: "Confidence and uncertainty should remain traceable through decision review.",
  },
];

export function listIntelligenceSemantics(): IntelligenceSemanticsMapEntry[] {
  return INTELLIGENCE_SEMANTICS_MAP.map((entry) => ({ ...entry }));
}

export function findSemanticRelationships(concept: ExecutiveTerminologyConcept): IntelligenceSemanticsMapEntry[] {
  return listIntelligenceSemantics().filter((entry) => entry.source === concept || entry.target === concept);
}

export function validateIntelligenceSemanticsMap(): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const entry of INTELLIGENCE_SEMANTICS_MAP) {
    const key = `${entry.source}:${entry.relationship}:${entry.target}`;
    if (seen.has(key)) warnings.push(`Duplicate semantic relationship: ${key}`);
    seen.add(key);
    if (entry.source === entry.target) warnings.push(`Semantic relationship loops to itself: ${key}`);
    if (!entry.executiveMeaning.trim()) warnings.push(`Semantic relationship lacks executive meaning: ${key}`);
  }
  return { valid: warnings.length === 0, warnings };
}
