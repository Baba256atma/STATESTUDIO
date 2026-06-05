type DiagnosticRuntimeConfig = {
  enabled?: boolean;
  scopes?: Record<string, boolean>;
};

type DiagnosticHelper = {
  enable: () => DiagnosticStatus;
  disable: () => DiagnosticStatus;
  enableScope: (scope: string) => DiagnosticStatus;
  disableScope: (scope: string) => DiagnosticStatus;
  status: () => DiagnosticStatus;
};

export type DiagnosticStatus = {
  enabled: boolean;
  scopes: Record<string, boolean>;
};

type DiagnosticLogLevel = "debug" | "info" | "warn" | "error";

const GLOBAL_KEY = "__NEXORA_DIAGNOSTICS__";
const HELPER_KEY = "nexoraDiagnostics";

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function readEnvFlag(value: string | undefined): boolean | null {
  if (value == null) return null;
  const normalized = value.trim().toLowerCase();
  if (["0", "false", "off", "no", "disabled"].includes(normalized)) return false;
  if (["1", "true", "on", "yes", "enabled"].includes(normalized)) return true;
  return null;
}

function readRuntimeConfig(): DiagnosticRuntimeConfig {
  return ((globalThis as unknown as Record<string, unknown>)[GLOBAL_KEY] ?? {}) as DiagnosticRuntimeConfig;
}

function writeRuntimeConfig(config: DiagnosticRuntimeConfig): void {
  (globalThis as unknown as Record<string, unknown>)[GLOBAL_KEY] = config;
}

function readEnvScopes(): Record<string, boolean> {
  const raw = process.env.NEXT_PUBLIC_NEXORA_DIAGNOSTIC_SCOPES ?? "";
  const scopes: Record<string, boolean> = {};
  for (const token of raw.split(",")) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("-")) {
      scopes[trimmed.slice(1)] = false;
    } else {
      scopes[trimmed] = true;
    }
  }
  return scopes;
}

export function getDiagnosticStatus(): DiagnosticStatus {
  const runtime = readRuntimeConfig();
  return {
    enabled: isDiagnosticsGloballyEnabled(),
    scopes: {
      ...readEnvScopes(),
      ...(runtime.scopes ?? {}),
    },
  };
}

export function isDiagnosticsGloballyEnabled(): boolean {
  if (!isDev()) return false;
  const runtime = readRuntimeConfig();
  if (typeof runtime.enabled === "boolean") return runtime.enabled;
  return readEnvFlag(process.env.NEXT_PUBLIC_NEXORA_DIAGNOSTICS) ?? true;
}

export function isDiagnosticEnabled(scope?: string): boolean {
  installDiagnosticConsoleHelper();
  if (!isDiagnosticsGloballyEnabled()) return false;
  if (!scope) return true;
  const status = getDiagnosticStatus();
  const scopedValue = status.scopes[scope];
  if (scope === "panel" || scope === "scene" || scope === "acceptanceGate") return scopedValue ?? false;
  return scopedValue ?? true;
}

export const isNexoraDiagnosticsEnabled = isDiagnosticEnabled;

export function installDiagnosticConsoleHelper(): void {
  if (!isDev()) return;
  const globalRecord = globalThis as unknown as Record<string, unknown>;
  if (globalRecord[HELPER_KEY]) return;
  const helper: DiagnosticHelper = {
    enable: () => {
      writeRuntimeConfig({ ...readRuntimeConfig(), enabled: true });
      return getDiagnosticStatus();
    },
    disable: () => {
      writeRuntimeConfig({ ...readRuntimeConfig(), enabled: false });
      return getDiagnosticStatus();
    },
    enableScope: (scope: string) => {
      const runtime = readRuntimeConfig();
      writeRuntimeConfig({
        ...runtime,
        scopes: { ...(runtime.scopes ?? {}), [scope]: true },
      });
      return getDiagnosticStatus();
    },
    disableScope: (scope: string) => {
      const runtime = readRuntimeConfig();
      writeRuntimeConfig({
        ...runtime,
        scopes: { ...(runtime.scopes ?? {}), [scope]: false },
      });
      return getDiagnosticStatus();
    },
    status: () => getDiagnosticStatus(),
  };
  globalRecord[HELPER_KEY] = helper;
}

export function devDiagnosticLog(
  scope: string,
  label: string,
  payload?: unknown,
  level: DiagnosticLogLevel = "debug"
): void {
  if (!isDiagnosticEnabled(scope)) return;
  installDiagnosticConsoleHelper();
  globalThis.console?.[level]?.(label, payload);
}

export function resetDiagnosticSwitchForTests(): void {
  const globalRecord = globalThis as unknown as Record<string, unknown>;
  delete globalRecord[GLOBAL_KEY];
  delete globalRecord[HELPER_KEY];
}
