export type ExecutiveJudgmentTradeoffDomain =
  | "cost-benefit"
  | "speed-quality"
  | "risk-return"
  | "short-long-term"
  | "efficiency-resilience"
  | "flexibility-stability"
  | "growth-control"
  | "resource-impact"
  | "innovation-reliability"
  | "complexity-simplicity";

export type ExecutiveJudgmentTradeoffRegistry = Readonly<{
  registryId: "executive-judgment-tradeoff-registry";
  phaseId: "APP-JUDGE-5";
  domains: readonly ExecutiveJudgmentTradeoffDomain[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_TRADEOFF_DOMAINS = Object.freeze([
  "cost-benefit",
  "speed-quality",
  "risk-return",
  "short-long-term",
  "efficiency-resilience",
  "flexibility-stability",
  "growth-control",
  "resource-impact",
  "innovation-reliability",
  "complexity-simplicity",
] as const);

export const EXECUTIVE_JUDGMENT_TRADEOFF_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "APP-JUDGE-3",
  "APP-JUDGE-4",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentTradeoffRegistry(): ExecutiveJudgmentTradeoffRegistry {
  return Object.freeze({
    registryId: "executive-judgment-tradeoff-registry",
    phaseId: "APP-JUDGE-5",
    domains: EXECUTIVE_JUDGMENT_TRADEOFF_DOMAINS,
    compatibleInputs: EXECUTIVE_JUDGMENT_TRADEOFF_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
