/** E2:66 — Memoized object label resolution (same signature → cached result). */

const cache = new Map<string, unknown>();

function cacheKey(namespace: string, signature: string): string {
  return `${namespace}::${signature}`;
}

export function getObjectLabelCached<T>(namespace: string, signature: string): T | undefined {
  return cache.get(cacheKey(namespace, signature)) as T | undefined;
}

export function setObjectLabelCached<T>(namespace: string, signature: string, result: T): T {
  cache.set(cacheKey(namespace, signature), result);
  return result;
}

export function resetObjectLabelRuntimeCacheForTests(): void {
  cache.clear();
}
