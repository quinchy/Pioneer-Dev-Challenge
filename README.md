## Restaurant Finder – Full Stack Challenge

This repository contains both the **backend API** and **frontend UI** for the Restaurant Finder coding challenge.

At a high level:

- The **backend** exposes the required `GET /api/execute?message=<your_query>&code=pioneerdevai` endpoint, validates input, calls Foursquare, and returns clean JSON.
- The **frontend** provides a simple but intentional UI that lets users type a natural‑language request, shows loading and error states, and displays restaurant results.

The sections below explain how to set up the project locally, configure environment variables, run the apps, and where to find more detailed docs.

---

## Deployed URLs

- **Frontend (UI)**: `https://pioneer-dev-challenge.vercel.app/`
- **Backend (API)**: `https://pioneer-dev-challenge-backend.vercel.app`

The frontend in production is configured to call the deployed backend API.

---

## Local development – quick start

### Prerequisites

- **Bun** (used to run and test both apps)
- **Node.js** (for TypeScript/Next.js toolchain)
- Foursquare API key (for the backend, see backend README for details)

### 1. Clone the repo

```bash
git clone https://github.com/quinchy/Pioneer-Dev-Challenge.git
cd pioneer-dev-challenge
```

### 2. Configure environment variables

You need to configure **both backend and frontend** environments.

#### Backend (`./backend`)

Copy the example file and fill in real values where needed:

```bash
cd backend
cp .env.example .env
```

`backend/.env.example` contains:

```env
PORT=3001                 # optional; defaults to 3001 if omitted
API_CODE=pioneerdevai     # must match the challenge spec and frontend code
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini # optional; default is gpt-4.1-mini
FOURSQUARE_API_KEY=your-foursquare-api-key
CORS_ORIGIN=http://localhost:3000
```

Key points:

- `API_CODE` **must** be `pioneerdevai` to satisfy the challenge contract.
- `PORT` defaults to `3001` if not set; the frontend expects the backend at `http://localhost:3001` in local development.
- Secrets (OpenAI/Foursquare keys) are **only** read from the environment.

See `backend/README.md` for more detail.

#### Frontend (`./frontend`)

In a separate shell:

```bash
cd frontend
cp .env.example .env
```

`frontend/.env.example` contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_CODE=pioneerdevai
```

Key points:

- `NEXT_PUBLIC_API_URL` must point to the backend base URL:
  - `http://localhost:3001` for local dev.
  - `https://pioneer-dev-challenge-backend.vercel.app` for the deployed environment.
- `NEXT_PUBLIC_API_CODE` **must** match the backend’s `API_CODE` (`pioneerdevai`).

See `frontend/README.md` for more detail.

---

## Install dependencies

From the repo root, install dependencies for both apps:

```bash
cd backend
bun install

cd ../frontend
bun install
```

You only need to run this once (or whenever dependencies change).

---

## Running the apps locally

You’ll typically run **backend** and **frontend** in parallel.

### 1. Start the backend API

```bash
cd backend
bun run dev
```

By default this starts the API on `http://localhost:3001`.

The primary route used by the frontend (and for manual testing) is:

```text
GET /api/execute?message=<your_query>&code=pioneerdevai
```

For more details on the backend behavior and API contract, see `backend/README.md`.

### 2. Start the frontend UI

In another terminal:

```bash
cd frontend
bun dev
```

This starts the Next.js dev server at:

- `http://localhost:3000`

The frontend reads:

- `NEXT_PUBLIC_API_URL` to know where the backend lives (`http://localhost:3001`).
- `NEXT_PUBLIC_API_CODE` to send the required `code=pioneerdevai` query parameter.

---

## How to run tests

### Backend tests

From the backend directory:

```bash
cd backend
bun run test
```

The backend test suite covers:

- Validation of the `code` parameter.
- Parsing/validation of structured search parameters (OpenAI schema).
- Environment variable validation.
- Error handling for invalid input and upstream API failures.
- Foursquare service behavior.

See `backend/README.md` for a concise list of what is tested and what is intentionally left out.

### Frontend tests

The challenge only **requires** automated tests for backend logic and important parsing/validation/transformation steps.  
Accordingly, the frontend does not ship its own automated test suite; instead, backend tests are the focus.

---

## Production build and start (optional)

If you want to simulate a production environment locally:

### Backend

You can continue using `bun run dev` for local testing; deployment to Vercel (or another host) will use its own build process.

### Frontend

```bash
cd frontend
bun run build
bun run start
```

This will start the optimized Next.js production server on the configured port (default `3000`).

---

## How to test the API endpoint

For detailed examples and explanation, see **`backend/README.md`**, which documents:

- Exact endpoint contract (`/api/execute`).
- How to hit it locally with `curl`.
- How it behaves on success and error (including JSON shapes).

In short, with backend running locally:

```bash
curl "http://localhost:3001/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now&code=pioneerdevai"
```

For the deployed backend:

```bash
curl "https://pioneer-dev-challenge-backend.vercel.app/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now&code=pioneerdevai"
```

---

## Assumptions, tradeoffs, and limitations

- **Backend as the single gateway**  
  The frontend never calls Foursquare directly. All external traffic goes through the backend, which validates input, normalizes JSON, and handles upstream failures.

- **Code gate**  
  The `code` query param is a lightweight gate (not full auth). It’s configurable via env (`API_CODE` / `NEXT_PUBLIC_API_CODE`) but expected to be `pioneerdevai` for this challenge.

- **Scope**  
  I only implemented the `/api/execute` flow; anything beyond that is intentionally out of scope.

- **Frontend tests**  
  Because the challenge emphasizes backend tests, I concentrated automated tests there and kept the frontend tests out of scope.
