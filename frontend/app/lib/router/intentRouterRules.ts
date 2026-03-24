const NON_ALPHANUMERIC = /[^a-z0-9]+/g;

export function normalizeRouterText(value: string): string {
  return String(value || "").toLowerCase().replace(NON_ALPHANUMERIC, " ").trim();
}

export function includesAnyKeyword(text: string, keywords: string[]): string[] {
  const normalizedText = normalizeRouterText(text);
  return keywords.filter((keyword) => normalizedText.includes(normalizeRouterText(keyword)));
}

export function scoreKeywordHits(text: string, keywords: string[], weight = 0.18): {
  score: number;
  matched: string[];
} {
  const matched = includesAnyKeyword(text, keywords);
  return {
    score: matched.length * weight,
    matched,
  };
}

export function normalizeSceneObjectIdForMatch(value: string): string {
  return normalizeRouterText(String(value || "").replace(/^obj_/, "").replace(/^id_/, "").replace(/_\d+$/, ""));
}

export function matchSceneObjectIdsFromText(text: string, objectIds: string[]): string[] {
  const normalizedText = normalizeRouterText(text);
  return objectIds.filter((objectId) => {
    const normalizedId = normalizeSceneObjectIdForMatch(objectId);
    return !!normalizedId && normalizedText.includes(normalizedId);
  });
}

export function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}
