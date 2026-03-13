export type StrategicState = {
  // flexible dashboard state; keep minimal but stable
  posture?: "growth" | "stability" | "quality" | "cost" | "balanced";
  overallScore?: number; // 0..1 or 0..100
  signals?: Array<{
    key: string;
    label?: string;
    value: number;
    trend?: "up" | "down" | "flat";
  }>;
};
