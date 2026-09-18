# NPA-T NMI:6 — Known debt

Bounded. Does not violate NMI:6 invariants.

| Debt | Description |
| --- | --- |
| A | Live `/executive` still has no hosted UnifiedManagementModel, so Map node lists are empty until a host model is supplied |
| B | Overlay map node clicks require optional `mapNodes`; production shell currently passes only Queue entries + projection anchor |
| C | NMI:7 Advisor explanations (“where is this in the map?”) not started |
| D | DIRECTOR-1:1 `directorFoundation.test.ts` file-list check uses `import.meta.dirname`, which is undefined under `npx tsx --test` (environmental; identity tests still pass) |
| E | DTH-EXP scene language not started by design |
