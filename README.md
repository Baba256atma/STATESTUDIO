# Nexora

Nexora is a system intelligence platform for exploring scenarios, understanding system behavior, and interacting with visual decision environments. It combines a FastAPI backend, a Next.js/React frontend, chat-driven interaction, and a visual scene layer to help teams reason about complex systems, pressure points, fragility, and decision outcomes across business, technical, and financial contexts.

## Core Capabilities

- Scenario exploration across business, technical, and financial systems
- Chat-driven system interaction for fast hypothesis testing and guided analysis
- Visual scene and state rendering for structural system understanding
- Decision and simulation support through fragility, risk propagation, and executive insight
- Modular full-stack architecture with separate backend and frontend layers

## Repository Structure

```text
StateStudio/
├── backend/
├── docs/
├── frontend/
├── run_nexora.sh
└── README.md
```

## Tech Stack

- FastAPI and Python for backend services and API orchestration
- Next.js, React, and TypeScript for the frontend application
- React-based visual frontend architecture with 3D scene rendering
- JSON and HTTP API-driven interaction between client and server
- Shell-based local startup workflow via `run_nexora.sh`

## Local Development

### Quick Start

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd StateStudio
   ```

2. Create the backend environment file from the template:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start the full stack:

   ```bash
   ./run_nexora.sh
   ```

This launches the backend and frontend for local development.

### Manual Startup

If you prefer to run each service separately:

#### Backend

```bash
cd backend
cp .env.example .env
./run_backend.sh dev
```

The backend starts on `http://127.0.0.1:8000` by default.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:3000` by default.

## Environment Variables

Real secrets must stay in `backend/.env`.

Use:

```bash
cp backend/.env.example backend/.env
```

The tracked example file at [backend/.env.example](/Users/bahadoors/Documents/StateStudio/backend/.env.example) provides the expected variable names and local-development defaults without including any real credentials.

## What Nexora Is

Nexora is not just:

- a dashboard
- a chatbot
- a static simulator

It is a system intelligence workspace for interactive reasoning and scenario understanding. Users can model a system, apply pressure or change, observe propagation through the model, and generate decision-oriented insight from the same environment.

## Development Principles

- Modular architecture across backend, frontend, and domain-oriented product layers
- Local-first development with a simple full-stack startup workflow
- Secure secret handling through untracked environment files
- Visual plus conversational interaction as a core product pattern
- Extensible design that supports evolving domains and decision workflows

## Current Status

Nexora is an active MVP and evolving product platform. The current repository supports a working full-stack experience built around interactive system modeling, scenario reasoning, and visual decision support, with clear room for deeper productization and expansion over time.
