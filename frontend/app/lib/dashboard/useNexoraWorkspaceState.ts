"use client";

import { useReducer } from "react";
import {
  normalizeNexoraWorkspaceState,
  reduceNexoraWorkspaceState,
  type NexoraWorkspaceAction,
  type NexoraWorkspaceState,
} from "../workspace/nexoraWorkspaceStateContract.ts";

export function useNexoraWorkspaceState(
  initialSeed?: Partial<NexoraWorkspaceState>
): {
  state: NexoraWorkspaceState;
  dispatch: (action: NexoraWorkspaceAction) => void;
} {
  const [state, dispatch] = useReducer(
    reduceNexoraWorkspaceState,
    initialSeed,
    (seed) => normalizeNexoraWorkspaceState(seed)
  );
  return { state, dispatch };
}
