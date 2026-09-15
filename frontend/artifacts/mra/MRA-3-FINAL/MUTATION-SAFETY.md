# Mutation safety

| Path | Result |
| --- | --- |
| `Add this as a Risk.` | Clarifies which item; no silent write |
| Correction / topic change / `yes` | No invalid write (CC:5 J9, LONG T44–T46, live mutation) |
| `Add Supplier Delay as a Risk.` + `yes` | Writes named Risk after confirmation |
| `delete Margin Pressure` | REMOVE proposed; no certified delete writer; **does not become Add** |
| `cancel` | Won’t add |

Intent → typed proposal → explicit confirmation → canonical writer. Stale `yes` after SHOW Problems did not confirm the unnamed Risk proposal.
