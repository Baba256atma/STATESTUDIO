/** RDI:2 canonical browser/runtime route lock. */

export const RDI2_CANONICAL_RUNTIME_URL =
  "http://localhost:3000/executive" as const;
export const RDI2_CANONICAL_RUNTIME_PATHNAME = "/executive" as const;

export type Rdi2CanonicalRouteVerification = Readonly<{
  valid: boolean;
  expectedPathname: typeof RDI2_CANONICAL_RUNTIME_PATHNAME;
  actualPathname: string;
  canonicalUrl: typeof RDI2_CANONICAL_RUNTIME_URL;
}>;

export function verifyRdi2CanonicalRuntimeUrl(
  value: string | URL,
): Rdi2CanonicalRouteVerification {
  const url = value instanceof URL ? value : new URL(value);
  return Object.freeze({
    valid: url.pathname === RDI2_CANONICAL_RUNTIME_PATHNAME,
    expectedPathname: RDI2_CANONICAL_RUNTIME_PATHNAME,
    actualPathname: url.pathname,
    canonicalUrl: RDI2_CANONICAL_RUNTIME_URL,
  });
}

/** Browser/capture harness guard: never falls back to `/`. */
export function assertRdi2CanonicalRuntimeUrl(
  value: string | URL,
): Rdi2CanonicalRouteVerification {
  const result = verifyRdi2CanonicalRuntimeUrl(value);
  if (!result.valid) {
    throw new Error(
      `RDI:2 certification requires pathname "${RDI2_CANONICAL_RUNTIME_PATHNAME}"; received "${result.actualPathname}".`,
    );
  }
  return result;
}
