/**
 * APP-1:3 — Context mutation authority.
 * Only the Executive Time Camera may hold this authority token.
 */

export const EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY = "APP-1/3-executive-time-camera" as const;

export type ExecutiveTimeContextMutationAuthority = typeof EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY;

export function isExecutiveTimeContextMutationAuthorized(
  authority: ExecutiveTimeContextMutationAuthority | undefined
): boolean {
  return authority === EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY;
}
