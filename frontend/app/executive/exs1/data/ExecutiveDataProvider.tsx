"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_DATA_HISTORY,
  INITIAL_DATA_MAPPINGS,
  INITIAL_DATA_SOURCES,
  createDataSource,
  toDataJournalEntry,
  toDataTimelinePack,
  type DataCatalogSection,
  type DataFilter,
  type DataHistoryEvent,
  type DataJournalEntry,
  type DataSourceCategory,
  type DataTimelinePack,
  type ExecutiveDataMapping,
  type ExecutiveDataSource,
  type MappingStatus,
  type WizardStep,
} from "./ExecutiveDataConfig";

export type ExecutiveDataContextValue = {
  readonly experienceActive: boolean;
  readonly setExperienceActive: (active: boolean) => void;
  readonly section: DataCatalogSection;
  readonly setSection: (section: DataCatalogSection) => void;
  readonly sources: readonly ExecutiveDataSource[];
  readonly mappings: readonly ExecutiveDataMapping[];
  readonly history: readonly DataHistoryEvent[];
  readonly selectedSourceId: string | null;
  readonly selectedSource: ExecutiveDataSource | null;
  readonly filter: DataFilter;
  readonly query: string;
  readonly wizardStep: WizardStep;
  readonly wizardCategory: DataSourceCategory;
  readonly wizardName: string;
  readonly journalEntries: readonly DataJournalEntry[];
  readonly dataPacks: readonly DataTimelinePack[];
  readonly setSelectedSource: (id: string | null) => void;
  readonly setFilter: (filter: DataFilter) => void;
  readonly setQuery: (query: string) => void;
  readonly setWizardStep: (step: WizardStep) => void;
  readonly setWizardCategory: (category: DataSourceCategory) => void;
  readonly setWizardName: (name: string) => void;
  readonly resetWizard: () => void;
  readonly finishWizard: () => void;
  readonly updateMappingStatus: (id: string, status: MappingStatus) => void;
  readonly assignMappingObject: (
    id: string,
    objectLabel: string,
    objectId: ExecutiveDataMapping["objectId"],
  ) => void;
  readonly refresh: () => void;
  readonly disconnectSelected: () => void;
};

export const ExecutiveDataContext =
  createContext<ExecutiveDataContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveDataProvider — pure UI data catalog / mapping state.
 * Never touches Runtime, drivers, parsing, or timeline lens.
 */
export function ExecutiveDataProvider({ children }: Props) {
  const [experienceActive, setExperienceActive] = useState(false);
  const [section, setSection] = useState<DataCatalogSection>("Sources");
  const [sources, setSources] = useState<ExecutiveDataSource[]>(() => [
    ...INITIAL_DATA_SOURCES,
  ]);
  const [mappings, setMappings] = useState<ExecutiveDataMapping[]>(() => [
    ...INITIAL_DATA_MAPPINGS,
  ]);
  const [history, setHistory] = useState<DataHistoryEvent[]>(() => [
    ...INITIAL_DATA_HISTORY,
  ]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    "source-sales-csv",
  );
  const [filter, setFilter] = useState<DataFilter>("All");
  const [query, setQuery] = useState("");
  const [wizardStep, setWizardStep] = useState<WizardStep>("type");
  const [wizardCategory, setWizardCategory] =
    useState<DataSourceCategory>("CSV");
  const [wizardName, setWizardName] = useState("new-dataset.csv");
  const [journalEntries, setJournalEntries] = useState<DataJournalEntry[]>([]);
  const [dataPacks, setDataPacks] = useState<DataTimelinePack[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const selectedSource =
    sources.find((s) => s.id === selectedSourceId) ?? null;

  const resetWizard = useCallback(() => {
    setWizardStep("type");
    setWizardCategory("CSV");
    setWizardName("new-dataset.csv");
  }, []);

  const finishWizard = useCallback(() => {
    const next = createDataSource({
      name: wizardName,
      category: wizardCategory,
    });
    setSources((prev) => [next, ...prev]);
    setSelectedSourceId(next.id);
    setHistory((prev) => [
      {
        id: `hist-${Date.now().toString(36)}`,
        when: "Just now",
        title: "Source Added",
        summary: `${next.name} connected through Data Wizard (mock).`,
      },
      ...prev,
    ]);
    const journal = toDataJournalEntry(next, 1);
    const pack = toDataTimelinePack(next);
    setJournalEntries((prev) => [...prev, journal]);
    setDataPacks((prev) => [...prev, pack]);
    setSection("Sources");
    resetWizard();
  }, [wizardName, wizardCategory, resetWizard]);

  const updateMappingStatus = useCallback(
    (id: string, status: MappingStatus) => {
      setMappings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m)),
      );
    },
    [],
  );

  const assignMappingObject = useCallback(
    (
      id: string,
      objectLabel: string,
      objectId: ExecutiveDataMapping["objectId"],
    ) => {
      setMappings((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                objectLabel,
                objectId,
                status: "Mapped" as const,
              }
            : m,
        ),
      );
    },
    [],
  );

  const refresh = useCallback(() => {
    setRefreshTick((n) => n + 1);
  }, []);

  const disconnectSelected = useCallback(() => {
    if (!selectedSourceId) return;
    setSources((prev) =>
      prev.map((s) =>
        s.id === selectedSourceId
          ? {
              ...s,
              status: "Disconnected",
              health: "Disconnected",
              lastSync: "Disconnected",
            }
          : s,
      ),
    );
  }, [selectedSourceId]);

  const value = useMemo(
    () => ({
      experienceActive,
      setExperienceActive,
      section,
      setSection,
      sources,
      mappings,
      history,
      selectedSourceId,
      selectedSource,
      filter,
      query,
      wizardStep,
      wizardCategory,
      wizardName,
      journalEntries,
      dataPacks,
      setSelectedSource: setSelectedSourceId,
      setFilter,
      setQuery,
      setWizardStep,
      setWizardCategory,
      setWizardName,
      resetWizard,
      finishWizard,
      updateMappingStatus,
      assignMappingObject,
      refresh,
      disconnectSelected,
    }),
    [
      experienceActive,
      section,
      sources,
      mappings,
      history,
      selectedSourceId,
      selectedSource,
      filter,
      query,
      wizardStep,
      wizardCategory,
      wizardName,
      journalEntries,
      dataPacks,
      resetWizard,
      finishWizard,
      updateMappingStatus,
      assignMappingObject,
      refresh,
      disconnectSelected,
      refreshTick,
    ],
  );

  return (
    <ExecutiveDataContext.Provider value={value}>
      {children}
    </ExecutiveDataContext.Provider>
  );
}
