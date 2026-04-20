type Listener = () => void;

const listeners = new Set<Listener>();

/** >0 while subscriber callbacks run (global debug guard uses this to break feedback loops). */
let subscriberDispatchDepth = 0;

export function getDebugSubscriberDispatchDepth(): number {
  return subscriberDispatchDepth;
}

export function subscribeDebugEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyDebugSubscribers(): void {
  subscriberDispatchDepth += 1;
  try {
    listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // Dev-only bus: never throw into product code.
      }
    });
  } finally {
    subscriberDispatchDepth -= 1;
  }
}
