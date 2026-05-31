/** Memoize audit outputs — identical inputs return the same cached result. */

const cache = new Map<string, unknown>();
const lastResults = new Map<string, unknown>();

function cacheKey(auditName: string, inputKey: string): string {
  return `${auditName}::${inputKey}`;
}

export function getCachedAuditResult<T>(auditName: string, inputKey: string): T | undefined {
  return cache.get(cacheKey(auditName, inputKey)) as T | undefined;
}

export function setCachedAuditResult<T>(auditName: string, inputKey: string, result: T): T {
  const key = cacheKey(auditName, inputKey);
  cache.set(key, result);
  lastResults.set(auditName, result);
  return result;
}

export function getLastAuditResult<T>(auditName: string): T | undefined {
  return lastResults.get(auditName) as T | undefined;
}

export function resetAuditResultCacheForTests(): void {
  cache.clear();
  lastResults.clear();
}
