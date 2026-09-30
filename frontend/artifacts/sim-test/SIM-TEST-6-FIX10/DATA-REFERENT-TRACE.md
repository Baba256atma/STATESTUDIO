# Data referent trace

```
"What does the production data show?"
                 │
                 ├─ intent                    CORRECT after CC:1 evidence matcher
                 ├─ canonical meaning         CORRECT after 6.1 EVIDENCE + qualifier skip
                 ├─ data phrase               "production data" (not split into Object)
                 ├─ candidate kinds           Object vs Data Source vs Domain
                 ├─ conversational referent   obj-delivery (unchanged) CORRECT
                 ├─ data/evidence source      PRODUCTION v4 Nexora-visible CORRECT
                 └─ response context          Delivery subject + evidence-bounded wording CORRECT
```

Before FIX10:

```
intent unknown / object investigation     DIVERGES_HERE (CC:1)
cue-strip "data show" → leftover production
POST:1 fuzzy part "production" ⊂ "production capacity"
→ conversational referent obj-capacity    DOWNSTREAM of kind confusion
```

After FIX10:

```
intent evidence, no object target hints   CORRECT
production + data is domain qualifier     CORRECT
compound alias requires "capacity" too    CORRECT
referent stays current subject            CORRECT
```
