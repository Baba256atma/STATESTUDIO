export function cleanExecutiveText(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/!+/g, ".")
    .trim();
}

export function conciseExecutiveSentence(value: unknown, fallback: string): string {
  const text = cleanExecutiveText(value);
  if (!text) return fallback;
  const first = text.split(/(?<=[.?!])\s+/)[0] ?? text;
  return first.length <= 180 ? first : `${first.slice(0, 177).trim()}...`;
}

export function stableExecutiveHeadline(params: {
  preferred?: string | null;
  fallback: string;
}): string {
  return conciseExecutiveSentence(params.preferred, params.fallback)
    .replace(/\.$/, "");
}

export function avoidFalseCertainty(value: unknown): string {
  return cleanExecutiveText(value)
    .replace(/\bwill definitely\b/gi, "is expected to")
    .replace(/\bguaranteed\b/gi, "supported")
    .replace(/\bcertainly\b/gi, "likely");
}
