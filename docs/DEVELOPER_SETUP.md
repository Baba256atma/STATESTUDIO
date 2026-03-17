# Developer Setup Guide

This guide explains how to set up Nexora for local development. It covers the backend, frontend, environment configuration, and the minimum steps required to run the platform on a development machine.

## Requirements

Before starting, make sure the following tools are installed:

- Python 3.12
- Node 20+
- Git
- npm

## Clone Repository

Clone the repository and enter the project folder:

```bash
git clone <repository-url>
cd StateStudio
```

## Backend Setup

Enter the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn main:app --reload
```

The backend will start in development mode and serve the FastAPI application locally.

## Frontend Setup

Open a new terminal, then enter the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will start locally and connect to the backend during development.

## Environment Variables

Developers should copy the example environment file before running the platform:

```bash
cp backend/.env.example backend/.env
```

The `.env.example` file provides the expected configuration structure. Real secrets or local overrides should only be stored in `.env`, which should not be committed to the repository.

## Running Nexora Locally

To run Nexora locally, both the backend and frontend must be running at the same time. The backend handles chat orchestration, simulation, and reasoning, while the frontend provides the visual and conversational workspace.

In practice, this means:

- run the FastAPI backend from `backend/`
- run the Next.js frontend from `frontend/`

If the repository startup script is available for your workflow, you can also use it to launch the platform from the project root.

## Troubleshooting

### Port already in use

If the backend or frontend fails to start because a port is already in use, stop the conflicting process or change the local port configuration before retrying.

### Missing environment variables

If the backend fails during startup or API requests behave unexpectedly, confirm that `backend/.env` exists and includes the required values copied from `backend/.env.example`.
