import type { NexoraDomainId } from "../domain/domainTypes.ts";

export type ExternalSignalSourceType =
  | "api"
  | "stream"
  | "csv"
  | "webhook"
  | "manual";

export type ExternalOperationalSignal = {
  id: string;
  sourceConnectorId: string;
  signalType: string;
  severity?: number;
  objectHints?: string[];
  domainHints?: string[];
  payload?: unknown;
  timestamp: number;
};

export type NormalizedExternalOperationalSignal = ExternalOperationalSignal & {
  severity: number;
  objectHints: string[];
  domainHints: NexoraDomainId[];
  ingestionSignature: string;
};

export type ExternalSignalValidationResult = {
  valid: boolean;
  signal?: NormalizedExternalOperationalSignal;
  warnings: string[];
};
