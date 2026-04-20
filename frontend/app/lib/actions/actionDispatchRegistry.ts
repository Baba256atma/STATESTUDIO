import type { CanonicalNexoraAction } from "./actionTypes";
import { traceActionRouterDispatchMissing } from "./actionTrace";

type DispatchFn = (action: CanonicalNexoraAction) => void;

let impl: DispatchFn | null = null;

/**
 * Pass 1 bridge so shell-level UI (e.g. CommandHeader) can reach HomeScreen's dispatcher
 * without restructuring the component tree. Prefer context or explicit props in Pass 2.
 */
export function registerNexoraActionDispatch(dispatch: DispatchFn | null): void {
  impl = dispatch;
}

/** @returns true when the registered HomeScreen dispatcher handled the action. */
export function dispatchNexoraAction(action: CanonicalNexoraAction): boolean {
  if (!impl) {
    traceActionRouterDispatchMissing(action);
    return false;
  }
  impl(action);
  return true;
}
