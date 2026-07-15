const domain = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveReasoningDomains = Object.freeze([
  domain(
    "eng-6-domain-evidence-evaluation",
    "Evidence Evaluation",
    "Reasoning domain describing evaluation of evidence metadata without scoring or runtime evaluation.",
  ),
  domain(
    "eng-6-domain-evidence-collection",
    "Evidence Collection",
    "Reasoning domain describing evidence collection architecture without collecting data or accessing persistence.",
  ),
  domain(
    "eng-6-domain-hypothesis-formation",
    "Hypothesis Formation",
    "Reasoning domain describing hypothesis formation vocabulary without generating hypotheses.",
  ),
  domain(
    "eng-6-domain-logical-inference",
    "Logical Inference",
    "Reasoning domain describing logical inference architecture without executing inference algorithms.",
  ),
  domain(
    "eng-6-domain-comparative-reasoning",
    "Comparative Reasoning",
    "Reasoning domain describing comparative reasoning vocabulary without performing comparisons.",
  ),
  domain(
    "eng-6-domain-causal-reasoning",
    "Causal Reasoning",
    "Reasoning domain describing causal reasoning vocabulary without causal analysis engines.",
  ),
  domain(
    "eng-6-domain-risk-reasoning",
    "Risk Reasoning",
    "Reasoning domain describing risk reasoning vocabulary without risk computation.",
  ),
  domain(
    "eng-6-domain-scenario-reasoning",
    "Scenario Reasoning",
    "Reasoning domain describing scenario reasoning vocabulary without scenario simulation.",
  ),
  domain(
    "eng-6-domain-confidence-evaluation",
    "Confidence Evaluation",
    "Reasoning domain describing confidence evaluation vocabulary without confidence scoring.",
  ),
  domain(
    "eng-6-domain-contradiction-detection",
    "Contradiction Detection",
    "Reasoning domain describing contradiction detection vocabulary without contradiction resolution engines.",
  ),
  domain(
    "eng-6-domain-executive-explanation",
    "Executive Explanation",
    "Reasoning domain describing executive explanation metadata without narrative generation or Advisor responses.",
  ),
  domain(
    "eng-6-domain-reasoning-summary",
    "Reasoning Summary",
    "Reasoning domain describing reasoning summary envelopes without producing runtime summaries.",
  ),
] as const);
