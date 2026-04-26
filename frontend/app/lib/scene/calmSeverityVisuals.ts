export type SeverityLevel = "low" | "medium" | "high" | "critical" | "unknown";

export type CalmSeverityVisual = {
  glowStrength: number;
  outlineStrength: number;
  labelWeight: "normal" | "medium" | "strong";
  dimOpacity: number;
  allowMotion: false;
};

export function getCalmSeverityVisual(severity?: string): CalmSeverityVisual {
  const normalized = String(severity ?? "unknown").toLowerCase();
  if (normalized === "critical") {
    return {
      glowStrength: 0.9,
      outlineStrength: 1,
      labelWeight: "strong",
      dimOpacity: 0.28,
      allowMotion: false,
    };
  }
  if (normalized === "high") {
    return {
      glowStrength: 0.7,
      outlineStrength: 0.85,
      labelWeight: "strong",
      dimOpacity: 0.34,
      allowMotion: false,
    };
  }
  if (normalized === "medium" || normalized === "warning") {
    return {
      glowStrength: 0.45,
      outlineStrength: 0.55,
      labelWeight: "medium",
      dimOpacity: 0.45,
      allowMotion: false,
    };
  }
  return {
    glowStrength: 0.25,
    outlineStrength: 0.3,
    labelWeight: "normal",
    dimOpacity: 0.6,
    allowMotion: false,
  };
}
