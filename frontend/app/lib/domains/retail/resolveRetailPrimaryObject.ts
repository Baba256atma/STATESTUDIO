import { getCanonicalRetailObjectKeywordMap } from "./retailCanonicalMap";

function normalizeRetailToken(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/^obj_/, "")
    .replace(/^id_/, "")
    .replace(/_\d+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveCanonicalRetailSceneObjectId(
  canonicalObjectId: string,
  sceneObjectIds: string[]
): string | null {
  const sceneIds = sceneObjectIds.map(String).filter(Boolean);
  const sceneIdSet = new Set(sceneIds);
  if (sceneIdSet.has(canonicalObjectId)) return canonicalObjectId;

  const normalizedCanonicalId = normalizeRetailToken(canonicalObjectId);
  const canonicalEntry = getCanonicalRetailObjectKeywordMap().find(
    (entry) => entry.objectId === canonicalObjectId
  );

  const exactSemanticMatch = sceneIds.find((sceneId) => {
    const normalizedSceneId = normalizeRetailToken(sceneId);
    if (!normalizedSceneId) return false;
    if (normalizedSceneId === normalizedCanonicalId) return true;
    return (
      canonicalEntry?.keywords.some((keyword) => normalizeRetailToken(keyword) === normalizedSceneId) ?? false
    );
  });

  if (exactSemanticMatch) return exactSemanticMatch;

  const partialSemanticMatch = sceneIds.find((sceneId) => {
    const normalizedSceneId = normalizeRetailToken(sceneId);
    if (!normalizedSceneId) return false;
    if (normalizedSceneId.includes(normalizedCanonicalId) || normalizedCanonicalId.includes(normalizedSceneId)) {
      return true;
    }
    return (
      canonicalEntry?.keywords.some((keyword) => {
        const normalizedKeyword = normalizeRetailToken(keyword);
        return (
          !!normalizedKeyword &&
          (normalizedSceneId.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedSceneId))
        );
      }) ?? false
    );
  });

  return partialSemanticMatch ?? null;
}

export function resolveDeterministicRetailPrimaryObjectId(
  fallbackText: string,
  sceneObjectIds: string[]
): string | null {
  const text = String(fallbackText || "").toLowerCase().trim();
  if (!text) return null;

  const sceneIdSet = new Set(sceneObjectIds.map(String));
  const canonicalMap = getCanonicalRetailObjectKeywordMap();

  for (const entry of canonicalMap) {
    const matchedKeyword = entry.keywords.find((keyword) => text.includes(keyword.toLowerCase()));
    if (matchedKeyword && sceneIdSet.has(entry.objectId)) {
      return entry.objectId;
    }
  }

  return null;
}

export function resolveRetailHighlightedObjectIds(
  rawTargetIds: string[],
  sceneObjectIds: string[]
): string[] {
  const sceneIds = sceneObjectIds.map(String).filter(Boolean);
  if (!sceneIds.length) return [];

  const canonicalMap = getCanonicalRetailObjectKeywordMap();
  const resolved = rawTargetIds
    .map((rawTargetId) => {
      const targetId = String(rawTargetId || "").trim();
      if (!targetId) return null;

      const directMatch = resolveCanonicalRetailSceneObjectId(targetId, sceneIds);
      if (directMatch) return directMatch;

      const normalizedTargetId = normalizeRetailToken(targetId);
      const canonicalEntry = canonicalMap.find((entry) => {
        if (entry.objectId === targetId) return true;
        if (normalizeRetailToken(entry.objectId) === normalizedTargetId) return true;
        return entry.keywords.some((keyword) => normalizeRetailToken(keyword) === normalizedTargetId);
      });

      if (!canonicalEntry) return null;
      return resolveCanonicalRetailSceneObjectId(canonicalEntry.objectId, sceneIds);
    })
    .filter((id): id is string => !!id);

  return Array.from(new Set(resolved));
}
