import { IDENTITY_LIFECYCLE_STATES, IDENTITY_SOURCES, IDENTITY_TYPES } from "./identityEnums.ts";
import type { IdentityLifecycleState, IdentitySource, IdentityType } from "./identityEnums.ts";

const identityTypeSet = new Set<string>(IDENTITY_TYPES);
const lifecycleStateSet = new Set<string>(IDENTITY_LIFECYCLE_STATES);
const sourceSet = new Set<string>(IDENTITY_SOURCES);

export function isIdentityType(value: unknown): value is IdentityType {
  return typeof value === "string" && identityTypeSet.has(value);
}

export function isIdentityLifecycleState(value: unknown): value is IdentityLifecycleState {
  return typeof value === "string" && lifecycleStateSet.has(value);
}

export function isIdentitySource(value: unknown): value is IdentitySource {
  return typeof value === "string" && sourceSet.has(value);
}

export function listIdentityTypes(): readonly IdentityType[] {
  return IDENTITY_TYPES;
}

export function listIdentityLifecycleStates(): readonly IdentityLifecycleState[] {
  return IDENTITY_LIFECYCLE_STATES;
}

export function listIdentitySources(): readonly IdentitySource[] {
  return IDENTITY_SOURCES;
}
