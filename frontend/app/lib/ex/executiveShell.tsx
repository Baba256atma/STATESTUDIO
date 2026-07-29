/**
 * EX-1:1 — Executive Shell.
 *
 * Root visual container for the Executive Experience.
 * Stage is active; Timeline and Journal remain placeholders.
 * Runtime Provider exposes the Public Index as read-only context.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  executiveContextRuntimePublicIndex,
} from "../rtc/executiveContextRuntimePublicIndex.ts";
import { ExecutiveStage } from "./executiveStageFoundation.tsx";
import {
  ExecutiveShellPlaceholders,
  type ExecutiveStageVisualState,
} from "./executiveStageTypes.ts";

type RuntimePublicIndex = typeof executiveContextRuntimePublicIndex;

const ExecutiveRuntimeContext = createContext<RuntimePublicIndex | null>(null);

/** Read-only Runtime Public Index access for Stage consumers. */
export function useExecutiveRuntimePublicIndex(): RuntimePublicIndex {
  const value = useContext(ExecutiveRuntimeContext);
  if (!value) {
    throw new Error(
      "useExecutiveRuntimePublicIndex requires ExecutiveRuntimeProvider.",
    );
  }
  return value;
}

/**
 * Runtime Provider — republishes the Public Index without mutation.
 */
export function ExecutiveRuntimeProvider({
  children,
  runtime = executiveContextRuntimePublicIndex,
}: {
  readonly children: ReactNode;
  readonly runtime?: RuntimePublicIndex;
}) {
  return (
    <ExecutiveRuntimeContext.Provider value={runtime}>
      {children}
    </ExecutiveRuntimeContext.Provider>
  );
}

function PlaceholderRegion({
  name,
  regionId,
}: {
  readonly name: string;
  readonly regionId: string;
}) {
  return (
    <aside
      data-testid={regionId}
      data-placeholder="true"
      aria-label={`${name} placeholder`}
      style={{
        minHeight: "4.5rem",
        padding: "1.25rem 1.5rem",
        borderTop:
          "1px solid color-mix(in oklab, var(--ex-stage-muted) 28%, transparent)",
        color: "var(--ex-stage-muted)",
        fontFamily: "var(--ex-stage-font)",
        fontSize: "0.85rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {name}
      <span style={{ marginLeft: "0.75rem", opacity: 0.7 }}>— reserved</span>
    </aside>
  );
}

export interface ExecutiveShellProps {
  readonly visualState?: ExecutiveStageVisualState;
  readonly children?: ReactNode;
  readonly "data-testid"?: string;
}

/**
 * Executive Shell — root visual container.
 */
export function ExecutiveShell({
  visualState = "Ready",
  children,
  "data-testid": testId = "executive-shell",
}: ExecutiveShellProps) {
  return (
    <ExecutiveRuntimeProvider>
      <div
        data-testid={testId}
        data-phase="EX-1:1"
        data-shell="ExecutiveShell"
        style={{
          ["--ex-stage-deep" as string]: "#10161c",
          ["--ex-stage-mid" as string]: "#182229",
          ["--ex-stage-base" as string]: "#1e2a30",
          ["--ex-stage-glow" as string]: "rgba(120, 156, 148, 0.16)",
          ["--ex-stage-ink" as string]: "#e7efe9",
          ["--ex-stage-muted" as string]: "#9aada5",
          ["--ex-stage-accent" as string]: "#7f9f8f",
          ["--ex-stage-font" as string]:
            "\"Iowan Old Style\", \"Palatino Linotype\", Palatino, \"Book Antiqua\", Georgia, serif",
          minHeight: "100%",
          width: "100%",
          display: "grid",
          gridTemplateRows: "1fr auto auto",
          background: "var(--ex-stage-base)",
          color: "var(--ex-stage-ink)",
          fontFamily: "var(--ex-stage-font)",
        }}
      >
        <main aria-label="Executive Experience">
          {children ?? <ExecutiveStage visualState={visualState} />}
        </main>
        <PlaceholderRegion
          name={ExecutiveShellPlaceholders[0].name}
          regionId="executive-timeline-placeholder"
        />
        <PlaceholderRegion
          name={ExecutiveShellPlaceholders[1].name}
          regionId="executive-journal-placeholder"
        />
      </div>
    </ExecutiveRuntimeProvider>
  );
}

export const ExecutiveShellMeta = Object.freeze({
  shellId: "EX-1:1/ExecutiveShell",
  activeRegion: "Executive Stage" as const,
  placeholders: ExecutiveShellPlaceholders,
  runtimeProvider: true as const,
  runtimeDependency: "executiveContextRuntimePublicIndex" as const,
  timelineActive: false as const,
  journalActive: false as const,
  immutable: true as const,
} as const);
