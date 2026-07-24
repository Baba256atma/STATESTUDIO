/** WS-1:6 — Immutable Platform declaration shape. */
export interface WorkspacePlatformDeclaration {
  readonly id: string; readonly name: string; readonly description: string;
  readonly source: unknown; readonly metadataOnly: true; readonly immutable: true;
}

