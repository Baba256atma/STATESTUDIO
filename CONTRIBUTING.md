# Contributing to Nexora

Thank you for your interest in contributing to Nexora. This project aims to maintain clean architecture, high-quality code, and a product experience that stays coherent as the platform evolves. Contributions are welcome across backend, frontend, documentation, and system design improvements.

## Development Setup

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project folder:

```bash
cd StateStudio
```

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Run the platform:

```bash
./run_nexora.sh
```

This startup script launches the backend and frontend for local development.

## Project Structure

- `backend/` → FastAPI backend, orchestration logic, and system engines
- `frontend/` → visual interface, scene rendering, and user interaction
- `docs/` → architecture, product, and platform documentation

## Contribution Workflow

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request

Example branch names:

- `feature/new-engine`
- `fix/chat-endpoint`
- `docs/update-architecture`

## Coding Guidelines

- Keep modules small and focused
- Avoid breaking public APIs without clear reason
- Prefer clear, descriptive naming
- Document complex logic where needed
- Maintain readability over cleverness
- Preserve the separation between shared core logic and product-layer wiring

## Pull Request Guidelines

Pull requests should explain the change clearly and keep scope disciplined. If there is a related issue, reference it in the PR description.

Try to avoid mixing unrelated changes in the same pull request. Small, focused contributions are easier to review and safer to merge.

## Reporting Issues

When reporting an issue, include:

- a clear description of the problem
- reproduction steps
- expected behavior
- relevant screenshots, logs, or request details when helpful

The more concrete the report, the easier it is to diagnose and fix.

## Development Philosophy

- Modular architecture
- Clarity over complexity
- Systems thinking in product and code
- Extensible design for future growth
- Visual and conversational interaction working together
