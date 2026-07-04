export type ExecutiveJudgmentContextSectionName =
  | "identity"
  | "intent"
  | "situation"
  | "objects"
  | "relationships"
  | "kpis"
  | "risks"
  | "scenarios"
  | "timeline"
  | "executiveMemory"
  | "recommendations"
  | "constraints"
  | "knownAssumptions"
  | "availableEvidence"
  | "availableAlternatives"
  | "sharedMentalModel"
  | "reasoningMetadata"
  | "platformMetadata";

export type ExecutiveJudgmentContextRegistryEntry = Readonly<{
  section: ExecutiveJudgmentContextSectionName;
  required: boolean;
  sourcePlatform: string;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentContextRegistry = Readonly<{
  registryId: "executive-judgment-context-registry";
  phaseId: "APP-JUDGE-2";
  sections: readonly ExecutiveJudgmentContextRegistryEntry[];
  compatiblePlatforms: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_CONTEXT_SECTIONS: readonly ExecutiveJudgmentContextRegistryEntry[] = Object.freeze([
  Object.freeze({ section: "identity", required: true, sourcePlatform: "Identity Platform", metadataOnly: true }),
  Object.freeze({ section: "intent", required: true, sourcePlatform: "Executive Intent", metadataOnly: true }),
  Object.freeze({ section: "situation", required: true, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "objects", required: false, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "relationships", required: false, sourcePlatform: "DS", metadataOnly: true }),
  Object.freeze({ section: "kpis", required: false, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "risks", required: false, sourcePlatform: "Risk Platform", metadataOnly: true }),
  Object.freeze({ section: "scenarios", required: false, sourcePlatform: "Scenario Platform", metadataOnly: true }),
  Object.freeze({ section: "timeline", required: false, sourcePlatform: "Timeline Platform", metadataOnly: true }),
  Object.freeze({ section: "executiveMemory", required: false, sourcePlatform: "Executive Memory", metadataOnly: true }),
  Object.freeze({ section: "recommendations", required: false, sourcePlatform: "Recommendation Platform", metadataOnly: true }),
  Object.freeze({ section: "constraints", required: false, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "knownAssumptions", required: false, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "availableEvidence", required: false, sourcePlatform: "KNL", metadataOnly: true }),
  Object.freeze({ section: "availableAlternatives", required: false, sourcePlatform: "APP", metadataOnly: true }),
  Object.freeze({ section: "sharedMentalModel", required: false, sourcePlatform: "Shared Mental Model", metadataOnly: true }),
  Object.freeze({ section: "reasoningMetadata", required: true, sourcePlatform: "Reasoning Platform", metadataOnly: true }),
  Object.freeze({ section: "platformMetadata", required: true, sourcePlatform: "CORE", metadataOnly: true }),
]);

export const EXECUTIVE_JUDGMENT_CONTEXT_COMPATIBLE_PLATFORMS = Object.freeze([
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LLM",
  "LAY",
  "Executive Memory",
  "Executive Intent",
  "Recommendation Platform",
  "Timeline Platform",
  "Risk Platform",
  "Scenario Platform",
  "Shared Mental Model",
  "Identity Platform",
  "Reasoning Platform",
] as const);

export function getExecutiveJudgmentContextRegistry(): ExecutiveJudgmentContextRegistry {
  return Object.freeze({
    registryId: "executive-judgment-context-registry",
    phaseId: "APP-JUDGE-2",
    sections: EXECUTIVE_JUDGMENT_CONTEXT_SECTIONS,
    compatiblePlatforms: EXECUTIVE_JUDGMENT_CONTEXT_COMPATIBLE_PLATFORMS,
    deterministic: true,
    metadataOnly: true,
  });
}
