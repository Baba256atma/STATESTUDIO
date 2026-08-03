"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useExecutiveMetadata } from "../metadata";
import { useExecutiveRuntimeStoreApi } from "../runtime";
import type {
  ConnectorConnectInput,
  ConnectorFieldMapping,
  ConnectorFilter,
  ConnectorJournalEntry,
} from "./ExecutiveConnectorContracts";
import {
  createConnectorPlatform,
  type ExecutiveConnectorPlatform,
  type ManagedConnectorStatus,
} from "./ExecutiveConnectorPlatform";
import type { ExecutiveConnectionSession } from "./ExecutiveConnectionSession";
import { publishConnectorInspectorSnapshot } from "./connectorInspectorBridge";

export type ExecutiveConnectorContextValue = {
  readonly platform: ExecutiveConnectorPlatform;
  readonly statuses: readonly ManagedConnectorStatus[];
  readonly visibleStatuses: readonly ManagedConnectorStatus[];
  readonly session: ExecutiveConnectionSession | null;
  readonly journalEntries: readonly ConnectorJournalEntry[];
  readonly filter: ConnectorFilter;
  readonly setFilter: (filter: ConnectorFilter) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly selectedConnectorId: string | null;
  readonly setSelectedConnectorId: (id: string | null) => void;
  readonly wizardOpen: boolean;
  readonly setWizardOpen: (open: boolean) => void;
  readonly busy: boolean;
  readonly error: string | null;
  readonly startCsvSession: () => void;
  readonly connectSampleCsv: () => Promise<void>;
  readonly connectCsvText: (label: string, csvText: string) => Promise<void>;
  readonly runPreview: () => Promise<void>;
  readonly applyMappings: () => void;
  readonly updateMapping: (
    columnName: string,
    patch: Partial<ConnectorFieldMapping>,
  ) => void;
  readonly approveMappings: () => void;
  readonly publishApproved: () => Promise<void>;
  readonly advisorFacts: readonly string[];
};

export const ExecutiveConnectorContext =
  createContext<ExecutiveConnectorContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

