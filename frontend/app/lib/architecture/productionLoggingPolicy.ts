import { stableSignature } from "../intelligence/shared/dedupe.ts";

export type ProductionLogChannel =
  | "dev_diagnostic"
  | "production_safe_telemetry"
  | "executive_ux"
  | "orchestration_trace";

export type ProductionLoggingPolicy = {
  channel: ProductionLogChannel;
  allowedInProduction: boolean;
  requiresDedupe: boolean;
  maxPayloadKeys: number;
  consoleMethod: "debug" | "log" | "warn" | "error" | "none";
};

export const PRODUCTION_LOGGING_POLICIES: Record<ProductionLogChannel, ProductionLoggingPolicy> = {
  dev_diagnostic: {
    channel: "dev_diagnostic",
    allowedInProduction: false,
    requiresDedupe: true,
    maxPayloadKeys: 8,
    consoleMethod: "debug",
  },
  production_safe_telemetry: {
    channel: "production_safe_telemetry",
    allowedInProduction: true,
    requiresDedupe: true,
    maxPayloadKeys: 6,
    consoleMethod: "log",
  },
  executive_ux: {
    channel: "executive_ux",
    allowedInProduction: false,
    requiresDedupe: true,
    maxPayloadKeys: 6,
    consoleMethod: "debug",
  },
  orchestration_trace: {
    channel: "orchestration_trace",
    allowedInProduction: false,
    requiresDedupe: true,
    maxPayloadKeys: 10,
    consoleMethod: "debug",
  },
};

export function getProductionLoggingPolicy(channel: ProductionLogChannel): ProductionLoggingPolicy {
  return { ...PRODUCTION_LOGGING_POLICIES[channel] };
}

export function buildProductionLogSignature(params: {
  eventName: string;
  channel: ProductionLogChannel;
  payload?: unknown;
}): string {
  return stableSignature({
    eventName: params.eventName,
    channel: params.channel,
    payload: params.payload ?? null,
  });
}

export function shouldEmitProductionLog(params: {
  channel: ProductionLogChannel;
  isProduction?: boolean;
  previousSignature?: string | null;
  nextSignature: string;
}): boolean {
  const policy = getProductionLoggingPolicy(params.channel);
  if (params.isProduction === true && !policy.allowedInProduction) return false;
  if (policy.requiresDedupe && params.previousSignature === params.nextSignature) return false;
  return policy.consoleMethod !== "none";
}
