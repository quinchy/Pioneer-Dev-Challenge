# Backend – Restaurant Finder

This is the TypeScript/Node backend for the Restaurant Finder challenge.  
It exposes the `GET /api/execute` endpoint used by the frontend to run natural-language restaurant searches.

---

## Setup for local development

**Prerequisites**

- Bun (v1.3+)
- Node.js / TypeScript toolchain

**Install dependencies**

```bash
cd backend
bun install
```

---

## Environment configuration

Create a `.env` file in the `backend` directory (you can start from `.env.example`) and set:

- `PORT` (optional, default `3001`)
- `API_CODE` – shared code required on each request (must match frontend and challenge spec)
- `OPENAI_API_KEY` – OpenAI API key for message parsing
- `OPENAI_MODEL` – OpenAI model name (defaults to `gpt-4.1-mini`)
- `FOURSQUARE_API_KEY` – Foursquare Places API key

Example:

```env
PORT=3001
API_CODE=pioneer
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4.1-mini
FOURSQUARE_API_KEY=fsq-xxx
```

---

## Running the backend locally

Start the HTTP server:

```bash
cd backend
bun run server.ts
```

The API will listen on `http://localhost:<PORT>` (default `http://localhost:3001`).

---

## API endpoint and how to test it

**API Route**

```text
GET /api/execute?message=<your_query>&code=pioneerdevai
```

**Example local request**

```bash
curl "http://localhost:3001/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now&code=pioneer"
```

High-level behavior:

- Validates `code` against `API_CODE` (returns `401 Unauthorized` if it does not match).
- Uses OpenAI to translate the `message` into structured Foursquare search parameters.
- Calls the Foursquare Places Search API with those parameters.
- Returns a JSON payload containing structured restaurant data (name, address, categories, etc.).

**Deployed API endpoint**

When deployed, the backend is exposed at:

- **Base URL**: `<YOUR_DEPLOYED_BACKEND_URL>`
- **Execute route**: `<YOUR_DEPLOYED_BACKEND_URL>/api/execute?message=...&code=pioneerdevai`

(Replace `<YOUR_DEPLOYED_BACKEND_URL>` with the actual deployed URL used in your submission.)

---

## Tests

**Run the test suite**

```bash
cd backend
bun run test
```

**Testing**

- **Validation of the `code` parameter**
  - `middleware/auth.test.ts` – ensures `code` must equal `API_CODE` and returns `401` when invalid.
- **Parsing / validation of structured search parameters**
  - `validation/openai.test.ts` – tests the schema for parsed search parameters (price range, sort, etc.).
  - `validation/execute.test.ts` – validates the `message` query for the `/api/execute` endpoint.
- **Backend validation and error handling**
  - `validation/env.test.ts` – validates required environment variables and defaults.
  - `middleware/validate.test.ts` – checks query validation and the 400 response shape.
  - `middleware/error-handler.test.ts` – verifies `AppError` and unknown errors produce the correct JSON error responses.
- **Foursquare result behavior**
  - `services/foursquare.service.test.ts` – covers happy-path parsing of Foursquare results and error handling when the upstream API fails.
- **Main request flow**
  - `controllers/execute.controller.test.ts` – exercises the controller that parses the message and calls the Foursquare service, asserting a `200` success response.

---

## Backend structure (high level)

- **Routes (`routes/`)**: Wire HTTP paths (e.g. `/api/execute`) to middleware and controllers, keeping framework-specific concerns (Express/router) isolated.
- **Controllers (`controllers/`)**: Contain the main request flow logic (e.g. parse message → call Foursquare → send response) without knowing about routing details.
- **Services (`services/`)**: Encapsulate external integrations and core business logic such as OpenAI parsing and Foursquare API calls, making them easier to mock and reason about.
- **Middleware (`middleware/`)**: Reusable request/response cross‑cutting concerns like auth, validation, logging, and centralized error handling; this keeps controllers and services focused on business logic.
- **Utils (`utils/`)**: Small, framework-agnostic helpers such as logging and `sendResponse` that are shared across the backend.
- **Validation (`validation/`)**: Zod schemas for environment variables, query parameters, and parsed OpenAI/Foursquare data, ensuring everything is validated before it reaches services.
- **Types (`types/`, or co-located types)**: Shared TypeScript types for structured search parameters and API responses, so controllers, services, and validation can agree on a single, type‑safe contract.