export function ExecutiveConnectorProvider({ children }: Props) {
  const store = useExecutiveRuntimeStoreApi();
  const { catalog } = useExecutiveMetadata();
  const platformRef = useRef<ExecutiveConnectorPlatform | null>(null);
  if (!platformRef.current) {
    platformRef.current = createConnectorPlatform();
  }
  const platform = platformRef.current;

  const [statuses, setStatuses] = useState<ManagedConnectorStatus[]>(() =>
    platform.manager.listDescriptors().map((descriptor) => ({
      descriptor,
      health: {
        state: descriptor.shell ? ("Disconnected" as const) : ("Healthy" as const),
        detail: descriptor.shell
          ? "Connector shell — awaiting implementation."
          : "Ready for intake.",
        checkedAt: Date.now(),
      },
      lastSync: null,
      rows: null,
      mappedObjects: [],
      connectionStatus: descriptor.shell
        ? ("Shell" as const)
        : ("Disconnected" as const),
    })),
  );
  const [session, setSession] = useState<ExecutiveConnectionSession | null>(
    null,
  );
  const [journalEntries, setJournalEntries] = useState<
    ConnectorJournalEntry[]
  >([]);
  const [filter, setFilter] = useState<ConnectorFilter>("All");
  const [query, setQuery] = useState("");
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(
    "connector-csv",
  );
  const [wizardOpen, setWizardOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisorFacts, setAdvisorFacts] = useState<readonly string[]>([]);

  const refresh = useCallback(async () => {
    const next = await platform.refreshStatuses();
    setStatuses(next);
  }, [platform]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    publishConnectorInspectorSnapshot({
      connectorStatus:
        statuses.find((s) => s.descriptor.id === selectedConnectorId)
          ?.connectionStatus ?? "Disconnected",
      sessionLifecycle: session?.lifecycle ?? null,
      publishedSources: journalEntries.filter((j) => j.published).length,
      lastPublish: journalEntries[0]?.timestamp ?? null,
      validationResult: session?.validation
        ? session.validation.ok
          ? "OK"
          : session.validation.messages[0]?.message ?? "Failed"
        : null,
    });
  }, [statuses, selectedConnectorId, session, journalEntries]);

  const visibleStatuses = useMemo(
    () => platform.filterStatuses(statuses, filter, query),
    [platform, statuses, filter, query],
  );

  const startCsvSession = useCallback(() => {
    const next = platform.startSession("connector-csv");
    setSession(next);
    setSelectedConnectorId("connector-csv");
    setWizardOpen(true);
    setError(null);
    setAdvisorFacts([
      "CSV connector session started",
      "Awaiting schema discovery",
    ]);
  }, [platform]);

  const connectCsvText = useCallback(
    async (label: string, csvText: string) => {
      setBusy(true);
      setError(null);
      try {
        if (!platform.getSession()) platform.startSession("connector-csv");
        const input: ConnectorConnectInput = { label, payload: csvText };
        let next = await platform.connect(input);
        next = await platform.validate();
        next = await platform.discoverAndPreview();
        next = platform.applySuggestedMappings(catalog);
        setSession(next);
        setAdvisorFacts([
          `New data source connected · ${next.sourceLabel}`,
          `Schema discovered · ${next.schema?.columns.length ?? 0} fields`,
          `${next.mappings.filter((m) => m.status === "Suggested" || m.status === "Mapped").length} fields mapped`,
          `${Math.max(0, (next.schema?.columns.length ?? 0) - next.mappings.filter((m) => m.objectId).length)} new executive objects suggested`,
        ]);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connector failed");
      } finally {
        setBusy(false);
      }
    },
    [platform, catalog, refresh],
  );

  const connectSampleCsv = useCallback(async () => {
    const { SAMPLE_INVENTORY_CSV } = await import("./connectors/CsvConnector");
    await connectCsvText("inventory.csv", SAMPLE_INVENTORY_CSV);
  }, [connectCsvText]);

  const runPreview = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const next = await platform.discoverAndPreview();
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  }, [platform]);

  const applyMappings = useCallback(() => {
    try {
      const next = platform.applySuggestedMappings(catalog);
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mapping failed");
    }
  }, [platform, catalog]);

  const updateMapping = useCallback(
    (columnName: string, patch: Partial<ConnectorFieldMapping>) => {
      const next = platform.updateMapping(columnName, patch);
      setSession(next);
    },
    [platform],
  );

  const approveMappings = useCallback(() => {
    try {
      const next = platform.approve("Executive Manager");
      setSession(next);
      setAdvisorFacts((prev) => [
        ...prev,
        "Manager approved connector mappings — ready to publish",
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    }
  }, [platform]);

  const publishApproved = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const { session: next, journal } = await platform.publish(store);
      setSession(next);
      setJournalEntries([...platform.getJournal()]);
      setAdvisorFacts([
        `Published · ${journal.sourceName}`,
        journal.schemaSummary,
        journal.mappingsSummary,
        `Objects · ${journal.objectsSummary}`,
      ]);
      setWizardOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }, [platform, store, refresh]);

  const value = useMemo(
    () => ({
      platform,
      statuses,
      visibleStatuses,
      session,
      journalEntries,
      filter,
      setFilter,
      query,
      setQuery,
      selectedConnectorId,
      setSelectedConnectorId,
      wizardOpen,
      setWizardOpen,
      busy,
      error,
      startCsvSession,
      connectSampleCsv,
      connectCsvText,
      runPreview,
      applyMappings,
      updateMapping,
      approveMappings,
      publishApproved,
      advisorFacts,
    }),
    [
      platform,
      statuses,
      visibleStatuses,
      session,
      journalEntries,
      filter,
      query,
      selectedConnectorId,
      wizardOpen,
      busy,
      error,
      startCsvSession,
      connectSampleCsv,
      connectCsvText,
      runPreview,
      applyMappings,
      updateMapping,
      approveMappings,
      publishApproved,
      advisorFacts,
    ],
  );

  return (
    <ExecutiveConnectorContext.Provider value={value}>
      {children}
    </ExecutiveConnectorContext.Provider>
  );
}
