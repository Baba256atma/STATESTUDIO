# NPA-T NMI:6 — Management Map → Stage

Selecting a map node (for example Problems & Risks → Capacity Gap):

1. Does not mutate `UnifiedManagementModel`.
2. Composes projection with `source: MANAGEMENT_MAP`.
3. Hands the **anchor ID** to the existing Stage writer.

The map list remains available for navigation (overlay Map mode). Live `/executive` still lacks a hosted UnifiedManagementModel for live node counts (debt).
