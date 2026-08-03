"use client";

import { createContext, useMemo, type ReactNode } from "react";
import type { Exs1ObjectId } from "../exs1Types";
import { useRuntimeScenario } from "../runtime";
import type { ExecutiveScenario, ScenarioRankSort } from "./ScenarioConfig";

export type ScenarioSelectionContextValue = {
  readonly scenarios: readonly ExecutiveScenario[];
  readonly currentScenarioId: string | null;
  readonly favoriteId: string | null;
  readonly compareIds: readonly string[];
  readonly rankSort: ScenarioRankSort;
  readonly rankedScenarios: readonly ExecutiveScenario[];
  readonly explorerCollapsed: boolean;
  readonly explorerWidth: number;
  readonly showComparison: boolean;
  readonly showRanking: boolean;
  readonly activeObjectIds: readonly Exs1ObjectId[];
  readonly currentScenario: ExecutiveScenario | null;
  readonly setCurrentScenario: (id: string) => void;
  readonly toggleCompare: (id: string) => void;
  readonly clearCompare: () => void;
  readonly setFavorite: (id: string) => void;
  readonly setRankSort: (sort: ScenarioRankSort) => void;
  readonly setExplorerCollapsed: (collapsed: boolean) => void;
  readonly setExplorerWidth: (width: number) => void;
  readonly setShowComparison: (open: boolean) => void;
  readonly setShowRanking: (open: boolean) => void;
  readonly addScenario: (input: {
    name: string;
    description: string;
    color: string;
    cloneFromId?: string | null;
  }) => void;
  readonly renameScenario: (id: string, name: string) => void;
  readonly removeScenario: (id: string) => void;
  readonly combineScenarios: (aId: string, bId: string) => void;
};

export const ScenarioSelectionContext =
  createContext<ScenarioSelectionContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ScenarioSelectionManager — Runtime-backed Scenario Engineering state.
 */
export function ScenarioSelectionManager({ children }: Props) {
  const runtime = useRuntimeScenario();
  const value = useMemo(
    () =>
      ({
        ...runtime,
        activeObjectIds: runtime.activeObjectIds as readonly Exs1ObjectId[],
      }) satisfies ScenarioSelectionContextValue,
    [runtime],
  );

  return (
    <ScenarioSelectionContext.Provider value={value}>
      {children}
    </ScenarioSelectionContext.Provider>
  );
}
