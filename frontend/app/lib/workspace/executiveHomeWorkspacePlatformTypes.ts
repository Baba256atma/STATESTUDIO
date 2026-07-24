/** WS-2:6 — Immutable Platform declaration shape. */
export interface ExecutiveHomePlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly status: "Guaranteed" | "Compatible";
  readonly metadataOnly: true;
  readonly immutable: true;
}

