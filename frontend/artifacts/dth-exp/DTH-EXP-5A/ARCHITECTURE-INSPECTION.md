# DTH-EXP:5A — Architecture inspection

## Smallest extension point

DTH-EXP:4B composes a Theatre Scene through 3B → 3A. 5A adds `projectDthExpSpatialLayout`: a **read-only spatial projection** of that scene onto one shared normalized grammar.

Inspected existing Stage layout (STAGE-2D normalized coordinates, DTH:3 visual projection, NMI handoff that does not write coordinates). 5A does not replace Stage camera/layout authority. It produces pixel-independent scene-space suitable for later Stage consumption.

Pipeline:

Manager Intent → DIR:1 / 4A → 4B context → 3B recipe → 3A Theatre Scene → **5A spatial layout**.

Stop. Do not start DTH-EXP:5B. No interpolation, motion, or live `/executive` wiring.

## Owners preserved

DIR:1 Director, NEX-MVP:3/4 Stage, MO Objects, NMI relationships, CC:8 Evidence, VAI roles, CC:11 Execution, CORE-OUT Outcome, DTH-EXP:1 Theatre Scene (unmutated).
