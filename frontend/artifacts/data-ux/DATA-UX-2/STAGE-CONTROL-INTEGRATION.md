# DATA-UX:2 Stage Control Integration

## Control placement

`NexoraStageDataControl` is mounted in the existing Stage controls slot beside the Workspace Dial. It is a compact DOM button, not a new toolbar, WebGL overlay, or second scene.

The control provides:

- `Open Data` / `Close Data` screen-reader names;
- `aria-pressed` state;
- a visible focus style inherited from the existing button behavior;
- `data-data-rail-open` diagnostics;
- one click path into the existing Explorer state.

## Continuity contract

Opening Data changes only the Explorer presentation. Closing by the drawer control or Stage control returns attention to the Stage without clearing its object focus. Escape now closes an open Explorer before invoking the existing overview behavior.

Live proof began with Risk focused, opened the Rail, selected CSV presentation objects, and closed the Rail. The Stage remained on Risk and the Advisor continued to report `Context: Risk`. Source selection changed the diagnostic DATA_OBJECT selection only; it did not create or mutate business Focus.

## Layout

The Rail remains in the existing shell grid and uses the existing resizable drawer/safe-zone structure. Default and 1024×768 proofs showed the Stage between the Rail and Advisor with its navigation, object interactions, queue, and Data control still reachable. Queue and Objects were not removed.

