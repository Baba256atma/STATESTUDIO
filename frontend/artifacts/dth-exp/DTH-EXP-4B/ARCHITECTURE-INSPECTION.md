# DTH-EXP:4B — Architecture inspection

## Smallest extension point

DTH-EXP:4A `selectNexoraDirectorNexoFamily` remains the family selector. DIR:1 remains the only Director.

4B adds `composeNexoraDirectorSceneContext`: read the existing canonical graph and select **minimum relevant** Objects, relationships, Evidence refs, and analytical bindings for the selected family, then feed:

4A selection + 4B context → DTH-EXP:3B `defineNexo*Recipe` → DTH-EXP:3A `resolveDthExpSceneRecipe` / `resolveNexoFamilyRecipe` → Theatre Scene.

Stop. Do not start DTH-EXP:5. Do not render, animate, or wire `/executive`.

## Owners preserved

MO/NEX-MVP:4 Objects, NMI relationships, CC:8 Evidence, VAI:1–8 roles, CC:10/11 Decision/Execution, CORE-OUT Outcome/Learning, DTH-EXP:2 actor resolution, DTH-EXP:1 Theatre Scene, NEX-MVP:3/4 Stage, DIR:1.

NMI supplies the management graph. DIR:1/4B selects scene relevance. 4B is not a second Management Map or Scene store.
