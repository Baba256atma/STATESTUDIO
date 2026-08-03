"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createAuditConsole,
  type AuditEvent,
  type ExecutiveAuditConsole,
} from "./ExecutiveAuditConsole";
import {
  runExecutiveBetaValidator,
  type BetaValidationReport,
} from "./ExecutiveBetaValidator";
import type { DemoDataset } from "./ExecutiveDemoDatasets";
import {
  createDemoManager,
  type ExecutiveDemoManager,
} from "./ExecutiveDemoManager";
import {
  mergeFeatureFlags,
  type ExecutiveFeatureFlagId,
  type ExecutiveFeatureFlags,
} from "./ExecutiveFeatureFlags";
import {
  BETA_READINESS_CHECKLIST,
  type ReadinessItem,
  readinessSummary,
} from "./ExecutiveReadinessChecklist";
import {
  createRecoveryCenter,
  type ExecutiveRecoveryCenter,
  type RecoveryRecord,
} from "./ExecutiveRecoveryCenter";
import {
  OFFICIAL_BETA_SCENARIOS,
  type BetaScenario,
} from "./ExecutiveBetaScenarios";
import type { ExecutiveRecoveryAction } from "./ExecutiveBetaErrors";
import type { DemoDatasetId } from "./ExecutiveDemoDatasets";

export type ExecutiveBetaContextValue = {
  readonly flags: ExecutiveFeatureFlags;
  readonly setFlag: (id: ExecutiveFeatureFlagId, value: boolean) => void;
  readonly demoMode: boolean;
  readonly developerMode: boolean;
  readonly currentDemo: DemoDataset | null;
  readonly demoAdvisory: readonly string[];
  readonly scenarios: readonly BetaScenario[];
  readonly checklist: readonly ReadinessItem[];
  readonly readiness: ReturnType<typeof readinessSummary>;
  readonly validation: BetaValidationReport | null;
  readonly auditEvents: readonly AuditEvent[];
  readonly recoveryRecords: readonly RecoveryRecord[];
  readonly runValidation: () => BetaValidationReport;
  readonly resetDemo: () => void;
  readonly loadManufacturingDemo: () => void;
  readonly loadPmoDemo: () => void;
  readonly loadRetailDemo: () => void;
  readonly loadDemo: (id: DemoDatasetId) => void;
  readonly seedAuditTrail: () => void;
  readonly reportRecovery: (
    code: Parameters<ExecutiveRecoveryCenter["report"]>[0],
    detail?: string,
  ) => void;
  readonly actRecovery: (id: string, action: ExecutiveRecoveryAction) => void;
};

export const ExecutiveBetaContext =
  createContext<ExecutiveBetaContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
  readonly initialFlags?: Partial<ExecutiveFeatureFlags>;
};

export function ExecutiveBetaProvider({ children, initialFlags }: Props) {
  const demoRef = useRef<ExecutiveDemoManager | null>(null);
  if (!demoRef.current) demoRef.current = createDemoManager();
  const auditRef = useRef<ExecutiveAuditConsole | null>(null);
  if (!auditRef.current) auditRef.current = createAuditConsole();
  const recoveryRef = useRef<ExecutiveRecoveryCenter | null>(null);
  if (!recoveryRef.current) recoveryRef.current = createRecoveryCenter();

  const [flags, setFlags] = useState<ExecutiveFeatureFlags>(() =>
    mergeFeatureFlags(initialFlags),
  );
  const [currentDemo, setCurrentDemo] = useState<DemoDataset | null>(() =>
    demoRef.current!.current(),
  );
  const [demoAdvisory, setDemoAdvisory] = useState<readonly string[]>([]);
  const [validation, setValidation] = useState<BetaValidationReport | null>(
    null,
  );
  const [auditEvents, setAuditEvents] = useState<readonly AuditEvent[]>([]);
  const [recoveryRecords, setRecoveryRecords] = useState<
    readonly RecoveryRecord[]
  >([]);

  const setFlag = useCallback((id: ExecutiveFeatureFlagId, value: boolean) => {
    setFlags((prev) => mergeFeatureFlags({ ...prev, [id]: value }));
  }, []);

  const applyDemo = useCallback((result: ReturnType<ExecutiveDemoManager["loadDemo"]>) => {
    setCurrentDemo(result.dataset);
    setDemoAdvisory(result.advisory);
  }, []);

  const runValidation = useCallback(() => {
    const report = runExecutiveBetaValidator();
    setValidation(report);
    return report;
  }, []);

  const value = useMemo<ExecutiveBetaContextValue>(
    () => ({
      flags,
      setFlag,
      demoMode: flags.EnableDemoMode,
      developerMode: flags.EnableDeveloperMode,
      currentDemo,
      demoAdvisory,
      scenarios: OFFICIAL_BETA_SCENARIOS,
      checklist: BETA_READINESS_CHECKLIST,
      readiness: readinessSummary(BETA_READINESS_CHECKLIST),
      validation,
      auditEvents,
      recoveryRecords,
      runValidation,
      resetDemo: () => applyDemo(demoRef.current!.resetDemo()),
      loadManufacturingDemo: () =>
        applyDemo(demoRef.current!.loadManufacturingDemo()),
      loadPmoDemo: () => applyDemo(demoRef.current!.loadPmoDemo()),
      loadRetailDemo: () => applyDemo(demoRef.current!.loadRetailDemo()),
      loadDemo: (id) => applyDemo(demoRef.current!.loadDemo(id)),
      seedAuditTrail: () => {
        const events = auditRef.current!.seedMinimumTrail();
        setAuditEvents([...events]);
      },
      reportRecovery: (code, detail) => {
        recoveryRef.current!.report(code, detail);
        setRecoveryRecords([...recoveryRef.current!.list()]);
      },
      actRecovery: (id, action) => {
        recoveryRef.current!.act(id, action);
        setRecoveryRecords([...recoveryRef.current!.list()]);
      },
    }),
    [
      flags,
      setFlag,
      currentDemo,
      demoAdvisory,
      validation,
      auditEvents,
      recoveryRecords,
      runValidation,
      applyDemo,
    ],
  );

  return (
    <ExecutiveBetaContext.Provider value={value}>
      {children}
    </ExecutiveBetaContext.Provider>
  );
}
