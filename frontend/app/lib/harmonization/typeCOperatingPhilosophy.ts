export type TypeCOperatingPrincipleId =
  | "calm_intelligence"
  | "low_noise_ux"
  | "propagation_first_reasoning"
  | "strategic_cognition_support"
  | "overlay_based_architecture"
  | "executive_timing_discipline"
  | "resilience_oriented_reasoning";

export type TypeCOperatingPrinciple = {
  id: TypeCOperatingPrincipleId;
  title: string;
  statement: string;
  designRule: string;
};

export const TYPE_C_OPERATING_PHILOSOPHY: TypeCOperatingPrinciple[] = [
  {
    id: "calm_intelligence",
    title: "Calm Intelligence",
    statement: "Nexora communicates operational pressure without panic or theatrical urgency.",
    designRule: "Use concise executive language and avoid flashing, alarmist, or exaggerated messaging.",
  },
  {
    id: "low_noise_ux",
    title: "Low-Noise Executive UX",
    statement: "The interface should surface the few signals that matter most.",
    designRule: "Compress overlapping signals before presenting executive focus.",
  },
  {
    id: "propagation_first_reasoning",
    title: "Propagation-First Reasoning",
    statement: "Nexora explains how pressure moves through relationships before recommending focus.",
    designRule: "Prefer propagation, fragility, and dependency context over isolated warnings.",
  },
  {
    id: "strategic_cognition_support",
    title: "Strategic Cognition Support",
    statement: "Nexora supports executive thinking without replacing executive judgment.",
    designRule: "Frame decisions through awareness, interpretation, comparison, readiness, monitoring, and review.",
  },
  {
    id: "overlay_based_architecture",
    title: "Overlay-Based Architecture",
    statement: "Intelligence layers remain derived, reversible, and non-destructive.",
    designRule: "Do not mutate scene state from intelligence, overlay, or harmonization layers.",
  },
  {
    id: "executive_timing_discipline",
    title: "Executive Timing Discipline",
    statement: "Recommendations must communicate confidence, uncertainty, and readiness before action.",
    designRule: "Do not imply execution readiness when blockers or uncertainty remain unresolved.",
  },
  {
    id: "resilience_oriented_reasoning",
    title: "Resilience-Oriented Reasoning",
    statement: "Nexora balances risk visibility with recovery, adaptation, and stabilization context.",
    designRule: "Pair fragility language with resilience or monitoring context when available.",
  },
];

export function listTypeCOperatingPrinciples(): TypeCOperatingPrinciple[] {
  return TYPE_C_OPERATING_PHILOSOPHY.map((principle) => ({ ...principle }));
}

export function validateTypeCOperatingPhilosophy(): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const principle of TYPE_C_OPERATING_PHILOSOPHY) {
    if (seen.has(principle.id)) warnings.push(`Duplicate Type-C principle: ${principle.id}`);
    seen.add(principle.id);
    if (!principle.statement.trim()) warnings.push(`${principle.id} lacks a statement.`);
    if (!principle.designRule.trim()) warnings.push(`${principle.id} lacks a design rule.`);
  }
  return { valid: warnings.length === 0, warnings };
}
