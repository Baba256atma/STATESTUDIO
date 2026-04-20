/**
 * B.25 — Sequential pilot runs: ingestion → fragility scan (no scene dispatch).
 */

import { runFragilityScan } from "../api/fragilityScanner";
import { runMultiSourceIngestion, runTextIngestion, type ConnectorRunInputOut } from "../api/ingestionApi";
import type { FragilityScanResponse } from "../../types/fragilityScanner";
import { multiSourceIngestionToTextIngestionResponse } from "../../screens/homeScreenIngestionSceneBridge";
import { NEXORA_PILOT_SCENARIOS, type NexoraPilotScenario } from "./nexoraPilotScenarios";
import {
  normalizePilotFragilityLevel,
  validatePilotScenario,
  type NexoraPilotPipelineSnapshot,
  type NexoraPilotResult,
} from "./nexoraPilotValidator";

export type RunPilotValidationOptions = {
  scenarios?: readonly NexoraPilotScenario[];
  workspaceId?: string | null;
  userId?: string | null;
};

export type NexoraPilotValidationSummary = {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  results: NexoraPilotResult[];
};

function pilotDomainToIngestionDomain(d: NexoraPilotScenario["domain"]): string | null {
  switch (d) {
    case "retail":
      return "retail";
    case "supply_chain":
      return "supply_chain";
    case "finance":
      return "finance";
    case "mixed":
      return "business";
    default:
      return "business";
  }
}

function snapshotFromScan(signalsCount: number, scan: FragilityScanResponse | null): NexoraPilotPipelineSnapshot {
  if (!scan?.ok) {
    return {
      signalsCount: Math.max(0, signalsCount),
      fragilityLevel: null,
      driverLabels: [],
    };
  }
  const driverLabels = (scan.drivers ?? []).map((x) => String(x.label ?? "").trim()).filter(Boolean);
  return {
    signalsCount: Math.max(0, signalsCount),
    fragilityLevel: normalizePilotFragilityLevel(scan.fragility_level),
    driverLabels,
  };
}

async function executePilotScenarioOnce(
  scenario: NexoraPilotScenario,
  opts: RunPilotValidationOptions
): Promise<NexoraPilotPipelineSnapshot> {
  const domain = pilotDomainToIngestionDomain(scenario.domain);

  if (scenario.input.type === "text") {
    const text = String(scenario.input.payload ?? "").trim();
    const textRes = await runTextIngestion({
      text,
      title: "pilot",
      source_label: "nexora_pilot",
      domain,
    });
    const sigCount = textRes.bundle?.signals?.length ?? 0;
    if (!textRes.ok) {
      return { signalsCount: sigCount, fragilityLevel: null, driverLabels: [] };
    }
    const scan = await runFragilityScan({
      signal_bundle: textRes.bundle,
      metadata: { domain: domain ?? undefined, ingestion_source_label: "nexora_pilot" },
      workspace_id: opts.workspaceId ?? undefined,
      user_id: opts.userId ?? undefined,
      mode: "business",
      source_type: "text",
    });
    return snapshotFromScan(sigCount, scan);
  }

  const sources = scenario.input.payload as ConnectorRunInputOut[];
  const multiRes = await runMultiSourceIngestion({ sources, domain });
  const mergedCount = multiRes.bundle?.signals?.length ?? 0;
  if (!multiRes.ok) {
    return { signalsCount: mergedCount, fragilityLevel: null, driverLabels: [] };
  }
  const synthetic = multiSourceIngestionToTextIngestionResponse(multiRes, domain);
  const scan = await runFragilityScan({
    signal_bundle: synthetic.bundle,
    metadata: { domain: domain ?? undefined, ingestion_source_label: "nexora_pilot_multi" },
    workspace_id: opts.workspaceId ?? undefined,
    user_id: opts.userId ?? undefined,
    mode: "business",
    source_type: "text",
  });
  return snapshotFromScan(mergedCount, scan);
}

/**
 * Runs scenarios sequentially against live ingestion + fragility APIs.
 */
export async function runPilotValidation(options?: RunPilotValidationOptions): Promise<NexoraPilotValidationSummary> {
  const list = options?.scenarios ?? NEXORA_PILOT_SCENARIOS;
  const results: NexoraPilotResult[] = [];

  for (const scenario of list) {
    try {
      const snap = await executePilotScenarioOnce(scenario, options ?? {});
      results.push(validatePilotScenario(scenario, snap));
    } catch {
      results.push({
        scenarioId: scenario.id,
        passed: false,
        checks: { signalsOk: false, fragilityOk: false },
      });
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const failed = total - passed;
  const passRate = total > 0 ? passed / total : 0;

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[Nexora][B25] pilot_validation_run", {
      total,
      passed,
      failed,
      passRate: Math.round(passRate * 100),
    });
  }

  return { total, passed, failed, passRate, results };
}
