"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { useRuntimeData } from "../runtime";
import type {
  DataCatalogSection,
  DataFilter,
  DataHistoryEvent,
  DataJournalEntry,
  DataSourceCategory,
  DataTimelinePack,
  ExecutiveDataMapping,
  ExecutiveDataSource,
  MappingStatus,
  WizardStep,
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
 * ExecutiveDataProvider — Runtime-backed data catalog / mapping state.
 */
export function ExecutiveDataProvider({ children }: Props) {
  const runtime = useRuntimeData();
  const value = useMemo(
    () => ({
      experienceActive: runtime.experienceActive,
      setExperienceActive: runtime.setExperienceActive,
      section: runtime.section,
      setSection: runtime.setSection,
      sources: runtime.sources,
      mappings: runtime.mappings,
      history: runtime.history,
      selectedSourceId: runtime.selectedSourceId,
      selectedSource: runtime.selectedSource,
      filter: runtime.filter,
      query: runtime.query,
      wizardStep: runtime.wizardStep,
      wizardCategory: runtime.wizardCategory,
      wizardName: runtime.wizardName,
      journalEntries: runtime.journalEntries,
      dataPacks: runtime.dataPacks,
      setSelectedSource: runtime.setSelectedSource,
      setFilter: runtime.setFilter,
      setQuery: runtime.setQuery,
      setWizardStep: runtime.setWizardStep,
      setWizardCategory: runtime.setWizardCategory,
      setWizardName: runtime.setWizardName,
      resetWizard: runtime.resetWizard,
      finishWizard: runtime.finishWizard,
      updateMappingStatus: runtime.updateMappingStatus,
      assignMappingObject: runtime.assignMappingObject,
      refresh: runtime.refresh,
      disconnectSelected: runtime.disconnectSelected,
    }),
    [runtime],
  );

  return (
    <ExecutiveDataContext.Provider value={value}>
      {children}
    </ExecutiveDataContext.Provider>
  );
}
