export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Simple risk gradient: green (safe) → yellow (warning) → red (danger)
export function riskToColor(risk01: number) {
  const r = clamp01(risk01);

  // 0..0.5 : green -> yellow
  // 0.5..1 : yellow -> red
  if (r <= 0.5) {
    const t = r / 0.5; // 0..1
    const red = Math.round(255 * t);
    return `rgb(${red},255,0)`;
  } else {
    const t = (r - 0.5) / 0.5; // 0..1
    const green = Math.round(255 * (1 - t));
    return `rgb(255,${green},0)`;
  }
}