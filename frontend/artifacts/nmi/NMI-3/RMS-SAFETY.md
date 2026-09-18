# NPA-T NMI:3 — RMS safety

Required flow:

RMS Ground Truth → observable channels → Gate / canonical authorities → NMI UnifiedManagementModel → Management Map → Relationship Intelligence.

NMI:3 does not read sealed RMS Ground Truth. `rejectSealedRmsRelationship` returns `CANONICAL_REFERENCE_MISSING` with `readsSealedRmsGroundTruth: false`.

If Nexora has not acquired the relationship through canonical channels, NMI does not know it.
