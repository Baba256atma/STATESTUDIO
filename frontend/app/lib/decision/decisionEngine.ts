/**
 * Rule-based decision options & trade-offs for executive panels (no backend / no simulation).
 */

export type DecisionOption = {
  id: string;
  label: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  impact: string;
  tradeoff: string;
};

export type DecisionSet = {
  primaryRecommendation: string;
  options: DecisionOption[];
};

const MAX_OPTIONS = 3;

function line(text: string, max: number): string {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

function sliceOptions(options: DecisionOption[]): DecisionOption[] {
  return options.slice(0, MAX_OPTIONS);
}

export function logDecisionSet(view: string, decisionSet: DecisionSet): void {
  if (process.env.NODE_ENV === "production") return;
  console.log("[Nexora][DecisionSet]", { view, decisionSet });
}

export function buildRiskDecisionSet(risk: Record<string, unknown> | null | undefined): DecisionSet {
  const levelRaw = risk?.level ?? risk?.risk_level ?? "low";
  const level = String(levelRaw);
  const isCritical = /high|critical|severe/i.test(level);
  return {
    primaryRecommendation: isCritical
      ? "Act immediately to reduce system fragility."
      : "Maintain current system posture with monitoring.",
    options: sliceOptions([
      {
        id: "conservative",
        label: "Reduce Exposure",
        description: line("Lower dependency and add buffers.", 90),
        riskLevel: "low",
        impact: line("Stabilizes system but slows performance.", 80),
        tradeoff: line("Higher cost, lower agility", 60),
      },
      {
        id: "balanced",
        label: "Controlled Adjustment",
        description: line("Mitigate key drivers while maintaining flow.", 90),
        riskLevel: "medium",
        impact: line("Balances stability and efficiency.", 70),
        tradeoff: line("Moderate cost and complexity", 50),
      },
      {
        id: "aggressive",
        label: "Optimize for Growth",
        description: line("Push capacity and remove constraints.", 80),
        riskLevel: "high",
        impact: line("Maximizes output but increases fragility.", 70),
        tradeoff: line("High risk of cascading failure", 50),
      },
    ]),
  };
}

export type AdviceDecisionInput = {
  summary: string;
  primaryRecommendation: string | null;
  actionsCount: number;
};

export function buildAdviceDecisionSet(input: AdviceDecisionInput): DecisionSet {
  const hasActions = input.actionsCount > 0;
  const urgent = hasActions || Boolean(input.primaryRecommendation);
  return {
    primaryRecommendation: urgent
      ? line(
          input.primaryRecommendation ??
            "Execute the top recommended move while monitoring second-order effects.",
          120
        )
      : line("Hold posture: deepen diagnosis before committing capital or scope.", 100),
    options: sliceOptions([
      {
        id: "conservative",
        label: "Defer & diagnose",
        description: line("Gather one more cycle of signal before scaling the move.", 85),
        riskLevel: "low",
        impact: line("Limits regret; delays upside.", 55),
        tradeoff: line("Slower commitment", 40),
      },
      {
        id: "balanced",
        label: "Phased rollout",
        description: line("Pilot on a bounded scope, then widen if KPIs hold.", 85),
        riskLevel: "medium",
        impact: line("Spreads risk across time and cohorts.", 60),
        tradeoff: line("Coordination overhead", 45),
      },
      {
        id: "aggressive",
        label: "Full commit",
        description: line("Align resources behind the headline recommendation now.", 85),
        riskLevel: "high",
        impact: line("Captures speed; concentrates exposure.", 55),
        tradeoff: line("Less room to reverse", 40),
      },
    ]),
  };
}

export type ConflictDecisionInput = {
  summary: string | null;
  conflictCount: number;
};

export function buildConflictDecisionSet(input: ConflictDecisionInput): DecisionSet {
  const hot = input.conflictCount >= 2;
  return {
    primaryRecommendation: hot
      ? line("Broker a trade-off explicitly before teams harden opposing camps.", 110)
      : line("Clarify ownership on the single tension before it spreads.", 100),
    options: sliceOptions([
      {
        id: "conservative",
        label: "Contain the tension",
        description: line("Document positions and pause cross-dependent releases.", 85),
        riskLevel: "low",
        impact: line("Reduces flare-ups; slows delivery.", 55),
        tradeoff: line("Temporary throughput hit", 45),
      },
      {
        id: "balanced",
        label: "Negotiate scope split",
        description: line("Sequence work so both sides get a win on different axes.", 90),
        riskLevel: "medium",
        impact: line("Preserves momentum with explicit trade-offs.", 60),
        tradeoff: line("Requires executive airtime", 45),
      },
      {
        id: "aggressive",
        label: "Force arbitration",
        description: line("Pick a single direction and reallocate capacity to match.", 85),
        riskLevel: "high",
        impact: line("Ends thrash fast; creates losers.", 50),
        tradeoff: line("Morale / trust cost", 40),
      },
    ]),
  };
}

export type TimelineDecisionInput = {
  stageCount: number;
  hasRecommendedPath: boolean;
  recommendedSummary: string | null;
  alternativeHint: string | null;
};

export function buildTimelineDecisionSet(input: TimelineDecisionInput): DecisionSet {
  const rich = input.stageCount >= 2 && input.hasRecommendedPath;
  return {
    primaryRecommendation: rich
      ? line(input.recommendedSummary ?? "Follow the recommended path, then validate with compare/simulate.", 120)
      : line("Build the story first: simulate to populate before vs after vs alternative.", 110),
    options: sliceOptions([
      {
        id: "conservative",
        label: "Stay on current state",
        description: line("Keep today’s posture until evidence hardens.", 75),
        riskLevel: "low",
        impact: line("Avoids premature moves.", 45),
        tradeoff: line("Opportunity cost if window closes", 50),
      },
      {
        id: "balanced",
        label: "Adopt recommended path",
        description: line("Commit to the modeled after-state as default plan.", 80),
        riskLevel: "medium",
        impact: line("Balances upside vs control.", 45),
        tradeoff: line("Residual model uncertainty", 45),
      },
      {
        id: "aggressive",
        label: "Stress-test alternative",
        description: line(
          input.alternativeHint ?? "Explore the what-if branch before locking scope.",
          90
        ),
        riskLevel: "high",
        impact: line("Surfaces hidden tail risks early.", 50),
        tradeoff: line("Time and narrative complexity", 45),
      },
    ]),
  };
}

export type WarRoomDecisionInput = {
  riskLevel: string;
  situation: string;
  recommendationAction: string | null;
};

export function buildWarRoomDecisionSet(input: WarRoomDecisionInput): DecisionSet {
  const critical = /critical|high/i.test(input.riskLevel);
  const nonCriticalDir =
    (input.recommendationAction && line(input.recommendationAction, 100)) ||
    line(input.situation, 100) ||
    "Align leadership on one default move.";
  return {
    primaryRecommendation: critical
      ? line("Bias to action: shorten decision latency on the primary risk object.", 115)
      : line(nonCriticalDir, 120),
    options: sliceOptions([
      {
        id: "conservative",
        label: "Hold & monitor",
        description: line("Tighten reporting cadence without changing operating levers.", 85),
        riskLevel: "low",
        impact: line("Limits downside of a wrong bet.", 50),
        tradeoff: line("May miss a narrowing window", 45),
      },
      {
        id: "balanced",
        label: "Execute recommended move",
        description: line(
          input.recommendationAction
            ? `Primary line: ${line(input.recommendationAction, 70)}`
            : "Lock the council’s headline recommendation with guardrails.",
          95
        ),
        riskLevel: "medium",
        impact: line("Moves the operating picture forward.", 50),
        tradeoff: line("Requires cross-team coordination", 45),
      },
      {
        id: "aggressive",
        label: "Parallel bets",
        description: line("Run two tracks—speed path plus hedge—until one proves out.", 90),
        riskLevel: "high",
        impact: line("Maximizes optionality under ambiguity.", 50),
        tradeoff: line("Burns capacity and focus", 40),
      },
    ]),
  };
}
