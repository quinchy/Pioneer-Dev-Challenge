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

Create a `.env` file in the `backend` directory (you can start from `.env.example` if present) and set:

- `PORT` (optional, default `3001`)
- `API_CODE` – shared code required on each request (must match frontend and challenge spec)
- `OPENAI_API_KEY` – OpenAI API key for message parsing
- `OPENAI_MODEL` – OpenAI model name (defaults to `gpt-4.1-mini` if not set)
- `FOURSQUARE_API_KEY` – Foursquare Places API key

Example:

```env
PORT=3001
API_CODE=pioneerdevai
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4.1-mini
FOURSQUARE_API_KEY=fsq-xxx
```

Secrets are only read from environment variables; nothing is hard-coded.

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

**Required route (per challenge spec)**

```text
GET /api/execute?message=<your_query>&code=pioneerdevai
```

**Example local request**

```bash
curl "http://localhost:3001/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now&code=pioneerdevai"
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

**What is tested**

- **Validation & parsing**
  - `execute` query schema (`message` validation)
  - OpenAI / search-parameter schema (price ranges, `min_price`/`max_price`, etc.)
  - Environment variable validation (`API_CODE`, `OPENAI_API_KEY`, `FOURSQUARE_API_KEY`, defaults)
- **Middleware**
  - `auth` middleware (validation of the `code` parameter, 401 behavior)
  - `validate` middleware (query validation and 400 error shape)
  - `error-handler` middleware (handling of `AppError` and unknown errors -> 500)
- **Utilities**
  - `AppError` behavior and structure
  - `logger` methods (info/error/warn/debug)
- **Foursquare service**
  - `findRestaurants` error handling when the Places API returns a non-OK response
  - `findRestaurants` happy-path behavior (returns parsed data from a mocked `fetch`)
- **Route-level**
  - `/api/execute` happy-path flow using mocked OpenAI and Foursquare services, asserting a `200` response with restaurant data

**Intentionally not covered**

- Full end-to-end tests against the real OpenAI or Foursquare APIs
- Broader HTTP routing beyond the `/api/execute` endpoint
- Frontend/UI behavior (covered in the frontend project, not here)

---

This project was created using `bun init` in bun v1.3.9.  
[Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

