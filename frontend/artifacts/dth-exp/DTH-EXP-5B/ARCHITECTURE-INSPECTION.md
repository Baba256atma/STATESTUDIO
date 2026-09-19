# DTH-EXP:5B — Architecture inspection

## Smallest extension point

DTH-EXP:5A remains target-layout authority. 5B adds `planDthExpSceneTransition`: a **read-only semantic transition plan** between two 5A projections.

Inspected existing Stage/NOL/DTH reduced-motion and visual-role transition descriptions. 5B does not play animation and does not replace Stage. EXP:2 `describeDthExpVisualRoleTransition` remains the visual-role change description; 5B classifies continuity and motion intent.

Pipeline:

5A source projection + 5A target projection → 5B Semantic Transition Plan → later Stage renderer.

Stop. Do not start DTH-EXP:6. No playback, interpolation, or live `/executive` wiring.

## Owners preserved

DIR:1, NEX-MVP:3/4 Stage, MO Objects, NMI relationships, CC:8 Evidence, VAI, CC:11 Execution, CORE-OUT, DTH-EXP:1 Theatre Scene (unmutated).
