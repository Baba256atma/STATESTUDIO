type SceneSemanticSignatureInput = {
  objectIds: string[];
  highlightedIds?: string[];
  dimmedIds?: string[];
  selectedId?: string | null;
  reactionMode?: string | null;
  propagationSource?: string | null;
};

function normalizeIds(values?: string[]): string[] {
  if (!Array.isArray(values) || values.length === 0) return [];
  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter((value) => value.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function buildSceneSemanticSignature(input: SceneSemanticSignatureInput): string {
  return JSON.stringify({
    objectIds: normalizeIds(input.objectIds),
    highlightedIds: normalizeIds(input.highlightedIds),
    dimmedIds: normalizeIds(input.dimmedIds),
    selectedId: input.selectedId ?? null,
    reactionMode: input.reactionMode ?? null,
    propagationSource: input.propagationSource ?? null,
  });
}
