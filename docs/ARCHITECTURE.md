# Nexora System Architecture

Nexora is a system intelligence platform for interactive system exploration and decision simulation. It combines a visual frontend, a FastAPI-based backend, and a lightweight data and memory layer to support chat-driven analysis, system state updates, fragility reasoning, and executive decision support.

## High-Level Architecture

Nexora is organized into three primary layers:

- Frontend: the visual and conversational user interface
- Backend: the system intelligence engine and orchestration layer
- Data & Memory layer: replay, memory, and persisted MVP-stage state

```text
User
  ↓
Frontend (Next.js / React)
  ↓
API Layer (FastAPI)
  ↓
System Engines
  ↓
Data / Memory / Replay
```

The frontend captures user intent and renders system state. The backend interprets input, runs analysis across multiple engines, and returns updated scene and reasoning data. The data and memory layer stores replay and contextual state for continuity and inspection.

## Frontend Layer

The frontend is the visual reasoning interface for Nexora.

Its responsibilities include:

- user interaction and domain-aware workspace entry
- visual scene rendering
- chat input and response display
- system state visualization
- object selection and interaction
- right-panel inspection for risk, memory, replay, and executive views

The current frontend stack includes:

- React
- Next.js
- TypeScript
- Three.js-based visual scene rendering through React Three Fiber
- API communication with the backend over JSON/HTTP

The frontend is not only a presentation layer. It is the workspace where the user sees system structure, submits prompts, inspects propagation, and follows the transition from system pressure to decision insight.

## Backend Layer

The backend is a FastAPI application that acts as Nexora’s system intelligence engine and orchestration layer.

Its responsibilities include:

- chat orchestration
- system analysis and interpretation
- simulation and state updates
- object and focus reasoning
- KPI state tracking
- decision context building
- response packaging for the frontend

The `/chat` endpoint is the main orchestration path in the current MVP. It receives a user message, resolves context, runs multiple internal engines, updates system state, and returns structured output including scene state, fragility, risk propagation, and decision-oriented guidance.

In addition to `/chat`, the backend includes supporting routers for replay, memory, collaboration, simulation, scenario, and related product surfaces.

## Core Engines

### Chaos Engine

The Chaos Engine interprets user input as system pressure and signal change. It helps translate a prompt into state movement, scene changes, and early system dynamics used by downstream reasoning layers.

### Memory Engine

The Memory Engine tracks evolving system context and object interactions across a user’s decision flow. It supports continuity, object-level context, and the ability to reference prior state in later analysis.

### Fragility Engine

The Fragility Engine analyzes structural weakness and instability signals in the active system. It identifies where the model is vulnerable and provides inputs for risk propagation and downstream advice.

### Strategic Reasoning Layer

The Strategic Reasoning Layer turns system behavior into actionable interpretation. It supports strategic advice, pattern recognition, opponent or pressure framing, and decision-oriented summaries.

### Object Selection Layer

The Object Selection Layer determines which system entities matter most for the current user prompt and context. It narrows attention to relevant objects so the platform can highlight the most important parts of the system visually and analytically.

## System State Model

Nexora’s core system state is represented through structured objects that move between backend analysis and frontend rendering.

Important state elements include:

- `scene_json`: the main structured scene payload used for rendering and UI analysis
- `state_vector`: normalized intensity and volatility state for the current system
- `domain_model`: domain-aware context for the active system interpretation
- `objects`: the modeled entities in the active system
- `loops`: feedback structures and loop dynamics
- `signals`: interpreted pressures or state changes that affect the system

In practice, backend engines update these structures, package them into a response payload, and send them to the frontend. The frontend then renders the updated scene and related analytical surfaces from the same shared state.

## Data and Memory

The current MVP uses a lightweight data and memory approach designed for fast iteration and local-first development.

This includes:

- replay system support
- decision memory
- event-store style services
- JSON-backed storage for MVP-stage persistence

The replay layer preserves decision frames and scene evolution. The memory layer stores contextual information that helps the system reason across interactions. JSON storage keeps the architecture simple at the MVP stage while allowing future replacement with more scalable databases or managed storage systems.

## Interaction Flow

A typical user interaction follows this path:

1. The user sends a message from the frontend chat interface.
2. The frontend sends the request to `/chat`.
3. The backend analyzes the text and resolves context.
4. Internal engines update system state, fragility, and related reasoning outputs.
5. A `scene_json` payload and related analysis structures are generated.
6. The frontend renders the updated scene, risk views, and executive insight.

This flow is the core Nexora loop: prompt, system update, propagation understanding, and decision framing.

## Design Principles

- Modular engine architecture
- Stateless API design where practical
- Visual and conversational interaction working together
- Extensible system modeling across domains
- Local-first development for the MVP stage
- Clear separation between UI, orchestration, and engine layers

## Future Evolution

The current architecture is designed to support future expansion without requiring a full rewrite.

Expected evolution paths include:

- scalable storage beyond JSON-backed MVP persistence
- distributed or more specialized simulation engines
- collaborative sessions and shared workspaces
- deeper multi-source scanning
- more advanced AI reasoning layers built on top of structured system state

The important architectural principle is continuity: Nexora should continue evolving as one shared core engine with multiple domain experiences rather than splitting into disconnected products.
