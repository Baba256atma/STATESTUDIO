export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskAlert = {
  level: RiskLevel;
  score: number; // 0..1 or 0..100 depending on engine, UI treats as number
  reasons: string[];
};
