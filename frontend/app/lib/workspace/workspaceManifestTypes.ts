/** WS-1:5 — Immutable Manifest declaration shape. */
export interface WorkspaceManifestDeclaration {
  readonly id: string; readonly name: string; readonly description: string;
  readonly source: unknown; readonly status: "Satisfied" | "Compatible" | "Controlled";
  readonly metadataOnly: true; readonly immutable: true;
}

