import { OBJECT_DICTIONARY_V1, type ObjectDictionaryEntry } from "./objectDictionary.v1";

export function getObjectEntry(id: string): ObjectDictionaryEntry | null {
  if (!id) return null;
  const entry = OBJECT_DICTIONARY_V1[id];
  return entry ?? null;
}

export function searchObjectsBySignal(text: string): ObjectDictionaryEntry[] {
  if (!text || typeof text !== "string") return [];
  const needle = text.toLowerCase();
  const results: ObjectDictionaryEntry[] = [];
  for (const entry of Object.values(OBJECT_DICTIONARY_V1)) {
    const hasMatch = entry.signals.some((s) => needle.includes(s.toLowerCase()));
    if (hasMatch) results.push(entry);
  }
  return results;
}
