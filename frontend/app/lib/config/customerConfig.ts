import coreKpis from "../../config/core/kpis.core.json";
import coreLoops from "../../config/core/loops.core.json";
import demoKpis from "../../config/customers/demo/kpis.json";
import demoLoops from "../../config/customers/demo/loops.json";
import { validateCustomerConfig } from "./validateCustomerConfig";
import { hasFeature } from "./planConfig";

export type KpiDirection = "up" | "down";

export type KpiDefJson = {
  id: string;
  label: string;
  unit: string;
  target: number;
  direction: KpiDirection;
  description: string;
  thresholds?: { warnBelow?: number; warnAbove?: number; criticalBelow?: number; criticalAbove?: number };
  drivers?: string[];
  driver_weights?: Record<string, number>;
};

export type LoopTemplateJson = {
  type: string;
  label: string;
  category: string;
  default_intensity: number;
  impact?: Record<string, number>;
};

type KpiConfigJson = { company_id?: string; kpis?: KpiDefJson[] };
type LoopConfigJson = { company_id?: string; loop_templates?: LoopTemplateJson[] };

const EMPTY_KPIS: KpiConfigJson = { kpis: [] };
const EMPTY_LOOPS: LoopConfigJson = { loop_templates: [] };

export function getCustomerKey(): string {
  return (process.env.NEXT_PUBLIC_CUSTOMER || "demo").toLowerCase();
}

function pickCustomerOverlay(): { kpis: KpiConfigJson; loops: LoopConfigJson } {
  const key = getCustomerKey();
  const allowKpiCustom = hasFeature("kpi_custom");
  const allowLoopCustom = hasFeature("loops_custom");
  if (key === "demo") {
    return {
      kpis: allowKpiCustom ? (demoKpis as unknown as KpiConfigJson) : EMPTY_KPIS,
      loops: allowLoopCustom ? (demoLoops as unknown as LoopConfigJson) : EMPTY_LOOPS,
    };
  }
  return { kpis: EMPTY_KPIS, loops: EMPTY_LOOPS };
}

function mergeByKey<T extends { [K in K2]: string }, K2 extends keyof T>(
  core: T[] = [],
  overlay: T[] = [],
  key: K2
): T[] {
  const map = new Map<string, T>();
  core.forEach((item) => {
    map.set(String(item[key]), item);
  });
  overlay.forEach((item) => {
    map.set(String(item[key]), item);
  });
  return Array.from(map.values());
}

export function getActiveKpiDefs(): KpiDefJson[] {
  const overlay = pickCustomerOverlay();
  const coreDefs = (coreKpis as unknown as KpiConfigJson).kpis ?? [];
  const overlayDefs = overlay.kpis.kpis ?? [];
  const mergedKpis = mergeByKey(coreDefs, overlayDefs, "id");
  const mergedLoops = mergeByKey(
    (coreLoops as unknown as LoopConfigJson).loop_templates ?? [],
    overlay.loops.loop_templates ?? [],
    "type"
  );
  const v = validateCustomerConfig({ kpis: mergedKpis, loops: mergedLoops });
  if (process.env.NODE_ENV !== "production" && v.issues.length) {
    console.groupCollapsed(`[NEXORA CONFIG] Validation issues (${getCustomerKey()})`);
    for (const issue of v.issues) {
      const fn = issue.level === "error" ? console.error : console.warn;
      fn(`${issue.level.toUpperCase()} ${issue.path}: ${issue.message}`);
    }
    console.groupEnd();
  }
  return v.kpis;
}

export function getActiveLoopTemplates(): LoopTemplateJson[] {
  const overlay = pickCustomerOverlay();
  const coreDefs = (coreLoops as unknown as LoopConfigJson).loop_templates ?? [];
  const overlayDefs = overlay.loops.loop_templates ?? [];
  const mergedKpis = mergeByKey(
    (coreKpis as unknown as KpiConfigJson).kpis ?? [],
    overlay.kpis.kpis ?? [],
    "id"
  );
  const mergedLoops = mergeByKey(coreDefs, overlayDefs, "type");
  const v = validateCustomerConfig({ kpis: mergedKpis, loops: mergedLoops });
  if (process.env.NODE_ENV !== "production" && v.issues.length) {
    console.groupCollapsed(`[NEXORA CONFIG] Validation issues (${getCustomerKey()})`);
    for (const issue of v.issues) {
      const fn = issue.level === "error" ? console.error : console.warn;
      fn(`${issue.level.toUpperCase()} ${issue.path}: ${issue.message}`);
    }
    console.groupEnd();
  }
  return v.loops;
}

export function getActiveCompanyId(): string {
  const overlay = pickCustomerOverlay();
  return (
    overlay.kpis.company_id ||
    overlay.loops.company_id ||
    (coreKpis as unknown as KpiConfigJson).company_id ||
    "core"
  );
}
