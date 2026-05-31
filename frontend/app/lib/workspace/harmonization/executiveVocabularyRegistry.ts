import { harmonizeExecutiveTerminology } from "../../harmonization/executiveTerminologyRegistry";
import { logExecutiveVocabulary } from "./executiveHarmonizationInstrumentation";

export type ExecutiveVocabularyConcept =
  | "analyze"
  | "analysis"
  | "assessment"
  | "scenario"
  | "simulation"
  | "experiment"
  | "risk"
  | "fragility"
  | "exposure"
  | "readiness"
  | "confidence"
  | "monitoring"
  | "decision"
  | "relationship"
  | "object"
  | "timeline";

export type ExecutiveVocabularyEntry = {
  concept: ExecutiveVocabularyConcept;
  canonical: string;
  aliases: string[];
  surfaces: string[];
};

const VOCABULARY_REGISTRY: ExecutiveVocabularyEntry[] = [
  { concept: "analyze", canonical: "Analyze", aliases: ["Analyse", "Run Analysis"], surfaces: ["commandBar", "objectInfoHud", "quickActionsDock"] },
  { concept: "analysis", canonical: "Analysis", aliases: ["Analytic Review", "Assessment Output"], surfaces: ["objectInfoHud", "aiAssistant"] },
  { concept: "assessment", canonical: "Assessment", aliases: ["Evaluation", "Appraisal"], surfaces: ["statusHud", "orientation"] },
  { concept: "scenario", canonical: "Scenario", aliases: ["Experiment", "What-if", "Simulation Case"], surfaces: ["scenarioSuggestions", "commandBar"] },
  { concept: "simulation", canonical: "Simulation", aliases: ["Sim Run", "Model Run"], surfaces: ["commandBar", "quickActionsDock"] },
  { concept: "experiment", canonical: "Scenario", aliases: ["Experiment", "Trial"], surfaces: ["scenarioSuggestions"] },
  { concept: "risk", canonical: "Risk", aliases: ["Threat", "Hazard"], surfaces: ["statusHud", "objectInfoHud", "orientation"] },
  { concept: "fragility", canonical: "Fragility", aliases: ["FRSI", "Fragility Score", "System Fragility"], surfaces: ["commandBar", "statusHud"] },
  { concept: "exposure", canonical: "Exposure", aliases: ["Risk Exposure", "Pressure Exposure"], surfaces: ["objectInfoHud", "relationships"] },
  { concept: "readiness", canonical: "Readiness", aliases: ["Ready State", "Operational Ready"], surfaces: ["commandBar", "statusHud"] },
  { concept: "confidence", canonical: "Confidence", aliases: ["Certainty", "Trust Score"], surfaces: ["commandBar", "statusHud"] },
  { concept: "monitoring", canonical: "Monitoring", aliases: ["Watching", "Tracking"], surfaces: ["statusHud", "orientation"] },
  { concept: "decision", canonical: "Decision", aliases: ["Decision Posture", "Executive Decision"], surfaces: ["commandBar", "timelineHud"] },
  { concept: "relationship", canonical: "Relationship", aliases: ["Link", "Connection", "Dependency Link"], surfaces: ["objectInfoHud", "scene"] },
  { concept: "object", canonical: "Object", aliases: ["Node", "Entity", "Asset"], surfaces: ["sceneInfoHud", "objectInfoHud"] },
  { concept: "timeline", canonical: "Timeline", aliases: ["History", "Event Log"], surfaces: ["timelineHud", "bottomWorkspace"] },
];

const ALIAS_LOOKUP = new Map<string, ExecutiveVocabularyEntry>();
for (const entry of VOCABULARY_REGISTRY) {
  ALIAS_LOOKUP.set(entry.canonical.toLowerCase(), entry);
  for (const alias of entry.aliases) {
    ALIAS_LOOKUP.set(alias.toLowerCase(), entry);
  }
  ALIAS_LOOKUP.set(entry.concept, entry);
}

/** E2:49 Part 2 — canonical executive vocabulary for all workspace surfaces. */
export function resolveExecutiveVocabulary(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const entry = ALIAS_LOOKUP.get(trimmed.toLowerCase());
  const resolved = entry?.canonical ?? trimmed;
  logExecutiveVocabulary("resolved", { input: trimmed, canonical: resolved });
  return resolved;
}

export function harmonizeExecutiveVocabulary(text: string): string {
  let result = harmonizeExecutiveTerminology(text);
  for (const entry of VOCABULARY_REGISTRY) {
    for (const alias of entry.aliases) {
      const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      result = result.replace(pattern, entry.canonical);
    }
  }
  logExecutiveVocabulary("harmonized", { length: result.length });
  return result;
}

export function listExecutiveVocabulary(): ExecutiveVocabularyEntry[] {
  return VOCABULARY_REGISTRY.map((entry) => ({ ...entry, aliases: [...entry.aliases], surfaces: [...entry.surfaces] }));
}

export function auditExecutiveVocabulary(text: string): string[] {
  const hits: string[] = [];
  for (const entry of VOCABULARY_REGISTRY) {
    for (const alias of entry.aliases) {
      if (new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) {
        hits.push(alias);
      }
    }
  }
  return hits;
}
