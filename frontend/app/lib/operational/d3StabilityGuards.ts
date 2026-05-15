/**
 * D3 stability helpers — pure, deterministic, no React.
 * Used by operational derivations to cap work and keep ordering stable.
 */

export const DEFAULT_D3_OPERATIONAL_TRAVERSAL_LIMIT = 512;

/** Clamp a requested traversal budget to a safe inclusive cap (minimum 1 when cap ≥ 1). */
export function safeOperationalTraversalLimit(requested: number, cap: number = DEFAULT_D3_OPERATIONAL_TRAVERSAL_LIMIT): number {
  const c = Math.max(1, Math.floor(cap));
  if (!Number.isFinite(requested)) return c;
  const r = Math.max(0, Math.floor(requested));
  return Math.min(r, c);
}

/** Return a shallow slice of at most `max` items (non-mutating). */
export function clampOperationalArraySize<T>(items: readonly T[], max: number): readonly T[] {
  const m = Math.max(0, Math.floor(max));
  if (items.length <= m) return items;
  return items.slice(0, m);
}

/** Lexicographic sort by string key — copy-first, does not mutate `items`. */
export function stabilizeOperationalOrdering<T>(items: readonly T[], key: (item: T) => string): readonly T[] {
  return [...items].sort((a, b) => key(a).localeCompare(key(b)));
}

export function safeOperationalNullFallback<T>(value: T | null | undefined, fallback: T): T {
  return value == null ? fallback : value;
}

/**
 * Returns true when `nextId` should not be expanded (cycle or depth guard).
 * Callers pass monotonically increasing depth from a root.
 */
export function preventRecursivePropagation(input: Readonly<{ depth: number; maxDepth: number; stack: readonly string[]; nextId: string }>): boolean {
  const md = Math.max(0, Math.floor(input.maxDepth));
  const d = Number.isFinite(input.depth) ? Math.floor(input.depth) : 0;
  if (d >= md) return true;
  const next = String(input.nextId ?? "").trim();
  if (!next) return true;
  return input.stack.includes(next);
}
