# Material Manufacturing clarification events (post-FIX6)

| Origin | Target / reason | Resolution | Result |
| --- | --- | --- | --- |
| T12 option A | missing subject | T13 option B commit | CLOSE |
| T32 Supplier | unknown named return | T34 Capacity return | CLOSE (FIX3-compatible) |
| T68 Schedule | unknown named | T70 Capacity focus | CLOSE |
| T69 Supplier | unknown named re-enter | T70 | KEEP then CLOSE — FIX3 preserved |
| T72 Capacity Theatre | unknown | T73 evidence | CLOSE |
| T77 show alternatives | collection show | T78 compare | CLOSE |
| T81–T83 | — | — | **no CREATE** (repaired) |

No resurrection of T81 pending after repair. T77 collection clarification still occurs once and is superseded by comparison.
