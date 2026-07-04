export type ExecutiveJudgmentRiskOpportunityDomain =
  | "high-risk-high-opportunity"
  | "low-risk-low-opportunity"
  | "downside-protection-upside-capture"
  | "short-term-risk-long-term-opportunity"
  | "execution-risk-strategic-gain"
  | "resource-risk-impact-opportunity"
  | "market-risk-growth-opportunity"
  | "operational-risk-efficiency-opportunity";

export type ExecutiveJudgmentRiskOpportunityRegistry = Readonly<{
  registryId: "executive-judgment-risk-opportunity-registry";
  phaseId: "APP-JUDGE-6";
  domains: readonly ExecutiveJudgmentRiskOpportunityDomain[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_RISK_OPPORTUNITY_DOMAINS = Object.freeze([
  "high-risk-high-opportunity",
  "low-risk-low-opportunity",
  "downside-protection-upside-capture",
  "short-term-risk-long-term-opportunity",
  "execution-risk-strategic-gain",
  "resource-risk-impact-opportunity",
  "market-risk-growth-opportunity",
  "operational-risk-efficiency-opportunity",
] as const);

export const EXECUTIVE_JUDGMENT_RISK_OPPORTUNITY_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "APP-JUDGE-3",
  "APP-JUDGE-4",
  "APP-JUDGE-5",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentRiskOpportunityRegistry(): ExecutiveJudgmentRiskOpportunityRegistry {
  return Object.freeze({
    registryId: "executive-judgment-risk-opportunity-registry",
    phaseId: "APP-JUDGE-6",
    domains: EXECUTIVE_JUDGMENT_RISK_OPPORTUNITY_DOMAINS,
    compatibleInputs: EXECUTIVE_JUDGMENT_RISK_OPPORTUNITY_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
