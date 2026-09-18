# NPA-T NMI:FINAL — Management Map Audit

Certified on live host composition:

- Canonical IDs preserved (`ctx-problem-capacity` present).
- Missing sections remain missing/empty (Operations count 0 when no PROCESS nodes).
- Disconnected nodes remain valid (NMI:3 gap detection).
- UNKNOWN remains UNKNOWN (`hosted.model.contextKind === "UNKNOWN"`).
- BUSINESS / PROJECT / HYBRID composition remains intact where supplied (NMI:2 focused suite).
- No PROCESS inference from generic Stage objects.
- No invented relationships (`NMI_MANAGEMENT_RELATIONS` only; unsupported edges not added).

Overlay: `data-nmi-live="8"` and `data-nmi-map-node` use the live map, not a test-only graph.
