"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Exs1ObjectId } from "../exs1Types";
import {
  INITIAL_SCENARIOS,
  createCombinedScenario,
  createMockScenario,
  sortScenarios,
  type ExecutiveScenario,
  type ScenarioRankSort,
} from "./ScenarioConfig";

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
 * ScenarioSelectionManager — pure UI state for Scenario Engineering.
 * Never touches Timeline, Pack, Runtime, or page route.
 */
export function ScenarioSelectionManager({ children }: Props) {
  const [scenarios, setScenarios] = useState<ExecutiveScenario[]>(() => [
    ...INITIAL_SCENARIOS,
  ]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    "scenario-a",
  );
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [rankSort, setRankSort] = useState<ScenarioRankSort>("balanced");
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(300);
  const [showComparison, setShowComparison] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  const rankedScenarios = useMemo(
    () => sortScenarios(scenarios, rankSort),
    [scenarios, rankSort],
  );

  const currentScenario =
    scenarios.find((s) => s.id === currentScenarioId) ?? null;

  const activeObjectIds = useMemo(() => {
    if (compareIds.length >= 2) {
      const ids = new Set<Exs1ObjectId>();
      for (const id of compareIds) {
        const scenario = scenarios.find((s) => s.id === id);
        scenario?.objectIds.forEach((oid) => ids.add(oid));
      }
      return Array.from(ids);
    }
    return currentScenario?.objectIds ?? [];
  }, [compareIds, scenarios, currentScenario]);

  const setCurrentScenario = useCallback((id: string) => {
    setCurrentScenarioId(id);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1]!, id];
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const setFavorite = useCallback((id: string) => {
    setFavoriteId((prev) => (prev === id ? null : id));
  }, []);

  const addScenario = useCallback(
    (input: {
      name: string;
      description: string;
      color: string;
      cloneFromId?: string | null;
    }) => {
      const clone = input.cloneFromId
        ? scenarios.find((s) => s.id === input.cloneFromId) ?? null
        : null;
      const next = createMockScenario({
        name: input.name,
        description: input.description,
        color: input.color,
        cloneFrom: clone,
      });
      setScenarios((prev) => [...prev, next]);
      setCurrentScenarioId(next.id);
    },
    [scenarios],
  );

  const renameScenario = useCallback((id: string, name: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s)),
    );
  }, []);

  const removeScenario = useCallback((id: string) => {
    setScenarios((prev) => {
      const next = prev.filter((s) => s.id !== id);
      return next.length > 0 ? next : prev;
    });
    setCurrentScenarioId((prev) => (prev === id ? "scenario-a" : prev));
    setFavoriteId((prev) => (prev === id ? null : prev));
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const combineScenarios = useCallback(
    (aId: string, bId: string) => {
      const a = scenarios.find((s) => s.id === aId);
      const b = scenarios.find((s) => s.id === bId);
      if (!a || !b) return;
      const combined = createCombinedScenario(a, b);
      setScenarios((prev) => [...prev, combined]);
      setCurrentScenarioId(combined.id);
      setCompareIds([]);
    },
    [scenarios],
  );

  const value = useMemo(
    () => ({
      scenarios,
      currentScenarioId,
      favoriteId,
      compareIds,
      rankSort,
      rankedScenarios,
      explorerCollapsed,
      explorerWidth,
      showComparison,
      showRanking,
      activeObjectIds,
      currentScenario,
      setCurrentScenario,
      toggleCompare,
      clearCompare,
      setFavorite,
      setRankSort,
      setExplorerCollapsed,
      setExplorerWidth,
      setShowComparison,
      setShowRanking,
      addScenario,
      renameScenario,
      removeScenario,
      combineScenarios,
    }),
    [
      scenarios,
      currentScenarioId,
      favoriteId,
      compareIds,
      rankSort,
      rankedScenarios,
      explorerCollapsed,
      explorerWidth,
      showComparison,
      showRanking,
      activeObjectIds,
      currentScenario,
      setCurrentScenario,
      toggleCompare,
      clearCompare,
      setFavorite,
      addScenario,
      renameScenario,
      removeScenario,
      combineScenarios,
    ],
  );

  return (
    <ScenarioSelectionContext.Provider value={value}>
      {children}
    </ScenarioSelectionContext.Provider>
  );
}
