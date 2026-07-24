/** WS-2:8 — Frozen compatibility declarations. */
import { ExecutiveHomeWorkspaceCertification } from "./executiveHomeWorkspaceCertification.ts";
export const ExecutiveHomeWorkspaceFreezeCompatibility = Object.freeze(
  ExecutiveHomeWorkspaceCertification.platform.compatibility.map((source) => Object.freeze({
    id: source.id.replace("WS-2:5", "WS-2:8"),
    name: source.name, source, freezeState: "Frozen",
    metadataOnly: true, immutable: true,
  })),
);

